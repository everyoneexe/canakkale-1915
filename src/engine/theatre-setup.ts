import type { GameState, Side } from '../core/types.ts';
import type { MapKind } from '../core/geo.ts';
import type { Theatre } from '../data/theatres.ts';
import { newGame } from './scenario.ts';
import { newWorldGame } from './world-scenario.ts';

/**
 * Tiyatro kurulumu — bir cephenin hangi harita ve hangi senaryoyla
 * açılacağı TEK yerde.
 *
 * Eskiden `main.ts` içinde `const useOwnMap = th.ownMap === 'canakkale'`
 * diye bir boolean vardı ve ondan beş ayrı karar türüyordu: harita türü,
 * bbox, senaryo kurucusu, marka yazısı, açılış odağı, brifing kartı.
 * Yeni bir ayrıntılı tiyatro eklemek o beş dalı da bulmayı gerektiriyordu.
 *
 * Artık cepheyi `theatres.ts` içinde `ownMap` ile işaretlemek ve gerekirse
 * buraya bir satır yazmak yetiyor.
 */
export interface TheatreSetup {
  readonly mapKind: MapKind;
  /** Ortak dünya haritası kırpması; kendi haritası olan cephede yok. */
  readonly bbox?: readonly [number, number, number, number];
  /** Üst barda görünen ad. */
  readonly brand: string;
  /** Kendi haritası olan cephede oyuncunun açılışta baktığı il. */
  readonly focus?: (side: Side) => string;
  /** Açılış brifing kartı gösterilsin mi (kendi haritası olan cepheler). */
  readonly briefing: boolean;
  readonly makeGame: (side: Side) => GameState;
}

/** Varsayılan dünya tohumu — kampanyalar arası tekrarlanabilirlik için. */
const WORLD_SEED = 19140728;

/**
 * Kendi haritası olan cephelere özgü ayarlar. Anahtar `Theatre.ownMap`.
 * Burada olmayan ayrıntılı harita varsayılan davranışı alır: markası
 * cephenin adı, açılış odağı yok.
 */
const DETAILED: Record<string, { brand?: string; focus?: (side: Side) => string }> = {
  canakkale: {
    brand: 'ÇANAKKALE',
    // Osmanlı dar boğaza, İtilaf boğaz ağzına bakarak başlar: ilk kare
    // oyuncuya o cephede neyin önemli olduğunu söyler.
    focus: (side) => (side === 'ottoman' ? 'd_dar_bogaz' : 'd_bogaz_agzi'),
  },
};

export function setupFor(th: Theatre): TheatreSetup {
  const own = th.ownMap;
  if (own) {
    const extra = DETAILED[own] ?? {};
    return {
      mapKind: own,
      brand: extra.brand ?? th.name.toLocaleUpperCase('tr-TR'),
      ...(extra.focus ? { focus: extra.focus } : {}),
      briefing: true,
      // Çanakkale'nin elle yazılmış senaryosu var: tabyalar, mayın hatları,
      // muharebe düzeni. Diğer ayrıntılı haritalar şimdilik yok.
      makeGame: (side) => newGame(side),
    };
  }
  return {
    mapKind: 'dunya',
    ...(th.bbox ? { bbox: th.bbox } : {}),
    brand: th.name.toLocaleUpperCase('tr-TR'),
    briefing: false,
    makeGame: (side) => newWorldGame(side, WORLD_SEED, th),
  };
}
