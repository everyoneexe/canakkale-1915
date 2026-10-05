import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Doğu Afrika Seferi — ateşkesten iki hafta sonra biten savaş.
 *
 * Lettow-Vorbeck'in amacı kazanmak değildi: İtilaf kuvvetlerini ve
 * malzemesini Avrupa'dan uzak tutmaktı. 2.472 askari ve 260 Alman'la
 * başlayan kuvvet, kendisinden kat kat büyük orduları dört yıl oyaladı.
 *
 * BAŞLANGIÇ TARİHİ düzeltildi. Oyun 3 Ağustos 1914 yazıyordu; kaynakta
 * ilk kara harekâtı **5 Ağustos**'ta Uganda birliklerinin Viktorya Gölü
 * yakınındaki Alman karakollarına saldırmasıdır. 3 Ağustos'ta cephede
 * hiçbir şey olmamıştı.
 *
 * KAYIP SAYILARI bu cephede özellikle belirsiz. Alman tarafı hamal ve
 * askari kayıtlarını hiç tutmadı; İngiliz hamal kayıpları için 90.000 ile
 * 95.000 arası rakamlar veriliyor. Sivil kıtlık ölümleri 350.000'in
 * üzerinde tahmin ediliyor ama bunlar tahmindir.
 */

const DA = 'https://en.wikipedia.org/wiki/East_African_campaign_(World_War_I)';

const DE = 'German Empire';
const UK = 'United Kingdom of Great Britain and Ireland';
const IN = 'India';
const BE = 'Belgium';
const PT = 'Portugal';
const ZA = 'South Africa';

export const DOGU_AFRIKA_PACK: FrontPack = {
  theatre: 'ww1_dogu_afrika',

  formations: [
    // ── Alman Schutztruppe ──
    // 260 Alman, 2.472 askari — İngiliz Kral Afrika Tüfekleri'nin iki
    // taburuna denk bir kuvvet.
    { nation: DE, name: 'Schutztruppe — Neu Moshi', templateId: 'os_piyade_alay', at: [37.34, -3.35], src: DA },
    { nation: DE, name: 'Schutztruppe — Tanga', templateId: 'os_piyade_alay', at: [39.10, -5.07], src: DA },
    { nation: DE, name: 'Schutztruppe — Dar es Salaam', templateId: 'os_piyade_alay', at: [39.28, -6.82], src: DA },
    { nation: DE, name: 'Tanganika Gölü Müfrezesi', templateId: 'os_piyade_alay', at: [29.63, -4.88], src: DA },
    { nation: DE, name: 'Landsturm Yerleşimci Milisi', templateId: 'os_suvari_tugay', at: [35.74, -6.17], src: DA },
    // Königsberg'in topları karaya çıkarılıp savaşın sonuna kadar kullanıldı.
    { nation: DE, name: 'Königsberg Bataryası', templateId: 'os_agir_topcu', at: [39.33, -7.80], arrivesOn: '1915-07-11', src: DA },

    // ── Britanya İmparatorluğu ──
    { nation: UK, name: 'Kral Afrika Tüfekleri (KAR)', templateId: 'hint_tugay', at: [36.82, -1.29], src: DA },
    { nation: IN, name: 'B Hint Sefer Kuvveti', templateId: 'hint_tugay', at: [39.67, -4.04], arrivesOn: '1914-11-02', src: DA },
    { nation: IN, name: 'C Hint Sefer Kuvveti', templateId: 'hint_tugay', at: [37.68, -3.40], arrivesOn: '1914-11-03', src: DA },
    { nation: UK, name: '25. (Sınır Muhafızları) Kraliyet Fizilye Taburu', templateId: 'os_piyade_alay', at: [36.82, -1.29], arrivesOn: '1915-05-01', src: DA },
    { nation: UK, name: '2. Rodezya Alayı', templateId: 'os_piyade_alay', at: [33.93, -9.93], arrivesOn: '1915-01-01', src: DA },
    { nation: ZA, name: 'Güney Afrika Sefer Kuvveti', templateId: 'uk_piyade_tumen', at: [37.00, -3.00], arrivesOn: '1916-02-01', src: DA },
    { nation: UK, name: 'Nijerya Tugayı', templateId: 'hint_tugay', at: [39.71, -9.99], arrivesOn: '1917-07-01', src: DA },

    // ── Belçika Force Publique ──
    { nation: BE, name: 'Force Publique — Kuzey Kolu', templateId: 'be_piyade_tumen', at: [30.06, -1.94], arrivesOn: '1916-04-18', src: DA },
    { nation: BE, name: 'Force Publique — Güney Kolu', templateId: 'be_piyade_tumen', at: [29.63, -4.88], arrivesOn: '1916-04-18', src: DA },

    // ── Portekiz ──
    { nation: PT, name: 'Portekiz Rovuma Garnizonu', templateId: 'os_piyade_alay', at: [38.15, -11.42], src: DA },
  ],

  commanders: [
    cmd(
      'lettow_vorbeck', 'Paul von Lettow-Vorbeck', 'Yarbay', 'alman', 'ottoman', 'kara',
      [5, 6, 6, 6], ['inatci_savunma', 'lojistikci', 'ilham_veren'], '1914-08-05',
      'Alman Doğu Afrikası Schutztruppe Komutanı. Amacı kazanmak değil, ' +
      'İtilaf kuvvetlerini Avrupa\'dan uzak tutmaktı. Kasım 1917\'de ' +
      'Mozambik\'e geçip Portekiz depolarından beslenerek savaşı sürdürdü. ' +
      'Mahiwa\'dan sonra tümgeneralliğe terfi etti.',
      'Dört yıl boyunca ikmalini düşmandan sağladı: lojistik ve planlama 6.',
      DA,
    ),
    cmd(
      'schnee', 'Heinrich Schnee', 'Vali', 'alman', 'ottoman', 'siyasi',
      [1, 3, 3, 3], ['temkinli'], '1914-08-05',
      'Alman Doğu Afrikası Valisi ve Lettow-Vorbeck\'in sözde üstü. ' +
      'Tarafsızlık anlaşmasını savundu; Lettow onu dinlemedi. Teslim ' +
      'belgesini sömürge üzerindeki hak iddiasından vazgeçilmediğini ' +
      'göstermek için imzalamadı.',
      'Askerî karar alamayan sivil otorite: taarruz 1.',
      DA,
    ),
    cmd(
      'smuts', 'Jan Smuts', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [5, 4, 4, 3], ['taarruz_ruhu', 'israfci'], '1916-02-19',
      '1916 harekâtının komutanı. 13.000 Güney Afrikalı ve 7.000 Hint-Afrika ' +
      'askeriyle birçok yönden taarruz etti; Lettow\'u hiç yakalayamadı. ' +
      'Ocak 1917\'de Londra\'ya döndü.',
      'Kuvvetini hastalığa kaybetti: 9. Güney Afrika Piyadesi 1.135 kişiyle ' +
      'başlayıp sekiz ayda 116 sağlam askere indi. Planlama 4.',
      DA, '1917-01-20',
    ),
    cmd(
      'van_deventer', 'Jacob van Deventer', 'Tümgeneral', 'ingiliz', 'entente', 'kara',
      [5, 4, 5, 5], ['lojistikci', 'taarruz_ruhu'], '1917-05-29',
      'Hoskins\'in yerine harekât komutanı. Temmuz 1917\'de taarruza geçti ve ' +
      'sonbahara kadar Almanları 160 kilometre güneye sürdü.',
      'İkmal hatları düzeltildikten sonra ilerleme mümkün oldu: lojistik 5.',
      DA,
    ),
    cmd(
      'tombeur', 'Charles Tombeur', 'Tümgeneral', 'belcika', 'entente', 'kara',
      [5, 4, 4, 3], ['taarruz_ruhu'], '1916-04-18',
      'Force Publique Komutanı. 6 Mayıs 1916\'da Kigali\'yi aldı; ' +
      '17 Haziran\'da Ruanda ve Burundi işgal edildi. 19 Eylül\'de ' +
      'Tabora\'yı ele geçirdi.',
      'Seferin en hızlı ilerleyen kolu: taarruz 5.',
      DA,
    ),
  ],

  events: [
    {
      id: 'da_baslangic',
      date: '1914-08-05',
      title: 'İlk Çatışma — Viktorya Gölü',
      body:
        'Britanya 4 Ağustos\'ta savaş ilan etti; 5 Ağustos\'ta Uganda ' +
        'himayesinden gelen birlikler Viktorya Gölü yakınındaki Alman ' +
        'nehir karakollarına saldırdı. Aynı gün İngiliz Savaş Kabinesi ' +
        'Doğu Afrika\'ya bir Hint Sefer Kuvveti göndermeye karar verdi.\n\n' +
        'İki sömürgenin valileri de savaşmak istemiyordu; 1885 Kongo ' +
        'Senedi\'ne dayanan bir tarafsızlık anlaşması aradılar. Askerî ' +
        'komutanlar bunu dinlemedi.',
      kind: 'kara',
      src: DA,
    },
    {
      id: 'da_taveta',
      date: '1914-08-15',
      title: 'Taveta — İlk Alman Taarruzu',
      body:
        'Neu Moshi bölgesindeki iki askari bölüğü (300 kişi) Kilimanjaro\'nun ' +
        'İngiliz tarafındaki Taveta\'yı aldı. İngilizler göstermelik bir ' +
        'yaylım ateşinden sonra düzenle çekildi.',
      kind: 'kara',
      src: DA,
    },
    {
      id: 'da_tanga',
      date: '1914-11-02',
      title: 'Tanga — "Arıların Muharebesi"',
      body:
        '8.000 kişilik B Hint Sefer Kuvveti Tanga\'ya çıkarma yaptı; ' +
        '4.000 kişilik C Kuvveti Kilimanjaro\'dan Neu Moshi\'ye yürüdü. ' +
        'Lettow-Vorbeck Tanga\'da sekize bir, Longido\'da dörde bir azınlıkta ' +
        'olmasına rağmen kazandı. İngiliz resmî tarihi olayı "İngiliz askerî ' +
        'tarihinin en dikkate değer başarısızlıklarından biri" diye anar.\n\n' +
        'Donanma, tarafsızlık anlaşmasını bozduğunu bildirmek zorunda ' +
        'kaldığı için baskın unsuru da kaybedilmişti.',
      kind: 'kara',
      src: DA,
    },
    {
      id: 'da_konigsberg',
      date: '1915-07-11',
      title: 'Königsberg Battı, Topları Karaya Çıktı',
      body:
        'Rufiji deltasına sığınan kruvazör Königsberg, İngiltere\'den ' +
        'getirilen iki sığ su monitörüyle imha edildi. Mürettebatı ve ' +
        '10,5 cm\'lik ana bataryası Schutztruppe\'ye katıldı; bu toplar ' +
        'savaşın sonuna kadar kullanıldı.',
      kind: 'deniz',
      src: DA,
    },
    {
      id: 'da_smuts',
      date: '1916-02-19',
      title: 'Smuts Taarruzu',
      body:
        'Smuts 13.000 Güney Afrikalı ve 7.000 Hint-Afrika askeriyle birçok ' +
        'yönden taarruza geçti. Almanlar büyük yığınaklardan hep çekildi. ' +
        'Eylül 1916\'da Dar es Salaam-Ujiji demiryolu İngiliz denetimine ' +
        'girdi — ama Lettow yakalanamadı.\n\n' +
        'Asıl kayıp hastalıktandı: 9. Güney Afrika Piyadesi Şubat\'ta ' +
        '1.135 kişiyle başladı, Ekim\'de 116 sağlam askeri kalmıştı.',
      kind: 'kara',
      src: DA,
    },
    {
      id: 'da_tabora',
      date: '1916-09-19',
      title: 'Tabora — Belçika Kolu',
      body:
        'Force Publique 18 Nisan\'da harekete geçmiş, 6 Mayıs\'ta Kigali\'yi ' +
        'almış, 17 Haziran\'da Ruanda ve Burundi\'yi işgal etmişti. ' +
        '19 Eylül\'de Tabora ele geçirildi. Yürüyüş sırasında Carbel hamal ' +
        'birliği her yedi kişiden birini kaybetti.',
      kind: 'kara',
      src: DA,
    },
    {
      id: 'da_mahiwa',
      date: '1917-10-15',
      title: 'Mahiwa',
      body:
        '15-19 Ekim 1917. Lettow-Vorbeck 519 kayıp verdi, Nijerya ' +
        'Tugayı\'ndaki İngiliz kaybı 2.700\'dü. Haber Almanya\'ya ulaşınca ' +
        'Lettow-Vorbeck tümgeneralliğe terfi ettirildi. Pahalı bir zaferdi: ' +
        'yerine konamayacak mühimmat harcandı.',
      kind: 'kara',
      src: DA,
    },
    {
      id: 'da_mozambik',
      date: '1917-11-23',
      title: 'Mozambik\'e Geçiş',
      body:
        'Lettow-Vorbeck Portekiz garnizonlarının depolarından beslenmek için ' +
        'Mozambik\'e geçti. Kuvvetini üçe bölmüştü; Yüzbaşı Tafel\'in ' +
        '1.000 kişilik müfrezesi yiyecek ve cephanesi bitince teslim oldu — ' +
        'iki kol birbirinden yalnız bir günlük yürüyüş uzaktaydı ve bunu ' +
        'bilmiyorlardı.',
      kind: 'ikmal',
      src: DA,
    },
    {
      id: 'da_teslim',
      date: '1918-11-25',
      title: 'Abercorn — Ateşkesten İki Hafta Sonra',
      body:
        'Alman kuvveti ateşkes haberini 14 Kasım sabahı aldı; bir İngiliz ' +
        'motosikletli ulağın ele geçirilmesiyle öğrenilmişti. Lettow-Vorbeck ' +
        '25 Kasım 1918 saat 11.00\'de Abercorn\'da teslim oldu. Tuğgeneral ' +
        'Edwards kılıcını almayı reddetti.\n\n' +
        'Sefer boyunca İtilaf tarafında yaklaşık 400.000 asker ve 600.000 ' +
        'hamal görev yaptı — hepsi 14.000 kişilik bir kuvveti kovalamak ' +
        'için. Asıl bedeli hamallar ödedi: İngiliz tarafında 90-95 bin hamal ' +
        'öldü, Alman tarafı hiç kayıt tutmadı.',
      kind: 'siyasi',
      src: DA,
    },
  ],
};
