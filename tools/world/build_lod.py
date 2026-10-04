"""Bölgesel rölyef LOD'ları üretir.

`world-relief.webp` tüm dünyayı 4096 px'e sığdırıyor: 11 px/derece, yani
~10 km/piksel. Tiyatro kutusunun dışında biraz yakınlaştırınca bulanık bir
lekeye dönüşüyor. Burada aradaki iki kademe üretilir:

    lod-region  Osmanlı coğrafyası, terrarium z7  ->   91 px/derece (~1,2 km)
    lod-near    Ege + Marmara + B.Anadolu, z9     ->  364 px/derece (~305 m)

Çanakkale tiyatrosunun kendi rölyefi 29 m/px olduğundan tam zincir şöyle:

    10 km  ->  1,2 km  ->  305 m  ->  29 m

Gölgeleme `build_world.py` ile birebir aynı: aynı ışık yönü, aynı yükseklik
renk rampası, aynı deniz derinliği. Kademeler üst üste bindiğinde renk
atlaması olmasın diye bu şart.

Kullanım:  python tools/world/build_lod.py
Karolar `tools/world/data/tiles/` içine önbelleklenir; ikinci çalıştırma ağ
kullanmaz.
"""

from __future__ import annotations

import io
import json
import math
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
CACHE = os.path.join(HERE, "data", "tiles")
PUBLIC = os.path.join(ROOT, "public")
META = os.path.join(ROOT, "src", "data", "lod.json")

BASE = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"

# (ad, zoom, batı, güney, doğu, kuzey)
LEVELS = [
    # Osmanlı coğrafyası: Balkanlar, Anadolu, Levant, Mezopotamya, Mısır.
    ("region", 7, 17.0, 11.0, 52.0, 46.0),
    # Oyuncunun tiyatro çevresinde gezindiği alan.
    ("near", 9, 23.0, 36.0, 32.0, 43.0),
]


def fetch(z: int, x: int, y: int) -> np.ndarray:
    """Tek terrarium karosunu metre yüksekliğe çözer; diskte önbelleklenir."""
    path = os.path.join(CACHE, f"{z}_{x}_{y}.png")
    if not os.path.exists(path):
        req = urllib.request.Request(
            BASE.format(z=z, x=x, y=y), headers={"User-Agent": "canakkale-1915/0.2"}
        )
        blob = None
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    blob = r.read()
                break
            except Exception as exc:  # noqa: BLE001
                if attempt == 3:
                    print(f"  ! {z}/{x}/{y}: {exc}", file=sys.stderr)
                    return np.zeros((256, 256), dtype=np.int16)
        os.makedirs(CACHE, exist_ok=True)
        with open(path, "wb") as fh:
            fh.write(blob or b"")
    with open(path, "rb") as fh:
        data = fh.read()
    if not data:
        return np.zeros((256, 256), dtype=np.int16)
    a = np.asarray(Image.open(io.BytesIO(data)).convert("RGB"), dtype=np.float32)
    return np.rint(
        a[:, :, 0] * 256.0 + a[:, :, 1] + a[:, :, 2] / 256.0 - 32768.0
    ).astype(np.int16)


def lat2tiley(lat: float, n: int) -> float:
    r = math.radians(lat)
    return (1.0 - math.asinh(math.tan(r)) / math.pi) / 2.0 * n


# Gölgelendirme sertliği piksel boyutundan BAĞIMSIZ olmalı. `np.gradient`
# piksel başına Δyükseklik verir; çözünürlük arttıkça bu küçülür, yani aynı
# yamaç ince kademede sönük çıkar ve kademe sınırında parlaklık dikişi olur.
# Gerçek eğime (metre/metre) sabit bir katsayı uygulanır:
#
#     dx = K · Δyükseklik/Δmetre,   K = 111320 · zs / (px/derece)
#
# `build_world.py` 4096 px / 360° = 11,378 px/derece ve zs = 0,04 kullanıyor.
# Referans K'yi oradan al, her kademe için zs'yi yeniden çöz.
REF_PX_PER_DEG = 4096.0 / 360.0
REF_ZS = 0.04


def shade_rgb(
    elev: np.ndarray, lat_n: float, lat_s: float, px_per_deg: float
) -> np.ndarray:
    """build_world.py ile aynı gölgelendirme — kademeler arası renk eşliği."""
    h, _ = elev.shape
    gy, gx = np.gradient(elev)
    lat_rows = np.linspace(lat_n, lat_s, h)
    coslat = np.clip(np.cos(np.radians(lat_rows)), 0.08, 1.0)[:, None]
    zs = REF_ZS * px_per_deg / REF_PX_PER_DEG
    dx = gx * zs / coslat
    dy = gy * zs
    ln = np.sqrt(dx * dx + dy * dy + 1.0)
    shade = np.clip((-dx * -0.72 - dy * -0.6 + 0.35) / ln * 2.0, 0.42, 1.55)

    t = np.clip(np.maximum(elev, 0.0) / 3200.0, 0.0, 1.0) ** 0.72
    land = np.stack(
        [
            (26 + t * 61) * shade * 0.8,
            (22 + t * 43) * shade * 0.8,
            (16 + t * 11) * shade * 0.82,
        ],
        axis=-1,
    )
    depth = np.clip(-np.minimum(elev, 0.0) / 6000.0, 0.0, 1.0)
    sea = np.stack([9 - depth * 6, 16 - depth * 9, 28 - depth * 13], axis=-1)

    # Kara maskesi yükseklikten: terrarium batimetriyi negatif kodluyor.
    # 1 px'lik yumuşatma kıyıyı testere dişi olmaktan çıkarır.
    a = np.clip(elev.astype(np.float32) / 6.0 + 0.5, 0.0, 1.0)[..., None]
    return np.clip(land * a + sea * (1 - a), 0, 255).astype(np.uint8)


def build(name: str, z: int, w: float, s: float, e: float, n_lat: float) -> dict:
    n = 1 << z
    span = 360.0 / n
    x0 = int(math.floor((w + 180.0) / span))
    x1 = int(math.floor((e + 180.0) / span))
    y0 = int(math.floor(lat2tiley(n_lat, n)))
    y1 = int(math.floor(lat2tiley(s, n)))
    tx, ty = x1 - x0 + 1, y1 - y0 + 1
    print(f"{name}: z{z} {tx}×{ty} = {tx * ty} karo")

    merc = np.zeros((ty * 256, tx * 256), dtype=np.int16)
    jobs = [(x, y) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1)]
    done = 0
    with ThreadPoolExecutor(max_workers=24) as pool:
        for (x, y), tile in zip(jobs, pool.map(lambda j: fetch(z, *j), jobs)):
            r, c = (y - y0) * 256, (x - x0) * 256
            merc[r : r + 256, c : c + 256] = tile
            done += 1
            if done % 100 == 0:
                print(f"  {done}/{len(jobs)}")

    # Karo ızgarasının gerçek kenarları (istenen kutudan biraz taşar).
    bw = x0 * span - 180.0
    be = (x1 + 1) * span - 180.0
    bn = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y0 / n))))
    bs = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y1 + 1) / n))))

    # Mercator -> eşdikdörtgen. Oyun haritası enlemde doğrusal çalışıyor.
    out_w = merc.shape[1]
    out_h = int(round(out_w * (bn - bs) / (be - bw)))
    lats = np.linspace(bn, bs, out_h)
    my = (1.0 - np.arcsinh(np.tan(np.radians(lats))) / math.pi) / 2.0 * n
    rows = np.clip(((my - y0) * 256).astype(np.int32), 0, merc.shape[0] - 1)
    grid = merc[rows, :].astype(np.float32)

    ppd = out_w / (be - bw)
    rgb = shade_rgb(grid, bn, bs, ppd)
    path = os.path.join(PUBLIC, f"lod-{name}.webp")
    Image.fromarray(rgb).save(path, quality=86, method=5)
    kb = os.path.getsize(path) // 1024
    print(
        f"  -> {path}  {out_w}×{out_h}  "
        f"{ppd:.0f} px/derece  {kb} KB"
    )
    return {
        "image": f"lod-{name}.webp",
        "zoom": z,
        "west": bw,
        "south": bs,
        "east": be,
        "north": bn,
        "pxPerDeg": ppd,
    }


def main() -> None:
    os.makedirs(PUBLIC, exist_ok=True)
    out = {
        "_source": "AWS Terrain Tiles (terrarium) — "
                   "https://registry.opendata.aws/terrain-tiles/",
        "levels": [build(*lv) for lv in LEVELS],
    }
    with open(META, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)
    print(f"-> {META}")


if __name__ == "__main__":
    main()
