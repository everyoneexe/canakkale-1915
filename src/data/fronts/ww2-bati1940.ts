import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Batı Avrupa 1940 — Sichelschnitt.
 *
 * Müttefikler ana Alman taarruzunu Belçika ovasında bekliyordu. Asıl
 * darbe geçilmez sayılan Ardennes ormanından geldi; zırhlı kol Manş'a
 * ulaşınca kuzeydeki bütün müttefik ordular kesildi.
 */

const B40 = 'https://tr.wikipedia.org/wiki/Fransa_Muharebesi';

const DE = 'Germany';
const FR = 'France';
const UK = 'United Kingdom';
const BE = 'Belgium';
const NL = 'Netherlands';

export const BATI1940_PACK: FrontPack = {
  theatre: 'ww2_bati1940',

  formations: [
    // ── Alman ordu grupları ──
    // A Grubu: Ardennes'ten gelen asıl darbe.
    { nation: DE, name: 'A Ordular Grubu — Rundstedt', templateId: 'de_ww2_piyade', at: [6.60, 50.10], src: B40 },
    { nation: DE, name: 'XIX. Panzer Kolordusu — Guderian', templateId: 'de_panzer', at: [6.13, 49.95], src: B40 },
    { nation: DE, name: 'XV. Panzer Kolordusu — Hoth', templateId: 'de_panzer', at: [6.40, 50.30], src: B40 },
    { nation: DE, name: '7. Panzer Tümeni — Rommel', templateId: 'de_panzer', at: [6.20, 50.25], src: B40 },
    // B Grubu: Hollanda ve Belçika'da aldatma darbesi.
    { nation: DE, name: 'B Ordular Grubu — Bock', templateId: 'de_ww2_piyade', at: [6.08, 51.50], src: B40 },
    { nation: DE, name: '18. Ordu — Hollanda', templateId: 'de_ww2_piyade', at: [6.17, 51.85], src: B40 },
    // C Grubu: Maginot Hattı karşısında tespit.
    { nation: DE, name: 'C Ordular Grubu — Leeb', templateId: 'de_ww2_piyade', at: [7.00, 49.20], src: B40 },

    // ── Fransız ordular ──
    { nation: FR, name: '1. Ordu — Blanchard', templateId: 'fr_piyade_tumen', at: [3.40, 50.50], src: B40 },
    { nation: FR, name: '7. Ordu — Giraud', templateId: 'fr_piyade_tumen', at: [3.10, 51.00], src: B40 },
    { nation: FR, name: '9. Ordu — Corap', templateId: 'fr_piyade_tumen', at: [4.70, 50.00], src: B40 },
    { nation: FR, name: '2. Ordu — Huntziger', templateId: 'fr_piyade_tumen', at: [4.95, 49.70], src: B40 },
    { nation: FR, name: 'Maginot Hattı Garnizonu', templateId: 'fr_piyade_tumen', at: [6.50, 49.00], src: B40 },
    { nation: FR, name: 'Paris Savunması', templateId: 'fr_piyade_tumen', at: [2.35, 48.86], arrivesOn: '1940-06-01', src: B40 },

    // ── Müttefikler ──
    { nation: UK, name: 'İngiliz Sefer Kuvveti (BEF)', templateId: 'uk_ww2_piyade', at: [3.70, 50.60], src: B40 },
    { nation: UK, name: '1. Zırhlı Tümen', templateId: 'uk_zirhli_tumen', at: [2.30, 49.90], arrivesOn: '1940-05-20', src: B40 },
    { nation: BE, name: 'Belçika Ordusu', templateId: 'be_piyade_tumen', at: [4.70, 50.85], src: B40 },
    { nation: NL, name: 'Hollanda Ordusu', templateId: 'be_piyade_tumen', at: [5.10, 52.00], src: B40 },
  ],

  commanders: [
    cmd(
      'manstein', 'Erich von Manstein', 'Korgeneral', 'alman', 'ottoman', 'kara',
      [6, 5, 6, 4], ['taarruz_ruhu'], '1940-05-10',
      'Sichelschnitt planının yazarı. Ana darbeyi Belçika ovasından alıp ' +
      'geçilmez sayılan Ardennes ormanına kaydırdı.',
      'Savaşın en etkili harekât planı: planlama 6.',
      B40,
    ),
    cmd(
      'guderian_1940', 'Heinz Guderian', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 3, 6, 4], ['taarruz_ruhu', 'israfci'], '1940-05-10',
      'XIX. Panzer Kolordusu Komutanı. 13 Mayıs\'ta Sedan\'da Meuse\'u geçti, ' +
      '20 Mayıs\'ta Manş kıyısına ulaştı.',
      'On günde 400 kilometre: taarruz 6, savunma 3.',
      B40,
    ),
    cmd(
      'rommel_1940', 'Erwin Rommel', 'Tümgeneral', 'alman', 'ottoman', 'kara',
      [6, 4, 5, 3], ['taarruz_ruhu', 'ilham_veren'], '1940-05-10',
      '7. Panzer Tümeni Komutanı. O kadar hızlı ilerledi ki kendi ' +
      'karargâhı bile yerini kaybetti; tümen "Hayalet Tümen" diye anıldı.',
      'Hızı bir silah olarak kullandı: taarruz 6.',
      B40,
    ),
    cmd(
      'gamelin', 'Maurice Gamelin', 'Orgeneral', 'fransiz', 'entente', 'kara',
      [2, 3, 2, 3], ['agir_kanli'], '1940-05-10',
      'Fransız Başkomutanı. En iyi birlikleri Belçika\'ya sürdü, ihtiyat ' +
      'bırakmadı. Karargâhında telsiz yoktu; emirler motosikletli ulakla ' +
      'gidiyordu. 19 Mayıs\'ta görevden alındı.',
      'Yarmaya karşı ihtiyatı yoktu: planlama 2.',
      B40, '1940-05-19',
    ),
    cmd(
      'weygand', 'Maxime Weygand', 'Orgeneral', 'fransiz', 'entente', 'kara',
      [3, 5, 4, 3], ['inatci_savunma'], '1940-05-19',
      'Gamelin\'in yerine başkomutan. Somme-Aisne boyunca "Weygand Hattı"nı ' +
      'kurdu; hat 5 Haziran\'da yarıldı.',
      'Geç kalmış ama doğru bir savunma düzeni: savunma 5.',
      B40,
    ),
    cmd(
      'gort', 'Lord Gort', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [3, 5, 5, 4], ['temkinli'], '1940-05-10',
      'İngiliz Sefer Kuvveti Komutanı. Kuşatmayı görüp Fransız karşı ' +
      'taarruz planını bırakarak Dunkerque\'e çekilme kararı verdi.',
      'O karar 338.000 askerin tahliyesini mümkün kıldı: planlama 5.',
      B40,
    ),
  ],

  events: [
    {
      id: 'b40_10mayis',
      date: '1940-05-10',
      title: '10 MAYIS — Batı Taarruzu',
      body:
        'Almanya Hollanda, Belçika ve Lüksemburg\'a girdi. Müttefikler ' +
        'bunu 1914\'ün tekrarı sanıp en iyi birliklerini Belçika\'ya ' +
        'sürdü — tam da planın istediği buydu.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_sedan',
      date: '1940-05-13',
      title: 'Sedan — Meuse Geçildi',
      body:
        'Asıl darbe Ardennes\'ten geldi. Guderian\'ın panzerleri Sedan\'da ' +
        'Meuse nehrini geçti ve Fransız 2. ve 9. Ordularının eklem yerini ' +
        'yardı. Ardennes "zırhlıya geçit vermez" sayıldığı için orada ' +
        'yalnız ikinci sınıf tümenler vardı.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_mans',
      date: '1940-05-20',
      title: 'Manş\'a Ulaşıldı',
      body:
        'Zırhlı kol on günde 400 kilometre ilerleyip Abbeville\'de denize ' +
        'ulaştı. Belçika\'daki bütün müttefik ordular — BEF, Fransız 1. ve ' +
        '7. Ordular, Belçika ordusu — ikmal hatlarından kesildi.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_dunkerque',
      date: '1940-05-26',
      title: 'Dunkerque Tahliyesi',
      body:
        'Dinamo Harekâtı 26 Mayıs - 4 Haziran arasında 338.000 askeri ' +
        'tahliye etti. Ağır silahların tamamı sahilde bırakıldı. ' +
        'Churchill, "tahliyelerle savaş kazanılmaz" dedi.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_paris',
      date: '1940-06-14',
      title: 'Paris Düştü',
      body:
        'Weygand Hattı 5 Haziran\'da yarıldı. Paris açık şehir ilan edildi ' +
        've 14 Haziran\'da işgal edildi.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_ateskes',
      date: '1940-06-22',
      title: 'Compiègne — Aynı Vagon',
      body:
        'Fransa ateşkesi, 1918\'de Alman heyetinin imza attığı aynı ' +
        'vagonda imzaladı. Altı haftada biten sefer, dört yıl süren ' +
        '1914-18 Batı Cephesi\'nin tersiydi.',
      kind: 'siyasi',
      src: B40,
    },
  ],
};
