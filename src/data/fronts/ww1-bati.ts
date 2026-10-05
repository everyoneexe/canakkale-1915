import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Batı Cephesi — Belçika'nın işgalinden Compiègne'e.
 *
 * Teşkilât **Ağustos 1914 ilk tertibi**: Alman 1.-7. Orduları komutanlarıyla
 * birlikte, Fransız 1.-5. Orduları Plan XVII konuşlanmasında, İngiliz Sefer
 * Kuvveti ve Belçika ordusu.
 *
 * Alman ordu komutanları ve bir kısmının KARARGÂH yeri kaynakta birebir
 * veriliyor (1., 2., 5. ve 6. Ordular). 3., 4. ve 7. Ordular için karargâh
 * verilmediğinden onlar harekât bölgelerine konuldu — karargâh iddiası
 * taşımazlar.
 */

const OOB = 'https://en.wikipedia.org/wiki/German_Army_order_of_battle_(1914)';
const BATI = 'https://tr.wikipedia.org/wiki/Batı_Cephesi_(I._Dünya_Savaşı)';
const MARNE = 'https://en.wikipedia.org/wiki/First_Battle_of_the_Marne';

const DE = 'German Empire';
const FR = 'France';
const UK = 'United Kingdom of Great Britain and Ireland';
const BE = 'Belgium';

export const BATI_PACK: FrontPack = {
  theatre: 'ww1_bati',

  formations: [
    // ── Alman Orduları, Ağustos 1914 ──
    { nation: DE, name: '1. Ordu — von Kluck', templateId: 'de_piyade_tumen', at: [6.589, 51.089], src: OOB },
    { nation: DE, name: '2. Ordu — von Bülow', templateId: 'de_piyade_tumen', at: [6.241, 50.555], src: OOB },
    { nation: DE, name: '3. Ordu — von Hausen', templateId: 'de_piyade_tumen', at: [6.42, 50.21], src: OOB },
    { nation: DE, name: '4. Ordu — Württemberg Dükü', templateId: 'de_piyade_tumen', at: [6.64, 49.75], src: OOB },
    { nation: DE, name: '5. Ordu — Veliaht Wilhelm', templateId: 'de_piyade_tumen', at: [6.996, 49.234], src: OOB },
    { nation: DE, name: '6. Ordu — Veliaht Rupprecht', templateId: 'de_piyade_tumen', at: [6.703, 49.103], src: OOB },
    { nation: DE, name: '7. Ordu — von Heeringen', templateId: 'de_piyade_tumen', at: [7.75, 48.58], src: OOB },
    { nation: DE, name: 'II. Süvari Kolordusu', templateId: 'os_suvari_tugay', at: [6.30, 50.80], src: OOB },

    // ── Fransız Orduları, Plan XVII ──
    { nation: FR, name: '1. Ordu — Dubail', templateId: 'fr_piyade_tumen', at: [6.45, 48.17], src: BATI },
    { nation: FR, name: '2. Ordu — de Castelnau', templateId: 'fr_piyade_tumen', at: [6.18, 48.69], src: BATI },
    { nation: FR, name: '3. Ordu — Ruffey', templateId: 'fr_piyade_tumen', at: [5.38, 49.16], src: BATI },
    { nation: FR, name: '4. Ordu — de Langle de Cary', templateId: 'fr_piyade_tumen', at: [4.95, 48.64], src: BATI },
    { nation: FR, name: '5. Ordu — Lanrezac', templateId: 'fr_piyade_tumen', at: [4.37, 49.51], src: BATI },
    { nation: FR, name: 'Paris Müstahkem Mevkii', templateId: 'fr_piyade_tumen', at: [2.35, 48.86], src: MARNE },

    // ── İngiliz Sefer Kuvveti ve Belçika ──
    { nation: UK, name: 'İngiliz Sefer Kuvveti (BEF)', templateId: 'uk_piyade_tumen', at: [3.97, 50.28], arrivesOn: '1914-08-14', src: BATI },
    { nation: BE, name: 'Belçika Ordusu — Liège', templateId: 'be_piyade_tumen', at: [5.57, 50.63], src: BATI },
    { nation: BE, name: 'Belçika Ordusu — Anvers', templateId: 'be_piyade_tumen', at: [4.40, 51.22], src: BATI },

    // ── Sonradan gelen ana takviyeler ──
    { nation: UK, name: 'İngiliz 2. Ordusu', templateId: 'uk_piyade_tumen', at: [2.89, 50.85], arrivesOn: '1915-01-01', src: BATI },
    { nation: 'United States of America', name: 'Amerikan Sefer Kuvveti', templateId: 'uk_piyade_tumen', at: [3.10, 49.00], arrivesOn: '1917-06-26', src: BATI },
  ],

  commanders: [
    cmd(
      'moltke_genc', 'Helmuth von Moltke (Genç)', 'Generaloberst', 'alman', 'ottoman', 'kara',
      [4, 3, 3, 3], ['temkinli'], '1914-08-04',
      'Alman Genelkurmay Başkanı. Schlieffen Planı\'nı uyguladı ama sağ ' +
      'kanadı zayıflattı; Marne yenilgisinden sonra görevden alındı.',
      'Planı o devraldı, o da değiştirdi: planlama 3.',
      OOB, '1914-09-14',
    ),
    cmd(
      'kluck', 'Alexander von Kluck', 'Generaloberst', 'alman', 'ottoman', 'kara',
      [6, 3, 3, 3], ['taarruz_ruhu', 'israfci'], '1914-08-04',
      '1. Ordu Komutanı, karargâhı Grevenbroich. Sağ kanadın en dış ordusu; ' +
      'Paris\'in batısından dolaşmak yerine doğusuna dönerek yan verdi.',
      'Marne\'de açılan boşluk onun dönüşünden doğdu: taarruz 6, planlama 3.',
      OOB,
    ),
    cmd(
      'bulow', 'Karl von Bülow', 'Generaloberst', 'alman', 'ottoman', 'kara',
      [5, 4, 4, 3], ['temkinli'], '1914-08-04',
      '2. Ordu Komutanı, karargâhı Monschau. Kurmay başkan yardımcısı ' +
      'Erich Ludendorff\'tu.',
      '1. Ordu ile arasındaki boşluğu kapatamadı. Dengeli puanlar.',
      OOB,
    ),
    cmd(
      'rupprecht', 'Bavyera Veliahtı Rupprecht', 'Generaloberst', 'alman', 'ottoman', 'kara',
      [5, 5, 5, 4], ['taarruz_ruhu', 'siper_ustasi'], '1914-08-04',
      '6. Ordu Komutanı, karargâhı Saint-Avold. Lorraine\'de Fransız ' +
      'taarruzunu karşıladı; savaşın sonuna kadar cephede kaldı.',
      'Hanedan mensubu ama yetkin: dengeli yüksek puanlar.',
      OOB,
    ),
    cmd(
      'joffre', 'Joseph Joffre', 'Orgeneral', 'fransiz', 'entente', 'kara',
      [4, 6, 6, 5], ['inatci_savunma', 'lojistikci'], '1914-08-04',
      'Fransız Başkomutanı. Plan XVII çöktükten sonra orduyu Marne\'de ' +
      'yeniden topladı ve karşı taarruzu 6 Eylül\'e emretti.',
      'Yenilgiyi zafere çeviren toparlanma: savunma ve planlama 6.',
      MARNE, '1916-12-13',
    ),
    cmd(
      'lanrezac', 'Charles Lanrezac', 'Korgeneral', 'fransiz', 'entente', 'kara',
      [3, 6, 5, 3], ['temkinli', 'inatci_savunma'], '1914-08-04',
      '5. Ordu Komutanı. Alman sağ kanadının gücünü erken gördü ve ' +
      'kuşatılmadan çekildi; Eylül\'de görevden alındı.',
      'Çekilme kararı orduyu kurtardı ama kariyerini bitirdi: savunma 6.',
      BATI, '1914-09-03',
    ),
    cmd(
      'french_sir', 'Sir John French', 'Mareşal', 'ingiliz', 'entente', 'kara',
      [3, 4, 3, 3], ['agir_kanli'], '1914-08-14',
      'İngiliz Sefer Kuvveti Komutanı. Mons\'ta çarpıştı, Büyük Geri ' +
      'Çekilme\'yi yönetti. Loos\'tan sonra Aralık 1915\'te değiştirildi.',
      'Müttefikle eşgüdümde zorlandı. Dengeli-düşük puanlar.',
      BATI, '1915-12-19',
    ),
    cmd(
      'haig', 'Douglas Haig', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [5, 5, 4, 5], ['israfci', 'lojistikci'], '1915-12-19',
      'İngiliz Sefer Kuvveti Komutanı. Somme ve Passchendaele\'i yönetti; ' +
      '1918 Yüz Gün Taarruzu\'nda cepheyi kırdı.',
      'Aynı komutan hem 1 Temmuz 1916\'yı hem 8 Ağustos 1918\'i yönetti: ' +
      'taarruz 5, israf eden özellik.',
      BATI,
    ),
    cmd(
      'foch', 'Ferdinand Foch', 'Mareşal', 'fransiz', 'entente', 'kara',
      [6, 5, 6, 5], ['taarruz_ruhu', 'ilham_veren'], '1918-03-26',
      'Müttefik Orduları Başkomutanı, 26 Mart 1918\'den itibaren. ' +
      'Bahar Taarruzu\'nu durdurdu, Yüz Gün\'ü yönetti, 11 Kasım ateşkesini ' +
      'Compiègne\'de imzaladı.',
      'Tek komuta kurulunca cephe döndü: taarruz ve planlama 6.',
      BATI,
    ),
    cmd(
      'ludendorff', 'Erich Ludendorff', 'Korgeneral', 'alman', 'ottoman', 'kara',
      [6, 4, 5, 4], ['taarruz_ruhu', 'israfci'], '1916-08-29',
      'Birinci Başçeyrekmester — fiilî Alman başkomutanı. 1918 Bahar ' +
      'Taarruzu\'nu planladı; stratejik hedef koymadan taktik yarma peşinde ' +
      'koştu ve ihtiyatları tüketti.',
      '1914\'te 2. Ordu\'da başçeyrekmesterdi. Taarruz 6, israf.',
      BATI,
    ),
  ],

  events: [
    {
      id: 'bati_belcika',
      date: '1914-08-04',
      title: 'Belçika İşgali',
      body:
        'Almanya tarafsız Belçika\'ya girdi; Britanya aynı gün savaş ilan ' +
        'etti. Schlieffen Planı Fransız ordusunu kuzeyden dolanıp Paris\'i ' +
        'kuşatmayı öngörüyordu. Liège istihkâmları beklenenden uzun dayandı.',
      kind: 'kara',
      src: BATI,
    },
    {
      id: 'bati_marne',
      date: '1914-09-05',
      title: 'Marne — Plan Durdu',
      body:
        '5-12 Eylül 1914. Kluck\'un 1. Ordusu Paris\'in doğusuna dönünce ' +
        '2. Ordu ile arasında boşluk açıldı. Joffre karşı taarruzu ' +
        '6 Eylül\'e emretti; Paris garnizonu yan vurdu. Almanlar Aisne\'e ' +
        'çekildi. Schlieffen Planı burada öldü.',
      kind: 'kara',
      src: MARNE,
    },
    {
      id: 'bati_ypres1',
      date: '1914-11-22',
      title: 'Birinci Ypres — Cephe Dondu',
      body:
        'Denize Yarış sona erdi. Kanatlardan dolanma çabaları tükenince ' +
        'cephe Manş\'tan İsviçre sınırına kadar kesintisiz siper hattına ' +
        'dönüştü ve dört yıl kıpırdamadı.',
      kind: 'kara',
      src: BATI,
    },
    {
      id: 'bati_verdun',
      date: '1916-02-21',
      title: 'Verdun — "Fransa\'yı Kanatmak"',
      body:
        'Alman 5. Ordusu Verdun\'e yüklendi. Amaç araziyi almak değil, ' +
        'Fransız ordusunu savunmak zorunda bırakıp eritmekti. Muharebe ' +
        'Aralık\'a kadar sürdü ve iki tarafı da kanattı.',
      kind: 'kara',
      src: BATI,
    },
    {
      id: 'bati_somme',
      date: '1916-07-01',
      title: 'Somme — İlk Gün',
      body:
        'Yedi günlük bombardımandan sonra İngiliz piyadesi ileri çıktı. ' +
        'Tel örgüler kesilmemiş, sığınaklar yıkılmamıştı. 1 Temmuz 1916 ' +
        'İngiliz ordusunun tarihindeki en ağır tek gün kaybıdır. ' +
        'Muharebe Kasım\'a kadar sürdü.',
      kind: 'kara',
      src: BATI,
    },
    {
      id: 'bati_nivelle',
      date: '1917-04-16',
      title: 'Chemin des Dames ve İsyanlar',
      body:
        'Nivelle, cepheyi 48 saatte yaracağını vaat etmişti. Taarruz ' +
        'başarısız olunca Fransız ordusunda yaygın itaatsizlik başladı; ' +
        'Pétain komutayı devralıp taarruzları durdurdu.',
      kind: 'kara',
      src: BATI,
    },
    {
      id: 'bati_passchendaele',
      date: '1917-07-31',
      title: 'Passchendaele — Çamur',
      body:
        'Üçüncü Ypres Muharebesi. Bombardıman drenaj sistemini yok etti, ' +
        'yağmur araziyi bataklığa çevirdi. Kasım\'a kadar süren taarruz ' +
        'birkaç kilometre kazandı.',
      kind: 'kara',
      src: BATI,
    },
    {
      id: 'bati_bahar',
      date: '1918-03-21',
      title: 'Bahar Taarruzu',
      body:
        'Brest-Litovsk\'tan sonra doğudan gelen tümenlerle Ludendorff ' +
        'büyük taarruzu başlattı. Sızma taktikleriyle cephe yarıldı ve ' +
        'Almanlar dört yılın en büyük ilerleyişini yaptı; ama stratejik ' +
        'hedef yoktu ve ihtiyatlar tükendi. Kriz, 26 Mart\'ta Foch\'un ' +
        'müttefik başkomutanlığına getirilmesine yol açtı.',
      kind: 'kara',
      src: BATI,
    },
    {
      id: 'bati_amiens',
      date: '1918-08-08',
      title: 'Amiens — Alman Ordusunun Kara Günü',
      body:
        'Tank, topçu ve uçağın birlikte kullanıldığı taarruz Alman hattını ' +
        'bir günde yardı. Ludendorff o günü "Alman ordusunun kara günü" ' +
        'diye andı. Yüz Gün Taarruzu başladı.',
      kind: 'kara',
      src: BATI,
    },
    {
      id: 'bati_compiegne',
      date: '1918-11-11',
      title: '11 KASIM — Compiègne',
      body:
        'Ateşkes Compiègne ormanında bir vagonda imzalandı ve saat 11\'de ' +
        'yürürlüğe girdi. Dört yıl üç ay süren cephe sustu.',
      kind: 'siyasi',
      src: BATI,
    },
  ],
};
