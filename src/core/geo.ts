import type { GameMap, LonLat, Province, ProvinceId, Terrain, Vec2 } from './types.ts';
import { MinHeap } from './heap.ts';

/**
 * Harita erişimi.
 *
 * Harita artık modül düzeyinde SABİT DEĞİL: iki senaryo var (Çanakkale 1915,
 * 47 il / Dünya 1914, 4.575 il) ve ikisi farklı dosyalardan geliyor. Oyun
 * başlarken `loadMap()` çağrılır, sonrasında `MAP`, `prov()` vb. seçili
 * haritaya bakar. Bu sayede 2,5 MB'lık dünya verisi Çanakkale oynanırken hiç
 * indirilmez (dinamik import).
 */

/**
 * Kendi yüksek çözünürlüklü haritası olan tiyatrolar.
 *
 * Yükleyici AYRI AYRI yazılır, şablonlu `import()` ile DEĞİL: şablon yolu
 * TypeScript'i `data/` altındaki bütün JSON'ları çözmeye zorluyor ve
 * 2,5 MB'lık `world.json` yüzünden `tsc` beş dakikada bitmiyor. Her satır
 * ayrıca Vite'a ayrı parça ürettirir — Çanakkale oynayan Kafkas
 * haritasını indirmez.
 *
 * Yeni harita eklemek için:
 *   1. `tools/fetch_terrain.py <ad>` ve `tools/build_map.py <ad>`
 *   2. buraya bir satır
 *   3. `theatres.ts` içinde `ownMap: '<ad>'`
 */
export type DetailedMapId = 'canakkale' | 'kafkas' | 'mezopotamya' | 'sina';

interface DetailedMap {
  /** `public/` altındaki rölyef dokusu. */
  readonly relief: string;
  readonly load: () => Promise<{ default: unknown }>;
}

// AÇIK TİP ŞART. `as const` bırakılırsa TypeScript `map.json`'ın tam
// değişmez tipini (1 MB'lık sayı dizisi) üretmeye çalışıyor ve
// `tsc --noEmit` beş saniyeden iki dakikaya çıkıyor.
export const DETAILED_MAPS: Record<DetailedMapId, DetailedMap> = {
  canakkale: {
    relief: 'relief.png',
    load: () => import('../data/map.json'),
  },
  kafkas: {
    relief: 'relief-kafkas.png',
    load: () => import('../data/map-kafkas.json'),
  },
  mezopotamya: {
    relief: 'relief-mezopotamya.png',
    load: () => import('../data/map-mezopotamya.json'),
  },
  sina: {
    relief: 'relief-sina.png',
    load: () => import('../data/map-sina.json'),
  },
};

/** `'dunya'` ortak Natural Earth haritası; kalanlar kendi haritası olanlar. */
export type MapKind = DetailedMapId | 'dunya';

const M_PER_DEG_LAT = 110574.0;
const DEG = Math.PI / 180;
const EARTH_R = 6371008.8;

// ───────────────────────────────────────────────────────── izdüşüm ─────

/**
 * Yerel eşdikdörtgen izdüşüm. ÇİZİM içindir; gerçek mesafeler için
 * `provinceDist` (haversine) kullanılır.
 */
export function makeProjection(origin: LonLat) {
  const kx = Math.cos(origin.lat * DEG) * 111320.0;
  return {
    toMetres(lon: number, lat: number): Vec2 {
      return { x: (lon - origin.lon) * kx, y: -(lat - origin.lat) * M_PER_DEG_LAT };
    },
    toLonLat(p: Vec2): LonLat {
      return { lon: origin.lon + p.x / kx, lat: origin.lat - p.y / M_PER_DEG_LAT };
    },
  };
}

// ────────────────────────────────────────────── yüklenen harita durumu ──

interface LoadedMap {
  kind: MapKind;
  map: GameMap;
  byId: Record<ProvinceId, Province>;
  relief: ReliefBox;
  /** Hücre boyutu ve il kimlikleri — O(1)'e yakın tıklama isabeti için. */
  grid: SpatialGrid;
}

export interface ReliefBox {
  image: string;
  width: number;
  height: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  /** Doku zaten boyanmış ve gölgelenmiş mi (dünya haritası böyle). */
  preshaded: boolean;
}

let loaded: LoadedMap | null = null;

function current(): LoadedMap {
  if (!loaded) throw new Error('harita yüklenmedi — önce loadMap() çağır');
  return loaded;
}

export const mapKind = (): MapKind => current().kind;

/** Seçili haritanın tamamı. */
export function gameMap(): GameMap {
  return current().map;
}

export function reliefBox(): ReliefBox {
  return current().relief;
}

export function provinces(): readonly Province[] {
  return current().map.provinces;
}

/** İl kimliğini al; yoksa anlaşılır hata ver (sessiz undefined yerine). */
export function prov(id: ProvinceId): Province {
  const p = current().byId[id];
  if (!p) throw new Error(`bilinmeyen il: ${id}`);
  return p;
}

/**
 * İlin oyun değerlerini ata. Dünya haritası Natural Earth'ten geliyor ve
 * zafer puanı / ikmal kapasitesi taşımıyor; bunlar 1914 senaryosu kurulurken
 * (başkentler, büyük şehirler) hesaplanıp buradan yazılır.
 */
export function setProvinceValues(
  id: ProvinceId,
  values: { victoryPoints?: number; supplyHub?: number },
): void {
  const p = current().byId[id] as { victoryPoints: number; supplyHub: number } | undefined;
  if (!p) return;
  if (values.victoryPoints !== undefined) p.victoryPoints = values.victoryPoints;
  if (values.supplyHub !== undefined) p.supplyHub = values.supplyHub;
}

export function hasProv(id: ProvinceId): boolean {
  return current().byId[id] !== undefined;
}

// ──────────────────────────────────────────────────────── yükleyici ─────

interface RawCommon {
  name: string;
  isSea: boolean;
  victoryPoints?: number;
  supplyHub?: number;
  neighbours: string[];
}

interface RawCanakkale extends RawCommon {
  id: string;
  terrain: string;
  center: Vec2;
  polygon: Vec2[];
  elevation: number;
  peak: number;
  areaKm2: number;
  startOwner: string | null;
  beachAccess: string[];
  lon: number;
  lat: number;
  straitWidth?: number;
  current?: number;
}

interface RawWorld extends RawCommon {
  id: string;
  lon: number;
  lat: number;
  cells: number;
  elev: number;
  peak: number;
  nation: string;
  nationTr: string;
  side: 'itilaf' | 'ittifak' | 'tarafsiz';
  joins?: string;
  nation38: string;
  nation38Tr: string;
  side38: 'muttefik' | 'eksen' | 'tarafsiz';
  joins38?: string;
  admin: string;
  iso: string;
  type: string;
  ring: [number, number][];
}

/** Dünya ilinin ek alanları — senaryo kurucusu okur. */
export interface WorldMeta {
  /** 1914 sahibi ve tarafı. */
  nation: string;
  nationTr: string;
  side: 'itilaf' | 'ittifak' | 'tarafsiz';
  joins?: string;
  /** 1938 sahibi ve tarafı — aynı iller, farklı sınırlar. */
  nation38: string;
  nation38Tr: string;
  side38: 'muttefik' | 'eksen' | 'tarafsiz';
  joins38?: string;
  admin: string;
  type: string;
  cells: number;
}

let worldMeta: Record<ProvinceId, WorldMeta> = {};

export function metaOf(id: ProvinceId): WorldMeta | undefined {
  return worldMeta[id];
}

/**
 * Dünya haritası arazisi — rakım ve enlemden türetilir. Natural Earth idari
 * bölümlerinde arazi bilgisi yok; oyun için rakım yeterli ayrım sağlıyor.
 */
function worldTerrain(p: RawWorld): Terrain {
  if (p.isSea) {
    const big = p.cells > 9000;
    return big ? 'acik_deniz' : 'korfez';
  }
  if (p.peak > 2200) return 'dag';
  if (p.peak > 900) return 'tepe';
  if (p.elev < 60 && p.peak < 220) return 'ova';
  return 'tepe';
}

/** Yüklenen haritanın kimliği — aynı harita farklı bölgelerle yüklenebilir. */
let loadedKey = '';

/**
 * @param bbox [batı, güney, doğu, kuzey] derece. Verilirse dünya haritasının
 *   yalnız bu dikdörtgene düşen illeri yüklenir (cephe senaryoları). 4.575
 *   ilin tamamı yerine ~200-600 il kalır: hem performans hem oynanabilirlik.
 */
export async function loadMap(
  kind: MapKind,
  bbox?: readonly [number, number, number, number],
): Promise<GameMap> {
  const key = `${kind}|${bbox ? bbox.join(',') : ''}`;
  if (loaded && loadedKey === key) return loaded.map;
  loadedKey = key;

  let map: GameMap;
  let relief: ReliefBox;

  if (kind !== 'dunya') {
    // Yükleyici tablosu DETAILED_MAPS'te; oradaki nota bakın.
    const raw = (await DETAILED_MAPS[kind].load()).default as unknown as {
      origin: LonLat;
      bounds: { minX: number; minY: number; maxX: number; maxY: number };
      relief: Record<string, number | string>;
      provinces: RawCanakkale[];
      coastRings: [number, number][][];
    };
    const list: Province[] = raw.provinces.map((p) => ({
      id: p.id,
      name: p.name,
      labelled: (p.victoryPoints ?? 0) >= 2 || p.areaKm2 > 60 || (p.supplyHub ?? 0) > 0,
      isSea: p.isSea,
      terrain: p.terrain as Terrain,
      center: p.center,
      polygon: p.polygon,
      lon: p.lon,
      lat: p.lat,
      elevation: p.elevation,
      peak: p.peak,
      neighbours: p.neighbours,
      beachAccess: p.beachAccess,
      victoryPoints: p.victoryPoints ?? 0,
      supplyHub: p.supplyHub ?? 0,
      startOwner:
        p.startOwner === 'ottoman' || p.startOwner === 'entente' ? p.startOwner : null,
      ...(p.straitWidth !== undefined ? { straitWidth: p.straitWidth } : {}),
      ...(p.current !== undefined ? { current: p.current } : {}),
    }));
    worldMeta = {};
    map = {
      origin: raw.origin,
      provinces: list,
      coastRings: raw.coastRings.map((r) => r.map(([x, y]) => ({ x, y }))),
      bounds: raw.bounds,
      relief: { width: 0, height: 0, minX: 0, minY: 0, cell: 0, data: new Int16Array(0) },
      landmarks: [],
    };
    relief = {
      image: DETAILED_MAPS[kind].relief,
      width: raw.relief.width as number,
      height: raw.relief.height as number,
      minX: raw.relief.minX as number,
      minY: raw.relief.minY as number,
      maxX: raw.relief.maxX as number,
      maxY: raw.relief.maxY as number,
      preshaded: false,
    };
  } else {
    // DİNAMİK IMPORT KASITLI — yukarıdaki nota bakın.
    const raw = (await import('../data/world.json')).default as unknown as {
      bounds: { minLon: number; minLat: number; maxLon: number; maxLat: number };
      relief: { image: string; width: number; height: number };
      provinces: RawWorld[];
    };
    // Dünya için eşdikdörtgen "metre": x = lon·111320, y = -lat·110574.
    // Çizim uzayı budur; gerçek mesafe haversine ile hesaplanır.
    const KX = 111320.0;
    const meta: Record<ProvinceId, WorldMeta> = {};
    const list: Province[] = raw.provinces.map((p) => {
      meta[p.id] = {
        nation: p.nation,
        nationTr: p.nationTr,
        side: p.side,
        ...(p.joins ? { joins: p.joins } : {}),
        nation38: p.nation38,
        nation38Tr: p.nation38Tr,
        side38: p.side38,
        ...(p.joins38 ? { joins38: p.joins38 } : {}),
        admin: p.admin,
        type: p.type,
        cells: p.cells,
      };
      return {
        id: p.id,
        name: p.name,
        // 4.575 ilin hepsini etiketlemek okunmaz olur; büyükler etiketlenir.
        labelled: p.cells > 420,
        isSea: p.isSea,
        terrain: worldTerrain(p),
        center: { x: p.lon * KX, y: -p.lat * M_PER_DEG_LAT },
        polygon: p.ring.map(([lon, lat]) => ({ x: lon * KX, y: -lat * M_PER_DEG_LAT })),
        lon: p.lon,
        lat: p.lat,
        elevation: p.elev,
        peak: p.peak,
        neighbours: p.neighbours,
        beachAccess: [],
        victoryPoints: 0,
        supplyHub: 0,
        startOwner: null,
      };
    });
    worldMeta = meta;
    const filtered = bbox ? clipToBox(list, bbox, meta) : list;
    map = {
      origin: { lon: 0, lat: 0 },
      provinces: filtered,
      coastRings: [],
      bounds: {
        minX: raw.bounds.minLon * KX,
        minY: -raw.bounds.maxLat * M_PER_DEG_LAT,
        maxX: raw.bounds.maxLon * KX,
        maxY: -raw.bounds.minLat * M_PER_DEG_LAT,
      },
      relief: { width: 0, height: 0, minX: 0, minY: 0, cell: 0, data: new Int16Array(0) },
      landmarks: [],
    };
    relief = {
      image: raw.relief.image,
      width: raw.relief.width,
      height: raw.relief.height,
      minX: raw.bounds.minLon * KX,
      minY: -raw.bounds.maxLat * M_PER_DEG_LAT,
      maxX: raw.bounds.maxLon * KX,
      maxY: -raw.bounds.minLat * M_PER_DEG_LAT,
      preshaded: true,
    };
  }

  const byId: Record<ProvinceId, Province> = {};
  for (const p of map.provinces) byId[p.id] = p;

  loaded = { kind, map, byId, relief, grid: buildGrid(map) };
  return map;
}

// ─────────────────────────────────────────────────── uzamsal indeks ─────

interface SpatialGrid {
  minX: number;
  minY: number;
  cell: number;
  cols: number;
  rows: number;
  /** Her hücrede kesişen illerin dizinleri. */
  buckets: Int32Array[];
}

/**
 * Düzenli ızgara indeksi. 4.575 ilde her fare hareketinde bütün çokgenleri
 * nokta-içinde testinden geçirmek kare başına milyonlarca işlem demekti;
 * ızgara bunu birkaç adaya indiriyor.
 */
function buildGrid(map: GameMap): SpatialGrid {
  const b = map.bounds;
  const n = map.provinces.length;
  const target = Math.max(16, Math.round(Math.sqrt(n) * 1.5));
  const cell = Math.max((b.maxX - b.minX) / target, (b.maxY - b.minY) / target);
  const cols = Math.max(1, Math.ceil((b.maxX - b.minX) / cell) + 1);
  const rows = Math.max(1, Math.ceil((b.maxY - b.minY) / cell) + 1);

  const lists: number[][] = Array.from({ length: cols * rows }, () => []);
  map.provinces.forEach((p, i) => {
    let lo = Infinity;
    let hi = -Infinity;
    let lo2 = Infinity;
    let hi2 = -Infinity;
    for (const v of p.polygon) {
      if (v.x < lo) lo = v.x;
      if (v.x > hi) hi = v.x;
      if (v.y < lo2) lo2 = v.y;
      if (v.y > hi2) hi2 = v.y;
    }
    if (lo === Infinity) return;
    const c0 = Math.max(0, Math.floor((lo - b.minX) / cell));
    const c1 = Math.min(cols - 1, Math.floor((hi - b.minX) / cell));
    const r0 = Math.max(0, Math.floor((lo2 - b.minY) / cell));
    const r1 = Math.min(rows - 1, Math.floor((hi2 - b.minY) / cell));
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) lists[r * cols + c]!.push(i);
    }
  });

  return {
    minX: b.minX,
    minY: b.minY,
    cell,
    cols,
    rows,
    buckets: lists.map((l) => Int32Array.from(l)),
  };
}

// ───────────────────────────────────────────────────────── geometri ─────

export function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * İki il arasındaki GERÇEK mesafe (metre), büyük daire üzerinden.
 *
 * Eşdikdörtgen çizim koordinatlarından Öklit mesafesi almak dünya
 * haritasında 60° enlemde iki kat hata verir; hareket ve ikmal buna bağlı
 * olduğu için haversine şart.
 */
export function provinceDist(a: ProvinceId, b: ProvinceId): number {
  const p = prov(a);
  const q = prov(b);
  const la = p.lat * DEG;
  const lb = q.lat * DEG;
  const dLat = lb - la;
  const dLon = (q.lon - p.lon) * DEG;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la) * Math.cos(lb) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Nokta çokgenin içinde mi (ray casting). */
export function pointInPolygon(pt: Vec2, poly: readonly Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!;
    const b = poly[j]!;
    if (a.y > pt.y !== b.y > pt.y && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

/** Çizim konumundan ili bul. Uzamsal ızgara kullanır. */
export function provinceAt(pt: Vec2): Province | null {
  const { grid, map } = current();
  const c = Math.floor((pt.x - grid.minX) / grid.cell);
  const r = Math.floor((pt.y - grid.minY) / grid.cell);
  if (c < 0 || r < 0 || c >= grid.cols || r >= grid.rows) return null;
  const bucket = grid.buckets[r * grid.cols + c];
  if (!bucket) return null;

  let best: Province | null = null;
  let bestD = Infinity;
  for (const i of bucket) {
    const p = map.provinces[i]!;
    const d = dist(pt, p.center);
    if (d < bestD && pointInPolygon(pt, p.polygon)) {
      best = p;
      bestD = d;
    }
  }
  return best;
}

/** Bir noktanın doğru parçasına en kısa uzaklığı (metre). */
export function distToSegment(p: Vec2, a: Vec2, b: Vec2): number {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const len2 = vx * vx + vy * vy;
  if (len2 < 1e-9) return dist(p, a);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2));
  return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
}

/**
 * İl grafiğinde en kısa yol (A*, kenar maliyeti gerçek mesafe × arazi).
 * Açık küme ikili yığın — dünya grafiğinde doğrusal tarama kabul edilemez.
 */
export function findPath(
  from: ProvinceId,
  to: ProvinceId,
  passable: (id: ProvinceId) => boolean,
  cost: (id: ProvinceId) => number = () => 1,
  maxExpansions = 60000,
): ProvinceId[] | null {
  if (from === to) return [];
  const open = new MinHeap<ProvinceId>();
  open.push(from, 0);
  const g = new Map<ProvinceId, number>([[from, 0]]);
  const prev = new Map<ProvinceId, ProvinceId>();
  const closed = new Set<ProvinceId>();

  let expansions = 0;
  while (open.size > 0) {
    const cur = open.pop()!;
    if (closed.has(cur)) continue;
    if (cur === to) {
      const path: ProvinceId[] = [];
      for (let n: ProvinceId | undefined = to; n && n !== from; n = prev.get(n)) path.unshift(n);
      return path;
    }
    closed.add(cur);
    if (++expansions > maxExpansions) return null;

    const gCur = g.get(cur)!;
    for (const nb of prov(cur).neighbours) {
      if (closed.has(nb)) continue;
      if (nb !== to && !passable(nb)) continue;
      const gNext = gCur + provinceDist(cur, nb) * cost(nb);
      if (gNext < (g.get(nb) ?? Infinity)) {
        g.set(nb, gNext);
        prev.set(nb, cur);
        open.push(nb, gNext + provinceDist(nb, to));
      }
    }
  }
  return null;
}

/**
 * İl listesini coğrafi kutuya kırp ve kopan komşulukları temizle.
 *
 * Cephe senaryoları dünya haritasının bir dikdörtgenini oynatır. Kutu dışında
 * kalan illere yapılan komşuluk atıfları bırakılırsa `prov()` bilinmeyen il
 * hatası verir; bu yüzden kenarlar da budanır.
 */
function clipToBox(
  list: readonly Province[],
  bbox: readonly [number, number, number, number],
  meta: Record<ProvinceId, WorldMeta>,
): Province[] {
  const [w, s, e, n] = bbox;
  const inside = new Set<ProvinceId>();
  for (const p of list) {
    if (p.lon >= w && p.lon <= e && p.lat >= s && p.lat <= n) inside.add(p.id);
  }
  // Kutunun hemen dışındaki denizleri de al: kıyı cephelerinde donanma ve
  // çıkarma için su lazım.
  for (const p of list) {
    if (!p.isSea || inside.has(p.id)) continue;
    if (p.neighbours.some((q) => inside.has(q))) inside.add(p.id);
  }

  const out: Province[] = [];
  for (const p of list) {
    if (!inside.has(p.id)) {
      delete meta[p.id];
      continue;
    }
    out.push({ ...p, neighbours: p.neighbours.filter((q) => inside.has(q)) });
  }
  return out;
}
