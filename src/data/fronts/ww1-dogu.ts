import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Doğu Cephesi — Tannenberg'den Brest-Litovsk'a.
 *
 * Teşkilât **Ağustos 1914**: Rus Kuzeybatı Cephesi'nin 1. ve 2. Orduları,
 * Güneybatı Cephesi'nin Galiçya'daki orduları, Doğu Prusya'daki Alman
 * 8. Ordusu ve Avusturya-Macaristan'ın Galiçya orduları.
 *
 * Batı'dan farkı hareketlilik: cephe hiç donmadı, yüzlerce kilometrelik
 * ilerleme ve çekilmeler oldu. Oyun bunu geniş il aralıklarıyla yansıtır.
 */

const DOGU = 'https://tr.wikipedia.org/wiki/Doğu_Cephesi_(I._Dünya_Savaşı)';
const TAN = 'https://tr.wikipedia.org/wiki/Tannenberg_Muharebesi';
const BRU = 'https://tr.wikipedia.org/wiki/Brusilov_Taarruzu';

const RU = 'Russia';
const DE = 'German Empire';
const AT = 'Austro-Hungarian Empire';

export const DOGU_PACK: FrontPack = {
  theatre: 'ww1_dogu',

  formations: [
    // ── Rus Kuzeybatı Cephesi — Doğu Prusya'ya giren iki ordu ──
    { nation: RU, name: '1. Ordu — Rennenkampf', templateId: 'ru_piyade_tumen', at: [23.90, 54.90], src: TAN },
    { nation: RU, name: '2. Ordu — Samsonov', templateId: 'ru_piyade_tumen', at: [21.57, 53.08], src: TAN },
    // ── Rus Güneybatı Cephesi — Galiçya ──
    { nation: RU, name: '4. Ordu', templateId: 'ru_piyade_tumen', at: [22.57, 51.25], src: DOGU },
    { nation: RU, name: '5. Ordu — Plehve', templateId: 'ru_piyade_tumen', at: [23.70, 51.00], src: DOGU },
    { nation: RU, name: '3. Ordu — Ruzski', templateId: 'ru_piyade_tumen', at: [25.60, 50.30], src: DOGU },
    { nation: RU, name: '8. Ordu — Brusilov', templateId: 'ru_piyade_tumen', at: [26.23, 49.42], src: BRU },
    { nation: RU, name: 'Sibirya Kazak Kolordusu', templateId: 'ru_kazak_tugay', at: [24.50, 52.00], src: DOGU },
    { nation: RU, name: 'Varşova Garnizonu', templateId: 'ru_piyade_tumen', at: [21.01, 52.23], src: DOGU },

    // ── Alman 8. Ordu — Doğu Prusya ──
    { nation: DE, name: '8. Ordu — Doğu Prusya', templateId: 'de_piyade_tumen', at: [19.03, 54.04], src: TAN },
    { nation: DE, name: 'I. Kolordu — von François', templateId: 'de_piyade_tumen', at: [20.51, 54.71], src: TAN },
    { nation: DE, name: 'XVII. Kolordu — von Mackensen', templateId: 'de_piyade_tumen', at: [20.60, 54.10], src: TAN },
    // 1915 Gorlice-Tarnów yarması için gelen ordu.
    { nation: DE, name: '11. Ordu — von Mackensen', templateId: 'de_piyade_tumen', at: [21.16, 49.66], arrivesOn: '1915-04-20', src: DOGU },

    // ── Avusturya-Macaristan — Galiçya ──
    { nation: AT, name: '1. Ordu — Dankl', templateId: 'at_piyade_tumen', at: [22.00, 50.40], src: DOGU },
    { nation: AT, name: '4. Ordu — Auffenberg', templateId: 'at_piyade_tumen', at: [23.00, 50.00], src: DOGU },
    { nation: AT, name: '3. Ordu — Brudermann', templateId: 'at_piyade_tumen', at: [24.03, 49.84], src: DOGU },
    { nation: AT, name: '2. Ordu — Böhm-Ermolli', templateId: 'at_piyade_tumen', at: [24.70, 49.30], arrivesOn: '1914-09-01', src: DOGU },
    { nation: AT, name: 'Przemyśl Müstahkem Mevkii', templateId: 'at_piyade_tumen', at: [22.78, 49.78], src: DOGU },
    { nation: AT, name: 'Karpat Dağ Tugayı', templateId: 'at_dag_tugay', at: [22.50, 49.20], src: DOGU },
  ],

  commanders: [
    cmd(
      'hindenburg', 'Paul von Hindenburg', 'Generaloberst', 'alman', 'ottoman', 'kara',
      [5, 6, 6, 5], ['inatci_savunma', 'ilham_veren'], '1914-08-22',
      '8. Ordu Komutanı, 22 Ağustos 1914\'te emekliliğinden çağrıldı. ' +
      'Tannenberg\'de Rus 2. Ordusunu imha etti; 1916\'da Genelkurmay ' +
      'Başkanı oldu.',
      'Tannenberg savaşın en eksiksiz imha muharebesidir: planlama 6.',
      TAN,
    ),
    cmd(
      'ludendorff_dogu', 'Erich Ludendorff', 'Tümgeneral', 'alman', 'ottoman', 'kara',
      [6, 5, 6, 4], ['taarruz_ruhu'], '1914-08-22',
      '8. Ordu Kurmay Başkanı. Hoffmann\'ın hazırladığı plan üzerine ' +
      'kuvvetleri Rennenkampf\'ın önünden çekip Samsonov\'un üstüne yığdı.',
      'İki Rus ordusunun birleşememesini kullandı: taarruz ve planlama 6.',
      TAN,
    ),
    cmd(
      'mackensen', 'August von Mackensen', 'Mareşal', 'alman', 'ottoman', 'kara',
      [6, 4, 6, 5], ['taarruz_ruhu', 'lojistikci'], '1915-04-20',
      '11. Ordu Komutanı. 2 Mayıs 1915\'te Gorlice-Tarnów\'da cepheyi yardı; ' +
      'Ruslar bütün Galiçya ve Polonya\'yı boşalttı.',
      'Yoğun topçu + dar cephe yarması: savaşın en başarılı taarruzu. ' +
      'Taarruz ve planlama 6.',
      DOGU,
    ),
    cmd(
      'conrad', 'Franz Conrad von Hötzendorf', 'Mareşal', 'avusturya', 'ottoman', 'kara',
      [5, 3, 3, 2], ['taarruz_ruhu', 'israfci'], '1914-08-17',
      'Avusturya-Macaristan Genelkurmay Başkanı. Galiçya\'da aynı anda hem ' +
      'Sırbistan\'a hem Rusya\'ya taarruz etmeye kalktı; ordu 1914 sonunda ' +
      'eğitimli subay kadrosunun çoğunu kaybetti.',
      'Planları kuvvetinin üstündeydi: taarruz 5, planlama ve lojistik 2-3.',
      DOGU,
    ),
    cmd(
      'samsonov', 'Aleksandr Samsonov', 'Korgeneral', 'rus', 'entente', 'kara',
      [4, 2, 2, 2], ['israfci'], '1914-08-17',
      '2. Ordu Komutanı. Tannenberg\'de kuşatıldı ve ordusu imha edildi; ' +
      '30 Ağustos 1914\'te intihar etti.',
      'Telsiz haberleşmesini şifresiz yaptı, 1. Ordu ile eşgüdüm kuramadı: ' +
      'planlama 2.',
      TAN, '1914-08-30',
    ),
    cmd(
      'rennenkampf', 'Pavel Rennenkampf', 'Korgeneral', 'rus', 'entente', 'kara',
      [3, 4, 2, 3], ['agir_kanli'], '1914-08-17',
      '1. Ordu Komutanı. Gumbinnen\'de kazandı ama Samsonov imha edilirken ' +
      'yardıma gitmedi.',
      'Kampanyanın en pahalı hareketsizliği: ağır kanlı, planlama 2.',
      TAN,
    ),
    cmd(
      'brusilov', 'Aleksey Brusilov', 'Orgeneral', 'rus', 'entente', 'kara',
      [6, 5, 6, 4], ['taarruz_ruhu', 'siper_ustasi'], '1916-03-17',
      'Güneybatı Cephesi Komutanı. 4 Haziran 1916\'da geniş cephede eşzamanlı ' +
      'taarruzla Avusturya-Macaristan hattını çökertti — savaşın en etkili ' +
      'Rus harekâtı.',
      'Tek noktada yığınak yerine çok noktadan baskı: ihtiyat kaydırmayı ' +
      'imkânsız kıldı. Taarruz ve planlama 6.',
      BRU,
    ),
  ],

  events: [
    {
      id: 'dogu_dogu_prusya',
      date: '1914-08-17',
      title: 'Rus Ordusu Doğu Prusya\'da',
      body:
        'Rus 1. ve 2. Orduları Doğu Prusya\'ya girdi. Fransa\'nın baskısıyla ' +
        'seferberlik tamamlanmadan taarruza geçilmişti; iki ordu Mazurya ' +
        'göllerinin iki yanından ayrı ayrı ilerliyordu.',
      kind: 'kara',
      src: TAN,
    },
    {
      id: 'dogu_tannenberg',
      date: '1914-08-26',
      title: 'Tannenberg',
      body:
        '26-30 Ağustos 1914. Hindenburg ve Ludendorff, Rennenkampf\'ın ' +
        'önünden kuvvet çekip Samsonov\'un 2. Ordusunun iki kanadına yığdı. ' +
        'Ordu kuşatıldı ve imha edildi; Samsonov 30 Ağustos\'ta intihar etti. ' +
        'Rus telsiz mesajlarının şifresiz gönderilmesi harekâtı kolaylaştırdı.',
      kind: 'kara',
      src: TAN,
    },
    {
      id: 'dogu_lemberg',
      date: '1914-09-03',
      title: 'Lemberg Düştü',
      body:
        'Galiçya\'da Avusturya-Macaristan orduları geri atıldı ve Lemberg ' +
        '(Lviv) Rusların eline geçti. Przemyśl kuşatıldı. Avusturya-Macaristan ' +
        'ordusu 1914 sonunda eğitimli subay kadrosunun büyük kısmını yitirdi.',
      kind: 'kara',
      src: DOGU,
    },
    {
      id: 'dogu_gorlice',
      date: '1915-05-02',
      title: 'Gorlice-Tarnów — Büyük Yarma',
      body:
        'Mackensen\'in 11. Ordusu dar bir cephede yoğun topçu ateşiyle Rus ' +
        'hattını yardı. Yarma stratejik çöküşe dönüştü: Ruslar Galiçya\'yı, ' +
        'ardından Polonya\'yı boşalttı. Varşova 5 Ağustos 1915\'te düştü.',
      kind: 'kara',
      src: DOGU,
    },
    {
      id: 'dogu_brusilov',
      date: '1916-06-04',
      title: 'Brusilov Taarruzu',
      body:
        'Brusilov, tek noktada yığınak yapmak yerine geniş cephede eşzamanlı ' +
        'taarruz etti; Avusturya-Macaristan ihtiyatlarını nereye kaydıracağını ' +
        'bilemedi ve hat çöktü. Savaşın en etkili Rus harekâtıdır ve ' +
        'Avusturya-Macaristan ordusunu bağımsız bir güç olmaktan çıkardı.',
      kind: 'kara',
      src: BRU,
    },
    {
      id: 'dogu_romanya',
      date: '1916-08-27',
      title: 'Romanya Savaşa Girdi',
      body:
        'Brusilov\'un başarısına güvenen Romanya İtilaf safında savaşa girdi. ' +
        'Mackensen ve Falkenhayn\'ın karşı harekâtı Romanya ordusunu birkaç ' +
        'ayda yendi; Bükreş 6 Aralık 1916\'da düştü.',
      kind: 'siyasi',
      src: DOGU,
    },
    {
      id: 'dogu_kerenski',
      date: '1917-07-01',
      title: 'Kerenski Taarruzu — Son Deneme',
      body:
        'Şubat Devrimi\'nden sonra Geçici Hükümet son bir taarruz denedi. ' +
        'Birkaç gün ilerledikten sonra ordu dağıldı; askerler cepheyi terk ' +
        'etmeye başladı. Rus ordusu bir daha toparlanamadı.',
      kind: 'kara',
      src: DOGU,
    },
    {
      id: 'dogu_brest',
      date: '1918-03-03',
      title: 'Brest-Litovsk',
      body:
        'Bolşevik hükümeti Brest-Litovsk Antlaşması\'nı imzalayarak savaştan ' +
        'çıktı. Doğuda serbest kalan Alman tümenleri Batı Cephesi\'ne kaydı ' +
        've 21 Mart 1918 Bahar Taarruzu\'nu mümkün kıldı.',
      kind: 'siyasi',
      src: DOGU,
    },
  ],
};
