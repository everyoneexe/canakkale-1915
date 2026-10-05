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
      'b40_rundstedt', 'Gerd von Rundstedt', 'Mareşal', 'alman', 'ottoman', 'kara',
      [5, 6, 6, 5], ['agir_kanli', 'temkinli'], '1940-05-10',
      'A Ordular Grubu Komutanı. Sichelschnitt\'in asıl darbesini taşıyan ' +
      'kuvvet onundu. 24 Mayıs\'ta panzerlerin Dunkerque önünde durdurulmasını ' +
      'isteyen de oydu: zırhlısı yıpranmıştı ve asıl seferin ikinci yarısını ' +
      '(Fall Rot) düşünüyordu.',
      'Harekâtı yürüten baş akıl ama kritik anda ihtiyatlı: planlama 6, taarruz 5.',
      B40,
    ),
    cmd(
      'b40_bock', 'Fedor von Bock', 'Mareşal', 'alman', 'ottoman', 'kara',
      [5, 4, 5, 4], ['taarruz_ruhu'], '1940-05-10',
      'B Ordular Grubu Komutanı. Hollanda ve Belçika\'ya giren kuvvet. Görevi ' +
      'toprak almak değil, müttefik en iyi ordularını kuzeye çekip orada ' +
      'tutmaktı — matadorun kırmızı bezi.',
      'Aldatma darbesini inandırıcı kıldı: taarruz 5, planlama 5.',
      B40,
    ),
    cmd(
      'manstein', 'Erich von Manstein', 'Korgeneral', 'alman', 'ottoman', 'kara',
      [6, 5, 7, 4], ['taarruz_ruhu'], '1940-05-10',
      'Sichelschnitt planının yazarı. Ana darbeyi Belçika ovasından alıp ' +
      'geçilmez sayılan Ardennes ormanına kaydırdı. Genelkurmay planı ' +
      'reddedince ısrarı yüzünden kolordu komutanlığına sürüldü; plan ancak ' +
      'Hitler\'e doğrudan anlatılınca kabul edildi.',
      'Savaşın en etkili harekât planı: planlama 7.',
      B40,
    ),
    cmd(
      'guderian_1940', 'Heinz Guderian', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 3, 6, 4], ['taarruz_ruhu', 'israfci'], '1940-05-10',
      'XIX. Panzer Kolordusu Komutanı. 13 Mayıs\'ta Sedan\'da Meuse\'u geçti, ' +
      '20 Mayıs\'ta Manş kıyısına ulaştı. Üstlerinin "dur, yanları emniyete al" ' +
      'emirlerini defalarca esnetti; bir kez istifa edip geri alındı.',
      'On günde 400 kilometre: taarruz 6, savunma 3.',
      B40,
    ),
    cmd(
      'b40_kleist', 'Ewald von Kleist', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [5, 4, 5, 5], ['lojistikci'], '1940-05-10',
      'Kleist Panzer Grubu Komutanı — tarihin ilk ordu ölçeğinde zırhlı ' +
      'teşkili. 41.000 araçlık kol Ardennes\'in dar yollarında 250 kilometrelik ' +
      'bir tıkanıklık yaptı; onu akıtmak muharebe kadar zordu.',
      'Asıl başarısı sevk ve idare: lojistik 5.',
      B40,
    ),
    cmd(
      'b40_kesselring', 'Albert Kesselring', 'Orgeneral', 'alman', 'ottoman', 'siyasi',
      [5, 4, 5, 5], ['lojistikci', 'top_atisi'], '1940-05-10',
      '2. Hava Filosu Komutanı. Hollanda\'daki hava indirmelerini ve Sedan\'da ' +
      'topçu yerine kullanılan Stuka dalgalarını yönetti. Rotterdam ' +
      'bombardımanı da onun filosunun işiydi.',
      'Hava gücünü yürüyen topçu gibi kullandı: lojistik 5, top atışı.',
      B40,
    ),
    cmd(
      'rommel_1940', 'Erwin Rommel', 'Tümgeneral', 'alman', 'ottoman', 'kara',
      [6, 4, 5, 3], ['taarruz_ruhu', 'ilham_veren'], '1940-05-10',
      '7. Panzer Tümeni Komutanı. O kadar hızlı ilerledi ki kendi karargâhı ' +
      'bile yerini kaybetti; tümen "Hayalet Tümen" (Gespensterdivision) diye ' +
      'anıldı. Arras\'ta İngiliz Matilda tanklarını ancak 88\'lik uçaksavarları ' +
      'alçaltıp doğrudan atışa geçirerek durdurabildi.',
      'Hızı bir silah olarak kullandı: taarruz 6; yanlarını açıkta bıraktığı ' +
      'için savunma 4.',
      B40,
    ),

    cmd(
      'gamelin', 'Maurice Gamelin', 'Orgeneral', 'fransiz', 'entente', 'kara',
      [2, 3, 2, 3], ['agir_kanli'], '1940-05-10',
      'Fransız Başkomutanı. En iyi birlikleri Belçika\'ya sürdü, ihtiyat ' +
      'bırakmadı. Vincennes\'teki karargâhında telsiz yoktu; emirler ' +
      'motosikletli ulakla gidiyordu. 19 Mayıs\'ta görevden alındı.',
      'Yarmaya karşı ihtiyatı yoktu ve karar döngüsü günlerle ölçülüyordu: ' +
      'planlama 2.',
      B40, '1940-05-19',
    ),
    cmd(
      'b40_georges', 'Alphonse Georges', 'Orgeneral', 'fransiz', 'entente', 'kara',
      [3, 4, 3, 3], ['temkinli'], '1940-05-10',
      'Kuzeydoğu Cephesi Komutanı — Gamelin ile arasındaki yetki bulanıklığı ' +
      'Fransız komuta zincirinin iki başlı çalışmasına yol açtı. Sedan ' +
      'haberini aldığında çöktüğü, kurmaylarının önünde ağladığı aktarılır.',
      'Doğru teşhis koyup emir verecek yetkisi yoktu: planlama 3.',
      B40,
    ),
    cmd(
      'b40_billotte', 'Gaston Billotte', 'Orgeneral', 'fransiz', 'entente', 'kara',
      [3, 4, 3, 3], ['temkinli'], '1940-05-10',
      '1. Ordular Grubu Komutanı ve kuzeydeki Fransız-İngiliz-Belçika ' +
      'kuvvetlerinin eşgüdümünden sorumlu kişi. 21 Mayıs\'ta bir trafik ' +
      'kazasında ağır yaralanıp öldü; yerine üç gün kimse atanmadı ve ' +
      'kuşatılmış ordular tam da karşı taarruz anında başsız kaldı.',
      'Eşgüdüm görevi kâğıt üstünde kaldı: planlama 3.',
      B40, '1940-05-23',
    ),
    cmd(
      'weygand', 'Maxime Weygand', 'Orgeneral', 'fransiz', 'entente', 'kara',
      [3, 5, 4, 3], ['inatci_savunma'], '1940-05-19',
      'Gamelin\'in yerine başkomutan. Somme-Aisne boyunca "Weygand Hattı"nı ' +
      'kurdu: sürekli siper yerine kirpi gibi tahkim edilmiş köy düğümleri. ' +
      'Hat 5 Haziran\'da yarıldı.',
      'Geç kalmış ama doğru bir savunma düzeni: savunma 5.',
      B40,
    ),
    cmd(
      'b40_degaulle', 'Charles de Gaulle', 'Tuğgeneral', 'fransiz', 'entente', 'kara',
      [5, 3, 5, 2], ['taarruz_ruhu'], '1940-05-15',
      '4. Zırhlı Tümen Komutanı. 17 Mayıs\'ta Montcornet\'te Guderian\'ın ' +
      'açıkta kalan yanına vurdu — Fransız tarafının zırhı yoğunlaştırarak ' +
      'yaptığı tek ciddi karşı taarruz. Tümen yarım kurulmuş, hava ' +
      'desteksizdi; taarruz ancak bir günlük sarsıntı yarattı.',
      'Doğru fikir, yetersiz araç: taarruz 5, lojistik 2.',
      B40,
    ),

    cmd(
      'gort', 'Lord Gort', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [3, 5, 5, 4], ['temkinli'], '1940-05-10',
      'İngiliz Sefer Kuvveti Komutanı. 25 Mayıs\'ta kuşatmayı görüp Weygand\'ın ' +
      'güneye karşı taarruz planını bıraktı ve iki tümeni güneye değil ' +
      'Belçika ordusunun açılan yanına kaydırarak Dunkerque koridorunu ' +
      'açık tuttu.',
      'Emre aykırı ama doğru tek karar: planlama 5, savunma 5.',
      B40,
    ),
    cmd(
      'b40_ramsay', 'Bertram Ramsay', 'Koramiral', 'ingiliz', 'entente', 'deniz',
      [3, 5, 6, 6], ['lojistikci', 'sahil_savunmasi'], '1940-05-20',
      'Dover\'daki tebeşir kayalarına oyulmuş karargâhtan Dinamo Harekâtı\'nı ' +
      'yönetti. Yıkıcılardan balıkçı teknesine kadar 800\'ü aşkın tekneyi dokuz ' +
      'gün boyunca dalgalar hâlinde sevk etti.',
      'Saf lojistik ve zaman yönetimi başarısı: planlama 6, lojistik 6.',
      B40,
    ),
    cmd(
      'b40_dowding', 'Hugh Dowding', 'Orgeneral', 'ingiliz', 'entente', 'siyasi',
      [2, 6, 7, 5], ['inatci_savunma', 'agir_kanli'], '1940-05-10',
      'İngiliz Avcı Komutanlığı\'nın başı. Fransa\'nın ısrarla istediği ek ' +
      'Hurricane filolarını göndermeyi reddetti; 16 Mayıs\'ta Savaş Kabinesi\'ne ' +
      'yazdığı mektupta "bu filolar da gönderilirse adanın savunması çöker" ' +
      'dedi. Fransa\'da kaybedilen uçakları saymak için kullandığı kayıt ' +
      'eğrisi, kararın matematiğini gösteriyordu.',
      'Taarruz değeri yok ama Britanya Muharebesi\'ni kazandıran kuvvet ' +
      'muhafazası: planlama 7, savunma 6.',
      B40,
    ),

    cmd(
      'b40_leopold', 'III. Leopold', 'Kral', 'belcika', 'entente', 'siyasi',
      [2, 4, 3, 3], ['inatci_savunma'], '1940-05-10',
      'Belçika Kralı ve ordusunun başkomutanı. Savaş öncesi tarafsızlık ' +
      'politikası yüzünden Fransız-İngiliz kurmaylarıyla ortak plan ' +
      'yapılamamıştı; müttefikler Belçika topraklarına ancak taarruz ' +
      'başlayınca girebildi. 28 Mayıs\'ta hükûmetine rağmen kayıtsız şartsız ' +
      'teslim oldu ve ülkede kaldı.',
      'Ordusu 18 gün dayandı ama siyasi eşgüdüm sıfırdı: planlama 3.',
      B40, '1940-05-28',
    ),
    cmd(
      'b40_winkelman', 'Henri Winkelman', 'Orgeneral', 'belcika', 'entente', 'kara',
      [2, 4, 3, 3], ['inatci_savunma', 'sahil_savunmasi'], '1940-05-10',
      'Hollanda Başkomutanı. Su baskını hatlarına (Hollanda Su Hattı) ' +
      'güveniyordu; ama Alman paraşütçüleri hattın gerisine, köprülerin ' +
      'üstüne indi. Rotterdam bombardımanından ve diğer şehirlerin de ' +
      'bombalanacağı tehdidinden sonra 15 Mayıs\'ta teslim oldu.',
      'Doğru savunma fikri hava indirmesiyle baypas edildi: savunma 4.',
      B40, '1940-05-15',
    ),
  ],

  events: [
    {
      id: 'b40_10mayis',
      date: '1940-05-10',
      title: '10 MAYIS — Batı Taarruzu',
      body:
        'Almanya Hollanda, Belçika ve Lüksemburg\'a girdi. Müttefikler bunu ' +
        '1914\'ün tekrarı sanıp en iyi ve en hareketli birliklerini Dyle ' +
        'hattına, Belçika içlerine sürdü — tam da planın istediği buydu. ' +
        'Kuzeye ne kadar çok kuvvet girerse, güneydeki tuzak o kadar derin ' +
        'kapanacaktı.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_eben_emael',
      date: '1940-05-10',
      title: 'Eben-Emael — 78 Adam Bir Kaleyi Aldı',
      body:
        'Avrupa\'nın en modern istihkâmı sayılan Eben-Emael, planörle çatısına ' +
        'inen yaklaşık 78 kişilik Alman istihkâm müfrezesi tarafından bir ' +
        'günde etkisiz bırakıldı; kuleler yeni geliştirilen biçimli şarjlı ' +
        '(hollow charge) patlayıcılarla delindi. Ders: bir tahkimat ancak ' +
        'üstünden gelinemeyeceği varsayımı kadar güçlüdür.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_ardennes',
      date: '1940-05-12',
      title: 'Ardennes — "Geçilmez" Varsayımı',
      body:
        'Fransız doktrini Ardennes\'i büyük zırhlı birliklere kapalı sayıyor, ' +
        'oraya ikinci sınıf tümenler koyuyordu. Kleist Panzer Grubu\'nun ' +
        '41.000 aracı ormanın dar yollarında Ren\'e kadar uzanan dev bir ' +
        'kuyruk oluşturdu — havadan vurulsa felaket olurdu, ama kimse ' +
        'bakmıyordu. Asıl hata tankta değil, bir varsayımı denetlememektedir.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_sedan',
      date: '1940-05-13',
      title: 'Sedan — Meuse Geçildi',
      body:
        'Guderian\'ın panzerleri Sedan\'da Meuse nehrini geçip Fransız 2. ve ' +
        '9. Ordularının eklem yerini yardı. Ağır topçu beklemek yerine ' +
        'saatler süren kesintisiz Stuka dalgaları kullanıldı: bunun asıl ' +
        'etkisi öldürmek değil, mevzideki topçu gözetleyicilerini sersemletip ' +
        'karşı atışı kesmekti.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_rotterdam',
      date: '1940-05-14',
      title: 'Rotterdam Bombardımanı',
      body:
        'Teslim görüşmeleri sürerken Alman bombardıman uçakları şehir ' +
        'merkezini vurdu; geri çağırma işareti filonun bir kısmına ' +
        'ulaşmadı. Yaklaşık 850 sivil öldü, şehrin merkezi yandı. Baskı ' +
        'aracı olarak şehir bombalamanın savaşa girişiydi.',
      kind: 'hava',
      src: B40,
    },
    {
      id: 'b40_hollanda_teslim',
      date: '1940-05-15',
      title: 'Hollanda Teslim Oldu',
      body:
        'Winkelman beş günde teslim oldu: su baskını hatları sağlamdı ama ' +
        'paraşütçüler hattın gerisine, köprülerin üstüne inmişti ve diğer ' +
        'şehirlerin de Rotterdam gibi bombalanacağı bildirilmişti. Kraliçe ' +
        'Wilhelmina ve hükûmet Londra\'ya geçti; Hollanda donanması ve ' +
        'sömürgeleri savaşta kaldı.',
      kind: 'siyasi',
      src: B40,
    },
    {
      id: 'b40_tank_dersi',
      date: '1940-05-16',
      title: 'Tank Sayısı Değil, Telsiz ve Yığınak',
      body:
        'Fransa yenilgisi sayı ya da tank eksikliğinden değildi. Char B1 bis ' +
        've Somua S35 zırh kalınlığı ve top gücü bakımından Panzer III ve ' +
        'IV\'ten üstündü; Hannut\'ta Alman tankları Somua\'ları karşılarında ' +
        'çaresiz kaldı. Fark üç yerdeydi: Fransız tanklarının çoğunda telsiz ' +
        'yoktu, çoğu tek kişilik kulede hem nişancı hem komutan olan bir ' +
        'adam vardı, ve tanklar piyade tümenlerine dağıtılmıştı. Almanlar ' +
        'aynı tankları tek bir yere yığdı ve telsizle yönetti. Üstünlük ' +
        'malzemede değil, örgütlenme ve karar hızındaydı.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_montcornet',
      date: '1940-05-17',
      title: 'Montcornet — de Gaulle\'ün Karşı Taarruzu',
      body:
        'de Gaulle yarı kurulmuş 4. Zırhlı Tümeni ile Guderian\'ın uzamış ' +
        'yanına vurdu ve birkaç kilometre ilerledi. Hava desteği, piyadesi ve ' +
        'ikmali olmadığı için geri çekilmek zorunda kaldı. Yoğunlaştırılmış ' +
        'zırhın doğru fikir olduğunu kanıtladı — ama Fransız ordusunda bunu ' +
        'yapabilecek başka teşkil yoktu.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_mans',
      date: '1940-05-20',
      title: 'Manş\'a Ulaşıldı — BEF Kesildi',
      body:
        'Zırhlı kol on günde 400 kilometre ilerleyip Abbeville\'de denize ' +
        'ulaştı. Belçika\'daki bütün müttefik ordular — BEF, Fransız 1. ve ' +
        '7. Ordular, Belçika ordusu — ikmal hatlarından ve güneydeki ana ' +
        'kuvvetten koparıldı. Orak kesmişti.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_arras',
      date: '1940-05-21',
      title: 'Arras — Ağır Zırhın Şoku',
      body:
        'İki İngiliz tabur değerindeki Matilda tankı Rommel\'in 7. Panzer ' +
        'Tümeni\'nin yanına vurdu. Alman tanksavar topları Matilda\'nın ' +
        'zırhını delemedi; hat ancak 88\'lik uçaksavarlar doğrudan atışa ' +
        'geçirilerek tutuldu. Taarruz küçüktü ama Alman üst komutasında ' +
        '"yanlarımız açık" paniği yarattı — üç gün sonraki durdurma emrinin ' +
        'psikolojik sebeplerinden biri.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_durdurma',
      date: '1940-05-24',
      title: 'Durdurma Emri — Dunkerque\'ün Sebebi',
      body:
        'Panzerler Dunkerque\'e 20 kilometre yaklaşmışken durduruldu. ' +
        'Gerekçeler birikmişti: Rundstedt zırhlısını Fall Rot için korumak ' +
        'istiyordu, Flandre\'ın bataklık arazisi tanka elverişsiz sayılıyordu, ' +
        'Arras şoku tazeydi ve Göring işi Luftwaffe\'nin bitirebileceğini ' +
        'söylemişti. Emrin kaynağı ve ağırlığı kaynaklarda hâlâ tartışmalı: ' +
        'kimi Hitler\'i, kimi Rundstedt\'i belirleyici sayar. Üç günlük duraklama ' +
        'tahliyeyi mümkün kıldı.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_dunkerque',
      date: '1940-05-26',
      title: 'Dinamo Harekâtı',
      body:
        'Ramsay\'in yönettiği harekât 26 Mayıs - 4 Haziran arasında 338.226 ' +
        'askeri (yaklaşık 198.000 İngiliz, 140.000 Fransız ve Belçikalı) ' +
        'tahliye etti; başlangıçta umut edilen rakam 45.000\'di. Ağır ' +
        'silahların tamamı sahilde bırakıldı. Churchill, "tahliyelerle savaş ' +
        'kazanılmaz" dedi — ama kazanılmayan savaş için eğitimli bir ordu ' +
        'kurtarılmıştı.',
      kind: 'deniz',
      src: B40,
    },
    {
      id: 'b40_belcika_teslim',
      date: '1940-05-28',
      title: 'Belçika Teslim Oldu',
      body:
        'III. Leopold 18 günlük direnişin ardından kayıtsız şartsız teslim ' +
        'oldu. Belçika ordusunun çekilmesi BEF\'in kuzeydoğu yanında 30 ' +
        'kilometrelik bir boşluk açtı; Gort bu boşluğu güneye taarruz için ' +
        'ayırdığı iki tümenle kapattı. Tahliye koridoru bu yüzden ayakta kaldı.',
      kind: 'siyasi',
      src: B40,
    },
    {
      id: 'b40_fall_rot',
      date: '1940-06-05',
      title: 'Fall Rot — İkinci Sefer Başladı',
      body:
        'Almanlar Somme-Aisne\'de Weygand Hattı\'na yüklendi. Fransızlar artık ' +
        'en iyi 60 küsur tümenini kuzeyde kaybetmişti; kalan kuvvet 650 ' +
        'kilometrelik cepheyi ihtiyatsız tutuyordu. "Kirpi" savunma düğümleri ' +
        'birkaç gün direndi, sonra aralardan sızıldı.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_italya',
      date: '1940-06-10',
      title: 'İtalya Savaşa Girdi',
      body:
        'Mussolini Fransa çökerken savaşa girdi; Alpler\'de 21 Haziran\'da ' +
        'başlattığı taarruz dağ geçitlerinde çok az ilerleme sağladı ve ' +
        'İtalyan kayıpları Fransız kayıplarının kat kat üstünde kaldı. ' +
        'Barış masasında yer kapmak için girilen savaş, İtalyan ordusunun ' +
        'hazırlıksızlığını ilk günden gösterdi.',
      kind: 'siyasi',
      src: B40,
    },
    {
      id: 'b40_paris',
      date: '1940-06-14',
      title: 'Paris Düştü',
      body:
        'Hükûmet önce Tours\'a, sonra Bordeaux\'ya çekildi; Paris yıkımdan ' +
        'kurtulmak için açık şehir ilan edildi ve 14 Haziran\'da tek kurşun ' +
        'atılmadan işgal edildi. Yollar güneye kaçan milyonlarca siville ' +
        'tıkanmıştı ve bu akın askerî sevkiyatı da felç ediyordu.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_maginot',
      date: '1940-06-15',
      title: 'Maginot Hattı — Aşılmadı, Dolanıldı',
      body:
        '"Maginot işe yaramadı" basit bir yanlış. Hat yarılmadı; görevi ' +
        'Almanya sınırını az adamla kapatıp taarruzu Belçika\'ya kanalize ' +
        'etmekti ve bu işi tam olarak yaptı. Hata hattın kendisinde değil, ' +
        'kanalize edilen taarruzun karşılanacağı yerin yanlış seçilmesinde ' +
        've arkada ihtiyat tutulmamasındaydı. Tabyalar ancak 14-15 Haziran\'dan ' +
        'itibaren, cephe çoktan çöktükten sonra arkadan kuşatılarak alındı; ' +
        'bazı garnizonlar ateşkesten sonra, emirle teslim oldu.',
      kind: 'kara',
      src: B40,
    },
    {
      id: 'b40_ateskes',
      date: '1940-06-22',
      title: 'Compiègne — Aynı Vagon',
      body:
        'Fransa ateşkesi, 1918\'de Alman heyetinin imza attığı aynı vagonda ' +
        'imzaladı; vagon bu iş için müzeden çıkarılıp eski yerine getirildi. ' +
        'Altı haftada biten sefer, dört yıl süren 1914-18 Batı Cephesi\'nin ' +
        'tersiydi. Ülkenin kuzeyi ve Atlantik kıyısı işgal altına girdi, ' +
        'güneyde Vichy rejimi kuruldu.',
      kind: 'siyasi',
      src: B40,
    },
  ],
};
