/**
 * Cephe kaydı — iki dünya savaşı, kesin tarihler.
 *
 * Her tarih birincil kronolojilerden alınmıştır:
 *   1. Dünya Savaşı — National WWI Museum and Memorial, "Key Dates"
 *      https://www.theworldwar.org/learn/about-wwi/key-dates
 *   2. Dünya Savaşı — United States Holocaust Memorial Museum,
 *      "World War II Dates and Timeline"
 *      https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates
 *
 * `bbox` oynanabilir alanı sınırlar: dünya haritasındaki 4.575 ilin yalnız o
 * dikdörtgene düşenleri yüklenir. Kutular cephenin fiilî harekât alanını
 * kapsayacak şekilde seçilmiştir.
 */

export type WarId = 'ww1' | 'ww2';

export interface Theatre {
  readonly id: string;
  readonly war: WarId;
  readonly name: string;
  /** Tek satırlık tanıtım. */
  readonly tagline: string;
  readonly desc: string;
  /** ISO. Kaynaklarla birebir. */
  readonly start: string;
  readonly end: string;
  /** [batı, güney, doğu, kuzey] derece. Boşsa tüm dünya. */
  readonly bbox?: readonly [number, number, number, number];
  /** Kürede işaretin konduğu nokta [lon, lat]. */
  readonly pin: readonly [number, number];
  /** Kendi yüksek çözünürlüklü haritası varsa. */
  readonly ownMap?: 'canakkale';
  /**
   * 1914/1938 sınır verisi cephe tarihindeki durumu veremediğinde düzeltme.
   * Örnek: İtalya Seferi Temmuz 1943'te başlar; o tarihte Fransız Kuzey
   * Afrikası ve Libya Müttefiklerin elindedir, ama elimizdeki harita 1938
   * sınırlarını taşır. Burada listelenen ULUSLARIN toprakları belirtilen
   * tarafa verilir.
   */
  readonly flip?: readonly { readonly nation: string; readonly to: 'a' | 'b' }[];
  /** Taraf adları — bu cephede kimler karşı karşıya. */
  readonly sides: { readonly a: string; readonly b: string };
  readonly src: string;
}

const WWI_KEY = 'https://www.theworldwar.org/learn/about-wwi/key-dates';
const WWII_KEY =
  'https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates';

export const THEATRES: readonly Theatre[] = [
  // ══════════════════════ BİRİNCİ DÜNYA SAVAŞI ══════════════════════
  {
    id: 'ww1_dunya',
    war: 'ww1',
    name: 'Büyük Savaş — Tüm Dünya',
    tagline: '4.575 il · bütün cepheler',
    desc:
      'Avusturya-Macaristan 28 Temmuz 1914\'te Sırbistan\'a savaş ilan etti; '
      + 'bir hafta içinde ittifak zinciri bütün Avrupa\'yı ve sömürge '
      + 'imparatorluklarını içine çekti. Dört yıl üç ay sonra Compiègne\'de '
      + 'ateşkes imzalandı.',
    start: '1914-07-28',
    end: '1918-11-11',
    pin: [12, 48],
    sides: { a: 'İttifak Devletleri', b: 'İtilaf Devletleri' },
    src: WWI_KEY,
  },
  {
    id: 'ww1_bati',
    war: 'ww1',
    name: 'Batı Cephesi',
    tagline: 'Siper savaşının doğduğu yer',
    desc:
      'Almanya 4 Ağustos 1914\'te tarafsız Belçika\'ya girdi ve Britanya aynı '
      + 'gün savaş ilan etti. Schlieffen Planı 5-12 Eylül\'de Marne\'de durduruldu; '
      + 'Ypres\'te kanatlardan dolanma çabaları sonuçsuz kalınca cephe '
      + 'Manş\'tan İsviçre\'ye kadar dondu ve dört yıl kıpırdamadı.',
    start: '1914-08-04',
    end: '1918-11-11',
    bbox: [-4, 44, 13.5, 53.5],
    pin: [3.5, 49.5],
    sides: { a: 'Almanya', b: 'Fransa · Britanya · Belçika' },
    src: WWI_KEY,
  },
  {
    id: 'ww1_dogu',
    war: 'ww1',
    name: 'Doğu Cephesi',
    tagline: 'Tannenberg\'den Brest-Litovsk\'a',
    desc:
      'Rus 2. Ordusu Ağustos 1914\'te Tannenberg\'de imha edildi. Cephe batıdaki '
      + 'gibi donmadı; yüzlerce kilometrelik hareketli savaş sürdü. '
      + '3 Mart 1918\'de Brest-Litovsk Antlaşması\'yla Rusya savaştan çıktı.',
    start: '1914-08-17',
    end: '1918-03-03',
    bbox: [18, 44, 34, 58],
    pin: [25, 52],
    sides: { a: 'Almanya · Avusturya-Macaristan', b: 'Rusya' },
    src: WWI_KEY,
  },
  {
    id: 'ww1_canakkale',
    war: 'ww1',
    name: 'Çanakkale 1915',
    tagline: '47 il · tabya, mayın, çıkarma',
    desc:
      'Birleşik Filo 19 Şubat 1915\'te boğazı zorlamaya başladı. 18 Mart\'ta '
      + 'üç zırhlı mayınlara gitti; 25 Nisan\'da savaş karaya taşındı. '
      + '9 Ocak 1916\'da son İtilaf askeri Seddülbahir\'den ayrıldı.',
    start: '1915-02-19',
    end: '1916-01-09',
    ownMap: 'canakkale',
    pin: [26.4, 40.15],
    sides: { a: 'Osmanlı İmparatorluğu', b: 'İtilaf Devletleri' },
    src: WWI_KEY,
  },
  {
    id: 'ww1_italyan',
    war: 'ww1',
    name: 'İtalyan Cephesi',
    tagline: 'Isonzo ve Alpler',
    desc:
      'İtalya 23 Mayıs 1915\'te Avusturya-Macaristan\'a savaş ilan etti. '
      + 'Isonzo nehri boyunca on iki muharebe yapıldı; cephe 2.000 metrenin '
      + 'üzerindeki buzullara kadar uzandı.',
    start: '1915-05-23',
    end: '1918-11-04',
    bbox: [8, 44, 17, 48],
    pin: [13, 46],
    sides: { a: 'Avusturya-Macaristan', b: 'İtalya' },
    src: WWI_KEY,
  },
  {
    id: 'ww1_balkan',
    war: 'ww1',
    name: 'Balkan Cephesi',
    tagline: 'Savaşın başladığı cephe',
    desc:
      'Savaş burada başladı. 6 Ekim 1915\'te Avusturya-Macaristan ve Almanya '
      + 'Sırbistan\'a saldırdı; Bulgaristan 14 Ekim\'de savaş ilan edip doğudan '
      + 'girdi. Sırp ordusu Karadağ ve Arnavutluk üzerinden çekildi. Selanik '
      + 'cephesi 1918\'e kadar sürdü.',
    start: '1914-07-28',
    end: '1918-11-11',
    bbox: [17, 37.5, 29, 46.5],
    pin: [21, 43],
    sides: { a: 'Avusturya-Macaristan · Bulgaristan', b: 'Sırbistan · İtilaf' },
    src: WWI_KEY,
  },
  {
    id: 'ww1_kafkas',
    war: 'ww1',
    name: 'Kafkas Cephesi',
    tagline: 'Sarıkamış · dağ, kar, ikmal',
    desc:
      'Rus kuvvetleri 1 Kasım 1914\'te sınırı geçti. Enver Paşa 22 Aralık\'ta '
      + '3. Ordu\'yu Sarıkamış\'ta Rus ordusunu kuşatmaya sürdü; kolordular '
      + 'Allahüekber dağlarında kışa yenildi. Erzurum 1916\'da düştü, cephe '
      + 'ancak Rus çöküşüyle geri alındı.',
    start: '1914-11-01',
    end: '1918-03-03',
    bbox: [38.5, 37.8, 47.0, 42.5],
    pin: [42.0, 40.2],
    sides: { a: 'Osmanlı İmparatorluğu', b: 'Rusya' },
    src: 'https://tr.wikipedia.org/wiki/Sarıkamış_Harekâtı',
  },
  {
    id: 'ww1_mezopotamya',
    war: 'ww1',
    name: 'Mezopotamya Cephesi',
    tagline: 'Kûtü\'l-Amâre · nehir, ikmal, kuşatma',
    desc:
      'İngiliz-Hint kuvvetleri 6 Kasım 1914\'te Fao\'ya çıkıp Basra\'yı aldı. '
      + 'Bağdat\'a yürüyen 6. Puna Tümeni Selman-ı Pak\'ta durduruldu ve '
      + 'Kut\'ta 147 gün kuşatıldı; dört kurtarma harekâtı da kırıldı. '
      + '29 Nisan 1916\'da garnizon teslim oldu.',
    start: '1914-11-06',
    end: '1918-10-30',
    bbox: [41.0, 28.5, 50.0, 37.5],
    pin: [45.8, 32.5],
    sides: { a: 'Osmanlı İmparatorluğu', b: 'Britanya · Hindistan' },
    src: 'https://tr.wikipedia.org/wiki/Kûtü%27l-Amâre_Kuşatması',
  },
  {
    id: 'ww1_sina_filistin',
    war: 'ww1',
    name: 'Sina ve Filistin Cephesi',
    tagline: 'Süveyş\'ten Halep\'e · çöl, demiryolu, su',
    desc:
      'Osmanlı 4. Ordusu 1915 ve 1916\'da Süveyş Kanalı\'nı almaya çalıştı, '
      + 'ikisi de başarısız oldu. Allenby 27 Ekim 1917\'de Gazze-Birüssebi '
      + 'hattını kırdı, 9 Aralık\'ta Kudüs\'e girdi. 19 Eylül 1918\'de Nablus\'ta '
      + 'cephe çöktü; 38 günde 560 kilometre ilerleyen İngilizler Halep\'e ulaştı.',
    start: '1915-02-03',
    end: '1918-10-30',
    bbox: [30.5, 28.5, 38.5, 37.0],
    pin: [35.0, 31.6],
    sides: { a: 'Osmanlı İmparatorluğu', b: 'Britanya · Arap İsyanı' },
    src: 'https://tr.wikipedia.org/wiki/Sina_ve_Filistin_Cephesi',
  },
  {
    id: 'ww1_dogu_afrika',
    war: 'ww1',
    name: 'Doğu Afrika Seferi',
    tagline: 'Ateşkesten sonra biten savaş',
    desc:
      'Alman Doğu Afrikası\'nda Lettow-Vorbeck\'in küçük kuvveti dört yıl '
      + 'boyunca kendisinden kat kat büyük İtilaf ordularını oyaladı. '
      + 'Teslim 25 Kasım 1918\'de, Avrupa\'daki ateşkesten iki hafta sonra oldu.',
    start: '1914-08-03',
    end: '1918-11-25',
    bbox: [27, -13, 42, 3],
    pin: [35, -6],
    sides: { a: 'Almanya', b: 'Britanya · Belçika · Portekiz' },
    src: 'https://en.wikipedia.org/wiki/East_African_campaign_(World_War_I)',
  },

  // ══════════════════════ İKİNCİ DÜNYA SAVAŞI ═══════════════════════
  {
    id: 'ww2_dunya',
    war: 'ww2',
    name: 'İkinci Dünya Savaşı — Tüm Dünya',
    tagline: 'Tarihin en büyük savaşı',
    desc:
      'Almanya 1 Eylül 1939\'da Polonya\'yı işgal etti. Altı yıl sonra, '
      + '2 Eylül 1945\'te Japonya\'nın teslim belgesini imzalamasıyla savaş '
      + 'sona erdi.',
    start: '1939-09-01',
    end: '1945-09-02',
    pin: [15, 50],
    sides: { a: 'Mihver', b: 'Müttefikler' },
    src: WWII_KEY,
  },
  {
    id: 'ww2_polonya',
    war: 'ww2',
    name: 'Polonya Seferi',
    tagline: 'Savaşı başlatan 35 gün',
    desc:
      'Almanya 1 Eylül 1939\'da saldırdı; Britanya ve Fransa 3 Eylül\'de savaş '
      + 'ilan etti. Sovyetler Birliği 17 Eylül\'de doğudan girdi. Varşova '
      + '28 Eylül\'de teslim oldu, son direniş 6 Ekim\'de kırıldı.',
    start: '1939-09-01',
    end: '1939-10-06',
    bbox: [14, 47.5, 26, 55.5],
    pin: [20, 52],
    sides: { a: 'Almanya · SSCB', b: 'Polonya' },
    src: WWII_KEY,
  },
  {
    id: 'ww2_bati1940',
    war: 'ww2',
    name: 'Batı Avrupa 1940',
    tagline: 'Altı haftada Fransa',
    desc:
      'Almanya 10 Mayıs 1940\'ta Fransa ve tarafsız Alçak Ülkelere saldırdı. '
      + 'Lüksemburg aynı gün, Hollanda 14 Mayıs\'ta, Belçika 28 Mayıs\'ta '
      + 'teslim oldu. Fransa 22 Haziran\'da ateşkes imzaladı.',
    start: '1940-05-10',
    end: '1940-06-22',
    bbox: [-5, 43, 10, 54],
    pin: [3, 49],
    sides: { a: 'Almanya', b: 'Fransa · Britanya · Belçika · Hollanda' },
    src: WWII_KEY,
  },
  {
    id: 'ww2_kuzey_afrika',
    war: 'ww2',
    name: 'Kuzey Afrika Seferi',
    tagline: 'El Alamein ve Afrika Kolordusu',
    desc:
      'İtalya 13 Eylül 1940\'ta Libya\'dan Mısır\'a girdi; Almanya Şubat '
      + '1941\'de Afrika Kolordusu\'nu gönderdi. 23-24 Ekim 1942\'de El '
      + 'Alamein\'de yenilen Mihver kuvvetleri Tunus\'a çekildi ve '
      + '13 Mayıs 1943\'te teslim oldu.',
    start: '1940-09-13',
    end: '1943-05-13',
    bbox: [8, 20, 35, 37],
    flip: [{ nation: 'United Kingdom', to: 'b' }],
    pin: [22, 30],
    sides: { a: 'Almanya · İtalya', b: 'Britanya İmparatorluğu · ABD' },
    src: WWII_KEY,
  },
  {
    id: 'ww2_dogu',
    war: 'ww2',
    name: 'Doğu Cephesi',
    tagline: 'Barbarossa\'dan Berlin\'e',
    desc:
      'Almanya ve müttefikleri 22 Haziran 1941\'de Sovyetler Birliği\'ne '
      + 'saldırdı. Stalingrad\'da 6. Ordu Şubat 1943\'te teslim oldu, Kursk\'ta '
      + 'Temmuz 1943\'te taarruz gücü kırıldı. Sovyet orduları 16 Nisan '
      + '1945\'te Berlin\'i kuşattı.',
    start: '1941-06-22',
    end: '1945-05-08',
    bbox: [20, 43, 48, 61],
    pin: [33, 52],
    sides: { a: 'Almanya · Mihver', b: 'Sovyetler Birliği' },
    src: WWII_KEY,
  },
  {
    id: 'ww2_pasifik',
    war: 'ww2',
    name: 'Pasifik Savaşı',
    tagline: 'Pearl Harbor\'dan Tokyo Körfezi\'ne',
    desc:
      'Japonya 7 Aralık 1941\'de Pearl Harbor\'ı bombaladı. Midway\'de Haziran '
      + '1942\'de ilerleyiş durdu; Guadalcanal\'dan Okinawa\'ya ada ada '
      + 'çarpışıldı. Japonya 2 Eylül 1945\'te teslim oldu.',
    start: '1941-12-07',
    end: '1945-09-02',
    bbox: [95, -15, 180, 48],
    pin: [135, 20],
    sides: { a: 'Japonya', b: 'ABD · Britanya · Çin · Avustralya' },
    src: WWII_KEY,
  },
  {
    id: 'ww2_italya',
    war: 'ww2',
    name: 'İtalya Seferi',
    tagline: 'Sicilya, Salerno, Anzio',
    desc:
      'Müttefikler 10 Temmuz 1943\'te Sicilya\'ya çıktı; Mussolini 25 Temmuz\'da '
      + 'devrildi. Badoglio hükûmeti 8 Eylül\'de teslim oldu ama Almanlar '
      + 'kuzeyi ele geçirdi. Roma 4 Haziran 1944\'te kurtarıldı.',
    start: '1943-07-10',
    end: '1945-05-02',
    // Güney sınırı Kuzey Afrika'yı içerir: Temmuz 1943'te Müttefiklerin
    // çıkarma üssü orasıydı. Kutu yalnız İtalya olursa Müttefiklerin
    // haritada hiç toprağı kalmıyor ve cephe oynanamaz hâle geliyor.
    bbox: [6, 30, 20, 47],
    pin: [13, 42],
    flip: [
      // Mayıs 1943'te Mihver Tunus'ta teslim oldu; Fransız Kuzey Afrikası
      // ve Libya bu cephenin başında Müttefiklerin elindeydi.
      { nation: 'France', to: 'b' },
      { nation: 'United Kingdom', to: 'b' },
    ],
    sides: { a: 'Almanya · İtalyan Sosyal Cumhuriyeti', b: 'ABD · Britanya' },
    src: WWII_KEY,
  },
  {
    id: 'ww2_normandiya',
    war: 'ww2',
    name: 'Normandiya ve Batı Avrupa',
    tagline: 'İkinci cephe',
    desc:
      'Britanya, ABD ve Kanada birlikleri 6 Haziran 1944\'te Normandiya '
      + 'sahillerine çıktı. 25 Temmuz\'da köprübaşından çıkış yapıldı, '
      + '25 Ağustos\'ta Paris kurtarıldı. Almanya 7 Mayıs 1945\'te teslim oldu.',
    start: '1944-06-06',
    end: '1945-05-08',
    bbox: [-5, 46, 13, 54],
    pin: [1, 49.5],
    sides: { a: 'Almanya', b: 'ABD · Britanya · Kanada · Fransa' },
    src: WWII_KEY,
  },
];

export const THEATRE_BY_ID: Readonly<Record<string, Theatre>> = Object.fromEntries(
  THEATRES.map((t) => [t.id, t]),
);

export const WARS: readonly { id: WarId; name: string; years: string }[] = [
  { id: 'ww1', name: 'BİRİNCİ DÜNYA SAVAŞI', years: '1914 — 1918' },
  { id: 'ww2', name: 'İKİNCİ DÜNYA SAVAŞI', years: '1939 — 1945' },
];
