import { Graphics, Text } from 'pixi.js';

import type { Side } from '../core/types.ts';
import { unitSymbol } from '../data/symbols.ts';
import { C } from '../style/tokens.ts';

/**
 * Birim sayacının görsel dili.
 *
 * Sayaç üç şeyi aynı anda söylemeli: NE (kol sembolü), NE KADAR (kademe
 * işareti + mevcut), NE DURUMDA (organizasyon çubuğu). Üçü de haritadan
 * okunamazsa oyuncu her birliğe tek tek tıklamak zorunda kalıyor.
 *
 * `render/map.ts` içinde gömülüydü; çizim kodu 1.554 satırdı ve bu görsel
 * sözlük onun ortasında kayboluyordu.
 */

/** Sayaç kutusunun ölçüleri. */
export const COUNTER_W = 34;
export const COUNTER_H = 17;

/** Haritada bir ildeki yığının çizim için özeti. */
export interface CounterStack {
  readonly side: Side;
  readonly men: number;
  /** Yığındaki birlik sayısı. */
  readonly n: number;
  readonly combat: boolean;
  readonly org: number;
  readonly maxOrg: number;
  /** Yığının EN KALABALIK biriminin şablonu — sembol ondan gelir. */
  readonly tpl: string;
}

/**
 * Sayacı çizer. `g`, `t`, `eTxt` havuzdan gelen, yeniden kullanılan
 * nesnelerdir; her çağrıda sıfırlanır.
 */
export function drawCounter(
  g: Graphics,
  t: Text,
  eTxt: Text,
  st: CounterStack,
): void {
  const col = st.side === 'ottoman' ? C.ottoman : C.entente;
  const sym = unitSymbol(st.tpl);
  const w = COUNTER_W;
  const h = COUNTER_H;

  g.clear()
    .rect(-w / 2, -h / 2, w, h)
    .fill({ color: C.panel, alpha: 0.92 })
    .stroke({ width: 1.2, color: st.combat ? C.mine : col, alpha: 1 });

  // ── Kol sembolü ──
  // Hepsi aynı "X" ile çiziliyordu: haritada topçu alayı ile piyade
  // tümeni ayırt edilemiyordu.
  const L = -w / 2 + 3;
  const R = -w / 2 + 11;
  const T = -h / 2 + 3;
  const B = h / 2 - 3;
  const line = { width: 1, color: col, alpha: 0.85 } as const;
  switch (sym.branch) {
    case 'topcu':
      // Topçu: dolu daire.
      g.circle((L + R) / 2, 0, 2.6).fill({ color: col, alpha: 0.85 });
      break;
    case 'zirhli':
      // Zırhlı: NATO ovali.
      g.ellipse((L + R) / 2, 0, (R - L) / 2, (B - T) / 2.6).stroke(line);
      break;
    case 'suvari':
      // Süvari: tek eğik çizgi.
      g.moveTo(L, B).lineTo(R, T).stroke(line);
      break;
    case 'istihkam':
      // İstihkâm: köşeli "E" sırtı.
      g.moveTo(R, T).lineTo(L, T).lineTo(L, B).lineTo(R, B).stroke(line);
      g.moveTo(L, 0).lineTo(R - 2, 0).stroke(line);
      break;
    case 'deniz':
      // Deniz piyadesi: piyade çaprazı + altında dalga çizgisi.
      g.moveTo(L, T).lineTo(R, B).moveTo(R, T).lineTo(L, B).stroke(line);
      g.moveTo(L, B + 1.5).lineTo(R, B + 1.5).stroke({ ...line, alpha: 0.6 });
      break;
    default:
      // Piyade: çapraz.
      g.moveTo(L, T).lineTo(R, B).moveTo(R, T).lineTo(L, B).stroke(line);
  }

  // ── Organizasyon çubuğu ──
  // Muharebeyi kıran şey insan kaybı değil organizasyon; sayaçta
  // görünmediği için oyuncu hangi birliğin kırılmak üzere olduğunu ancak
  // panele tıklayarak öğreniyordu.
  const ratio = st.maxOrg > 0 ? Math.max(0, Math.min(1, st.org / st.maxOrg)) : 0;
  const barY = h / 2 + 1.5;
  g.rect(-w / 2, barY, w, 2).fill({ color: 0x000000, alpha: 0.55 });
  g.rect(-w / 2, barY, w * ratio, 2).fill({
    color: ratio > 0.6 ? 0x7fc08a : ratio > 0.3 ? C.accent : C.mine,
    alpha: 0.95,
  });

  eTxt.text = sym.echelon;
  eTxt.y = -h / 2 - 1;
  t.text = st.men >= 1000 ? `${Math.round(st.men / 1000)}B` : String(st.men);
  t.x = 6;
  t.y = 0;
  if (st.n > 1) t.text += `·${st.n}`;
}
