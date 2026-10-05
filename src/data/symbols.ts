import { TEMPLATE_BY_ID } from './templates.ts';

/** Harita sayaçlarının NATO sembolü. */

/** Birim sayacında çizilecek NATO sembolü. */
export interface UnitSymbol {
  /** Kol: sembolün içine çizilen şekil. */
  readonly branch: 'piyade' | 'topcu' | 'suvari' | 'deniz' | 'istihkam' | 'zirhli';
  /** Kademe işareti: tümen XX, tugay X, alay III, müfreze/tabur II. */
  readonly echelon: 'XX' | 'X' | 'III' | 'II';
}

/**
 * Şablondan NATO sembolü türetir.
 *
 * Sayaçlar bugüne kadar hepsi için aynı "X" kutusunu çiziyordu: haritada
 * topçu alayı ile piyade tümeni aynı görünüyordu. Kademe şablon ADINDAN
 * (veri Türkçe ve tutarlı), kol ise tabur karışımının ağırlığından gelir.
 */
export function unitSymbol(templateId: string): UnitSymbol {
  const t = TEMPLATE_BY_ID[templateId];
  const n = t?.name ?? '';
  const echelon: UnitSymbol['echelon'] = n.includes('Tümen')
    ? 'XX'
    : n.includes('Tugay')
      ? 'X'
      : n.includes('Alay')
        ? 'III'
        : 'II';

  const b = t?.battalions ?? {};
  const topcu = (b.sahra_topcu ?? 0) + (b.obus ?? 0) + (b.tanksavar ?? 0);
  const piyade = (b.piyade ?? 0) + (b.avci ?? 0) + (b.motorlu ?? 0);
  const deniz = b.deniz_piyade ?? 0;
  const suvari = b.suvari ?? 0;
  const istihkam = b.istihkam ?? 0;
  const zirhli =
    (b.tank_hafif ?? 0) + (b.tank_orta ?? 0) + (b.tank_agir ?? 0) + (b.zirhli_oto ?? 0);
  const branch: UnitSymbol['branch'] =
    // Zırh her şeyin önünde: bir tank taburu olan birlik haritada tanktır.
    zirhli > 0 && zirhli * 2 >= piyade
      ? 'zirhli'
      : topcu > piyade + deniz + suvari
        ? 'topcu'
        : suvari > piyade + deniz
          ? 'suvari'
          : deniz > piyade
            ? 'deniz'
            : istihkam > piyade
              ? 'istihkam'
              : 'piyade';
  return { branch, echelon };
}
