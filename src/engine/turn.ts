import type {
  CombatReport,
  EventEffect,
  Fleet,
  GameState,
  ProvinceId,
  Side,
  Weather,
  HistoricalEvent,
} from '../core/types.ts';
import { prov, provinces } from '../core/geo.ts';
import { dailyRecovery, reinforce } from './combat.ts';
import { isCapital, liveShips } from './naval.ts';
import { repairAir, resolveAir } from './air.ts';
import { accrueResources, applySupply } from './supply.ts';
import { isoOf, scenario } from './scenario.ts';
import { planAi } from './ai.ts';
import { Rng } from './rng.ts';
import { resolveNavalPhase } from './turn-naval.ts';
import { moveLandUnits, resolveLandPhase } from './turn-land.ts';

/**
 * Bir turun (bir günün) çözümü. Sıra önemlidir ve sabittir:
 *
 *   1. Hava
 *   2. Yapay zekâ emirleri (oyuncu olmayan taraf)
 *   3. Hava harekâtı       — keşif istihbaratı sonraki adımları besler
 *   4. Deniz hareketi, mayınlar, tabya düelloları, tarama, mayın dökme
 *   5. Kara hareketi
 *   6. Kara muharebeleri
 *   7. İkmal
 *   8. Toparlanma, takviye, siperlenme
 *   9. Görüş
 *  10. Olaylar ve zafer kontrolü
 *
 * Deterministiktir: aynı durum + aynı emirler = aynı sonuç.
 */

/** Bir tabyanın günlük bastırma toparlanması. */
const FORT_SUPPRESSION_RECOVERY = 0.45;
/** Tabyanın günlük onarımı (hasar görmüş beton ve kundak). */
const FORT_REPAIR = 0.012;

function rollWeather(prev: Weather, rng: Rng, day: number): Weather {
  // Mart–Nisan fırtınalı, yaz açık, Kasım–Aralık yine sert.
  const season = ((day + 50) % 365) / 365;
  const storminess = 0.22 + 0.25 * Math.cos(season * Math.PI * 2);
  if (rng.chance(0.55)) return prev; // hava inatçıdır
  const r = rng.next();
  if (r < storminess * 0.3) return 'firtina';
  if (r < storminess * 0.8) return 'yagmur';
  if (r < storminess * 1.6) return 'puslu';
  return 'acik';
}

export interface TurnResult {
  readonly reports: readonly CombatReport[];
  readonly state: GameState;
}

export function endTurn(state: GameState): TurnResult {
  if (state.outcome) return { reports: [], state };

  const rng = new Rng(state.rngState);
  const reports: CombatReport[] = [];

  state.phase = 'cozum';
  state.weather = rollWeather(state.weather, rng, state.day);

  planAi(state, rng);

  reports.push(...resolveAir(state, rng));
  reports.push(...resolveNavalPhase(state, rng));
  moveLandUnits(state);
  reports.push(...resolveLandPhase(state, rng));

  applySupply(state);
  accrueResources(state);
  repairAir(state);

  for (const u of Object.values(state.landUnits)) {
    if (u.embarkedIn) continue;
    dailyRecovery(state, u);
    reinforce(state, u);
  }
  for (const f of Object.values(state.forts)) {
    f.suppression = Math.max(0, f.suppression - FORT_SUPPRESSION_RECOVERY);
    if (f.integrity > 0.05 && f.integrity < 1) {
      f.integrity = Math.min(1, f.integrity + FORT_REPAIR);
    }
    // Mühimmat ikmali taraf havuzundan.
    if (f.ammo < f.maxAmmo) {
      const want = Math.min(f.maxAmmo - f.ammo, Math.ceil(f.maxAmmo * 0.012));
      const got = Math.min(want, state.sides.ottoman.ammo);
      f.ammo += got;
      state.sides.ottoman.ammo -= got;
    }
  }
  for (const f of Object.values(state.fleets)) {
    const atBase = isRepairWater(state, f.location, f.side);
    for (const s of liveShips(f)) {
      s.ammo = Math.min(1, s.ammo + (atBase ? 0.5 : 0.25));
      // Hasarlı gemi üs sularında onarılır; açık denizde çok yavaş toparlar.
      if (s.hull < 1) s.hull = Math.min(1, s.hull + (atBase ? 0.07 : 0.008));
    }
    // Batan gemiler kayıtta kalır (liveShips zaten süzüyor) — rapor için gerek.
  }

  updateVisibility(state);

  state.day += 1;
  state.date = isoOf(state.day, scenario().startDate);
  arriveReinforcements(state);
  fireEvents(state);
  checkVictory(state);

  state.phase = state.outcome ? 'bitti' : 'emir';
  state.rngState = rng.state;
  state.reports = [...reports, ...state.reports].slice(0, 300);
  return { reports, state };
}

// ──────────────────────────────────────────────────────── görüş ────────

function updateVisibility(state: GameState): void {
  // İl başına bütün birlik ve filoları taramak 4.575 × 643 = 2,9 milyon
  // karşılaştırma + her ilde iki dizi tahsisi demekti; tur süresinin yarısı
  // buradaydı. Varlık kümeleri tur başında TEK geçişte kurulur.
  const presence: Record<Side, Set<ProvinceId>> = {
    ottoman: new Set(),
    entente: new Set(),
  };
  for (const u of Object.values(state.landUnits)) {
    if (u.embarkedIn || u.strength <= 0) continue;
    presence[u.side].add(u.location);
  }
  for (const f of Object.values(state.fleets)) {
    presence[f.side].add(f.location);
  }

  for (const side of ['ottoman', 'entente'] as const) {
    const mine = presence[side];
    const seen = new Set<ProvinceId>();
    for (const p of provinces()) {
      if (state.provinces[p.id]?.controller === side) seen.add(p.id);
    }
    for (const id of mine) seen.add(id);
    // Komşuluktan görüş: yalnız görülen illerin komşularına bak.
    const adjacent: ProvinceId[] = [];
    for (const id of seen) {
      for (const nb of prov(id).neighbours) adjacent.push(nb);
    }
    for (const id of adjacent) seen.add(id);

    for (const id of seen) {
      const st = state.provinces[id];
      if (!st) continue;
      st.seen[side] = true;
      st.lastSeen[side] = state.day;
    }
  }
}


// ─────────────────────────────────────── takviye, olay, zafer ──────────

function arriveReinforcements(state: GameState): void {
  // Dünya senaryosunda `scenario().landUnits` boştur; takviye bilgisi
  // birimin KENDİSİNDE durur. `<=` kullanılır: bir gün atlansa bile
  // birlik sahneye çıkar, sonsuza kadar beklemede kalmaz.
  for (const unit of Object.values(state.landUnits)) {
    if (unit.embarkedIn !== 'bekleme') continue;
    if (unit.arrivesOn === undefined || unit.arrivesOn > state.day) continue;
    unit.embarkedIn = null;
  }
  for (const u of scenario().landUnits) {
    if (u.arrivesOn === undefined || u.arrivesOn !== state.day) continue;
    const unit = state.landUnits[u.id];
    if (!unit) continue;
    unit.embarkedIn = null;
    unit.location = u.location;
  }
  for (const a of scenario().airWings) {
    if (a.arrivesOn === undefined || a.arrivesOn !== state.day) continue;
    const wing = state.airWings[a.id];
    if (wing) wing.planes = wing.maxPlanes;
  }
}

function fireEvents(state: GameState): void {
  for (const e of scenario().events) {
    if (e.day !== state.day || state.firedEvents.includes(e.id)) continue;
    state.firedEvents.push(e.id);
    state.pendingEvents.push(e);
    if (e.effect && !e.choices) applyEffect(state, e.effect);
  }
}

/**
 * Kampanyanın İLK GÜNÜNE yazılı olayları kuyruğa alır.
 *
 * Olaylar `endTurn` içinde `e.day === state.day` ile ateşleniyor ama gün
 * sayacı tur sonunda artıyor: 0. gün hiç kontrol edilmiyordu. Çanakkale'nin
 * 19 Şubat 1915 açılış kartı ve Mezopotamya'nın Fao çıkarması bu yüzden hiç
 * görünmüyordu. Oyun kurulurken bir kez çağrılır.
 */
export function queueOpeningEvents(state: GameState, events: readonly HistoricalEvent[]): void {
  for (const e of events) {
    if (e.day !== 0 || state.firedEvents.includes(e.id)) continue;
    state.firedEvents.push(e.id);
    state.pendingEvents.push(e);
    if (e.effect && !e.choices) applyEffect(state, e.effect);
  }
}

export function applyEffect(state: GameState, effect: EventEffect): void {
  for (const [side, v] of Object.entries(effect.morale ?? {}) as [Side, number][]) {
    state.sides[side].morale = Math.max(0, Math.min(1, state.sides[side].morale + v));
  }
  for (const [side, v] of Object.entries(effect.manpower ?? {}) as [Side, number][]) {
    state.sides[side].manpower = Math.max(0, state.sides[side].manpower + v);
  }
  for (const [side, v] of Object.entries(effect.fortAmmo ?? {}) as [Side, number][]) {
    if (side !== 'ottoman') continue;
    for (const f of Object.values(state.forts)) {
      f.ammo = Math.max(0, Math.round(f.ammo * (1 + v)));
    }
  }
}

function checkVictory(state: GameState): void {
  const v = scenario().victory;

  // ── Simetrik başkent koşulu (dünya senaryosu) ────────────────────
  // Çanakkale'de `capitals` tanımsızdır ve bu blok atlanır.
  if (v.capitals) {
    for (const attacker of ['ottoman', 'entente'] as const) {
      const defender: Side = attacker === 'ottoman' ? 'entente' : 'ottoman';
      const targets = v.capitals[defender];
      if (targets.length === 0) continue;
      const taken = targets.filter(
        (id) => state.provinces[id]?.controller === attacker,
      );
      if (taken.length === targets.length) {
        state.outcome = {
          winner: attacker,
          reason:
            `${attacker === 'ottoman' ? 'İttifak' : 'İtilaf'} karşı bloğun bütün ` +
            `başkentlerini ele geçirdi.`,
          day: state.day,
        };
        return;
      }
    }
  }

  const straitForced =
    v.ententeStraitProvinces.length > 0 &&
    v.ententeStraitProvinces.every((id) => state.provinces[id]?.controller === 'entente');
  if (straitForced) {
    state.outcome = {
      winner: 'entente',
      reason:
        'Birleşik Filo Dar Boğaz\'ı, Nağara\'yı ve Marmara ağzını geçti. ' +
        'Yol İstanbul\'a açık.',
      day: state.day,
    };
    return;
  }

  const capitalLost = countSunkCapitals(state);
  if (capitalLost >= v.ententeCapitalShipLimit) {
    state.outcome = {
      winner: 'ottoman',
      reason: `İtilaf ${capitalLost} büyük gemi kaybetti; filo Mudros'a çekildi.`,
      day: state.day,
    };
    return;
  }

  const mustHoldLost = v.ottomanMustHold.filter(
    (id) => state.provinces[id]?.controller === 'entente',
  );
  if (v.ottomanMustHold.length > 0 && mustHoldLost.length === v.ottomanMustHold.length) {
    state.outcome = {
      winner: 'entente',
      reason: 'Kilitbahir platosu ve Çanakkale düştü; boğaz savunması çöktü.',
      day: state.day,
    };
    return;
  }

  if (state.sides.ottoman.morale <= 0) {
    state.outcome = { winner: 'entente', reason: 'Osmanlı direnci kırıldı.', day: state.day };
    return;
  }
  if (state.sides.entente.morale <= 0) {
    state.outcome = {
      winner: 'ottoman',
      reason: 'İtilaf kamuoyu ve kabinesi harekâtı terk etti.',
      day: state.day,
    };
    return;
  }

  if (state.day >= v.lastDay) {
    state.outcome = {
      winner: v.lastDayWinner ?? 'ottoman',
      reason:
        v.lastDayReason ??
        '9 Ocak 1916 — son İtilaf askeri Seddülbahir\'den ayrıldı. Çanakkale geçilmedi.',
      day: state.day,
    };
  }
}

/** Senaryo başındaki büyük gemi sayısıyla bugünkü farkı. */
function countSunkCapitals(state: GameState): number {
  let start = 0;
  for (const f of scenario().fleets) {
    if (f.nation === 'osmanli' || f.nation === 'alman') continue;
    for (const s of f.ships) {
      if (s.cls === 'dretnot' || s.cls === 'pre_dretnot' || s.cls === 'muharebe_kruvazoru') {
        start++;
      }
    }
  }
  // Yalnız BATAN gemiler sayılır. Savaş dışı kalanlar Mudros'a çekilip
  // onarılıyor (18 Mart'ta Inflexible, Gaulois, Suffren ve Agamemnon böyle
  // yaptı) — geçici hasarla oyun bitmemeli.
  let now = 0;
  for (const f of Object.values(state.fleets)) {
    if (f.side !== 'entente') continue;
    now += f.ships.filter((s) => isCapital(s) && s.hull > 0).length;
  }
  return Math.max(0, start - now);
}

export { rollWeather as _rollWeather };

/**
 * Bu deniz ili bir dost ikmal üssüne bitişik mi — gemiler burada onarılır.
 * İtilaf için Mudros/Limni yönü ve Gökçeada, Osmanlı için Marmara kıyısı.
 */
function isRepairWater(state: GameState, sea: ProvinceId, side: Side): boolean {
  return prov(sea).neighbours.some((n) => {
    const p = prov(n);
    return (
      !p.isSea && p.supplyHub >= 20000 && state.provinces[n]?.controller === side
    );
  });
}

/** Filodaki toplam sağlam gemi — arayüz için. */
export function fleetSize(f: Fleet): number {
  return liveShips(f).length;
}
