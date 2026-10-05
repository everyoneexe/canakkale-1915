import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * İtalya Seferi — "Avrupa'nın yumuşak karnı" değil.
 *
 * Churchill yarımadayı kolay bir giriş sanıyordu. Arazi tersini söyledi:
 * enlemesine uzanan dağ sıraları ve nehirler savunan tarafa üst üste
 * hazır hat verdi. Cephe yirmi ay boyunca kilometre kilometre ilerledi.
 */

const IS = 'https://tr.wikipedia.org/wiki/İtalya_Seferi_(II._Dünya_Savaşı)';

const DE = 'Germany';
const IT = 'Italy';
const US = 'United States';
const UK = 'United Kingdom';

export const WW2_ITALYA_PACK: FrontPack = {
  theatre: 'ww2_italya',

  formations: [
    // ── Mihver ──
    { nation: IT, name: '6. İtalyan Ordusu — Sicilya', templateId: 'it_ww2_piyade', at: [14.02, 37.50], src: IS },
    { nation: DE, name: 'Hermann Göring Panzer Tümeni', templateId: 'de_panzer_43', at: [14.50, 37.30], src: IS },
    { nation: DE, name: '15. Panzergrenadier Tümeni', templateId: 'de_panzer_43', at: [13.20, 37.70], src: IS },
    { nation: DE, name: '10. Ordu — Vietinghoff', templateId: 'de_ww2_piyade', at: [14.80, 40.70], arrivesOn: '1943-08-22', src: IS },
    { nation: DE, name: 'Gustav Hattı — Monte Cassino', templateId: 'de_ww2_piyade', at: [13.81, 41.49], arrivesOn: '1943-11-01', src: IS },
    { nation: DE, name: '1. Fallschirmjäger Tümeni', templateId: 'de_alpen_korps', at: [13.81, 41.49], arrivesOn: '1944-01-15', src: IS },
    { nation: DE, name: 'Gotik Hattı', templateId: 'de_ww2_piyade', at: [11.30, 44.10], arrivesOn: '1944-06-20', src: IS },

    // ── Müttefikler ──
    { nation: US, name: '7. Amerikan Ordusu — Patton', templateId: 'us_piyade_tumen', at: [13.20, 37.05], src: IS },
    { nation: UK, name: '8. İngiliz Ordusu — Montgomery', templateId: 'uk_ww2_piyade', at: [15.10, 36.80], src: IS },
    { nation: US, name: '5. Amerikan Ordusu — Clark', templateId: 'us_piyade_tumen', at: [14.95, 40.63], arrivesOn: '1943-09-09', src: IS },
    { nation: US, name: 'Anzio Çıkarma Kuvveti', templateId: 'us_piyade_tumen', at: [12.62, 41.45], arrivesOn: '1944-01-22', src: IS },
    { nation: UK, name: 'Polonya II. Kolordusu', templateId: 'pl_piyade_tumen', at: [13.83, 41.47], arrivesOn: '1944-04-01', src: IS },
    { nation: UK, name: 'Fransız Sefer Kolordusu', templateId: 'fr_piyade_tumen', at: [13.60, 41.40], arrivesOn: '1944-01-01', src: IS },
  ],

  commanders: [
    cmd(
      'kesselring', 'Albert Kesselring', 'Mareşal', 'alman', 'ottoman', 'kara',
      [4, 6, 6, 5], ['inatci_savunma', 'siper_ustasi'], '1943-07-10',
      'Güney Başkomutanı. Araziyi okuyup birbiri ardına savunma hatları ' +
      'kurdu: Volturno, Gustav, Gotik. Her hat Müttefikleri aylarca ' +
      'oyaladı.',
      'Cephenin yirmi ay sürmesinin sebebi: savunma ve planlama 6.',
      IS,
    ),
    cmd(
      'patton', 'George Patton', 'Korgeneral', 'amerikan', 'entente', 'kara',
      [6, 4, 5, 4], ['taarruz_ruhu', 'ilham_veren'], '1943-07-10',
      '7. Amerikan Ordusu Komutanı. Sicilya\'da adanın batısını dolaşıp ' +
      'Messina\'ya Montgomery\'den önce girdi.',
      'Hız ve inisiyatif: taarruz 6.',
      IS, '1943-09-01',
    ),
    cmd(
      'clark', 'Mark Clark', 'Korgeneral', 'amerikan', 'entente', 'kara',
      [4, 4, 3, 4], ['israfci'], '1943-09-09',
      '5. Amerikan Ordusu Komutanı. Salerno ve Anzio çıkarmalarını, ' +
      'Monte Cassino muharebelerini yönetti. Roma\'ya girmek için ' +
      'çekilen Alman ordusunu kesme fırsatını bıraktığı tartışılır.',
      'Roma\'ya girdi ama 10. Ordu kaçtı: planlama 3.',
      IS,
    ),
    cmd(
      'alexander', 'Harold Alexander', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [5, 5, 5, 5], ['lojistikci', 'temkinli'], '1943-07-10',
      '15. Ordular Grubu Komutanı. Amerikan, İngiliz, Polonya, Fransız, ' +
      'Hint ve Yeni Zelanda birliklerinden oluşan çok uluslu orduyu ' +
      'yönetti.',
      'Koalisyon yönetimi: dengeli yüksek puanlar.',
      IS,
    ),
    cmd(
      'anders', 'Władysław Anders', 'Korgeneral', 'polonyali', 'entente', 'kara',
      [5, 5, 4, 3], ['taarruz_ruhu', 'ilham_veren'], '1944-04-01',
      'Polonya II. Kolordusu Komutanı. 18 Mayıs 1944\'te Monte Cassino ' +
      'manastırını alan birlik onunkiydi.',
      'Dört taarruzda alınamayan tepeyi aldı: taarruz 5.',
      IS,
    ),
  ],

  events: [
    {
      id: 'wi_husky',
      date: '1943-07-10',
      title: 'Sicilya Çıkarması',
      body:
        'Husky Harekâtı: Normandiya\'ya kadar Müttefiklerin en büyük ' +
        'amfibi harekâtı. Ada 38 günde alındı ama Mihver kuvvetlerinin ' +
        'büyük kısmı Messina Boğazı\'ndan anakaraya geçmeyi başardı.',
      kind: 'kara',
      src: IS,
    },
    {
      id: 'wi_mussolini',
      date: '1943-07-25',
      title: 'Mussolini Devrildi',
      body:
        'Sicilya\'nın kaybı rejimi düşürdü. Badoglio hükümeti gizlice ' +
        'Müttefiklerle görüştü; Almanya karşılık olarak İtalya\'ya tümen ' +
        'akıtmaya başladı.',
      kind: 'siyasi',
      src: IS,
    },
    {
      id: 'wi_salerno',
      date: '1943-09-09',
      title: 'Salerno — Anakaraya Çıkış',
      body:
        'İtalya\'nın teslim olduğu ilan edildiği gün 5. Ordu Salerno\'ya ' +
        'çıktı. Alman karşı taarruzu köprübaşını denize dökmeye yaklaştı; ' +
        'donanma ateşi ve hava desteği çıkarmayı kurtardı.',
      kind: 'kara',
      src: IS,
    },
    {
      id: 'wi_gustav',
      date: '1943-11-01',
      title: 'Gustav Hattı',
      body:
        'Kesselring yarımadanın en dar yerinde, dağlara ve nehirlere ' +
        'dayanan Gustav Hattı\'nı kurdu. Monte Cassino manastırının ' +
        'bulunduğu tepe hattın kilidiydi. İlerleme durdu.',
      kind: 'kara',
      src: IS,
    },
    {
      id: 'wi_anzio',
      date: '1944-01-22',
      title: 'Anzio — Kıyıda Kalan Çıkarma',
      body:
        'Gustav Hattı\'nı arkadan dolanmak için Anzio\'ya çıkarma yapıldı. ' +
        'Köprübaşı genişletilmeyince Almanlar çevreyi kuşattı; çıkarma ' +
        'kuvveti dört ay sahilde kaldı.',
      kind: 'kara',
      src: IS,
    },
    {
      id: 'wi_cassino',
      date: '1944-05-18',
      title: 'Monte Cassino Alındı',
      body:
        'Dört ayrı taarruzdan sonra Polonya II. Kolordusu manastır ' +
        'tepesini aldı. Gustav Hattı yarıldı ve Roma yolu açıldı.',
      kind: 'kara',
      src: IS,
    },
    {
      id: 'wi_roma',
      date: '1944-06-04',
      title: 'Roma Düştü',
      body:
        'Clark Roma\'ya girdi — Normandiya çıkarmasından iki gün önce. ' +
        'Çekilen Alman 10. Ordusunu kesme fırsatının kaçırıldığı hâlâ ' +
        'tartışılır; o ordu Gotik Hattı\'nda yeniden kuruldu.',
      kind: 'kara',
      src: IS,
    },
    {
      id: 'wi_teslim',
      date: '1945-05-02',
      title: 'İtalya\'da Teslim',
      body:
        'Gotik Hattı Nisan 1945\'te yarıldı. İtalya\'daki Alman kuvvetleri ' +
        '2 Mayıs\'ta teslim oldu — Avrupa\'daki genel teslimden altı gün ' +
        'önce.',
      kind: 'siyasi',
      src: IS,
    },
  ],
};
