import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Pasifik Savaşı — Pearl Harbor'dan teslime.
 *
 * Bu cephenin mekaniği deniz ve havadır; oyunun kara muharebesi motoru
 * ada çıkarmalarını yalnız kabaca temsil eder. İçerik bu yüzden
 * olaylara ve komutanlara ağırlık verir.
 */

const PS = 'https://tr.wikipedia.org/wiki/Pasifik_Cephesi';

const JP = 'Empire of Japan';
const US = 'United States';
const UK = 'United Kingdom';
const AU = 'Australia';

export const PASIFIK_PACK: FrontPack = {
  theatre: 'ww2_pasifik',

  formations: [
    // ── Japonya ──
    { nation: JP, name: '14. Ordu — Filipinler', templateId: 'jp_piyade_tumen', at: [120.98, 14.60], arrivesOn: '1941-12-08', src: PS },
    { nation: JP, name: '25. Ordu — Malaya', templateId: 'jp_piyade_tumen', at: [102.25, 6.12], arrivesOn: '1941-12-08', src: PS },
    { nation: JP, name: '15. Ordu — Burma', templateId: 'jp_piyade_tumen', at: [98.50, 16.90], arrivesOn: '1942-01-20', src: PS },
    { nation: JP, name: '17. Ordu — Solomonlar', templateId: 'jp_piyade_tumen', at: [160.00, -9.43], arrivesOn: '1942-08-07', src: PS },
    { nation: JP, name: 'Rabaul Üssü', templateId: 'jp_piyade_tumen', at: [152.17, -4.20], arrivesOn: '1942-01-23', src: PS },
    { nation: JP, name: 'Iwo Jima Garnizonu', templateId: 'jp_piyade_tumen', at: [141.33, 24.78], arrivesOn: '1944-06-01', src: PS },
    { nation: JP, name: '32. Ordu — Okinawa', templateId: 'jp_piyade_tumen', at: [127.80, 26.33], arrivesOn: '1944-03-22', src: PS },

    // ── Müttefikler ──
    { nation: US, name: 'Pasifik Filosu — Pearl Harbor', templateId: 'us_piyade_tumen', at: [-157.95, 21.35], src: PS },
    { nation: US, name: 'Filipinler Ordusu — MacArthur', templateId: 'us_piyade_tumen', at: [120.60, 14.70], src: PS },
    { nation: US, name: '1. Deniz Piyade Tümeni', templateId: 'us_deniz_piyade', at: [160.08, -9.44], arrivesOn: '1942-08-07', src: PS },
    { nation: US, name: '2. Deniz Piyade Tümeni', templateId: 'us_deniz_piyade', at: [172.98, 1.33], arrivesOn: '1943-11-20', src: PS },
    { nation: US, name: 'VI. Amerikan Kolordusu — Leyte', templateId: 'us_piyade_tumen', at: [124.99, 10.80], arrivesOn: '1944-10-20', src: PS },
    { nation: US, name: '10. Ordu — Okinawa', templateId: 'us_piyade_tumen', at: [127.75, 26.20], arrivesOn: '1945-04-01', src: PS },
    { nation: UK, name: 'Malaya Komutanlığı', templateId: 'uk_ww2_piyade', at: [103.82, 1.35], src: PS },
    { nation: UK, name: '14. Ordu — Burma', templateId: 'uk_ww2_piyade', at: [94.00, 24.80], arrivesOn: '1943-10-01', src: PS },
    { nation: AU, name: 'Avustralya 7. Tümeni', templateId: 'uk_ww2_piyade', at: [147.20, -9.44], arrivesOn: '1942-08-26', src: PS },
  ],

  commanders: [
    cmd(
      'yamamoto', 'Isoroku Yamamoto', 'Oramiral', 'japon', 'ottoman', 'deniz',
      [6, 4, 6, 4], ['atilgan_amiral', 'taarruz_ruhu'], '1941-12-07',
      'Birleşik Filo Komutanı. Pearl Harbor baskınını planladı. Savaşın ' +
      'uzun sürerse kaybedileceğini baştan söylemişti. Nisan 1943\'te ' +
      'uçağı düşürülerek öldürüldü.',
      'Baskın mükemmel, strateji umutsuzdu: taarruz ve planlama 6.',
      PS, '1943-04-18',
    ),
    cmd(
      'nimitz', 'Chester Nimitz', 'Oramiral', 'amerikan', 'entente', 'deniz',
      [5, 5, 6, 6], ['lojistikci', 'temkinli'], '1941-12-31',
      'Pasifik Filosu Başkomutanı. Midway\'de istihbaratı kullanıp ' +
      'sayıca üstün filoya pusu kurdu; ada atlama stratejisini yönetti.',
      'Okyanus ölçeğinde ikmal ve istihbarat: lojistik ve planlama 6.',
      PS,
    ),
    cmd(
      'macarthur', 'Douglas MacArthur', 'Orgeneral', 'amerikan', 'entente', 'kara',
      [5, 4, 5, 4], ['taarruz_ruhu', 'ilham_veren'], '1941-12-08',
      'Güneybatı Pasifik Komutanı. Filipinler\'i kaybetti, "Döneceğim" ' +
      'dedi ve Ekim 1944\'te Leyte\'ye çıktı.',
      'Güçlü garnizonları atlayıp ikmalini kesme yaklaşımı: planlama 5.',
      PS,
    ),
    cmd(
      'yamashita', 'Tomoyuki Yamashita', 'Orgeneral', 'japon', 'ottoman', 'kara',
      [6, 5, 6, 3], ['taarruz_ruhu'], '1941-12-08',
      '25. Ordu Komutanı. Malaya\'yı 70 günde geçip 15 Şubat 1942\'de ' +
      'Singapur\'u aldı — kendisinden kalabalık bir garnizonu teslim ' +
      'almıştı.',
      '"Malaya Kaplanı": taarruz ve planlama 6, lojistik 3.',
      PS,
    ),
    cmd(
      'halsey', 'William Halsey', 'Oramiral', 'amerikan', 'entente', 'deniz',
      [6, 4, 4, 4], ['atilgan_amiral', 'israfci'], '1942-10-18',
      'Güney Pasifik Komutanı, sonra 3. Filo. Guadalcanal\'da inisiyatifi ' +
      'aldı; Leyte\'de Japon yem filosunun peşine düşüp çıkarma sahasını ' +
      'açıkta bıraktı.',
      'Saldırganlık hem kazandırdı hem riske attı: taarruz 6.',
      PS,
    ),
  ],

  events: [
    {
      id: 'ps_pearl',
      date: '1941-12-07',
      title: '7 ARALIK — Pearl Harbor',
      body:
        'Japon uçak gemisi kuvveti Pearl Harbor\'a baskın yaptı. Sekiz ' +
        'muharebe gemisi vuruldu — ama uçak gemileri denizdeydi ve yakıt ' +
        'depoları ile tersane tesisleri hedef alınmadı. İkisi de savaşın ' +
        'geri kalanını belirledi.',
      kind: 'deniz',
      src: PS,
    },
    {
      id: 'ps_singapur',
      date: '1942-02-15',
      title: 'Singapur Düştü',
      body:
        'Yamashita\'nın 25. Ordusu Malaya yarımadasını 70 günde geçti ve ' +
        'kendisinden kalabalık garnizonu teslim aldı. Britanya askerî ' +
        'tarihinin en büyük teslimiydi.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_midway',
      date: '1942-06-04',
      title: 'Midway — Dönüm Noktası',
      body:
        'Amerikan kriptanalizi Japon harekât planını çözmüştü. Nimitz ' +
        'sayıca üstün filoya pusu kurdu; Japonya dört uçak gemisini ve ' +
        'eğitimli pilot kadrosunun önemli kısmını kaybetti. Pasifik\'te ' +
        'inisiyatif el değiştirdi.',
      kind: 'deniz',
      src: PS,
    },
    {
      id: 'ps_guadalcanal',
      date: '1942-08-07',
      title: 'Guadalcanal — İlk Karşı Taarruz',
      body:
        '1. Deniz Piyade Tümeni adaya çıktı. Altı ay süren kara, deniz ve ' +
        'hava muharebeleri Japonya\'nın yerine koyamayacağı uçak gemisi, ' +
        'uçak ve pilot kaybına yol açtı.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_leyte',
      date: '1944-10-23',
      title: 'Leyte Körfezi',
      body:
        'Tarihin en büyük deniz muharebesi. Japon donanması bir daha ' +
        'toparlanamayacak biçimde kırıldı; burada kamikaze saldırıları ' +
        'ilk kez örgütlü biçimde kullanıldı.',
      kind: 'deniz',
      src: PS,
    },
    {
      id: 'ps_iwojima',
      date: '1945-02-19',
      title: 'Iwo Jima',
      body:
        'Japon garnizonu sahilde savunmak yerine adanın içine tünel ağı ' +
        'kazmıştı. Beş günde alınması planlanan ada beş hafta sürdü.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_okinawa',
      date: '1945-04-01',
      title: 'Okinawa',
      body:
        'Pasifik\'in en kanlı çıkarması. Kamikaze saldırıları donanmaya ' +
        'ağır kayıp verdirdi. Muharebenin bilançosu, Japon anavatanına ' +
        'yapılacak çıkarmanın maliyeti hesaplanırken belirleyici oldu.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_teslim',
      date: '1945-09-02',
      title: 'Teslim — Tokyo Körfezi',
      body:
        'Hiroşima ve Nagasaki\'nin ardından Japonya teslim belgesini ' +
        'USS Missouri\'de imzaladı. İkinci Dünya Savaşı sona erdi.',
      kind: 'siyasi',
      src: PS,
    },
  ],
};
