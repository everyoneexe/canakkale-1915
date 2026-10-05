/**
 * Arazi mozaiği — AWS Terrain Tiles (terrarium) karolarından, istenen
 * pencere için gölgelendirilmiş tek bir görüntü üretir.
 *
 * İKİ tüketicisi var ve ikisi de aynı görüntüyü ister:
 *
 * * `render/tiles.ts` — Çanakkale haritasında Pixi sprite olarak serer.
 * * `ui/globe.ts`     — cephe seçme küresinde WebGL dokusu olarak bindirir.
 *
 * Bu yüzden karo indirme, önbellek, Mercator→eşdikdörtgen yeniden örnekleme
 * ve gölgelendirme burada tek yerde durur. Kopyalansaydı iki yüzey farklı
 * parlaklıkta olurdu.
 *
 * Tasarım kararları:
 *
 * * **Tek mozaik, çok karo.** Her karoyu ayrı görüntü yapmak tepe gölgelemesi
 *   için komşu piksel bırakmaz ve karo sınırlarında 1 px'lik ızgara çizgileri
 *   oluşur. Karolar önce tek bir yükseklik ızgarasına dizilir, gölge ızgaranın
 *   tamamında hesaplanır: iç sınırlarda gerçek komşular var, dikiş yok.
 * * **CPU'da gölgelendirme.** Özel bir GPU geçişine kıyasla çok daha az
 *   kırılgan; iş zaten yalnız pencere durulunca bir kez yapılıyor.
 * * **Mercator → eşdikdörtgen.** Karolar Web Mercator; hem oyun haritası hem
 *   küre dokusu enlemde doğrusal. Yeniden örnekleme satır bazında yapılır.
 */

const BASE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium';

/** Paketteki `world-relief.webp` 4096 px / 360°. */
export const BASE_PX_PER_DEG = 4096 / 360;

/**
 * Gölge sertliği. TÜM rölyef katmanları bu yasaya uyar.
 *
 * `np.gradient` piksel başına Δyükseklik verir; çözünürlük arttıkça küçülür,
 * hiç telafi edilmezse aynı yamaç ince kademede sönük çıkar. Tam telafi
 * (zs ∝ px/derece) ters uca savurur: 10 km/piksel veride %0,5 ölçülen bir
 * yamaç 11 m/piksel veride gerçek %30 eğimini gösterir, çarpan sabit kalınca
 * gölge doyar ve arazi kumlu bir kabartmaya döner. 0,18 üssü iki ucun arası.
 */
export function zscale(pxPerDeg: number): number {
  return 0.04 * (pxPerDeg / BASE_PX_PER_DEG) ** 0.18;
}

/** z4 tam olarak zemin dokusu kadar; ilk kazanç z5'te. */
const MIN_Z = 5;
/** z13 ≈ 11 m/piksel. Daha ötesi hem ağır hem veride karşılığı yok. */
const MAX_Z = 13;
/** Mozaik kenarı en çok bu kadar karo — doku 4096 px sınırında kalsın. */
const MAX_TILES_PER_AXIS = 16;
/**
 * Mozaik toplam piksel tavanı. Gölgelendirme CPU'da; 16 milyon piksel
 * saniyeler sürer ve geniş görünümlerde zaten zemin dokusu yeterli.
 */
const MAX_MOSAIC_PX = 6e6;

export interface LatLonBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface Mosaic extends LatLonBox {
  readonly canvas: HTMLCanvasElement;
  /** Aynı pencere iki kez işlenmesin diye istek imzası. */
  readonly key: string;
}

function lat2tileY(lat: number, n: number): number {
  return ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * n;
}

function tileY2lat(y: number, n: number): number {
  return (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
}

/** Çözülmüş yükseklik karoları; anahtar `z/x/y`. Tüketiciler paylaşır. */
const cache = new Map<string, Int16Array>();

async function fetchTile(z: number, x: number, y: number): Promise<void> {
  const k = `${z}/${x}/${y}`;
  if (cache.has(k)) return;
  const res = await fetch(`${BASE}/${z}/${x}/${y}.png`);
  if (!res.ok) {
    cache.set(k, new Int16Array(256 * 256));
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
  cache.set(k, out);
}

/**
 * İstenen pencere için mozaik üretir.
 *
 * @param view     görünen alan, derece
 * @param pxPerDeg ekranda boylam derecesi başına piksel
 * @param lastKey  önceki sonucun imzası; aynıysa `null` döner
 * @returns zemin dokusu yeterliyse veya pencere değişmediyse `null`
 */
export async function buildMosaic(
  view: LatLonBox,
  pxPerDeg: number,
  lastKey: string,
): Promise<Mosaic | null> {
  if (pxPerDeg <= BASE_PX_PER_DEG * 1.3) return null;

  // Ekranın istediği çözünürlüğü karşılayan en küçük z.
  let z = MIN_Z;
  while (z < MAX_Z && (256 * (1 << z)) / 360 < pxPerDeg) z++;

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
  if (x1 < x0 || y1 < y0) return null;

  const key = `${z}/${x0}-${x1}/${y0}-${y1}`;
  if (key === lastKey) return null;

  const jobs: Promise<void>[] = [];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) jobs.push(fetchTile(z, x, y));
  }
  await Promise.all(jobs);

  // Önbellek sınırsız büyümesin: karo başına 128 KB, 1400 karo 180 MB
  // demekti ve sekme çöküyordu. 400 karo ≈ 52 MB.
  if (cache.size > 400) {
    let drop = cache.size - 280;
    for (const k of cache.keys()) {
      if (drop-- <= 0) break;
      cache.delete(k);
    }
  }

  return compose(z, x0, x1, y0, y1, key);
}

function compose(
  z: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  key: string,
): Mosaic {
  const n = 1 << z;
  const span = 360 / n;
  const tx = x1 - x0 + 1;
  const ty = y1 - y0 + 1;
  const mw = tx * 256;
  const mh = ty * 256;

  // 1) Mercator yükseklik ızgarası.
  const merc = new Int16Array(mw * mh);
  for (let ry = 0; ry < ty; ry++) {
    for (let rx = 0; rx < tx; rx++) {
      const t = cache.get(`${z}/${x0 + rx}/${y0 + ry}`);
      if (!t) continue;
      for (let r = 0; r < 256; r++) {
        merc.set(
          t.subarray(r * 256, r * 256 + 256),
          (ry * 256 + r) * mw + rx * 256,
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

  // 3) Gölgelendirme — zemin dokusu ve tiyatro rölyefiyle aynı dil.
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

  return { canvas: cv, west, south, east, north, key };
}
