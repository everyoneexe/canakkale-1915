import type { CombatReport, GameState, LandUnit, ProvinceId, Side } from '../core/types.ts';
import { mapKind, prov, provinceDist } from '../core/geo.ts';
import { TERRAINS, WEATHERS } from '../data/terrain.ts';
import { commanderMods, resolveLandCombat, templateStats } from './combat.ts';
import { navalSupportFor } from './naval.ts';
import type { Rng } from './rng.ts';

/**
 * Kara birliğinin bir günde alabileceği temel yol (metre) — HARİTA
 * ÖLÇEĞİNE BAĞLI, tıpkı ikmal yıpranması gibi.
 *
 * Çanakkale'de 9 km/gün doğru: 47 ilin arası 1-3 km, hareket zaten
 * muharebeyle kesiliyor. Dünya haritasında komşu illerin arası MEDYAN
 * 65 km; aynı 9 km ile tipik bir adım yedi günden önce bitmiyordu ve
 * (aşağıdaki `moveProgress` hatasıyla birlikte) kara birlikleri dünya
 * haritasında hiç yürüyemiyordu. 1915 piyadesi yolda günde 20-25 km
 * yürür; dünya için 22 km/gün alındı.
 */
function landSpeedM(): number {
  return mapKind() === 'dunya' ? 22000 : 9000;
}

/**
 * Turun KARA fazı: yürüyüş, muharebe, çekilme ve amfibi çıkarma.
 */

// ────────────────────────────────────────────────────────── kara ────────

export function moveLandUnits(state: GameState): void {
  for (const u of Object.values(state.landUnits)) {
    if (u.embarkedIn) continue;
    const order = u.order;
    if (!order) continue;

    if (order.kind === 'cikarma' && order.target) {
      // Çıkarma emri, karaya çıkarma fazında ele alınır.
      continue;
    }
    if (order.kind !== 'yuru' || order.path.length === 0) continue;

    const mods = commanderMods(state, u.commanderId);
    let budget = landSpeedM() * (1 + mods.speed) * WEATHERS[state.weather].movement;
    const path = [...order.path];
    // Hedef değiştiyse yarım kalan yürüyüş sayılmaz.
    if (u.marchingTo && u.marchingTo !== path[0]) u.moveProgress = 0;
    while (path.length > 0 && budget > 0) {
      const next = path[0]!;
      const p = prov(next);
      if (p.isSea) break;
      const st = state.provinces[next]!;
      // Düşman tutuyorsa yürüyüş değil taarruz gerekir.
      if (st.controller && st.controller !== u.side) break;
      const step = provinceDist(u.location, next) * TERRAINS[p.terrain].moveCost;
      if (step > budget) {
        // Hata: ilerleme birikiyor ama HİÇ KULLANILMIYORDU, üstelik 0.95'te
        // tavanlanıyordu. Bir günlük yolu aşan her adım sonsuza kadar
        // tamamlanamıyordu — dünya haritasında (komşular medyan 65 km)
        // kara birlikleri hiç yürüyemiyor, yalnız bitişik ile taarruz
        // edebiliyordu. Panzer grupları Barbarossa boyunca mevzide kaldı.
        u.moveProgress += budget / step;
        if (u.moveProgress < 1) {
          u.marchingTo = next;
          budget = 0;
          break;
        }
        // Yol tamamlandı: kalan bütçe yok, birlik ile varır.
      } else {
        budget -= step;
      }
      u.location = next;
      u.moveProgress = 0;
      u.marchingTo = null;
      u.entrenchment = 0;
      path.shift();
      if (!st.controller) {
        st.controller = u.side;
        st.owner ??= u.side;
      }
      if (budget <= 0) break;
    }
    u.order = path.length > 0 ? { ...order, path } : { kind: 'bekle', target: null, path: [] };
  }
}

export function resolveLandPhase(state: GameState, rng: Rng): CombatReport[] {
  const out: CombatReport[] = [];

  // Taarruz emirlerini hedef ile göre grupla.
  //
  // Hedef KOMŞU ya da birliğin DURDUĞU il olabilir. İkincisi köprübaşı
  // taarruzudur: karaya çıkan birlik düşmanla aynı ilin içindedir,
  // komşusunda değil. Yalnız komşu kabul edildiği için köprübaşı hiç
  // saldıramıyor, ada sonsuza kadar düşmanda kalıyordu — Pasifik'te 150
  // turda 293 çıkarma yapılıyor ve tek bir ada el değiştirmiyordu.
  const attacks = new Map<ProvinceId, { side: Side; units: LandUnit[] }>();
  for (const u of Object.values(state.landUnits)) {
    if (u.embarkedIn || u.strength <= 0) continue;
    if (u.order?.kind !== 'taarruz' || !u.order.target) continue;
    const target = u.order.target;
    const beachhead = target === u.location;
    if (!beachhead && !prov(u.location).neighbours.includes(target)) continue;
    const slot = attacks.get(target);
    if (slot) {
      if (slot.side === u.side) slot.units.push(u);
    } else {
      attacks.set(target, { side: u.side, units: [u] });
    }
  }

  for (const [target, group] of attacks) {
    const st = state.provinces[target]!;
    const defenders = Object.values(state.landUnits).filter(
      (d) => d.location === target && d.side !== group.side && !d.embarkedIn && d.strength > 0,
    );

    if (defenders.length === 0) {
      // Boş il: bedava işgal.
      st.controller = group.side;
      for (const u of group.units) {
        u.location = target;
        u.entrenchment = 0;
        u.order = { kind: 'bekle', target: null, path: [] };
      }
      out.push({
        id: `isgal_${target}_${state.day}`,
        day: state.day,
        kind: 'kara',
        province: target,
        title: `${prov(target).name} direnişsiz alındı`,
        lines: [`${group.units.map((u) => u.name).join(', ')} ili ele geçirdi.`],
        losses: { ottoman: { men: 0, ships: 0, guns: 0 }, entente: { men: 0, ships: 0, guns: 0 } },
        winner: group.side,
      });
      continue;
    }

    const result = resolveLandCombat(
      state,
      {
        province: target,
        attacker: group.side,
        attackers: group.units,
        defenders,
        fortLevel: st.fortLevel,
        navalSupport: navalSupportFor(state, group.side, target),
        airSupport: airSupportFor(state, group.side, target),
      },
      rng,
    );
    out.push(result.report);

    if (result.defenderBroke) {
      st.controller = group.side;
      retreat(state, result.retreating, target);
      for (const u of group.units) {
        u.location = target;
        u.entrenchment = 0;
        u.order = { kind: 'bekle', target: null, path: [] };
      }
    } else if (result.attackerBroke) {
      for (const u of group.units) u.order = { kind: 'bekle', target: null, path: [] };
    }

    // Taarruz cephane yakar.
    const pool = state.sides[group.side];
    pool.ammo = Math.max(0, pool.ammo - group.units.length * 600);
  }

  // Çıkarmalar.
  out.push(...resolveLandings(state, rng));

  return out;
}

function airSupportFor(state: GameState, side: Side, target: ProvinceId): number {
  let n = 0;
  for (const w of Object.values(state.airWings)) {
    if (w.side !== side || w.role !== 'bombardiman' || w.planes <= 0) continue;
    if (w.order?.target !== target) continue;
    n += w.planes * 2.5;
  }
  return n * WEATHERS[state.weather].flying;
}

function retreat(state: GameState, units: LandUnit[], from: ProvinceId): void {
  for (const u of units) {
    const options = prov(from).neighbours.filter((n) => {
      const p = prov(n);
      const st = state.provinces[n];
      return !p.isSea && st && st.controller === u.side;
    });
    if (options.length === 0) {
      // Çekilecek yer yok: birlik teslim olur.
      u.strength = 0;
      u.organisation = 0;
      continue;
    }
    // En sağlam ikmalli komşuya çekil.
    options.sort((a, b) => (state.provinces[b]!.supply ?? 0) - (state.provinces[a]!.supply ?? 0));
    u.location = options[0]!;
    u.entrenchment = 0;
    u.order = { kind: 'bekle', target: null, path: [] };
  }
}

/**
 * Bir sahile BİR GÜNDE çıkarılabilecek cephe genişliği.
 *
 * Çıkarmanın asıl sınırı düşman değil, sahilin kendisidir: kaç çıkarma
 * aracı aynı anda kıyıya yanaşabilir. Bu olmadan oyuncu bütün orduyu tek
 * günde karaya yığıp köprübaşı sorununu yok sayıyordu — oysa Gelibolu'da
 * da Normandiya'da da savaşın şekli ilk gün karaya ÇIKARILAMAYAN kuvvet
 * yüzünden belirlendi.
 *
 * Arazinin muharebe genişliğinin yarısı: dar bir koy bir tümen, geniş bir
 * kumsal üç tümen alır.
 */
function landingWidth(terrainWidth: number): number {
  return Math.max(6, terrainWidth / 2);
}

function resolveLandings(state: GameState, rng: Rng): CombatReport[] {
  const out: CombatReport[] = [];
  const byTarget = new Map<ProvinceId, LandUnit[]>();

  for (const u of Object.values(state.landUnits)) {
    if (u.order?.kind !== 'cikarma' || !u.order.target) continue;
    if (!u.embarkedIn || u.embarkedIn === 'bekleme') continue;
    const list = byTarget.get(u.order.target);
    if (list) list.push(u);
    else byTarget.set(u.order.target, [u]);
  }

  for (const [target, waiting] of byTarget) {
    const p = prov(target);
    const st = state.provinces[target]!;
    const side = waiting[0]!.side;

    // ── Dalga: sahile sığan kadarı bu gün çıkar ────────────────────
    // Örgütü en sağlam olan önce çıkar; geri kalan gemide kalır ve
    // emrini korur, ertesi gün ikinci dalga olur.
    const sorted = [...waiting].sort((a, b) => b.organisation - a.organisation);
    const cap = landingWidth(TERRAINS[p.terrain].combatWidth);
    const units: LandUnit[] = [];
    let used = 0;
    for (const u of sorted) {
      const w = templateStats(u.templateId).width;
      if (used + w > cap && units.length > 0) continue;
      units.push(u);
      used += w;
    }
    const held = sorted.length - units.length;

    const defenders = Object.values(state.landUnits).filter(
      (d) => d.location === target && d.side !== side && !d.embarkedIn && d.strength > 0,
    );

    const mods = commanderMods(state, units[0]!.commanderId);
    const support = navalSupportFor(state, side, target);
    const air = airSupportFor(state, side, target);
    const lines: string[] = [
      `${units.length} birlik ${p.name} sahiline çıkıyor (sahil kapasitesi ${cap.toFixed(0)}).`,
    ];
    if (held > 0) {
      lines.push(`${held} birlik sahile sığmadı — gemide, ikinci dalgada.`);
    }
    lines.push(
      support > 0
        ? `Deniz topçusu desteği ${support.toFixed(0)}.`
        : 'Deniz topçusu desteği yok.',
    );
    if (air > 0) lines.push(`Hava desteği ${air.toFixed(0)}.`);
    const losses = {
      ottoman: { men: 0, ships: 0, guns: 0 },
      entente: { men: 0, ships: 0, guns: 0 },
    };

    // Sahile çıkarken savunanın ateşi altında kayıp verilir.
    let defFire = 0;
    for (const d of defenders) {
      const s = templateStats(d.templateId);
      defFire += s.defence * (d.strength / d.maxStrength) * (1 + d.entrenchment * 0.1);
    }
    // Tahkimat çıkarmada kara muharebesinden AĞIR basar: betona gömülü
    // makineli, kumsalda açıktaki bölüğü biçer. Eskiden `fortLevel`
    // çıkarmada hiç okunmuyordu; tahkimli sahil ile boş kumsal aynıydı.
    const fortMul = 1 + st.fortLevel * 0.35;
    if (st.fortLevel > 0) {
      lines.push(
        `Sahil tahkimatı ${st.fortLevel} → savunan ateşi ×${fortMul.toFixed(2)}.`,
      );
    }
    // Kayıp tavanı tahkimatla yükselir. Sabit %40 tavanda 2. seviye
    // tahkimat tavanı zaten doyuruyor, 4. seviye hiçbir şey eklemiyordu:
    // betonarme sahil ile tel örgülü sahil aynı kayıbı veriyordu.
    const lossCap = Math.min(0.75, 0.4 + st.fortLevel * 0.09);
    const shield = 1 / (1 + (support + air) / 400);
    for (const u of units) {
      const hit = Math.round(
        u.strength * Math.min(lossCap, defFire * fortMul * 0.0009) * shield * rng.jitter(0.4) *
          (1 - mods.amphibious),
      );
      u.strength = Math.max(0, u.strength - hit);
      u.organisation = Math.max(0, u.organisation * 0.55);
      u.entrenchment = 0;
      u.embarkedIn = null;
      u.location = target;
      u.order = { kind: 'bekle', target: null, path: [] };
      losses[side].men += hit;
      lines.push(`${u.name}: ${hit} kayıp.`);
    }

    for (const f of Object.values(state.fleets)) {
      f.embarked = f.embarked.filter((id) => !units.some((u) => u.id === id));
    }

    if (defenders.length === 0) {
      st.controller = side;
      lines.push('Sahil boştu — köprübaşı kuruldu.');
    } else {
      lines.push('Köprübaşı savunanın hattı önünde tutuluyor; taarruz gerekiyor.');
    }

    out.push({
      id: `cikarma_${target}_${state.day}`,
      day: state.day,
      kind: 'kara',
      province: target,
      title: `${p.name} — çıkarma`,
      lines,
      losses,
      winner: defenders.length === 0 ? side : null,
    });
  }

  return out;
}

