"""Mezopotamya Cephesi il tohumları (Kasım 1914 - Ekim 1918).

build_map.py bu listeyi bölge adından import eder.

Kutu: boylam 43.40-48.40, enlem 29.60-34.60.
Cephe 6 Kasım 1914'te Fao'ya yapılan İngiliz çıkarmasıyla açılır; Fao ve
Basra Körfezi'nin başı dışında her yer Osmanlı'dır. İngiliz ordusu Şattularap'tan
Dicle boyunca yukarı çıkar: Basra -> Kurna -> Amara -> Kut -> Ktesifon, 1916'da
Kut'ta teslim olur, 1917'de Bağdat'ı alır, 1918'de Samarra/Tikrit hattına dayanır.

Koordinatı kutu sınırını birkaç km aşan gerçek yerleşimler (Fao, Ramadi, Kifri,
Tikrit) kutunun kenarına çekilmiştir; bunlar src="tasarım" ile işaretli.
"""
from __future__ import annotations

# İKMAL MERKEZİ SEYREK OLMALI.
# İlk yazımda illerin %65-77'si depoydu; Çanakkale'de bu oran %21.
# Depo her köyde olunca ikmal yayılımı bütün haritaya ulaşıyor, mesafe
# hiç ısırmıyor ve cephenin asıl dersi (ileri giden ordu kendi ikmal
# hattını uzatıp zayıflatır) ölüyor. Aşağıda yalnız gerçek menzil
# depoları ve limanlar depo olarak bırakıldı; kalanı sıfırlandı.
SEEDS: list[dict] = [
    # ---------------------------------------------------------------- deniz
    # Basra Körfezi'nin başı. İngiliz donanması ve nehir filosu buradan
    # beslenir; Şattularap ağzına bitişik olmalı ki çıkarma mümkün olsun.
    dict(id="sattularap_agzi", name="Şattularap Ağzı", lonlat=(48.33, 30.18), kind="sea",
         terrain="korfez", vp=2, supply=0, owner="entente",
         src="tasarım"),
    dict(id="korfez_basi", name="Körfez Başı", lonlat=(48.22, 29.82), kind="sea",
         terrain="korfez", vp=3, supply=20000, owner="entente",
         src="tasarım"),  # İngiliz filo üssü - İtilaf'ın ikinci deposu
    dict(id="kuveyt_acigi", name="Kuveyt Açığı", lonlat=(47.90, 29.66), kind="sea",
         terrain="korfez", vp=1, supply=0, owner="entente",
         src="tasarım"),

    # ------------------------------------------------- Şattularap ve Basra
    # Fao: 6 Kasım 1914, savaşın ilk İngiliz çıkarması. Tek İtilaf kara ili.
    dict(id="fao", name="Fao", lonlat=(48.38, 29.98), kind="land",
         terrain="sahil", vp=4, supply=8000, owner="entente",
         src="tasarım", beach=True),
    dict(id="abadan", name="Abadan", lonlat=(48.30, 30.34), kind="land",
         terrain="bataklik", vp=4, supply=0, owner="ottoman",
         src="OSM/Nominatim", beach=True),  # Anglo-Persian rafinerisi: seferin asıl sebebi
    dict(id="muhammere", name="Muhammere", lonlat=(48.10, 30.52), kind="land",
         terrain="bataklik", vp=2, supply=0, owner="ottoman",
         src="tasarım", beach=True),
    # Basra: İngiliz ordusunun savaş boyu ana üssü ve limanı.
    dict(id="basra", name="Basra", lonlat=(47.78, 30.51), kind="land",
         terrain="sehir", vp=7, supply=30000, owner="ottoman",
         src="OSM/Nominatim", beach=True),
    dict(id="suaybe", name="Şuaybe", lonlat=(47.55, 30.38), kind="land",
         terrain="bataklik", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Nisan 1915: Osmanlı karşı taarruzunun kırıldığı yer
    # Kurna: Dicle ile Fırat'ın birleştiği yer, Aralık 1914'te düştü.
    dict(id="kurna", name="Kurna", lonlat=(47.44, 31.01), kind="land",
         terrain="bataklik", vp=4, supply=0, owner="ottoman",
         src="OSM/Nominatim"),

    # ------------------------------------------------------- Fırat ekseni
    dict(id="suyuh", name="Sukü'ş-Şuyuh", lonlat=(46.47, 30.89), kind="land",
         terrain="bataklik", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="cibayis", name="Çibayiş", lonlat=(47.00, 30.95), kind="land",
         terrain="bataklik", vp=0, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Hammar gölü sazlıkları
    dict(id="nasiriye", name="Nasıriye", lonlat=(46.26, 31.05), kind="land",
         terrain="bataklik", vp=4, supply=6000, owner="ottoman",
         src="OSM/Nominatim"),  # Temmuz 1915'te alındı, Fırat kolunun kilidi
    dict(id="satra", name="Şatra", lonlat=(46.17, 31.41), kind="land",
         terrain="bataklik", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="semave", name="Semave", lonlat=(45.29, 31.33), kind="land",
         terrain="ova", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="rumeyse", name="Rumeyse", lonlat=(45.13, 31.60), kind="land",
         terrain="ova", vp=1, supply=0, owner="ottoman",
         src="tasarım"),
    dict(id="divaniye", name="Divaniye", lonlat=(44.93, 31.99), kind="land",
         terrain="ova", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="necef", name="Necef", lonlat=(44.33, 31.99), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # kutsal şehir; 1915'te aşiret ayaklanması
    dict(id="kerbela", name="Kerbela", lonlat=(44.02, 32.61), kind="land",
         terrain="ova", vp=4, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="hille", name="Hille", lonlat=(44.43, 32.47), kind="land",
         terrain="ova", vp=3, supply=6000, owner="ottoman",
         src="OSM/Nominatim"),  # Fırat üzerindeki menzil deposu
    dict(id="iskenderiye", name="İskenderiye", lonlat=(44.36, 32.88), kind="land",
         terrain="ova", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="felluce", name="Felluce", lonlat=(43.78, 33.35), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Mart 1917, Bağdat'ın batı kapısı
    dict(id="ramadi", name="Ramadi", lonlat=(43.45, 33.43), kind="land",
         terrain="ova", vp=4, supply=0, owner="ottoman",
         src="tasarım"),  # Eylül 1917: Osmanlı tümeni burada esir düştü

    # --------------------------------------------- Dicle ekseni: Kut'a kadar
    dict(id="ezeyr", name="Ezeyr", lonlat=(47.42, 31.32), kind="land",
         terrain="bataklik", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="kalatussalih", name="Kal'atüssalih", lonlat=(46.85, 31.52), kind="land",
         terrain="bataklik", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="amara", name="Amara", lonlat=(47.14, 31.84), kind="land",
         terrain="bataklik", vp=4, supply=10000, owner="ottoman",
         src="OSM/Nominatim"),  # Haziran 1915 "Townshend'in Regatası"
    dict(id="ali_garbi", name="Ali Garbi", lonlat=(46.80, 32.44), kind="land",
         terrain="ova", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Kut'u kurtarma ordusunun toplanma yeri
    dict(id="seyh_saad", name="Şeyh Saad", lonlat=(46.53, 32.61), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Ocak 1916, kurtarma harekâtının ilk muharebesi
    dict(id="felahiye", name="Felahiye", lonlat=(46.30, 32.57), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="tasarım"),  # Hanna boğazı mevzileri
    dict(id="sabis", name="Sabis", lonlat=(46.05, 32.53), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="tasarım"),  # Sannaiyat - kurtarma ordusunun kırıldığı son hat
    dict(id="kut_el_hai", name="Kutü'l-Hay", lonlat=(46.05, 32.17), kind="land",
         terrain="ova", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Hay kolu, Kut'un güney kanadı
    # Kut: cephenin kalbi. Aralık 1915 - Nisan 1916 kuşatması, 13.000 kişilik
    # İngiliz ordusunun teslim oluşu.
    dict(id="kut", name="Kûtü'l-Amâre", lonlat=(45.82, 32.51), kind="land",
         terrain="ova", vp=9, supply=15000, owner="ottoman",
         src="OSM/Nominatim"),

    # ------------------------------------------- Dicle ekseni: Kut - Bağdat
    dict(id="aziziye", name="Aziziye", lonlat=(45.07, 32.91), kind="land",
         terrain="ova", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Townshend'in Ktesifon öncesi son üssü
    dict(id="suveyra", name="Suveyra", lonlat=(44.78, 32.93), kind="land",
         terrain="ova", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="selmanpak", name="Selmanpâk (Ktesifon)", lonlat=(44.58, 33.09), kind="land",
         terrain="ova", vp=6, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # 22-25 Kasım 1915: İngiliz ilerleyişi burada durdu
    # Bağdat: seferin hedefi, vilayet merkezi, 11 Mart 1917'de düştü.
    dict(id="bagdat", name="Bağdat", lonlat=(44.36, 33.31), kind="land",
         terrain="sehir", vp=10, supply=40000, owner="ottoman",
         src="OSM/Nominatim"),

    # --------------------------------------- Dicle ekseni: Bağdat'ın kuzeyi
    dict(id="beled", name="Beled", lonlat=(44.14, 34.02), kind="land",
         terrain="ova", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="duluiye", name="Düluiye", lonlat=(44.65, 34.18), kind="land",
         terrain="ova", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="samarra", name="Samarra", lonlat=(43.87, 34.20), kind="land",
         terrain="ova", vp=5, supply=8000, owner="ottoman",
         src="OSM/Nominatim"),  # Nisan 1917, Bağdat demiryolunun son istasyonu
    dict(id="tikrit", name="Tikrit", lonlat=(43.68, 34.57), kind="land",
         terrain="tepe", vp=4, supply=0, owner="ottoman",
         src="tasarım"),  # Kasım 1917; Musul yolunun ağzı

    # ------------------------------------------- İran sınırı ve kuzeydoğu
    dict(id="bakuba", name="Bakuba", lonlat=(44.64, 33.75), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Diyale boyu, Hanekin yolunun başı
    dict(id="sahraban", name="Şahraban", lonlat=(44.94, 33.98), kind="land",
         terrain="tepe", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="bedre", name="Bedre", lonlat=(45.94, 33.10), kind="land",
         terrain="tepe", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="mendeli", name="Mendeli", lonlat=(45.55, 33.75), kind="land",
         terrain="tepe", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="hanekin", name="Hanekin", lonlat=(45.39, 34.35), kind="land",
         terrain="tepe", vp=4, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # İran'a açılan geçit; 13. Kolordu'nun yolu
    dict(id="kasri_sirin", name="Kasr-ı Şirin", lonlat=(45.58, 34.51), kind="land",
         terrain="dag", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Zagros eteği, İran sınır kapısı
    dict(id="kizilrabat", name="Kızılrabat", lonlat=(45.13, 34.18), kind="land",
         terrain="tepe", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="kifri", name="Kifri", lonlat=(44.96, 34.57), kind="land",
         terrain="tepe", vp=3, supply=0, owner="ottoman",
         src="tasarım"),  # Kerkük yolunun kavşağı, kömür ocakları
]
