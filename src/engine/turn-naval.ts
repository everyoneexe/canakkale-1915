import type { CombatReport, GameState } from '../core/types.ts';
import { prov, provinceDist } from '../core/geo.ts';
import { TERRAINS } from '../data/terrain.ts';
import { commanderMods } from './combat.ts';
import {
  layMines,
  liveShips,
  resolveMines,
  fortsCovering,
  minefieldsIn,
  sideOfFort,
  resolveNavalFire,
  resolveSweeping,
} from './naval.ts';
import type { Rng } from './rng.ts';

/**
 * Filonun bir günde alabileceği temel yol (metre).
 * 15 knot × 24 saat = 660 km; manevra, gece duruşu ve tedbirli seyirle
 * fiilen günde ~120 km. Boğazdaki yavaşlama arazi maliyeti ve akıntıdan gelir.
 */
const FLEET_SPEED_M = 120000;

/**
 * Turun DENİZ fazı: filo hareketi, mayın, tabya düellosu, tarama.
 *
 * `turn.ts` 814 satırdı ve dört fazı birden taşıyordu; amfibi çıkarma
 * eklenince deniz fazını görmek için kara muharebesini aşmak gerekiyordu.
 */

// ───────────────────────────────────────────────────────── deniz ────────

export function resolveNavalPhase(state: GameState, rng: Rng): CombatReport[] {
  const out: CombatReport[] = [];

  for (const f of Object.values(state.fleets)) {
    if (liveShips(f).length === 0) continue;
    f.inCombat = false;
    f.transited = [];
    const order = f.order;
    if (!order) continue;

    // ── Hareket ──
    if (
      (order.kind === 'seyret' || order.kind === 'zorla_gec') &&
      order.path.length > 0
    ) {
      const mods = commanderMods(state, f.commanderId);
      let budget = FLEET_SPEED_M * (1 + mods.speed);
      const path = [...order.path];
      let hops = 0;
      while (path.length > 0 && budget > 0) {
        const next = path[0]!;
        const p = prov(next);
        if (!p.isSea) break;
        const step =
          provinceDist(f.location, next) * TERRAINS[p.terrain].moveCost +
          // Akıntıya karşı (Marmara'dan Ege'ye akar) yukarı gitmek pahalı.
          (p.current ?? 0) * 2400;
        // Bir gün en az bir il atlamaya yeter. Bu garanti olmazsa maliyeti
        // bütçeyi kıl payı aşan ilk adımda filo kalıcı olarak kilitleniyor.
        if (step > budget && hops > 0) break;
        hops++;
        budget -= step;
        f.location = next;
        path.shift();
        // Zorlama manevrasında geçilen her il tabya ateşine maruz kalır.
        if (order.kind === 'zorla_gec') {
          f.transited.push(next);
          // BOĞAZ BİR GÜNDE GEÇİLMEZ. Savunulan bir ile — canlı düşman
          // tabyası ateş menzilinde ya da mayın hattı duruyor — girildiğinde
          // filo orada durur ve o gün orayı dövüşerek geçmeye çalışır.
          //
          // Bu kural olmadan günlük tur soyutlaması ışınlanmaya izin
          // veriyordu: filo Boğaz Ağzı'ndan Marmara'ya tek turda çıkıyor,
          // yol boyunca her tabyanın günlük ateşinden yalnızca birer pay
          // alıp %10 hasarla boğazı geçiyordu. Tarihte donanma yedi saat
          // dövüşüp Dar Boğaz'ı hiç geçemedi.
          const defended =
            minefieldsIn(state, next).some((m) => m.mines > 0) ||
            fortsCovering(state, next).some(
              (x) => x.integrity > 0.05 && x.ammo > 0 && sideOfFort(state, x) !== f.side,
            );
          if (defended) break;
        }

        // Her yeni ile girişte mayın riski.
        const mine = resolveMines(state, f, rng);
        if (mine.report) {
          out.push(mine.report);
          f.inCombat = true;
        }
        if (liveShips(f).length === 0) break;
      }
      f.order = { ...order, path };
      if (path.length === 0) f.order = { kind: 'demirle', target: null, path: [] };
    }

    if (liveShips(f).length === 0) continue;

    // ── Durduğu yerdeki harekât ──
    // Tabya ateşi burada ÇÖZÜLMEZ; bütün filolar için tek seferde
    // resolveNavalFire içinde çözülür (bkz. naval.ts kalibrasyon notu).
    switch (f.order?.kind) {
      case 'mayin_tara': {
        const sweep = resolveSweeping(state, f, rng);
        if (sweep) out.push(sweep);
        const mine = resolveMines(state, f, rng);
        if (mine.report) out.push(mine.report);
        break;
      }
      case 'mayin_dok': {
        const rep = layMines(state, f, f.order.target ?? f.location);
        if (rep) out.push(rep);
        f.order = { kind: 'demirle', target: null, path: [] };
        break;
      }
      default:
        break;
    }
  }

  // Tabya-donanma ateşi: günde bir, bütün harita için.
  out.push(...resolveNavalFire(state, rng));

  // Batan gemilerin taşıdığı birlikler kaybolur.
  for (const f of Object.values(state.fleets)) {
    if (liveShips(f).length > 0) continue;
    for (const uid of f.embarked) {
      const u = state.landUnits[uid];
      if (u) u.strength = 0;
    }
    f.embarked = [];
  }

  return out;
}

