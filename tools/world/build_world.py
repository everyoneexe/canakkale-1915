#!/usr/bin/env python3
"""Dünya haritası derleyicisi — 1914 senaryosu için ~5.000 il.

Girdi
  tools/world/data/world_elev.npz                     yükseklik (eşdikdörtgen)
  tools/world/ne_10m_admin_1_states_provinces.geojson 4.596 idari bölüm
  tools/world/ne_10m_geography_marine_polys.geojson   306 adlandırılmış deniz
  tools/world/world_1914.geojson                      177 ülke, 1914 sınırları

Çıktı
  src/data/world.json        iller, kom\u015fuluk, 1914 sahipliği
  public/world-relief.png    çizim dokusu (yükseklik + kara maskesi)

Yöntem — Çanakkale boru hattıyla aynı: her şey tek bir ETİKET IZGARASINDAN
türetilir. Çokgenler ızgaradan geri çıkarıldığı için sınırlar ile komşuluk
bilgisi birebir tutarlı olur; vektörleri ayrıca sadeleştirip komşuluğu ayrı
hesaplamaya göre çok daha sağlam.

Antimeridyen notu: ±180°'yi geçen bölgeler (Çukotka, Fiji) GeoJSON'da zaten
iki parçaya bölünmüş durumda; ızgara bunu doğal olarak taşır, en büyük parça
çokgen olarak alınır.
"""
from __future__ import annotations

import json
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
from scipy import ndimage
from scipy.spatial import cKDTree
from skimage import measure

import nations_1914
import nations_1939

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
ELEV = os.path.join(HERE, "data", "world_elev.npz")
ADMIN1 = os.path.join(HERE, "ne_10m_admin_1_states_provinces.geojson")
MARINE = os.path.join(HERE, "ne_10m_geography_marine_polys.geojson")
WORLD1914 = os.path.join(HERE, "world_1914.geojson")
WORLD1938 = os.path.join(HERE, "world_1938.geojson")
OUT_JSON = os.path.join(ROOT, "src", "data", "world.json")
OUT_PNG = os.path.join(ROOT, "public", "world-relief.webp")

LAT_LIM = 82.0
# Deniz ili tohum aralığı (km). ~900 km -> ~450 deniz ili.
SEA_SPACING_KM = 900.0
# Bu kadar hücreden küçük kara illeri atılır (ada kalıntıları, mikro birimler).
MIN_LAND_CELLS = 6
# Çokgen sadeleştirme toleransı (derece). ~0.12° ≈ 13 km.
SIMPLIFY_DEG = 0.12
# Komşuluk için gereken asgari temas pikseli.
MIN_CONTACT = 2

M_PER_DEG = 111320.0


# ────────────────────────────────────────────────────── yardımcılar ─────

def rings_of(geom: dict):
    """GeoJSON geometrisinden (dış halka, [iç halkalar]) çiftleri üret."""
    t = geom["type"]
    if t == "Polygon":
        polys = [geom["coordinates"]]
    elif t == "MultiPolygon":
        polys = geom["coordinates"]
    else:
        return
    for poly in polys:
        if not poly:
            continue
        yield poly[0], poly[1:]


def ring_area_deg(ring) -> float:
    a = 0.0
    n = len(ring)
    for i in range(n):
        x1, y1 = ring[i][0], ring[i][1]
        x2, y2 = ring[(i + 1) % n][0], ring[(i + 1) % n][1]
        a += x1 * y2 - x2 * y1
    return abs(a) / 2.0


def douglas_peucker(pts: np.ndarray, tol: float) -> np.ndarray:
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
        if n2 < 1e-15:
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


def slug(s: str) -> str:
    out = []
    for ch in s.lower():
        if ch.isalnum():
            out.append(ch)
        elif ch in " -/.,'":
            out.append("_")
    t = "".join(out)
    while "__" in t:
        t = t.replace("__", "_")
    return t.strip("_") or "x"


# ──────────────────────────────────────────────────────────── ana ───────

def main() -> None:
    for p in (ELEV, ADMIN1, MARINE, WORLD1914, WORLD1938):
        if not os.path.exists(p):
            sys.exit(f"eksik girdi: {p}")

    blob = np.load(ELEV)
    elev = blob["elev"]
    H, W = elev.shape
    print(f"yükseklik ızgarası {W}×{H} (±{LAT_LIM}°)")

    def lon2col(lon):
        return (np.asarray(lon) + 180.0) / 360.0 * W

    def lat2row(lat):
        return (LAT_LIM - np.asarray(lat)) / (2 * LAT_LIM) * H

    def col2lon(c):
        return c / W * 360.0 - 180.0

    def row2lat(r):
        return LAT_LIM - r / H * (2 * LAT_LIM)

    # ── 1. Kara illerini rasterle ────────────────────────────────────
    with open(ADMIN1, encoding="utf-8") as fh:
        admin1 = json.load(fh)["features"]
    print(f"idari bölüm: {len(admin1)}")

    # Büyükten küçüğe çiz: küçük birimler (enklavlar) üste yazsın.
    sized = []
    for i, f in enumerate(admin1):
        area = sum(ring_area_deg(ext) for ext, _ in rings_of(f["geometry"]))
        sized.append((area, i))
    sized.sort(reverse=True)

    # Antarktika oyun dışı: kalıcı yerleşim, kaynak ve cephe yok.
    SKIP_ADMIN = {"Antarctica", "French Southern and Antarctic Lands",
                  "Heard Island and McDonald Islands", "Bouvet Island"}

    canvas = Image.new("I", (W, H), 0)
    draw = ImageDraw.Draw(canvas)
    meta: list[dict] = []
    skipped = 0
    for order, (_, i) in enumerate(sized):
        f = admin1[i]
        if (f["properties"].get("admin") or "") in SKIP_ADMIN:
            skipped += 1
            meta.append({"pid": order + 1, "name": "", "admin": "", "iso": "",
                         "type": "", "skip": True})
            continue
        pid = order + 1  # 0 = boş
        for ext, _holes in rings_of(f["geometry"]):
            xy = [(float(lon2col(c[0])), float(lat2row(c[1]))) for c in ext]
            if len(xy) >= 3:
                draw.polygon(xy, fill=pid)
        pr = f["properties"]
        meta.append(
            {
                "skip": False,
                "pid": pid,
                "name": pr.get("name") or pr.get("name_local") or f"Bölge {pid}",
                "admin": pr.get("admin") or "",
                "iso": pr.get("iso_3166_2") or "",
                "type": pr.get("type_en") or "",
            }
        )
    labels = np.asarray(canvas, dtype=np.int32).copy()
    land_mask = labels > 0
    print(f"  {skipped} idari bölüm atlandı (Antarktika ve çevresi)")
    print(f"kara maskesi: %{100 * land_mask.mean():.1f}")

    # ── 2. Deniz illeri: okyanus ızgarası üzerinde havza bölütlemesi ──
    sea_mask = ~land_mask
    deg_per_cell = 360.0 / W
    step_deg = SEA_SPACING_KM / (M_PER_DEG / 1000.0)
    step_cells = max(4, int(step_deg / deg_per_cell))

    seeds_rc = []
    for r in range(step_cells // 2, H, step_cells):
        lat = row2lat(r + 0.5)
        # Enlem yükseldikçe boylam aralığını genişlet: eşit alanlı tohumlar.
        cols_step = max(step_cells, int(step_cells / max(0.15, math.cos(math.radians(lat)))))
        for c in range(cols_step // 2, W, cols_step):
            if sea_mask[r, c]:
                seeds_rc.append((r, c))
    print(f"deniz tohumu: {len(seeds_rc)} (aralık ~{SEA_SPACING_KM:.0f} km)")

    sea_markers = np.zeros((H, W), dtype=np.int32)
    base = len(meta) + 1
    for k, (r, c) in enumerate(seeds_rc):
        sea_markers[r, c] = base + k
    from skimage import segmentation

    flat = np.zeros((H, W), dtype=np.float32)
    sea_part = segmentation.watershed(flat, sea_markers, mask=sea_mask, connectivity=1)
    labels[sea_mask] = sea_part[sea_mask]

    # Tohumsuz kalan deniz hücrelerini en yakın etikete bağla.
    gap = labels == 0
    if gap.any():
        _, idx = ndimage.distance_transform_edt(gap, return_indices=True)
        labels[gap] = labels[idx[0][gap], idx[1][gap]]
        print(f"  {int(gap.sum())} boş hücre en yakın ile eklendi")

    # ── 3. Deniz illerini adlandır (en yakın deniz çokgeni) ──────────
    with open(MARINE, encoding="utf-8") as fh:
        marine = json.load(fh)["features"]
    mpts, mnames = [], []
    for f in marine:
        nm = f["properties"].get("name")
        if not nm:
            continue
        for ext, _ in rings_of(f["geometry"]):
            arr = np.asarray(ext, dtype=np.float64)
            mpts.append(arr.mean(axis=0))
            mnames.append(nm)
    mtree = cKDTree(np.asarray(mpts))
    print(f"adlandırılmış deniz: {len(set(mnames))}")

    # ── 4. Sahiplik rasterleri: 1914 ve 1938 ─────────────────────────
    # İller aynı (Natural Earth idari bölümleri); yalnız hangi devlete ait
    # oldukları değişiyor. İki ayrı 2,5 MB dosya yerine tek dosyada iki
    # sahiplik katmanı tutulur.
    def ownership(path: str, mod) -> tuple[np.ndarray, list[str]]:
        with open(path, encoding="utf-8") as fh:
            feats = json.load(fh)["features"]
        canvas_o = Image.new("I", (W, H), 0)
        draw_o = ImageDraw.Draw(canvas_o)
        names: list[str] = []
        order_by_area = sorted(
            range(len(feats)),
            key=lambda i: -sum(ring_area_deg(r) for r, _ in rings_of(feats[i]["geometry"])),
        )
        for order, i in enumerate(order_by_area):
            f = feats[i]
            nid = order + 1
            for ext, _ in rings_of(f["geometry"]):
                xy = [(float(lon2col(c[0])), float(lat2row(c[1]))) for c in ext]
                if len(xy) >= 3:
                    draw_o.polygon(xy, fill=nid)
            pr = f["properties"]
            names.append(
                mod.sovereign_of(pr.get("NAME") or "", pr.get("SUBJECTO"), pr.get("PARTOF"))
            )
        return np.asarray(canvas_o, dtype=np.int32), names

    owner_14, nations_14 = ownership(WORLD1914, nations_1914)
    owner_38, nations_38 = ownership(WORLD1938, nations_1939)
    print(f"1914 devleti: {len(nations_14)} · 1938 devleti: {len(nations_38)}")

    # ── 5. İlleri çıkar ──────────────────────────────────────────────
    objs = ndimage.find_objects(labels)
    provinces = []
    pid_to_index: dict[int, int] = {}
    used_ids: set[str] = set()

    for pid in range(1, labels.max() + 1):
        sl = objs[pid - 1]
        if sl is None:
            continue
        sub = labels[sl] == pid
        cells = int(sub.sum())
        is_sea = pid >= base
        if not is_sea and (cells < MIN_LAND_CELLS or meta[pid - 1].get("skip")):
            continue
        if is_sea and cells < 4:
            continue

        padded = np.pad(sub.astype(np.float32), 1)
        contours = measure.find_contours(padded, 0.5)
        if not contours:
            continue
        contours.sort(key=len, reverse=True)
        ring_px = contours[0] - 1.0
        r0 = sl[0].start
        c0 = sl[1].start
        lonlat = np.stack(
            [col2lon(ring_px[:, 1] + c0), row2lat(ring_px[:, 0] + r0)], axis=1
        )
        ring = douglas_peucker(lonlat, SIMPLIFY_DEG)
        if len(ring) < 3:
            continue

        rr, cc = np.nonzero(sub)
        clon = float(col2lon(cc.mean() + c0))
        clat = float(row2lat(rr.mean() + r0))
        sub_elev = elev[sl][sub]

        if is_sea:
            _, mi = mtree.query([clon, clat])
            base_name = mnames[int(mi)]
            name = base_name
            info = {"admin": "", "iso": "", "type": "sea"}
        else:
            m = meta[pid - 1]
            name = m["name"]
            info = {"admin": m["admin"], "iso": m["iso"], "type": m["type"]}

        # Sahip: ilin hücrelerinde en sık görülen devlet (her iki yıl için).
        def dominant(grid: np.ndarray, names: list[str]) -> str:
            vals_all = grid[sl][sub]
            vals_all = vals_all[vals_all > 0]
            if vals_all.size == 0:
                return ""
            v, c = np.unique(vals_all, return_counts=True)
            return names[int(v[c.argmax()]) - 1]

        nation = dominant(owner_14, nations_14)
        side, joins = nations_1914.faction_of(nation) if nation else ("tarafsiz", None)
        nation38 = dominant(owner_38, nations_38)
        side38, joins38 = (
            nations_1939.faction_of(nation38) if nation38 else ("tarafsiz", None)
        )

        ident = slug(f"{info['iso'] or info['admin'][:12]}_{name}" if not is_sea else name)
        n = 2
        root = ident
        while ident in used_ids:
            ident = f"{root}_{n}"
            n += 1
        used_ids.add(ident)

        pid_to_index[pid] = len(provinces)
        provinces.append(
            {
                "id": ident,
                "name": name,
                "isSea": is_sea,
                "lon": round(clon, 4),
                "lat": round(clat, 4),
                "cells": cells,
                "elev": int(sub_elev[sub_elev > 0].mean()) if (sub_elev > 0).any() else 0,
                "peak": int(sub_elev.max()),
                "nation": nation,
                "nationTr": nations_1914.DISPLAY_TR.get(nation, nation),
                "side": side,
                **({"joins": joins} if joins else {}),
                "nation38": nation38,
                "nation38Tr": nations_1939.DISPLAY_TR.get(nation38, nation38),
                "side38": side38,
                **({"joins38": joins38} if joins38 else {}),
                "ring": [[round(float(p[0]), 3), round(float(p[1]), 3)] for p in ring],
                **info,
            }
        )

    print(f"il: {len(provinces)} "
          f"(kara {sum(1 for p in provinces if not p['isSea'])}, "
          f"deniz {sum(1 for p in provinces if p['isSea'])})")

    # ── 6. Komşuluk ──────────────────────────────────────────────────
    contact: dict[tuple[int, int], int] = {}
    for da, db in ((labels[:, :-1], labels[:, 1:]), (labels[:-1], labels[1:])):
        diff = (da != db) & (da > 0) & (db > 0)
        if not diff.any():
            continue
        pairs = np.stack([da[diff], db[diff]], axis=1)
        pairs.sort(axis=1)
        uniq, counts = np.unique(pairs, axis=0, return_counts=True)
        for (a, b), cnt in zip(uniq, counts):
            contact[(int(a), int(b))] = contact.get((int(a), int(b)), 0) + int(cnt)

    # Harita ±180'de sarılır: sol ve sağ kenarı da komşu say.
    left, right = labels[:, 0], labels[:, -1]
    wrap = (left != right) & (left > 0) & (right > 0)
    if wrap.any():
        pairs = np.stack([left[wrap], right[wrap]], axis=1)
        pairs.sort(axis=1)
        uniq, counts = np.unique(pairs, axis=0, return_counts=True)
        for (a, b), cnt in zip(uniq, counts):
            contact[(int(a), int(b))] = contact.get((int(a), int(b)), 0) + int(cnt)
        print(f"  antimeridyen: {len(uniq)} komşuluk")

    for p in provinces:
        p["neighbours"] = []
    for (a, b), cnt in contact.items():
        if cnt < MIN_CONTACT or a == b:
            continue
        ia, ib = pid_to_index.get(a), pid_to_index.get(b)
        if ia is None or ib is None:
            continue
        provinces[ia]["neighbours"].append(provinces[ib]["id"])
        provinces[ib]["neighbours"].append(provinces[ia]["id"])
    for p in provinces:
        p["neighbours"] = sorted(set(p["neighbours"]))

    orphans = [p["id"] for p in provinces if not p["neighbours"]]
    if orphans:
        print(f"  uyarı: {len(orphans)} komşusuz il (uzak adalar) — "
              f"en yakın deniz iline bağlanıyor")
        tree = cKDTree([[p["lon"], p["lat"]] for p in provinces if p["isSea"]])
        sea_list = [p for p in provinces if p["isSea"]]
        for p in provinces:
            if p["neighbours"]:
                continue
            _, j = tree.query([p["lon"], p["lat"]])
            s = sea_list[int(j)]
            p["neighbours"].append(s["id"])
            s["neighbours"].append(p["id"])
        for p in provinces:
            p["neighbours"] = sorted(set(p["neighbours"]))

    edges = sum(len(p["neighbours"]) for p in provinces) // 2
    print(f"kenar: {edges}")

    # ── 7. Rölyef dokusu — ÖN GÖLGELENDİRİLMİŞ ────────────────────────
    # Tarayıcıya ham yükseklik gönderip orada boyamak 7,6 milyon pikselde
    # saniyeler sürüyordu ve PNG 10 MB geliyordu. Gölgelendirmeyi burada
    # yapıp hazır görüntü göndermek hem küçük hem anında.
    RW = 4096
    RH = int(RW * H / W)
    small = np.asarray(
        Image.fromarray(elev.astype(np.float32)).resize((RW, RH), Image.BILINEAR),
        dtype=np.float32,
    )
    lm = (
        np.asarray(
            Image.fromarray(land_mask.astype(np.uint8) * 255).resize(
                (RW, RH), Image.BILINEAR
            ),
            dtype=np.float32,
        )
        / 255.0
    )

    # Kuzeybatıdan ışıklı tepe gölgelemesi — Çanakkale haritasıyla aynı dil.
    gy, gx = np.gradient(small)
    # Enlem başına metre sabit, boylam başına metre cos(lat) ile daralır;
    # gölgeyi bozmamak için x gradyanını enlemle ölçekle.
    lat_rows = np.linspace(LAT_LIM, -LAT_LIM, RH)
    coslat = np.clip(np.cos(np.radians(lat_rows)), 0.08, 1.0)[:, None]
    zs = 0.04
    dx = gx * zs / coslat
    dy = gy * zs
    ln = np.sqrt(dx * dx + dy * dy + 1.0)
    shade = np.clip((-dx * -0.72 - dy * -0.6 + 0.35) / ln * 2.0, 0.42, 1.55)

    t = np.clip(np.maximum(small, 0.0) / 3200.0, 0.0, 1.0) ** 0.72
    land_rgb = np.stack(
        [
            (26 + t * 61) * shade * 0.8,
            (22 + t * 43) * shade * 0.8,
            (16 + t * 11) * shade * 0.82,
        ],
        axis=-1,
    )
    # Deniz: derinlikle hafifçe koyulaşan lacivert (#030810 tabanlı).
    depth = np.clip(-np.minimum(small, 0.0) / 6000.0, 0.0, 1.0)
    sea_rgb = np.stack(
        [
            9 - depth * 6,
            16 - depth * 9,
            28 - depth * 13,
        ],
        axis=-1,
    )
    a = lm[..., None]
    rgb = np.clip(land_rgb * a + sea_rgb * (1 - a), 0, 255).astype(np.uint8)

    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    Image.fromarray(rgb).save(OUT_PNG, quality=88, method=5)
    print(
        f"rölyef {RW}×{RH} (ön gölgelendirilmiş) -> {OUT_PNG} "
        f"({os.path.getsize(OUT_PNG) // 1024} KB)"
    )

    # ── 8. Yaz ───────────────────────────────────────────────────────
    out = {
        "_source": {
            "elevation": "AWS Terrain Tiles (terrarium) z5 — "
                         "https://registry.opendata.aws/terrain-tiles/",
            "provinces": "Natural Earth 10m admin-1 (public domain) — "
                         "https://www.naturalearthdata.com/",
            "seas": "Natural Earth 10m marine polys (public domain)",
            "borders": "aourednik/historical-basemaps world_1914 + world_1938 "
                       "(CC-BY-SA) — https://github.com/aourednik/historical-basemaps",
            "note": "İller tek bir etiket ızgarasından türetildi; sınırlar ve "
                    "komşuluk birebir tutarlı. Deniz illeri ~900 km aralıklı "
                    "tohumlardan havza bölütlemesiyle üretildi.",
        },
        "projection": "equirectangular",
        "bounds": {"minLon": -180.0, "minLat": -LAT_LIM, "maxLon": 180.0, "maxLat": LAT_LIM},
        "relief": {"image": "world-relief.webp", "width": RW, "height": RH,
                   "preshaded": True},
        "provinces": provinces,
    }
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(provinces)} il -> {OUT_JSON} "
          f"({os.path.getsize(OUT_JSON) // 1024} KB)")

    top = {}
    for p in provinces:
        if p["nation"]:
            top[p["nation"]] = top.get(p["nation"], 0) + 1
    for yr, key, mod in (("1914", "side", nations_1914), ("1938", "side38", nations_1939)):
        bloc: dict[str, int] = {}
        for p in provinces:
            if p["isSea"]:
                continue
            bloc[p[key]] = bloc.get(p[key], 0) + 1
        print(f"{yr} taraf dağılımı (kara ili):", bloc)
    print("en çok ile sahip 1914 devletleri:")
    for nm, n in sorted(top.items(), key=lambda kv: -kv[1])[:8]:
        sd, _ = nations_1914.faction_of(nm)
        print(f"   {n:5d}  [{sd:8}] {nations_1914.DISPLAY_TR.get(nm, nm)}")


if __name__ == "__main__":
    main()
