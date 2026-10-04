/**
 * 1914 Büyük Savaş — ulus verisi.
 *
 * Oyun motoru iki taraflıdır (`Side`). Dünya senaryosunda eşleme şöyledir:
 *   ottoman → İTTİFAK DEVLETLERİ   (Almanya, Avusturya-Macaristan, Osmanlı, Bulgaristan)
 *   entente → İTİLAF DEVLETLERİ    (Britanya, Fransa, Rusya, İtalya, ABD, Japonya…)
 * Osmanlı İttifak'ta olduğu için bu eşleme anlamlıdır ve tip değişikliği
 * gerektirmez.
 *
 * Tümen sayıları seferberlik sonrası (Ağustos 1914) ve savaş boyunca ulaşılan
 * tepe değerler arasından, oyun ölçeğine göre seçilmiştir. Kaynaklar:
 *   https://en.wikipedia.org/wiki/World_War_I
 *   https://en.wikipedia.org/wiki/Order_of_battle_of_the_First_World_War
 */

export interface NationSpec {
  /** world.json içindeki `nation` alanıyla birebir eşleşmeli. */
  readonly id: string;
  readonly tr: string;
  readonly side: 'ittifak' | 'itilaf' | 'tarafsiz';
  /** Savaşa giriş tarihi; yoksa savaşın ilk günü itibarıyla savaşta. */
  readonly joins?: string;
  /**
   * Savaştan ÇIKIŞ tarihi (yenilgi, mütareke, işgal). Bu tarihten sonra
   * başlayan cephelerde ulus hiç sahaya çıkmaz. Polonya 1939'da yenildi;
   * bu alan olmadan 1941 Doğu Cephesi'nde Polonya tümenleri sahaya iniyordu.
   */
  readonly leaves?: string;
  /** Başkent — en yakın kara ili seçilir. */
  readonly capital?: readonly [number, number];
  readonly capitalName?: string;
  /** Sahaya sürülen tümen sayısı (oyun ölçeği). */
  readonly divisions: number;
  /** Takviye havuzu (kişi). */
  readonly manpower: number;
  /** Büyük savaş gemisi sayısı (dretnot + pre-dretnot). */
  readonly capitalShips: number;
  readonly cruisers: number;
  /** Sömürge birlikleri ana vatan dışına da yerleşsin mi. */
  readonly colonial?: boolean;
}

export const NATIONS: readonly NationSpec[] = [
  // ══ İTTİFAK DEVLETLERİ ════════════════════════════════════════════
  {
    id: 'German Empire',
    tr: 'Alman İmparatorluğu',
    side: 'ittifak',
    capital: [13.405, 52.52],
    capitalName: 'Berlin',
    divisions: 98,
    manpower: 4500000,
    capitalShips: 39,
    cruisers: 45,
    colonial: true,
  },
  {
    id: 'Austro-Hungarian Empire',
    tr: 'Avusturya-Macaristan',
    side: 'ittifak',
    capital: [16.373, 48.208],
    capitalName: 'Viyana',
    divisions: 49,
    manpower: 2200000,
    capitalShips: 12,
    cruisers: 10,
  },
  {
    id: 'Ottoman Empire',
    tr: 'Osmanlı İmparatorluğu',
    side: 'ittifak',
    joins: '1914-10-29',
    capital: [28.979, 41.008],
    capitalName: 'İstanbul',
    divisions: 36,
    manpower: 1400000,
    capitalShips: 4,
    cruisers: 4,
  },
  {
    id: 'Bulgaria',
    tr: 'Bulgaristan',
    side: 'ittifak',
    joins: '1915-10-14',
    capital: [23.322, 42.698],
    capitalName: 'Sofya',
    divisions: 12,
    manpower: 600000,
    capitalShips: 0,
    cruisers: 1,
  },

  // ══ İTİLAF DEVLETLERİ ═════════════════════════════════════════════
  {
    id: 'United Kingdom of Great Britain and Ireland',
    tr: 'Birleşik Krallık',
    side: 'itilaf',
    capital: [-0.1276, 51.5072],
    capitalName: 'Londra',
    divisions: 70,
    manpower: 5000000,
    capitalShips: 55,
    cruisers: 110,
    colonial: true,
  },
  {
    id: 'France',
    tr: 'Fransa',
    side: 'itilaf',
    capital: [2.3522, 48.8566],
    capitalName: 'Paris',
    divisions: 93,
    manpower: 4000000,
    capitalShips: 22,
    cruisers: 30,
    colonial: true,
  },
  {
    id: 'Russia',
    tr: 'Rusya',
    side: 'itilaf',
    capital: [30.336, 59.934],
    capitalName: 'Petrograd',
    divisions: 114,
    manpower: 5800000,
    capitalShips: 11,
    cruisers: 14,
  },
  {
    id: 'Serbia',
    tr: 'Sırbistan',
    side: 'itilaf',
    capital: [20.457, 44.787],
    capitalName: 'Belgrad',
    divisions: 11,
    manpower: 450000,
    capitalShips: 0,
    cruisers: 0,
  },
  {
    id: 'Belgium',
    tr: 'Belçika',
    side: 'itilaf',
    capital: [4.3517, 50.8503],
    capitalName: 'Brüksel',
    divisions: 7,
    manpower: 270000,
    capitalShips: 0,
    cruisers: 0,
  },
  {
    id: 'Montenegro',
    tr: 'Karadağ',
    side: 'itilaf',
    capital: [19.26, 42.44],
    capitalName: 'Çetine',
    divisions: 2,
    manpower: 50000,
    capitalShips: 0,
    cruisers: 0,
  },
  {
    id: 'Empire of Japan',
    tr: 'Japonya',
    side: 'itilaf',
    joins: '1914-08-23',
    capital: [139.69, 35.69],
    capitalName: 'Tokyo',
    divisions: 21,
    manpower: 800000,
    capitalShips: 16,
    cruisers: 25,
  },
  {
    id: 'Italy',
    tr: 'İtalya',
    side: 'itilaf',
    joins: '1915-05-23',
    capital: [12.4964, 41.9028],
    capitalName: 'Roma',
    divisions: 36,
    manpower: 2000000,
    capitalShips: 14,
    cruisers: 12,
  },
  {
    id: 'Portugal',
    tr: 'Portekiz',
    side: 'itilaf',
    joins: '1916-03-09',
    capital: [-9.139, 38.722],
    capitalName: 'Lizbon',
    divisions: 4,
    manpower: 160000,
    capitalShips: 0,
    cruisers: 3,
  },
  {
    id: 'Romania',
    tr: 'Romanya',
    side: 'itilaf',
    joins: '1916-08-27',
    capital: [26.1025, 44.4268],
    capitalName: 'Bükreş',
    divisions: 15,
    manpower: 700000,
    capitalShips: 0,
    cruisers: 1,
  },
  {
    id: 'Greece',
    tr: 'Yunanistan',
    side: 'itilaf',
    joins: '1917-06-29',
    capital: [23.7275, 37.9838],
    capitalName: 'Atina',
    divisions: 9,
    manpower: 350000,
    capitalShips: 2,
    cruisers: 2,
  },
  {
    id: 'United States of America',
    tr: 'Amerika Birleşik Devletleri',
    side: 'itilaf',
    joins: '1917-04-06',
    capital: [-77.0369, 38.9072],
    capitalName: 'Washington',
    divisions: 42,
    manpower: 4000000,
    capitalShips: 37,
    cruisers: 30,
  },
  {
    id: 'China',
    tr: 'Çin',
    side: 'itilaf',
    joins: '1917-08-14',
    capital: [116.407, 39.904],
    capitalName: 'Pekin',
    divisions: 10,
    manpower: 1000000,
    capitalShips: 0,
    cruisers: 4,
  },
  {
    id: 'Brazil',
    tr: 'Brezilya',
    side: 'itilaf',
    joins: '1917-10-26',
    capital: [-43.1729, -22.9068],
    capitalName: 'Rio de Janeiro',
    divisions: 3,
    manpower: 200000,
    capitalShips: 2,
    cruisers: 3,
  },
  // ── İngiliz dominyonları: ayrı insan gücü, aynı taraf ──
  {
    id: 'Australia',
    tr: 'Avustralya',
    side: 'itilaf',
    capital: [149.13, -35.28],
    capitalName: 'Canberra',
    divisions: 5,
    manpower: 330000,
    capitalShips: 1,
    cruisers: 5,
  },
  {
    id: 'Canada',
    tr: 'Kanada',
    side: 'itilaf',
    capital: [-75.6972, 45.4215],
    capitalName: 'Ottawa',
    divisions: 4,
    manpower: 420000,
    capitalShips: 0,
    cruisers: 2,
  },
  {
    id: 'India',
    tr: 'Hindistan',
    side: 'itilaf',
    capital: [88.3639, 22.5726],
    capitalName: 'Kalküta',
    divisions: 9,
    manpower: 1200000,
    capitalShips: 0,
    cruisers: 2,
  },
  {
    id: 'New Zealand',
    tr: 'Yeni Zelanda',
    side: 'itilaf',
    capital: [174.776, -41.286],
    capitalName: 'Wellington',
    divisions: 2,
    manpower: 100000,
    capitalShips: 0,
    cruisers: 2,
  },
  {
    id: 'South Africa',
    tr: 'Güney Afrika',
    side: 'itilaf',
    capital: [28.188, -25.746],
    capitalName: 'Pretoria',
    divisions: 3,
    manpower: 150000,
    capitalShips: 0,
    cruisers: 0,
  },
];

export const NATION_BY_ID: Readonly<Record<string, NationSpec>> = Object.fromEntries(
  NATIONS.map((n) => [n.id, n]),
);

/** Taraf adları — dünya senaryosunda arayüzde görünen. */
export const SIDE_LABEL_WORLD = {
  ottoman: 'İTTİFAK',
  entente: 'İTİLAF',
} as const;

/**
 * Savaşın dönüm noktaları. Çanakkale senaryosundaki olay sistemiyle aynı
 * biçimde kullanılır; `src` alanları kaynak gösterir.
 */
const WIKI_WW1 = 'https://en.wikipedia.org/wiki/World_War_I';

export const WORLD_EVENTS: readonly {
  id: string;
  date: string;
  title: string;
  body: string;
  kind: 'deniz' | 'kara' | 'hava' | 'siyasi' | 'ikmal';
  src: string;
}[] = [
  {
    id: 'w_savas',
    date: '1914-07-28',
    title: 'Savaş İlan Edildi',
    body:
      'Avusturya-Macaristan Sırbistan\'a savaş ilan etti. Bir hafta içinde '
      + 'ittifak zinciri bütün Avrupa\'yı içine çekecek.',
    kind: 'siyasi',
    src: WIKI_WW1,
  },
  {
    id: 'w_belcika',
    date: '1914-08-04',
    title: 'Belçika İşgali — Britanya Savaşa Girdi',
    body:
      'Alman ordusu Schlieffen Planı gereği tarafsız Belçika\'ya girdi. '
      + 'Britanya aynı gün Almanya\'ya savaş ilan etti.',
    kind: 'kara',
    src: WIKI_WW1,
  },
  {
    id: 'w_tannenberg',
    date: '1914-08-26',
    title: 'Tannenberg',
    body:
      'Rus 2. Ordusu Doğu Prusya\'da imha edildi. Doğu cephesi Almanya '
      + 'lehine stabilize oldu.',
    kind: 'kara',
    src: WIKI_WW1,
  },
  {
    id: 'w_marne',
    date: '1914-09-06',
    title: 'Marne — Batı Cephesi Dondu',
    body:
      'Fransız karşı taarruzu Alman ilerleyişini Paris\'in 50 km kuzeyinde '
      + 'durdurdu. Hareketli savaş bitti; siper savaşı başlıyor.',
    kind: 'kara',
    src: WIKI_WW1,
  },
  {
    id: 'w_osmanli',
    date: '1914-10-29',
    title: 'Osmanlı Devleti Savaşa Girdi',
    body:
      'Amiral Souchon komutasındaki Osmanlı donanması Karadeniz\'de Rus '
      + 'limanlarını bombaladı. Boğazlar kapandı, Rusya\'nın ikmal yolu kesildi.',
    kind: 'deniz',
    src: WIKI_WW1,
  },
  {
    id: 'w_canakkale',
    date: '1915-03-18',
    title: 'Çanakkale — Boğaz Geçilmedi',
    body:
      'Birleşik Filo boğazı zorladı ve üç zırhlı kaybetti. Rusya\'ya güney '
      + 'koridorunu açma girişimi başarısız oldu.\n\n'
      + 'Bu muharebeyi ayrıntılı oynamak için Çanakkale 1915 senaryosunu seç.',
    kind: 'deniz',
    src: WIKI_WW1,
  },
  {
    id: 'w_italya',
    date: '1915-05-23',
    title: 'İtalya İtilaf Safında',
    body: 'Londra Antlaşması\'nın ardından İtalya Avusturya-Macaristan\'a savaş ilan etti.',
    kind: 'siyasi',
    src: WIKI_WW1,
  },
  {
    id: 'w_verdun',
    date: '1916-02-21',
    title: 'Verdun',
    body:
      'Alman ordusu Fransa\'yı "kan kaybından öldürmek" için Verdun\'e '
      + 'saldırdı. On ay sürecek, iki tarafa da yaklaşık 700 bin kayıp verecek.',
    kind: 'kara',
    src: WIKI_WW1,
  },
  {
    id: 'w_jutland',
    date: '1916-05-31',
    title: 'Jutland — Tek Büyük Deniz Muharebesi',
    body:
      'Açık Deniz Filosu ile Büyük Filo Kuzey Denizi\'nde karşılaştı. '
      + 'Britanya daha çok gemi kaybetti ama abluka kırılmadı.',
    kind: 'deniz',
    src: WIKI_WW1,
  },
  {
    id: 'w_somme',
    date: '1916-07-01',
    title: 'Somme',
    body: 'İlk gün 57.470 İngiliz kaybı. Savaşın en kanlı günü.',
    kind: 'kara',
    src: WIKI_WW1,
  },
  {
    id: 'w_abd',
    date: '1917-04-06',
    title: 'ABD Savaşa Girdi',
    body:
      'Sınırsız denizaltı harbi ve Zimmermann Telgrafı sonrası ABD Almanya\'ya '
      + 'savaş ilan etti. İtilaf\'ın insan gücü sorunu çözüldü.',
    kind: 'siyasi',
    src: WIKI_WW1,
  },
  {
    id: 'w_rusya',
    date: '1917-11-07',
    title: 'Bolşevik Devrimi',
    body:
      'Rusya savaştan çekiliyor. Almanya doğudaki tümenlerini batıya kaydırmaya '
      + 'başlayacak.',
    kind: 'siyasi',
    src: WIKI_WW1,
  },
  {
    id: 'w_brest',
    date: '1918-03-03',
    title: 'Brest-Litovsk',
    body: 'Rusya savaştan resmen çıktı. Doğu cephesi kapandı.',
    kind: 'siyasi',
    src: WIKI_WW1,
  },
  {
    id: 'w_bahar',
    date: '1918-03-21',
    title: 'Bahar Taarruzu',
    body:
      'Almanya, ABD birlikleri yığınak tamamlamadan önce batıda son büyük '
      + 'taarruzunu başlattı.',
    kind: 'kara',
    src: WIKI_WW1,
  },
  {
    id: 'w_mondros',
    date: '1918-10-30',
    title: 'Mondros Mütarekesi',
    body: 'Osmanlı Devleti savaştan çekildi.',
    kind: 'siyasi',
    src: WIKI_WW1,
  },
  {
    id: 'w_ateskes',
    date: '1918-11-11',
    title: '11 Kasım 1918 — Ateşkes',
    body:
      'Compiègne\'de ateşkes imzalandı. Dört yıl üç ay süren savaşta yaklaşık '
      + '20 milyon insan öldü.',
    kind: 'siyasi',
    src: WIKI_WW1,
  },
];

export const WORLD_START = '1914-07-28';
export const WORLD_END = '1918-11-11';
