#!/usr/bin/env python3
"""AWS Terrain Tiles (terrarium) indir ve tek bir yükseklik ızgarası üret.

Kaynak: https://registry.opendata.aws/terrain-tiles/  (ODbL / public domain karışık,
SRTM + ETOPO1 batimetri). Terrarium kodlaması:  h = (R*256 + G + B/256) - 32768

Kullanım:
    python3 tools/fetch_terrain.py              # çanakkale (varsayılan)
    python3 tools/fetch_terrain.py kafkas

Çıktı: tools/data/elev-<bolge>.npz -> {elev: int16[H,W], bbox: [w,s,e,n], z, x0, y0}
Çanakkale geriye dönük uyumluluk için tools/data/elev.npz adını korur.

Zoom bölge boyuna göre seçilir: Çanakkale 1,6° genişliğinde ve z12'de
~29 m/px; Kafkas 5,4° genişliğinde, aynı zoom yirmi kat karo demek olurdu.
z10 (~115 m/px) 40-60 illik bir tiyatro için fazlasıyla yeterli.
"""
from __future__ import annotations

import io
import math
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

import numpy as np
from PIL import Image

# bölge -> (zoom, batı, güney, doğu, kuzey)
REGIONS: dict[str, tuple[int, float, float, float, float]] = {
    # Çanakkale tiyatrosu: Saros körfezinden Bozcaada'ya, Ege'den Marmara ağzına.
    "canakkale": (12, 25.55, 39.60, 27.20, 40.75),
    # Kafkas Cephesi: Erzurum-Sarıkamış-Kars ekseni, Karadeniz kıyısı, Van.
    "kafkas": (10, 39.20, 38.70, 44.60, 41.90),
    # Mezopotamya: Basra körfezinden Bağdat'a, Dicle-Fırat arası.
    "mezopotamya": (10, 43.40, 29.60, 48.40, 34.60),
    # Sina-Filistin: Süveyş Kanalı'ndan Kudüs'e.
    "sina": (10, 31.90, 28.90, 36.60, 33.60),
}

BASE = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
CACHE = os.path.join(os.path.dirname(__file__), "data", "tiles")


def out_path(region: str) -> str:
    name = "elev.npz" if region == "canakkale" else f"elev-{region}.npz"
    return os.path.join(os.path.dirname(__file__), "data", name)


def lon2x(lon: float, z: int) -> float:
    return (lon + 180.0) / 360.0 * (1 << z)


def lat2y(lat: float, z: int) -> float:
    r = math.radians(lat)
    return (1.0 - math.asinh(math.tan(r)) / math.pi) / 2.0 * (1 << z)


def x2lon(x: float, z: int) -> float:
    return x / (1 << z) * 360.0 - 180.0


def y2lat(y: float, z: int) -> float:
    n = math.pi * (1.0 - 2.0 * y / (1 << z))
    return math.degrees(math.atan(math.sinh(n)))


def fetch(z: int, x: int, y: int) -> np.ndarray:
    path = os.path.join(CACHE, f"{z}_{x}_{y}.png")
    if not os.path.exists(path):
        url = BASE.format(z=z, x=x, y=y)
        req = urllib.request.Request(url, headers={"User-Agent": "canakkale-1915/0.1"})
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=40) as r:
                    blob = r.read()
                break
            except Exception as exc:  # noqa: BLE001
                if attempt == 3:
                    print(f"  ! {z}/{x}/{y} başarısız: {exc}", file=sys.stderr)
                    return np.zeros((256, 256), dtype=np.int16)
        os.makedirs(CACHE, exist_ok=True)
        with open(path, "wb") as fh:
            fh.write(blob)
    with open(path, "rb") as fh:
        img = Image.open(io.BytesIO(fh.read())).convert("RGB")
    a = np.asarray(img, dtype=np.float32)
    h = a[:, :, 0] * 256.0 + a[:, :, 1] + a[:, :, 2] / 256.0 - 32768.0
    return np.rint(h).astype(np.int16)


def main() -> None:
    region = sys.argv[1] if len(sys.argv) > 1 else "canakkale"
    if region not in REGIONS:
        print(f"bilinmeyen bölge: {region} (seçenekler: {', '.join(REGIONS)})", file=sys.stderr)
        raise SystemExit(2)
    z, west, south, east, north = REGIONS[region]
    out = out_path(region)

    x0, x1 = int(math.floor(lon2x(west, z))), int(math.ceil(lon2x(east, z)))
    y0, y1 = int(math.floor(lat2y(north, z))), int(math.ceil(lat2y(south, z)))
    cols, rows = x1 - x0, y1 - y0
    print(f"{region} zoom {z}: {cols}x{rows} = {cols * rows} karo, {cols * 256}x{rows * 256} px")

    grid = np.zeros((rows * 256, cols * 256), dtype=np.int16)
    jobs = [(x, y) for y in range(y0, y1) for x in range(x0, x1)]

    done = 0
    with ThreadPoolExecutor(max_workers=16) as pool:
        for (x, y), tile in zip(jobs, pool.map(lambda j: fetch(z, j[0], j[1]), jobs)):
            gy, gx = (y - y0) * 256, (x - x0) * 256
            grid[gy : gy + 256, gx : gx + 256] = tile
            done += 1
            if done % 40 == 0:
                print(f"  {done}/{len(jobs)}")

    bbox = [x2lon(x0, z), y2lat(y1, z), x2lon(x1, z), y2lat(y0, z)]
    os.makedirs(os.path.dirname(out), exist_ok=True)
    np.savez_compressed(out, elev=grid, bbox=np.array(bbox), z=z, x0=x0, y0=y0)
    land = int((grid >= 0).sum())
    print(
        f"yazıldı {out}  şekil={grid.shape}  bbox={bbox}\n"
        f"  yükseklik {grid.min()}..{grid.max()} m, kara oranı {land / grid.size:.1%}"
    )


if __name__ == "__main__":
    main()
