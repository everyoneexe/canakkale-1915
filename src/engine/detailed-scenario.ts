import type {
  Commander,
  GameState,
  LandUnit,
  Province,
  ProvinceId,
  Scenario,
  Side,
  SideState,
} from '../core/types.ts';
import { freshAiMemory } from '../core/types.ts';
import { provinces } from '../core/geo.ts';
import { aggregate } from '../data/battalions.ts';
import { TEMPLATE_BY_ID } from '../data/templates.ts';
import { FRONT_PACKS } from '../data/fronts/index.ts';
import { NATIONS } from '../data/world1914.ts';
import { NATIONS_WW2 } from '../data/world1939.ts';
import type { Theatre } from '../data/theatres.ts';
import { dayOf, setActiveScenario } from './scenario.ts';

/**
 * Kendi yüksek çözünürlüklü haritası olan cepheler için senaryo.
 *
 * İki kurulum zaten vardı ve ikisi de buna uymuyordu:
 *
 *  - `scenario.ts` Çanakkale'ye özgü: tabyalar, mayın hatları ve elle
 *    yazılmış muharebe düzeni. Başka cepheye taşınamaz.
 *  - `world-scenario.ts` Natural Earth üst verisine dayanır: toprağı ulus
 *    sınırlarından, ikmal merkezini nüfustan türetir. Kendi haritası olan
 *    bir cephede o üst veri yok.
 *
 * Ayrıntılı haritada toprak, zafer puanı ve ikmal merkezi ZATEN il
 * verisinin içinde (`tools/build_map.py` tohumlardan yazıyor). Burada
 * yapılan iş o veriyi cephe paketindeki teşkilâtla birleştirmek.
 */

/** Yan kaynakları — ayrıntılı cepheler dünya cephelerinden küçüktür. */
const SIDES: Readonly<Record<Side, SideState>> = {
  // ottoman = İttifak
  ottoman: {
    side: 'ottoman',
    manpower: 180000,
    manpowerPerDay: 900,
    morale: 0.7,
    ammo: 90000,
    ammoPerDay: 1400,
    intel: 0.3,
  },
  // entente = İtilaf
  entente: {
    side: 'entente',
    manpower: 220000,
    manpowerPerDay: 1200,
    morale: 0.72,
    ammo: 140000,
    ammoPerDay: 2200,
    intel: 0.3,
  },
};

/** Koordinata en yakın KARA ili. */
function nearestLand(lon: number, lat: number, pool: readonly Province[]): Province | null {
  let best: Province | null = null;
  let bestD = Infinity;
  for (const p of pool) {
    const dx = (p.lon - lon) * Math.cos((lat * Math.PI) / 180);
    const dy = p.lat - lat;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}

/** Ulus kimliği -> taraf. İki savaşın künye listesi birlikte taranır. */
function sideOfNation(id: string): Side | null {
  const spec =
    NATIONS.find((n) => n.id === id) ?? NATIONS_WW2.find((n) => n.id === id) ?? null;
  if (!spec) return null;
  return spec.side === 'ittifak' ? 'ottoman' : 'entente';
}

/**
 * Her tarafın "başkenti": o tarafın BAŞLANGIÇTA elindeki en yüksek zafer
 * puanlı iller. Zafer koşulu bunların düşmesine bakar.
 */
function keyProvinces(side: Side, n: number): ProvinceId[] {
  return provinces()
    .filter((p) => !p.isSea && p.startOwner === side && p.victoryPoints > 0)
    .sort((a, b) => b.victoryPoints - a.victoryPoints)
    .slice(0, n)
    .map((p) => p.id);
}

export function detailedScenario(th: Theatre): Scenario {
  const pack = FRONT_PACKS[th.id];
  return {
    id: th.id,
    name: th.name,
    desc: th.desc,
    startDate: th.start,
    endDate: th.end,
    playerSide: 'ottoman',
    map: { provinces: provinces() } as unknown as Scenario['map'],
    templates: [],
    landUnits: [],
    fleets: [],
    airWings: [],
    forts: [],
    minefields: [],
    commanders: (pack?.commanders ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      rank: c.rank,
      side: c.side,
      nation: c.nation,
      kind: c.kind,
      bio: c.bio,
      skill: c.skill,
      traits: c.traits,
      availableFrom: dayOf(c.from, th.start),
      src: c.src,
      assignedTo: null,
    })),
    events: (pack?.events ?? []).map((e) => ({ ...e, day: dayOf(e.date, th.start) })),
    sides: SIDES,
    victory: {
      capitals: { ottoman: keyProvinces('ottoman', 2), entente: keyProvinces('entente', 2) },
      ententeStraitProvinces: [],
      ententeCapitalShipLimit: 9999,
      ottomanMustHold: [],
      lastDay: dayOf(th.end, th.start),
      lastDayWinner: 'entente',
      lastDayReason: `${th.name} sona erdi.`,
    },
  };
}

export function newDetailedGame(
  playerSide: Side,
  seed: number,
  th: Theatre,
): GameState {
  const sc = detailedScenario(th);
  setActiveScenario(sc);

  const provStates: GameState['provinces'] = {};
  for (const p of provinces()) {
    // Toprak doğrudan harita verisinden; deniz illeri sahipsiz.
    const owner = p.isSea ? null : p.startOwner;
    provStates[p.id] = {
      owner,
      controller: owner,
      supply: owner ? 1 : 0,
      fortLevel: 0,
      seen: { ottoman: true, entente: true },
      lastSeen: { ottoman: 0, entente: 0 },
    };
  }

  // ── Pakette yazılı tarihsel birlikler ────────────────────────────
  const landPool = provinces().filter((p) => !p.isSea);
  const landUnits: Record<string, LandUnit> = {};
  for (const f of FRONT_PACKS[th.id]?.formations ?? []) {
    const side = sideOfNation(f.nation);
    const tpl = TEMPLATE_BY_ID[f.templateId];
    if (!side || !tpl) continue;
    const home = nearestLand(f.at[0], f.at[1], landPool);
    if (!home) continue;
    const agg = aggregate(tpl);
    const id = `pk_${f.name.replace(/\W+/g, '_').toLocaleLowerCase('tr')}`;
    const arrives = f.arrivesOn ? Math.max(0, dayOf(f.arrivesOn, th.start)) : 0;
    landUnits[id] = {
      id,
      name: f.name,
      nation: tpl.nation,
      side,
      templateId: f.templateId,
      location: home.id,
      strength: agg.men,
      maxStrength: agg.men,
      organisation: agg.organisation,
      maxOrganisation: agg.organisation,
      entrenchment: 1,
      experience: 10,
      supplied: 1,
      commanderId: null,
      order: null,
      moveProgress: 0,
      marchingTo: null,
      inCombat: false,
      embarkedIn: arrives > 0 ? 'bekleme' : null,
      ...(arrives > 0 ? { arrivesOn: arrives } : {}),
    };
  }

  return {
    day: 0,
    date: th.start,
    phase: 'emir',
    weather: 'acik',
    playerSide,
    provinces: provStates,
    landUnits,
    fleets: {},
    airWings: {},
    forts: {},
    minefields: {},
    commanders: Object.fromEntries(
      sc.commanders.map((c) => [c.id, structuredClone(c) as Commander]),
    ) as Record<string, Commander>,
    sides: structuredClone(SIDES) as Record<Side, SideState>,
    reports: [],
    firedEvents: [],
    pendingEvents: [],
    ai: freshAiMemory(),
    rngState: seed,
    outcome: null,
  };
}
