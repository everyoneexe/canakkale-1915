import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Irak (Mezopotamya) Cephesi — Fao çıkarmasından Mondros'a.
 *
 * Cephenin ağırlık merkezi Kûtü'l-Amâre Kuşatması'dır: 7 Aralık 1915 –
 * 29 Nisan 1916. Dört ayrı İngiliz kurtarma harekâtı da kaynakta tarih ve
 * kayıpla birlikte veriliyor; olaylar bunlardan yazıldı.
 *
 * TESLİM RAKAMLARINDA kaynaklar çelişiyor: aynı madde içinde hem "4 general"
 * hem "5 general" geçiyor, Halil Paşa'nın ordu mesajı ise "13 general,
 * 481 subay, 13.300 er" diyor. Subay ve er sayısı tutarlı olduğu için onlar
 * yazıldı; general sayısı çelişkisi olay metninde açıkça söyleniyor.
 */

const KUT = 'https://tr.wikipedia.org/wiki/Kûtü%27l-Amâre_Kuşatması';
const IRAK = 'https://tr.wikipedia.org/wiki/Irak_Cephesi_(I._Dünya_Savaşı)';

const OS = 'Ottoman Empire';
const UK = 'United Kingdom of Great Britain and Ireland';
const IN = 'India';

export const MEZOPOTAMYA_PACK: FrontPack = {
  theatre: 'ww1_mezopotamya',

  formations: [
    // ── Osmanlı ──
    // Savaşın başında Irak'ta yalnız iki zayıf tümen vardı; Basra bu yüzden
    // kaybedildi.
    { nation: OS, name: '38. Tümen', templateId: 'os_piyade_tumen', at: [47.78, 30.51], src: IRAK },
    { nation: OS, name: '35. Tümen', templateId: 'os_piyade_tumen', at: [44.36, 33.31], src: IRAK },
    // 1915 takviyeleri — Selman-ı Pak'ta savaşan tümenler.
    { nation: OS, name: '45. Tümen', templateId: 'os_piyade_tumen', at: [44.58, 33.09], arrivesOn: '1915-10-01', src: IRAK },
    { nation: OS, name: '51. Tümen', templateId: 'os_piyade_tumen', at: [44.58, 33.09], arrivesOn: '1915-11-01', src: IRAK },
    { nation: OS, name: '52. Tümen', templateId: 'os_piyade_tumen', at: [44.36, 33.31], arrivesOn: '1915-11-15', src: IRAK },
    // Kuşatma kuvveti — 18. Kolordu, Kut çevresinde.
    { nation: OS, name: '18. Kolordu — Kuşatma Kuvveti', templateId: 'os_piyade_tumen', at: [45.82, 32.51], arrivesOn: '1915-12-07', src: KUT },
    // 13. Kolordu — Ali İhsan Bey, Sâbis mevziinde kurtarma kuvvetini karşıladı.
    { nation: OS, name: '13. Kolordu', templateId: 'os_piyade_tumen', at: [46.10, 32.45], arrivesOn: '1916-01-10', src: KUT },
    { nation: OS, name: '2. Tümen', templateId: 'os_piyade_tumen', at: [46.30, 32.42], arrivesOn: '1916-02-01', src: KUT },
    // Felahiye (Hanna) boğazı — kurtarma kollarını durduran mevzi.
    { nation: OS, name: 'Felahiye Mevzi Kuvveti', templateId: 'os_piyade_alay', at: [46.25, 32.40], arrivesOn: '1916-01-15', src: KUT },
    { nation: OS, name: 'Bağdat Ağır Topçu Alayı', templateId: 'os_agir_topcu', at: [44.36, 33.31], src: IRAK },
    { nation: OS, name: 'Aşiret Süvari Tugayı', templateId: 'os_suvari_tugay', at: [45.30, 32.80], src: IRAK },

    // ── Britanya / Hindistan ──
    // Fao'ya çıkan ve Basra'yı alan kuvvet.
    { nation: IN, name: '6. (Puna) Hint Tümeni', templateId: 'uk_piyade_tumen', at: [48.48, 29.97], src: IRAK },
    { nation: IN, name: '12. Hint Tümeni', templateId: 'hint_tugay', at: [47.78, 30.51], arrivesOn: '1915-04-01', src: IRAK },
    // Dicle Kolordusu — Kut'u kurtarmaya gelen kuvvet, Ali Garbi üssünden.
    { nation: IN, name: '7. (Meerut) Hint Tümeni', templateId: 'uk_piyade_tumen', at: [46.69, 32.47], arrivesOn: '1916-01-04', src: KUT },
    { nation: IN, name: '3. (Lahor) Hint Tümeni', templateId: 'uk_piyade_tumen', at: [46.69, 32.47], arrivesOn: '1916-01-20', src: KUT },
    { nation: UK, name: '13. (Batı) Tümeni', templateId: 'uk_piyade_tumen', at: [46.69, 32.47], arrivesOn: '1916-03-01', src: KUT },
  ],

  commanders: [
    cmd(
      'von_der_goltz', 'Colmar von der Goltz Paşa', 'Mareşal', 'alman', 'ottoman', 'kara',
      [4, 6, 6, 4], ['temkinli', 'siper_ustasi'], '1915-10-01',
      '6. Ordu Komutanı. Kut kuşatmasını ve kurtarma kollarını durduran ' +
      'mevzi savunmasını planladı. 19 Nisan 1916\'da Bağdat\'taki ' +
      'karargâhında tifüsten öldü — teslimden on gün önce.',
      'Dört ayrı kurtarma harekâtını kırdıran mevzi düzeni onundu: ' +
      'planlama ve savunma 6.',
      KUT, '1916-04-19',
    ),
    cmd(
      'halil_kut', 'Halil Paşa (Kut)', 'Mirliva', 'osmanli', 'ottoman', 'kara',
      [5, 6, 5, 4], ['inatci_savunma', 'taarruz_ruhu'], '1916-01-10',
      'Önce 18. Kolordu, 19 Nisan 1916\'dan sonra 6. Ordu Komutanı. ' +
      '29 Nisan 1916\'da Townshend\'in garnizonunu teslim aldı; zaferden ' +
      'sonra "Kut" soyadını aldı.',
      'Hem kuşatmayı hem kurtarma kollarını aynı anda yönetti. Savunma 6.',
      KUT,
    ),
    cmd(
      'nurettin_bey', 'Sakallı Nurettin Bey', 'Miralay', 'osmanli', 'ottoman', 'kara',
      [5, 5, 4, 3], ['taarruz_ruhu'], '1915-04-01',
      'Irak ve Havalisi Komutanı. Selman-ı Pak\'ta Townshend\'i durdurdu ve ' +
      'Kut\'a çekilmeye zorladı. Ocak 1916\'da görevden alındı.',
      'Bağdat yolunu kapatan muharebeyi kazandı: taarruz 5.',
      KUT, '1916-01-10',
    ),
    cmd(
      'ali_ihsan_irak', 'Ali İhsan Bey (Sabis)', 'Miralay', 'osmanli', 'ottoman', 'kara',
      [4, 6, 5, 4], ['siper_ustasi', 'inatci_savunma'], '1916-01-10',
      '13. Kolordu Komutanı. 8 Mart 1916\'da Sâbis (Dujaila) mevkiinde ' +
      'Aylmer\'in taarruzunu 3.500 kayıpla geri püskürttü.',
      'Sâbis yenilgisi Aylmer\'in görevden alınmasına yol açtı. Savunma 6.',
      KUT,
    ),
    cmd(
      'townshend', 'Charles Townshend', 'Tümgeneral', 'ingiliz', 'entente', 'kara',
      [5, 3, 2, 2], ['taarruz_ruhu', 'israfci'], '1914-11-06',
      '6. (Puna) Hint Tümeni Komutanı. Bağdat\'a ilerlerken Selman-ı Pak\'ta ' +
      'durduruldu, Kut\'a sığındı ve 147 gün sonra teslim oldu.',
      'İkmal hattını aşan ilerleyiş: taarruz 5, planlama 2.',
      KUT, '1916-04-29',
    ),
    cmd(
      'aylmer', 'Fenton Aylmer', 'Korgeneral', 'ingiliz', 'entente', 'kara',
      [4, 3, 2, 2], ['israfci'], '1915-12-10',
      'Dicle Kolordusu Komutanı. Dört ayda üç kurtarma taarruzu denedi; ' +
      'Sağ Sahil, Vadi ve Felahiye\'de toplam 8.600\'den fazla kayıp verdi. ' +
      'Sâbis\'ten sonra 12 Mart 1916\'da azledildi.',
      'Dar geçitte cepheden taarruzu tekrarladı: planlama 2.',
      KUT, '1916-03-12',
    ),
    cmd(
      'gorringe', 'George Gorringe', 'Korgeneral', 'ingiliz', 'entente', 'kara',
      [4, 4, 3, 3], ['agir_kanli'], '1916-03-12',
      'Aylmer\'in yerine Dicle Kolordusu Komutanı. 5 Nisan\'da Felahiye, ' +
      'Beit Asia ve Sannaiyat\'a taarruz etti; 22 Nisan\'a kadar ilerleyemedi.',
      'Son kurtarma denemesi de kırıldı. Dengeli-düşük puanlar.',
      KUT, '1916-04-29',
    ),
    cmd(
      'maude', 'Stanley Maude', 'Korgeneral', 'ingiliz', 'entente', 'kara',
      [5, 5, 6, 6], ['lojistikci', 'temkinli'], '1916-08-28',
      'Irak\'taki İngiliz kuvvetlerinin başına getirildi. Önce ikmal ve ' +
      'nehir ulaşımını düzeltti, sonra taarruza geçti: 23 Şubat 1917\'de ' +
      'Kut\'u, 11 Mart 1917\'de Bağdat\'ı aldı.',
      'Cepheyi kaybettiren şey ikmaldi; onu düzelten komutan kazandı. ' +
      'Lojistik ve planlama 6.',
      IRAK,
    ),
  ],

  events: [
    {
      id: 'irak_fao',
      date: '1914-11-06',
      title: 'Fao Çıkarması',
      body:
        'İngiliz-Hint kuvvetleri Şattülarap\'ın ağzındaki Fao\'ya çıktı. ' +
        'Hedef Abadan petrol rafinerisini ve İran petrol hattını korumaktı. ' +
        'Irak\'ta o sırada yalnız iki zayıf Osmanlı tümeni vardı; ' +
        '22 Kasım\'da Basra düştü.',
      kind: 'kara',
      src: IRAK,
    },
    {
      id: 'irak_selmanpak',
      date: '1915-11-22',
      title: 'Selman-ı Pak — Bağdat Yolu Kapandı',
      body:
        '6. (Puna) Hint Tümeni Bağdat\'a ilerlerken 22-25 Kasım 1915\'te ' +
        'Selman-ı Pak\'ta (Tizpon) durduruldu. Townshend muharebeyi ' +
        'kazanamayınca geri çekildi ve 3 Aralık\'ta Kut kasabasına sığındı.',
      kind: 'kara',
      src: KUT,
    },
    {
      id: 'irak_kusatma',
      date: '1915-12-07',
      title: 'Kûtü\'l-Amâre Kuşatması Başladı',
      body:
        'Bağdat\'ın 160 kilometre güneyinde, nüfusu 6.500 olan Kut ' +
        'kasabasında 8.000 kişilik İngiliz-Hint garnizonu kuşatıldı. ' +
        'Kuşatma 147 gün sürecek.',
      kind: 'kara',
      src: KUT,
    },
    {
      id: 'irak_sagsahil',
      date: '1916-01-06',
      title: 'Sağ Sahil — İlk Kurtarma Denemesi',
      body:
        'Aylmer\'in 19.000 kişilik Dicle Kolordusu Ali Garbi\'den taarruza ' +
        'geçti ve 4.262 ölü-yaralı vererek geri çekildi. Bu muharebeden ' +
        'sonra Sakallı Nurettin Bey görevden alındı, yerine Halil Paşa geldi.',
      kind: 'kara',
      src: KUT,
    },
    {
      id: 'irak_felahiye',
      date: '1916-01-21',
      title: 'Felahiye — Dar Geçit',
      body:
        'Osmanlı ordusu Dicle ile Suwaikiya bataklığı arasında daralan kuru ' +
        'geçitte mevzilendi. 20-21 Ocak\'ta 20 bin kişilik İngiliz kuvveti ' +
        '2.741 kayıpla geri atıldı. İyi yerleştirilmiş makineli tüfek ' +
        'yuvaları kurtarma kuvvetini Ali Garbi üssüne çekilmeye zorladı.',
      kind: 'kara',
      src: KUT,
    },
    {
      id: 'irak_sabis',
      date: '1916-03-08',
      title: 'Sâbis — Aylmer Azledildi',
      body:
        'Aylmer, Sâbis (Dujaila) mevkiinde Miralay Ali İhsan Bey\'in ' +
        '13. Kolordusuna taarruz etti ve 3.500 asker kaybederek çekildi. ' +
        '12 Mart\'ta görevden alındı; yerine General Gorringe getirildi.',
      kind: 'kara',
      src: KUT,
    },
    {
      id: 'irak_havadan_ikmal',
      date: '1916-04-05',
      title: 'Tarihteki İlk Havadan İkmal',
      body:
        'Kut garnizonuna Ora üssünden üç Short 184 deniz uçağıyla 26 gün ' +
        'boyunca havadan yiyecek ve mühimmat atıldı — bilinen ilk havadan ' +
        'ikmal harekâtı. Paketlerin çoğu Osmanlı siperlerine ya da Dicle\'ye ' +
        'düştü; sonucu değiştirmedi.',
      kind: 'ikmal',
      src: KUT,
    },
    {
      id: 'irak_goltz',
      date: '1916-04-19',
      title: 'Von der Goltz Paşa Öldü',
      body:
        '6. Ordu Komutanı Mareşal Colmar von der Goltz Paşa, Bağdat\'taki ' +
        'karargâhında tifüsten öldü. Yerine Mirliva Halil Paşa getirildi — ' +
        'teslimden on gün önce.',
      kind: 'siyasi',
      src: KUT,
    },
    {
      id: 'irak_teslim',
      date: '1916-04-29',
      title: '29 NİSAN — Kut Teslim Oldu',
      body:
        'Townshend 481 subay ve yaklaşık 13.000 erle teslim oldu. İngilizler ' +
        'garnizonun serbest bırakılması için 2 milyon sterlin teklif etti; ' +
        'pazarlığa gönderilen heyette T. E. Lawrence da vardı. Enver Paşa ' +
        'teklifi kamuoyuna açıklayarak reddetti.\n\n' +
        'Teslim olan general sayısında kaynaklar çelişir: aynı kaynakta hem ' +
        '"4 general" hem "5 general" geçer, Halil Paşa\'nın ordu mesajı ise ' +
        '"13 general" der. Subay ve er sayıları tutarlıdır.',
      kind: 'kara',
      src: KUT,
    },
    {
      id: 'irak_maude_bagdat',
      date: '1917-03-11',
      title: 'Bağdat Düştü',
      body:
        'General Maude önce nehir ulaşımını ve ikmali düzeltti, sonra ' +
        'taarruza geçti: 23 Şubat 1917\'de Kut\'u geri aldı, 11 Mart\'ta ' +
        'Bağdat\'a girdi. Cepheyi kaybettiren şey ikmaldi; onu düzelten ' +
        'taraf kazandı.',
      kind: 'kara',
      src: IRAK,
    },
  ],
};
