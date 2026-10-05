import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Balkan Cephesi — savaşın başladığı yer.
 *
 * 1914'te Sırbistan üç Avusturya-Macaristan taarruzunu püskürttü. 1915'te
 * Avusturya-Macaristan ve Almanya 6 Ekim'de kuzeyden saldırdı, Bulgaristan
 * 14 Ekim'de savaş ilan edip doğudan girdi; Sırp ordusu Karadağ ve
 * Arnavutluk dağlarından çekildi. Cephe 1918'e kadar Selanik'te sürdü.
 *
 * Tarihler ve birlik adları 1915 seferi maddesinden; 1914 muharebeleri
 * Sırbistan Seferi maddesinden alındı.
 */

const SRB15 = 'https://en.wikipedia.org/wiki/Serbian_campaign_(1915)';
const SRB = 'https://tr.wikipedia.org/wiki/Sırbistan_Seferi_(I._Dünya_Savaşı)';
const SEL = 'https://tr.wikipedia.org/wiki/Makedonya_Cephesi';

const RS = 'Serbia';
const AT = 'Austro-Hungarian Empire';
const DE = 'German Empire';
const BG = 'Bulgaria';
const FR = 'France';
const UK = 'United Kingdom of Great Britain and Ireland';

export const BALKAN_PACK: FrontPack = {
  theatre: 'ww1_balkan',

  formations: [
    // ── Sırp Ordusu, 1914 ──
    // Putnik komutasında üç ordu; Mišić, Stepanović ve Jurišić Šturm.
    { nation: RS, name: '1. Ordu — Mišić', templateId: 'rs_piyade_tumen', at: [20.46, 44.79], src: SRB15 },
    { nation: RS, name: '2. Ordu — Stepanović', templateId: 'rs_piyade_tumen', at: [19.69, 44.66], src: SRB15 },
    { nation: RS, name: '3. Ordu — Jurišić Šturm', templateId: 'rs_piyade_tumen', at: [19.22, 44.35], src: SRB15 },
    { nation: RS, name: 'Belgrad Savunma Grubu', templateId: 'rs_piyade_tumen', at: [20.46, 44.82], src: SRB15 },
    { nation: RS, name: 'Timok Grubu', templateId: 'rs_piyade_tumen', at: [22.30, 43.90], src: SRB15 },
    { nation: RS, name: 'Niş Garnizonu', templateId: 'rs_piyade_tumen', at: [21.90, 43.32], src: SRB15 },
    // Karadağ ordusu — Vukotić.
    { nation: 'Montenegro', name: 'Karadağ Ordusu — Vukotić', templateId: 'rs_piyade_tumen', at: [19.26, 42.44], src: SRB15 },

    // ── Avusturya-Macaristan ──
    { nation: AT, name: '5. Ordu — Balkan', templateId: 'at_piyade_tumen', at: [19.10, 44.90], src: SRB },
    { nation: AT, name: '6. Ordu — Drina', templateId: 'at_piyade_tumen', at: [19.30, 44.40], src: SRB },
    // 1915 seferinin kuzey kolu.
    { nation: AT, name: '3. Ordu — Kövess', templateId: 'at_piyade_tumen', at: [20.40, 44.95], arrivesOn: '1915-10-06', src: SRB15 },
    { nation: DE, name: '11. Ordu — Gallwitz', templateId: 'de_piyade_tumen', at: [21.20, 44.70], arrivesOn: '1915-10-06', src: SRB15 },

    // ── Bulgaristan — 14 Ekim 1915 ──
    { nation: BG, name: '1. Ordu — Boyadzhiev', templateId: 'bg_piyade_tumen', at: [22.70, 43.40], arrivesOn: '1915-10-14', src: SRB15 },
    { nation: BG, name: '2. Ordu — Todorov', templateId: 'bg_piyade_tumen', at: [22.40, 42.20], arrivesOn: '1915-10-14', src: SRB15 },

    // ── Selanik cephesi — İtilaf çıkarması ──
    { nation: FR, name: 'Fransız 156. Tümeni', templateId: 'fr_piyade_tumen', at: [22.94, 40.64], arrivesOn: '1915-10-05', src: SRB15 },
    { nation: UK, name: 'İngiliz 10. (İrlanda) Tümeni', templateId: 'uk_piyade_tumen', at: [22.94, 40.64], arrivesOn: '1915-10-05', src: SRB15 },
    { nation: FR, name: 'Doğu Ordusu — Sarrail', templateId: 'fr_piyade_tumen', at: [22.70, 41.10], arrivesOn: '1916-01-01', src: SEL },
    { nation: RS, name: 'Yeniden Kurulan Sırp Ordusu', templateId: 'rs_piyade_tumen', at: [22.50, 41.00], arrivesOn: '1916-05-01', src: SEL },
  ],

  commanders: [
    cmd(
      'putnik', 'Radomir Putnik', 'Mareşal', 'sirp', 'entente', 'kara',
      [4, 6, 6, 3], ['inatci_savunma', 'temkinli'], '1914-07-28',
      'Sırp Genelkurmay Başkanı. 1914\'te üç Avusturya-Macaristan taarruzunu ' +
      'püskürttü. 1915 çekilişinde hasta olduğu için yol boyunca ' +
      'taşındı; on beş ay sonra Fransa\'da öldü.',
      'Sayıca ve malzemece üstün düşmanı bir yıl durdurdu: savunma ve ' +
      'planlama 6.',
      SRB15,
    ),
    cmd(
      'misic', 'Živojin Mišić', 'Mareşal', 'sirp', 'entente', 'kara',
      [5, 6, 5, 3], ['taarruz_ruhu', 'inatci_savunma'], '1914-07-28',
      '1. Ordu Komutanı. Aralık 1914\'te Kolubara\'da karşı taarruza geçip ' +
      'Belgrad\'ı geri aldı.',
      'Çekilmenin dibinde karşı taarruz kararı: taarruz 5, savunma 6.',
      SRB,
    ),
    cmd(
      'mackensen_balkan', 'August von Mackensen', 'Mareşal', 'alman', 'ottoman', 'kara',
      [6, 4, 6, 5], ['taarruz_ruhu', 'lojistikci'], '1915-10-06',
      '1915 Sırbistan Seferi\'nin başkomutanı. Alman 11., Avusturya-Macar 3. ' +
      've Bulgar 1. Ordularını tek komuta altında yönetti.',
      'Üç ulusun ordusunu eşgüdümle kullandı: planlama 6.',
      SRB15,
    ),
    cmd(
      'boyadzhiev', 'Kliment Boyadzhiev', 'Korgeneral', 'bulgar', 'ottoman', 'kara',
      [5, 4, 4, 4], ['taarruz_ruhu'], '1915-10-14',
      'Bulgar 1. Ordu Komutanı. Niş istikametinde ilerleyip Alman 11. Ordusu ' +
      'ile birleşmekle görevlendirildi.',
      'Sırp Timok grubunu geri atıp kuşatmayı kapattı: taarruz 5.',
      SRB15,
    ),
    cmd(
      'todorov', 'Georgi Todorov', 'Korgeneral', 'bulgar', 'ottoman', 'kara',
      [5, 5, 5, 4], ['taarruz_ruhu'], '1915-10-14',
      'Bulgar 2. Ordu Komutanı. Makedonya\'ya girip Niş-Selanik demiryolunu ' +
      '16 Ekim\'de kesti; Sırbistan\'a İtilaf yardımının yolunu kapattı.',
      'Seferin stratejik sonucunu belirleyen hareket: planlama 5.',
      SRB15,
    ),
    cmd(
      'sarrail', 'Maurice Sarrail', 'Orgeneral', 'fransiz', 'entente', 'kara',
      [4, 4, 3, 4], ['agir_kanli'], '1915-10-05',
      'Selanik\'teki Doğu Ordusu Komutanı. Vardar boyunca kuzeye ilerledi ' +
      'ama Bulgar 2. Ordusuyla çarpışınca geri çekildi.',
      'Sırbistan\'a zamanında ulaşamadı: dengeli-düşük puanlar.',
      SRB15,
    ),
  ],

  events: [
    {
      id: 'blk_savas_ilani',
      date: '1914-07-28',
      title: '28 TEMMUZ — Savaş Burada Başladı',
      body:
        'Avusturya-Macaristan, Saraybosna suikastının ardından Sırbistan\'a ' +
        'savaş ilan etti. İttifak zinciri bir hafta içinde bütün Avrupa\'yı ' +
        've sömürge imparatorluklarını içine çekti.',
      kind: 'siyasi',
      src: SRB15,
    },
    {
      id: 'blk_cer',
      date: '1914-08-16',
      title: 'Cer — İtilaf\'ın İlk Zaferi',
      body:
        'Sırp ordusu Cer dağında Avusturya-Macaristan taarruzunu püskürttü. ' +
        'Bu, savaşta İtilaf Devletleri\'nin kazandığı ilk meydan ' +
        'muharebesidir.',
      kind: 'kara',
      src: SRB,
    },
    {
      id: 'blk_kolubara',
      date: '1914-12-03',
      title: 'Kolubara — Belgrad Geri Alındı',
      body:
        'Cephanesi tükenmek üzereyken Mišić karşı taarruza geçti. ' +
        'Avusturya-Macaristan ordusu Sırbistan\'dan tamamen atıldı; ' +
        '1914 seferi 14 Aralık\'ta Sırp zaferiyle bitti. Ancak galip ' +
        'tarafın kaybı da ağırdı: 170.000 kayıp küçük bir krallık için ' +
        'taarruz gücünü bitiren bir orandı.',
      kind: 'kara',
      src: SRB15,
    },
    {
      id: 'blk_tifus',
      date: '1915-03-01',
      title: 'Tifüs Salgını',
      body:
        'Avusturya-Macarların bıraktığı hasta ve yaralılardan yayılan ' +
        'tifüs salgını 135.000 Sırp\'ın ölümüne yol açtı — muharebe ' +
        'kayıplarını aşan bir rakam.',
      kind: 'ikmal',
      src: SRB15,
    },
    {
      id: 'blk_istila',
      date: '1915-10-06',
      title: '6 EKİM — Kuzeyden İstila',
      body:
        'Mackensen komutasındaki Alman 11. ve Avusturya-Macar 3. Orduları, ' +
        '300.000 kişiyle Tuna, Drina ve Sava\'ya doğru ilerledi. Belgrad ' +
        '9 Ekim\'de düştü. Putnik kuzeyde yalnız dört tümen ' +
        'bulundurabiliyordu.',
      kind: 'kara',
      src: SRB15,
    },
    {
      id: 'blk_bulgaristan',
      date: '1915-10-14',
      title: 'Bulgaristan Savaş İlan Etti',
      body:
        'Bulgaristan 11 Ekim\'de savaş ilan etmeden sınır saldırılarına ' +
        'başlamış, 14 Ekim\'de resmen savaş ilan etmişti. 1. Ordu Niş\'e, ' +
        '2. Ordu Makedonya\'ya yürüdü ve 16 Ekim\'de Niş-Selanik ' +
        'demiryolunu kesti: İtilaf yardımının yolu kapandı.',
      kind: 'siyasi',
      src: SRB15,
    },
    {
      id: 'blk_arnavutluk',
      date: '1915-11-25',
      title: 'Arnavutluk Golgotası',
      body:
        'Kuşatmadan kurtulmak için hükümet ve başkomutanlık, Karadağ ve ' +
        'Arnavutluk dağlarından Adriyatik\'e çekilme kararı aldı. Kasım ' +
        '1915 - Ocak 1916 arasında 77.455 asker ve 160.000 sivil soğuk, ' +
        'açlık, hastalık ve saldırılardan öldü. Yola çıkan 400.000 kişiden ' +
        'kıyıya 120.000 asker ve 60.000 sivil ulaşabildi.',
      kind: 'kara',
      src: SRB15,
    },
    {
      id: 'blk_dobro_pole',
      date: '1918-09-15',
      title: 'Dobro Pole — Cephe Yarıldı',
      body:
        'Korfu\'da yeniden kurulan Sırp ordusu Fransız kuvvetleriyle ' +
        'birlikte Makedonya cephesini yardı. Bulgar ordusu çözüldü.',
      kind: 'kara',
      src: SEL,
    },
    {
      id: 'blk_selanik_mutarekesi',
      date: '1918-09-29',
      title: 'Selanik Mütarekesi',
      body:
        'Bulgaristan mütareke imzaladı — İttifak Devletleri içinde savaştan ' +
        'ilk çıkan oldu. Osmanlı İmparatorluğu\'nun Avrupa ile kara ' +
        'bağlantısı kesildi; bir ay içinde Mondros imzalanacaktı.',
      kind: 'siyasi',
      src: SEL,
    },
  ],
};
