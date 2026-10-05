import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * Normandiya ve Batı Avrupa — 6 Haziran 1944'ten teslime.
 *
 * Çıkarmanın asıl sorunu sahile çıkmak değil, **ikmali sürdürmekti**.
 * Derin su limanı alınamadığı için iki yapay liman (Mulberry) çekildi;
 * cephe ilerledikçe benzin ikmali harekâtın hızını belirledi.
 */

const NO = 'https://tr.wikipedia.org/wiki/Normandiya_Çıkarması';

const DE = 'Germany';
const US = 'United States';
const UK = 'United Kingdom';
const CA = 'Canada';

export const NORMANDIYA_PACK: FrontPack = {
  theatre: 'ww2_normandiya',

  formations: [
    // ── Alman savunması ──
    { nation: DE, name: 'B Ordular Grubu — Rommel', templateId: 'de_ww2_piyade', at: [1.08, 49.44], src: NO },
    { nation: DE, name: '7. Ordu — Normandiya', templateId: 'de_ww2_piyade', at: [-0.70, 49.10], src: NO },
    { nation: DE, name: '15. Ordu — Pas-de-Calais', templateId: 'de_ww2_piyade', at: [1.85, 50.95], src: NO },
    { nation: DE, name: '21. Panzer Tümeni', templateId: 'de_panzer', at: [-0.37, 49.18], src: NO },
    { nation: DE, name: '12. SS Panzer Tümeni', templateId: 'de_panzer', at: [-0.10, 49.30], arrivesOn: '1944-06-07', src: NO },
    { nation: DE, name: 'Panzer Lehr Tümeni', templateId: 'de_panzer', at: [-0.60, 49.05], arrivesOn: '1944-06-08', src: NO },
    { nation: DE, name: '352. Piyade Tümeni — Omaha', templateId: 'de_ww2_piyade', at: [-0.90, 49.37], src: NO },

    // ── Müttefik çıkarma kuvveti ──
    { nation: US, name: '1. Amerikan Ordusu — Bradley', templateId: 'us_piyade_tumen', at: [-1.10, 49.40], src: NO },
    { nation: US, name: '1. Piyade Tümeni — Omaha', templateId: 'us_piyade_tumen', at: [-0.86, 49.37], src: NO },
    { nation: US, name: '4. Piyade Tümeni — Utah', templateId: 'us_piyade_tumen', at: [-1.17, 49.42], src: NO },
    { nation: US, name: '82. Hava İndirme Tümeni', templateId: 'us_piyade_tumen', at: [-1.31, 49.41], src: NO },
    { nation: US, name: '101. Hava İndirme Tümeni', templateId: 'us_piyade_tumen', at: [-1.24, 49.34], src: NO },
    { nation: UK, name: '2. İngiliz Ordusu — Dempsey', templateId: 'uk_ww2_piyade', at: [-0.30, 49.33], src: NO },
    { nation: UK, name: '6. Hava İndirme Tümeni', templateId: 'uk_ww2_piyade', at: [-0.25, 49.24], src: NO },
    { nation: CA, name: '3. Kanada Tümeni — Juno', templateId: 'uk_ww2_piyade', at: [-0.46, 49.34], src: NO },
    // Kopma ve kuşatma.
    { nation: US, name: '3. Amerikan Ordusu — Patton', templateId: 'us_piyade_tumen', at: [-1.30, 48.80], arrivesOn: '1944-08-01', src: NO },
    { nation: UK, name: '1. Polonya Zırhlı Tümeni', templateId: 'uk_zirhli_tumen', at: [-0.05, 48.88], arrivesOn: '1944-08-08', src: NO },
  ],

  commanders: [
    cmd(
      'eisenhower', 'Dwight Eisenhower', 'Orgeneral', 'amerikan', 'entente', 'kara',
      [5, 5, 6, 6], ['lojistikci', 'temkinli'], '1944-06-06',
      'Müttefik Seferi Kuvvetleri Başkomutanı. Hava durumu penceresini ' +
      'değerlendirip çıkarmayı 6 Haziran\'a erteleme kararını tek başına ' +
      'verdi.',
      'Koalisyon ve ikmal yönetimi: planlama ve lojistik 6.',
      NO,
    ),
    cmd(
      'montgomery_norm', 'Bernard Montgomery', 'Mareşal', 'ingiliz', 'entente', 'kara',
      [4, 6, 6, 5], ['temkinli', 'siper_ustasi'], '1944-06-06',
      '21. Ordular Grubu Komutanı. Caen çevresinde Alman zırhlısını ' +
      'kendine çekip batı kanadında Amerikan kopmasına imkân verdi.',
      'Caen planlanandan çok geç alındı ama zırhlı tespit işlevi gördü: ' +
      'savunma ve planlama 6.',
      NO,
    ),
    cmd(
      'rommel_norm', 'Erwin Rommel', 'Mareşal', 'alman', 'ottoman', 'kara',
      [5, 6, 5, 3], ['inatci_savunma', 'siper_ustasi'], '1944-06-06',
      'B Ordular Grubu Komutanı. Zırhlı ihtiyatın sahile yakın tutulmasını ' +
      'savundu — hava üstünlüğü altında uzaktan getirmenin imkânsız ' +
      'olacağını görüyordu. 17 Temmuz\'da uçak saldırısında yaralandı.',
      'Tartışmada haklı çıktı ama dinletemedi: savunma 6.',
      NO, '1944-07-17',
    ),
    cmd(
      'rundstedt_norm', 'Gerd von Rundstedt', 'Mareşal', 'alman', 'ottoman', 'kara',
      [4, 5, 5, 4], ['temkinli'], '1944-06-06',
      'Batı Başkomutanı. Zırhlı ihtiyatın içeride toplanıp asıl çıkarma ' +
      'belli olunca kullanılmasını savundu. İhtiyat Hitler\'in iznine ' +
      'bağlıydı ve 6 Haziran\'da saatlerce serbest bırakılmadı.',
      'Komuta kademesi bölünmüştü: planlama 5.',
      NO, '1944-07-02',
    ),
    cmd(
      'bradley', 'Omar Bradley', 'Orgeneral', 'amerikan', 'entente', 'kara',
      [5, 5, 5, 5], ['lojistikci'], '1944-06-06',
      '1. Amerikan Ordusu Komutanı. Cobra Harekâtı ile Saint-Lô\'da ' +
      'cepheyi yardı ve kopmayı başlattı.',
      'Bocage arazisinde yarma: dengeli yüksek puanlar.',
      NO,
    ),
    cmd(
      'patton_norm', 'George Patton', 'Korgeneral', 'amerikan', 'entente', 'kara',
      [6, 3, 5, 3], ['taarruz_ruhu', 'israfci'], '1944-08-01',
      '3. Amerikan Ordusu Komutanı. Yarmadan sonra Bretanya ve Loire ' +
      'boyunca hızla ilerledi; ordusu benzin bitene kadar durmadı.',
      'Hız altı, ikmal üç — cephenin dersi burada da aynı.',
      NO,
    ),
  ],

  events: [
    {
      id: 'nm_dday',
      date: '1944-06-06',
      title: '6 HAZİRAN — Overlord',
      body:
        'Beş sahile çıkarma yapıldı: Utah, Omaha, Gold, Juno, Sword. ' +
        'Gece üç hava indirme tümeni kanatları tuttu. Omaha\'da 352. ' +
        'Piyade Tümeni beklenmediği için kayıp ağır oldu.\n\n' +
        'Alman zırhlı ihtiyatı Hitler\'in iznine bağlıydı ve saatlerce ' +
        'serbest bırakılmadı.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_mulberry',
      date: '1944-06-09',
      title: 'Mulberry — Yapay Limanlar',
      body:
        'Derin su limanı alınamadığı için iki yapay liman İngiltere\'den ' +
        'çekilip Normandiya kıyısına kuruldu. 19 Haziran fırtınası ' +
        'Amerikan limanını kullanılmaz hâle getirdi; ikmal haftalarca ' +
        'doğrudan sahilden yapıldı.',
      kind: 'ikmal',
      src: NO,
    },
    {
      id: 'nm_caen',
      date: '1944-07-09',
      title: 'Caen — Planlanandan Bir Ay Geç',
      body:
        'İlk gün alınması planlanan Caen ancak Temmuz\'da düştü. Bocage ' +
        'arazisi — yüksek toprak setler ve çalı çitler — savunana her ' +
        'tarlada yeni mevzi veriyordu.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_cobra',
      date: '1944-07-25',
      title: 'Cobra — Cephe Yarıldı',
      body:
        'Saint-Lô yakınında ağır bombardıman uçaklarıyla açılan koridordan ' +
        'Amerikan zırhlısı geçti. Normandiya\'daki mevzi savaşı hareketli ' +
        'savaşa döndü.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_falaise',
      date: '1944-08-19',
      title: 'Falaise Cebi',
      body:
        'Alman 7. Ordusu Falaise çevresinde kuşatıldı. Cep tam ' +
        'kapanmadığı için bir kısım kuvvet kaçabildi; yine de Batı\'daki ' +
        'Alman ordusu bir daha toparlanamadı.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_paris',
      date: '1944-08-25',
      title: 'Paris Kurtarıldı',
      body:
        'Fransız 2. Zırhlı Tümeni şehre girdi. Dört yıllık işgal sona ' +
        'erdi. Hızlı ilerleyiş ikmal hatlarını 500 kilometreye uzattı ve ' +
        'benzin sıkıntısı harekâtı yavaşlattı.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_ardennes',
      date: '1944-12-16',
      title: 'Ardennes — Son Alman Taarruzu',
      body:
        'Almanya 1940\'taki aynı ormandan son taarruzunu başlattı. ' +
        'Bastogne kuşatıldı ama düşmedi; hava açılınca taarruz durdu. ' +
        'Batı\'da son zırhlı ihtiyat burada tükendi.',
      kind: 'kara',
      src: NO,
    },
    {
      id: 'nm_teslim',
      date: '1945-05-08',
      title: '8 MAYIS — Avrupa\'da Savaş Bitti',
      body:
        'Ren mart ayında geçildi, Ruhr kuşatıldı. Almanya kayıtsız şartsız ' +
        'teslim oldu.',
      kind: 'siyasi',
      src: NO,
    },
  ],
};
