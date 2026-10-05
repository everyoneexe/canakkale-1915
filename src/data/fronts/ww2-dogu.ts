import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Doğu Cephesi 1941-1945 — Barbarossa'dan Berlin'e.
 *
 * Savaşın en büyük kara cephesi. Teşkilât **22 Haziran 1941** tertibidir:
 * üç Alman ordu grubu ve karşılarındaki Sovyet cepheleri.
 */

const DC = 'https://tr.wikipedia.org/wiki/Doğu_Cephesi_(II._Dünya_Savaşı)';
const BAR = 'https://tr.wikipedia.org/wiki/Barbarossa_Harekâtı';

const DE = 'Germany';
const SU = 'USSR';
const RO = 'Romania';
const FI = 'Finland';

export const WW2_DOGU_PACK: FrontPack = {
  theatre: 'ww2_dogu',

  formations: [
    // ── Alman ordu grupları, 22 Haziran 1941 ──
    { nation: DE, name: 'Kuzey Ordular Grubu — Leeb', templateId: 'de_ww2_piyade', at: [22.30, 55.70], src: BAR },
    { nation: DE, name: '4. Panzer Grubu — Hoepner', templateId: 'de_panzer', at: [22.80, 55.50], src: BAR },
    { nation: DE, name: 'Merkez Ordular Grubu — Bock', templateId: 'de_ww2_piyade', at: [22.00, 52.60], src: BAR },
    { nation: DE, name: '2. Panzer Grubu — Guderian', templateId: 'de_panzer', at: [23.65, 52.10], src: BAR },
    { nation: DE, name: '3. Panzer Grubu — Hoth', templateId: 'de_panzer', at: [22.50, 53.40], src: BAR },
    { nation: DE, name: 'Güney Ordular Grubu — Rundstedt', templateId: 'de_ww2_piyade', at: [23.50, 50.60], src: BAR },
    { nation: DE, name: '1. Panzer Grubu — Kleist', templateId: 'de_panzer', at: [24.00, 50.40], src: BAR },
    // Müttefikler.
    { nation: RO, name: 'Romen 3. ve 4. Orduları', templateId: 'it_ww2_piyade', at: [27.50, 47.20], src: BAR },
    { nation: FI, name: 'Fin Karelya Ordusu', templateId: 'pl_piyade_tumen', at: [30.00, 61.50], arrivesOn: '1941-06-25', src: BAR },
    // Stalingrad'a giden ordu.
    { nation: DE, name: '6. Ordu — Paulus', templateId: 'de_ww2_piyade', at: [40.00, 48.70], arrivesOn: '1942-06-28', src: DC },

    // ── Sovyet cepheleri ──
    { nation: SU, name: 'Kuzeybatı Cephesi', templateId: 'su_tufek_tumen', at: [25.30, 56.95], src: BAR },
    { nation: SU, name: 'Batı Cephesi', templateId: 'su_tufek_tumen', at: [27.57, 53.90], src: BAR },
    { nation: SU, name: 'Güneybatı Cephesi', templateId: 'su_tufek_tumen', at: [26.00, 50.60], src: BAR },
    { nation: SU, name: 'Güney Cephesi', templateId: 'su_tufek_tumen', at: [28.80, 47.00], src: BAR },
    { nation: SU, name: 'Brest Kalesi Garnizonu', templateId: 'su_tufek_tumen', at: [23.66, 52.08], src: BAR },
    { nation: SU, name: 'Leningrad Savunması', templateId: 'su_tufek_tumen', at: [30.31, 59.94], arrivesOn: '1941-08-20', src: DC },
    { nation: SU, name: 'Moskova İhtiyat Cephesi', templateId: 'su_tufek_tumen', at: [37.62, 55.75], arrivesOn: '1941-10-10', src: DC },
    { nation: SU, name: 'Sibirya Tümenleri', templateId: 'su_tufek_tumen', at: [37.00, 56.20], arrivesOn: '1941-11-20', src: DC },
    { nation: SU, name: '62. Ordu — Stalingrad', templateId: 'su_tufek_tumen', at: [44.52, 48.71], arrivesOn: '1942-09-01', src: DC },
    { nation: SU, name: '5. Muhafız Tank Ordusu', templateId: 'su_tank_kolordu', at: [36.23, 51.73], arrivesOn: '1943-07-05', src: DC },
  ],

  commanders: [
    cmd(
      'zhukov', 'Georgi Jukov', 'Mareşal', 'sovyet', 'entente', 'kara',
      [6, 6, 6, 5], ['inatci_savunma', 'taarruz_ruhu', 'ilham_veren'], '1941-06-22',
      'Genelkurmay Başkanı, sonra cephe komutanı. Moskova savunmasını ve ' +
      'karşı taarruzunu, Stalingrad kuşatmasını (Uranüs) ve Berlin ' +
      'harekâtını yönetti.',
      'Savaşın her dönüm noktasında cephedeydi: savunma, taarruz ve ' +
      'planlama 6.',
      DC,
    ),
    cmd(
      'bock_1941', 'Fedor von Bock', 'Mareşal', 'alman', 'ottoman', 'kara',
      [6, 4, 5, 3], ['taarruz_ruhu'], '1941-06-22',
      'Merkez Ordular Grubu Komutanı. Minsk ve Smolensk kuşatmalarıyla ' +
      'yüz binlerce esir aldı; Moskova önünde durduruldu.',
      'Taarruz 6 ama ikmal hattı 1.000 kilometreye uzadı: lojistik 3.',
      BAR,
    ),
    cmd(
      'guderian_1941', 'Heinz Guderian', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 3, 5, 3], ['taarruz_ruhu', 'israfci'], '1941-06-22',
      '2. Panzer Grubu Komutanı. Eylül 1941\'de Kiev kuşatmasını kapattı — ' +
      'tarihin en büyük kuşatması, yaklaşık 600.000 esir.',
      'Moskova yerine Kiev\'e yönelmek taktik zafer, stratejik gecikmeydi.',
      BAR,
    ),
    cmd(
      'paulus', 'Friedrich Paulus', 'Mareşal', 'alman', 'ottoman', 'kara',
      [4, 4, 3, 2], ['agir_kanli'], '1942-06-28',
      '6. Ordu Komutanı. Stalingrad\'da kuşatıldı; çıkma izni verilmedi. ' +
      '31 Ocak 1943\'te teslim oldu — mareşalliğe terfisinden bir gün sonra.',
      'Emir beklerken kuşatma kapandı: planlama 3, lojistik 2.',
      DC, '1943-02-02',
    ),
    cmd(
      'chuikov', 'Vasili Çuykov', 'Korgeneral', 'sovyet', 'entente', 'kara',
      [4, 6, 5, 3], ['inatci_savunma', 'siper_ustasi'], '1942-09-12',
      '62. Ordu Komutanı. Stalingrad\'da şehir savaşını "düşmana sarıl" ' +
      'taktiğiyle yönetti: hatlar Alman hava ve topçu desteğini etkisiz ' +
      'kılacak kadar yakın tutuldu.',
      'Şehir savunmasının ders kitabı: savunma 6.',
      DC,
    ),
    cmd(
      'manstein_dogu', 'Erich von Manstein', 'Mareşal', 'alman', 'ottoman', 'kara',
      [5, 6, 6, 4], ['inatci_savunma', 'temkinli'], '1942-11-21',
      'Don Ordular Grubu Komutanı. Stalingrad\'dan sonra Şubat-Mart 1943\'te ' +
      'Harkov\'da karşı taarruzla cepheyi yeniden kurdu.',
      'Çöken cepheyi hareketli savunmayla toparladı: savunma ve ' +
      'planlama 6.',
      DC,
    ),
  ],

  events: [
    {
      id: 'wd_barbarossa',
      date: '1941-06-22',
      title: '22 HAZİRAN — Barbarossa',
      body:
        'Tarihin en büyük kara harekâtı başladı. Üç ordu grubu Leningrad, ' +
        'Moskova ve Kiev istikametlerinde ilerledi. Sovyet hava kuvvetleri ' +
        'ilk gün yerde büyük kayıp verdi; sınır boyundaki ordular ' +
        'kuşatmalarla eridi.',
      kind: 'kara',
      src: BAR,
    },
    {
      id: 'wd_kiev',
      date: '1941-09-26',
      title: 'Kiev Kuşatması',
      body:
        'Guderian\'ın panzer grubu güneye dönerek Kiev çevresindeki ' +
        'kuşatmayı kapattı — tarihin en büyük kuşatması, yaklaşık 600.000 ' +
        'esir. Taktik olarak eşsiz bir zaferdi; ama Moskova taarruzunu ' +
        'kışa bıraktı.',
      kind: 'kara',
      src: BAR,
    },
    {
      id: 'wd_moskova',
      date: '1941-12-05',
      title: 'Moskova Önünde Karşı Taarruz',
      body:
        'Alman ilerleyişi şehrin 30 kilometre yakınında, çamur ve kışta ' +
        'durdu. Jukov, Japonya\'nın saldırmayacağı anlaşılınca Uzak Doğu\'dan ' +
        'getirilen Sibirya tümenleriyle karşı taarruza geçti. Blitzkrieg\'in ' +
        'ilk stratejik yenilgisiydi.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_stalingrad',
      date: '1942-11-19',
      title: 'Uranüs — Stalingrad Kuşatıldı',
      body:
        'Sovyet karşı taarruzu, 6. Ordunun kanatlarını tutan Romen ' +
        'ordularını yardı ve dört günde kuşatmayı kapattı. Paulus\'a çıkma ' +
        'izni verilmedi; hava ikmali vaat edilen tonajın çok altında kaldı.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_paulus_teslim',
      date: '1943-02-02',
      title: 'Stalingrad Düştü',
      body:
        'Paulus 31 Ocak\'ta teslim oldu, son direniş 2 Şubat\'ta bitti. ' +
        'Savaşın psikolojik dönüm noktası: Doğu Cephesi\'nde inisiyatif ' +
        'bir daha Almanya\'ya geçmedi.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_kursk',
      date: '1943-07-05',
      title: 'Kursk — Son Alman Taarruzu',
      body:
        'Almanlar Kursk çıkıntısını kesmeye çalıştı. Sovyetler taarruzu ' +
        'önceden biliyor ve derinlemesine tahkim etmişti. Tarihin en büyük ' +
        'zırhlı muharebelerinden biri; Almanya Doğu\'da bir daha stratejik ' +
        'taarruz yapamadı.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_bagration',
      date: '1944-06-22',
      title: 'Bagration — Merkez Grubu Yok Oldu',
      body:
        'Barbarossa\'nın üçüncü yıldönümünde başlayan Sovyet taarruzu ' +
        'Merkez Ordular Grubunu imha etti. Cephe birkaç haftada Polonya\'ya ' +
        'taşındı.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_berlin',
      date: '1945-04-16',
      title: 'Berlin Harekâtı',
      body:
        'Jukov ve Konev\'in cepheleri Oder\'den Berlin\'e yürüdü. Şehir ' +
        '2 Mayıs\'ta düştü; Almanya 8 Mayıs\'ta teslim oldu.',
      kind: 'kara',
      src: DC,
    },
  ],
};
