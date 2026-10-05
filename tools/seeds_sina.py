"""Sina ve Filistin Cephesi il tohumları (Ocak 1915 - Ekim 1918).

build_map.py bu listeyi bölge adından import eder.

Kutu: boylam 31.90 - 36.60, enlem 28.90 - 33.60.

Başlangıç durumu Birinci Kanal Harekâtı (Ocak-Şubat 1915):
Sina ve Filistin Osmanlı elinde; Süveyş Kanalı'nın batı yakası
(Port Said, Kantara, İsmailiye, Süveyş) İngiliz/İtilaf elinde.

SU = İKMAL. Bu cephede ordu ancak kuyu hattı boyunca yürüyebildi.
Katya, Romani, Bir el-Abd, Ariş ve Bi'rüssebi kuyuları bu yüzden
`supply` taşır; Sina'nın iç çölü (Nahl, Kuntilla) sıfır ikmaldir.
Arazide ayrı "çöl" tipi olmadığı için kuzey Sina kum düzlükleri `ova`,
kumul sırtları (Romani, Katya) `tepe` ile verildi.
"""
from __future__ import annotations

# İKMAL MERKEZİ SEYREK OLMALI.
# İlk yazımda illerin %65-77'si depoydu; Çanakkale'de bu oran %21.
# Depo her köyde olunca ikmal yayılımı bütün haritaya ulaşıyor, mesafe
# hiç ısırmıyor ve cephenin asıl dersi (ileri giden ordu kendi ikmal
# hattını uzatıp zayıflatır) ölüyor. Aşağıda yalnız gerçek menzil
# depoları ve limanlar depo olarak bırakıldı; kalanı sıfırlandı.
SEEDS: list[dict] = [
    # --- Süveyş Kanalı hattı: İtilaf'ın savunduğu, Osmanlı'nın hedeflediği şerit ---
    dict(id="port_said", name="Port Said", lonlat=(32.30, 31.26), kind="land",
         terrain="sahil", vp=6, supply=40000, owner="entente", beach=True,
         src="OSM/Nominatim"),  # kanalın kuzey ağzı, İtilaf ana limanı
    dict(id="kantara", name="Kantara", lonlat=(32.32, 30.86), kind="land",
         terrain="ova", vp=6, supply=35000, owner="entente",
         src="OSM/Nominatim"),  # 1916'dan sonra Sina'ya uzanan demiryolu/su borusunun başı
    dict(id="ismailiye", name="İsmailiye", lonlat=(32.27, 30.59), kind="land",
         terrain="sehir", vp=7, supply=30000, owner="entente",
         src="OSM/Nominatim"),  # Kanal Harekâtı'nın asıl geçiş hedefi, Tusun bölgesi
    dict(id="suveys", name="Süveyş", lonlat=(32.53, 29.97), kind="land",
         terrain="sehir", vp=6, supply=20000, owner="entente", beach=True,
         src="OSM/Nominatim"),  # kanalın güney ağzı

    # --- Kuzey Sina kuyu hattı: Romani 1916'da Osmanlı ilerleyişinin son noktası ---
    dict(id="romani", name="Romani", lonlat=(32.61, 31.01), kind="land",
         terrain="tepe", vp=4, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Ağustos 1916 Romani Muharebesi; kumul sırtlar + kuyular
    dict(id="katya", name="Katya", lonlat=(32.92, 30.95), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="tasarım"),  # Katiye vaha kuşağının doğu merkezi (gerçek Katya 32.73'te,
                          # Romani'ye 12 km kaldığı için bölüt merkezi doğuya alındı);
                          # Nisan 1916 baskını, hattın suyu buradan
    dict(id="aris", name="Ariş", lonlat=(33.80, 31.13), kind="land",
         terrain="sahil", vp=4, supply=0, owner="ottoman", beach=True,
         src="OSM/Nominatim"),  # kuzey Sina'nın tek gerçek kasabası ve menzil deposu
    dict(id="refah_hanyunus", name="Refah ve Han Yunus", lonlat=(34.27, 31.31),
         kind="land", terrain="sahil", vp=3, supply=0, owner="ottoman", beach=True,
         src="OSM/Nominatim"),  # Ocak 1917 Refah Muharebesi, Sina'dan Filistin'e giriş
                                # kapısı; Han Yunus 7 km ötede olduğu için aynı il

    # --- İç ve güney Sina: susuz çöl, ikmal yok ---
    dict(id="nahl", name="Nahl", lonlat=(33.73, 29.90), kind="land",
         terrain="ova", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # orta Sina hac yolu menzili; çölün göbeği
    dict(id="kuntilla", name="Kuntilla", lonlat=(34.72, 30.06), kind="land",
         terrain="kayalik", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # güneydoğu Sina karakolu
    dict(id="akabe", name="Akabe", lonlat=(35.00, 29.53), kind="land",
         terrain="sahil", vp=4, supply=0, owner="ottoman", beach=True,
         src="OSM/Nominatim"),  # Temmuz 1917'de Arap kuvvetlerine düştü; isyanın limanı

    # --- Gazze - Bi'rüssebi hattı: cephenin 1917 kilidi ---
    dict(id="gazze", name="Gazze", lonlat=(34.47, 31.50), kind="land",
         terrain="sahil", vp=8, supply=20000, owner="ottoman", beach=True,
         src="OSM/Nominatim"),  # Mart/Nisan/Kasım 1917 üç Gazze Muharebesi
    dict(id="birussebi", name="Bi'rüssebi", lonlat=(34.79, 31.25), kind="land",
         terrain="ova", vp=7, supply=15000, owner="ottoman",
         src="OSM/Nominatim"),  # çöl kenarı; kuyuları yüzünden hayati. 31 Ekim 1917'de
                                # düşmesi bütün Gazze hattını çökertti
    dict(id="mecdel", name="Mecdel (Askalan)", lonlat=(34.57, 31.67), kind="land",
         terrain="sahil", vp=3, supply=0, owner="ottoman", beach=True,
         src="OSM/Nominatim"),  # Askalan harabeleri aynı il içinde; ayrı tohum
                                # konsaydı 6 km ile Mecdel'e yapışırdı

    # --- Yafa - Ramle: Kudüs'e giden kıyı ovası ---
    dict(id="yafa", name="Yafa", lonlat=(34.75, 32.05), kind="land",
         terrain="sahil", vp=5, supply=0, owner="ottoman", beach=True,
         src="OSM/Nominatim"),  # Kasım 1917'de alındı; Kudüs'ün limanı
    dict(id="ramle_lud", name="Ramle ve Lud", lonlat=(34.87, 31.93), kind="land",
         terrain="ova", vp=4, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Lud (Lydda) 3 km ötede olduğu için tek il;
                                # Kudüs demiryolu kavşağı

    # --- Yahudiye dağları ---
    dict(id="kudus", name="Kudüs", lonlat=(35.21, 31.78), kind="land",
         terrain="dag", vp=10, supply=25000, owner="ottoman",
         src="OSM/Nominatim"),  # 750 m; 9 Aralık 1917'de teslim. Cephenin siyasi hedefi.
                                # Beytüllahim 9 km güneyde kaldığı için bu ile dahildir
    dict(id="el_halil", name="El-Halil (Hebron)", lonlat=(35.10, 31.53), kind="land",
         terrain="dag", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Bi'rüssebi'den Kudüs'e dağ yolu
    dict(id="eriha", name="Eriha", lonlat=(35.45, 31.86), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Ürdün vadisi, deniz seviyesinin altında; Şubat 1918

    # --- Samiriye: 1918 Eylül taarruzunun kırıldığı yer ---
    dict(id="nablus", name="Nablus", lonlat=(35.26, 32.22), kind="land",
         terrain="dag", vp=5, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Yıldırım Ordular Grubu'nun karargâh bölgesi
    dict(id="tulkarem", name="Tulkarem", lonlat=(35.03, 32.31), kind="land",
         terrain="tepe", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # 8. Ordu karargâhı, 19 Eylül 1918'de yarıldı
    dict(id="cenin", name="Cenin", lonlat=(35.30, 32.46), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # çekilen orduların tıkandığı kavşak
    dict(id="lecun", name="Lecun (Megiddo)", lonlat=(35.18, 32.58), kind="land",
         terrain="tepe", vp=6, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Eylül 1918 Megiddo Muharebesi: cepheyi bitiren darbe

    # --- Celile ve kuzey kıyı ---
    dict(id="hayfa", name="Hayfa", lonlat=(34.99, 32.82), kind="land",
         terrain="sahil", vp=5, supply=15000, owner="ottoman", beach=True,
         src="OSM/Nominatim"),  # Hicaz demiryolunun Akdeniz ucu; 23 Eylül 1918
    dict(id="nasriye", name="Nasriye", lonlat=(35.30, 32.70), kind="land",
         terrain="tepe", vp=4, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Liman von Sanders'in karargâhı, 20 Eylül 1918 baskını
    dict(id="taberiye", name="Taberiye", lonlat=(35.53, 32.79), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Ürdün vadisi, göl kıyısı, deniz seviyesinin altında
    dict(id="beisan", name="Beisan", lonlat=(35.50, 32.50), kind="land",
         terrain="ova", vp=3, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # süvarinin Ürdün geçitlerini kapattığı nokta
    dict(id="sur", name="Sur", lonlat=(35.20, 33.27), kind="land",
         terrain="sahil", vp=2, supply=0, owner="ottoman", beach=True,
         src="OSM/Nominatim"),
    dict(id="sayda", name="Sayda", lonlat=(35.37, 33.56), kind="land",
         terrain="sahil", vp=3, supply=0, owner="ottoman", beach=True,
         src="OSM/Nominatim"),  # kuzey sınır limanı, Ekim 1918 kovalamacası

    # --- Ürdün doğusu ve Hicaz demiryolu: Arap isyanının cephesi ---
    dict(id="es_salt", name="Es-Salt", lonlat=(35.73, 32.04), kind="land",
         terrain="dag", vp=4, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # 1918'de iki başarısız İngiliz Ürdün akını
    dict(id="amman", name="Amman", lonlat=(35.93, 31.95), kind="land",
         terrain="dag", vp=5, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Hicaz demiryolu düğümü, 4. Ordu menzili
    dict(id="madaba", name="Madaba", lonlat=(35.80, 31.72), kind="land",
         terrain="tepe", vp=1, supply=0, owner="ottoman",
         src="OSM/Nominatim"),
    dict(id="kerek", name="Kerek", lonlat=(35.70, 31.18), kind="land",
         terrain="kayalik", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # kale kasabası, 1918 Arap ayaklanması
    dict(id="tefile", name="Tefile", lonlat=(35.60, 30.84), kind="land",
         terrain="dag", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Ocak 1918 Tefile Muharebesi (Arap kuvvetleri)
    dict(id="maan", name="Maan", lonlat=(35.73, 30.19), kind="land",
         terrain="ova", vp=4, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Hicaz demiryolunun güney kilit istasyonu; 1918 kuşatması
    dict(id="dera", name="Dera", lonlat=(36.10, 32.62), kind="land",
         terrain="ova", vp=6, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Hicaz ve Filistin hatlarının kavşağı; Eylül 1918'de
                                # kesilmesi Yıldırım'ın ikmalini bitirdi
    dict(id="kuneytra", name="Kuneytra", lonlat=(35.82, 33.13), kind="land",
         terrain="tepe", vp=2, supply=0, owner="ottoman",
         src="OSM/Nominatim"),  # Şam'a giden kuzey yolu
    dict(id="dimask", name="Dimaşk (Şam)", lonlat=(36.29, 33.51), kind="land",
         terrain="sehir", vp=9, supply=45000, owner="ottoman",
         src="OSM/Nominatim"),  # 4. Ordu ve bütün cephenin ana üssü; 1 Ekim 1918

    # --- Doğu Akdeniz: İtilaf donanması kıyı boyunca serbest hareket eder ---
    dict(id="denizi_portsaid", name="Port Said Açıkları", lonlat=(32.10, 31.60),
         kind="sea", terrain="acik_deniz", vp=3, supply=0, owner="entente",
         src="tasarım"),
    dict(id="denizi_gazze", name="Gazze Açıkları", lonlat=(34.00, 31.60),
         kind="sea", terrain="acik_deniz", vp=2, supply=0, owner="entente",
         src="tasarım"),  # Gazze muharebelerinde kıyıdan topçu desteği
    dict(id="denizi_yafa", name="Yafa Açıkları", lonlat=(34.40, 32.10),
         kind="sea", terrain="acik_deniz", vp=2, supply=0, owner="entente",
         src="tasarım"),
    dict(id="denizi_hayfa", name="Hayfa Açıkları", lonlat=(34.60, 32.95),
         kind="sea", terrain="korfez", vp=2, supply=0, owner="entente",
         src="tasarım"),  # Akka Körfezi
    dict(id="denizi_suveys_korfezi", name="Süveyş Körfezi", lonlat=(32.45, 29.30),
         kind="sea", terrain="korfez", vp=2, supply=0, owner="entente",
         src="tasarım"),
    dict(id="denizi_akabe_korfezi", name="Akabe Körfezi", lonlat=(34.75, 29.20),
         kind="sea", terrain="korfez", vp=2, supply=0, owner="entente",
         src="tasarım"),  # 1917 Akabe çıkarmasının deniz yolu
]
