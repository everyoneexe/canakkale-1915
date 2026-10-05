import { cmd } from '../commanders.ts';
import type { FrontPack } from './pack.ts';

/**
 * İtalyan Cephesi — Isonzo'dan Vittorio Veneto'ya.
 *
 * Cephenin tanımlayıcı özelliği ARAZİ: hat Isonzo nehri boyunca ve
 * 2.000 metrenin üzerindeki Alp buzullarında uzanıyordu. On iki Isonzo
 * muharebesi aynı dar vadide tekrarlandı.
 */

const IT = 'https://tr.wikipedia.org/wiki/İtalyan_Cephesi_(I._Dünya_Savaşı)';
const CAP = 'https://tr.wikipedia.org/wiki/Caporetto_Muharebesi';

const ITA = 'Italy';
const AT = 'Austro-Hungarian Empire';
const DE = 'German Empire';

export const ITALYAN_PACK: FrontPack = {
  theatre: 'ww1_italyan',

  formations: [
    // ── İtalyan Orduları, Mayıs 1915 ──
    // 2. ve 3. Ordular Isonzo'da; 1. ve 4. Ordular Alp cephesinde.
    { nation: ITA, name: '2. Ordu — Isonzo', templateId: 'it_piyade_tumen', at: [13.48, 46.05], src: IT },
    { nation: ITA, name: '3. Ordu — Alt Isonzo', templateId: 'it_piyade_tumen', at: [13.56, 45.85], src: IT },
    { nation: ITA, name: '1. Ordu — Trentino', templateId: 'it_piyade_tumen', at: [11.12, 45.90], src: IT },
    { nation: ITA, name: '4. Ordu — Cadore', templateId: 'it_piyade_tumen', at: [12.29, 46.43], src: IT },
    { nation: ITA, name: 'Alpini Tugayı — Carnia', templateId: 'it_alpini_tugay', at: [13.00, 46.45], src: IT },
    { nation: ITA, name: 'Alpini Tugayı — Adamello', templateId: 'it_alpini_tugay', at: [10.50, 46.17], src: IT },
    { nation: ITA, name: 'Udine Ağır Topçu Alayı', templateId: 'os_agir_topcu', at: [13.24, 46.07], src: IT },
    // Caporetto sonrası Piave hattı.
    { nation: ITA, name: 'Piave Savunma Kuvveti', templateId: 'it_piyade_tumen', at: [12.23, 45.78], arrivesOn: '1917-11-10', src: CAP },
    // Müttefik takviyesi.
    { nation: 'United Kingdom of Great Britain and Ireland', name: 'İngiliz XIV. Kolordusu', templateId: 'uk_piyade_tumen', at: [11.88, 45.55], arrivesOn: '1917-11-20', src: CAP },
    { nation: 'France', name: 'Fransız XII. Kolordusu', templateId: 'fr_piyade_tumen', at: [11.60, 45.60], arrivesOn: '1917-11-20', src: CAP },

    // ── Avusturya-Macaristan ──
    { nation: AT, name: '5. Ordu — Isonzo', templateId: 'at_piyade_tumen', at: [13.64, 45.95], src: IT },
    { nation: AT, name: 'Tirol Savunma Kuvveti', templateId: 'at_dag_tugay', at: [11.35, 46.50], src: IT },
    { nation: AT, name: 'Karintiya Dağ Tugayı', templateId: 'at_dag_tugay', at: [13.50, 46.60], src: IT },
    { nation: AT, name: '11. Ordu — Asiago', templateId: 'at_piyade_tumen', at: [11.51, 45.88], arrivesOn: '1916-05-15', src: IT },
    // Caporetto yarmasını yapan Alman-Avusturya ordusu.
    { nation: DE, name: '14. Ordu — Below', templateId: 'de_alpen_korps', at: [13.47, 46.25], arrivesOn: '1917-10-20', src: CAP },
  ],

  commanders: [
    cmd(
      'cadorna', 'Luigi Cadorna', 'Orgeneral', 'italyan', 'entente', 'kara',
      [5, 3, 3, 3], ['taarruz_ruhu', 'israfci'], '1915-05-23',
      'İtalyan Genelkurmay Başkanı. On bir Isonzo taarruzunu aynı dar ' +
      'vadide tekrarladı. Caporetto bozgunundan sonra Kasım 1917\'de ' +
      'görevden alındı.',
      'Aynı araziye on bir kez yüklendi: taarruz 5, planlama 3.',
      IT, '1917-11-09',
    ),
    cmd(
      'diaz', 'Armando Diaz', 'Orgeneral', 'italyan', 'entente', 'kara',
      [5, 6, 5, 5], ['inatci_savunma', 'lojistikci'], '1917-11-09',
      'Cadorna\'nın yerine Genelkurmay Başkanı. Piave hattını tuttu, ' +
      'orduyu yeniden kurdu ve 24 Ekim 1918\'de Vittorio Veneto\'da ' +
      'taarruza geçti.',
      'Önce durdurdu, sonra kazandı: savunma 6.',
      IT,
    ),
    cmd(
      'boroevic', 'Svetozar Borojević', 'Mareşal', 'avusturya', 'ottoman', 'kara',
      [3, 6, 5, 4], ['inatci_savunma', 'siper_ustasi'], '1915-05-23',
      'Isonzo Ordusu Komutanı. On bir İtalyan taarruzunu sayıca üstün ' +
      'düşmana karşı kırdırdı; "Isonzo Aslanı" diye anıldı.',
      'Savaşın en inatçı savunması: savunma 6, taarruz 3.',
      IT,
    ),
    cmd(
      'below_otto', 'Otto von Below', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 4, 6, 4], ['taarruz_ruhu'], '1917-10-20',
      '14. Ordu Komutanı. 24 Ekim 1917\'de Caporetto\'da sızma taktikleri ve ' +
      'gaz mermisiyle İtalyan hattını yardı; cephe 100 kilometre geriledi.',
      'Dağ arazisinde yarma: taarruz ve planlama 6.',
      CAP,
    ),
    cmd(
      'conrad_italyan', 'Franz Conrad von Hötzendorf', 'Mareşal', 'avusturya', 'ottoman', 'kara',
      [5, 4, 3, 3], ['taarruz_ruhu', 'israfci'], '1916-05-15',
      'Mayıs 1916\'da Asiago\'da "Strafexpedition" taarruzunu yönetti. ' +
      'Başlangıçta ilerledi ama Brusilov Taarruzu kuvvetleri doğuya ' +
      'çekince durdu.',
      'İki cephede aynı anda taarruz: planlama 3.',
      IT,
    ),
  ],

  events: [
    {
      id: 'it_savas_ilani',
      date: '1915-05-23',
      title: 'İtalya Savaşa Girdi',
      body:
        'İtalya, Londra Antlaşması\'yla vaat edilen topraklar karşılığında ' +
        'Avusturya-Macaristan\'a savaş ilan etti. Cephe Isonzo nehri boyunca ' +
        've Alpler\'de açıldı; arazi 2.000 metrenin üzerindeki buzullara ' +
        'kadar uzanıyordu.',
      kind: 'siyasi',
      src: IT,
    },
    {
      id: 'it_isonzo1',
      date: '1915-06-23',
      title: 'Birinci Isonzo',
      body:
        'İtalyan 2. ve 3. Orduları Isonzo boyunca taarruza geçti. Karstik ' +
        'arazide siper kazmak neredeyse imkânsızdı; mevziler taş duvarlarla ' +
        'örülüyor, top mermileri kaya parçalarını şarapnele çeviriyordu.',
      kind: 'kara',
      src: IT,
    },
    {
      id: 'it_strafexpedition',
      date: '1916-05-15',
      title: 'Asiago — Ceza Seferi',
      body:
        'Conrad, Trentino\'dan İtalyan cephesinin gerisine inmeyi amaçlayan ' +
        'taarruzu başlattı. İlk haftalarda ilerledi, ama Brusilov Taarruzu ' +
        'kuvvetlerin doğuya kaydırılmasını zorunlu kılınca durdu.',
      kind: 'kara',
      src: IT,
    },
    {
      id: 'it_gorizia',
      date: '1916-08-06',
      title: 'Altıncı Isonzo — Gorizia Alındı',
      body:
        'On iki Isonzo muharebesi içinde İtalya\'nın en belirgin başarısı. ' +
        'Gorizia ele geçirildi, ama cephe birkaç kilometre ilerledikten ' +
        'sonra yeniden dondu.',
      kind: 'kara',
      src: IT,
    },
    {
      id: 'it_caporetto',
      date: '1917-10-24',
      title: 'Caporetto — Cephe Çöktü',
      body:
        'Alman 14. Ordusu sızma taktikleri ve gaz mermisiyle İtalyan hattını ' +
        'yardı. Cephe yaklaşık 100 kilometre geriledi; İtalyan ordusu ' +
        'Piave nehrine çekildi. Cadorna görevden alındı, yerine Diaz geldi. ' +
        'Britanya ve Fransa cepheye kolordu yolladı.',
      kind: 'kara',
      src: CAP,
    },
    {
      id: 'it_piave',
      date: '1918-06-15',
      title: 'Piave — Son Avusturya Taarruzu',
      body:
        'Avusturya-Macaristan nehri geçmeye çalıştı ve ağır kayıpla ' +
        'püskürtüldü. Bu, imparatorluk ordusunun son taarruzuydu; ' +
        'bundan sonra iç çözülme hızlandı.',
      kind: 'kara',
      src: IT,
    },
    {
      id: 'it_vittorio',
      date: '1918-10-24',
      title: 'Vittorio Veneto',
      body:
        'Diaz, Caporetto\'nun yıldönümünde taarruza geçti. Avusturya-Macaristan ' +
        'ordusu çözüldü; milliyetçi birlikler cepheyi terk etmeye başladı.',
      kind: 'kara',
      src: IT,
    },
    {
      id: 'it_villa_giusti',
      date: '1918-11-04',
      title: 'Villa Giusti Mütarekesi',
      body:
        'Mütareke 3 Kasım 1918\'de imzalandı ve 4 Kasım\'da yürürlüğe girdi. ' +
        'Avusturya-Macaristan İmparatorluğu için savaş bitti; imparatorluk ' +
        'birkaç hafta içinde dağıldı.',
      kind: 'siyasi',
      src: IT,
    },
  ],
};
