import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Kafkas Cephesi — Sarıkamış Harekâtı ve sonrası.
 *
 * Muharebe düzeni, komuta kademesi ve tarihler Türkçe Vikipedi'nin
 * Sarıkamış Harekâtı maddesindeki ayrıntılı savaş düzeni tablosundan
 * alındı; o tablo Fahri Belen, Ali İhsan Sabis, Köprülülü Şerif İlden,
 * W. E. D. Allen & Paul Muratoff ve Yavuz Özdemir'e dayanıyor.
 *
 * KAYIP SAYILARI bilerek yazılmadı. Sarıkamış kaybı için kaynaklar
 * 23.000 ile 90.000 arasında değişiyor ve bu, Türk tarih yazımının en
 * tartışmalı sayılarından biri. Oyun kaybı simülasyondan üretir; olay
 * metni tek bir rakamı gerçekmiş gibi sunmaz.
 */

const WIKI = 'https://tr.wikipedia.org/wiki/Sarıkamış_Harekâtı';
const KAFKAS =
  'https://tr.wikipedia.org/wiki/Kafkasya_Cephesi_(I._Dünya_Savaşı)';

const OS = 'Ottoman Empire';
const RU = 'Russia';

export const KAFKAS_PACK: FrontPack = {
  theatre: 'ww1_kafkas',

  // ── Teşkilât ─────────────────────────────────────────────────────
  // 3. Ordu: 94 tabur, ~90.000 asker, 218 top. Tümenler kolordularının
  // 22 Aralık 1914'teki gerçek toplanma bölgelerine konuldu.
  formations: [
    // 9. Kolordu — Ali İhsan Paşa. Kuşa/Pertanos; kuşatmanın iç kolu.
    { nation: OS, name: '17. Tümen', templateId: 'os_piyade_tumen', at: [41.60, 40.05], src: WIKI },
    { nation: OS, name: '28. Tümen', templateId: 'os_piyade_tumen', at: [41.60, 40.05], src: WIKI },
    { nation: OS, name: '29. Tümen', templateId: 'os_piyade_tumen', at: [41.70, 40.10], src: WIKI },

    // 10. Kolordu — Albay Hafız Hakkı Bey. Tortum; dış kuşatma kolu.
    { nation: OS, name: '30. Tümen', templateId: 'os_piyade_tumen', at: [41.55, 40.30], src: WIKI },
    { nation: OS, name: '31. Tümen', templateId: 'os_piyade_tumen', at: [41.55, 40.30], src: WIKI },
    { nation: OS, name: '32. Tümen', templateId: 'os_piyade_tumen', at: [41.62, 40.33], src: WIKI },

    // 11. Kolordu — Tuğgeneral Galip Paşa. Cephede tespit görevinde.
    { nation: OS, name: '18. Tümen', templateId: 'os_piyade_tumen', at: [41.85, 39.97], src: WIKI },
    { nation: OS, name: '33. Tümen', templateId: 'os_piyade_tumen', at: [41.85, 39.97], src: WIKI },
    { nation: OS, name: '34. Tümen', templateId: 'os_piyade_tumen', at: [41.95, 39.95], src: WIKI },

    // 2. Nizamiye Süvari Tümeni — Yusuf İzzet Bey, Aras'ın güneyi.
    { nation: OS, name: '2. Nizamiye Süvari Tümeni', templateId: 'os_suvari_tugay', at: [41.90, 39.85], src: WIKI },
    // Stange Bey Müfrezesi — Arhavi, 10. Kolorduya bağlı.
    { nation: OS, name: 'Stange Bey Müfrezesi', templateId: 'os_piyade_alay', at: [41.31, 41.35], src: WIKI },
    // Erzurum müstahkem mevkii ve ordu ağırlıkları.
    { nation: OS, name: 'Erzurum Ağır Topçu Alayı', templateId: 'os_agir_topcu', at: [41.27, 39.90], src: WIKI },

    // ── Rus Kafkas Ordusu ──
    // Oltu Müfrezesi — General Istomin, 8 tabur.
    { nation: RU, name: 'Oltu Müfrezesi', templateId: 'ru_plastun_tugay', at: [41.99, 40.55], src: WIKI },
    // 2. Türkistan Kolordusu ve 1. Kafkas Kolordusu — General Bergmann.
    { nation: RU, name: '2. Türkistan Kolordusu', templateId: 'ru_piyade_tumen', at: [42.15, 40.05], src: WIKI },
    { nation: RU, name: '1. Kafkas Kolordusu', templateId: 'ru_piyade_tumen', at: [42.30, 40.10], src: WIKI },
    { nation: RU, name: '39. Tümen', templateId: 'ru_piyade_tumen', at: [42.20, 39.98], src: WIKI },
    // Sarıkamış ve Kars gerisi.
    { nation: RU, name: '1. Plastun Tugayı', templateId: 'ru_plastun_tugay', at: [42.59, 40.33], src: WIKI },
    { nation: RU, name: '2. Plastun Tugayı', templateId: 'ru_plastun_tugay', at: [42.10, 39.88], src: WIKI },
    { nation: RU, name: '66. Tümen', templateId: 'ru_piyade_tumen', at: [43.10, 40.60], src: WIKI },
    { nation: RU, name: 'Sibirya Kazak Tugayı', templateId: 'ru_kazak_tugay', at: [43.10, 40.60], src: WIKI },
    // Tiflis'te yeni kurulan ihtiyat — harekât sırasında yetişti.
    {
      nation: RU,
      name: '3. Kafkas Avcı Tugayı',
      templateId: 'ru_plastun_tugay',
      at: [44.83, 41.72],
      arrivesOn: '1914-12-24',
      src: WIKI,
    },
  ],

  // ── Komutanlar ───────────────────────────────────────────────────
  commanders: [
    cmd(
      'hasan_izzet', 'Hasan İzzet Paşa', 'Tümgeneral', 'osmanli', 'ottoman', 'kara',
      [2, 5, 4, 4], ['temkinli', 'inatci_savunma'], '1914-11-01',
      '3. Ordu Komutanı. Kuşatma planını hazırladı ama uygulanmasına karşı ' +
      'çıktı; 18 Aralık 1914 akşamı istifa etti.',
      'Köprüköy\'de kazandıktan sonra 21 Kasım gecesi kar fırtınasında geri ' +
      'çekilme emri verip inisiyatifi kaybetti: taarruz 2. Araziyi ve havayı ' +
      'doğru okuduğu için savunma 5.',
      WIKI, '1914-12-18',
    ),
    cmd(
      'hafiz_hakki', 'Hafız Hakkı Bey', 'Albay', 'osmanli', 'ottoman', 'kara',
      [6, 3, 2, 2], ['taarruz_ruhu', 'israfci'], '1914-12-07',
      '10. Kolordu Komutanı, 7 Aralık 1914\'ten itibaren. Oltu\'da Istomin ' +
      'müfrezesini kovalamayı seçip Bardız\'a yönelmedi; kolordusu ' +
      'Allahüekber dağlarında 19 saatte eridi.',
      'Harekâtın yapılabileceğine Enver Paşa\'yı ikna eden telgrafı o çekti. ' +
      'Taarruz 6, planlama 2 — kolordusunun mevcudu 26 binden 3.200\'e indi.',
      WIKI,
    ),
    cmd(
      'ali_ihsan_sabis', 'Ali İhsan Paşa (Sabis)', 'Tümgeneral', 'osmanli', 'ottoman', 'kara',
      [4, 5, 5, 4], ['temkinli'], '1914-12-09',
      '9. Kolordu Komutanı. Bardız\'da Enver Paşa\'yı taarruzu durdurmaya ' +
      'ikna etti; askerin dinlenmesini savundu.',
      'Kaynaklar ikiye bölünüyor: Guse ve Rus kaynakları o gece devam ' +
      'edilseydi Sarıkamış\'ın alınabileceğini söylüyor. Planlama 5.',
      WIKI,
    ),
    cmd(
      'galip_pasa', 'Galip Paşa', 'Tuğgeneral', 'osmanli', 'ottoman', 'kara',
      [3, 6, 4, 3], ['inatci_savunma', 'siper_ustasi'], '1914-11-01',
      '11. Kolordu Komutanı. Harekât boyunca cephede kaldı; 9. ve 10. ' +
      'Kolordular dağları aşarken Rus ana kuvvetini tek başına tespit etti.',
      'Kasım\'da gereksiz geri çekilme emrini geri aldıran da oydu. ' +
      'Savunma 6.',
      WIKI,
    ),
    cmd(
      'yudenich', 'Nikolay Yudeniç', 'Korgeneral', 'rus', 'entente', 'kara',
      [5, 6, 6, 4], ['temkinli', 'inatci_savunma'], '1914-12-24',
      'Kafkas Ordusu Kurmay Başkanı, sonra Karma Kolordu Komutanı. ' +
      'Türklerin sağ kanadı kuşattığını ilk doğru okuyan komutan; ' +
      'Sarıkamış\'a takviyeyi o yolladı.',
      'Cepheyi kurtaran karar onundu: planlama ve savunma 6.',
      WIKI,
    ),
    cmd(
      'bergmann', 'Georgi Bergmann', 'Tümgeneral', 'rus', 'entente', 'kara',
      [4, 3, 2, 3], ['israfci'], '1914-11-01',
      '1. Kafkas Kolordusu Komutanı. Oltu\'ya yapılan taarruzu önemsiz ' +
      'gördü, kuşatma uyarılarını dikkate almadı.',
      'Türklerin böyle bir kuşatmaya girişebileceğine ihtimal vermedi; ' +
      'Sarıkamış grubu komutanlığından alındı. Planlama 2.',
      WIKI,
    ),
    cmd(
      'myshlayevski', 'Aleksandr Mışlayevski', 'Korgeneral', 'rus', 'entente', 'kara',
      [3, 4, 3, 3], ['agir_kanli'], '1914-12-24',
      'Kafkas Ordusu Başkomutan Yardımcısı. Sarıkamış Grup Komutanlığını ' +
      'üstlendi, sonra cepheyi bırakıp Tiflis\'e döndü.',
      'Yudeniç\'in değerlendirmesini kabul etti ama kriz anında cepheden ' +
      'ayrıldı. Dengeli-düşük puanlar.',
      WIKI,
    ),
  ],

  // ── Olaylar ──────────────────────────────────────────────────────
  events: [
    {
      id: 'kafkas_koprukoy',
      date: '1914-11-07',
      title: 'Köprüköy — İlk Muharebe',
      body:
        'Osmanlı ordusunun Birinci Dünya Savaşı\'nda girdiği ilk meydan ' +
        'muharebesi. 18. ve 34. Tümenler ile 28. Tümen\'in iki alayı, ' +
        '24 tabur hâlinde Rus kuvvetlerini cepheden geri attı. Bu zamana ' +
        'kadar Kafkasya\'da hep taarruz eden Rus komutanları için moral ' +
        'çöküşü oldu.',
      kind: 'kara',
      src: WIKI,
    },
    {
      id: 'kafkas_21kasim',
      date: '1914-11-21',
      title: 'Kar Fırtınasında Geri Çekilme',
      body:
        'Hasan İzzet Paşa, cephanenin azalması ve Narman yönündeki Rus ' +
        'kuvvetleri hakkında abartılı istihbarat üzerine orduyu 15 kilometre ' +
        'geri çekti. O gece çıkan kar fırtınasında ordu ağır zayiat verdi; ' +
        'moral bozuldu, firar arttı. Ruslar bu geri çekilmeyi beklemedikleri ' +
        'için fırsattan yararlanamadı.',
      kind: 'kara',
      src: WIKI,
    },
    {
      id: 'kafkas_enver_devralir',
      date: '1914-12-19',
      title: 'Enver Paşa Orduyu Devraldı',
      body:
        'Hasan İzzet Paşa 18 Aralık akşamı istifa etti: "Ben bu hareketleri ' +
        'icra için nefsimde kuvvet ve itimat göremediğimden…" Enver Paşa ' +
        '3. Ordu komutanlığını üstlendi ve Hasan İzzet\'in hazırladığı ' +
        'kuşatma planını değiştirmeden ordu emri olarak yayımladı. ' +
        'Liman von Sanders, dağ yollarının bu mevsimde karla kapalı ' +
        'olacağını söyleyerek harekâta karşı çıkmıştı.',
      kind: 'siyasi',
      src: WIKI,
    },
    {
      id: 'kafkas_taarruz',
      date: '1914-12-22',
      title: '22 ARALIK — Sarıkamış Taarruzu',
      body:
        '3. Ordu 94 tabur, 90 bin asker ve 218 topla harekete geçti. ' +
        '11. Kolordu cephede gösteri taarruzu yaparken, 9. ve 10. Kolordular ' +
        'Oltu üzerinden Rus sağ kanadının gerisine yürüyecekti. Askerlerin ' +
        'büyük kısmının kışlık kıyafeti yoktu: 3. Ordu\'ya kışlık giysi ' +
        'taşıyan üç vapur 7 Kasım\'da Rus donanması tarafından batırılmıştı.',
      kind: 'kara',
      src: WIKI,
    },
    {
      id: 'kafkas_oltu_dostatesi',
      date: '1914-12-23',
      title: 'Oltu — Dost Ateşi',
      body:
        '31. Tümen, Kaleboğazı\'ndan gelen 32. Tümen\'i Rus birliği sanarak ' +
        'taarruza geçti. Dört saat süren çatışmada iki Osmanlı tümeni ' +
        'birbiriyle savaştı. General Istomin bu arada Oltu\'yu tahliye edip ' +
        'kuvvetlerini kurtardı. Hafız Hakkı Bey morali yükseltmek için ' +
        'kasabanın yağmalanmasına izin verdi; orduyu günlerce besleyecek ' +
        'erzak depoları düzensiz yağmada israf edildi.',
      kind: 'kara',
      src: WIKI,
    },
    {
      id: 'kafkas_allahuekber',
      date: '1914-12-26',
      title: 'Allahüekber Dağları',
      body:
        '30. ve 31. Tümenler gece 3\'te Allahüekber dağlarına girdi. ' +
        'Soğuk, kar ve yolsuzluk içinde 19 saat sonra dağdan çıktıklarında ' +
        'mevcutları 3.200 askere inmişti — harekâta 26 bin kişiyle ' +
        'başlamışlardı. Hafız Hakkı Bey kolordusunu toplamak için iki gün ' +
        'istedi; Enver Paşa derhal Sarıkamış\'a hareket emri verdi.',
      kind: 'kara',
      src: WIKI,
    },
    {
      id: 'kafkas_sarikamis',
      date: '1915-01-06',
      title: 'Sarıkamış Alınamadı',
      body:
        'Kuşatma kapanmadı. 9. Kolordu Sarıkamış önünde teslim oldu, ' +
        '3. Ordu geri çekildi. Kayıp sayısı Türk tarih yazımının en ' +
        'tartışmalı rakamlarından biridir: kaynaklar 23 bin ile 90 bin ' +
        'arasında değişir ve donarak ölenlerle muharebede ölenleri ayırmak ' +
        'çoğu kayıtta mümkün değildir. Kesin olan, 3. Ordu\'nun bir daha ' +
        'taarruz gücüne kavuşamadığıdır.',
      kind: 'kara',
      src: WIKI,
    },
    {
      id: 'kafkas_erzurum',
      date: '1916-02-16',
      title: 'Erzurum Düştü',
      body:
        'Yudeniç kış ortasında taarruza geçti ve Erzurum\'u aldı. ' +
        '18 Nisan\'da Trabzon, Temmuz\'da Erzincan Rus eline geçti. ' +
        'Cephe 1917 Rus çöküşüne kadar bu hatta dondu.',
      kind: 'kara',
      src: KAFKAS,
    },
    {
      id: 'kafkas_erzincan_mutarekesi',
      date: '1917-12-18',
      title: 'Erzincan Mütarekesi',
      body:
        'Bolşevik İhtilâli\'nden sonra Rus Kafkas Ordusu dağıldı. ' +
        'Erzincan\'da mütareke imzalandı; Osmanlı kuvvetleri kaybedilen ' +
        'toprakları geri almaya başladı. 3 Mart 1918\'de Brest-Litovsk ile ' +
        'Kars, Ardahan ve Batum Osmanlı\'ya bırakıldı.',
      kind: 'siyasi',
      src: KAFKAS,
    },
  ],
};
