import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Pasifik Savaşı — Pearl Harbor'dan teslime.
 *
 * Bu cephenin iki ayırt edici mekaniği var: okyanus ölçeğinde İKMAL
 * (yakıt, tersane, nakliye) ve ADA ÇIKARMASI (sahile bir günde sığan
 * kuvvet sınırlı, ikinci dalga ertesi gün). İçerik bu ikisini
 * olaylar üzerinden anlatacak biçimde yazıldı.
 */

const PS = 'https://tr.wikipedia.org/wiki/Pasifik_Cephesi';

const JP = 'Empire of Japan';
const US = 'United States';
const UK = 'United Kingdom';
const AU = 'Australia';
const CN = 'Chinese warlords';

export const PASIFIK_PACK: FrontPack = {
  theatre: 'ww2_pasifik',

  formations: [
    // ── Japonya ──
    { nation: JP, name: '14. Ordu — Filipinler', templateId: 'jp_piyade_tumen', at: [120.98, 14.60], arrivesOn: '1941-12-08', src: PS },
    { nation: JP, name: '25. Ordu — Malaya', templateId: 'jp_piyade_tumen', at: [102.25, 6.12], arrivesOn: '1941-12-08', src: PS },
    { nation: JP, name: '15. Ordu — Burma', templateId: 'jp_piyade_tumen', at: [98.50, 16.90], arrivesOn: '1942-01-20', src: PS },
    { nation: JP, name: '17. Ordu — Solomonlar', templateId: 'jp_piyade_tumen', at: [160.00, -9.43], arrivesOn: '1942-08-07', src: PS },
    { nation: JP, name: 'Rabaul Üssü', templateId: 'jp_piyade_tumen', at: [152.17, -4.20], arrivesOn: '1942-01-23', src: PS },
    { nation: JP, name: 'Tarawa Garnizonu — Betio', templateId: 'jp_piyade_tumen', at: [172.92, 1.36], arrivesOn: '1943-02-15', src: PS },
    { nation: JP, name: '31. Ordu — Saipan', templateId: 'jp_piyade_tumen', at: [145.75, 15.18], arrivesOn: '1944-03-01', src: PS },
    { nation: JP, name: 'Iwo Jima Garnizonu', templateId: 'jp_piyade_tumen', at: [141.33, 24.78], arrivesOn: '1944-06-01', src: PS },
    { nation: JP, name: '32. Ordu — Okinawa', templateId: 'jp_piyade_tumen', at: [127.80, 26.33], arrivesOn: '1944-03-22', src: PS },
    { nation: JP, name: '35. Ordu — Leyte', templateId: 'jp_piyade_tumen', at: [124.85, 10.95], arrivesOn: '1944-10-20', src: PS },

    // ── Müttefikler ──
    { nation: US, name: 'Pasifik Filosu — Pearl Harbor', templateId: 'us_piyade_tumen', at: [-157.95, 21.35], src: PS },
    { nation: US, name: 'Filipinler Ordusu — MacArthur', templateId: 'us_piyade_tumen', at: [120.60, 14.70], src: PS },
    { nation: US, name: '1. Deniz Piyade Tümeni', templateId: 'us_deniz_piyade', at: [160.08, -9.44], arrivesOn: '1942-08-07', src: PS },
    { nation: US, name: '2. Deniz Piyade Tümeni — Tarawa', templateId: 'us_deniz_piyade', at: [172.98, 1.33], arrivesOn: '1943-11-20', src: PS },
    { nation: US, name: '4. Deniz Piyade Tümeni — Saipan', templateId: 'us_deniz_piyade', at: [145.70, 15.22], arrivesOn: '1944-06-15', src: PS },
    { nation: US, name: '5. Deniz Piyade Tümeni — Iwo Jima', templateId: 'us_deniz_piyade', at: [141.31, 24.75], arrivesOn: '1945-02-19', src: PS },
    { nation: US, name: 'VI. Amerikan Kolordusu — Leyte', templateId: 'us_piyade_tumen', at: [124.99, 10.80], arrivesOn: '1944-10-20', src: PS },
    { nation: US, name: '10. Ordu — Okinawa', templateId: 'us_piyade_tumen', at: [127.75, 26.20], arrivesOn: '1945-04-01', src: PS },
    { nation: UK, name: 'Malaya Komutanlığı', templateId: 'uk_ww2_piyade', at: [103.82, 1.35], src: PS },
    { nation: UK, name: '14. Ordu — Burma', templateId: 'uk_ww2_piyade', at: [94.00, 24.80], arrivesOn: '1943-10-01', src: PS },
    { nation: AU, name: 'Avustralya 7. Tümeni', templateId: 'uk_ww2_piyade', at: [147.20, -9.44], arrivesOn: '1942-08-26', src: PS },
    { nation: CN, name: 'Çin Seferî Kuvveti — Yunnan', templateId: 'cn_piyade_tumen', at: [102.70, 25.05], arrivesOn: '1942-03-01', src: PS },
    { nation: CN, name: 'Çin 38. Tümeni — Kuzey Burma', templateId: 'cn_piyade_tumen', at: [96.40, 26.15], arrivesOn: '1943-10-20', src: PS },
  ],

  commanders: [
    // ── Japonya ──
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
      'ps_nagumo', 'Chuichi Nagumo', 'Koramiral', 'japon', 'ottoman', 'deniz',
      [5, 4, 4, 3], ['temkinli'], '1941-12-07',
      '1. Hava Filosu (Kido Butai) Komutanı. Pearl Harbor ve Hint ' +
      'Okyanusu baskınlarını yönetti; Midway\'de dört uçak gemisini ' +
      'kaybetti. Temmuz 1944\'te Saipan\'da intihar etti.',
      'Uçak gemisi kuvvetini iyi kullandı ama riskten kaçtı; üçüncü ' +
      'dalgayı göndermeyip yakıt ve tersaneyi bırakması tipik: ' +
      'planlama 4, lojistik 3.',
      PS, '1944-07-06',
    ),
    cmd(
      'yamashita', 'Tomoyuki Yamashita', 'Orgeneral', 'japon', 'ottoman', 'kara',
      [6, 5, 6, 3], ['taarruz_ruhu'], '1941-12-08',
      '25. Ordu Komutanı. Malaya\'yı 70 günde geçip 15 Şubat 1942\'de ' +
      'Singapur\'u aldı — kendisinden kalabalık bir garnizonu teslim ' +
      'almıştı. 1944\'te Filipinler savunmasına verildi.',
      '"Malaya Kaplanı": taarruz ve planlama 6, lojistik 3 — Malaya\'da ' +
      'mermisi bitmek üzereyken blöfle teslim aldı.',
      PS,
    ),
    cmd(
      'ps_homma', 'Masaharu Homma', 'Korgeneral', 'japon', 'ottoman', 'kara',
      [4, 4, 4, 3], ['temkinli'], '1941-12-08',
      '14. Ordu Komutanı; Filipinler\'i işgal etti. Bataan\'ı beklenenden ' +
      'geç düşürdüğü için gözden düştü. Esirlerin yürütülmesiyle ' +
      'sonuçlanan Bataan Ölüm Yürüyüşü\'nden savaş sonrası yargılanıp ' +
      'idam edildi.',
      'Takvimi tutturamadı, ikmal planı yetersizdi: lojistik 3.',
      PS, '1942-08-01',
    ),
    cmd(
      'ps_kurita', 'Takeo Kurita', 'Koramiral', 'japon', 'ottoman', 'deniz',
      [5, 4, 4, 3], ['temkinli'], '1944-06-19',
      'Merkez Kuvvet Komutanı. Leyte\'de Samar açıklarında savunmasız ' +
      'çıkarma filosuna ulaştı, sonra nedeni bugün bile tartışılan bir ' +
      'kararla geri döndü.',
      'Güçlü bir muharebe hattı komutanı, ama belirleyici anda temkin: ' +
      'taarruz 5, planlama 4.',
      PS,
    ),
    cmd(
      'ps_ozawa', 'Jisaburo Ozawa', 'Koramiral', 'japon', 'ottoman', 'deniz',
      [5, 4, 5, 3], ['atilgan_amiral'], '1944-06-19',
      'Japon uçak gemisi kuvvetinin son komutanı. Filipin Denizi\'nde ' +
      'uzak menzilden taarruz etmeye çalıştı, tecrübesiz pilotları ' +
      'kırıldı. Leyte\'de kendi gemilerini bilerek YEM olarak kullanıp ' +
      'Halsey\'i kuzeye çekti.',
      'Doğru taktiği elinde kalan kötü malzemeyle uyguladı: planlama 5.',
      PS,
    ),
    cmd(
      'ps_kuribayashi', 'Tadamichi Kuribayashi', 'Korgeneral', 'japon', 'ottoman', 'kara',
      [3, 7, 6, 4], ['inatci_savunma', 'siper_ustasi'], '1944-06-08',
      'Iwo Jima Garnizon Komutanı. Sahilde karşılama doktrinini bıraktı; ' +
      'adanın içine 18 km\'yi aşan tünel ve mağara ağı kazdırdı. ' +
      'Çıkarma kuvveti sahili aldı, ama asıl savunma içerideydi.',
      'Japon savunma anlayışını tersine çeviren adam: savunma 7, ' +
      'siper ustası — taarruz 3, çünkü karşı taarruzu yasaklamıştı.',
      PS, '1945-03-26',
    ),

    // ── Amerika ──
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
      'halsey', 'William Halsey', 'Oramiral', 'amerikan', 'entente', 'deniz',
      [6, 4, 4, 4], ['atilgan_amiral', 'israfci'], '1942-10-18',
      'Güney Pasifik Komutanı, sonra 3. Filo. Guadalcanal\'da inisiyatifi ' +
      'aldı; Leyte\'de Japon yem filosunun peşine düşüp çıkarma sahasını ' +
      'açıkta bıraktı.',
      'Saldırganlık hem kazandırdı hem riske attı: taarruz 6.',
      PS,
    ),
    cmd(
      'ps_spruance', 'Raymond Spruance', 'Oramiral', 'amerikan', 'entente', 'deniz',
      [5, 6, 7, 5], ['temkinli', 'atilgan_amiral'], '1942-06-04',
      'Midway\'de görev kuvvetini yönetti; Filipin Denizi\'nde filosunu ' +
      'çıkarma sahasına bağlı tuttu ve Japon hava kolunun kendi üzerine ' +
      'gelmesini bekledi. Eleştirildi, ama Saipan güvende kaldı.',
      'Soğukkanlı hesap adamı: planlama 7, savunma 6 — görevi korumayı ' +
      'avı kovalamaya tercih etti.',
      PS,
    ),
    cmd(
      'ps_fletcher', 'Frank Jack Fletcher', 'Koramiral', 'amerikan', 'entente', 'deniz',
      [4, 5, 5, 4], ['temkinli'], '1942-05-04',
      'Mercan Denizi ve Midway\'de uçak gemisi görev kuvvetlerine komuta ' +
      'etti. Guadalcanal\'da uçak gemilerini erken çekmesi, karaya çıkan ' +
      'deniz piyadesini günlerce havasız ve ikmalsiz bıraktı.',
      'Tedbirli ve dengeli, ama çıkarma desteğini kesmesi pahalıya ' +
      'patladı: lojistik 4.',
      PS, '1942-08-09',
    ),
    cmd(
      'ps_turner', 'Richmond Kelly Turner', 'Koramiral', 'amerikan', 'entente', 'deniz',
      [4, 5, 6, 7], ['cikarma_uzmani', 'lojistikci'], '1942-08-07',
      'Amfibi Kuvvetler Komutanı. Guadalcanal\'dan Okinawa\'ya kadar ' +
      'neredeyse bütün büyük çıkarmaların nakliye, yükleme ve sahil ' +
      'başı düzenini kurdu.',
      'Pasifik\'te asıl zor iş buydu: lojistik 7, çıkarma uzmanı.',
      PS,
    ),
    cmd(
      'ps_hsmith', 'Holland M. Smith', 'Orgeneral', 'amerikan', 'entente', 'kara',
      [6, 4, 5, 4], ['cikarma_uzmani', 'taarruz_ruhu'], '1943-11-20',
      '"Deli Holland". Amerikan amfibi doktrininin kurucusu; Tarawa, ' +
      'Saipan ve Iwo Jima çıkarmalarında kara kuvvetlerine komuta etti. ' +
      'Tarawa\'nın kanlı dersleri doğrudan onun elinde doktrine çevrildi.',
      'Çıkarma uzmanı, kayıp pahasına hız: taarruz 6, savunma 4.',
      PS,
    ),

    // ── Britanya ve Çin ──
    cmd(
      'ps_percival', 'Arthur Percival', 'Korgeneral', 'ingiliz', 'entente', 'kara',
      [2, 3, 3, 3], ['temkinli'], '1941-12-08',
      'Malaya Komutanı. Singapur\'un kara tarafına tahkimat yapılmasını ' +
      'moral bozar diye geciktirdi; ada, toplar denize bakarken karadan ' +
      'alındı. 15 Şubat 1942\'de 80 binin üzerinde askerle teslim oldu.',
      'Yetersiz hava ve zırh desteğiyle zor bir görevdi, ama kararları ' +
      'durumu ağırlaştırdı: bütün puanlar düşük.',
      PS, '1942-02-15',
    ),
    cmd(
      'ps_slim', 'William Slim', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [5, 6, 6, 7], ['lojistikci', 'ilham_veren', 'inatci_savunma'], '1943-10-15',
      '14. Ordu ("Unutulmuş Ordu") Komutanı. Imphal-Kohima\'da Japon ' +
      'taarruzunu kırdı, kuşatılan birlikleri havadan besledi ve ' +
      '1945\'te Burma\'yı geri aldı. Japonları karada ilk kez büyük ' +
      'ölçekte yenen komutandır.',
      'Asıl marifeti ikmal ve moral: lojistik 7, planlama ve savunma 6.',
      PS,
    ),
    cmd(
      'ps_cankaysek', 'Çan Kay-şek', 'Mareşal', 'cinli', 'entente', 'siyasi',
      [3, 5, 4, 3], ['inatci_savunma', 'temkinli'], '1941-12-08',
      'Çin Cumhuriyeti lideri ve Müttefik Çin Harekât Alanı Başkomutanı. ' +
      'Japon ordusunun büyük kısmını yıllarca Çin\'de bağlı tuttu; ' +
      'Burma Yolu kesilince ikmali "Hörgüç" hava köprüsüne kaldı.',
      'Siyasi ağırlığı askerî kapasitesinden büyüktü; kuvvetini ' +
      'harcamamak için saklaması: savunma 5, taarruz 3.',
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
      id: 'ps_ucuncu_dalga',
      date: '1941-12-08',
      title: 'Gönderilmeyen Üçüncü Dalga',
      body:
        'Nagumo, karşı taarruz riskini gerekçe göstererek üçüncü dalgayı ' +
        'iptal etti. Limandaki akaryakıt depoları ve kuru havuzlar ayakta ' +
        'kaldı; filo Hawaii\'de kalabildi, batan gemiler yerinde onarıldı. ' +
        'Vurulsalardı üs Batı Yakası\'na çekilecek, Pasifik harekâtları ' +
        'binlerce kilometre uzaktan beslenecekti. Baskın taktik zafer, ' +
        'stratejik felaketti — oyunda ikmal mekaniği bu farkı birebir ' +
        'ölçer.',
      kind: 'ikmal',
      src: PS,
    },
    {
      id: 'ps_singapur',
      date: '1942-02-15',
      title: 'Singapur Düştü',
      body:
        'Yamashita\'nın 25. Ordusu Malaya yarımadasını 70 günde geçti ve ' +
        'kendisinden kalabalık garnizonu karadan kuşatıp teslim aldı; ' +
        'üstelik topçu mermisi tükenmek üzereydi. Churchill bunu ' +
        '"İngiliz tarihinin en büyük felaketi" diye andı: savunma denize ' +
        'bakacak şekilde kurulmuştu, saldırı ormandan geldi.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_bataan',
      date: '1942-04-09',
      title: 'Bataan Düştü — Ölüm Yürüyüşü',
      body:
        'Filipinler\'de yarımadaya sıkışan kuvvet, erzağı bitince teslim ' +
        'oldu. Japonlar bu kadar esir beklemiyordu; on binlerce Amerikalı ' +
        've Filipinli yüz kilometreyi aşan yolu susuz yürütüldü, ölü ' +
        'sayısı kaynaklara göre birkaç binden on bine kadar değişiyor — ' +
        'rakamlar çelişkilidir. İkmal hesabı yapılmamış bir zaferin ' +
        'bedelini esirler ödedi.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_mercan',
      date: '1942-05-07',
      title: 'Mercan Denizi — Gemiler Birbirini Görmedi',
      body:
        'Tarihin ilk uçak gemisi muharebesi: iki filo da karşı tarafın ' +
        'silüetini görmeden, yalnız uçaklarıyla dövüştü. Taktik olarak ' +
        'berabere sayılsa da Port Moresby çıkarması iptal edildi ve iki ' +
        'Japon uçak gemisi Midway\'e yetişemedi. Deniz savaşının menzili ' +
        'top namlusundan uçak yarıçapına geçmişti.',
      kind: 'deniz',
      src: PS,
    },
    {
      id: 'ps_midway',
      date: '1942-06-04',
      title: 'Midway — Dönüm Noktası',
      body:
        'Amerikan kriptanalizi Japon harekât planını çözmüştü. Nimitz ' +
        'sayıca üstün filoya pusu kurdu; Japonya dört uçak gemisini ve ' +
        'eğitimli pilot kadrosunun önemli kısmını kaybetti. Gemi ' +
        'yapılabilir, altı ay eğitilmiş pilot yapılamazdı: Pasifik\'te ' +
        'inisiyatif kalıcı olarak el değiştirdi.',
      kind: 'deniz',
      src: PS,
    },
    {
      id: 'ps_guadalcanal',
      date: '1942-08-07',
      title: 'Guadalcanal — İlk Karşı Taarruz',
      body:
        '1. Deniz Piyade Tümeni adaya çıktı. Uçak gemileri erken çekilince ' +
        'nakliye gemileri yükü boşaltmadan ayrıldı; piyade günlerce yarım ' +
        'ikmalle savaştı. Altı ay süren kara, deniz ve hava muharebeleri ' +
        'Japonya\'ya yerine koyamayacağı gemi, uçak ve pilot kaybettirdi.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_tarawa',
      date: '1943-11-20',
      title: 'Tarawa — Gelgit Yanlış Hesaplandı',
      body:
        'Betio adacığı üç kilometrekareden küçüktü ama tahkimliydi. ' +
        'Çıkarma araçları mercan resifine oturdu; beklenen gelgit ' +
        'yükselmedi ve deniz piyadeleri yüzlerce metreyi göğüs hizası ' +
        'suda, makineli ateşi altında yürüdü. Üç günde binden fazla ölü. ' +
        'Ders: sahile bir günde sığan kuvvet sınırlıdır, ikinci dalga ' +
        'ertesi gün gelir ve tahkimli sahil kaybı katlar — çıkarma, ' +
        'kara muharebesinin değil ayrı bir harekâtın kurallarıyla işler.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_saipan',
      date: '1944-06-15',
      title: 'Saipan — Anavatan Menzile Girdi',
      body:
        'Marianalar\'ın alınması B-29\'ların Japon anakarasını gidiş-dönüş ' +
        'bombalayabilmesi demekti. Saipan düşünce Tojo hükümeti istifa ' +
        'etti. Ada savaşı sivillerin uçurumdan atlamasıyla biten bir ' +
        'çöküşe dönüştü.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_filipin_denizi',
      date: '1944-06-19',
      title: 'Filipin Denizi — "Büyük Marianalar Hindi Avı"',
      body:
        'Ozawa uzak menzilden dalga dalga uçak gönderdi; radar, yakın ' +
        'tapalı mermi ve tecrübeli Amerikan avcıları karşısında Japon hava ' +
        'kolu bir günde eridi. Spruance filoyu çıkarma sahasından ' +
        'ayırmadı: Japon donanmasını kovalamak yerine Saipan\'ı korudu.',
      kind: 'deniz',
      src: PS,
    },
    {
      id: 'ps_leyte',
      date: '1944-10-23',
      title: 'Leyte Körfezi',
      body:
        'Tarihin en büyük deniz muharebesi. Ozawa\'nın yem filosu Halsey\'i ' +
        'kuzeye çekti, Kurita savunmasız çıkarma gemilerine ulaştı ama ' +
        'geri döndü. Japon donanması bir daha toparlanamadı; burada ' +
        'kamikaze ilk kez örgütlü biçimde kullanıldı — uçağı geri ' +
        'getirmeyi hesaba katmayan bir ülke, pilotunu da hesaba katmıyor ' +
        'demekti.',
      kind: 'deniz',
      src: PS,
    },
    {
      id: 'ps_iwojima',
      date: '1945-02-19',
      title: 'Iwo Jima',
      body:
        'Kuribayashi sahilde karşılamayı bıraktı, adanın içini tünel ağına ' +
        'çevirdi. Günlerce süren bombardıman kazılı mevzilere işlemedi; ' +
        'çıkarma kuvveti volkanik kumda ilerleyemedi, ağır silah ve ikmal ' +
        'ancak sonraki dalgalarla gelebildi. Beş günde alınması planlanan ' +
        'ada beş hafta sürdü.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_tokyo_yangin',
      date: '1945-03-09',
      title: 'Tokyo Yangın Bombardımanı',
      body:
        'B-29\'lar yüksek irtifa hassas bombardımanı bırakıp alçaktan ' +
        'yangın bombası attı. Ahşap şehir bir gecede yandı; ölü sayısı ' +
        'kaynaklara göre 80 binden 100 binin üzerine kadar veriliyor. ' +
        'Tek bir gecede, sonraki atom bombalarının her birinden fazla ' +
        'insan öldü.',
      kind: 'hava',
      src: PS,
    },
    {
      id: 'ps_okinawa',
      date: '1945-04-01',
      title: 'Okinawa',
      body:
        'Pasifik\'in en kanlı çıkarması. Japonlar yine sahili boş bıraktı, ' +
        'güneydeki tahkimli hatta tutundu; kamikaze dalgaları donanmaya ' +
        'ağır kayıp verdirdi. Bilanço, anavatana yapılacak çıkarmanın ' +
        'maliyeti hesaplanırken belirleyici argüman oldu.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_burma_geri',
      date: '1945-05-03',
      title: 'Rangoon Geri Alındı — Unutulmuş Ordu',
      body:
        'Slim\'in 14. Ordusu Imphal-Kohima\'da kırdığı Japon taarruzunun ' +
        'ardından Burma\'yı boydan boya geçti. Havadan ikmal, muson ' +
        'planlaması ve çok uluslu bir ordunun morali bu zaferin asıl ' +
        'sebebiydi — Japon ordusu karada ilk kez büyük ölçekte yenilmişti.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_hirosima',
      date: '1945-08-06',
      title: 'Hiroşima ve Nagasaki',
      body:
        'Hiroşima 6 Ağustos\'ta, Nagasaki 9 Ağustos\'ta atom bombasıyla ' +
        'vuruldu. Anında ölü sayıları kaynaklar arasında büyük farkla ' +
        'veriliyor; radyasyon ölümleriyle toplam rakam yıllara yayılır. ' +
        'Tek uçağın bir şehri silebilmesi, savaşın hesabını tamamen ' +
        'değiştirdi.',
      kind: 'hava',
      src: PS,
    },
    {
      id: 'ps_mancurya',
      date: '1945-08-09',
      title: 'Sovyet Mançurya Harekâtı',
      body:
        'Kızıl Ordu üç cepheden Kwantung Ordusu\'na girdi ve savunmayı ' +
        'günler içinde dağıttı. Japonya\'nın savaşı Moskova aracılığıyla ' +
        'müzakereyle bitirme umudu böylece yok oldu; Tokyo\'daki teslim ' +
        'kararında bombalar kadar bu darbenin de payı olduğu tartışılır.',
      kind: 'kara',
      src: PS,
    },
    {
      id: 'ps_teslim',
      date: '1945-09-02',
      title: 'Teslim — Tokyo Körfezi',
      body:
        'Japonya teslim belgesini USS Missouri\'de imzaladı. Dört yıl önce ' +
        'Pearl Harbor\'da batırılan gemilerin çoğu onarılıp bu savaşta ' +
        'çarpışmıştı; vurulmayan tersaneler kadar iyi bir özet yok. ' +
        'İkinci Dünya Savaşı sona erdi.',
      kind: 'siyasi',
      src: PS,
    },
  ],
};
