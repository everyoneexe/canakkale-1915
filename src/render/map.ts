import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from 'pixi.js';
import type { FederatedPointerEvent } from 'pixi.js';
import type { GameState, Province, ProvinceId, Side, Vec2 } from '../core/types.ts';
import {
  dist,
  gameMap,
  mapKind,
  metaOf,
  prov,
  provinceAt,
  provinces,
  reliefBox,
} from '../core/geo.ts';
import { C, LAYER } from '../style/tokens.ts';
import { fortRange, liveShips } from '../engine/naval.ts';
import { TERRAINS } from '../data/units.ts';
import { TerrainTiles, zscale } from './tiles.ts';

/**
 * Harita çizimi — @destanevreni'nin animasyonundaki görsel dil:
 * siyah zemin, neredeyse siyah lacivert deniz, haki kara, amber kıyı çizgisi,
 * mono büyük harf etiketler, kırmızı mayın noktaları, mavi-gri gemi işaretleri.
 *
 * ÖLÇEK NOTU: Çanakkale haritasında 47 il vardı ve her karede bütün çokgenleri
 * yeniden kurmak bedavaydı. Dünya haritasında 4.575 il var; aynı yaklaşım
 * karede ~115 bin köşe yeniden inşası demek ve kare hızı çöküyor. Bu yüzden
 * il geometrisi BİR KEZ kurulur, her karede yalnızca `tint`/`alpha`/`visible`
 * güncellenir.
 */

export type MapMode = 'siyasi' | 'arazi' | 'tedarik' | 'deniz' | 'mayin';

export const MAP_MODES: readonly { id: MapMode; label: string }[] = [
  { id: 'siyasi', label: 'SİYASİ' },
  { id: 'arazi', label: 'ARAZİ' },
  { id: 'tedarik', label: 'İKMAL' },
  { id: 'deniz', label: 'DENİZ' },
  { id: 'mayin', label: 'MAYIN' },
];

export interface Selection {
  kind: 'il' | 'birlik' | 'filo' | 'tabya';
  id: string;
}

export interface MapCallbacks {
  onSelect(sel: Selection | null): void;
  onHover(sel: Selection | null, screen: { x: number; y: number }): void;
  onTarget(province: ProvinceId): void;
}

const LABEL_STYLE = new TextStyle({
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 11,
  fontWeight: '500',
  fill: C.text,
  letterSpacing: 2.2,
});

const LABEL_MINOR = new TextStyle({
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 9,
  fill: C.textDim,
  letterSpacing: 1.6,
});

const COUNTER_STYLE = new TextStyle({
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 9,
  fontWeight: '700',
  fill: C.text,
  letterSpacing: 0.4,
});

/** Ekranda aynı anda gösterilecek azami etiket — fazlası okunmaz hâle geliyor. */
const MAX_LABELS = 130;
/** Aynı anda çizilecek azami birlik sayacı. */
const MAX_COUNTERS = 90;

interface ProvinceNode {
  readonly province: Province;
  readonly fill: Graphics;
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export class MapView {
  readonly app = new Application();

  private world = new Container();
  private gBackdrop = new Graphics();
  private gRelief = new Container();
  private gFillLayer = new Container();
  private gBorders = new Graphics();
  private gCoast = new Graphics();
  private gHighlight = new Graphics();
  private gMines = new Graphics();
  private gForts = new Graphics();
  private gPaths = new Graphics();
  private gUnits = new Container();
  private gLabels = new Container();
  /** MAYIN modundaki hat etiketleri; yeniden kullanılır. */
  private mineText: Text[] = [];

  private nodes: ProvinceNode[] = [];
  private labelPool: Text[] = [];
  private counterPool: Container[] = [];

  mode: MapMode = 'siyasi';
  selection: Selection | null = null;
  targeting = false;
  validTargets: ReadonlySet<ProvinceId> = new Set();

  private state: GameState | null = null;
  private cb: MapCallbacks;
  private zoom = 1;
  /** Açılış kadrajındaki yakınlaştırma — zoom sınırları buna göre. */
  private fitZoom = 1;
  /** Tiyatronun arkasındaki statik dünya kademeleri. */
  private gWorld = new Container();
  /** Derin yakınlaştırmada canlı indirilen arazi; yalnız Çanakkale'de. */
  private tiles: TerrainTiles | null = null;
  private panX = 0;
  private panY = 0;
  private hovered: ProvinceId | null = null;
  private dragging = false;
  private dragFrom = { x: 0, y: 0 };
  private dragMoved = 0;

  // ── Hareket ───────────────────────────────────────────────────────
  /** Kamera hedefi; her kare mevcut değere doğru yumuşatılır. */
  private camTarget: { x: number; y: number; zoom: number } | null = null;
  /** Süreli uçuş (açılış dalışı). */
  private flight: {
    fromX: number; fromY: number; fromZoom: number;
    toX: number; toY: number; toZoom: number;
    t0: number; ms: number;
  } | null = null;
  /** İl dolgularının hedef rengi/saydamlığı — mod değişiminde çapraz geçiş. */
  private fillTarget = new Map<ProvinceId, { colour: number; alpha: number }>();
  private fillNow = new Map<ProvinceId, { colour: number; alpha: number }>();
  /** Birlik sayaçlarının yumuşatılmış ekran konumu (il değişince kayar). */
  private counterPos = new Map<string, { x: number; y: number }>();
  /** Muharebe parlaması: il -> kalan süre (0..1). */
  private flash = new Map<ProvinceId, number>();
  private lastFrame = 0;
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(cb: MapCallbacks) {
    this.cb = cb;
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas,
      antialias: true,
      backgroundColor: C.void,
      resolution: Math.min(2, window.devicePixelRatio || 1),
      autoDensity: true,
      resizeTo: window,
      preference: 'webgl',
    });

    this.gBackdrop.zIndex = LAYER.relief - 1;
    this.gRelief.zIndex = LAYER.relief;
    this.gFillLayer.zIndex = LAYER.provinceFill;
    this.gBorders.zIndex = LAYER.provinceEdge;
    this.gCoast.zIndex = LAYER.coast;
    this.gHighlight.zIndex = LAYER.coast + 1;
    this.gMines.zIndex = LAYER.minefield;
    this.gForts.zIndex = LAYER.fort;
    this.gPaths.zIndex = LAYER.path;
    this.gUnits.zIndex = LAYER.unit;
    this.gLabels.zIndex = LAYER.label;

    this.world.sortableChildren = true;
    this.world.addChild(
      this.gBackdrop,
      this.gRelief,
      this.gFillLayer,
      this.gBorders,
      this.gCoast,
      this.gHighlight,
      this.gMines,
      this.gForts,
      this.gPaths,
      this.gUnits,
      this.gLabels,
    );
    this.app.stage.addChild(this.world);

    this.bindInput(canvas);
    window.addEventListener('resize', () => this.fitToMap(true));

    // Pixi'nin kendi tickerı kareyi sürer; animasyon burada ilerletilir.
    this.app.ticker.add(() => this.tick());
  }

  /** Harita değiştiğinde çağrılır: geometriyi baştan kurar. */
  async buildMap(): Promise<void> {
    this.gRelief.removeChildren();
    this.gFillLayer.removeChildren();
    this.gLabels.removeChildren();
    this.mineText = [];
    this.gUnits.removeChildren();
    this.labelPool = [];
    this.counterPool = [];
    this.nodes = [];

    const b = gameMap().bounds;
    const pad = Math.max(b.maxX - b.minX, b.maxY - b.minY);
    this.gBackdrop
      .clear()
      .rect(b.minX - pad, b.minY - pad, b.maxX - b.minX + pad * 2, b.maxY - b.minY + pad * 2)
      .fill({ color: C.sea });

    await this.loadRelief();
    this.buildProvinceGeometry();
    this.buildCoast();
    this.fitToMap();
  }

  /**
   * Rölyef dokusu. Dünya haritası ÖN GÖLGELENDİRİLMİŞ gelir (Python'da
   * boyanıp WebP olarak paketlendi) — tarayıcıda 7,6 milyon pikseli tek tek
   * boyamak saniyeler sürüyordu. Çanakkale haritası ham yükseklik taşır ve
   * burada boyanır; küçük olduğu için maliyeti önemsiz.
   */
  private async loadRelief(): Promise<void> {
    const box = reliefBox();
    const tex: Texture = await Assets.load(box.image);
    let source: Texture = tex;

    if (!box.preshaded) {
      const w = box.width;
      const h = box.height;
      const cv = document.createElement('canvas');
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(tex.source.resource as CanvasImageSource, 0, 0, w, h);
      const img = ctx.getImageData(0, 0, w, h);
      const d = img.data;
      const elev = new Float32Array(w * h);
      const land = new Float32Array(w * h);
      for (let i = 0, px = 0; i < d.length; i += 4, px++) {
        elev[px] = d[i]! * 256 + d[i + 1]! - 1000;
        land[px] = d[i + 2]! / 255;
      }
      // Dünya kademeleriyle BİREBİR aynı dil: aynı ışık yönü, aynı yükseklik
      // rampası, aynı deniz derinliği. Daha önce burası kendi sabitlerini
      // (yükseklik/500, ×0,78) kullanıyordu ve tiyatro, çevresindeki LOD
      // dokusunun ortasında koyu bir dikdörtgen olarak duruyordu.
      //
      // Gölge sertliği `tiles.ts:zscale` ile aynı yasaya tabi — akan karo
      // katmanıyla parlaklık dikişi olmasın.
      const mppX = (box.maxX - box.minX) / w;
      const mppY = (box.maxY - box.minY) / h;
      // `zscale` derece ızgarası varsayar; tiyatro ızgarası metre cinsinden.
      // Çevrim: px/derece = (derece başına metre) / (piksel başına metre).
      const coslat = Math.cos((gameMap().origin.lat * Math.PI) / 180);
      const kxBox = coslat * 111320;
      const zs = zscale(kxBox / mppX);
      // Eşit metreli ızgarada boylam yönünde derece başına piksel enlemdekinin
      // cos(enlem) katı; y gradyanı bu oranla hizalanır.
      const yAdj = (kxBox * mppY) / (mppX * 110574);
      const SUN = { x: -0.72, y: -0.6, z: 0.35 };
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const px = y * w + x;
          const i = px * 4;
          const e = elev[px]!;
          // Merkezî fark — np.gradient ile aynı.
          const gx =
            (elev[x < w - 1 ? px + 1 : px]! - elev[x > 0 ? px - 1 : px]!) /
            (x > 0 && x < w - 1 ? 2 : 1);
          const gy =
            (elev[y < h - 1 ? px + w : px]! - elev[y > 0 ? px - w : px]!) /
            (y > 0 && y < h - 1 ? 2 : 1);
          const dx = (gx * zs) / coslat;
          const dy = gy * zs * yAdj;
          const ln = Math.sqrt(dx * dx + dy * dy + 1);
          const shade = Math.max(
            0.42,
            Math.min(1.55, ((-dx * SUN.x - dy * SUN.y + SUN.z) / ln) * 2.0),
          );
          const t = Math.min(1, Math.max(0, e) / 3200) ** 0.72;
          const depth = Math.min(1, Math.max(0, -Math.min(e, 0)) / 6000);
          const a = land[px]!;
          const mix = (lv: number, sv: number) =>
            Math.round(Math.min(255, Math.max(0, lv * a + sv * (1 - a))));
          d[i] = mix((26 + t * 61) * shade * 0.8, 9 - depth * 6);
          d[i + 1] = mix((22 + t * 43) * shade * 0.8, 16 - depth * 9);
          d[i + 2] = mix((16 + t * 11) * shade * 0.82, 28 - depth * 13);
          d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      source = Texture.from(cv);
    }

    // ── Dünya zemini ────────────────────────────────────────────────
    // Tiyatro rölyefi yalnız indirilen kutuyu kaplıyor; arkasına dünya
    // dokusu serilmezse kenarında haritanın bittiği keskin bir dikdörtgen
    // kalıyor. Bu doku 11 px/derece (~10 km/piksel) — sadece zemin. Asıl
    // çözünürlük `TerrainTiles` ile canlı gelir.
    if (mapKind() === 'canakkale') {
      const o = gameMap().origin;
      const kx = Math.cos((o.lat * Math.PI) / 180) * 111320;
      const ky = 110574;
      const back = new Sprite((await Assets.load('world-relief.webp')) as Texture);
      back.x = (-180 - o.lon) * kx;
      back.y = -(82 - o.lat) * ky;
      back.width = 360 * kx;
      back.height = 164 * ky;
      this.gWorld.addChild(back);
      this.gRelief.addChild(this.gWorld);
    }

    const sprite = new Sprite(source);
    sprite.x = box.minX;
    sprite.y = box.minY;
    sprite.width = box.maxX - box.minX;
    sprite.height = box.maxY - box.minY;
    this.gRelief.addChild(sprite);

    // Akan katman EN ÜSTTE — tiyatro rölyefinin de üstünde. Tiyatro dokusu
    // 29 m/piksel, akan terrarium karoları 11 m/piksel: azami yakınlıkta
    // oyun alanı, çevresindeki akan araziden daha bulanık kalıyordu. LOD
    // sözleşmesi tek: en ince veri kazanır. Zemin dokusunun üstüne çıkar
    // çıkmaz devreye girer, altında kendini temizler.
    if (mapKind() === 'canakkale') {
      this.tiles = new TerrainTiles(this.gRelief, gameMap().origin);
      this.streamTerrain();
    }
  }

  /**
   * İl dolguları ve sınırları BİR KEZ kurulur. Dolgular beyaz çizilir;
   * harita moduna göre her karede yalnızca `tint` ve `alpha` değişir.
   */
  private buildProvinceGeometry(): void {
    const list = provinces();
    const hairline = (gameMap().bounds.maxX - gameMap().bounds.minX) / 4000;

    this.gBorders.clear();
    for (const p of list) {
      if (p.polygon.length < 3) continue;
      const pts: number[] = [];
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const v of p.polygon) {
        pts.push(v.x, v.y);
        if (v.x < minX) minX = v.x;
        if (v.y < minY) minY = v.y;
        if (v.x > maxX) maxX = v.x;
        if (v.y > maxY) maxY = v.y;
      }

      const g = new Graphics();
      g.poly(pts).fill({ color: 0xffffff });
      g.eventMode = 'none';
      this.gFillLayer.addChild(g);
      this.nodes.push({ province: p, fill: g, minX, minY, maxX, maxY });

      if (!p.isSea) {
        this.gBorders.poly(pts, true).stroke({
          width: hairline,
          color: C.accentDim,
          alpha: 0.5,
        });
      }
    }
  }

  private buildCoast(): void {
    this.gCoast.clear();
    const rings = gameMap().coastRings;
    if (rings.length === 0) return;
    const w = Math.max(60, 1.5 / this.zoom);
    for (const ring of rings) {
      if (ring.length < 3) continue;
      const pts: number[] = [];
      for (const v of ring) pts.push(v.x, v.y);
      this.gCoast.poly(pts, true).stroke({ width: w * 2.6, color: C.coast, alpha: 0.16 });
      this.gCoast.poly(pts, true).stroke({ width: w, color: C.coast, alpha: 0.95 });
    }
  }

  // ───────────────────────────────────────────────── görünüm / girdi ──

  private theatreBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    if (mapKind() === 'dunya') {
      // gameMap().bounds TÜM dünyayı verir. Cephe senaryosunda harita zaten
      // bbox'a kırpılmış durumda; kadraj YÜKLÜ illerden hesaplanmalı, yoksa
      // Doğu Cephesi dünyanın ortasında minik bir leke olarak açılıyor.
      let a = Infinity;
      let b = Infinity;
      let c = -Infinity;
      let d = -Infinity;
      for (const p of provinces()) {
        if (p.isSea) continue;
        for (const v of p.polygon) {
          if (v.x < a) a = v.x;
          if (v.y < b) b = v.y;
          if (v.x > c) c = v.x;
          if (v.y > d) d = v.y;
        }
      }
      if (a === Infinity) return gameMap().bounds;
      const px = (c - a) * 0.05;
      const py = (d - b) * 0.05;
      return { minX: a - px, minY: b - py, maxX: c + px, maxY: d + py };
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of provinces()) {
      if (OUT_OF_FRAME.has(p.id)) continue;
      if (p.victoryPoints === 0 && p.supplyHub === 0) continue;
      for (const v of p.polygon) {
        if (v.x < minX) minX = v.x;
        if (v.y < minY) minY = v.y;
        if (v.x > maxX) maxX = v.x;
        if (v.y > maxY) maxY = v.y;
      }
    }
    const padX = (maxX - minX) * 0.06;
    const padY = (maxY - minY) * 0.06;
    return { minX: minX - padX, minY: minY - padY, maxX: maxX + padX, maxY: maxY + padY };
  }

  private fitToMap(keepZoom = false): void {
    const b = this.theatreBox();
    const sw = this.app.screen.width;
    const sh = this.app.screen.height;
    const fit = Math.min((sw - 520) / (b.maxX - b.minX), (sh - 110) / (b.maxY - b.minY));
    this.fitZoom = fit;
    if (!keepZoom) this.zoom = fit;
    this.panX = (sw - 340) / 2 + 150 - ((b.minX + b.maxX) / 2) * this.zoom;
    this.panY = (sh + 62) / 2 - ((b.minY + b.maxY) / 2) * this.zoom;
    this.applyTransform();
  }

  private applyTransform(): void {
    this.world.scale.set(this.zoom);
    this.world.position.set(this.panX, this.panY);
    this.streamTerrain();
  }

  /**
   * Görünen pencereyi karo akışına bildirir.
   *
   * Statik kademeler en çok 364 px/derece veriyor; derin yakınlaştırmada
   * tükeniyor ve arazi bulanık bir lekeye dönüşüyordu. `TerrainTiles` bu
   * noktadan sonra devreye girip pencereyi canlı indirir. Çağrı her karede
   * gelebilir: içeride durulma beklenir.
   */
  private streamTerrain(): void {
    const t = this.tiles;
    if (!t) return;
    const o = gameMap().origin;
    const kx = Math.cos((o.lat * Math.PI) / 180) * 111320;
    const ky = 110574;
    const a = this.toWorld(0, 0);
    const b = this.toWorld(this.app.screen.width, this.app.screen.height);
    t.request(
      {
        west: o.lon + a.x / kx,
        east: o.lon + b.x / kx,
        north: o.lat - a.y / ky,
        south: o.lat - b.y / ky,
      },
      // Ekranda boylam derecesi başına piksel.
      this.zoom * kx,
    );
  }

  private toWorld(sx: number, sy: number): Vec2 {
    return { x: (sx - this.panX) / this.zoom, y: (sy - this.panY) / this.zoom };
  }

  private bindInput(canvas: HTMLCanvasElement): void {
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = { contains: () => true };

    canvas.addEventListener(
      'wheel',
      (e) => {
        if (!this.state) return;
        e.preventDefault();
        const before = this.toWorld(e.offsetX, e.offsetY);
        const k = Math.exp(-e.deltaY * 0.0014);
        // Aşağı sınır bol: oyuncu geriye çekilip tiyatronun dünyadaki
        // yerini görebilmeli.
        const lo = this.fitZoom * 0.04;
        // Üst sınır VERİYE bağlı. fit×42 ≈ 2 m/ekran pikseli demekti;
        // tiyatro dokusu 29 m/px, akan terrarium karoları en iyi 11 m/px.
        // O yakınlıkta her katman bulanık bir lekeydi. fit×12 ≈ 7 m/px:
        // tiyatro ~4 kat, akan karo ~1,6 kat büyütülür — ikisi de okunur.
        const hi = this.fitZoom * 12;
        this.zoom = Math.min(hi, Math.max(lo, this.zoom * k));
        const after = this.toWorld(e.offsetX, e.offsetY);
        this.panX += (after.x - before.x) * this.zoom;
        this.panY += (after.y - before.y) * this.zoom;
        this.applyTransform();
        this.draw();
      },
      { passive: false }
    );

    this.app.stage.on('pointerdown', (e: FederatedPointerEvent) => {
      if (!this.state) return;
      this.dragging = true;
      this.dragMoved = 0;
      this.dragFrom = { x: e.global.x, y: e.global.y };
    });
    this.app.stage.on('pointerup', (e: FederatedPointerEvent) => {
      this.dragging = false;
      if (!this.state || this.dragMoved > 6) return;
      this.handleClick(e.global.x, e.global.y);
    });
    this.app.stage.on('pointerupoutside', () => {
      this.dragging = false;
    });
    this.app.stage.on('globalpointermove', (e: FederatedPointerEvent) => {
      // Küre ekranı açıkken harita yüklü değil; Pixi sahnesi yine de olay
      // alıyor ve provinceAt() "harita yüklenmedi" diye patlıyordu.
      if (!this.state) return;
      if (this.dragging) {
        const dx = e.global.x - this.dragFrom.x;
        const dy = e.global.y - this.dragFrom.y;
        this.dragMoved += Math.abs(dx) + Math.abs(dy);
        this.panX += dx;
        this.panY += dy;
        this.dragFrom = { x: e.global.x, y: e.global.y };
        this.applyTransform();
        return;
      }
      const p = provinceAt(this.toWorld(e.global.x, e.global.y));
      if (p?.id !== this.hovered) {
        this.hovered = p?.id ?? null;
        this.drawHighlight();
      }
      this.cb.onHover(p ? { kind: 'il', id: p.id } : null, { x: e.global.x, y: e.global.y });
    });
  }

  private handleClick(sx: number, sy: number): void {
    const p = provinceAt(this.toWorld(sx, sy));
    if (!p) {
      this.cb.onSelect(null);
      return;
    }
    if (this.targeting) {
      this.cb.onTarget(p.id);
      return;
    }
    const st = this.state;
    if (st) {
      const unit = Object.values(st.landUnits).find(
        (u) => u.location === p.id && !u.embarkedIn && u.strength > 0 && u.side === st.playerSide,
      );
      if (unit) {
        this.cb.onSelect({ kind: 'birlik', id: unit.id });
        return;
      }
      const fleet = Object.values(st.fleets).find(
        (f) => f.location === p.id && f.side === st.playerSide && liveShips(f).length > 0,
      );
      if (fleet) {
        this.cb.onSelect({ kind: 'filo', id: fleet.id });
        return;
      }
    }
    this.cb.onSelect({ kind: 'il', id: p.id });
  }

  /** Hata ayıklama: dolgu katmanının gerçekten çizilip çizilmediğini gör. */
  debugInfo(): Record<string, unknown> {
    const sample = this.nodes[Math.floor(this.nodes.length / 2)];
    return {
      dugum: this.nodes.length,
      dolguCocuk: this.gFillLayer.children.length,
      dolguGorunur: this.gFillLayer.visible,
      dolguAlpha: this.gFillLayer.alpha,
      zIndex: this.gFillLayer.zIndex,
      ornek: sample
        ? {
            id: sample.province.id,
            visible: sample.fill.visible,
            tint: sample.fill.tint,
            alpha: sample.fill.alpha,
            bounds: [sample.minX, sample.minY, sample.maxX, sample.maxY],
          }
        : null,
      zoom: this.zoom,
      pan: [this.panX, this.panY],
    };
  }

  setState(s: GameState): void {
    this.state = s;
    this.draw();
  }

  /**
   * Harita değişmeden önce çağrılır. Eski oyun durumu YENİ haritayla
   * çizilirse `prov()` eski il kimliklerinde patlıyor; durum boşaltılıp
   * dinamik katmanlar temizlenir.
   */
  clearState(): void {
    this.state = null;
    this.counterPos.clear();
    this.fillNow.clear();
    this.fillTarget.clear();
    this.flash.clear();
    this.selection = null;
    this.hovered = null;
    this.targeting = false;
    this.validTargets = new Set();
    this.gMines.clear();
    this.gForts.clear();
    this.gPaths.clear();
    this.gHighlight.clear();
    for (const c of this.counterPool) c.visible = false;
    for (const l of this.labelPool) l.visible = false;
  }

  /**
   * Kamerayı anında bir ile kilitle — animasyonsuz.
   * `introSweep` hedefini MEVCUT pan/zoom'dan okuduğu için odaklama ondan
   * ÖNCE ve animasyonsuz yapılmalı. Aksi hâlde `centreOn` uçuş sırasındaki
   * minik zoom'u hedef alıp kamerayı geri dışarı çekiyor.
   */
  focusInstant(id: ProvinceId): void {
    const c = prov(id).center;
    this.camTarget = null;
    this.flight = null;
    this.panX = this.app.screen.width / 2 - c.x * this.zoom;
    this.panY = this.app.screen.height / 2 - c.y * this.zoom;
    this.applyTransform();
  }

  centreOn(id: ProvinceId, zoom = this.zoom): void {
    const c = prov(id).center;
    this.glideTo(
      this.app.screen.width / 2 - c.x * zoom,
      this.app.screen.height / 2 - c.y * zoom,
      zoom,
    );
  }

  /**
   * Açılışta kadraj biraz uzaktan alınıp içeri süzülür.
   * Ekran MERKEZİ sabit kalacak şekilde ölçeklenir; aksi hâlde pan değeri
   * kadrajın dışına fırlıyor ve ilk kare tamamen boş çiziliyordu.
   */
  introSweep(): void {
    if (this.reduced) return;
    const tx = this.panX;
    const ty = this.panY;
    const tz = this.zoom;
    // Çok geniş bir görüşten başla (çevredeki dünya görünür) ve tiyatroya uç.
    const k = 0.1;
    const cx = this.app.screen.width / 2;
    const cy = this.app.screen.height / 2;
    this.zoom = tz * k;
    this.panX = cx + (tx - cx) * k;
    this.panY = cy + (ty - cy) * k;
    this.applyTransform();
    this.flyTo(tx, ty, tz, 1500);
  }

  /** Bu illerde muharebe oldu — kısa bir parlama göster. */
  flashCombat(ids: readonly ProvinceId[]): void {
    for (const id of ids) this.flash.set(id, 1);
  }

  /**
   * Kare güncellemesi. Yalnız YUMUŞATMA yapar; ağır yeniden hesap `draw()`
   * içinde ve sadece durum değişince olur.
   *
   * Zaman tabanlı üstel yumuşatma kullanılır (kare sayısı tabanlı değil):
   * 144 Hz ekranda animasyon iki kat hızlanmasın diye.
   */
  private tick(): void {
    const now = performance.now();
    const dt = Math.min(64, now - (this.lastFrame || now));
    this.lastFrame = now;
    if (dt <= 0) return;

    let dirty = false;
    let camMoved = false;

    // Süreli uçuş önceliklidir.
    if (this.flight) {
      const f = this.flight;
      const u = Math.min(1, (now - f.t0) / f.ms);
      // ease-out: başta hızlı, sonda yumuşak duruş.
      const e = 1 - (1 - u) ** 3;
      // Yakınlaştırma LOGARİTMİK aradeğerlenir; doğrusal olursa uçuşun
      // başında hiçbir şey olmuyor, sonunda aniden içeri dalıyor.
      this.zoom = f.fromZoom * (f.toZoom / f.fromZoom) ** e;
      this.panX = f.fromX + (f.toX - f.fromX) * e;
      this.panY = f.fromY + (f.toY - f.fromY) * e;
      this.applyTransform();
      dirty = true;
      camMoved = true;
      if (u >= 1) this.flight = null;
    }

    // Kamera
    if (!this.flight && this.camTarget) {
      const k = this.reduced ? 1 : 1 - Math.exp(-dt / 95);
      const dx = this.camTarget.x - this.panX;
      const dy = this.camTarget.y - this.panY;
      const dz = this.camTarget.zoom - this.zoom;
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4 && Math.abs(dz) < this.zoom * 1e-4) {
        this.panX = this.camTarget.x;
        this.panY = this.camTarget.y;
        this.zoom = this.camTarget.zoom;
        this.camTarget = null;
      } else {
        this.panX += dx * k;
        this.panY += dy * k;
        this.zoom += dz * k;
      }
      this.applyTransform();
      dirty = true;
      camMoved = true;
    }

    // İl dolguları — mod değişimi çapraz geçişle
    if (this.fillTarget.size > 0) {
      const k = this.reduced ? 1 : 1 - Math.exp(-dt / 110);
      let moving = false;
      for (const n of this.nodes) {
        if (!n.fill.visible && !this.fillTarget.has(n.province.id)) continue;
        const want = this.fillTarget.get(n.province.id);
        if (!want) continue;
        const cur = this.fillNow.get(n.province.id) ?? { colour: want.colour, alpha: 0 };
        const na = cur.alpha + (want.alpha - cur.alpha) * k;
        const nc = want.colour;
        if (Math.abs(na - want.alpha) > 0.004) moving = true;
        this.fillNow.set(n.province.id, { colour: nc, alpha: na });
        n.fill.visible = na > 0.004;
        n.fill.tint = nc;
        n.fill.alpha = na;
      }
      if (moving) dirty = true;
    }

    // Muharebe parlaması söner
    if (this.flash.size > 0) {
      for (const [id, v] of this.flash) {
        const next = v - dt / 1400;
        if (next <= 0) this.flash.delete(id);
        else this.flash.set(id, next);
      }
      dirty = true;
    }

    if (dirty && this.state) {
      // Kamera oynadıysa görünürlük kırpması değişti: dolgu hedefleri
      // yeniden hesaplanmalı, yoksa süzülerek gelen kadrajda iller hiç
      // boyanmadan kalıyor.
      if (camMoved) this.paintProvinces(this.state);
      this.drawHighlight();
      this.drawUnits(this.state, dt);
      this.drawLabels(this.state);
    } else if (dirty) {
      this.drawHighlight();
    }
  }

  /**
   * Süreli, eğrili kamera uçuşu. Üstel yumuşatma kısa düzeltmeler için iyi
   * ama "bölgeye uç" hissi vermiyor; burada süre ve eğri açıkça verilir.
   */
  private flyTo(x: number, y: number, zoom: number, ms: number): void {
    if (this.reduced) {
      this.panX = x;
      this.panY = y;
      this.zoom = zoom;
      this.applyTransform();
      return;
    }
    this.camTarget = null;
    this.flight = {
      fromX: this.panX,
      fromY: this.panY,
      fromZoom: this.zoom,
      toX: x,
      toY: y,
      toZoom: zoom,
      t0: performance.now(),
      ms,
    };
  }

  /** Kamerayı yumuşak biçimde hedefe götür. */
  private glideTo(x: number, y: number, zoom = this.zoom): void {
    if (this.reduced) {
      this.panX = x;
      this.panY = y;
      this.zoom = zoom;
      this.applyTransform();
      return;
    }
    this.camTarget = { x, y, zoom };
  }

  // ───────────────────────────────────────────────────────── çizim ────

  draw(): void {
    const s = this.state;
    if (!s) return;
    this.paintProvinces(s);
    this.drawHighlight();
    this.drawMines(s);
    this.drawForts(s);
    this.drawUnits(s);
    this.drawPaths(s);
    this.drawLabels(s);
  }

  /** Görünür dünya dikdörtgeni — ekran dışı iller hiç çizilmez. */
  private viewBox() {
    const a = this.toWorld(0, 0);
    const b = this.toWorld(this.app.screen.width, this.app.screen.height);
    const m = (b.x - a.x) * 0.08;
    return { minX: a.x - m, minY: a.y - m, maxX: b.x + m, maxY: b.y + m };
  }

  private fillFor(s: GameState, p: Province): { colour: number; alpha: number } {
    const st = s.provinces[p.id]!;
    const seen = st.seen[s.playerSide];

    switch (this.mode) {
      case 'siyasi': {
        if (!seen) return { colour: C.land, alpha: 0 };
        if (p.isSea) return { colour: C.sea, alpha: 0 };
        const world = mapKind() !== 'canakkale';
        if (!st.controller) {
          // Tarafsızlar dünyada ayrı okunmalı; Çanakkale'de böyle il yok.
          return world ? { colour: 0x6b6450, alpha: 0.4 } : { colour: C.land, alpha: 0 };
        }
        // Çanakkale'de amber kıyı çizgisi haritayı taşıdığı için taraf rengi
        // hafif kalabiliyor. Dünyada kıyı katmanı yok: blokları okunur kılan
        // tek şey renk, o yüzden baskın olmalı.
        return world
          ? { colour: st.controller === 'ottoman' ? 0xe0574a : 0x5f93d8, alpha: 0.58 }
          : { colour: st.controller === 'ottoman' ? C.ottoman : C.entente, alpha: 0.13 };
      }
      case 'arazi': {
        const t = TERRAINS[p.terrain];
        return { colour: t.isSea ? C.sea : C.landMid, alpha: p.isSea ? 0.08 : 0.3 };
      }
      case 'tedarik': {
        const v = st.supply;
        return {
          colour: v > 0.75 ? 0x7fc08a : v > 0.4 ? C.accent : C.mine,
          alpha: 0.1 + 0.3 * (1 - Math.min(1, v)),
        };
      }
      case 'deniz': {
        if (!p.isSea) return { colour: C.land, alpha: 0.12 };
        return { colour: C.entente, alpha: 0.06 + (p.current ?? 0) * 0.06 };
      }
      case 'mayin': {
        // Deniz illeri BOYANMAZ. Voronoi hücreleri yuvarlak lekeler
        // olduğundan "mayınlı bölge" gibi okunuyor, oysa mayınlar dar
        // hatlar hâlinde. Hatların kendisi `drawMines` içinde çizilir.
        return { colour: p.isSea ? C.sea : C.land, alpha: p.isSea ? 0 : 0.12 };
      }
    }
  }

  /**
   * Dolgu HEDEFLERİNİ hesaplar; gerçek değer `tick()` içinde hedefe doğru
   * yumuşatılır. Harita modu değişince renkler sıçramak yerine geçiş yapar.
   */
  private paintProvinces(s: GameState): void {
    const v = this.viewBox();
    this.fillTarget.clear();
    for (const n of this.nodes) {
      if (n.maxX < v.minX || n.minX > v.maxX || n.maxY < v.minY || n.minY > v.maxY) {
        n.fill.visible = false;
        this.fillNow.delete(n.province.id);
        continue;
      }
      const p = n.province;
      const fogged = !p.isSea && !s.provinces[p.id]!.seen[s.playerSide];
      const want = fogged ? { colour: C.void, alpha: 0.42 } : this.fillFor(s, p);

      const hit = this.flash.get(p.id);
      const target = hit
        ? { colour: C.mine, alpha: Math.max(want.alpha, 0.2 + hit * 0.45) }
        : want;

      this.fillTarget.set(p.id, target);
      if (!this.fillNow.has(p.id)) {
        // İlk kez görünüyor: hedef renge sıfır saydamlıktan açıl.
        this.fillNow.set(p.id, { colour: target.colour, alpha: 0 });
      }
    }
  }

  /** Seçim, vurgu ve hedef çerçeveleri — her karede en çok birkaç çokgen. */
  private drawHighlight(): void {
    this.gHighlight.clear();
    const hair = 1 / this.zoom;
    const outline = (id: ProvinceId, colour: number, width: number, alpha: number) => {
      const p = prov(id);
      if (p.polygon.length < 3) return;
      const pts: number[] = [];
      for (const q of p.polygon) pts.push(q.x, q.y);
      this.gHighlight.poly(pts, true).stroke({ width: hair * width, color: colour, alpha });
    };

    if (this.targeting) {
      let drawn = 0;
      const v = this.viewBox();
      for (const n of this.nodes) {
        if (drawn > 400) break;
        if (this.validTargets.size > 0 && !this.validTargets.has(n.province.id)) continue;
        if (n.maxX < v.minX || n.minX > v.maxX || n.maxY < v.minY || n.minY > v.maxY) continue;
        outline(n.province.id, C.accent, 2.0, 0.85);
        drawn++;
      }
    }
    if (this.hovered) outline(this.hovered, C.accent, 1.8, 0.7);
    if (this.selection?.kind === 'il') outline(this.selection.id, C.accentGlow, 2.6, 1);
  }

  /**
   * Mayın hatları.
   *
   * Önceden yalnızca nokta dizisi çiziliyor, üstüne de mayınlı deniz illeri
   * boyanıyordu: ekranda ne olduğu belirsiz yuvarlak lekeler kalıyordu.
   * Artık her hat gerçek bir ÇİZGİ olarak, MAYIN modunda adı + mayın
   * sayısıyla etiketli çizilir. Mayınlar boğazı enlemesine kapatan dar
   * bariyerlerdi; biçim bunu anlatmalı.
   */
  private drawMines(s: GameState): void {
    this.gMines.clear();
    for (const t of this.mineText) t.visible = false;
    if (mapKind() !== 'canakkale') return;

    // Dar Boğaz'da 11 hat 1,4 km'ye sıkışıyor. Noktalar büyük olunca hepsi
    // tek bir kırmızı lekeye kaynıyordu; ince tut, hatlar ayrı okunsun.
    const dot = Math.max(80, 1.3 / this.zoom);
    const hair = Math.max(50, 0.9 / this.zoom);
    let slot = 0;

    for (const m of Object.values(s.minefields)) {
      if (m.mines <= 0 || m.laidOn > s.day) continue;
      const own = m.side === s.playerSide;
      if (!own && !m.spotted) continue;
      const colour = own ? C.mine : C.hostile;
      const alpha = own ? 0.95 : 0.78;

      // Hat gövdesi: iki ucu birleştiren ince çizgi — bariyer okunsun.
      this.gMines
        .moveTo(m.from.x, m.from.y)
        .lineTo(m.to.x, m.to.y)
        .stroke({ width: hair * 1.8, color: colour, alpha: alpha * 0.55 });

      // Üstünde kalan mayınlar kadar nokta — tükendikçe hat seyrelir.
      const n = Math.max(2, Math.min(40, Math.round(m.mines / 2)));
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0.5 : i / (n - 1);
        this.gMines
          .circle(
            m.from.x + (m.to.x - m.from.x) * t,
            m.from.y + (m.to.y - m.from.y) * t,
            dot,
          )
          .fill({ color: colour, alpha });
      }

      // Etiket yalnız hatların birbirinden ayrıldığı yakınlıkta. Kampanya
      // kadrajında 11 etiket üst üste binip okunmaz bir yığın oluyordu.
      const len = Math.hypot(m.to.x - m.from.x, m.to.y - m.from.y);
      if (this.mode !== 'mayin' || len * this.zoom < 70) continue;

      // MAYIN modunda adı ve kalan/başlangıç sayısı.
      let label = this.mineText[slot];
      if (!label) {
        label = new Text({ text: '', style: LABEL_MINOR.clone() });
        label.anchor.set(0.5, 1);
        this.gLabels.addChild(label);
        this.mineText[slot] = label;
      }
      slot++;
      label.visible = true;
      label.text = `${m.name.toLocaleUpperCase('tr')} · ${m.mines}/${m.initialMines}`;
      label.style.fill = colour;
      label.x = (m.from.x + m.to.x) / 2;
      // Komşu hatlar hâlâ yakınsa etiketler sırayla yukarı kaydırılır.
      label.y =
        (m.from.y + m.to.y) / 2 - (dot * 3 + (slot % 3) * (13 / this.zoom));
      label.scale.set(1 / this.zoom);
    }
  }

  private drawForts(s: GameState): void {
    this.gForts.clear();
    if (mapKind() !== 'canakkale') return;
    const half = Math.max(320, 4.2 / this.zoom);
    const hairline = Math.max(70, 1 / this.zoom);
    for (const f of Object.values(s.forts)) {
      const own = s.provinces[f.province]?.controller === s.playerSide;
      if (!own && !f.spotted) continue;
      const dead = f.integrity <= 0.05;
      const colour = dead ? C.textFaint : own ? C.accent : C.hostile;
      this.gForts
        .rect(f.pos.x - half, f.pos.y - half, half * 2, half * 2)
        .stroke({ width: hairline * 1.6, color: colour, alpha: dead ? 0.5 : 1 })
        .fill({ color: colour, alpha: dead ? 0.1 : 0.3 * f.integrity });
      if (this.selection?.kind === 'tabya' && this.selection.id === f.id) {
        this.gForts
          .circle(f.pos.x, f.pos.y, fortRange(f))
          .stroke({ width: hairline * 1.4, color: C.accent, alpha: 0.5 });
      }
    }
  }

  private drawPaths(s: GameState): void {
    this.gPaths.clear();
    const w = Math.max(110, 1.6 / this.zoom);
    const drawPath = (from: ProvinceId, path: readonly ProvinceId[], colour: number) => {
      if (path.length === 0) return;
      let prev = prov(from).center;
      for (const id of path) {
        const c = prov(id).center;
        this.gPaths.moveTo(prev.x, prev.y).lineTo(c.x, c.y);
        prev = c;
      }
      this.gPaths.stroke({ width: w, color: colour, alpha: 0.75 });
      this.gPaths.circle(prev.x, prev.y, w * 2.4).fill({ color: colour, alpha: 0.9 });
    };
    for (const u of Object.values(s.landUnits)) {
      if (u.side !== s.playerSide || !u.order) continue;
      if (u.order.kind === 'yuru') drawPath(u.location, u.order.path, C.accent);
      if (u.order.kind === 'taarruz' && u.order.target) {
        drawPath(u.location, [u.order.target], C.mine);
      }
      if (u.order.kind === 'cikarma' && u.order.target) {
        drawPath(u.location, [u.order.target], C.accentGlow);
      }
    }
    for (const f of Object.values(s.fleets)) {
      if (f.side !== s.playerSide || !f.order) continue;
      if (f.order.path.length > 0) {
        drawPath(f.location, f.order.path, f.order.kind === 'zorla_gec' ? C.mine : C.shipLight);
      }
    }
  }

  /**
   * Birlik sayaçları. `dt` verilirse sayaç yeni iline SIÇRAMAZ, kayarak
   * gider: emirlerin sonucunu gözle takip edebilmek için.
   */
  private drawUnits(s: GameState, dt = 0): void {
    let used = 0;
    const take = (): Container => {
      let c = this.counterPool[used];
      if (!c) {
        c = new Container();
        const g = new Graphics();
        const t = new Text({ text: '', style: COUNTER_STYLE });
        t.anchor.set(0.5);
        c.addChild(g, t);
        this.counterPool.push(c);
        this.gUnits.addChild(c);
      }
      c.visible = true;
      used++;
      return c;
    };

    const scale = 1 / this.zoom;
    const v = this.viewBox();
    const stacks = new Map<ProvinceId, { side: Side; men: number; n: number; combat: boolean }>();
    for (const u of Object.values(s.landUnits)) {
      if (u.embarkedIn || u.strength <= 0) continue;
      if (!s.provinces[u.location]?.seen[s.playerSide] && u.side !== s.playerSide) continue;
      const cur = stacks.get(u.location);
      if (cur && cur.side === u.side) {
        cur.men += u.strength;
        cur.n++;
        cur.combat ||= u.inCombat;
      } else if (!cur) {
        stacks.set(u.location, { side: u.side, men: u.strength, n: 1, combat: u.inCombat });
      }
    }

    // 643 tümenin hepsini aynı anda çizmek haritayı okunmaz yapıyor.
    // Görüş alanındaki en kalabalık yığınlar gösterilir.
    const visible = [...stacks.entries()]
      .filter(([id]) => {
        const c = prov(id).center;
        return c.x >= v.minX && c.x <= v.maxX && c.y >= v.minY && c.y <= v.maxY;
      })
      .sort((a, b) => b[1].men - a[1].men)
      .slice(0, MAX_COUNTERS);

    for (const [id, st] of visible) {
      const p = prov(id);
      const c = take();
      const key = `k:${st.side}:${id}`;
      c.position.set(...this.easePos(key, p.center, dt));
      c.scale.set(scale * (st.combat ? 1.12 : 1));
      const g = c.children[0] as Graphics;
      const t = c.children[1] as Text;
      const col = st.side === 'ottoman' ? C.ottoman : C.entente;
      const w = 34;
      const h = 17;
      g.clear()
        .rect(-w / 2, -h / 2, w, h)
        .fill({ color: C.panel, alpha: 0.92 })
        .stroke({ width: 1.2, color: st.combat ? C.mine : col, alpha: 1 });
      g.moveTo(-w / 2 + 3, -h / 2 + 3)
        .lineTo(-w / 2 + 11, h / 2 - 3)
        .moveTo(-w / 2 + 11, -h / 2 + 3)
        .lineTo(-w / 2 + 3, h / 2 - 3)
        .stroke({ width: 1, color: col, alpha: 0.85 });
      t.text = st.men >= 1000 ? `${Math.round(st.men / 1000)}B` : String(st.men);
      t.x = 6;
      t.y = 0;
      if (st.n > 1) t.text += `·${st.n}`;
    }

    for (const f of Object.values(s.fleets)) {
      const alive = liveShips(f);
      if (alive.length === 0) continue;
      if (f.side !== s.playerSide && !s.provinces[f.location]?.seen[s.playerSide]) continue;
      const p = prov(f.location);
      if (p.center.x < v.minX || p.center.x > v.maxX) continue;
      if (p.center.y < v.minY || p.center.y > v.maxY) continue;
      const c = take();
      c.position.set(...this.easePos(`f:${f.id}`, p.center, dt));
      c.scale.set(scale);
      const g = c.children[0] as Graphics;
      const t = c.children[1] as Text;
      const col = f.side === 'ottoman' ? C.ottoman : C.ship;
      g.clear();
      const show = Math.min(5, alive.length);
      for (let i = 0; i < show; i++) {
        const ox = (i % 3) * 11 - 11;
        const oy = Math.floor(i / 3) * 8 - 4;
        g.poly([ox - 6, oy, ox + 1, oy - 3, ox + 7, oy, ox + 1, oy + 3])
          .fill({ color: col, alpha: 0.92 })
          .stroke({ width: 0.8, color: C.shipLight, alpha: 0.8 });
      }
      t.text = String(alive.length);
      t.x = 0;
      t.y = 13;
    }

    for (let i = used; i < this.counterPool.length; i++) this.counterPool[i]!.visible = false;
  }

  /**
   * Sayaç konumunu hedefe doğru yumuşat. Anahtar başına son konum saklanır;
   * birlik il değiştirdiğinde ışınlanmak yerine kayar.
   */
  private easePos(
    key: string,
    target: { x: number; y: number },
    dt: number,
  ): [number, number] {
    const cur = this.counterPos.get(key);
    if (!cur || this.reduced || dt <= 0) {
      this.counterPos.set(key, { x: target.x, y: target.y });
      return [target.x, target.y];
    }
    const k = 1 - Math.exp(-dt / 160);
    const nx = cur.x + (target.x - cur.x) * k;
    const ny = cur.y + (target.y - cur.y) * k;
    this.counterPos.set(key, { x: nx, y: ny });
    return [nx, ny];
  }

  private drawLabels(s: GameState): void {
    let used = 0;
    const take = (style: TextStyle): Text => {
      let t = this.labelPool[used];
      if (!t) {
        t = new Text({ text: '', style });
        t.anchor.set(0.5, 0);
        this.labelPool.push(t);
        this.gLabels.addChild(t);
      }
      t.style = style;
      t.visible = true;
      used++;
      return t;
    };

    const scale = 1 / this.zoom;
    const v = this.viewBox();
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const world = mapKind() === 'dunya';

    const ordered = [...provinces()].sort(
      (a, b) =>
        b.victoryPoints + b.supplyHub / 1e5 - (a.victoryPoints + a.supplyHub / 1e5),
    );

    for (const p of ordered) {
      if (used >= MAX_LABELS) break;
      if (!p.labelled) continue;
      if (p.center.x < v.minX || p.center.x > v.maxX) continue;
      if (p.center.y < v.minY || p.center.y > v.maxY) continue;
      if (!world) {
        if (p.isSea && this.mode !== 'deniz' && this.mode !== 'mayin' && p.victoryPoints === 0) {
          continue;
        }
        if (!s.provinces[p.id]!.seen[s.playerSide] && p.victoryPoints === 0) continue;
      } else if (p.isSea && this.mode !== 'deniz') {
        continue;
      }

      const major = world
        ? !p.isSea && (metaOf(p.id)?.cells ?? 0) > 1400
        : p.victoryPoints >= 3 || p.supplyHub > 0;
      if (!major && this.zoom < (world ? 0.00006 : 0.0075)) continue;

      const text = p.name.toLocaleUpperCase('tr-TR');
      const sx = p.center.x * this.zoom + this.panX;
      const sy = p.center.y * this.zoom + this.panY + 15;
      const bw = text.length * (major ? 8.4 : 6.9);
      const bh = major ? 15 : 12;
      if (
        placed.some(
          (r) => Math.abs(r.x - sx) * 2 < r.w + bw && Math.abs(r.y - sy) * 2 < r.h + bh,
        )
      ) {
        continue;
      }
      placed.push({ x: sx, y: sy, w: bw, h: bh });

      const t = take(major ? LABEL_STYLE : LABEL_MINOR);
      t.text = text;
      t.position.set(p.center.x, p.center.y + 15 / this.zoom);
      t.scale.set(scale);
    }

    for (let i = used; i < this.labelPool.length; i++) this.labelPool[i]!.visible = false;
  }
}

/** Çanakkale açılış kadrajına dahil edilmeyen iller — uzak üsler, açık deniz. */
const OUT_OF_FRAME: ReadonlySet<string> = new Set([
  'bozcaada',
  'gokceada',
  'd_ege_acik',
  'd_gokceada_acigi',
  'd_bozcaada_acigi',
  'd_besike',
  'd_saros',
  'bolayir',
  'lapseki',
  'gelibolu',
  'd_gelibolu_onu',
]);

export { dist };
