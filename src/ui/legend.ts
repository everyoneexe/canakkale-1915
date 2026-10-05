import type { Side } from '../core/types.ts';
import type { Theatre } from '../data/theatres.ts';
import type { MapMode } from '../render/map.ts';
import { C } from '../style/tokens.ts';
import { $ } from './dom.ts';

/**
 * Harita modu göstergesi.
 *
 * Düğmeler yalnız bir ad taşıyordu; "MAYIN" seçildiğinde ekranda beliren
 * şekillerin anlamı hiçbir yerde yazmıyor, oyuncu yuvarlak lekelere bakıp
 * ne olduğunu kestirmeye çalışıyordu.
 */

const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`;

const key = (c: string, text: string, line = false) =>
  `<li><i class="${line ? 'cizgi' : ''}" style="background:${c}"></i>${text}</li>`;

/** Uzun taraf adları göstergeyi taşırıyor. */
const kisalt = (s: string) => (s.length > 22 ? `${s.slice(0, 21)}…` : s);

export function renderLegend(mode: MapMode, theatre: Theatre, playerSide: Side | null): void {
  // Taraf adları ve renkleri PALETTEN ve TİYATRODAN gelir; sabit
  // yazılırsa tema ya da cephe değişince sessizce yalan söyler.
  //
  // Hata: gösterge her cephede "Osmanlı / İtilaf" yazıyordu. Kuzey
  // Afrika'da üst bar "ALMANYA · İTALYA" derken hemen altındaki harita
  // göstergesi "Osmanlı denetiminde" diyordu.
  const ott = playerSide === 'ottoman';
  const own = kisalt(ott ? theatre.sides.a : theatre.sides.b);
  const foe = kisalt(ott ? theatre.sides.b : theatre.sides.a);
  const ownC = hex(ott ? C.ottomanDim : C.ententeDim);
  const foeC = hex(ott ? C.ententeDim : C.ottomanDim);

  const text: Record<MapMode, string> = {
    siyasi:
      `<b>SİYASİ</b>İlleri denetleyen tarafa göre boyar.<ul>` +
      key(ownC, `${own} denetiminde`) +
      key(foeC, `${foe} denetiminde`) +
      key(hex(C.land), 'Görülmemiş — keşif yok') +
      `</ul>`,
    arazi:
      `<b>ARAZİ</b>Zemin tipi. Savunmaya kattığı değer yükseldikçe renk ` +
      `koyulaşır: sırtlarda saldırmak pahalıdır.`,
    tedarik:
      `<b>İKMAL</b>İllere ulaşan ikmal oranı. Yeşil bol, kırmızı kesik; ` +
      `ikmalsiz birlik organizasyon kaybeder ve cephane harcayamaz.<ul>` +
      key('#7fc08a', 'Tam ikmal') +
      key(hex(C.accent), 'Zorlanıyor') +
      key(hex(C.mine), 'Kesik') +
      `</ul>`,
    deniz:
      `<b>DENİZ</b>Yalnız deniz illeri. Renk koyuldukça akıntı güçlüdür — ` +
      `Boğaz akıntısı mayın tarama ve gemi hızını düşürür.`,
    mayin:
      `<b>MAYIN</b>Her hat boğazı enlemesine kapatan bir bariyerdir; ` +
      `çizgi hattın kendisi, noktalar üstünde KALAN mayınlardır. Etiket ` +
      `hattın adını ve kalan/başlangıç sayısını verir.<ul>` +
      key(hex(C.mine), `${own} hattı`, true) +
      key(hex(C.hostile), `${foe} hattı — yalnız tespit edilmişse`, true) +
      `</ul>`,
  };
  $('mod-aciklama').innerHTML = text[mode];
}
