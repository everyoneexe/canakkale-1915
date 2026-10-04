#!/usr/bin/env python3
"""Küre seçim ekranı için sadeleştirilmiş coğrafya.

Küre her karede yeniden çizilir (döndürme). 4.575 il halkası Canvas2D'de
kare başına yüzbinlerce köşe demek — 60 fps imkânsız. Bu yüzden ayrı,
çok daha kaba bir geometri üretilir:

  · kıta kıyı halkaları        (~1,2° tolerans, yalnız büyük kara kütleleri)
  · savaşan devletlerin sınırı (her savaş yılı için ayrı)

Çıktı: src/data/globe.json
"""
from __future__ import annotations

import json
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from skimage import measure

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)

ELEV = os.path.join(HERE, "data", "world_elev.npz")
OUT = os.path.join(ROOT, "src", "data", "globe.json")

LAT_LIM = 82.0
# Kıyı sadeleştirme (derece). 0.9° ≈ 100 km — küre ölçeğinde fazlasıyla yeterli.
COAST_TOL = 0.9
# Bu kadar köşeden küçük halkalar atılır (küçük adalar).
MIN_RING = 14

# Her savaş için sınır dosyası ve taraf tablosu.
WARS = {
    "ww1": {"file": "world_1914.geojson", "module": "nations_1914"},
    "ww2": {"file": "world_1938.geojson", "module": "nations_1939"},
}


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


def rings_of(geom: dict):
    t = geom["type"]
    polys = (
        [geom["coordinates"]]
        if t == "Polygon"
        else geom["coordinates"]
        if t == "MultiPolygon"
        else []
    )
    for poly in polys:
        if poly:
            yield poly[0]


def ring_area(ring) -> float:
    a = 0.0
    n = len(ring)
    for i in range(n):
        x1, y1 = ring[i][0], ring[i][1]
        x2, y2 = ring[(i + 1) % n][0], ring[(i + 1) % n][1]
        a += x1 * y2 - x2 * y1
    return abs(a) / 2.0


def main() -> None:
    blob = np.load(ELEV)
    elev = blob["elev"]
    H, W = elev.shape

    # ── Kıyı halkaları: yükseklik ızgarasının 0 m eşiğinden ──────────
    step = 4  # 8192 -> 2048, küre için fazlasıyla yeterli
    small = elev[::step, ::step]
    sh, sw = small.shape
    land = (small > 0).astype(np.float32)
    padded = np.pad(land, 1)

    def col2lon(c):
        return (c / sw) * 360.0 - 180.0

    def row2lat(r):
        return LAT_LIM - (r / sh) * (2 * LAT_LIM)

    coast = []
    for ring_px in measure.find_contours(padded, 0.5):
        if len(ring_px) < MIN_RING:
            continue
        rp = ring_px - 1.0
        lonlat = np.stack([col2lon(rp[:, 1]), row2lat(rp[:, 0])], axis=1)
        simple = douglas_peucker(lonlat, COAST_TOL)
        if len(simple) < 4:
            continue
        coast.append([[round(float(x), 2), round(float(y), 2)] for x, y in simple])
    coast.sort(key=len, reverse=True)
    print(f"kıyı halkası: {len(coast)} · köşe {sum(len(r) for r in coast)}")

    # ── Savaşan devletlerin sınırları ────────────────────────────────
    wars: dict[str, list] = {}
    for war, cfg in WARS.items():
        path = os.path.join(HERE, cfg["file"])
        if not os.path.exists(path):
            print(f"  ! {cfg['file']} yok, {war} atlandı")
            continue
        mod = __import__(cfg["module"])
        with open(path, encoding="utf-8") as fh:
            feats = json.load(fh)["features"]

        polys = []
        for f in feats:
            pr = f["properties"]
            sov = mod.sovereign_of(pr.get("NAME") or "", pr.get("SUBJECTO"), pr.get("PARTOF"))
            side, _ = mod.faction_of(sov)
            for ring in rings_of(f["geometry"]):
                if ring_area(ring) < 2.0:  # ~2 derece-kare altını atla
                    continue
                arr = np.asarray(ring, dtype=np.float64)
                simple = douglas_peucker(arr, 0.8)
                if len(simple) < 4:
                    continue
                polys.append(
                    {
                        "side": side,
                        "ring": [[round(float(x), 2), round(float(y), 2)] for x, y in simple],
                    }
                )
        wars[war] = polys
        n_by = {}
        for p in polys:
            n_by[p["side"]] = n_by.get(p["side"], 0) + 1
        print(f"{war}: {len(polys)} çokgen {n_by}")

    out = {
        "_source": {
            "coast": "AWS Terrain Tiles z5, 0 m eşiği",
            "borders": "aourednik/historical-basemaps (CC-BY-SA)",
        },
        "coast": coast,
        "wars": wars,
    }
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"-> {OUT} ({os.path.getsize(OUT) // 1024} KB)")


if __name__ == "__main__":
    main()
