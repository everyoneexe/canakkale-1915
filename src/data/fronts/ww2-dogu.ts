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
    // ── 1943 sonrası teşkilât: yeni nesil zırh ve tanksavarlı piyade ──
    { nation: DE, name: '4. Panzer Ordusu — Hoth (Kursk)', templateId: 'de_panzer_43', at: [36.00, 50.90], arrivesOn: '1943-07-05', src: DC },
    { nation: DE, name: '503. Ağır Panzer Taburu — Tiger', templateId: 'de_agir_panzer', at: [36.60, 51.20], arrivesOn: '1943-07-05', src: DC },
    { nation: DE, name: '9. Ordu — Model', templateId: 'de_piyade_tumen', at: [35.80, 52.40], arrivesOn: '1943-07-05', src: DC },
    { nation: SU, name: 'Merkez Cephesi — Rokossovski', templateId: 'su_tufek_tumen_43', at: [35.60, 52.20], arrivesOn: '1943-07-05', src: DC },
    { nation: SU, name: 'Voronej Cephesi — Vatutin', templateId: 'su_tufek_tumen_43', at: [36.40, 50.60], arrivesOn: '1943-07-05', src: DC },
    { nation: SU, name: '1. Belarus Cephesi', templateId: 'su_tufek_tumen_43', at: [29.20, 53.20], arrivesOn: '1944-06-22', src: DC },
    { nation: SU, name: '3. Belarus Cephesi', templateId: 'su_tank_kolordu', at: [30.90, 54.80], arrivesOn: '1944-06-22', src: DC },
    { nation: SU, name: '2. Muhafız Ağır Tank Tugayı', templateId: 'su_agir_tank', at: [21.00, 52.25], arrivesOn: '1945-01-12', src: DC },
    { nation: SU, name: '1. Ukrayna Cephesi — Konev', templateId: 'su_tufek_tumen_43', at: [20.00, 50.60], arrivesOn: '1945-01-12', src: DC },
    { nation: DE, name: 'Vistül Ordular Grubu', templateId: 'de_piyade_tumen', at: [14.55, 53.42], arrivesOn: '1945-01-25', src: DC },
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
    cmd(
      'wd_rundstedt', 'Gerd von Rundstedt', 'Mareşal', 'alman', 'ottoman', 'kara',
      [5, 5, 6, 3], ['temkinli', 'agir_kanli'], '1941-06-22',
      'Güney Ordular Grubu Komutanı. Uman ve Kiev kuşatmalarını yönetti, ' +
      'Rostov\'u aldı; şehri tutmanın imkânsız olduğunu söyleyip geri ' +
      'çekilince Aralık 1941\'de görevden alındı.',
      'Ordu grubu ölçeğinde usta bir plancı, ama ikmali Dinyeper\'in ' +
      'ötesine taşıyamadı: planlama 6, lojistik 3.',
      DC, '1941-12-01',
    ),
    cmd(
      'wd_leeb', 'Wilhelm Ritter von Leeb', 'Mareşal', 'alman', 'ottoman', 'kara',
      [4, 5, 5, 3], ['temkinli', 'inatci_savunma'], '1941-06-22',
      'Kuzey Ordular Grubu Komutanı. Baltık\'ı üç haftada geçti, ama ' +
      'Leningrad\'ı hücumla almak yerine açlıkla teslim alma emrini ' +
      'uygulamak zorunda kaldı. Ocak 1942\'de istifa etti.',
      'Savunma doktrininin kuramcısıydı; taarruz dinamizmi sınırlı: ' +
      'taarruz 4.',
      DC, '1942-01-16',
    ),
    cmd(
      'wd_hoth', 'Hermann Hoth', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 4, 5, 3], ['taarruz_ruhu', 'atilgan_amiral'], '1941-06-22',
      '3. Panzer Grubu, sonra 4. Panzer Ordusu Komutanı. Minsk ve ' +
      'Smolensk kıskaçlarının kuzey kolunu kapattı; Aralık 1942\'de ' +
      'Stalingrad\'daki 6. Orduya ulaşmayı deneyen Kış Fırtınası\'nı yürüttü.',
      'Panzer kolordularını hızlı kullanmakta Guderian ayarında: ' +
      'taarruz 6; kurtarma harekâtı ikmal yokluğundan battı.',
      DC,
    ),
    cmd(
      'wd_kleist', 'Ewald von Kleist', 'Mareşal', 'alman', 'ottoman', 'kara',
      [5, 4, 5, 3], ['taarruz_ruhu'], '1941-06-22',
      '1. Panzer Grubu Komutanı; Uman ve Kiev kıskaçlarının güney kolunu ' +
      'kapattı. 1942\'de A Ordular Grubuyla Kafkasya petrolüne yürüdü, ' +
      'Grozni\'ye ulaşamadan Stalingrad çöküşüyle geri çekildi.',
      'Kafkasya harekâtı akaryakıtın bizzat kendisi için yapıldı ve ' +
      'akaryakıt yetmediği için durdu: lojistik 3.',
      DC,
    ),
    cmd(
      'wd_hoepner', 'Erich Hoepner', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 4, 4, 3], ['taarruz_ruhu', 'israfci'], '1941-06-22',
      '4. Panzer Grubu Komutanı; Leningrad\'a, sonra Moskova\'ya sürüldü. ' +
      'Ocak 1942\'de Hitler\'in "bir adım geri yok" emrine rağmen çekilince ' +
      'ordudan ihraç edildi; 1944 suikastine katıldı ve idam edildi.',
      'Taarruzda keskin, ama birliklerini yıpratarak kullandı: israfçı.',
      DC, '1942-01-08',
    ),
    cmd(
      'wd_model', 'Walter Model', 'Mareşal', 'alman', 'ottoman', 'kara',
      [4, 7, 5, 4], ['inatci_savunma', 'siper_ustasi', 'agir_kanli'], '1942-01-16',
      '9. Ordu, sonra ordu grubu komutanı. Rjev çıkıntısını iki yıl ' +
      'tuttu, Bagration\'dan sonra çöken cepheyi yeniden dikti. ' +
      '"İtfaiyeci" lakabı buradan gelir.',
      'Savaşın en iyi savunma komutanı sayılır: savunma 7; taarruzda ' +
      '(Kursk\'un kuzey kolu) aynı başarıyı gösteremedi.',
      DC,
    ),
    cmd(
      'wd_konev', 'İvan Konev', 'Mareşal', 'sovyet', 'entente', 'kara',
      [6, 5, 5, 4], ['taarruz_ruhu', 'atilgan_amiral'], '1941-09-12',
      'Batı, Step ve 1. Ukrayna Cephesi komutanı. Korsun kuşatmasını, ' +
      'Vistül-Oder ve Berlin harekâtlarını yürüttü; Elbe\'de Amerikalılarla ' +
      'buluşan cephe onunkiydi.',
      'Takip ve yarma harekâtlarında hızlı: taarruz 6; Jukov\'la rekabeti ' +
      'zaman zaman kayıpları artırdı.',
      DC,
    ),
    cmd(
      'wd_rokossovski', 'Konstantin Rokossovski', 'Mareşal', 'sovyet', 'entente', 'kara',
      [6, 6, 6, 5], ['ilham_veren', 'inatci_savunma'], '1941-07-15',
      '1937 tasfiyelerinde hapsedilip işkence gördü, 1940\'ta orduya ' +
      'döndü. Moskova savunması, Stalingrad\'da kuşatılan 6. Ordunun ' +
      'imhası (Halka Harekâtı) ve Bagration onun imzasını taşır.',
      'Bagration\'da Stalin\'e karşı çıkıp çift yarma planını kabul ' +
      'ettirdi ve haklı çıktı: planlama 6.',
      DC,
    ),
    cmd(
      'wd_vatutin', 'Nikolay Vatutin', 'Orgeneral', 'sovyet', 'entente', 'kara',
      [6, 5, 5, 4], ['taarruz_ruhu'], '1942-10-22',
      'Güneybatı ve Voronej Cephesi komutanı. Uranüs\'ün dış kıskacını, ' +
      'Kursk\'un güney savunmasını ve Kiev\'in geri alınışını yönetti. ' +
      'Şubat 1944\'te Ukraynalı milliyetçilerin pususunda yaralanıp öldü.',
      'Atak bir taarruz komutanı; Üçüncü Harkov\'da fazla ileri gidip ' +
      'Manstein\'ın karşı taarruzuna yakalandı.',
      DC, '1944-04-15',
    ),
    cmd(
      'wd_vasilevski', 'Aleksandr Vasilevski', 'Mareşal', 'sovyet', 'entente', 'kara',
      [5, 5, 7, 6], ['lojistikci', 'temkinli'], '1942-06-26',
      'Genelkurmay Başkanı. Uranüs, Kursk savunma planı ve Bagration ' +
      'onun kurmay çalışmasıdır; cepheler arası eşgüdümü ve ihtiyat ' +
      'sevkini yürüttü.',
      'Savaşı haritada kazanan adam: planlama 7, lojistik 6.',
      DC,
    ),
    cmd(
      'wd_yeremenko', 'Andrey Yeremenko', 'Orgeneral', 'sovyet', 'entente', 'kara',
      [4, 6, 4, 4], ['inatci_savunma', 'siper_ustasi'], '1942-08-01',
      'Stalingrad Cephesi Komutanı. Çuykov\'u 62. Ordunun başına o ' +
      'getirdi; şehir savunulurken Uranüs\'ün güney kıskacı onun ' +
      'cephesinden çıktı.',
      'Savunmada dirençli, taarruz planlamasında ortalama: savunma 6, ' +
      'planlama 4.',
      DC,
    ),
    cmd(
      'wd_timosenko', 'Semyon Timoşenko', 'Mareşal', 'sovyet', 'entente', 'kara',
      [4, 5, 3, 4], ['agir_kanli'], '1941-06-22',
      'Savunma Halk Komiseri, sonra Batı ve Güneybatı istikamet komutanı. ' +
      'Smolensk\'te Almanları iki ay oyaladı; Mayıs 1942\'deki Harkov ' +
      'taarruzu ise kuşatmayla bitti ve kaynaklar 200.000-240.000 arası ' +
      'esir verir.',
      'İkinci Harkov onun planıydı ve Mavi Harekât\'ın önünü açtı: ' +
      'planlama 3.',
      DC, '1942-07-12',
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
      id: 'wd_bialystok_minsk',
      date: '1941-06-29',
      title: 'Bialystok-Minsk Kıskacı',
      body:
        'Hoth ve Guderian\'ın panzer grupları Minsk\'in doğusunda ' +
        'buluşarak Batı Cephesi\'nin ana kuvvetini kuşattı; yaklaşık ' +
        '300.000 esir alındı. Kıskaç o kadar derin kapandı ki piyade ' +
        'tümenleri çemberi kapatmaya günlerce yetişemedi — Alman ' +
        'ordusunun tankı hızlı, ayağı yayaydı.',
      kind: 'kara',
      src: BAR,
    },
    {
      id: 'wd_t34_soku',
      date: '1941-07-03',
      title: 'T-34 Şoku',
      body:
        'Alman birlikleri Sovyet T-34 ve KV-1 tanklarıyla karşılaştı: ' +
        '37 mm tanksavar topu zırhı delemiyordu, "kapı tokmağı" lakabını ' +
        'burada aldı. Buna karşılık 1941 Sovyet tüfek tümenlerinin kendi ' +
        'tanksavarı yok denecek kadar azdı; oyunda da tanksavarsız tüfek ' +
        'tümeni zırhı delemez, 1943 tertibi (tanksavarlı) delebilir.',
      kind: 'kara',
      src: BAR,
    },
    {
      id: 'wd_smolensk',
      date: '1941-07-16',
      title: 'Smolensk Kuşatması ve İlk Duraklama',
      body:
        'Merkez Ordular Grubu Smolensk\'te yüz binlerce esir daha aldı, ' +
        'ama Timoşenko\'nun aralıksız karşı taarruzları iki ay sürdü. ' +
        'Moskova yolundaki bu gecikme, Alman taarruzunun kendi ' +
        'takviminden ilk ciddi sapmasıydı.',
      kind: 'kara',
      src: BAR,
    },
    {
      id: 'wd_lojistik',
      date: '1941-08-10',
      title: 'İKMAL ÇÖKÜYOR — Barbarossa\'nın Asıl Yenilgisi',
      body:
        'Alman ordusu motorlu değildi: harekâta yaklaşık 600.000 atla ' +
        'girdi ve ikmalin büyük bölümünü at arabasıyla taşıdı. Sovyet ' +
        'demiryolu açıklığı farklı olduğu için her hat tek tek ' +
        'daraltılmak zorundaydı. Smolensk\'ten sonra cepheye giden tonaj ' +
        'ihtiyacın altına düştü. "Kışa yenildik" anlatısı, generallerin ' +
        'savaş sonrası aklanma hikâyesidir — hat zaten yazın kopmuştu.',
      kind: 'ikmal',
      src: DC,
    },
    {
      id: 'wd_leningrad_abluka',
      date: '1941-09-08',
      title: 'Leningrad Ablukası Başladı',
      body:
        'Şlisselburg\'un düşmesiyle şehrin kara bağlantısı kesildi; ' +
        'abluka 872 gün sürdü ve çoğu açlıktan olmak üzere yüz binlerce ' +
        'sivil öldü. Hitler şehri hücumla almayı değil açlıkla ' +
        'çökertmeyi emretti: böylece Kuzey Ordular Grubu yıllarca bir ' +
        'kuşatmaya çivilendi.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_tayfun',
      date: '1941-09-30',
      title: 'Tayfun Harekâtı',
      body:
        'Moskova taarruzu başladı; Vyazma ve Bryansk kıskaçlarında yine ' +
        'yüz binlerce esir alındı. Ama Ekim ortasında rasputitsa — çamur ' +
        'mevsimi — yolları bataklığa çevirdi ve tekerlekli ikmal durdu. ' +
        'Kiev yüzünden kaybedilen haftalar burada faturaya dönüştü.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_sorge',
      date: '1941-10-15',
      title: 'Sorge Raporu — Doğu Sınırı Boşaltılıyor',
      body:
        'Tokyo\'daki Sovyet ajanı Richard Sorge, Japonya\'nın kuzeye ' +
        'değil güneye saldıracağını bildirdi. Bu istihbarat sayesinde ' +
        'Uzak Doğu\'daki kışa hazır Sibirya tümenleri batıya kaydırıldı. ' +
        'Moskova savunmasını bir muharebe değil, bir istihbarat kararı ' +
        'kurtardı.',
      kind: 'siyasi',
      src: DC,
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
      id: 'wd_mavi',
      date: '1942-06-28',
      title: 'Mavi Harekât — Petrole Doğru',
      body:
        'Artık bütün cephede taarruz edecek gücü kalmayan Almanya, ' +
        'yalnız güneyde saldırdı: hedef Kafkas petrolüydü. Ordu ikiye ' +
        'bölündü — A Grubu Kafkasya\'ya, B Grubu Volga\'ya. İki ıraksak ' +
        'istikamet, kanatları tutacak yedeği olmayan bir cephe demekti.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_stalingrad_sehir',
      date: '1942-09-13',
      title: 'Şehir Savaşı — "Düşmana Sarıl"',
      body:
        'Çuykov\'un 62. Ordusu Volga kıyısında birkaç yüz metrelik şeride ' +
        'sıkıştı ama hatları Alman hatlarına el bombası menziline kadar ' +
        'yaklaştırdı. Böylece Stuka ve topçu desteği kullanılamaz hâle ' +
        'geldi: Alman üstünlüğünün kaynağı birleşik silah tatbikiydi, ' +
        'enkaz şehrinde o bağ koptu.',
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
      id: 'wd_harkov3',
      date: '1943-03-15',
      title: 'Üçüncü Harkov — Manstein\'ın Karşı Taarruzu',
      body:
        'Stalingrad\'dan sonra güneye akan Sovyet cepheleri ikmallerini ' +
        'geride bıraktı. Manstein, Harkov\'u gönüllü terk edip biriktirdiği ' +
        'panzer tümenleriyle yandan vurdu ve şehri geri aldı. Dersi nettir: ' +
        'aşırı uzayan taarruz, savunanın hareketli yedeğine av olur.',
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
      id: 'wd_prohorovka',
      date: '1943-07-12',
      title: 'Prohorovka ve İnisiyatifin El Değiştirmesi',
      body:
        'Kursk\'un güney kanadında yüzlerce tankın girdiği muharebe ' +
        'yaşandı; kayıp rakamları kaynaklar arasında ciddi biçimde ' +
        'çelişir ve Sovyet zırhlı kaybının Alman kaybının katları olduğu ' +
        'bugün kabul edilir. Asıl sonuç sayıda değil: Sovyetler ilk kez ' +
        'bir Alman yaz taarruzunu başlamadan önce okuyup kırdı ve aynı ' +
        'ay karşı taarruza geçti.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_bagration',
      date: '1944-06-22',
      title: 'Bagration — Merkez Grubu Yok Oldu',
      body:
        'Barbarossa\'nın üçüncü yıldönümünde başlayan Sovyet taarruzu ' +
        'Merkez Ordular Grubunu imha etti: yaklaşık otuz tümen yok oldu. ' +
        'Aldatma harekâtıyla Almanlar ana darbeyi güneyde bekliyordu. ' +
        'Normandiya çıkarmasından büyük bir harekâttı ama Batı\'da ' +
        'neredeyse hiç konuşulmaz.',
      kind: 'kara',
      src: DC,
    },
    {
      id: 'wd_vistul_oder',
      date: '1945-01-12',
      title: 'Vistül-Oder Harekâtı',
      body:
        'Jukov ve Konev üç haftada Vistül\'den Oder\'e, Berlin\'in ' +
        'yaklaşık 70 kilometre yakınına ilerledi. Bu hız artık Sovyet ' +
        'ordusunun kamyonla, demiryolu onarım taburlarıyla ve ' +
        'topçu yoğunluğuyla donandığını gösteriyordu: 1941\'de Almanları ' +
        'durduran lojistik sorununu Sovyetler çözmüştü.',
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
    {
      id: 'wd_teslim',
      // İmza Berlin'de 8 Mayıs gecesi atıldı; Moskova saatiyle 9 Mayıs'tı.
      // Cephe 8 Mayıs'ta bittiği için olay 9'una yazılınca hiç ateşlenmiyordu.
      date: '1945-05-08',
      title: 'Teslim',
      body:
        'Reichstag 30 Nisan\'da ele geçirildi, garnizon 2 Mayıs\'ta ' +
        'teslim oldu; kayıtsız şartsız teslim Berlin\'de 8 Mayıs gecesi ' +
        'tekrarlandı ve Moskova saatiyle 9 Mayıs\'a girildi. Avrupa\'daki ' +
        'Alman kayıplarının büyük bölümü bu cephede verilmişti.',
      kind: 'siyasi',
      src: DC,
    },
  ],
};
