# Çanakkale 1915 — çalışma kılavuzu

Gün-tur tabanlı, HOI4 esinli strateji oyunu. Çekirdeği Çanakkale 1915;
üzerine iki dünya savaşının 16 cephesi bindirilmiş.

**Dil kuralı:** arayüz, veri, yorum ve commit mesajı **Türkçe**; kod
kimlikleri (değişken, tip, dosya adı) **İngilizce**. Bu karışım bilinçli:
oyun Türkçe anlatıyor, kod uluslararası okunuyor.

---

## Komutlar

```bash
npm run dev         # Vite geliştirme sunucusu
npm run typecheck   # tsc --noEmit
npm test            # node:test, tsx üzerinden
npm run build       # typecheck + vite build
```

Harita verisi (ayrı, Python; sadece harita değişince çalıştırılır):

```bash
python3 tools/fetch_terrain.py <bolge>   # AWS terrarium karoları -> elev-<bolge>.npz
python3 tools/build_map.py <bolge>       # -> src/data/map-<bolge>.json + public/relief-<bolge>.png
```

`<bolge>`: `canakkale`, `kafkas`, `mezopotamya`, `sina`.
Bağımlılıklar: `numpy pillow scipy scikit-image`.

---

## Mimari

```
src/
  core/      saf veri ve geometri — oyun kuralı YOK
    types.ts     bütün paylaşılan tipler
    geo.ts       harita yükleme, il erişimi, mesafe, yol bulma
    heap.ts      min-yığın (ikmal yayılımı)
  data/      tarihsel veri — mantık YOK
    units.ts     tabur profilleri, tümen şablonları, arazi, hava
    forts.ts minefields.ts guns.ts oob.ts commanders.ts events.ts
    theatres.ts  18 tiyatro künyesi
    world1914.ts world1939.ts   ulus künyeleri
    fronts/      cephe içerik paketleri (aşağıya bak)
    map.json world.json globe.json   üretilmiş harita verisi
  engine/    oyun kuralları — DOM YOK, çizim YOK
    scenario.ts        Çanakkale senaryosu
    world-scenario.ts  dünya haritası senaryosu
    turn.ts            tur döngüsü, bütün fazlar
    combat.ts naval.ts air.ts supply.ts orders.ts
    ai.ts              Çanakkale yapay zekâsı
    world-ai.ts        dünya yapay zekâsı
    rng.ts             tohumlanmış rastgelelik
  render/    PixiJS çizimi — oyun kuralı YOK
  ui/        DOM panelleri
  main.ts    bağlama noktası
```

**Katman kuralı tek yönlü:** `core` hiçbir şeyi bilmez; `data` yalnız
`core`'u; `engine` `core` + `data`'yı; `render`/`ui` hepsini. Ters yönde
import YOK. `engine` içinde `document` ya da `window` geçmemeli.

---

## Değişmezler

- **Determinizm.** Aynı tohum + aynı emirler = aynı sonuç. `Math.random()`
  KULLANMA; `engine/rng.ts` kullan. Bir test bunu sabitliyor.
- **Harita tekil ve küresel.** `loadMap()` çağrılmadan `prov()` çalışmaz.
  Testlerde harita değiştiren bloklar dosyanın SONUNDA durur.
- **Ölçek haritaya bağlı.** Çanakkale 60 km, dünya 20.000 km. Mesafeye
  bağlı her sabit `mapKind()` sormalı: ikmal yıpranması (`supply.ts`),
  yürüyüş hızı (`turn.ts`). Sabit yazılan metre değeri er geç bir
  haritada saçmalar.
- **Taraf adları miras.** `'ottoman'` = İttifak/Mihver, `'entente'` =
  İtilaf/Müttefik. Çanakkale'den kalma; değiştirilemez. Oyuncuya
  gösterilen ad `theatre.sides.a/b`'den gelir — arayüzde ASLA sabit
  "Osmanlı"/"İtilaf" yazma.

---

## Cephe içerik paketi eklemek

`src/data/fronts/<savas>-<cephe>.ts` yaz, `fronts/index.ts`'e kaydet.

```ts
export const X_PACK: FrontPack = {
  theatre: 'ww2_x',      // theatres.ts'teki kimlikle BİREBİR aynı
  formations: [...],      // tarihsel, adlı birlikler
  commanders: [...],      // cmd(...) ile
  events: [...],
};
```

- `formations` ulusun kadrosundan DÜŞÜLÜR, onu değiştirmez: pakette 7
  birlik yazmak 60 tümenlik orduyu 7'ye indirmez, 53'ü prosedürel kurulur.
- Komutan kimlikleri **bütün cepheler arasında** benzersiz. Aynı kişi
  birden çok cephedeyse cephe öneki kullan: `ka_rommel`, `nm_rommel`.
- Olay tarihi tiyatronun `start`–`end` aralığında olmalı; dışındaki olay
  sessizce HİÇ ateşlenmez.
- `templateId`, ulus kimliği ve komutan özelliği METİNLE başvurulur;
  tsc denetlemez. `test/engine.test.ts` içindeki bütünlük testi denetler
  — yazdıktan sonra `npm test` çalıştır.

---

## Kaynak disiplini

Bu proje tarih öğretiyor; uydurma rakam en ağır hatadır.

- Her `formation`, `commander` ve `event` bir `src` taşır.
- **Kaynaklar çelişiyorsa tek rakam yazma.** Metinde aralık ver ve
  çeliştiğini söyle. Örnek: Sarıkamış kaybı 23.000–90.000; Tunus'ta
  esir 230.000–275.000.
- Komutan yetenek puanı `why` alanında gerekçelendirilir. Puan bir
  iddiadır, dayanağı yazılır.
- Yaklaşık koordinat `approx` ve `notes` ile işaretlenir.
- Olay bir ŞEY ÖĞRETMELİ. "X oldu" yetmez; neden sonuç verdiği yazılır.
  Yaygın efsane varsa açıkça düzeltilir (Polonya süvarisi tanka kılıçla
  saldırmadı; Barbarossa kıştan değil lojistikten kaybedildi).

---

## Muharebe modeli — kısa özet

Her iki taraf **karşı tarafın korumasına** vurur:

```
savunana hasar = A / (A + savunanın savunması)
saldırana hasar = D / (D + saldıranın DELMESİ)
```

`breakthrough` (Türkçe arayüzde "Delme") saldıranın korumasıdır. Siperdeki
piyadenin delmesi düşüktür — taarruz bu yüzden pahalıdır. Tankın yüksektir.

Zırh: hedefin `hardness` oranında `softAttack` yerine `hardAttack` işler.
Delme zırhın yarısının altındaysa ateş yarılanır. Tümenin delmesi düz
ortalama DEĞİL — en iyi silaha yaklaşmak cephede ona ayrılan paya bağlı
(%15 pay = tam değer). 1915 şablonlarının hepsinde zırh 0; kural o cepheye
hiç dokunmaz.

---

## Test politikası

`test/engine.test.ts` dosyasındaki her test **fiilen yaşanmış** bir hatayı
yakalamak için var. "Fonksiyon çağrılıyor mu" testi yazma.

Yeni test, gerçek bir tüketici hatasını yakalamalı: davranış, sınır,
değişmez, geçiş, öncelik, hata yolu. Yazdıktan sonra **eski kodda düştüğünü
doğrula** — düşmüyorsa test dekoratiftir, sil.

Her testin üstüne hangi hatayı yakaladığı yorumla yazılır.

---

## Doğrulama — yield etmeden önce

Test yetmez. Değişen yüzeyi **çalıştır**:

```bash
npm run typecheck && npm test && npm run build
```

sonra tarayıcıda gerçekten oyna: cepheyi seç, tarafı seç, 20-60 tur
çevir, günlüğü oku, konsol hatasını say. Motor değişikliği için ayrıca
başsız bir koşu yaz ve SAYIYLA ölç (kaç muharebe, kaç il el değiştirdi,
kaç birlik ikmalsiz). Bu oturumda bulunan hataların çoğu testlerden değil
bu ölçümlerden çıktı.

---

## Bilinen tuzaklar

- `newGame('ottoman')` demek **oyuncu Osmanlı** demektir; yapay zekâ
  karşı tarafı oynar. Başsız bir denemede "birlikler hiç kıpırdamıyor"
  görürsen önce tarafı kontrol et — büyük ihtimalle senin tarafındalar
  ve emir vermedin.
- `loadMap('world', ...)` YANLIŞ. Geçerli değerler `'canakkale'` ve
  `'dunya'`. Yanlış değer sessizce Çanakkale ölçeğini kullanır ve
  ikmali/hareketi tamamen bozar.
- Günlük yalnız ilk 4 satırı gösterir ve "anahtar" satırları öne alır
  (`main.ts` içindeki `KEY` düzenli ifadesi). Öğretici bir satır
  eklediysen anahtar listesine de ekle, yoksa oyuncuya hiç ulaşmaz.
- Tiyatro kutusu (`bbox`) haritayı kırpar. Kırpılmış cephede bir ulusun
  başkenti harita dışında kalabilir — o yüzden ikmal deposu ataması
  başkentten BAĞIMSIZ çalışmalıdır.
