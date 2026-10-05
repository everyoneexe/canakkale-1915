import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Sina ve Filistin Cephesi — Süveyş'ten Halep'e.
 *
 * Cephe iki Kanal harekâtıyla başlar, 1917'de Gazze-Birüssebi hattında
 * kırılır, 19 Eylül 1918'de Nablus'ta (İngiliz adıyla Megiddo) çöker.
 *
 * SAYILAR kaynakta iki tarafın karşılaştırmalı gücü olarak veriliyor ve
 * öyle yazıldı: 19 Eylül 1918'de İngilizler 12.000 süvari, 57.000 piyade,
 * 540 top; Türkler 3.000 süvari, 32.000 piyade, 402 top.
 */

const SF = 'https://tr.wikipedia.org/wiki/Sina_ve_Filistin_Cephesi';

const OS = 'Ottoman Empire';
const UK = 'United Kingdom of Great Britain and Ireland';
const IN = 'India';
const AU = 'Australia';

export const SINA_FILISTIN_PACK: FrontPack = {
  theatre: 'ww1_sina_filistin',

  formations: [
    // ── Osmanlı 4. Ordu — Kanal harekâtları ──
    { nation: OS, name: '8. Kolordu Karargâhı', templateId: 'os_piyade_tumen', at: [36.29, 33.51], src: SF },
    { nation: OS, name: '25. Tümen', templateId: 'os_piyade_tumen', at: [34.26, 31.22], src: SF },
    { nation: OS, name: '10. Tümen', templateId: 'os_piyade_tumen', at: [34.47, 31.50], src: SF },
    { nation: OS, name: '23. Tümen', templateId: 'os_piyade_tumen', at: [35.22, 31.78], src: SF },
    { nation: OS, name: 'Çöl Deve Müfrezesi', templateId: 'os_suvari_tugay', at: [34.26, 31.22], src: SF },
    { nation: OS, name: 'Kanal Ağır Topçu Alayı', templateId: 'os_agir_topcu', at: [34.47, 31.50], src: SF },
    // ── Gazze-Birüssebi hattı, 1917 ──
    { nation: OS, name: 'Gazze Mevzi Kuvveti', templateId: 'os_piyade_tumen', at: [34.47, 31.50], arrivesOn: '1917-03-01', src: SF },
    { nation: OS, name: '3. Kolordu — Birüssebi', templateId: 'os_piyade_tumen', at: [34.79, 31.25], arrivesOn: '1917-03-01', src: SF },
    // ── Yıldırım Orduları Grubu, 1917 sonu ──
    { nation: OS, name: '7. Ordu — Nablus', templateId: 'os_piyade_tumen', at: [35.26, 32.22], arrivesOn: '1917-10-01', src: SF },
    { nation: OS, name: '8. Ordu — Tul-Karm', templateId: 'os_piyade_tumen', at: [35.03, 32.31], arrivesOn: '1917-10-01', src: SF },
    { nation: OS, name: '20. Tümen', templateId: 'os_piyade_tumen', at: [35.03, 32.31], arrivesOn: '1917-10-01', src: SF },
    { nation: OS, name: '53. Tümen', templateId: 'os_piyade_tumen', at: [35.40, 32.15], arrivesOn: '1917-11-01', src: SF },
    { nation: OS, name: 'Asya Kolordusu', templateId: 'os_piyade_alay', at: [35.30, 32.70], arrivesOn: '1918-03-01', src: SF },
    // 4. Ordu Şeria'nın doğusunda — Es-Salt ve Amman.
    { nation: OS, name: '4. Ordu — Es-Salt', templateId: 'os_piyade_tumen', at: [35.73, 32.04], arrivesOn: '1918-02-01', src: SF },
    { nation: OS, name: 'Maan Garnizonu', templateId: 'os_piyade_alay', at: [35.73, 30.19], arrivesOn: '1918-02-01', src: SF },

    // ── Britanya İmparatorluğu — Kanal savunması, 1915 ──
    { nation: IN, name: '10. Hint Tümeni', templateId: 'uk_piyade_tumen', at: [32.27, 30.59], src: SF },
    { nation: IN, name: '11. Hint Tümeni', templateId: 'uk_piyade_tumen', at: [32.30, 31.26], src: SF },
    { nation: IN, name: 'Bikaner Deve Kolordusu', templateId: 'hint_tugay', at: [32.27, 30.59], src: SF },
    { nation: IN, name: 'İmparatorluk Hizmet Süvari Tugayı', templateId: 'hint_tugay', at: [31.24, 30.04], src: SF },
    // ── Mısır Sefer Kuvvetleri, 1917 ──
    { nation: UK, name: 'XXI. Kolordu', templateId: 'uk_piyade_tumen', at: [34.40, 31.35], arrivesOn: '1917-06-28', src: SF },
    { nation: UK, name: 'XX. Kolordu', templateId: 'uk_piyade_tumen', at: [34.60, 31.25], arrivesOn: '1917-06-28', src: SF },
    { nation: AU, name: 'Çöl Atlı Kolordusu', templateId: 'anzac_tumen', at: [34.60, 31.20], arrivesOn: '1917-06-28', src: SF },
    { nation: UK, name: '52. Tümen', templateId: 'uk_piyade_tumen', at: [34.40, 31.35], arrivesOn: '1917-03-01', src: SF },
    { nation: UK, name: '74. Tümen', templateId: 'uk_piyade_tumen', at: [34.40, 31.35], arrivesOn: '1917-03-01', src: SF },
    // 1918 takviyesi: Batı Cephesi'ne giden birliklerin yerine Hint taburları.
    { nation: IN, name: '3. (Lahor) Hint Tümeni', templateId: 'uk_piyade_tumen', at: [34.90, 31.90], arrivesOn: '1918-06-01', src: SF },
    { nation: IN, name: '7. (Meerut) Hint Tümeni', templateId: 'uk_piyade_tumen', at: [34.90, 31.90], arrivesOn: '1918-06-01', src: SF },
  ],

  commanders: [
    cmd(
      'cemal_pasa', 'Cemal Paşa', 'Birinci Ferik', 'osmanli', 'ottoman', 'kara',
      [4, 4, 3, 4], ['taarruz_ruhu'], '1915-02-03',
      '4. Ordu Komutanı ve Suriye Valisi. 1915 ve 1916\'da iki Kanal ' +
      'harekâtını yönetti; ikisi de Süveyş\'i alamadı.',
      'Çölü geçip kanala ulaşmak başarıydı, geçmek başka iş: taarruz 4, ' +
      'planlama 3.',
      SF,
    ),
    cmd(
      'falkenhayn', 'Erich von Falkenhayn', 'Mareşal', 'alman', 'ottoman', 'kara',
      [4, 4, 4, 3], ['temkinli'], '1917-09-01',
      'Yıldırım Orduları Grubu Komutanı. Önce Bağdat\'ı geri alma projesini ' +
      'savundu; Mustafa Kemal ve Cemal Paşa buna karşı çıktı. Filistin\'i ' +
      'gezdikten sonra planı erteledi. 25 Şubat 1918\'de görevden alındı.',
      'Kudüs yenilgisinin sorumlusu sayıldı. Dengeli-düşük puanlar.',
      SF, '1918-02-25',
    ),
    cmd(
      'liman_filistin', 'Otto Liman von Sanders', 'Mareşal', 'alman', 'ottoman', 'kara',
      [3, 5, 5, 4], ['temkinli', 'inatci_savunma'], '1918-03-01',
      'Yıldırım Orduları Grubu Komutanı, 25 Şubat 1918\'den itibaren. ' +
      'Nablus\'ta karargâhını 80 km geriye, Nasıra\'ya kurmuştu; 20 Eylül\'de ' +
      'İngiliz süvarisini kapısında bulup apar topar kaçtı.',
      'Mart ve Nisan 1918\'de Allenby\'nin iki Amman taarruzunu kırdırdı: ' +
      'savunma 5. Megiddo\'da karargâh yerleşimi felaket oldu.',
      SF,
    ),
    cmd(
      'mustafa_kemal_filistin', 'Mustafa Kemal Paşa', 'Mirliva', 'osmanli', 'ottoman', 'kara',
      [5, 6, 6, 4], ['inatci_savunma', 'ilham_veren'], '1918-08-07',
      '7. Ordu Komutanı (ikinci kez). Nablus bozgununda orduyu tahliye ' +
      'edip Halep\'e çekti. 31 Ekim 1918\'de Yıldırım Orduları Grubu ' +
      'Komutanlığını devraldı.',
      '3 Ekim 1918\'de Liman von Sanders\'e "Elde kalan 7. Ordu bir enkazdan ' +
      'ibarettir" diyerek kuzeye çekilmeyi dayattı. Planlama 6.',
      SF,
    ),
    cmd(
      'ismet_bey', 'İsmet Bey (İnönü)', 'Albay', 'osmanli', 'ottoman', 'kara',
      [4, 5, 5, 4], ['siper_ustasi'], '1917-10-01',
      '3. Kolordu Komutanı. 31 Ekim 1917 akşamı Birüssebi\'de yenildi; ' +
      'cephenin sol kanadı çöktü ve Gazze boşaltıldı.',
      'Çöl kanadını iki kat üstün kuvvete karşı tutmaya çalıştı. ' +
      'Savunma ve planlama 5.',
      SF,
    ),
    cmd(
      'murray', 'Archibald Murray', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [3, 4, 3, 5], ['agir_kanli', 'lojistikci'], '1916-03-01',
      'Mısır Sefer Kuvvetleri Komutanı. Sina\'da demiryolu ve su hattını ' +
      'döşeyerek orduyu Filistin sınırına taşıdı, ama Gazze önünde ' +
      'takıldı ve Haziran 1917\'de değiştirildi.',
      'Cepheyi mümkün kılan altyapıyı o kurdu: lojistik 5, taarruz 3.',
      SF, '1917-06-28',
    ),
    cmd(
      'allenby', 'Edmund Allenby', 'Orgeneral', 'ingiliz', 'entente', 'kara',
      [6, 5, 6, 5], ['taarruz_ruhu', 'cikarma_uzmani'], '1917-06-28',
      'Mısır Sefer Kuvvetleri Komutanı, Haziran 1917\'den itibaren. ' +
      '27 Ekim 1917\'de Gazze-Birüssebi hattını kırdı, 9 Aralık\'ta Kudüs\'e ' +
      'girdi, 19 Eylül 1918\'de Nablus\'ta cepheyi çökertti.',
      '38 günde 560 kilometre ilerledi. Taarruz ve planlama 6.',
      SF,
    ),
    cmd(
      'chauvel', 'Harry Chauvel', 'Korgeneral', 'anzac', 'entente', 'kara',
      [6, 3, 5, 4], ['taarruz_ruhu'], '1917-07-01',
      'Çöl Atlı Kolordusu Komutanı. Megiddo\'da kıyı boyunca geçip ' +
      'Afulah, Nasıra ve Bisan\'a ilerledi; iki Osmanlı ordusunun geri ' +
      'çekilme hattını kesti.',
      'Yarmayı sömüren kuvvet onundu: taarruz 6, savunma 3.',
      SF,
    ),
  ],

  events: [
    {
      id: 'sf_kanal1',
      date: '1915-02-03',
      title: 'Birinci Kanal Harekâtı',
      body:
        'Cemal Paşa\'nın 4. Ordusu Sina çölünü geçip Süveyş Kanalı\'na ' +
        'ulaştı. Hedef kanalı ele geçirip Mısır\'a yeniden sahip olmak, ' +
        'böylece İngilizlerin Uzak Doğu sömürgeleriyle bağlantısını ' +
        'kesmekti. Kanalın batı yakasındaki İngiliz-Hint savunması ve ' +
        'kanaldaki gemi topları geçişi engelledi.',
      kind: 'kara',
      src: SF,
    },
    {
      id: 'sf_kanal2',
      date: '1916-08-04',
      title: 'İkinci Kanal Harekâtı',
      body:
        'İkinci Kanal harekâtı da kanalı alamadı. Bundan sonra inisiyatif ' +
        'el değiştirdi: General Murray Sina\'ya demiryolu ve su hattı ' +
        'döşeyerek orduyu Filistin sınırına taşıdı. Cephe bir daha ' +
        'Süveyş\'e yaklaşmadı.',
      kind: 'kara',
      src: SF,
    },
    {
      id: 'sf_birussebi',
      date: '1917-10-31',
      title: 'Birüssebi Düştü',
      body:
        'Allenby 27 Ekim sabahı Gazze\'yi bombardımanla dövdü; aynı akşam ' +
        'cephenin sol kanadındaki Birüssebi\'ye yüklendi. 31 Ekim akşamı ' +
        'Albay İsmet Bey yenildi ve Birüssebi İngilizlerin eline geçti. ' +
        'Osmanlı cephesi tehlikeli duruma düştü.',
      kind: 'kara',
      src: SF,
    },
    {
      id: 'sf_gazze',
      date: '1917-11-07',
      title: 'Gazze Boşaltıldı',
      body:
        'Sol kanat çökünce 5 Kasım\'da Gazze boşaltıldı; 7 Kasım\'da ' +
        'İngilizler şehre girdi. 15 Kasım\'da Yafa da alınınca Osmanlı ' +
        'kuvvetleri Kudüs\'e doğru çekildi.',
      kind: 'kara',
      src: SF,
    },
    {
      id: 'sf_kudus',
      date: '1917-12-09',
      title: 'Kudüs Düştü',
      body:
        'Kudüs önünde kurulan savunma Allenby\'yi bir süre durdurdu. ' +
        'Allenby kuvvetlerini toplayıp 8 Aralık\'ta taarruza geçti ve ' +
        '9 Aralık 1917\'de Kudüs\'ü aldı. Mekke ve Bağdat\'tan sonra ' +
        'düşman eline geçen üçüncü mukaddes şehirdi.',
      kind: 'kara',
      src: SF,
    },
    {
      id: 'sf_liman',
      date: '1918-02-25',
      title: 'Liman von Sanders Yıldırım\'ın Başına',
      body:
        'Kudüs yenilgisinden dört ay sonra Falkenhayn görevden alındı; ' +
        'Yıldırım Orduları Grubu Komutanlığına Otto Liman von Sanders ' +
        'atandı. 1 Mart\'ta cepheye ulaştı ve 7. Ordu karargâhını ' +
        'Amman\'dan Nablus\'a geri aldı.',
      kind: 'siyasi',
      src: SF,
    },
    {
      id: 'sf_amman',
      date: '1918-05-04',
      title: 'Amman — İki Taarruz da Kırıldı',
      body:
        'Allenby 26 Mart\'ta Şeria\'yı geçip El-Salt\'ı aldı ama Amman ' +
        'savunmasını kıramadı; 1 Nisan\'da nehre çekildi. 30 Nisan\'daki ' +
        'ikinci denemede de dört günlük muharebeden sonra geri püskürtüldü. ' +
        'İngiliz kuvveti 110.000, Osmanlı kuvveti 46.000 civarındaydı.',
      kind: 'kara',
      src: SF,
    },
    {
      id: 'sf_bati_cephesi',
      date: '1918-05-15',
      title: 'En İyi Birlikler Fransa\'ya Gitti',
      body:
        'Alman Bahar Taarruzu İngiliz ordusuna 418.000 kayıp verdirince ' +
        'Filistin ikinci plana düştü. Allenby, Mayıs-Ağustos arasında ' +
        '60.000 askerini — iki piyade tümeni, 9 Yeomanry alayı, 23 tabur — ' +
        'Batı Cephesi\'ne yollamak zorunda kaldı. Boşluğu Hint taburlarıyla ' +
        'doldurdu; birliklerinin üçte biri hiç savaş görmemişti.',
      kind: 'siyasi',
      src: SF,
    },
    {
      id: 'sf_nablus',
      date: '1918-09-19',
      title: '19 EYLÜL — Nablus (Megiddo)',
      body:
        'Karşılaştırmalı güç: İngilizler 12.000 süvari, 57.000 piyade, ' +
        '540 top; Türkler 3.000 süvari, 32.000 piyade, 402 top.\n\n' +
        'İlk 36 saatte 8. Ordu dayanamadı ve cephe XXI. Kolordu tarafından ' +
        'yarıldı. Çöl Atlı Kolordusu kıyıdan geçip Afulah, Nasıra ve ' +
        'Bisan\'a ilerleyerek geri çekilme hatlarını kesti. 21 Eylül\'de ' +
        'RAF, Vadi el Fara yolunda çekilen 7. Ordu kolunu bir saatte ' +
        'dağıttı — enkaz 10 kilometre boyunca uzanıyordu.',
      kind: 'kara',
      src: SF,
    },
    {
      id: 'sf_sam',
      date: '1918-10-01',
      title: 'Şam Düştü',
      body:
        '27 Eylül\'de Dera, Lawrence komutasındaki Arap birliklerine ' +
        'bırakıldı. Avustralya süvarisi 30 Eylül\'de Barada geçidinde ' +
        'Şam garnizonunu yakaladı; şehir ertesi gün düştü. Harekât ' +
        'toplam 75.000 Osmanlı askerinin esir düşmesiyle sonuçlandı.',
      kind: 'kara',
      src: SF,
    },
    {
      id: 'sf_halep',
      date: '1918-10-26',
      title: 'Halep — 38 Günde 560 Kilometre',
      body:
        '5. Süvari Tümeni ve Kuzey Arap Ordusu müfrezeleri 26 Ekim\'de ' +
        'Halep\'i aldı. Mustafa Kemal Paşa\'nın telgrafı üzerine kurulan ' +
        'Ahmet İzzet Paşa kabinesi 30 Ekim\'de Mondros Mütarekesi\'ni ' +
        'imzaladı. 31 Ekim\'de Liman von Sanders Yıldırım Orduları Grubu ' +
        'Komutanlığını Mustafa Kemal Paşa\'ya devretti.',
      kind: 'siyasi',
      src: SF,
    },
  ],
};
