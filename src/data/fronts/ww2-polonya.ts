import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Polonya Seferi — 1 Eylül – 6 Ekim 1939.
 *
 * Savaşın açılış kampanyası ve ilk "Blitzkrieg" uygulaması. Polonya iki
 * cepheden saldırıya uğradı: 1 Eylül'de Almanya batıdan, 17 Eylül'de
 * Sovyetler Birliği doğudan.
 */

const PL = 'https://tr.wikipedia.org/wiki/Polonya_Seferi';
const PL_EN = 'https://en.wikipedia.org/wiki/Invasion_of_Poland';
const BZURA = 'https://en.wikipedia.org/wiki/Battle_of_Bzura';
const WAW = 'https://en.wikipedia.org/wiki/Siege_of_Warsaw_(1939)';

const DE = 'Germany';
const PO = 'Poland';
const SU = 'USSR';

export const POLONYA_PACK: FrontPack = {
  theatre: 'ww2_polonya',

  formations: [
    // ── Alman: Kuzey Ordular Grubu (Bock) — Pomeranya ve Doğu Prusya ──
    { nation: DE, name: '4. Ordu — Kluge, Pomeranya', templateId: 'de_ww2_piyade', at: [18.00, 53.50], src: PL },
    { nation: DE, name: '3. Ordu — Küchler, Doğu Prusya', templateId: 'de_ww2_piyade', at: [20.50, 53.80], src: PL },
    { nation: DE, name: 'XIX. Panzer Kolordusu — Guderian', templateId: 'de_panzer', at: [18.40, 53.60], src: PL },
    { nation: DE, name: '3. Panzer Tümeni', templateId: 'de_panzer', at: [17.60, 53.30], src: PL },
    { nation: DE, name: 'Kempf Panzer Tümeni', templateId: 'de_panzer', at: [20.90, 53.40], src: PL },
    { nation: DE, name: '206. Piyade Tümeni — Doğu Prusya ihtiyatı', templateId: 'de_piyade_tumen', at: [21.60, 54.00], src: PL },

    // ── Alman: Güney Ordular Grubu (Rundstedt) — Silezya ve Slovakya ──
    { nation: DE, name: '8. Ordu — Blaskowitz, Silezya', templateId: 'de_ww2_piyade', at: [17.03, 51.11], src: PL },
    { nation: DE, name: '10. Ordu — Reichenau', templateId: 'de_ww2_piyade', at: [18.50, 50.70], src: PL },
    { nation: DE, name: '14. Ordu — List, Karpatlar', templateId: 'de_ww2_piyade', at: [19.50, 49.60], src: PL },
    { nation: DE, name: 'XVI. Panzer Kolordusu — Hoepner', templateId: 'de_panzer', at: [18.90, 50.90], src: PL },
    { nation: DE, name: '1. Panzer Tümeni', templateId: 'de_panzer', at: [19.20, 50.80], src: PL },
    { nation: DE, name: 'XXII. Motorize Kolordu — Kleist', templateId: 'de_panzer', at: [21.30, 49.50], src: PL },
    { nation: DE, name: '1. Dağ Tümeni — Karpat geçitleri', templateId: 'de_alpen_korps', at: [20.30, 49.40], src: PL },

    // ── Polonya orduları ──
    { nation: PO, name: 'Pomorze Ordusu — Bortnowski', templateId: 'pl_piyade_tumen', at: [18.60, 53.10], src: PL },
    { nation: PO, name: 'Poznań Ordusu — Kutrzeba', templateId: 'pl_piyade_tumen', at: [16.93, 52.41], src: PL },
    { nation: PO, name: 'Łódź Ordusu', templateId: 'pl_piyade_tumen', at: [19.46, 51.76], src: PL },
    { nation: PO, name: 'Kraków Ordusu', templateId: 'pl_piyade_tumen', at: [19.94, 50.06], src: PL },
    { nation: PO, name: 'Modlin Ordusu', templateId: 'pl_piyade_tumen', at: [20.72, 52.44], src: PL },
    { nation: PO, name: 'Karpaty Ordusu', templateId: 'pl_piyade_tumen', at: [21.00, 49.70], src: PL },
    { nation: PO, name: 'Varşova Savunma Kuvveti', templateId: 'pl_piyade_tumen', at: [21.01, 52.23], src: PL },
    { nation: PO, name: 'Prusy Ordusu (İhtiyat)', templateId: 'pl_piyade_tumen', at: [20.50, 51.40], src: PL },
    { nation: PO, name: 'Narew Müfrezesi', templateId: 'pl_piyade_tumen', at: [22.70, 53.20], src: PL },
    { nation: PO, name: 'Modlin Kalesi Garnizonu', templateId: 'pl_piyade_tumen', at: [20.68, 52.44], src: PL },
    { nation: PO, name: 'Pomorska Süvari Tugayı', templateId: 'pl_suvari_tugay', at: [18.10, 53.60], src: PL },
    { nation: PO, name: 'Wołyńska Süvari Tugayı', templateId: 'pl_suvari_tugay', at: [19.10, 50.90], src: PL },
    { nation: PO, name: 'Podolska Süvari Tugayı', templateId: 'pl_suvari_tugay', at: [17.40, 52.20], src: PL },
    {
      nation: PO, name: 'Polesie Bağımsız Harekât Grubu — Kleeberg',
      templateId: 'pl_piyade_tumen', at: [23.30, 52.10], arrivesOn: '1939-09-11', src: PL,
    },

    // ── Sovyet işgali, 17 Eylül ──
    { nation: SU, name: 'Beyaz Rusya Cephesi — Kovalyov', templateId: 'su_tufek_tumen', at: [25.00, 53.00], arrivesOn: '1939-09-17', src: PL },
    { nation: SU, name: 'Ukrayna Cephesi — Timoşenko', templateId: 'su_tufek_tumen', at: [25.50, 50.50], arrivesOn: '1939-09-17', src: PL },
    { nation: SU, name: '15. Tank Kolordusu', templateId: 'su_tank_kolordu', at: [26.20, 52.10], arrivesOn: '1939-09-17', src: PL },
  ],

  commanders: [
    // ── Alman ──
    cmd(
      'pl_rundstedt', 'Gerd von Rundstedt', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 5, 6, 5], ['taarruz_ruhu', 'lojistikci'], '1939-09-01',
      'Güney Ordular Grubu Komutanı. Silezya ve Slovakya\'dan Varşova\'ya ' +
      'yönelen asıl taarruzu yönetti; seferin ağırlık merkezi onun ' +
      'kanadındaydı.',
      'Üç orduyu (8., 10., 14.) tek bir kuşatma eksenine bağladı: taarruz ve ' +
      'planlama 6, lojistik 5.',
      PL,
    ),
    cmd(
      'pl_bock', 'Fedor von Bock', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 4, 5, 4], ['taarruz_ruhu'], '1939-09-01',
      'Kuzey Ordular Grubu Komutanı. Polonya Koridoru\'nu kesip Doğu Prusya ' +
      'ile Pomeranya\'yı birleştirdi, sonra güneye dönüp Varşova\'yı doğudan ' +
      'sardı.',
      'Koridor bir haftada kesildi, ardından 300 km\'lik kavis: taarruz 6, ' +
      'planlama 5.',
      PL,
    ),
    cmd(
      'pl_guderian', 'Heinz Guderian', 'Korgeneral', 'alman', 'ottoman', 'kara',
      [6, 3, 6, 4], ['taarruz_ruhu', 'atilgan_amiral'], '1939-09-01',
      'XIX. Panzer Kolordusu Komutanı. Zırhlıyı piyadeye dağıtmak yerine ' +
      'kütle hâlinde ve derin kullandı; koridorda ve Brześć önünde kendi ' +
      'doktrinini sahada doğruladı.',
      'Blitzkrieg\'in ilk sınavı; buna karşılık savunmada deneyimsiz ve ' +
      'kanatlarını açık bırakıyor: taarruz/planlama 6, savunma 3.',
      PL,
    ),
    cmd(
      'pl_reichenau', 'Walter von Reichenau', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 4, 5, 4], ['taarruz_ruhu', 'atilgan_amiral'], '1939-09-01',
      '10. Ordu Komutanı. Seferin en güçlü zırhlı yığınağını taşıdı; Vistül\'e ' +
      'ilk ulaşan ve Varşova\'nın güney yaklaşmalarını tutan ordu oydu.',
      'En fazla panzer ve motorize tümeni elinde tuttu, hızlı ilerledi; ' +
      'Bzura\'da kanat açığı verdi: taarruz 6, savunma 4.',
      PL_EN,
    ),
    cmd(
      'pl_list', 'Wilhelm List', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [5, 4, 6, 5], ['lojistikci', 'temkinli'], '1939-09-01',
      '14. Ordu Komutanı. Karpat geçitlerinden ve Slovakya\'dan girip ' +
      'Kraków\'u düşürdü, sonra San nehrine ve Lwów\'a yöneldi.',
      'Dağ geçidinden ordu yürütmek ikmal işi; coğrafyayı iyi kullandı: ' +
      'planlama 6, lojistik 5.',
      PL_EN,
    ),
    cmd(
      'pl_kluge', 'Günther von Kluge', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [5, 5, 5, 4], ['taarruz_ruhu', 'inatci_savunma'], '1939-09-01',
      '4. Ordu Komutanı. Pomeranya\'dan doğuya yürüyüp koridoru fiilen kesen ' +
      'orduyu komuta etti, ardından Bug üzerinden Varşova\'nın doğusuna geçti.',
      'Hem yarma hem uzun yürüyüş; dengeli ama parlak değil: taarruz 5, ' +
      'savunma 5.',
      PL_EN,
    ),
    cmd(
      'pl_blaskowitz', 'Johannes Blaskowitz', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [4, 6, 5, 4], ['inatci_savunma', 'agir_kanli'], '1939-09-01',
      '8. Ordu Komutanı. Bzura\'da Kutrzeba\'nın karşı taarruzunun tam ' +
      'karşısına düştü; kanadı çökmeden tuttu ve kuşatmanın çenesi oldu. ' +
      'Sonradan işgal dönemindeki katliamları rapor edip gözden düştü.',
      'Sefer boyunca asıl işi savunma oldu ve başardı: savunma 6, taarruz 4.',
      BZURA,
    ),
    cmd(
      'pl_richthofen', 'Wolfram von Richthofen', 'Tümgeneral', 'alman', 'ottoman', 'kara',
      [6, 3, 5, 4], ['taarruz_ruhu', 'top_atisi'], '1939-09-01',
      'Özel Görev Hava Tümeni Komutanı. Stuka\'ları orduya doğrudan bağlı ' +
      'yakın destek topçusu gibi kullandı; Wieluń ve Varşova bombardımanları ' +
      'onun teşkilinden çıktı.',
      'Hava-kara eşgüdümünü ilk kez işleyen adam; tek işi taarruz desteği: ' +
      'taarruz 6, savunma 3.',
      PL_EN,
    ),

    // ── Polonya ──
    cmd(
      'pl_rydz_smigly', 'Edward Rydz-Śmigły', 'Mareşal', 'polonyali', 'entente', 'kara',
      [3, 4, 3, 2], ['agir_kanli'], '1939-09-01',
      'Polonya Başkomutanı. Orduyu 1 800 km\'lik sınır boyunca yaydı; ' +
      'derinlik olmadığı için her yarma hemen stratejik sonuç verdi. ' +
      '17 Eylül gecesi Romanya\'ya geçti ve orada enterne edildi.',
      'Sanayi bölgelerini ve toprağı korumak için ileri konuşlanma seçti; ' +
      'haberleşme çökünce komutayı da kaybetti: planlama 3, lojistik 2.',
      PL,
      '1939-09-18',
    ),
    cmd(
      'pl_kutrzeba', 'Tadeusz Kutrzeba', 'Tümgeneral', 'polonyali', 'entente', 'kara',
      [5, 4, 6, 3], ['taarruz_ruhu', 'ilham_veren'], '1939-09-01',
      'Poznań Ordusu Komutanı. Çarpışmasız geri çekilmeyi reddedip 9 Eylül\'de ' +
      'Bzura\'da karşı taarruza geçti — seferin en büyük muharebesi ve tek ' +
      'ciddi Polonya inisiyatifi.',
      'Alman 8. Ordusunun açık kanadını doğru teşhis etti ve ilerleyişi bir ' +
      'hafta durdurdu; hava üstünlüğü yokluğu sonucu belirledi: planlama 6, ' +
      'taarruz 5.',
      BZURA,
    ),
    cmd(
      'pl_bortnowski', 'Władysław Bortnowski', 'Tümgeneral', 'polonyali', 'entente', 'kara',
      [4, 4, 3, 3], ['agir_kanli'], '1939-09-01',
      'Pomorze Ordusu Komutanı. Koridorda kuşatmadan arta kalanla Bzura\'ya ' +
      'katıldı; muharebenin ikinci safhasında Kutrzeba ile yön konusunda ' +
      'anlaşmazlığa düştü.',
      'Savunulamaz bir mevziye yerleştirildi ve ordusunun üçte birini ilk ' +
      'haftada kaybetti; karşı taarruzda kararsızlık: planlama 3.',
      BZURA,
    ),
    cmd(
      'pl_sosnkowski', 'Kazimierz Sosnkowski', 'Orgeneral', 'polonyali', 'entente', 'kara',
      [5, 5, 4, 3], ['taarruz_ruhu', 'inatci_savunma'], '1939-09-10',
      'Güney Cephesi Komutanı. Dağınık Kraków ve Karpaty artıklarıyla ' +
      'Lwów\'u kurtarmaya çalıştı; birkaç yerel başarı kazandıktan sonra ' +
      'kuşatmayı yarıp Macaristan\'a geçti.',
      'Hiçbir ikmali olmayan artık birliklerle taarruz yürüttü: taarruz 5, ' +
      'lojistik 3.',
      PL_EN,
    ),
    cmd(
      'pl_kleeberg', 'Franciszek Kleeberg', 'Tümgeneral', 'polonyali', 'entente', 'kara',
      [4, 6, 4, 3], ['inatci_savunma', 'ilham_veren'], '1939-09-11',
      'Polesie Bağımsız Harekât Grubu Komutanı. Hem Almanlara hem Sovyetlere ' +
      'karşı çarpıştı ve 2-5 Ekim\'de Kock\'ta son düzenli muharebeyi verdi; ' +
      'cephaneyi bitirince teslim oldu.',
      'Dağılmış garnizon ve ikmal birliklerinden muharip bir kolordu kurdu ve ' +
      'bir ay dayandı: savunma 6, ilham.',
      PL_EN,
    ),
    cmd(
      'pl_starzynski', 'Stefan Starzyński', 'Belediye Başkanı', 'polonyali', 'entente', 'siyasi',
      [2, 6, 5, 5], ['ilham_veren', 'inatci_savunma'], '1939-09-01',
      'Varşova Belediye Başkanı ve sivil savunma komiseri. Hükümet şehri ' +
      'terk ettikten sonra kaldı; günlük radyo konuşmalarıyla şehri ayakta ' +
      'tuttu, sivil iş taburları kurdu. Gestapo tarafından tutuklanıp ' +
      'öldürüldü.',
      'Askerî değeri yok ama sivil dayanıklılığı ve lojistiği taşıdı: ' +
      'savunma 6, lojistik 5, taarruz 2.',
      WAW,
    ),

    // ── Sovyet ──
    cmd(
      'pl_kovalyov', 'Mihail Kovalyov', 'Komkor', 'sovyet', 'ottoman', 'kara',
      [4, 4, 4, 3], ['israfci'], '1939-09-17',
      'Beyaz Rusya Cephesi Komutanı. 17 Eylül\'de doğu sınırını geçip ' +
      'Vilnius, Grodno ve Brześć yönünde ilerledi; ciddi direnişle yalnız ' +
      'Grodno\'da karşılaştı.',
      'Karşısında düzenli ordu yoktu; buna rağmen yürüyüş kolları karıştı ve ' +
      'yakıt sıkıntısı çıktı: lojistik 3.',
      PL_EN,
    ),
    cmd(
      'pl_timosenko', 'Semyon Timoşenko', 'Komandarm', 'sovyet', 'ottoman', 'kara',
      [4, 4, 5, 4], ['lojistikci'], '1939-09-17',
      'Ukrayna Cephesi Komutanı. Güney kanadından girip Lwów\'a ulaştı ve ' +
      'şehrin 22 Eylül\'de Sovyetlere tesliminde pay sahibi oldu.',
      'Geniş cepheyi düzenli yürüttü, fakat harekât muharebeden çok işgaldi: ' +
      'planlama 5.',
      PL_EN,
    ),
  ],

  events: [
    {
      id: 'ev_polonya_19390901_taarruz',
      date: '1939-09-01',
      title: '1 EYLÜL — Savaş Başladı, Wieluń Yandı',
      body:
        'Alman kuvvetleri savaş ilanı olmadan Polonya\'ya girdi. Daha gün ' +
        'ağarmadan Stuka\'lar askerî hedefi olmayan Wieluń kasabasını vurdu; ' +
        'kasabanın yaklaşık yüzde 70\'i yıkıldı, hastane de dâhil. Aynı saatlerde ' +
        'Schleswig-Holstein zırhlısı Danzig\'de Westerplatte\'yi topa tuttu. ' +
        'Savaşın daha ilk saatinde sivil yerleşimin bir harekât hedefi sayıldığı ' +
        'görüldü — bu, sonraki altı yılın kuralı olacaktı.',
      kind: 'hava',
      src: PL_EN,
    },
    {
      id: 'ev_polonya_19390901_krojanty',
      date: '1939-09-01',
      title: 'Krojanty — Doğmakta Olan Bir Efsane',
      body:
        'Pomorska Süvari Tugayı\'nın iki bölüğü Krojanty\'de dinlenen Alman ' +
        'PİYADESİNE kılıçla yüklendi ve onu dağıttı; ardından gelen zırhlı ' +
        'araçların makineli ateşiyle geri çekildi. Ertesi gün sahaya getirilen ' +
        'İtalyan ve Alman muhabirler "Polonyalılar tanka kılıçla saldırdı" ' +
        'diye yazdı. Efsane budur: Polonya süvarisi tanka hücum etmedi; ' +
        'süvari tugayları 37 mm Bofors tanksavar topu ve tanksavar tüfeği ' +
        'taşıyan hareketli piyadeydi ve sefer boyunca öyle kullanıldı.',
      kind: 'kara',
      src: 'https://en.wikipedia.org/wiki/Charge_at_Krojanty',
    },
    {
      id: 'ev_polonya_19390902_hava',
      date: '1939-09-02',
      title: 'İkinci Efsane: "Hava Kuvvetleri Yerde İmha Edildi"',
      body:
        'Luftwaffe ilk gün Polonya havaalanlarını vurdu, ama bulduğu şey büyük ' +
        'ölçüde eğitim uçağı ve maketti: muharip filolar 31 Ağustos\'ta gizli ' +
        'yedek meydanlara dağıtılmıştı. Polonya avcıları iki hafta boyunca ' +
        'havalandı ve yaklaşık 100-170 Alman uçağı düşürdü (kaynaklar bu ' +
        'rakamda ayrılıyor). Kuvveti bitiren şey baskın değil, yedek parça, ' +
        'yakıt ve meydan kaybıydı — yani lojistik.',
      kind: 'hava',
      src: 'https://en.wikipedia.org/wiki/Polish_Air_Force',
    },
    {
      id: 'ev_polonya_19390905_koridor',
      date: '1939-09-05',
      title: 'Polonya Koridoru Kesildi',
      body:
        'Kluge\'nin 4. Ordusu ile Doğu Prusya\'dan gelen 3. Ordu birleşti; ' +
        'koridor kapandı ve Pomorze Ordusu\'nun bir bölümü Tuchola ormanında ' +
        'kuşatıldı. Almanya ile Doğu Prusya arasında kara bağlantısı kuruldu, ' +
        'Polonya ise denize çıkışını ve kuzeydeki manevra alanını kaybetti.',
      kind: 'kara',
      src: PL,
    },
    {
      id: 'ev_polonya_19390907_westerplatte',
      date: '1939-09-07',
      title: 'Westerplatte Düştü — 7 Gün, 182 Kişi',
      body:
        'Danzig limanındaki küçük Polonya cephane deposu, 182 kişilik ' +
        'garnizonla savaştı. Bir-iki gün dayanması beklenirken zırhlı gemi ' +
        'ateşine, Stuka saldırısına ve istihkâm hücumlarına yedi gün direndi; ' +
        'suyu ve sargı bezi bitince teslim oldu. Askerî önemi küçüktü, ama ' +
        'Polonya için savaşın sembolü hâline geldi.',
      kind: 'kara',
      src: 'https://en.wikipedia.org/wiki/Battle_of_Westerplatte',
    },
    {
      id: 'ev_polonya_19390908_varsova',
      date: '1939-09-08',
      title: 'Varşova\'nın Kapısında — Kuşatma Başlıyor',
      body:
        '4. Panzer Tümeni\'nin öncüleri Varşova\'nın güneybatı banliyölerine ' +
        'girdi ve barikatlara, tanksavar toplarına ve sokak savaşına çarparak ' +
        'günde yüzlerce araç-personel kaybıyla geri atıldı. Ders açıktı: ' +
        'savunulan şehir, zırhlı kolun tek başına alabileceği bir hedef değil. ' +
        'Şehir bundan sonra üç hafta kuşatma ve bombardımanla indirilecekti.',
      kind: 'kara',
      src: WAW,
    },
    {
      id: 'ev_polonya_19390909_bzura',
      date: '1939-09-09',
      title: 'Bzura — Seferin En Büyük Muharebesi',
      body:
        'Kutrzeba\'nın Poznań Ordusu ve Bortnowski\'nin Pomorze artıkları, ' +
        'Varşova\'ya koşan Alman 8. Ordusunun açıkta kalan kuzey kanadına ' +
        'yüklendi. Üç Alman tümeni geri atıldı, Łęczyca ve Piątek geri alındı; ' +
        'Alman komutası Varşova yönündeki panzer kolordularını geri çevirmek ' +
        'zorunda kaldı. Taarruz, 450 uçağın yoğunlaştırıldığı hava saldırıları ' +
        've çevrelemeyle 19 Eylül\'de kırıldı: hava üstünlüğü olmadan kara ' +
        'inisiyatifinin tutulamayacağının ilk büyük örneği.',
      kind: 'kara',
      src: BZURA,
    },
    {
      id: 'ev_polonya_19390912_abbeville',
      date: '1939-09-12',
      title: 'Abbeville — Batı\'nın Taarruzu İptal Edildi',
      body:
        'Fransız-İngiliz Yüksek Savaş Konseyi Abbeville\'de toplandı ve Saar ' +
        'bölgesindeki sınırlı ilerlemeyi durdurma kararı aldı; vaat edilen ' +
        'büyük Batı taarruzu hiç yapılmadı. Polonya, ittifak antlaşmasının ' +
        'öngördüğü ikinci cepheyi beklerken yalnız kaldı — Alman batı sınırında ' +
        'yalnızca ikinci sınıf tümenler duruyordu.',
      kind: 'siyasi',
      src: PL_EN,
    },
    {
      id: 'ev_polonya_19390917_sovyet',
      date: '1939-09-17',
      title: '17 EYLÜL — Doğudan İkinci Cephe',
      body:
        'Kızıl Ordu, Molotov-Ribbentrop Paktı\'nın gizli ekine dayanarak ' +
        'yaklaşık yarım milyon askerle doğu sınırını geçti; gerekçe olarak ' +
        'Polonya devletinin "artık var olmadığı" öne sürüldü. Doğuda yalnız ' +
        'sınır muhafız taburları vardı. Rydz-Śmigły, Sovyetlerle çarpışmama ' +
        've Romanya köprübaşına çekilme emri verdi — bu emirle Romanya\'ya ' +
        'çekilip savaşı sürdürme planı da çöktü.',
      kind: 'siyasi',
      src: PL,
    },
    {
      id: 'ev_polonya_19390917_brzesc',
      date: '1939-09-17',
      title: 'Brześć Kalesi Düştü',
      body:
        'Guderian\'ın XIX. Panzer Kolordusu, Plisowski\'nin dağınık ' +
        'garnizonuna karşı dört gün uğraştıktan sonra Brześć (Brest-Litovsk) ' +
        'kalesini aldı; savunucular eski tankları kapı girişlerine siper ' +
        'yapmıştı. Birkaç gün sonra şehir, anlaşma gereği Sovyetlere devredildi ' +
        've iki ordu burada ortak bir geçit töreni yaptı — paktın sahadaki ' +
        'en somut görüntüsü.',
      kind: 'kara',
      src: 'https://en.wikipedia.org/wiki/Battle_of_Brze%C5%9B%C4%87_Litewski',
    },
    {
      id: 'ev_polonya_19390918_hukumet',
      date: '1939-09-18',
      title: 'Hükümet Romanya\'ya Geçti',
      body:
        'Cumhurbaşkanı Mościcki, hükümet ve başkomutanlık 17/18 Eylül gecesi ' +
        'Romanya sınırını geçti ve beklenenin aksine serbest bırakılmayıp ' +
        'enterne edildi. Mościcki, anayasanın verdiği yetkiyle halefini atadı: ' +
        'böylece Paris\'te, sonra Londra\'da kesintisiz bir sürgün hükümeti ' +
        'kuruldu. Polonya teslim belgesi imzalamadı — devlet hukuken savaşta ' +
        'kaldı ve Polonya birlikleri savaş boyunca Batı\'da çarpıştı.',
      kind: 'siyasi',
      src: PL_EN,
    },
    {
      id: 'ev_polonya_19390922_lwow',
      date: '1939-09-22',
      title: 'Lwów Sovyetlere Teslim Oldu',
      body:
        'On gün Almanlara karşı savunulan Lwów, şehri kuşatan Alman birlikleri ' +
        'anlaşma gereği çekilince Kızıl Ordu\'ya teslim edildi. Serbest çıkış ' +
        'sözü verilen Polonyalı subaylar tutuklandı; bu gruptakilerin çoğu ' +
        '1940\'ta Katyn ve bağlı infazlarda öldürüldü.',
      kind: 'kara',
      src: PL_EN,
    },
    {
      id: 'ev_polonya_19390925_kara_pazartesi',
      date: '1939-09-25',
      title: '"Kara Pazartesi" — Varşova Bombardımanı',
      body:
        'Richthofen\'in teşkilinden yaklaşık 400 uçak, gün boyu Varşova\'ya ' +
        'bomba ve yangın bombası yağdırdı; topçu ateşi aynı anda sürdü. Su ' +
        'şebekesi çöktüğü için yangınlar söndürülemedi. Askerî mevzilerle ' +
        'sivil mahalleler ayrılmadı: şehrin iradesini kırmak harekâtın ' +
        'açık amacıydı ve kuşatmayı bitiren de bu oldu.',
      kind: 'hava',
      src: WAW,
    },
    {
      id: 'ev_polonya_19390928_teslim',
      date: '1939-09-28',
      title: 'Varşova Teslim Oldu',
      body:
        'Yiyecek, su ve cephane bitince General Rómmel şehri teslim etti; ' +
        '140 000 kadar asker esir düştü, sivil ölü sayısı 18 000\'in üzerinde ' +
        'tahmin ediliyor. Aynı gün Berlin\'de Alman-Sovyet Sınır ve Dostluk ' +
        'Antlaşması imzalandı: iki devlet Polonya\'yı Bug hattından paylaştı. ' +
        'Modlin Kalesi iki gün sonra, Hel Yarımadası 2 Ekim\'de düştü.',
      kind: 'siyasi',
      src: WAW,
    },
    {
      id: 'ev_polonya_19391006_kock',
      date: '1939-10-06',
      title: 'Kock — Son Düzenli Direniş',
      body:
        'Kleeberg\'in Polesie Harekât Grubu, 2-5 Ekim\'de Kock\'ta Alman 13. ' +
        'Motorize Kolordusu\'na karşı çarpıştı ve bazı mevzileri geri aldı; ' +
        'cephane tükenince 6 Ekim\'de yaklaşık 17 000 kişiyle teslim oldu. ' +
        'Seferin son düzenli muharebesiydi. Düzenli ordu bitti, ama direniş ' +
        'bitmedi: aynı haftalarda yeraltı teşkilatı kuruldu ve savaşın en ' +
        'büyük yeraltı ordusuna dönüştü.',
      kind: 'kara',
      src: 'https://en.wikipedia.org/wiki/Battle_of_Kock_(1939)',
    },
  ],
};
