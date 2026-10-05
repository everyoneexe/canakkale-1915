#!/usr/bin/env python3
"""Natural Earth kaynak katmanlarını indir.

Kaynak: nvkelso/natural-earth-vector deposunun GeoJSON çıktıları
(Natural Earth kamu malıdır, v5+ sürümleri bu depoda tutulur).
Shapefile yerine doğrudan GeoJSON alınır — ogr2ogr gerekmez.

    python3 tools/world/fetch_natural_earth.py

Çıktı: tools/world/ne_10m_*.geojson

Neden betik: `ne_10m_admin_1_states_provinces.geojson` 38,8 MB ve bir
süre depoda duruyordu. Türetilmiş değil ama İNDİRİLEBİLİR bir kaynak;
depoyu üç katına çıkarmasının anlamı yok. `build_world.py` bu dosyaları
bekler, yoksa buradan indirilir.
"""
from __future__ import annotations

import os
import sys
import urllib.request

BASE = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/"
    "master/geojson/{name}"
)

# ad -> beklenen bayt (indirmenin yarıda kesilmediğini doğrulamak için;
# üst kaynak sürüm atlarsa bu sayı değişir, uyarı verilir ama durulmaz)
LAYERS: dict[str, int] = {
    "ne_10m_admin_1_states_provinces.geojson": 40726851,
    "ne_10m_geography_marine_polys.geojson": 0,  # 0 = boyut denetimi yok
}

HERE = os.path.dirname(os.path.abspath(__file__))


def fetch(name: str, expect: int) -> None:
    out = os.path.join(HERE, name)
    if os.path.exists(out) and (expect == 0 or os.path.getsize(out) == expect):
        print(f"  · {name} zaten var, atlandı")
        return
    url = BASE.format(name=name)
    print(f"  ↓ {name}")
    req = urllib.request.Request(url, headers={"User-Agent": "canakkale-1915/0.1"})
    with urllib.request.urlopen(req, timeout=180) as r:
        blob = r.read()
    if expect and len(blob) != expect:
        print(
            f"    ! beklenen {expect} bayt, gelen {len(blob)} — "
            f"üst kaynak güncellenmiş olabilir",
            file=sys.stderr,
        )
    with open(out, "wb") as fh:
        fh.write(blob)
    print(f"    {len(blob) / 1048576:.1f} MB yazıldı")


def main() -> None:
    print("Natural Earth katmanları:")
    for name, expect in LAYERS.items():
        fetch(name, expect)
    print("bitti — şimdi tools/world/build_world.py çalıştırılabilir")


if __name__ == "__main__":
    main()
