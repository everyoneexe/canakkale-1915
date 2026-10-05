"""Kafkas Cephesi il tohumları (1 Kasım 1914 - Mart 1918).

build_map.py bu listeyi bölge adından import eder.

Kutu: boylam 39.20 - 44.60, enlem 38.70 - 41.90.
Kutu dışında kalan tarihî yerler (Van, Bitlis, Nahçıvan, Tiflis) bilerek
listeye alınmadı; tohum kutunun dışına düşerse sessizce kenara yapışır.

Sahiplik 1 Kasım 1914 (savaşın açıldığı gün) sınırına göredir:
1878 Berlin sınırı — Elviye-i Selase (Kars, Ardahan, Batum) Rus'ta,
Oltu/Narman/Olur-İd hattının doğusu Rus, batısı Osmanlı.
"""
from __future__ import annotations

# İKMAL MERKEZİ SEYREK OLMALI.
# İlk yazımda illerin %65-77'si depoydu; Çanakkale'de bu oran %21.
# Depo her köyde olunca ikmal yayılımı bütün haritaya ulaşıyor, mesafe
# hiç ısırmıyor ve cephenin asıl dersi (ileri giden ordu kendi ikmal
# hattını uzatıp zayıflatır) ölüyor. Aşağıda yalnız gerçek menzil
# depoları ve limanlar depo olarak bırakıldı; kalanı sıfırlandı.
SEEDS: list[dict] = [
    # ------------------------------------------------------------------
    # OSMANLI — 3. Ordu bölgesi
    # ------------------------------------------------------------------
    # Cephenin batı kilidi: 3. Ordu karargâhı, Deve Boynu tabyaları,
    # bütün menzil hattının toplandığı ana depo. 1916'da düşmesi
    # Anadolu'nun içine kapıyı açtı.
    dict(id="erzurum", name="Erzurum", lonlat=(41.2769, 39.9043), kind="land",
         terrain="sehir", vp=9, supply=40000, owner="ottoman",
         src="OSM/Nominatim"),
    # Hasankale: Erzurum-Sarıkamış ekseninin ilk menzil deposu.
    dict(id="hasankale", name="Hasankale (Pasinler)", lonlat=(41.6753, 39.9797),
         kind="land", terrain="ova", vp=3, supply=12000, owner="ottoman",
         src="OSM/Nominatim"),
    # Köprüköy: Aras üzerindeki köprü — Pasin ovasının geçit noktası,
    # Kasım 1914 Köprüköy muharebesi.
    dict(id="koprukoy", name="Köprüköy", lonlat=(41.8486, 39.9739), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman", src="OSM/Nominatim"),
    # Horasan: Aras vadisi ile Oltu kolunun ayrıldığı kavşak.
    dict(id="horasan", name="Horasan", lonlat=(42.1683, 40.0444), kind="land",
         terrain="ova", vp=2, supply=0, owner="ottoman", src="OSM/Nominatim"),
    # 9. Kolordu'nun Allahuekber'e tırmandığı yol: Oltu-Narman-Olur.
    dict(id="oltu", name="Oltu", lonlat=(41.9908, 40.5447), kind="land",
         terrain="dag", vp=4, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="narman", name="Narman", lonlat=(41.8514, 40.3417), kind="land",
         terrain="dag", vp=2, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="olur", name="Olur", lonlat=(42.1397, 40.8244), kind="land",
         terrain="dag", vp=2, supply=0, owner="ottoman", src="OSM/Nominatim"),
    # İd (bugünkü Şenkaya) — 1914 sınır karakolu, X. Kolordu'nun ekseni.
    dict(id="id_senkaya", name="İd (Şenkaya)", lonlat=(42.3472, 40.5597),
         kind="land", terrain="dag", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    # Tortum-İspir: Çoruh vadisinden kuzeye çıkan yan eksen.
    dict(id="tortum", name="Tortum", lonlat=(41.5494, 40.3042), kind="land",
         terrain="tepe", vp=2, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="ispir", name="İspir", lonlat=(40.9833, 40.4833), kind="land",
         terrain="dag", vp=2, supply=0, owner="ottoman", src="OSM/Nominatim"),
    # Bayburt: Erzurum düştükten sonra geri çekilme hattının dayanağı (1916).
    dict(id="bayburt", name="Bayburt", lonlat=(40.2258, 40.2552), kind="land",
         terrain="tepe", vp=4, supply=10000, owner="ottoman", src="OSM/Nominatim"),
    dict(id="askale", name="Aşkale", lonlat=(40.6939, 39.9203), kind="land",
         terrain="ova", vp=2, supply=0, owner="ottoman", src="OSM/Nominatim"),
    # Erzincan: 1916'dan sonra 3. Ordu'nun yeni karargâhı ve ana deposu.
    dict(id="erzincan", name="Erzincan", lonlat=(39.4903, 39.7500), kind="land",
         terrain="sehir", vp=6, supply=25000, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="tercan", name="Tercan", lonlat=(40.3772, 39.7786), kind="land",
         terrain="ova", vp=2, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="tekman", name="Tekman", lonlat=(41.5058, 39.6456), kind="land",
         terrain="dag", vp=1, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="hinis", name="Hınıs", lonlat=(41.6956, 39.3597), kind="land",
         terrain="tepe", vp=2, supply=0, owner="ottoman", src="OSM/Nominatim"),
    # Güney kanat: Muş-Malazgirt-Van gölü kuzeyi, 1915-16 Rus taarruz ekseni.
    dict(id="mus", name="Muş", lonlat=(41.4911, 38.7432), kind="land",
         terrain="ova", vp=4, supply=8000, owner="ottoman", src="OSM/Nominatim"),
    dict(id="varto", name="Varto", lonlat=(41.4544, 39.1733), kind="land",
         terrain="dag", vp=1, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="malazgirt", name="Malazgirt", lonlat=(42.5386, 39.1456), kind="land",
         terrain="tepe", vp=3, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="ahlat", name="Ahlat", lonlat=(42.4847, 38.7503), kind="land",
         terrain="tepe", vp=1, supply=0, owner="ottoman", src="OSM/Nominatim"),
    # Erciş: Van gölü kuzey ucu — Van'a giden ikmal yolunun başı.
    dict(id="ercis", name="Erciş", lonlat=(43.3600, 39.0269), kind="land",
         terrain="tepe", vp=3, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="patnos", name="Patnos", lonlat=(42.8631, 39.2353), kind="land",
         terrain="tepe", vp=1, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="tutak", name="Tutak", lonlat=(42.7744, 39.5450), kind="land",
         terrain="ova", vp=1, supply=0, owner="ottoman", src="OSM/Nominatim"),
    dict(id="eleskirt", name="Eleşkirt", lonlat=(42.6722, 39.7961), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman", src="OSM/Nominatim"),
    # Karaköse (Ağrı): Aras-Murat havzasının doğu kapısı.
    dict(id="karakose", name="Karaköse (Ağrı)", lonlat=(43.0503, 39.7191),
         kind="land", terrain="ova", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    # Bayazıt: İran'a ve Iğdır ovasına bakan sınır kalesi.
    dict(id="bayazit", name="Bayazıt (Doğubayazıt)", lonlat=(44.0864, 39.5471),
         kind="land", terrain="kayalik", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    # Ağrı Dağı 5.137 m — geçilmez kütle, kutunun doğu kenarı.
    dict(id="agri_dagi", name="Ağrı Dağı", lonlat=(44.2806, 39.7019), kind="land",
         terrain="dag", vp=1, supply=0, owner="ottoman", src="OSM/Nominatim"),
    # Karadeniz kıyısı: 1916 Rus amfibi ilerleyişinin hedefi.
    dict(id="trabzon", name="Trabzon", lonlat=(39.7168, 41.0015), kind="land",
         terrain="sahil", vp=6, supply=22000, owner="ottoman",
         src="OSM/Nominatim", beach=True),
    dict(id="surmene", name="Sürmene", lonlat=(40.1144, 40.9142), kind="land",
         terrain="sahil", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim", beach=True),
    dict(id="rize", name="Rize", lonlat=(40.5219, 41.0201), kind="land",
         terrain="sahil", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim", beach=True),
    # Arhavi: bölüt merkezi ilçenin batı ucuna çekildi (Hopa'ya çok yakın).
    dict(id="arhavi", name="Arhavi", lonlat=(41.2200, 41.3200), kind="land",
         terrain="sahil", vp=2, supply=0, owner="ottoman",
         src="tasarım", beach=True),
    # Hopa: 1878 sınırının son Osmanlı limanı, Batum'a karşı ileri karakol.
    dict(id="hopa", name="Hopa", lonlat=(41.4167, 41.4000), kind="land",
         terrain="sahil", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim", beach=True),
    dict(id="gumushane", name="Gümüşhane", lonlat=(39.4817, 40.4600), kind="land",
         terrain="dag", vp=3, supply=0, owner="ottoman", src="OSM/Nominatim"),

    # ------------------------------------------------------------------
    # RUS / İTİLAF — Kafkas Ordusu bölgesi
    # ------------------------------------------------------------------
    # Sarıkamış: Rus demiryolunun başı ve cephenin düğümü.
    # 1914-15 kışında 3. Ordu burada donarak eridi.
    dict(id="sarikamis", name="Sarıkamış", lonlat=(42.5889, 40.3286), kind="land",
         terrain="dag", vp=9, supply=20000, owner="entente", src="OSM/Nominatim"),
    # Kars: Rus Kafkas Ordusu'nun kale şehri ve ana ikmal üssü.
    dict(id="kars", name="Kars", lonlat=(43.0975, 40.6013), kind="land",
         terrain="sehir", vp=7, supply=35000, owner="entente",
         src="OSM/Nominatim"),
    dict(id="selim", name="Selim", lonlat=(42.7922, 40.4525), kind="land",
         terrain="tepe", vp=1, supply=0, owner="entente", src="OSM/Nominatim"),
    dict(id="gole", name="Göle", lonlat=(42.6069, 40.7897), kind="land",
         terrain="tepe", vp=2, supply=0, owner="entente", src="OSM/Nominatim"),
    # Ardahan: Aralık 1914'te Osmanlı süvarisince kısa süre alındı.
    dict(id="ardahan", name="Ardahan", lonlat=(42.7022, 41.1097), kind="land",
         terrain="tepe", vp=4, supply=0, owner="entente", src="OSM/Nominatim"),
    dict(id="ahiska", name="Ahıska (Akhaltsikhe)", lonlat=(42.9833, 41.6400),
         kind="land", terrain="tepe", vp=3, supply=0, owner="entente",
         src="OSM/Nominatim"),
    dict(id="savsat", name="Şavşat", lonlat=(42.3597, 41.2411), kind="land",
         terrain="dag", vp=1, supply=0, owner="entente", src="OSM/Nominatim"),
    # Artvin-Borçka: Çoruh vadisi üzerinden Batum'u koruyan hat.
    dict(id="artvin", name="Artvin", lonlat=(41.8183, 41.1828), kind="land",
         terrain="dag", vp=3, supply=0, owner="entente", src="OSM/Nominatim"),
    dict(id="borcka", name="Borçka", lonlat=(41.6797, 41.3608), kind="land",
         terrain="dag", vp=2, supply=0, owner="entente", src="OSM/Nominatim"),
    # Batum: cephenin tek büyük limanı — Rus deniz ikmalinin kapısı.
    dict(id="batum", name="Batum", lonlat=(41.6367, 41.6414), kind="land",
         terrain="sahil", vp=7, supply=30000, owner="entente",
         src="OSM/Nominatim", beach=True),
    dict(id="kagizman", name="Kağızman", lonlat=(43.1353, 40.1456), kind="land",
         terrain="tepe", vp=2, supply=0, owner="entente", src="OSM/Nominatim"),
    # Gümrü: Kars-Tiflis demiryolunun kavşağı, Rus arka ikmal merkezi.
    dict(id="gumru", name="Gümrü (Aleksandropol)", lonlat=(43.8453, 40.7894),
         kind="land", terrain="sehir", vp=5, supply=18000, owner="entente",
         src="OSM/Nominatim"),
    # Iğdır ovası: Ağrı Dağı eteğinde Rus toplanma alanı.
    dict(id="igdir", name="Iğdır", lonlat=(44.0448, 39.9237), kind="land",
         terrain="ova", vp=3, supply=0, owner="entente", src="OSM/Nominatim"),
    dict(id="tasburun", name="Taşburun", lonlat=(43.8714, 39.8542), kind="land",
         terrain="ova", vp=1, supply=0, owner="entente", src="OSM/Nominatim"),
    # Erivan: güney kanadın Rus idare ve ikmal merkezi.
    dict(id="erivan", name="Erivan (Yerevan)", lonlat=(44.5152, 40.1872),
         kind="land", terrain="sehir", vp=6, supply=20000, owner="entente",
         src="OSM/Nominatim"),

    # ------------------------------------------------------------------
    # DENİZ — Karadeniz'in güneydoğu köşesi (enlem > 41.40)
    # Zincir: trabzon_aciklari - rize_aciklari - hopa_aciklari - batum_aciklari
    # Her biri komşusuna ve hemen güneyindeki kıyı iline değer.
    # ------------------------------------------------------------------
    dict(id="trabzon_aciklari", name="Trabzon Açıkları", lonlat=(39.8000, 41.6000),
         kind="sea", terrain="acik_deniz", vp=2, supply=0, owner="ottoman",
         src="tasarım"),
    dict(id="rize_aciklari", name="Rize Açıkları", lonlat=(40.6000, 41.5500),
         kind="sea", terrain="acik_deniz", vp=1, supply=0, owner="ottoman",
         src="tasarım"),
    dict(id="hopa_aciklari", name="Hopa Açıkları", lonlat=(41.3000, 41.6200),
         kind="sea", terrain="korfez", vp=2, supply=0, owner="entente",
         src="tasarım"),
    dict(id="batum_aciklari", name="Batum Açıkları", lonlat=(41.9500, 41.8200),
         kind="sea", terrain="korfez", vp=3, supply=0, owner="entente",
         src="tasarım"),
]
