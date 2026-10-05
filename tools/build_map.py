#!/usr/bin/env python3
"""Çanakkale harita derleyicisi.

Girdi
  tools/data/elev.npz    — AWS Terrain Tiles (terrarium) z12 yükseklik ızgarası
  tools/data/places.json — Nominatim ile koordinatlanmış yer adları

Çıktı
  src/data/map.json      — iller, kıyı halkaları, nirengi noktaları, sınırlar
  public/relief.png      — çizim için yükseklik + kara maskesi dokusu

Yöntem
  1. Deniz maskesi: terrarium'da deniz tam 0 m'dir. Kenardan flood-fill ile
     denizi ayır; iç kalan 0'lar göl/bataklık (Suvla Tuz Gölü) olarak kalır.
  2. İl bölünmesi: her hücre, KENDİ ORTAMINDAKİ (kara/deniz) en yakın tohuma
     atanır. Voronoi kıyıyı kesmez; iller sahili takip eder — HOI4'teki gibi.
  3. Çokgenleştirme: her il etiketinin sınırı marching-squares ile çıkarılır,
     Douglas-Peucker ile sadeleştirilir.
  4. Komşuluk: etiket ızgarasında ortak kenar pikseli sayısı eşiği aşarsa komşu.
"""
from __future__ import annotations

import json
import math
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.spatial import cKDTree
from skimage import measure, segmentation

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLACES = os.path.join(ROOT, "tools", "data", "places.json")

# ─────────────────────────────────────────────────────────── bölgeler ─────
# Her ayrıntılı tiyatro kendi yükseklik ızgarasından derlenir. Sayılar
# ÖLÇEĞE bağlıdır: Çanakkale 60 km'lik bir boğaz, Kafkas 450 km'lik bir dağ
# cephesi. Aynı sadeleştirme toleransı ve tiyatro yarıçapı ikisine birden
# uymaz.
#
# Çanakkale değerleri birebir korundu: `python3 tools/build_map.py` aynı
# haritayı yeniden üretir.
REGIONS: dict[str, dict] = {
    "canakkale": dict(
        elev="elev.npz", z=12, step=2,
        simplify_m=70.0, coast_simplify_m=35.0,
        min_ring_cells=220, min_contact=6,
        theatre_radius_m=20000.0,
        origin=(26.40, 40.15),        # boğazın ortası
        out_json="map.json", out_png="relief.png",
        seeds="seeds_canakkale",
    ),
    "kafkas": dict(
        elev="elev-kafkas.npz", z=10, step=1,
        simplify_m=900.0, coast_simplify_m=600.0,
        min_ring_cells=160, min_contact=4,
        theatre_radius_m=70000.0,
        origin=(41.90, 40.30),        # Sarıkamış-Erzurum ekseninin ortası
        out_json="map-kafkas.json", out_png="relief-kafkas.png",
        seeds="seeds_kafkas",
    ),
    "mezopotamya": dict(
        elev="elev-mezopotamya.npz", z=10, step=1,
        simplify_m=1100.0, coast_simplify_m=700.0,
        min_ring_cells=160, min_contact=4,
        theatre_radius_m=90000.0,
        origin=(45.90, 32.10),        # Dicle-Fırat arası, Kut hizası
        out_json="map-mezopotamya.json", out_png="relief-mezopotamya.png",
        seeds="seeds_mezopotamya",
    ),
    "sina": dict(
        elev="elev-sina.npz", z=10, step=1,
        simplify_m=900.0, coast_simplify_m=600.0,
        min_ring_cells=160, min_contact=4,
        theatre_radius_m=80000.0,
        origin=(34.30, 31.20),        # Gazze-Birüssebi ekseni
        out_json="map-sina.json", out_png="relief-sina.png",
        seeds="seeds_sina",
    ),
}

# main() bunları seçilen bölgeden doldurur.
ELEV = OUT_JSON = OUT_PNG = ""
Z = STEP = MIN_RING_CELLS = MIN_CONTACT = 0
SIMPLIFY_M = COAST_SIMPLIFY_M = THEATRE_RADIUS_M = 0.0
LON0 = LAT0 = 0.0
SEEDS: list[dict] = []
M_PER_DEG_LAT = 110574.0


def select_region(name: str) -> None:
    """Modül düzeyindeki ölçek sabitlerini seçilen bölgeye göre doldurur."""
    global ELEV, OUT_JSON, OUT_PNG, Z, STEP, SIMPLIFY_M, COAST_SIMPLIFY_M
    global MIN_RING_CELLS, MIN_CONTACT, THEATRE_RADIUS_M, LON0, LAT0, SEEDS
    cfg = REGIONS[name]
    ELEV = os.path.join(ROOT, "tools", "data", cfg["elev"])
    OUT_JSON = os.path.join(ROOT, "src", "data", cfg["out_json"])
    OUT_PNG = os.path.join(ROOT, "public", cfg["out_png"])
    Z = cfg["z"]
    STEP = cfg["step"]
    SIMPLIFY_M = cfg["simplify_m"]
    COAST_SIMPLIFY_M = cfg["coast_simplify_m"]
    MIN_RING_CELLS = cfg["min_ring_cells"]
    MIN_CONTACT = cfg["min_contact"]
    THEATRE_RADIUS_M = cfg["theatre_radius_m"]
    LON0, LAT0 = cfg["origin"]
    mod = __import__(cfg["seeds"])
    SEEDS = mod.SEEDS


def y2lat(y: float, z: int) -> float:
    return math.degrees(math.atan(math.sinh(math.pi * (1.0 - 2.0 * y / (1 << z)))))


def x2lon(x: float, z: int) -> float:
    return x / (1 << z) * 360.0 - 180.0


def project(lon: np.ndarray | float, lat: np.ndarray | float):
    """WGS84 -> yerel eşdikdörtgen metre. Doğu +x, kuzey -y (ekran düzeni)."""
    x = (np.asarray(lon) - LON0) * math.cos(math.radians(LAT0)) * 111320.0
    y = -(np.asarray(lat) - LAT0) * M_PER_DEG_LAT
    return x, y




def douglas_peucker(pts: np.ndarray, tol: float) -> np.ndarray:
    """Çokgen sadeleştirme. pts: (N,2). Halka ise ilk==son beklenir."""
    if len(pts) < 3:
        return pts
    keep = np.zeros(len(pts), dtype=bool)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        a, b = pts[i], pts[j]
        ab = b - a
        n2 = ab @ ab
        seg = pts[i + 1 : j] - a
        if n2 < 1e-12:
            d = np.hypot(seg[:, 0], seg[:, 1])
        else:
            t = np.clip((seg @ ab) / n2, 0.0, 1.0)
            proj = t[:, None] * ab
            d = np.hypot(seg[:, 0] - proj[:, 0], seg[:, 1] - proj[:, 1])
        k = int(np.argmax(d))
        if d[k] > tol:
            m = i + 1 + k
            keep[m] = True
            stack.append((i, m))
            stack.append((m, j))
    return pts[keep]


def ring_area(pts: np.ndarray) -> float:
    x, y = pts[:, 0], pts[:, 1]
    return 0.5 * float(np.sum(x * np.roll(y, -1) - np.roll(x, -1) * y))


def main() -> None:
    region = sys.argv[1] if len(sys.argv) > 1 else "canakkale"
    if region not in REGIONS:
        sys.exit(f"bilinmeyen bölge: {region} (seçenekler: {', '.join(REGIONS)})")
    select_region(region)
    print(f"── {region} ──")
    if not os.path.exists(ELEV):
        sys.exit(f"{ELEV} yok — önce tools/fetch_terrain.py {region} çalıştır")
    # `places.json` yalnız OSM adıyla konan tohumlar için gerekir; koordinatı
    # doğrudan verilen bölgeler onsuz derlenir.
    if any("place" in s for s in SEEDS) and not os.path.exists(PLACES):
        sys.exit(f"{PLACES} yok — önce tools/geocode.py çalıştır")

    blob = np.load(ELEV)
    full = blob["elev"]
    bbox = blob["bbox"].tolist()
    tx0, ty0 = int(blob["x0"]), int(blob["y0"])
    elev = full[::STEP, ::STEP].astype(np.int16)
    H, W = elev.shape
    print(f"ızgara {W}x{H}  bbox={[round(v, 4) for v in bbox]}")

    # ── 1. Deniz maskesi ──────────────────────────────────────────────────
    water = elev <= 0
    lab, n = ndimage.label(water)
    border = set(lab[0].tolist()) | set(lab[-1].tolist())
    border |= set(lab[:, 0].tolist()) | set(lab[:, -1].tolist())
    border.discard(0)
    sea = np.isin(lab, list(border))
    land = ~sea
    lake = water & ~sea
    print(f"deniz %{100 * sea.mean():.1f}  kara %{100 * land.mean():.1f}  "
          f"iç su %{100 * lake.mean():.2f} ({n} su bileşeni)")

    # ── 2. Piksel -> coğrafi -> metre arama tabloları ─────────────────────
    cols = np.arange(W)
    rows = np.arange(H)
    lons = np.array([x2lon(tx0 + (c * STEP + STEP / 2) / 256.0, Z) for c in cols])
    lats = np.array([y2lat(ty0 + (r * STEP + STEP / 2) / 256.0, Z) for r in rows])
    xs, _ = project(lons, np.full(W, LAT0))
    _, ys = project(np.full(H, LON0), lats)
    print(f"çözünürlük ~{abs(xs[1] - xs[0]):.0f} m/px (x), "
          f"~{abs(ys[1] - ys[0]):.0f} m/px (y)")

    def to_m(rc: np.ndarray) -> np.ndarray:
        """(N,2) [row, col] kesirli indeks -> (N,2) metre [x, y]."""
        r = np.clip(rc[:, 0], 0, H - 1)
        c = np.clip(rc[:, 1], 0, W - 1)
        return np.stack([np.interp(c, cols, xs), np.interp(r, rows, ys)], axis=1)

    # ── 3. Tohumları yerleştir ────────────────────────────────────────────
    with open(PLACES, encoding="utf-8") as fh:
        places = json.load(fh)

    seeds = []
    for s in SEEDS:
        if "place" in s:
            p = places.get(s["place"])
            if p is None:
                sys.exit(f"'{s['id']}' için yer bulunamadı: {s['place']} — "
                         f"tools/geocode.py'yi çalıştır")
            lon, lat, src = p["lon"], p["lat"], p["osm"]
        elif "lake_in_box" in s:
            # Kutu içindeki en büyük iç su kütlesinin ağırlık merkezi.
            bw, bs, be, bn = s["lake_in_box"]
            c0 = int(np.interp(bw, lons, cols))
            c1 = int(np.interp(be, lons, cols))
            r0 = int(np.interp(bn, lats[::-1], rows[::-1]))
            r1 = int(np.interp(bs, lats[::-1], rows[::-1]))
            sub = lake[r0:r1, c0:c1]
            sublab, subn = ndimage.label(sub)
            if subn == 0:
                sys.exit(f"'{s['id']}': kutuda iç su kütlesi yok {s['lake_in_box']}")
            sizes = ndimage.sum_labels(sub, sublab, range(1, subn + 1))
            biggest = int(np.argmax(sizes)) + 1
            cy, cx = ndimage.center_of_mass(sublab == biggest)
            r, c = int(r0 + cy), int(c0 + cx)
            lon, lat = float(lons[c]), float(lats[r])
            src = f"yükseklik ızgarası iç su kütlesi ({int(sizes[biggest - 1])} hücre)"
            print(f"  · {s['id']}: iç su kütlesinden türetildi {lon:.4f},{lat:.4f}")
        else:
            lon, lat = s["lonlat"]
            # Koordinatın NEREDEN geldiği kayda geçer. Deniz illeri ve
            # coğrafî bölütler oyun tasarımı gereği seçilir; gerçek bir
            # yerleşimin koordinatı verildiyse tohum kendi kaynağını söyler.
            src = s.get("src", "tasarım")
        c = int(np.clip(np.interp(lon, lons, cols), 0, W - 1))
        r = int(np.clip(np.interp(lat, lats[::-1], rows[::-1]), 0, H - 1))
        want_sea = s["kind"] == "sea"
        if bool(sea[r, c]) != want_sea:
            # Doğru ortamdaki en yakın hücreye kaydır (kıyı kenarındaki tohumlar).
            mask = sea if want_sea else land
            dist, idx = ndimage.distance_transform_edt(
                ~mask, return_indices=True, return_distances=True
            )
            r2, c2 = int(idx[0][r, c]), int(idx[1][r, c])
            shift = dist[r, c] * abs(xs[1] - xs[0])
            print(f"  · {s['id']}: tohum {'deniz' if want_sea else 'kara'}a "
                  f"{shift:.0f} m kaydırıldı")
            r, c = r2, c2
        seeds.append({**s, "lon": lon, "lat": lat, "row": r, "col": c, "geo_src": src})

    # ── 3b. Tiyatro sınırı ────────────────────────────────────────────────
    # Haritayı muharebe alanıyla sınırla: hiçbir tohuma THEATRE_RADIUS_M'den
    # yakın olmayan hücreler oyun dışıdır. Aksi halde Trakya ve Biga yarımadası
    # içleri tek bir devasa ile dönüşüyor (Lâpseki 2443 km² olmuştu).
    cell_m = (abs(xs[1] - xs[0]) + abs(ys[1] - ys[0])) / 2.0
    seed_rc = np.array([[s["row"], s["col"]] for s in seeds], dtype=np.float64)
    gr, gc = np.mgrid[0:H, 0:W]
    dist_cells, _ = cKDTree(seed_rc).query(
        np.stack([gr.ravel(), gc.ravel()], axis=1), workers=-1
    )
    theatre = (dist_cells.reshape(H, W) * cell_m) <= THEATRE_RADIUS_M
    # Rölyef dokusu ve kıyı çizgisi TAM karayı kullanır (videodaki gibi bağlam
    # için tüm bölge çizilir); yalnız il bölünmesi tiyatroyla sınırlıdır.
    land_full = land.copy()
    land &= theatre
    sea &= theatre
    lake &= theatre
    print(f"tiyatro: {THEATRE_RADIUS_M / 1000:.0f} km yarıçap, "
          f"ızgaranın %{100 * theatre.mean():.1f}'i, "
          f"oynanabilir kara %{100 * land.mean():.1f}")

    # ── 4. İl atama: maske içinde jeodezik Voronoi ───────────────────────
    # Öklit Voronoi KULLANILAMAZ: düz çizgi mesafesi suyu umursamadığı için
    # Bozcaada tohumu karşı kıyıdaki Anadolu sahilini yutuyordu.
    # DÜZ bir yüzey üzerinde, maskeyle sınırlı havza bölütlemesi kullanılır:
    # her tohum yalnızca kendi ortamı içinde yayılır, iller bitişik kalır.
    #
    # (Yükseklik gradyanı üzerinde havza denendi ve başarısız oldu: yamaca düşen
    #  tohumlar anında hapsolup 1 hücrede kalırken düzlükteki tohumlar her şeyi
    #  yuttu — Seddülbahir 1 hücre, Tuz Gölü 368 km². Düz yüzey doğru olan.)
    markers = np.zeros((H, W), dtype=np.int32)
    for i, s in enumerate(seeds):
        markers[s["row"], s["col"]] = i + 1

    labels = np.zeros((H, W), dtype=np.int32)
    flat = np.zeros((H, W), dtype=np.float32)
    for want_sea, medium in ((False, land), (True, sea)):
        mine = [i + 1 for i, s in enumerate(seeds) if (s["kind"] == "sea") == want_sea]
        mk = np.where(np.isin(markers, mine), markers, 0)
        part = segmentation.watershed(flat, mk, mask=medium, connectivity=1)
        labels[medium] = part[medium]
    # İç sular (Tuz Gölü) kara iline dahil kalır — `land` onları içerir.

    # Tohumsuz kopuk adacıklar/koylar: en yakın atanmış hücrenin iline ver.
    gap = (labels == 0) & (land | sea)
    if gap.any():
        _, idx = ndimage.distance_transform_edt(
            labels == 0, return_indices=True, return_distances=True
        )
        labels[gap] = labels[idx[0][gap], idx[1][gap]]
        print(f"  · {int(gap.sum())} kopuk hücre en yakın ile eklendi")

    # ── 5. Çokgenleştirme ─────────────────────────────────────────────────
    provinces = []
    for i, s in enumerate(seeds):
        mask = labels == (i + 1)
        cells = int(mask.sum())
        if cells == 0:
            sys.exit(f"'{s['id']}' iline hiç hücre düşmedi — tohumları gözden geçir")
        padded = np.pad(mask.astype(np.float32), 1)
        contours = measure.find_contours(padded, 0.5)
        if not contours:
            sys.exit(f"'{s['id']}' için sınır bulunamadı")
        contours.sort(key=len, reverse=True)
        ring_px = contours[0] - 1.0
        ring = douglas_peucker(to_m(ring_px), SIMPLIFY_M)
        if ring_area(ring) < 0:
            ring = ring[::-1]

        ev = elev[mask]
        land_cells = int(land[mask].sum())
        is_sea = s["kind"] == "sea"
        centre_m = to_m(np.array([[s["row"], s["col"]]], dtype=np.float64))[0]
        provinces.append({
            "id": s["id"],
            "name": s["name"],
            "isSea": is_sea,
            "terrain": s["terrain"],
            "center": {"x": round(float(centre_m[0]), 1), "y": round(float(centre_m[1]), 1)},
            "polygon": [{"x": round(float(p[0]), 1), "y": round(float(p[1]), 1)} for p in ring],
            "elevation": 0 if is_sea else int(ev[ev > 0].mean()) if (ev > 0).any() else 0,
            "peak": 0 if is_sea else int(ev.max()),
            "areaKm2": round(cells * abs(xs[1] - xs[0]) * abs(ys[1] - ys[0]) / 1e6, 1),
            "victoryPoints": s["vp"],
            "supplyHub": s["supply"],
            "startOwner": s["owner"],
            "landCells": land_cells,
            "lon": round(s["lon"], 5),
            "lat": round(s["lat"], 5),
            "geoSrc": s["geo_src"],
            **({"straitWidth": s["width"]} if "width" in s else {}),
            **({"current": s["current"]} if "current" in s else {}),
            **({"beach": True} if s.get("beach") else {}),
        })
        print(f"  {s['id']:18s} {cells:7d} hücre  {provinces[-1]['areaKm2']:7.1f} km²  "
              f"zirve {provinces[-1]['peak']:4d} m  köşe {len(ring)}")

    # ── 6. Komşuluk ───────────────────────────────────────────────────────
    contact: dict[tuple[int, int], int] = {}
    for da, db in ((labels[:, :-1], labels[:, 1:]), (labels[:-1], labels[1:])):
        diff = (da != db) & (da > 0) & (db > 0)
        for a, b in zip(da[diff], db[diff]):
            k = (int(min(a, b)), int(max(a, b)))
            contact[k] = contact.get(k, 0) + 1

    neighbours: dict[str, list[str]] = {p["id"]: [] for p in provinces}
    for (a, b), cnt in sorted(contact.items()):
        if cnt < MIN_CONTACT:
            continue
        ia, ib = seeds[a - 1]["id"], seeds[b - 1]["id"]
        neighbours[ia].append(ib)
        neighbours[ib].append(ia)
    for p in provinces:
        p["neighbours"] = sorted(neighbours[p["id"]])
        p["beachAccess"] = sorted(
            n for n in neighbours[p["id"]]
            if next(q for q in provinces if q["id"] == n)["isSea"]
        ) if p.get("beach") else []

    orphan = [p["id"] for p in provinces if not p["neighbours"]]
    if orphan:
        sys.exit(f"komşusuz il(ler): {orphan} — MIN_CONTACT çok yüksek olabilir")

    # ── 7. Kıyı halkaları (yalnız çizim) ─────────────────────────────────
    coast_rings = []
    padded = np.pad(land_full.astype(np.float32), 1)
    for ring_px in measure.find_contours(padded, 0.5):
        if len(ring_px) < MIN_RING_CELLS:
            continue
        ring = douglas_peucker(to_m(ring_px - 1.0), COAST_SIMPLIFY_M)
        if len(ring) < 8:
            continue
        coast_rings.append([[round(float(p[0]), 1), round(float(p[1]), 1)] for p in ring])
    coast_rings.sort(key=len, reverse=True)
    print(f"kıyı halkası: {len(coast_rings)} "
          f"(en büyük {len(coast_rings[0])} köşe)")

    # ── 8. Rölyef dokusu ─────────────────────────────────────────────────
    RW, RH = 1280, int(1280 * H / W)
    img = Image.fromarray(elev.astype(np.int32) + 1000).resize((RW, RH), Image.BILINEAR)
    enc = np.asarray(img, dtype=np.int32)
    land_small = np.asarray(
        Image.fromarray(land_full.astype(np.uint8) * 255).resize((RW, RH), Image.BILINEAR)
    )
    rgb = np.zeros((RH, RW, 3), dtype=np.uint8)
    rgb[:, :, 0] = (enc >> 8) & 0xFF   # yükseklik üst bayt  (h = R*256+G-1000)
    rgb[:, :, 1] = enc & 0xFF          # yükseklik alt bayt
    rgb[:, :, 2] = land_small          # kara maskesi (yumuşatılmış kıyı)
    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    Image.fromarray(rgb).save(OUT_PNG, optimize=True)
    print(f"rölyef {RW}x{RH} -> {OUT_PNG} ({os.path.getsize(OUT_PNG) // 1024} KB)")

    # ── 9. Sınırlar + yaz ────────────────────────────────────────────────
    allpts = np.concatenate([
        np.array([[c["x"], c["y"]] for c in p["polygon"]]) for p in provinces
    ])
    out = {
        "_source": {
            "elevation": f"AWS Terrain Tiles (terrarium) z{Z} — "
                         "https://registry.opendata.aws/terrain-tiles/",
            "places": "OpenStreetMap / Nominatim (ODbL) — "
                      "https://nominatim.openstreetmap.org/",
            "note": "Kıyı çizgisi 0 m yükseklik eşiğinden türetilmiştir (günümüz kıyısı). "
                    "Deniz illerinin merkezleri oyun tasarımı gereği seçilmiştir.",
        },
        "origin": {"lon": LON0, "lat": LAT0},
        "bounds": {
            "minX": round(float(allpts[:, 0].min()), 1),
            "minY": round(float(allpts[:, 1].min()), 1),
            "maxX": round(float(allpts[:, 0].max()), 1),
            "maxY": round(float(allpts[:, 1].max()), 1),
        },
        "relief": {
            "image": "relief.png",
            "width": RW,
            "height": RH,
            "minX": round(float(xs[0]), 1),
            "minY": round(float(ys[0]), 1),
            "maxX": round(float(xs[-1]), 1),
            "maxY": round(float(ys[-1]), 1),
            "encoding": "h = R*256 + G - 1000 (m); B = kara maskesi",
        },
        "provinces": provinces,
        "coastRings": coast_rings,
    }
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(provinces)} il -> {OUT_JSON} "
          f"({os.path.getsize(OUT_JSON) // 1024} KB)")

    sea_n = sum(1 for p in provinces if p["isSea"])
    print(f"  kara {len(provinces) - sea_n}, deniz {sea_n}, "
          f"kenar {sum(len(p['neighbours']) for p in provinces) // 2}")


if __name__ == "__main__":
    main()
