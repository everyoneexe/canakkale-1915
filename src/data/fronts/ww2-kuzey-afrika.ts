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
// 1939 ulus listesinde ayrı bir Hindistan yok; Hint Ordusu birlikleri
// Britanya kadrosunda sayılır. Ad birliğin kendi adında korunuyor.
const IN = 'United Kingdom';
const ZA = 'Union of South Africa';

export const KUZEY_AFRIKA_PACK: FrontPack = {
  theatre: 'ww2_kuzey_afrika',

  formations: [
    // ── Mihver ──
    { nation: IT, name: '10. İtalyan Ordusu', templateId: 'it_ww2_piyade', at: [25.10, 31.60], src: KA },
    { nation: IT, name: 'Ariete Zırhlı Tümeni', templateId: 'it_zirhli_tumen', at: [22.00, 32.10], arrivesOn: '1941-01-24', src: KA },
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
    { nation: US, name: '1. Zırhlı Tümen', templateId: 'us_zirhli_tumen', at: [0.13, 35.70], arrivesOn: '1942-11-08', src: KA },
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
    cmd(
      'ka_oconnor', 'Richard O\'Connor', 'Korgeneral', 'ingiliz', 'entente', 'kara',
      [6, 4, 7, 5], ['taarruz_ruhu', 'atilgan_amiral'], '1940-09-13',
      'Batı Çöl Kuvveti Komutanı ve Pusula Harekâtı\'nın gerçek mimarı. ' +
      'Beş günlük bir akın olarak planlanan harekâtı iki aylık bir imha ' +
      'seferine çevirdi. Nisan 1941\'de çölde yolunu şaşırıp Alman ' +
      'devriyesine esir düştü.',
      'Kendisinden kat kat kalabalık bir orduyu planlamayla imha etti: ' +
      'planlama 7. Ünü Rommel\'inkinin gölgesinde kaldı.',
      KA, '1941-04-07',
    ),
    cmd(
      'ka_cunningham_a', 'Alan Cunningham', 'Korgeneral', 'ingiliz', 'entente', 'kara',
      [4, 4, 4, 4], ['temkinli'], '1941-09-26',
      '8. Ordu\'nun ilk komutanı. Haçlı Seferi Harekâtı\'nı başlattı ama ' +
      'tank kayıpları karşısında çekilmeyi düşününce Auchinleck tarafından ' +
      'harekâtın ortasında görevden alındı.',
      'Harekâtı başlattı, sinirini koruyamadı: her alanda 4.',
      KA, '1941-11-26',
    ),
    cmd(
      'ka_ritchie', 'Neil Ritchie', 'Korgeneral', 'ingiliz', 'entente', 'kara',
      [4, 3, 3, 4], ['israfci'], '1941-11-26',
      '8. Ordu Komutanı. Gazala\'da zırhlı tümenlerini parça parça ' +
      'muharebeye soktu; Tobruk\'un düşüşünden sonra görevden alındı.',
      'Kuvvetini topluca kullanamadı, Rommel tek tek ezdi: planlama 3.',
      KA, '1942-06-25',
    ),
    cmd(
      'ka_alexander', 'Harold Alexander', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [5, 5, 6, 6], ['agir_kanli', 'lojistikci'], '1942-08-15',
      'Orta Doğu Başkomutanı. Montgomery\'ye siyasi baskıya karşı zaman ' +
      'kazandırdı; sonra Tunus\'ta doğu ve batıdan gelen iki orduyu tek ' +
      '18. Ordu Grubu altında birleştirdi.',
      'Kendi taarruzunu yönetmedi, başkalarının taarruzunu mümkün kıldı: ' +
      'planlama ve lojistik 6.',
      KA,
    ),
    cmd(
      'ka_cunningham_abc', 'Andrew Cunningham', 'Oramiral', 'ingiliz', 'entente', 'deniz',
      [5, 5, 5, 6], ['atilgan_amiral', 'lojistikci'], '1940-09-13',
      'Akdeniz Filosu Komutanı. Mihver\'in Libya\'ya giden ikmal ' +
      'konvoylarını boğdu, Malta\'yı ayakta tuttu, Meşale çıkarmasının ' +
      'deniz kolunu yönetti.',
      'Çöldeki muharebeyi karada değil denizde belirledi: lojistik 6.',
      KA,
    ),
    cmd(
      'ka_nehring', 'Walther Nehring', 'Korgeneral', 'alman', 'ottoman', 'kara',
      [5, 5, 4, 3], ['taarruz_ruhu'], '1942-03-09',
      'Alman Afrika Kolordusu Komutanı. Gazala ve Tobruk\'ta kolorduyu ' +
      'yönetti, Alam el Halfa\'da hava saldırısında ağır yaralandı. ' +
      'Kasım 1942\'de Tunus köprübaşını kuran ilk komutan oldu.',
      'İyi bir kolordu komutanı, ikmal sorununa çaresiz: lojistik 3.',
      KA, '1942-08-31',
    ),
    cmd(
      'ka_bayerlein', 'Fritz Bayerlein', 'Tümgeneral', 'alman', 'ottoman', 'kara',
      [5, 5, 6, 4], ['lojistikci'], '1941-10-01',
      'Panzerarmee Afrika Kurmay Başkanı. Rommel\'in hasta veya cephede ' +
      'olmadığı günlerde orduyu fiilen o yönetti; Mareth\'te 1. İtalyan ' +
      'Ordusu\'nun kurmay işini üstlendi.',
      'Rommel\'in atılganlığını düzene sokan kurmay: planlama 6.',
      KA,
    ),
    cmd(
      'ka_arnim', 'Hans-Jürgen von Arnim', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [4, 5, 4, 3], ['inatci_savunma'], '1942-12-03',
      '5. Panzer Ordusu ve ardından Afrika Ordu Grubu Komutanı. ' +
      'Rommel ile hiç anlaşamadı; Tunus köprübaşını altı ay savundu ve ' +
      '13 Mayıs 1943\'te teslim oldu.',
      'Savunması sağlamdı ama deniz ikmali kesik bir köprübaşını ' +
      'kurtaracak savunma yoktur: lojistik 3.',
      KA,
    ),
    cmd(
      'ka_bastico', 'Ettore Bastico', 'Mareşal', 'italyan', 'ottoman', 'kara',
      [3, 4, 4, 3], ['temkinli'], '1941-07-19',
      'Libya Genel Valisi ve Kuzey Afrika\'daki İtalyan üst komutanı. ' +
      'Kâğıt üzerinde Rommel\'in amiriydi; Rommel ona "Bombastico" derdi ' +
      've emirlerini çoğu kez görmezden geldi.',
      'Yetkisi vardı, otoritesi yoktu; komuta zinciri bölünmüştü: ' +
      'taarruz 3.',
      KA, '1943-02-02',
    ),
    cmd(
      'ka_messe', 'Giovanni Messe', 'Mareşal', 'italyan', 'ottoman', 'kara',
      [4, 6, 5, 4], ['inatci_savunma', 'siper_ustasi'], '1943-02-01',
      '1. İtalyan Ordusu Komutanı. Mareth Hattı\'nda Montgomery\'yi ' +
      'günlerce oyaladı ve ordusunu düzenli çekti. Afrika\'daki son ' +
      'Mihver komutanı olarak 13 Mayıs 1943\'te teslim oldu.',
      'İtalyan ordusunun çölde en iyi savunan komutanı: savunma 6. ' +
      'Kötü olan asker değil, teçhizat ve komutaydı.',
      KA,
    ),
    cmd(
      'ka_eisenhower', 'Dwight D. Eisenhower', 'Orgeneral', 'amerikan', 'entente', 'kara',
      [4, 5, 6, 7], ['lojistikci', 'agir_kanli'], '1942-11-08',
      'Müttefik Kuvvetler Başkomutanı. Meşale Harekâtı\'nı yönetti. ' +
      'Asıl işi muharebe değil, Amerikan-İngiliz-Fransız koalisyonunu ' +
      'tek komuta altında çalışır tutmaktı.',
      'Koalisyon ve ikmal yöneticisi: lojistik 7, taarruz 4.',
      KA,
    ),
    cmd(
      'ka_patton', 'George S. Patton', 'Korgeneral', 'amerikan', 'entente', 'kara',
      [6, 4, 5, 4], ['taarruz_ruhu', 'atilgan_amiral'], '1943-03-06',
      'Kasserine bozgunundan sonra II. Kolordu\'nun başına getirildi. ' +
      'İki haftada disiplini yeniden kurdu ve kolorduyu El Guettar\'da ' +
      'Alman zırhlısını püskürtecek hâle getirdi.',
      'Kırılan birliği hızla toparladı, taarruzda sert: taarruz 6.',
      KA, '1943-04-15',
    ),
    cmd(
      'ka_bradley', 'Omar Bradley', 'Korgeneral', 'amerikan', 'entente', 'kara',
      [5, 5, 6, 5], ['temkinli', 'ilham_veren'], '1943-04-16',
      'Patton\'dan sonra II. Kolordu Komutanı. Kolorduyu kuzeye, Bizerte ' +
      'yönüne kaydırdı ve Tunus\'un düşüşünde Amerikan payını orada aldı.',
      'Gösterişsiz, hesaplı, askerine yakın: planlama 6.',
      KA,
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
        'O\'Connor\'ın baskın taarruzu beş günlük bir akın olarak ' +
        'planlanmıştı; iki ayda 500 kilometre ilerleyip 10. İtalyan ' +
        'Ordusunu imha etti. 30.000 kişilik kuvvet, sayıca kat kat üstün ' +
        'bir orduyu dağıttı ve yaklaşık 130.000 esir aldı. Harekât ' +
        'düşman bittiği için değil, İngiliz ikmali Bingazi\'den öteye ' +
        'yetişmediği için durdu.',
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
        'Afrika Ordu Grubu teslim oldu. Esir sayısı kaynaklara göre ' +
        '230.000 ile 275.000 arasında verilir; her hâlükârda ' +
        'Stalingrad\'da alınan esirden fazladır — buna rağmen bu teslim ' +
        'çok daha az konuşulur. Akdeniz Müttefiklere açıldı ve Sicilya ' +
        'çıkarmasının yolu hazırlandı.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_beda_fomm',
      date: '1941-02-07',
      title: 'Beda Fomm — Ordunun Önünü Kesmek',
      body:
        '7. Zırhlı Tümen çölün içinden kestirme giderek çekilen İtalyan ' +
        'ordusunun kıyı yolundaki önünü kesti. Tek yol vardı, onu tutan ' +
        'orduyu teslim alıyordu: çölde arazi değil, YOL kazanılır.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_tobruk_kusatma',
      date: '1941-04-10',
      title: 'Tobruk Kuşatması Başladı',
      body:
        'Rommel Mısır sınırına dayandı ama Tobruk limanını alamadı ve ' +
        'arkasında bıraktı. 9. Avustralya Tümeni limanı 240 gün tuttu; ' +
        'Rommel ikmalini 1.500 kilometre uzaktaki Trablus\'tan çekmek ' +
        'zorunda kaldı. Alınmayan tek liman bütün taarruzu zayıflattı.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_battleaxe',
      date: '1941-06-15',
      title: 'Balta Harekâtı — Pahalı Ders',
      body:
        'Wavell, Tobruk\'u kurtarmak için erken taarruz etti. İngiliz ' +
        'tankları Halfaya\'da mevzilenmiş 88\'liklerin üstüne sürüldü ve ' +
        'iki günde yakıldı. Ders: zırhı topçu desteği olmadan tahkimli ' +
        'tanksavar hattına sürmek tümen harcar. Wavell görevden alındı.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_crusader',
      date: '1941-11-18',
      title: 'Haçlı Seferi Harekâtı',
      body:
        'Yeni kurulan 8. Ordu taarruz etti; muharebe öyle karıştı ki iki ' +
        'taraf da yenildiğini sandı. Auchinleck çekilmek isteyen ' +
        'Cunningham\'ı görevden alıp taarruzu sürdürdü, Tobruk kuşatması ' +
        'kalktı. Sinirini koruyan taraf kazandı.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_rommel_efsanesi',
      date: '1942-03-20',
      title: '"Rommel Doğaüstü Değildir"',
      body:
        'Auchinleck, komutanlarına yazılı bir genelge yollayıp askerin ' +
        'Rommel\'i olağanüstü bir varlık saymasını yasakladı: "ondan ' +
        'bahsederken \'düşman\' veya \'Mihver kuvvetleri\' deyin, Rommel ' +
        'demeyin." Çöl Tilkisi efsanesinin büyük kısmı, kendi yenilgisini ' +
        'açıklamak isteyen İngiliz basınının ürünüydü. Kaynaklar ' +
        'genelgenin tam gününde ayrışır; 1942 ilkbaharıdır.',
      kind: 'siyasi',
      src: KA,
    },
    {
      id: 'ka_malta_ikmal',
      date: '1942-08-15',
      title: 'Malta ve Boğulan Konvoylar',
      body:
        'Rommel\'in Mısır\'a ulaşamamasının sebebi İngiliz tümenleri ' +
        'değil, Malta\'dan kalkan uçak ve denizaltılardı: Libya\'ya giden ' +
        'yakıt ve mühimmat konvoyları yolda batırıldı. Ağustos 1942\'de ' +
        'Pedestal konvoyunun kalıntısı Malta\'ya ulaşınca ada ayakta ' +
        'kaldı ve ambargo sürdü. Çöldeki tank, limanda olmayan yakıt ' +
        'kadar menzillidir.',
      kind: 'ikmal',
      src: KA,
    },
    {
      id: 'ka_alam_el_halfa',
      date: '1942-08-30',
      title: 'Alam el Halfa — Rommel\'in Son Taarruzu',
      body:
        'Rommel güney kanadından son bir kuşatma denedi. Montgomery ' +
        'kanadı kovalamak yerine zırhını Alam el Halfa sırtına gömdü ve ' +
        'bekledi. Yakıtı biten Mihver zırhlısı geri döndü. Bundan sonra ' +
        'inisiyatif bir daha Mihver\'e geçmedi.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_sarkac',
      date: '1942-12-20',
      title: 'Çölün Sarkacı',
      body:
        'Cephe iki yılda dört kez aynı 1.200 kilometrelik kıyı şeridinde ' +
        'gidip geldi. Her ilerleyen taraf ikmal hattını uzattı, limana ' +
        'uzaklaştıkça zayıfladı; gerileyen taraf kendi depolarına ' +
        'yaklaştıkça güçlendi. Çölü general değil mesafe yönetti — ' +
        'muharebeler hep ikmalin bittiği yerde kazanıldı.',
      kind: 'ikmal',
      src: KA,
    },
    {
      id: 'ka_kasserine',
      date: '1943-02-19',
      title: 'Kasserine Geçidi',
      body:
        'Rommel, Tunus\'ta tecrübesiz II. Amerikan Kolordusu\'na vurdu ve ' +
        'onu onlarca kilometre geri attı — Amerikan ordusunun Avrupa ' +
        'sahnesindeki ilk büyük yenilgisi. Sonuç kalıcı olmadı: Müttefikler ' +
        'komutayı birleştirdi, Patton kolordunun başına geçti. Yenilgiden ' +
        'ders çıkarabilen ordu tehlikelidir.',
      kind: 'kara',
      src: KA,
    },
    {
      id: 'ka_mareth',
      date: '1943-03-20',
      title: 'Mareth Hattı',
      body:
        'Messe\'nin 1. İtalyan Ordusu, Fransızların Mareth\'te bıraktığı ' +
        'eski tahkimatta direndi; cepheden taarruz kırıldı. Montgomery ' +
        'ancak Yeni Zelanda kolunu çölden 300 kilometre dolandırıp ' +
        'kanada sarkıtınca hattı aştı. İtalyan askerinin kötü olduğu ' +
        'klişesi burada çöker.',
      kind: 'kara',
      src: KA,
    },
  ],
};
