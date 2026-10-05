import { Container, Sprite, Texture } from 'pixi.js';

/**
 * Çalışma anında arazi karosu akışı.
 *
 * Statik kademeler (`world-relief` 11 px/°, `lod-region` 91, `lod-near` 364)
 * tiyatro çevresini kurtarıyor ama derin yakınlaştırmada tükeniyor: 305
 * m/piksel, ekranda metre başına birkaç piksel isteyen bir zoom'da bulanık
 * bir lekeye dönüşüyor. Burada AWS Terrain Tiles (terrarium) karoları
 * görünen pencere için ANINDA indirilip gölgelendirilir.
 *
 * Tasarım kararları:
 *
 * * **Tek mozaik, çok karo.** Her karoyu ayrı sprite yapmak tepe gölgelemesi
 *   için komşu piksel bırakmaz ve karo sınırlarında 1 px'lik ızgara çizgileri
 *   oluşur. Görünen karolar önce tek bir yükseklik mozaiğine dizilir, gölge
 *   mozaiğin tamamında hesaplanır: iç sınırlarda gerçek komşular var, dikiş
 *   yok. Çıktı tek doku, tek çizim çağrısı.
 * * **CPU'da gölgelendirme.** 256×256 bir karo 65 bin piksel; tipik bir
 *   mozaik 2-3 milyon. JS'te ~60 ms, yalnız zoom/kaydırma durulunca bir kez.
 *   Özel Pixi gölgelendiricisine kıyasla çok daha az kırılgan.
 * * **Mercator → eşdikdörtgen.** Karolar Web Mercator, oyun haritası enlemde
 *   doğrusal. Yeniden örnekleme satır bazında yapılır.
 * * **Aynı gölgelendirme dili.** Paketteki `world-relief` ve tiyatro rölyefiyle
 *   birebir aynı ışık yönü, yükseklik rampası ve deniz rengi — akan katman
 *   altındakinin üstüne bindiğinde parlaklık atlaması olmaz.
 */

const BASE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium';

/**
 * Gölge sertliği. Tüm rölyef katmanları bu yasaya uyar.
 * Tam telafi (zs ∝ px/derece) ince kademede gölgeyi doyurup araziyi kumlu
 * bir kabartmaya çeviriyordu; 0,18 üssü iki ucun arasını tutuyor.
 */
export function zscale(pxPerDeg: number): number {
  return 0.04 * (pxPerDeg / (4096 / 360)) ** 0.18;
}

/**
 * Paketteki `world-relief` 4096 px / 360° = 11,4 px/derece. z4 tam olarak
 * aynı; ilk kazanç z5'te. Akış buradan başlar ve TÜM dünyayı kapsar —
 * önceden Ege ve Osmanlı coğrafyası için iki statik kutu paketleniyordu,
 * dışarıda kalan her yer 10 km/piksel bulanıklıkta kalıyordu.
 */
const MIN_Z = 5;
/** z13 ≈ 11 m/piksel. Daha ötesi hem ağır hem veride karşılığı yok. */
const MAX_Z = 13;
/** Mozaik kenarı en çok bu kadar karo — doku 4096 px sınırında kalsın. */
const MAX_TILES_PER_AXIS = 16;
/**
 * Mozaik toplam piksel tavanı. Gölgelendirme CPU'da; 16 milyon piksel
 * saniyeler sürer ve geniş görünümlerde zaten `world-relief` yeterli.
 */
const MAX_MOSAIC_PX = 6e6;

function tileY2lat(y: number, n: number): number {
  return (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
}

function lat2tileY(lat: number, n: number): number {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * n;
}

export interface LatLonBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

export class TerrainTiles {
  private readonly layer = new Container();
  /** Çözülmüş yükseklik karoları; anahtar `z/x/y`. */
  private readonly cache = new Map<string, Int16Array>();
  private current: Sprite | null = null;
  /** Son uygulanan istek imzası — aynı pencere iki kez işlenmesin. */
  private lastKey = '';
  private timer: number | undefined;
  private busy = false;

  constructor(
    parent: Container,
    private readonly origin: { lat: number; lon: number },
  ) {
    parent.addChild(this.layer);
  }

  /**
   * Görünen pencereyi bildir. Çağrı ucuzdur: gerçek iş zoom/kaydırma
   * durulduktan sonra bir kez yapılır.
   *
   * @param view     görünen alan, derece cinsinden
   * @param pxPerDeg ekranda boylam derecesi başına piksel
   */
  request(view: LatLonBox, pxPerDeg: number): void {
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => void this.build(view, pxPerDeg), 220);
  }

  private async build(view: LatLonBox, pxPerDeg: number): Promise<void> {
    if (this.busy) return;

    // Ekranın istediği çözünürlüğü karşılayan en küçük z.
    let z = MIN_Z;
    while (z < MAX_Z && (256 * (1 << z)) / 360 < pxPerDeg) z++;
    if (pxPerDeg <= (4096 / 360) * 1.3) {
      // Paketteki dünya dokusu zaten yetiyor: akan katmanı kaldır.
      this.clear();
      return;
    }

    let n = 1 << z;
    let span = 360 / n;
    let x0 = Math.floor((view.west + 180) / span);
    let x1 = Math.floor((view.east + 180) / span);
    let y0 = Math.floor(lat2tileY(view.north, n));
    let y1 = Math.floor(lat2tileY(view.south, n));

    // Pencere çok genişse kademe düşür: ne 4096 px kenarı, ne piksel tavanı
    // aşılsın. Aşağı inildikçe her adım piksel sayısını dörtte bire düşürür.
    while (
      z > MIN_Z &&
      (x1 - x0 + 1 > MAX_TILES_PER_AXIS ||
        y1 - y0 + 1 > MAX_TILES_PER_AXIS ||
        (x1 - x0 + 1) * (y1 - y0 + 1) * 65536 > MAX_MOSAIC_PX)
    ) {
      z--;
      n = 1 << z;
      span = 360 / n;
      x0 = Math.floor((view.west + 180) / span);
      x1 = Math.floor((view.east + 180) / span);
      y0 = Math.floor(lat2tileY(view.north, n));
      y1 = Math.floor(lat2tileY(view.south, n));
    }
    x0 = Math.max(0, x0);
    y0 = Math.max(0, y0);
    x1 = Math.min(n - 1, x1);
    y1 = Math.min(n - 1, y1);
    if (x1 < x0 || y1 < y0) return;

    const key = `${z}/${x0}-${x1}/${y0}-${y1}`;
    if (key === this.lastKey) return;

    this.busy = true;
    try {
      const tiles = await this.fetchRange(z, x0, x1, y0, y1);
      // Kullanıcı bu arada başka yere gittiyse sonucu atma — yine de göster;
      // bir sonraki `request` üstüne yazar. Yarıda kesmek titremeye yol açıyor.
      const sprite = this.compose(tiles, z, x0, x1, y0, y1);
      this.swap(sprite);
      this.lastKey = key;
    } catch (e) {
      console.error('arazi karoları yüklenemedi', e);
    } finally {
      this.busy = false;
    }
  }

  private async fetchRange(
    z: number,
    x0: number,
    x1: number,
    y0: number,
    y1: number,
  ): Promise<Map<string, Int16Array>> {
    const want: [number, number][] = [];
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) want.push([x, y]);
    }
    await Promise.all(
      want.map(async ([x, y]) => {
        const k = `${z}/${x}/${y}`;
        if (this.cache.has(k)) return;
        const res = await fetch(`${BASE}/${z}/${x}/${y}.png`);
        if (!res.ok) {
          this.cache.set(k, new Int16Array(256 * 256));
          return;
        }
        const bmp = await createImageBitmap(await res.blob());
        const cv = document.createElement('canvas');
        cv.width = 256;
        cv.height = 256;
        const ctx = cv.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(bmp, 0, 0);
        bmp.close();
        const d = ctx.getImageData(0, 0, 256, 256).data;
        const out = new Int16Array(256 * 256);
        // terrarium: yükseklik = R·256 + G + B/256 − 32768 metre.
        for (let i = 0, p = 0; p < out.length; i += 4, p++) {
          out[p] = Math.round(d[i]! * 256 + d[i + 1]! + d[i + 2]! / 256 - 32768);
        }
        this.cache.set(k, out);
      }),
    );
    // Önbellek sınırsız büyümesin: karo başına 128 KB, 1400 karo 180 MB
    // demekti ve sekme çöküyordu. 400 karo ≈ 52 MB.
    if (this.cache.size > 400) {
      let drop = this.cache.size - 280;
      for (const k of this.cache.keys()) {
        if (drop-- <= 0) break;
        this.cache.delete(k);
      }
    }
    return this.cache;
  }

  private compose(
    cache: Map<string, Int16Array>,
    z: number,
    x0: number,
    x1: number,
    y0: number,
    y1: number,
  ): Sprite {
    const n = 1 << z;
    const span = 360 / n;
    const tx = x1 - x0 + 1;
    const ty = y1 - y0 + 1;
    const mw = tx * 256;
    const mh = ty * 256;

    // 1) Mercator yükseklik mozaiği.
    const merc = new Int16Array(mw * mh);
    for (let ty_ = 0; ty_ < ty; ty_++) {
      for (let tx_ = 0; tx_ < tx; tx_++) {
        const t = cache.get(`${z}/${x0 + tx_}/${y0 + ty_}`);
        if (!t) continue;
        for (let r = 0; r < 256; r++) {
          merc.set(
            t.subarray(r * 256, r * 256 + 256),
            (ty_ * 256 + r) * mw + tx_ * 256,
          );
        }
      }
    }

    // 2) Mercator → eşdikdörtgen: satır başına kaynak satırı.
    const north = tileY2lat(y0, n);
    const south = tileY2lat(y1 + 1, n);
    const west = x0 * span - 180;
    const east = (x1 + 1) * span - 180;
    const oh = Math.max(2, Math.round((mw * (north - south)) / (east - west)));
    const elev = new Float32Array(mw * oh);
    for (let r = 0; r < oh; r++) {
      const lat = north - ((north - south) * r) / (oh - 1);
      const my = lat2tileY(lat, n);
      const src = Math.min(mh - 1, Math.max(0, Math.round((my - y0) * 256)));
      elev.set(merc.subarray(src * mw, src * mw + mw), r * mw);
    }

    // 3) Gölgelendirme — statik kademelerle birebir aynı dil.
    const zs = zscale(mw / (east - west));
    const cv = document.createElement('canvas');
    cv.width = mw;
    cv.height = oh;
    const ctx = cv.getContext('2d')!;
    const img = ctx.createImageData(mw, oh);
    const d = img.data;
    for (let r = 0; r < oh; r++) {
      const lat = north - ((north - south) * r) / (oh - 1);
      const coslat = Math.min(1, Math.max(0.08, Math.cos((lat * Math.PI) / 180)));
      for (let c = 0; c < mw; c++) {
        const p = r * mw + c;
        const e = elev[p]!;
        const gx =
          (elev[c < mw - 1 ? p + 1 : p]! - elev[c > 0 ? p - 1 : p]!) /
          (c > 0 && c < mw - 1 ? 2 : 1);
        const gy =
          (elev[r < oh - 1 ? p + mw : p]! - elev[r > 0 ? p - mw : p]!) /
          (r > 0 && r < oh - 1 ? 2 : 1);
        const dx = (gx * zs) / coslat;
        const dy = gy * zs;
        const ln = Math.sqrt(dx * dx + dy * dy + 1);
        const shade = Math.min(
          1.55,
          Math.max(0.42, ((dx * 0.72 + dy * 0.6 + 0.35) / ln) * 2),
        );
        const t = Math.min(1, Math.max(0, e) / 3200) ** 0.72;
        const depth = Math.min(1, Math.max(0, -Math.min(e, 0)) / 6000);
        // Kara maskesi yükseklikten; 1 px yumuşatma kıyıyı testere yapmaz.
        const a = Math.min(1, Math.max(0, e / 6 + 0.5));
        const i = p * 4;
        d[i] = (26 + t * 61) * shade * 0.8 * a + (9 - depth * 6) * (1 - a);
        d[i + 1] = (22 + t * 43) * shade * 0.8 * a + (16 - depth * 9) * (1 - a);
        d[i + 2] = (16 + t * 11) * shade * 0.82 * a + (28 - depth * 13) * (1 - a);
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    const o = this.origin;
    const kx = Math.cos((o.lat * Math.PI) / 180) * 111320;
    const ky = 110574;
    const sp = new Sprite(Texture.from(cv));
    sp.x = (west - o.lon) * kx;
    sp.y = -(north - o.lat) * ky;
    sp.width = (east - west) * kx;
    sp.height = (north - south) * ky;
    return sp;
  }

  private swap(sprite: Sprite): void {
    const old = this.current;
    this.layer.addChild(sprite);
    this.current = sprite;
    if (old) {
      this.layer.removeChild(old);
      old.destroy({ texture: true });
    }
  }

  private clear(): void {
    if (!this.current) return;
    this.layer.removeChild(this.current);
    this.current.destroy({ texture: true });
    this.current = null;
    this.lastKey = '';
  }
}
