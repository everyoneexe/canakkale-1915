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
    { nation: DE, name: '14. Ordu — von Mackensen, Anzio Çemberi', templateId: 'de_ww2_piyade', at: [12.70, 41.60], arrivesOn: '1944-02-01', src: IS },
    { nation: IT, name: 'Salò Ulusal Cumhuriyetçi Ordusu — Graziani', templateId: 'it_ww2_piyade', at: [10.45, 45.60], arrivesOn: '1944-01-01', src: IS },
    { nation: 'Brazil', name: 'Brezilya Sefer Kuvveti (FEB)', templateId: 'us_piyade_tumen', at: [10.90, 44.20], arrivesOn: '1944-09-16', src: IS },
    { nation: US, name: 'ABD IV. Kolordusu — Apenninler', templateId: 'us_zirhli_tumen', at: [11.00, 44.30], arrivesOn: '1944-09-01', src: IS },
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
    cmd(
      'it_vietinghoff', 'Heinrich von Vietinghoff', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [4, 6, 5, 4], ['inatci_savunma', 'temkinli'], '1943-08-22',
      '10. Ordu Komutanı. Salerno\'da köprübaşını neredeyse denize döktü, ' +
      'Gustav Hattı\'nı yönetti ve Roma düşerken ordusunu kuzeye sağlam ' +
      'çıkardı. 1945\'te Kesselring\'in yerine Güney Başkomutanı oldu ve ' +
      'Caserta teslimini imzalattı.',
      'Hat savunması ve çekilme yönetimi: savunma 6, taarruz sıradan.',
      IS,
    ),
    cmd(
      'it_senger', 'Frido von Senger und Etterlin', 'Korgeneral', 'alman', 'ottoman', 'kara',
      [4, 6, 6, 4], ['inatci_savunma', 'siper_ustasi'], '1943-10-08',
      'XIV. Panzer Kolordusu Komutanı; Cassino kesimini savundu. ' +
      'Manastırı askerî amaçla kullanmayı reddetti — bombalandıktan sonra ' +
      'enkaza yerleşmek serbest kaldı ve savunma kolaylaştı.',
      'Dar arazide dört taarruzu kıran mevzi düzeni: savunma ve planlama 6.',
      IS,
    ),
    cmd(
      'it_student', 'Kurt Student', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [5, 5, 5, 3], ['atilgan_amiral', 'taarruz_ruhu'], '1943-09-08',
      'Alman paraşüt kuvvetlerinin kurucusu. Achse Harekâtı\'nda Roma ' +
      'çevresindeki İtalyan birliklerinin silahsızlandırılmasını ve Gran ' +
      'Sasso baskınıyla Mussolini\'nin kaçırılmasını planladı.',
      'Baskın ve hava indirme uzmanı, uzun süreli idame zayıf: lojistik 3.',
      IS, '1943-11-15',
    ),
    cmd(
      'it_badoglio', 'Pietro Badoglio', 'Mareşal', 'italyan', 'entente', 'siyasi',
      [2, 3, 3, 3], ['temkinli'], '1943-07-25',
      'Mussolini devrildikten sonra hükümeti kurdu. Bir yandan Almanya\'ya ' +
      'sadakat sözü verip bir yandan Cassibile\'de ateşkes imzaladı; ' +
      'ordusuna ne yapacağını söylemeden Roma\'dan kaçtı.',
      'Siyaseten manevra etti ama ordusunu komutasız bıraktı: hepsi düşük.',
      IS,
    ),
    cmd(
      'it_mussolini', 'Benito Mussolini', 'Duçe', 'italyan', 'ottoman', 'siyasi',
      [3, 2, 2, 2], ['israfci'], '1943-07-10',
      'Faşist diktatör. Sicilya\'nın kaybı üzerine 25 Temmuz\'da Büyük ' +
      'Faşist Konsey tarafından düşürüldü; Gran Sasso\'dan kaçırıldıktan ' +
      'sonra kuzeyde Alman himayesindeki Salò Cumhuriyeti\'nin başına geçti.',
      'Kuklaya dönüşmüş siyasi önder; askerî değeri yok.',
      IS, '1945-04-28',
    ),
    cmd(
      'it_graziani', 'Rodolfo Graziani', 'Mareşal', 'italyan', 'ottoman', 'kara',
      [3, 3, 2, 2], ['agir_kanli', 'israfci'], '1943-09-23',
      'Salò Cumhuriyeti Savunma Bakanı. Toplanan tümenlerin çoğu firar ve ' +
      'partizan baskısıyla eridi; birlikler cepheden çok iç güvenlikte ' +
      'kullanıldı.',
      'Güvenilmez, moralsiz bir orduyu yönetti: tüm puanlar düşük.',
      IS,
    ),
    cmd(
      'it_montgomery', 'Bernard Montgomery', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [5, 6, 6, 6], ['temkinli', 'lojistikci'], '1943-07-10',
      '8. Ordu Komutanı. Sicilya\'da doğu kıyısından Etna eteklerine ' +
      'tırmandı, sonra Calabria\'ya geçti. Aralık 1943\'te Overlord için ' +
      'İngiltere\'ye çağrıldı.',
      'Hazırlık ve ikmalde titiz, dağda yavaş: lojistik 6, taarruz 5.',
      IS, '1943-12-31',
    ),
    cmd(
      'it_truscott', 'Lucian Truscott', 'Korgeneral', 'amerikan', 'entente', 'kara',
      [6, 5, 5, 5], ['taarruz_ruhu', 'atilgan_amiral'], '1944-02-22',
      'Anzio\'da VI. Kolordu Komutanı. Çemberden çıkışta kuvveti ' +
      'Valmontone\'ye sürüp Alman 10. Ordusunu kesmek istedi; Clark\'ın ' +
      'emriyle yön Roma\'ya çevrildi.',
      'Sahada en keskin Amerikan kolordu komutanı: taarruz 6.',
      IS,
    ),
    cmd(
      'it_juin', 'Alphonse Juin', 'Orgeneral', 'fransiz', 'entente', 'kara',
      [6, 5, 6, 4], ['taarruz_ruhu', 'agir_kanli'], '1943-11-25',
      'Fransız Sefer Kolordusu Komutanı. Mayıs 1944\'te Garigliano\'nun ' +
      'güneyinde geçilmez sayılan Aurunci dağlarını Faslı dağ birlikleriyle ' +
      'aştı ve Gustav Hattı\'nın yan kilidini açtı.',
      'Araziyi engel değil imkân gören tek komutan: taarruz ve planlama 6.',
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
      id: 'wi_messina',
      date: '1943-08-17',
      title: 'Messina Tahliyesi — Kaçırılan Fırsat',
      body:
        'Lehrbuch Harekâtı ile Mihver, boğazın iki yakasına yığdığı uçaksavar ' +
        'bataryalarının koruması altında 100.000\'in üzerinde asker, on ' +
        'binlerce araç ve topunu anakaraya geçirdi. Müttefik donanma ve ' +
        'hava kuvvetleri geçişi kesmek için ciddi bir girişimde bulunmadı: ' +
        'ada alındı ama onu savunan ordu kurtuldu ve aynı ordu bir ay sonra ' +
        'Salerno\'da karşılarına çıktı.',
      kind: 'deniz',
      src: IS,
    },
    {
      id: 'wi_cassibile_achse',
      date: '1943-09-08',
      title: 'Cassibile Ateşkesi ve Achse Harekâtı',
      body:
        'İtalya\'nın 3 Eylül\'de gizlice imzaladığı ateşkes 8 Eylül akşamı ' +
        'ilan edildi. Almanlar aynı gece hazır bekledikleri Achse planını ' +
        'uyguladı: İtalyan birlikleri emir alamadan silahsızlandırıldı, ' +
        'yarımadanın kuzeyi ve ortası bir gecede Alman işgaline girdi. ' +
        'Müttefikler bir ortak kazanacaklarını sanırken karşılarına ' +
        'baştan sona Alman savunması çıktı.',
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
      id: 'wi_napoli',
      date: '1943-10-01',
      title: 'Napoli\'nin Dört Günü',
      body:
        '27-30 Eylül\'de Napolililer Müttefikler gelmeden Alman garnizonuna ' +
        'karşı ayaklandı; şehir 1 Ekim\'de 5. Ordu\'ya açık teslim edildi. ' +
        'Almanlar çekilirken limanı sistemli biçimde yıktı ve gecikmeli ' +
        'mayınlar bıraktı — liman kapasitesi haftalarca sınırlı kaldı, ' +
        'bu da yarımadadaki ilerleyişin hızını ikmalin belirlediğini ' +
        'gösterdi.',
      kind: 'ikmal',
      src: IS,
    },
    {
      id: 'wi_cografya',
      date: '1943-10-12',
      title: 'Volturno — "Yumuşak Karın" Masalı Bitti',
      body:
        'Volturno geçişi Müttefiklere asıl dersi verdi: İtalya\'nın ' +
        'coğrafyası savunana çalışır. Apenninler yarımadayı boydan boya ' +
        'ikiye böler, dağ sıraları ve nehirler enlemesine uzanıp arka ' +
        'arkaya hazır savunma hattı sunar. Oyunda bu arazi hareket ' +
        'maliyetiyle ve cephe genişliğiyle karşılanır: dağda cephe ' +
        'genişliği 18, ovada 44 — dar cephede sayı üstünlüğü işe yaramaz, ' +
        'fazla tümeni muharebeye sokamazsın. Churchill\'in benzetmesi ' +
        'yanıldı; sefer yirmi ay sürdü.',
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
      id: 'wi_manastir',
      date: '1944-02-15',
      title: 'Monte Cassino Manastırının Bombalanması',
      body:
        'Yüzlerce ağır bombardıman uçağı 1.400 yıllık manastırı yıktı. ' +
        'Alman birlikleri binayı kullanmıyordu — bombardımandan sonra ' +
        'enkaza yerleşmekte serbest kaldılar ve moloz yığını betondan ' +
        'daha iyi bir mevzi oldu. Yıkım ne hattı açtı ne de taarruzu ' +
        'kolaylaştırdı; manastır üç ay daha tutuldu.',
      kind: 'hava',
      src: IS,
    },
    {
      id: 'wi_diadem',
      date: '1944-05-11',
      title: 'Diadem Harekâtı',
      body:
        'Alexander kuvvetlerini gizlice batıya kaydırıp Gustav Hattı\'na ' +
        'dar bir cephede toplu darbe vurdu. Belirleyici hamle Juin\'in ' +
        'Fransız Sefer Kolordusu\'ndan geldi: Faslı dağ birlikleri ' +
        'Almanların geçilmez saydığı Aurunci dağlarını aşıp hattı yandan ' +
        'çökertti. Ders basit — dağ bir duvar değil, sadece yolu olmayan ' +
        'bir geçit.',
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
      id: 'wi_gotik',
      date: '1944-08-25',
      title: 'Gotik Hattı — Olive Harekâtı',
      body:
        'Kesselring Apenninlerin kuzey eteklerinde yeni bir hat kurdu. ' +
        'Müttefikler Adriyatik kıyısından yüklendi, Rimini\'yi aldı ama ' +
        'sonbahar yağmurları Po ovasına inen vadileri çamura çevirdi ve ' +
        'harekât durdu. Fransa\'ya yedi tümen ayrıldığı için İtalya cephesi ' +
        'kış boyunca ikincil cephe olarak bekledi.',
      kind: 'kara',
      src: IS,
    },
    {
      id: 'wi_grapeshot',
      date: '1945-04-09',
      title: 'Nisan Taarruzu — Po Ovasına Çıkış',
      body:
        'Grapeshot Harekâtı başladı: 8. Ordu Argenta boğazından, 5. Ordu ' +
        'Bologna\'nın batısından yüklendi. Hat kırılınca dar vadi ' +
        'savunmasının anlamı kalmadı; Po ovasında cephe birden genişledi ' +
        've Müttefik zırhı üç haftada yarımadanın kuzeyini kat etti. ' +
        'Aynı ordu, aynı arazi değil — fark buydu.',
      kind: 'kara',
      src: IS,
    },
    {
      id: 'wi_caserta',
      date: '1945-04-29',
      title: 'Caserta Teslim Belgesi',
      body:
        'Vietinghoff\'un temsilcileri Caserta\'da kayıtsız şartsız teslimi ' +
        'imzaladı; Mussolini bir gün önce partizanlarca yakalanıp ' +
        'kurşuna dizilmişti. Belge 2 Mayıs\'ta yürürlüğe girdi — Avrupa\'da ' +
        'imzalanan ilk büyük Alman teslimi.',
      kind: 'siyasi',
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
