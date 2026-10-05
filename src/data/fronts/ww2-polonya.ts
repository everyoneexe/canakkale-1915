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

const DE = 'Germany';
const PO = 'Poland';
const SU = 'USSR';

export const POLONYA_PACK: FrontPack = {
  theatre: 'ww2_polonya',

  formations: [
    // ── Alman ordu grupları ──
    // Kuzey: Bock — Pomeranya ve Doğu Prusya'dan koridora.
    { nation: DE, name: '4. Ordu — Pomeranya', templateId: 'de_ww2_piyade', at: [18.00, 53.50], src: PL },
    { nation: DE, name: '3. Ordu — Doğu Prusya', templateId: 'de_ww2_piyade', at: [20.50, 53.80], src: PL },
    { nation: DE, name: 'XIX. Panzer Kolordusu — Guderian', templateId: 'de_panzer', at: [18.40, 53.60], src: PL },
    // Güney: Rundstedt — Silezya ve Slovakya'dan Varşova'ya.
    { nation: DE, name: '8. Ordu — Silezya', templateId: 'de_ww2_piyade', at: [17.03, 51.11], src: PL },
    { nation: DE, name: '10. Ordu — Reichenau', templateId: 'de_panzer', at: [18.50, 50.70], src: PL },
    { nation: DE, name: '14. Ordu — List', templateId: 'de_ww2_piyade', at: [19.50, 49.60], src: PL },
    { nation: DE, name: 'XVI. Panzer Kolordusu', templateId: 'de_panzer', at: [18.90, 50.90], src: PL },

    // ── Polonya orduları ──
    { nation: PO, name: 'Pomorze Ordusu', templateId: 'pl_piyade_tumen', at: [18.60, 53.10], src: PL },
    { nation: PO, name: 'Poznań Ordusu', templateId: 'pl_piyade_tumen', at: [16.93, 52.41], src: PL },
    { nation: PO, name: 'Łódź Ordusu', templateId: 'pl_piyade_tumen', at: [19.46, 51.76], src: PL },
    { nation: PO, name: 'Kraków Ordusu', templateId: 'pl_piyade_tumen', at: [19.94, 50.06], src: PL },
    { nation: PO, name: 'Modlin Ordusu', templateId: 'pl_piyade_tumen', at: [20.72, 52.44], src: PL },
    { nation: PO, name: 'Karpaty Ordusu', templateId: 'pl_piyade_tumen', at: [21.00, 49.70], src: PL },
    { nation: PO, name: 'Varşova Savunma Kuvveti', templateId: 'pl_piyade_tumen', at: [21.01, 52.23], src: PL },
    { nation: PO, name: 'Prusy Ordusu (İhtiyat)', templateId: 'pl_piyade_tumen', at: [20.50, 51.40], src: PL },

    // ── Sovyet işgali, 17 Eylül ──
    { nation: SU, name: 'Beyaz Rusya Cephesi', templateId: 'su_tufek_tumen', at: [25.00, 53.00], arrivesOn: '1939-09-17', src: PL },
    { nation: SU, name: 'Ukrayna Cephesi', templateId: 'su_tufek_tumen', at: [25.50, 50.50], arrivesOn: '1939-09-17', src: PL },
  ],

  commanders: [
    cmd(
      'rundstedt', 'Gerd von Rundstedt', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 5, 6, 5], ['taarruz_ruhu', 'lojistikci'], '1939-09-01',
      'Güney Ordular Grubu Komutanı. Silezya ve Slovakya\'dan Varşova\'ya ' +
      'yönelen asıl taarruzu yönetti.',
      'Seferin ağırlık merkezini taşıyan grup: taarruz ve planlama 6.',
      PL,
    ),
    cmd(
      'bock', 'Fedor von Bock', 'Orgeneral', 'alman', 'ottoman', 'kara',
      [6, 4, 5, 4], ['taarruz_ruhu'], '1939-09-01',
      'Kuzey Ordular Grubu Komutanı. Polonya Koridoru\'nu kesip Doğu ' +
      'Prusya ile Pomeranya\'yı birleştirdi.',
      'Koridor bir haftada kesildi: taarruz 6.',
      PL,
    ),
    cmd(
      'guderian', 'Heinz Guderian', 'Korgeneral', 'alman', 'ottoman', 'kara',
      [6, 3, 6, 4], ['taarruz_ruhu'], '1939-09-01',
      'XIX. Panzer Kolordusu Komutanı. Zırhlı birliklerin yoğun ve derin ' +
      'kullanımını ilk burada uyguladı.',
      'Blitzkrieg\'in sahada ilk sınavı: taarruz ve planlama 6, savunma 3.',
      PL,
    ),
    cmd(
      'rydz_smigly', 'Edward Rydz-Śmigły', 'Mareşal', 'polonyali', 'entente', 'kara',
      [3, 4, 3, 2], ['agir_kanli'], '1939-09-01',
      'Polonya Başkomutanı. Orduyu uzun sınır boyunca yaydı; derinlik ' +
      'olmadığı için yarmalar hemen stratejik sonuç verdi. 17 Eylül\'de ' +
      'Romanya\'ya geçti.',
      'Sanayi bölgelerini korumak için ileri konuşlanma: planlama 3.',
      PL,
    ),
    cmd(
      'kutrzeba', 'Tadeusz Kutrzeba', 'Tümgeneral', 'polonyali', 'entente', 'kara',
      [5, 4, 5, 3], ['taarruz_ruhu'], '1939-09-01',
      'Poznań Ordusu Komutanı. 9 Eylül\'de Bzura\'da karşı taarruza geçti — ' +
      'seferin en büyük Polonya harekâtı.',
      'Alman ilerleyişini bir hafta geciktirdi: taarruz 5.',
      PL,
    ),
  ],

  events: [
    {
      id: 'pl_1eylul',
      date: '1939-09-01',
      title: '1 EYLÜL — Savaş Başladı',
      body:
        'Alman kuvvetleri savaş ilanı olmadan Polonya\'ya girdi. Hava ' +
        'kuvvetleri havaalanlarını, demiryollarını ve haberleşmeyi ilk ' +
        'günden vurdu. Polonya ordusu uzun sınır boyunca yayılmıştı; ' +
        'derinlik olmadığı için her yarma hemen stratejik sonuç verdi.',
      kind: 'kara',
      src: PL,
    },
    {
      id: 'pl_koridor',
      date: '1939-09-05',
      title: 'Polonya Koridoru Kesildi',
      body:
        'Kuzey Ordular Grubu, Pomeranya ile Doğu Prusya arasındaki koridoru ' +
        'kesti ve iki Alman bölgesini birleştirdi. Pomorze Ordusu kuşatıldı.',
      kind: 'kara',
      src: PL,
    },
    {
      id: 'pl_bzura',
      date: '1939-09-09',
      title: 'Bzura — Polonya Karşı Taarruzu',
      body:
        'Kutrzeba\'nın Poznań Ordusu, Alman 8. Ordusunun açıktaki kanadına ' +
        'yüklendi. Seferin en büyük Polonya harekâtıydı ve Varşova\'ya ' +
        'ilerleyişi bir hafta geciktirdi; sonunda hava üstünlüğü altında ' +
        'kuşatılıp kırıldı.',
      kind: 'kara',
      src: PL,
    },
    {
      id: 'pl_sovyet',
      date: '1939-09-17',
      title: '17 EYLÜL — Doğudan İkinci Cephe',
      body:
        'Sovyetler Birliği, Molotov-Ribbentrop Paktı\'nın gizli ekine ' +
        'dayanarak doğudan girdi. Polonya hükümeti ve başkomutanlık aynı gün ' +
        'Romanya\'ya geçti. İki cephe arasında kalan ordu için savunma ' +
        'imkânı kalmadı.',
      kind: 'siyasi',
      src: PL,
    },
    {
      id: 'pl_varsova',
      date: '1939-09-28',
      title: 'Varşova Teslim Oldu',
      body:
        'Yirmi gün kuşatma ve bombardımandan sonra Varşova teslim oldu. ' +
        'Son düzenli direniş 6 Ekim\'de Kock\'ta sona erdi.',
      kind: 'kara',
      src: PL,
    },
  ],
};
