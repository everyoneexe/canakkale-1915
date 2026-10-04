#!/usr/bin/env python3
"""Dünya yükseklik ızgarası — AWS Terrain Tiles z5, eşdikdörtgene çevrilmiş.

Neden z5: dünya z12'de 16,7 milyon karo eder (imkânsız). z5 = 32×32 = 1024
karo, 8192×8192 Mercator piksel ≈ ekvatorda 4,9 km/px. Bir dünya strateji
haritası için fazlasıyla yeterli — en küçük idari birim bile birkaç piksel.

Neden eşdikdörtgen: Mercator'da Grönland Afrika kadar görünüyor. Strateji
haritası alan oranını kabaca korumalı. Mercator karolardan satır satır
yeniden örnekleyerek enlemde doğrusal bir ızgaraya çeviriyoruz.

Çıktı: tools/world/data/world_elev.npz
       {elev: int16[H,W], bbox: [-180, -LAT_LIM, 180, LAT_LIM]}
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

Z = 5
# Kutuplar oyun dışı; ±82° yeterli ve Mercator'un sonsuza gitmesini önler.
LAT_LIM = 82.0
# Çıktı ızgarası. 8192 / 360° = 22,8 px/derece.
OUT_W = 8192
OUT_H = int(OUT_W * (2 * LAT_LIM) / 360.0)  # 3731

BASE = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "data", "tiles")
OUT = os.path.join(HERE, "data", "world_elev.npz")


def fetch(x: int, y: int) -> np.ndarray:
    path = os.path.join(CACHE, f"{Z}_{x}_{y}.png")
    if not os.path.exists(path):
        req = urllib.request.Request(
            BASE.format(z=Z, x=x, y=y), headers={"User-Agent": "canakkale-1915/0.2"}
        )
        blob = None
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    blob = r.read()
                break
            except Exception as exc:  # noqa: BLE001
                if attempt == 3:
                    print(f"  ! {Z}/{x}/{y}: {exc}", file=sys.stderr)
                    return np.zeros((256, 256), dtype=np.int16)
        os.makedirs(CACHE, exist_ok=True)
        with open(path, "wb") as fh:
            fh.write(blob or b"")
    with open(path, "rb") as fh:
        data = fh.read()
    if not data:
        return np.zeros((256, 256), dtype=np.int16)
    a = np.asarray(Image.open(io.BytesIO(data)).convert("RGB"), dtype=np.float32)
    return np.rint(a[:, :, 0] * 256.0 + a[:, :, 1] + a[:, :, 2] / 256.0 - 32768.0).astype(
        np.int16
    )


def main() -> None:
    n = 1 << Z
    side = n * 256
    print(f"zoom {Z}: {n}×{n} = {n * n} karo -> {side}×{side} Mercator px")

    merc = np.zeros((side, side), dtype=np.int16)
    jobs = [(x, y) for y in range(n) for x in range(n)]
    done = 0
    with ThreadPoolExecutor(max_workers=24) as pool:
        for (x, y), tile in zip(jobs, pool.map(lambda j: fetch(*j), jobs)):
            merc[y * 256 : (y + 1) * 256, x * 256 : (x + 1) * 256] = tile
            done += 1
            if done % 200 == 0:
                print(f"  {done}/{len(jobs)}")

    # ── Mercator -> eşdikdörtgen: her çıktı satırı için kaynak satırını bul.
    print(f"yeniden örnekleniyor -> {OUT_W}×{OUT_H} eşdikdörtgen (±{LAT_LIM}°)")
    lats = np.linspace(LAT_LIM, -LAT_LIM, OUT_H)
    rad = np.radians(lats)
    # Mercator y (0..1) = (1 - asinh(tan(lat))/pi) / 2
    merc_y = (1.0 - np.arcsinh(np.tan(rad)) / math.pi) / 2.0
    src_rows = np.clip((merc_y * side).astype(np.int32), 0, side - 1)
    # Boylam doğrusal: sadece yatayda ölçekle.
    src_cols = np.clip(
        (np.arange(OUT_W) * (side / OUT_W)).astype(np.int32), 0, side - 1
    )
    grid = merc[np.ix_(src_rows, src_cols)]

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    np.savez_compressed(
        OUT, elev=grid, bbox=np.array([-180.0, -LAT_LIM, 180.0, LAT_LIM])
    )
    sea = float((grid <= 0).mean())
    print(
        f"yazıldı {OUT}  şekil={grid.shape}\n"
        f"  yükseklik {grid.min()}..{grid.max()} m · deniz %{sea * 100:.1f}"
    )


if __name__ == "__main__":
    main()
