import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Kuzey Afrika Seferi — Süveyş için çöl savaşı.
 *
 * Cephenin mekaniği ikmaldir: tek bir kıyı yolu, limanlar arası yüzlerce
 * kilometre ve ileri giden tarafın uzayan hattı. Cephe iki yıl boyunca
 * Mısır ile Libya arasında gidip geldi; her ilerleyiş ikmal menzilinin
 * sonunda durdu.
 */

const KA = 'https://tr.wikipedia.org/wiki/Kuzey_Afrika_Harekâtı';

const DE = 'Germany';
const IT = 'Italy';
const UK = 'United Kingdom';
const US = 'United States';
const AU = 'Australia';
const IN = 'India';
const ZA = 'Union of South Africa';

export const KUZEY_AFRIKA_PACK: FrontPack = {
  theatre: 'ww2_kuzey_afrika',

  formations: [
    // ── Mihver ──
    { nation: IT, name: '10. İtalyan Ordusu', templateId: 'it_ww2_piyade', at: [25.10, 31.60], src: KA },
    { nation: IT, name: 'Ariete Zırhlı Tümeni', templateId: 'uk_zirhli_tumen', at: [22.00, 32.10], arrivesOn: '1941-01-24', src: KA },
    { nation: IT, name: 'Trieste Motorlu Tümeni', templateId: 'it_ww2_piyade', at: [21.00, 32.40], arrivesOn: '1941-08-01', src: KA },
    { nation: DE, name: '15. Panzer Tümeni', templateId: 'de_panzer', at: [20.07, 32.11], arrivesOn: '1941-04-25', src: KA },
    { nation: DE, name: '21. Panzer Tümeni', templateId: 'de_panzer', at: [20.07, 32.11], arrivesOn: '1941-02-12', src: KA },
    { nation: DE, name: '90. Hafif Afrika Tümeni', templateId: 'de_ww2_piyade', at: [23.00, 32.00], arrivesOn: '1941-08-01', src: KA },
    // Tunus'a geç gelen takviye.
    { nation: DE, name: '5. Panzer Ordusu — Tunus', templateId: 'de_panzer', at: [10.18, 36.80], arrivesOn: '1942-11-12', src: KA },

    // ── Müttefikler ──
    { nation: UK, name: 'Batı Çöl Kuvveti', templateId: 'uk_ww2_piyade', at: [29.00, 31.20], src: KA },
    { nation: UK, name: '7. Zırhlı Tümen — Çöl Fareleri', templateId: 'uk_zirhli_tumen', at: [27.20, 31.35], src: KA },
    { nation: IN, name: '4. Hint Piyade Tümeni', templateId: 'uk_ww2_piyade', at: [28.00, 31.10], src: KA },
    { nation: AU, name: '9. Avustralya Tümeni', templateId: 'uk_ww2_piyade', at: [23.97, 32.08], arrivesOn: '1941-03-01', src: KA },
    { nation: ZA, name: '1. Güney Afrika Tümeni', templateId: 'uk_ww2_piyade', at: [27.50, 31.00], arrivesOn: '1941-05-01', src: KA },
    { nation: UK, name: '8. Ordu Karargâhı', templateId: 'uk_ww2_piyade', at: [29.90, 31.00], arrivesOn: '1941-09-26', src: KA },
    { nation: UK, name: '51. (Highland) Tümeni', templateId: 'uk_ww2_piyade', at: [28.95, 30.84], arrivesOn: '1942-08-01', src: KA },
    // Meşale Harekâtı — batıdan ikinci cephe.
    { nation: US, name: 'II. Amerikan Kolordusu', templateId: 'us_piyade_tumen', at: [-7.60, 33.57], arrivesOn: '1942-11-08', src: KA },
    { nation: US, name: '1. Zırhlı Tümen', templateId: 'uk_zirhli_tumen', at: [0.13, 35.70], arrivesOn: '1942-11-08', src: KA },
  ],

  commanders: [
    cmd(
      'rommel_afrika', 'Erwin Rommel', 'Mareşal', 'alman', 'ottoman', 'kara',
      [6, 5, 5, 2], ['taarruz_ruhu', 'ilham_veren', 'israfci'], '1941-02-12',
      'Alman Afrika Kolordusu ve sonra Panzerarmee Afrika Komutanı. ' +
      'İki kez Mısır sınırına dayandı. "Çöl Tilkisi" adını burada aldı.',
      'Taarruzda altı, ikmalde iki: her ilerleyişi kendi ikmal hattının ' +
      'sonunda durdu. Cephenin dersi tam budur.',
      KA,
    ),
    cmd(
      'wavell', 'Archibald Wavell', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [5, 4, 5, 4], ['taarruz_ruhu'], '1940-06-10',
      'Orta Doğu Başkomutanı. Pusula Harekâtı ile 10. İtalyan Ordusunu ' +
      'imha etti, ama birliklerinin bir kısmı Yunanistan\'a alınınca ' +
      'Rommel karşısında geriledi.',
      'Kazandığı kuvveti başka cepheye kaptırdı: taarruz 5.',
      KA, '1941-07-01',
    ),
    cmd(
      'auchinleck', 'Claude Auchinleck', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [4, 6, 5, 5], ['inatci_savunma', 'lojistikci'], '1941-07-01',
      'Orta Doğu Başkomutanı. Temmuz 1942\'de Birinci El Alameyn\'de ' +
      'Rommel\'i durdurdu — İskenderiye\'ye 100 kilometre kala.',
      'Cepheyi kurtaran savunma onundu ama görevden alındı: savunma 6.',
      KA, '1942-08-08',
    ),
    cmd(
      'montgomery', 'Bernard Montgomery', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [5, 6, 6, 6], ['temkinli', 'lojistikci'], '1942-08-13',
      '8. Ordu Komutanı. Üstünlük sağlanana kadar taarruz etmeyi reddetti; ' +
      '23 Ekim 1942\'de İkinci El Alameyn\'i başlattı.',
      'Malzeme ve ikmal üstünlüğünü bekledi, sonra vurdu: lojistik ve ' +
      'planlama 6.',
      KA,
    ),
    cmd(
      'graziani', 'Rodolfo Graziani', 'Mareşal', 'italyan', 'ottoman', 'kara',
      [3, 3, 2, 2], ['agir_kanli', 'israfci'], '1940-09-13',
      '10. İtalyan Ordusu Komutanı. Eylül 1940\'ta Mısır\'a girdi, ' +
      'Sidi Barrani\'de durdu ve kazdı. Pusula Harekâtı ordusunu imha etti.',
      'Zırhlı ve motorlu üstünlüğü olmadan çölde durağan savunma: ' +
      'planlama 2.',
      KA, '1941-02-11',
    ),
  ],

  events: [
    {
      id: 'ka_italyan_taarruz',
      date: '1940-09-13',
      title: 'İtalyan Taarruzu',
      body:
        'Graziani\'nin 10. Ordusu Libya\'dan Mısır\'a girdi ve Sidi ' +
        'Barrani\'de durup tahkimli kamplar kurdu. Kamplar birbirini ' +
        'destekleyemeyecek kadar uzaktı.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_compass',
      date: '1940-12-09',
      title: 'Pusula Harekâtı',
      body:
        'Baskın niteliğindeki İngiliz karşı taarruzu beş günlük bir ' +
        'akın olarak planlanmıştı; iki ayda Bingazi\'ye ulaştı ve ' +
        '10. İtalyan Ordusunu imha etti. Bu yenilgi Almanya\'yı cepheye ' +
        'kuvvet göndermeye zorladı.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_rommel',
      date: '1941-02-12',
      title: 'Rommel Trablus\'a Geldi',
      body:
        'Afrika Kolordusu Trablus\'a çıktı. Rommel savunmada kalma emrine ' +
        'rağmen hemen taarruza geçti ve Mart-Nisan\'da İngilizleri Mısır ' +
        'sınırına geri attı; Tobruk kuşatıldı.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_gazala',
      date: '1942-05-26',
      title: 'Gazala ve Tobruk',
      body:
        'Rommel Gazala hattını güneyden dolandı. 21 Haziran\'da Tobruk ' +
        'düştü ve 35.000 kişilik garnizon esir alındı. Rommel mareşalliğe ' +
        'terfi etti ama kuvveti tükenmişti.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_alameyn1',
      date: '1942-07-01',
      title: 'Birinci El Alameyn — Durduruldu',
      body:
        'Auchinleck, İskenderiye\'ye 100 kilometre kala Rommel\'i durdurdu. ' +
        'El Alameyn mevkiinin kıymeti coğrafyasındaydı: kuzeyde deniz, ' +
        'güneyde geçit vermeyen Kattara Çukuru — yani dolanılacak kanat yok.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_alameyn2',
      date: '1942-10-23',
      title: 'İkinci El Alameyn',
      body:
        'Montgomery, malzeme ve ikmal üstünlüğü sağlanana kadar bekledi, ' +
        'sonra topçu bombardımanıyla taarruza geçti. On iki gün sonra ' +
        'Mihver hattı yarıldı ve Afrika\'da geri dönüşsüz çekilme başladı.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_torch',
      date: '1942-11-08',
      title: 'Meşale Harekâtı',
      body:
        'Amerikan ve İngiliz kuvvetleri Fas ve Cezayir\'e çıktı. ' +
        'Mihver kuvvetleri iki ateş arasında kaldı: doğudan 8. Ordu, ' +
        'batıdan Meşale.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_tunus',
      date: '1943-05-13',
      title: 'Tunus — Afrika Bitti',
      body:
        'Mihver kuvvetleri Tunus\'ta teslim oldu. Esir sayısı Stalingrad ' +
        'ile karşılaştırılabilir düzeydeydi. Akdeniz Müttefiklere açıldı ve ' +
        'Sicilya çıkarmasının yolu hazırlandı.',
      kind: 'kara',
      src: KA,
    },
  ],
};
