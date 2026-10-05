import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Normandiya ve Batı Avrupa — 6 Haziran 1944'ten teslime.
 *
 * Çıkarmanın asıl sorunu sahile çıkmak değil, **ikmali sürdürmekti**.
 * Derin su limanı alınamadığı için iki yapay liman (Mulberry) çekildi;
 * cephe ilerledikçe benzin ikmali harekâtın hızını belirledi.
 */

const NO = 'https://tr.wikipedia.org/wiki/Normandiya_Çıkarması';

const DE = 'Germany';
const US = 'United States';
const UK = 'United Kingdom';
const CA = 'Canada';

export const NORMANDIYA_PACK: FrontPack = {
  theatre: 'ww2_normandiya',

  formations: [
    // ── Alman savunması ──
    { nation: DE, name: 'B Ordular Grubu — Rommel', templateId: 'de_ww2_piyade', at: [1.08, 49.44], src: NO },
    { nation: DE, name: '7. Ordu — Normandiya', templateId: 'de_ww2_piyade', at: [-0.70, 49.10], src: NO },
    { nation: DE, name: '15. Ordu — Pas-de-Calais', templateId: 'de_ww2_piyade', at: [1.85, 50.95], src: NO },
    { nation: DE, name: '21. Panzer Tümeni', templateId: 'de_panzer_43', at: [-0.37, 49.18], src: NO },
    { nation: DE, name: '12. SS Panzer Tümeni', templateId: 'de_panzer_43', at: [-0.10, 49.30], arrivesOn: '1944-06-07', src: NO },
    { nation: DE, name: 'Panzer Lehr Tümeni', templateId: 'de_panzer_43', at: [-0.60, 49.05], arrivesOn: '1944-06-08', src: NO },
    { nation: DE, name: '352. Piyade Tümeni — Omaha', templateId: 'de_ww2_piyade', at: [-0.90, 49.37], src: NO },

    // ── Müttefik çıkarma kuvveti ──
    { nation: US, name: '1. Amerikan Ordusu — Bradley', templateId: 'us_piyade_tumen', at: [-1.10, 49.40], src: NO },
    { nation: US, name: '1. Piyade Tümeni — Omaha', templateId: 'us_piyade_tumen', at: [-0.86, 49.37], src: NO },
    { nation: US, name: '4. Piyade Tümeni — Utah', templateId: 'us_piyade_tumen', at: [-1.17, 49.42], src: NO },
    { nation: US, name: '82. Hava İndirme Tümeni', templateId: 'us_piyade_tumen', at: [-1.31, 49.41], src: NO },
    { nation: US, name: '101. Hava İndirme Tümeni', templateId: 'us_piyade_tumen', at: [-1.24, 49.34], src: NO },
    { nation: UK, name: '2. İngiliz Ordusu — Dempsey', templateId: 'uk_ww2_piyade', at: [-0.30, 49.33], src: NO },
    { nation: UK, name: '6. Hava İndirme Tümeni', templateId: 'uk_ww2_piyade', at: [-0.25, 49.24], src: NO },
    { nation: CA, name: '3. Kanada Tümeni — Juno', templateId: 'uk_ww2_piyade', at: [-0.46, 49.34], src: NO },
    // Kopma ve kuşatma.
    { nation: US, name: '3. Amerikan Ordusu — Patton', templateId: 'us_piyade_tumen', at: [-1.30, 48.80], arrivesOn: '1944-08-01', src: NO },
    { nation: UK, name: '1. Polonya Zırhlı Tümeni', templateId: 'uk_zirhli_tumen', at: [-0.05, 48.88], arrivesOn: '1944-08-08', src: NO },
    { nation: US, name: '2. Zırhlı Tümen — Cobra', templateId: 'us_zirhli_tumen', at: [-1.09, 49.12], arrivesOn: '1944-07-25', src: NO },
    { nation: US, name: '4. Zırhlı Tümen — Patton', templateId: 'us_zirhli_tumen', at: [-1.55, 48.68], arrivesOn: '1944-08-01', src: NO },
    { nation: CA, name: '1. Kanada Ordusu — Schelde', templateId: 'uk_ww2_piyade', at: [3.60, 51.35], arrivesOn: '1944-10-02', src: NO },
    { nation: UK, name: '1. Hava İndirme Tümeni — Arnhem', templateId: 'uk_ww2_piyade', at: [5.90, 51.98], arrivesOn: '1944-09-17', src: NO },
    { nation: DE, name: '1. Paraşüt Ordusu — Student', templateId: 'de_ww2_piyade', at: [5.30, 51.30], arrivesOn: '1944-09-04', src: NO },
    { nation: DE, name: '6. Panzer Ordusu — Dietrich', templateId: 'de_agir_panzer', at: [6.02, 50.30], arrivesOn: '1944-12-16', src: NO },
    { nation: DE, name: '5. Panzer Ordusu — Manteuffel', templateId: 'de_panzer_43', at: [5.72, 50.10], arrivesOn: '1944-12-16', src: NO },
  ],

  commanders: [
    cmd(
      'eisenhower', 'Dwight Eisenhower', 'Orgeneral', 'amerikan', 'entente', 'kara',
      [5, 5, 6, 6], ['lojistikci', 'temkinli'], '1944-06-06',
      'Müttefik Seferi Kuvvetleri Başkomutanı. Hava durumu penceresini ' +
      'değerlendirip çıkarmayı 6 Haziran\'a erteleme kararını tek başına ' +
      'verdi.',
      'Koalisyon ve ikmal yönetimi: planlama ve lojistik 6.',
      NO,
    ),
    cmd(
      'montgomery_norm', 'Bernard Montgomery', 'Mareşal', 'ingiliz', 'entente', 'kara',
      [4, 6, 6, 5], ['temkinli', 'siper_ustasi'], '1944-06-06',
      '21. Ordular Grubu Komutanı. Caen çevresinde Alman zırhlısını ' +
      'kendine çekip batı kanadında Amerikan kopmasına imkân verdi.',
      'Caen planlanandan çok geç alındı ama zırhlı tespit işlevi gördü: ' +
      'savunma ve planlama 6.',
      NO,
    ),
    cmd(
      'rommel_norm', 'Erwin Rommel', 'Mareşal', 'alman', 'ottoman', 'kara',
      [5, 6, 5, 3], ['inatci_savunma', 'siper_ustasi'], '1944-06-06',
      'B Ordular Grubu Komutanı. Zırhlı ihtiyatın sahile yakın tutulmasını ' +
      'savundu — hava üstünlüğü altında uzaktan getirmenin imkânsız ' +
      'olacağını görüyordu. 17 Temmuz\'da uçak saldırısında yaralandı.',
      'Tartışmada haklı çıktı ama dinletemedi: savunma 6.',
      NO, '1944-07-17',
    ),
    cmd(
      'rundstedt_norm', 'Gerd von Rundstedt', 'Mareşal', 'alman', 'ottoman', 'kara',
      [4, 5, 5, 4], ['temkinli'], '1944-06-06',
      'Batı Başkomutanı. Zırhlı ihtiyatın içeride toplanıp asıl çıkarma ' +
      'belli olunca kullanılmasını savundu. İhtiyat Hitler\'in iznine ' +
      'bağlıydı ve 6 Haziran\'da saatlerce serbest bırakılmadı.',
      'Komuta kademesi bölünmüştü: planlama 5.',
      NO, '1944-07-02',
    ),
    cmd(
      'bradley', 'Omar Bradley', 'Orgeneral', 'amerikan', 'entente', 'kara',
      [5, 5, 5, 5], ['lojistikci'], '1944-06-06',
      '1. Amerikan Ordusu Komutanı. Cobra Harekâtı ile Saint-Lô\'da ' +
      'cepheyi yardı ve kopmayı başlattı.',
      'Bocage arazisinde yarma: dengeli yüksek puanlar.',
      NO,
    ),
    cmd(
      'patton_norm', 'George Patton', 'Korgeneral', 'amerikan', 'entente', 'kara',
      [6, 3, 5, 3], ['taarruz_ruhu', 'israfci'], '1944-08-01',
      '3. Amerikan Ordusu Komutanı. Yarmadan sonra Bretanya ve Loire ' +
      'boyunca hızla ilerledi; ordusu benzin bitene kadar durmadı.',
      'Hız altı, ikmal üç — cephenin dersi burada da aynı.',
      NO,
    ),
    cmd(
      'nm_dempsey', 'Miles Dempsey', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [4, 5, 5, 5], ['temkinli'], '1944-06-06',
      '2. İngiliz Ordusu Komutanı. Gold, Juno ve Sword sahillerinden ' +
      'çıkan kuvvetleri yönetti; Caen çevresindeki Epsom, Charnwood ve ' +
      'Goodwood taarruzlarını yürüttü.',
      'Taarruzları hedefe ulaşmadı ama Alman panzer tümenlerini doğu ' +
      'kanadında tuttu: savunma ve planlama 5.',
      NO,
    ),
    cmd(
      'nm_collins', 'J. Lawton Collins', 'Korgeneral', 'amerikan', 'entente', 'kara',
      [6, 4, 5, 4], ['taarruz_ruhu', 'ilham_veren'], '1944-06-06',
      'VII. Kolordu Komutanı. Utah\'tan çıkıp Cotentin Yarımadası\'nı ' +
      'kesti, Cherbourg\'u aldı ve Cobra\'nın yarma kolordusunu yönetti. ' +
      '"Lightning Joe" lakabı tempo tutturmasından geliyordu.',
      'İki ayrı yarmayı da o yürüttü: taarruz 6.',
      NO,
    ),
    cmd(
      'nm_ramsay', 'Bertram Ramsay', 'Oramiral', 'ingiliz', 'entente', 'deniz',
      [4, 5, 7, 6], ['cikarma_uzmani', 'lojistikci'], '1944-06-06',
      'Neptün Harekâtı\'nın deniz komutanı. Yaklaşık 7.000 gemiyi beş ' +
      'sahile sıraya dizdi; Dunkirk tahliyesini de o yönetmişti. Çıkarma ' +
      'sonrası sahil üzerinden ikmal akışını örgütledi.',
      'Tarihin en büyük amfibi planı hatasız yürüdü: planlama 7, lojistik 6.',
      NO, '1945-01-02',
    ),
    cmd(
      'nm_leigh_mallory', 'Trafford Leigh-Mallory', 'Orgeneral', 'ingiliz', 'entente', 'deniz',
      [5, 4, 5, 4], ['top_atisi'], '1944-06-06',
      'Müttefik Seferi Hava Kuvvetleri Komutanı. "Ulaştırma Planı" ile ' +
      'Seine ve Loire köprülerini yıktırdı: Alman ihtiyatları cepheye ' +
      'günlerce geç ulaştı. Hava indirmenin ağır kayıp vereceğini ' +
      'savunarak iptalini istedi, dinlenmedi.',
      'Hava üstünlüğü Alman zırhlısını gündüz yürüyemez hâle getirdi: ' +
      'taarruz 5.',
      NO,
    ),
    cmd(
      'nm_gavin', 'James Gavin', 'Tümgeneral', 'amerikan', 'entente', 'kara',
      [6, 5, 5, 3], ['taarruz_ruhu', 'ilham_veren'], '1944-06-06',
      '82. Hava İndirme Tümeni\'nde önce tümen yardımcısı, sonra ' +
      'komutan. Sainte-Mère-Église çevresinde dağınık inen birlikleri ' +
      'toparlayıp Merderet geçitlerini tuttu; Market Garden\'da ' +
      'Nijmegen köprüsünü aldı.',
      'Hafif silahlı, topsuz ve ikmalsiz savaşan birlik: taarruz 6, ' +
      'lojistik 3.',
      NO,
    ),
    cmd(
      'nm_degaulle', 'Charles de Gaulle', 'General', 'fransiz', 'entente', 'siyasi',
      [4, 4, 5, 4], ['ilham_veren'], '1944-06-14',
      'Hür Fransa\'nın lideri. 14 Haziran\'da Normandiya\'ya ayak bastı; ' +
      'Paris\'in Müttefiklerce atlanıp geçilmesine izin vermedi ve ' +
      'Leclerc\'in 2. Zırhlı Tümeni\'nin şehre girmesini sağladı.',
      'Askerî değil siyasi ağırlık: ilham veren liderlik.',
      NO,
    ),
    cmd(
      'nm_dollmann', 'Friedrich Dollmann', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [3, 4, 3, 3], ['temkinli'], '1944-06-06',
      '7. Ordu Komutanı — çıkarma onun bölgesine yapıldı. 5 Haziran\'da ' +
      'hava kötü diye tatbikat düzenleyip komutanları Rennes\'e ' +
      'çağırmıştı; çıkarma sabahı tümen komutanlarının bir kısmı ' +
      'birliklerinin başında değildi. 28 Haziran\'da öldü.',
      'Cherbourg\'un kaybı ve hazırlıksız yakalanış: planlama 3.',
      NO, '1944-06-28',
    ),
    cmd(
      'nm_dietrich', 'Sepp Dietrich', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [5, 5, 3, 3], ['inatci_savunma', 'israfci'], '1944-06-07',
      'I. SS Panzer Kolordusu, sonra Ardennes\'de 6. Panzer Ordusu ' +
      'komutanı. Caen önünde 12. SS Panzer ile inatçı savunma yaptı; ' +
      'Ardennes\'de asıl darbeyi vurması beklendi ama dar yollarda ' +
      'tıkandı.',
      'Sert savunmacı, zayıf kurmay: savunma 5, planlama 3.',
      NO,
    ),
    cmd(
      'nm_model', 'Walter Model', 'Mareşal', 'alman', 'ottoman', 'kara',
      [5, 7, 5, 4], ['inatci_savunma', 'agir_kanli'], '1944-08-17',
      '"İtfaiyeci". Falaise felaketinden sonra Batı\'yı devraldı, ' +
      'dağılan cepheyi Siegfried Hattı\'nda yeniden kurdu ve Market ' +
      'Garden\'ı kırdı. Nisan 1945\'te Ruhr cebinde kuşatılınca intihar ' +
      'etti.',
      'Çökmüş cepheyi iki kez toparladı: savunma 7.',
      NO, '1945-04-21',
    ),
    cmd(
      'nm_student', 'Kurt Student', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [4, 5, 5, 3], ['inatci_savunma'], '1944-09-04',
      'Alman paraşütçülerinin kurucusu. Eylül 1944\'te derme çatma ' +
      '1. Paraşüt Ordusu\'nu Albert Kanalı boyunca dizdi; Market ' +
      'Garden\'ın tek yollu koridorunu kesen karşı taarruzları o yönetti.',
      'Hiç yoktan cephe kurdu: savunma 5, lojistik 3.',
      NO,
    ),
    cmd(
      'nm_manteuffel', 'Hasso von Manteuffel', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 5, 5, 3], ['taarruz_ruhu', 'ilham_veren'], '1944-12-16',
      '5. Panzer Ordusu Komutanı. Ardennes\'de bombardıman hazırlığı ' +
      'yapmadan sızma taktiğiyle başladı ve en derin ilerlemeyi o ' +
      'sağladı — Meuse\'e birkaç kilometre kaldı. Yakıt yetmedi.',
      'Taarruz 6 ama lojistik 3: taarruz tam da yakıtsızlıktan durdu.',
      NO,
    ),
    cmd(
      'nm_choltitz', 'Dietrich von Choltitz', 'Korgeneral', 'alman', 'ottoman', 'siyasi',
      [3, 4, 4, 3], ['temkinli'], '1944-08-07',
      'Paris Askerî Valisi. Hitler şehrin köprülerinin ve anıtlarının ' +
      'havaya uçurulmasını emretti; Choltitz emri uygulamadı ve ' +
      '25 Ağustos\'ta teslim oldu. Paris yıkılmadan kurtuldu.',
      'Askerî başarı değil, emre uymama kararı: temkinli.',
      NO, '1944-08-25',
    ),
  ],

  events: [
    {
      id: 'nm_dday',
      date: '1944-06-06',
      title: '6 HAZİRAN — Overlord',
      body:
        'Beş sahile çıkarma yapıldı: Utah, Omaha, Gold, Juno, Sword. ' +
        'Gece üç hava indirme tümeni kanatları tuttu. Omaha\'da 352. ' +
        'Piyade Tümeni beklenmediği için kayıp ağır oldu.\n\n' +
        'Alman zırhlı ihtiyatı Hitler\'in iznine bağlıydı ve saatlerce ' +
        'serbest bırakılmadı.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_hava_indirme',
      date: '1944-06-06',
      title: 'Gece Yarısı — Hava İndirme',
      body:
        'Amerikan 82. ve 101. ile İngiliz 6. Hava İndirme tümenleri ' +
        'karanlıkta atladı. Uçaksavar ateşi ve bulut yüzünden birlikler ' +
        'kilometrelerce dağıldı; paradoksal biçimde bu dağınıklık ' +
        'Almanları çıkarmanın yerini kestiremez hâle getirdi.\n\n' +
        'Pegasus Köprüsü ve Merderet geçitleri tutuldu: sahildeki ' +
        'tümenlerin kanatları karşı taarruza kapatılmış oldu.',
      kind: 'hava',
      src: NO,
    },
    {
      id: 'nm_omaha',
      date: '1944-06-06',
      title: 'Omaha — Neden Diğerlerinden Farklıydı',
      body:
        'Diğer dört sahil kum tepeleri ve düzlükken Omaha 30-50 metrelik ' +
        'dik yamaçla kapalıydı ve çıkış sadece beş vadiden mümkündü. ' +
        'İstihbaratın beklediği zayıf sahil taburu yerine burada tam ' +
        'teşkilatlı 352. Piyade Tümeni duruyordu.\n\n' +
        'Yüzer DD tanklarının çoğu dalgalı denizde çok uzaktan indirilip ' +
        'battı: piyade zırhlı desteği olmadan karaya çıktı. Sahil öğleye ' +
        'kadar kilitli kaldı, kayıp yaklaşık 2.000-3.000 arasında ' +
        'verilir — kaynaklar çelişir.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_fortitude',
      date: '1944-06-10',
      title: 'Fortitude — Aldatma Çıkarmadan Sonra da Sürdü',
      body:
        'Sahte "FUSAG" ordusu, şişme tanklar ve yoğun telsiz trafiği ile ' +
        'Alman istihbaratına asıl çıkarmanın Pas-de-Calais\'ye geleceği ' +
        'anlatıldı. Patton bu hayalî ordunun komutanı gösterildi.\n\n' +
        'Normandiya "oyalama" sanıldığı için güçlü 15. Ordu haftalarca ' +
        'Calais\'de bekletildi. Köprübaşı en kırılgan olduğu günlerde ' +
        'karşısında Alman ihtiyatının yarısını bulmadı — aldatma, ' +
        'tümenle ölçülmeyen bir kuvvet çarpanıdır.',
      kind: 'siyasi',
      src: NO,
    },
    {
      id: 'nm_firtina',
      date: '1944-06-19',
      title: '19 Haziran Fırtınası',
      body:
        'Üç gün süren şiddetli fırtına Omaha açığındaki Amerikan ' +
        'Mulberry\'sini parçaladı, yüzlerce çıkarma aracını kıyıya ' +
        'attı. Arromanches\'teki İngiliz limanı onarılarak kullanıldı.\n\n' +
        'Boşaltma günlerce durunca cephedeki taarruzlar mermi tasarrufu ' +
        'için ertelendi: köprübaşı denizden besleniyordu ve hava ' +
        'bozunca besleme de duruyordu.',
      kind: 'ikmal',
      src: NO,
    },
    {
      id: 'nm_cherbourg',
      date: '1944-06-27',
      title: 'Cherbourg — Alınan Ama Çalışmayan Liman',
      body:
        'Collins\'in VII. Kolordusu yarımadayı kesip derin su limanını ' +
        'aldı. Ancak Alman garnizonu rıhtımları dinamitlemiş, vinçleri ' +
        'devirmiş ve girişi mayın ile batık gemiyle tıkamıştı.\n\n' +
        'Liman ancak eylüle doğru anlamlı kapasiteye ulaştı. Ders: bir ' +
        'limanı işgal etmek ile ikmal akıtmak aynı şey değil.',
      kind: 'ikmal',
      src: NO,
    },
    {
      id: 'nm_sherman',
      date: '1944-07-18',
      title: 'Sherman ile Panther Eşit Değil',
      body:
        'Goodwood ve bocage çarpışmaları aynı şeyi gösterdi: Sherman, ' +
        'Panther veya Tiger\'ın ön zırhını normal muharebe mesafesinde ' +
        'delemiyor, buna karşılık 88 mm ve uzun 75 mm top Sherman\'ı ' +
        'bir kilometreden deliyordu.\n\n' +
        'Müttefik cevabı nitelik değil sayı, hava desteği ve topçu ' +
        'oldu. Oyunda bu fark zırh/delme değerleriyle sayıya dökülür: ' +
        'yanlış nesil zırhlıyla taarruz eden taraf kaybeder.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_mulberry',
      date: '1944-06-09',
      title: 'Mulberry — Yapay Limanlar',
      body:
        'Derin su limanı alınamadığı için iki yapay liman İngiltere\'den ' +
        'çekilip Normandiya kıyısına kuruldu. 19 Haziran fırtınası ' +
        'Amerikan limanını kullanılmaz hâle getirdi; ikmal haftalarca ' +
        'doğrudan sahilden yapıldı.',
      kind: 'ikmal',
      src: NO,
    },
    {
      id: 'nm_caen',
      date: '1944-07-09',
      title: 'Caen — Planlanandan Bir Ay Geç',
      body:
        'İlk gün alınması planlanan Caen ancak Temmuz\'da düştü. Bocage ' +
        'arazisi — yüksek toprak setler ve çalı çitler — savunana her ' +
        'tarlada yeni mevzi veriyordu.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_cobra',
      date: '1944-07-25',
      title: 'Cobra — Cephe Yarıldı',
      body:
        'Saint-Lô yakınında ağır bombardıman uçaklarıyla açılan koridordan ' +
        'Amerikan zırhlısı geçti. Normandiya\'daki mevzi savaşı hareketli ' +
        'savaşa döndü.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_falaise',
      date: '1944-08-19',
      title: 'Falaise Cebi',
      body:
        'Alman 7. Ordusu Falaise çevresinde kuşatıldı. Cep tam ' +
        'kapanmadığı için bir kısım kuvvet kaçabildi; yine de Batı\'daki ' +
        'Alman ordusu bir daha toparlanamadı.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_mortain',
      date: '1944-08-07',
      title: 'Mortain — Hitler\'in Karşı Taarruzu',
      body:
        'Hitler, çekilmek yerine dört panzer tümeniyle Avranches\'e ' +
        'vurup Amerikan kopma koridorunu kesmeyi emretti. Taarruz Ultra ' +
        'sayesinde önceden bilindi, gün ağarınca avcı-bombardıman ' +
        'uçakları kolonları durdurdu.\n\n' +
        'Alman zırhlısı böylece cebin tam ağzına yığılmış oldu: Mortain ' +
        'olmasa Falaise kuşatması bu kadar büyük olmazdı.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_paris',
      date: '1944-08-25',
      title: 'Paris Kurtarıldı',
      body:
        'Fransız 2. Zırhlı Tümeni şehre girdi. Dört yıllık işgal sona ' +
        'erdi. Hızlı ilerleyiş ikmal hatlarını 500 kilometreye uzattı ve ' +
        'benzin sıkıntısı harekâtı yavaşlattı.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_kirmizi_top',
      date: '1944-09-01',
      title: 'Kırmızı Top Ekspresi — Yakıtı Yolda Yakmak',
      body:
        'Demiryolları kendi uçaklarımızca yıkıldığı için ikmal kamyonla ' +
        'taşındı. Tek yönlü halka güzergâhta günde binlerce araç çalıştı, ' +
        'ama mesafe uzadıkça konvoy taşıdığı benzinin önemli bir ' +
        'kısmını kendi yolunda tüketti.\n\n' +
        'Eylül başında ordular Almanya sınırında benzinsiz durdu. ' +
        'Oyundaki kural birebir aynı: ikmal mesafeyle azalır, cephe ' +
        'kaynağından uzaklaştıkça taarruz kendi kendini durdurur.',
      kind: 'ikmal',
      src: NO,
    },
    {
      id: 'nm_anvers',
      date: '1944-09-04',
      title: 'Anvers Alındı — Ama Kullanılamıyor',
      body:
        'İngilizler Avrupa\'nın en büyük limanını neredeyse hasarsız ele ' +
        'geçirdi. Oysa Anvers denize 80 kilometre içeriden, Schelde ' +
        'Nehri üzerinden bağlanır ve nehrin iki yakası hâlâ Alman ' +
        '15. Ordusu\'ndaydı.\n\n' +
        'Haliç temizlenmeden limanın hiçbir değeri yoktu. İkmal krizinin ' +
        'asıl sebebi budur: liman alındı sanıldı, ağız kapalı kaldı.',
      kind: 'ikmal',
      src: NO,
    },
    {
      id: 'nm_market_garden',
      date: '1944-09-17',
      title: 'Market Garden — Bir Köprü Fazla',
      body:
        'Üç hava indirme tümeni Hollanda\'da köprüleri tutacak, zırhlı ' +
        'kolordu tek bir yoldan 100 kilometre ilerleyip Arnhem\'e ' +
        'ulaşacaktı. Nijmegen alındı ama Arnhem\'de bekleyen iki SS ' +
        'panzer tümeni hesaba katılmamıştı.\n\n' +
        'İngiliz 1. Hava İndirme Tümeni\'nin büyük kısmı kayboldu. Tek ' +
        'yollu, tek hatlı taarruz plan bir yerde tutmazsa tamamen ' +
        'tutmaz — ve bu hızlı atak, Schelde\'nin temizlenmesini de ' +
        'geciktirdi.',
      kind: 'hava',
      src: NO,
    },
    {
      id: 'nm_schelde',
      date: '1944-11-28',
      title: 'Schelde Temizlendi — İlk Gemi Anvers\'te',
      body:
        'Kanada 1. Ordusu beş hafta su basmış polder arazisinde ' +
        'Walcheren ve Güney Beveland\'ı temizledi; ardından haliç ' +
        'mayından arındırıldı. İlk konvoy ancak 28 Kasım\'da Anvers\'e ' +
        'girdi.\n\n' +
        'Liman açıldıktan sonra Müttefik ikmali Normandiya sahillerinden ' +
        'kurtuldu. Eylül-Kasım arasındaki durgunluğun açıklaması tek ' +
        'cümledir: cephe ileride, liman geride.',
      kind: 'ikmal',
      src: NO,
    },
    {
      id: 'nm_ardennes',
      date: '1944-12-16',
      title: 'Ardennes — Son Alman Taarruzu',
      body:
        'Almanya 1940\'taki aynı ormandan son taarruzunu başlattı. ' +
        'Bastogne kuşatıldı ama düşmedi; hava açılınca taarruz durdu. ' +
        'Batı\'da son zırhlı ihtiyat burada tükendi.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_remagen',
      date: '1945-03-07',
      title: 'Remagen — Yıkılmayan Köprü',
      body:
        'Ludendorff Köprüsü imha hazırlığı yarım kalınca ayakta ele ' +
        'geçti. Amerikan birlikleri aynı gün Ren\'in doğu yakasına ' +
        'geçip köprübaşı kurdu; köprü on gün sonra çökse de o sırada ' +
        'şamandıra köprüler kurulmuştu.\n\n' +
        'Almanya\'nın son doğal savunma hattı planlı büyük geçiş ' +
        'harekâtından haftalar önce delinmiş oldu.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_ruhr',
      date: '1945-04-01',
      title: 'Ruhr Cebi — Sanayi Kuşatıldı',
      body:
        'Kuzey ve güneyden gelen Amerikan orduları Lippstadt\'ta ' +
        'birleşerek Model\'in B Ordular Grubu\'nu Ruhr havzasında ' +
        'kapattı. Teslim olan asker sayısı 300.000\'i aştı; Model ' +
        'intihar etti.\n\n' +
        'Almanya\'nın kömür ve çelik merkezi düşünce savaş sanayisi ' +
        'fiilen bitti — cephedeki direniş artık ikmalsiz direnişti.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_teslim',
      date: '1945-05-08',
      title: '8 MAYIS — Avrupa\'da Savaş Bitti',
      body:
        'Ren mart ayında geçildi, Ruhr kuşatıldı. Almanya kayıtsız şartsız ' +
        'teslim oldu.',
      kind: 'siyasi',
      src: NO,
    },
  ],
};
