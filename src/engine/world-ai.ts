import type { GameState, LandUnit, ProvinceId, Side } from '../core/types.ts';
import { findPath, prov, provinces } from '../core/geo.ts';
import { effective } from './combat.ts';
import { liveShips } from './naval.ts';
import type { Rng } from './rng.ts';

/**
 * Harita bağımsız cephe yapay zekâsı — dünya senaryosu için.
 *
 * Çanakkale yapay zekâsı il kimliklerine gömülüydü (boğaz ekseni, çıkarma
 * sahilleri); 4.575 illik bir haritada işe yaramaz. Buradaki mantık tamamen
 * topolojiktir: cephe neredeyse oraya yürü, üstünsen saldır, değilsen siperlen.
 *
 * PERFORMANS: 643 tümen var. Birim başına bütün haritayı taramak tur başına
 * ~3 milyar işlem ederdi. Bunun yerine tur başında TEK bir çok kaynaklı BFS
 * ile "cepheye uzaklık" alanı hesaplanır; her birim sonra yalnız kendi
 * komşularına bakar. Toplam maliyet O(il + kenar + birim).
 */

interface Frontline {
  /** il -> en yakın düşman sınırına kaç adım. */
  readonly distance: Map<ProvinceId, number>;
  /** Düşmanla temas hâlindeki kendi illerimiz. */
  readonly frontier: ReadonlySet<ProvinceId>;
}

function buildFrontline(state: GameState, side: Side): Frontline {
  const enemy: Side = side === 'ottoman' ? 'entente' : 'ottoman';
  const frontier = new Set<ProvinceId>();
  const distance = new Map<ProvinceId, number>();
  const queue: ProvinceId[] = [];

  for (const p of provinces()) {
    if (p.isSea) continue;
    if (state.provinces[p.id]?.controller !== side) continue;
    const touching = p.neighbours.some((n) => {
      const np = state.provinces[n];
      return np?.controller === enemy && !prov(n).isSea;
    });
    if (touching) {
      frontier.add(p.id);
      distance.set(p.id, 0);
      queue.push(p.id);
    }
  }

  // Çok kaynaklı BFS — yalnız kendi topraklarımız üzerinden yayılır.
  for (let head = 0; head < queue.length; head++) {
    const cur = queue[head]!;
    const d = distance.get(cur)!;
    if (d > 24) continue;
    for (const nb of prov(cur).neighbours) {
      if (distance.has(nb)) continue;
      const np = prov(nb);
      if (np.isSea) continue;
      if (state.provinces[nb]?.controller !== side) continue;
      distance.set(nb, d + 1);
      queue.push(nb);
    }
  }
  return { distance, frontier };
}

function stackAttack(state: GameState, id: ProvinceId, side: Side): number {
  let p = 0;
  for (const u of Object.values(state.landUnits)) {
    if (u.location !== id || u.side !== side || u.embarkedIn) continue;
    p += effective(u).attack;
  }
  return p;
}

function stackDefence(state: GameState, id: ProvinceId, side: Side): number {
  const fort = state.provinces[id]?.fortLevel ?? 0;
  let p = 0;
  for (const u of Object.values(state.landUnits)) {
    if (u.location !== id || u.side !== side || u.embarkedIn) continue;
    p += effective(u).defence * (1 + u.entrenchment * 0.06) * (1 + fort * 0.12);
  }
  return p;
}

/**
 * `forSide` verilmezse oyuncu olmayan taraf planlanır. Denge simülasyonları
 * iki tarafı da sürebilmek için bu parametreyi kullanır.
 */
export function planWorldAi(state: GameState, rng: Rng, forSide?: Side): void {
  const ai: Side = forSide ?? (state.playerSide === 'ottoman' ? 'entente' : 'ottoman');
  const enemy: Side = ai === 'ottoman' ? 'entente' : 'ottoman';
  const front = buildFrontline(state, ai);

  // Saldırı gücü il başına bir kez hesaplanır, her birim için değil.
  const attackCache = new Map<ProvinceId, number>();
  const defenceCache = new Map<ProvinceId, number>();
  const atk = (id: ProvinceId, s: Side) => {
    const k = `${id}|${s}`;
    let v = attackCache.get(k);
    if (v === undefined) {
      v = stackAttack(state, id, s);
      attackCache.set(k, v);
    }
    return v;
  };
  const def = (id: ProvinceId, s: Side) => {
    const k = `${id}|${s}`;
    let v = defenceCache.get(k);
    if (v === undefined) {
      v = stackDefence(state, id, s);
      defenceCache.set(k, v);
    }
    return v;
  };

  for (const u of Object.values(state.landUnits)) {
    if (u.side !== ai || u.strength <= 0 || u.embarkedIn) continue;
    planUnit(state, u, ai, enemy, front, atk, def, rng);
  }

  // Donanma: kendi kıyı sularında devriye, düşman kıyısını abluka altına al.
  for (const f of Object.values(state.fleets)) {
    if (f.side !== ai || liveShips(f).length === 0) continue;
    if (f.order && f.order.path.length > 0) continue;
    const here = prov(f.location);
    const hostileCoast = here.neighbours.find((n) => {
      const np = state.provinces[n];
      return np?.controller === enemy && !prov(n).isSea;
    });
    if (hostileCoast) {
      f.order = { kind: 'bombardiman', target: f.location, path: [] };
      continue;
    }
    // Düşman kıyısına komşu bir deniz iline doğru yola çık.
    const target = nearestHostileWater(state, f.location, enemy);
    if (target && target !== f.location) {
      const path = findPath(f.location, target, (id) => prov(id).isSea, undefined, 4000);
      f.order = path
        ? { kind: 'seyret', target, path }
        : { kind: 'demirle', target: null, path: [] };
    } else {
      f.order = { kind: 'demirle', target: null, path: [] };
    }
  }
}

function planUnit(
  state: GameState,
  u: LandUnit,
  side: Side,
  enemy: Side,
  front: Frontline,
  atk: (id: ProvinceId, s: Side) => number,
  def: (id: ProvinceId, s: Side) => number,
  rng: Rng,
): void {
  const here = prov(u.location);
  const healthy = u.organisation > u.maxOrganisation * 0.5 && u.supplied > 0.45;

  // 1) Komşuda ele geçirilebilir düşman ili var mı?
  let best: ProvinceId | null = null;
  let bestRatio = 0;
  for (const nb of here.neighbours) {
    const np = prov(nb);
    if (np.isSea) continue;
    const st = state.provinces[nb];
    if (!st) continue;
    if (st.controller === side) continue;
    // Tarafsız topraklara girilmez — savaş genişletmek oyuncunun kararı.
    if (st.controller === null) continue;
    const mine = atk(u.location, side);
    const theirs = def(nb, enemy);
    const ratio = theirs > 0.5 ? mine / theirs : 99;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = nb;
    }
  }
  // Eşik 1.6 iken cephe hiç kıpırdamıyordu: iki taraf da siperlenince
  // savunma çarpanı (siper ×1.48 + yığın) oranı hep 1.6'nın altında tutuyor
  // ve savaş ilk haftadan sonra tamamen donuyordu. 1.15 gerçek WW1 hissini
  // koruyor (ilerleme yavaş ve pahalı) ama cepheyi canlı tutuyor.
  if (best && healthy && bestRatio > 1.15) {
    u.order = { kind: 'taarruz', target: best, path: [] };
    return;
  }

  // 2) Cephedeysek siperlen.
  const d = front.distance.get(u.location);
  if (d === 0) {
    u.order = { kind: 'siperlen', target: null, path: [] };
    return;
  }

  // 3) Cephe uzaktaysa oraya doğru bir adım at. BFS alanı sayesinde yalnız
  //    komşulara bakmak yetiyor: mesafesi daha küçük olan komşuya yürü.
  if (d !== undefined && d > 0) {
    const downhill = here.neighbours.filter((n) => (front.distance.get(n) ?? 99) < d);
    if (downhill.length > 0) {
      const step = downhill.length === 1 ? downhill[0]! : rng.pick(downhill);
      u.order = { kind: 'yuru', target: step, path: [step] };
      return;
    }
  }

  u.order = { kind: 'siperlen', target: null, path: [] };
}

function nearestHostileWater(
  state: GameState,
  from: ProvinceId,
  enemy: Side,
): ProvinceId | null {
  // Sınırlı genişlikte BFS — bütün okyanusu taramanın anlamı yok.
  const seen = new Set<ProvinceId>([from]);
  const queue: ProvinceId[] = [from];
  for (let head = 0; head < queue.length && head < 1200; head++) {
    const cur = queue[head]!;
    for (const nb of prov(cur).neighbours) {
      if (seen.has(nb)) continue;
      seen.add(nb);
      const np = prov(nb);
      if (!np.isSea) {
        if (state.provinces[nb]?.controller === enemy) return cur;
        continue;
      }
      queue.push(nb);
    }
  }
  return null;
}
