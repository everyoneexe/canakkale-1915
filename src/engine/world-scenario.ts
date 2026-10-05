import type {
  Commander,
  Fleet,
  GameState,
  LandUnit,
  ProvinceId,
  Province,
  Scenario,
  Side,
  SideState,
  UnitId,
} from '../core/types.ts';
import { freshAiMemory } from '../core/types.ts';
import { metaOf, provinces, setProvinceValues } from '../core/geo.ts';
import { TEMPLATE_BY_ID, aggregate } from '../data/units.ts';
import { NATIONS, WORLD_EVENTS } from '../data/world1914.ts';
import { FRONT_PACKS } from '../data/fronts/index.ts';
import type { NationSpec } from '../data/world1914.ts';
import { NATIONS_WW2 } from '../data/world1939.ts';
import { THEATRE_BY_ID } from '../data/theatres.ts';
import type { Theatre } from '../data/theatres.ts';
import { dayOf, setActiveScenario } from './scenario.ts';

/** Cephe verilmezse tüm dünya / 1914. */
const DEFAULT_THEATRE = THEATRE_BY_ID['ww1_dunya']!;

/**
 * Bu cephede fiilen savaşan uluslar.
 *
 * Ulusun savaşta olduğu aralık [joins, leaves] cephe aralığıyla KESİŞMELİ.
 * Aksi hâlde 1941 Doğu Cephesi'nde 1939'da yenilmiş Polonya tümenleri
 * sahaya iniyor.
 */
function nationsFor(th: Theatre): readonly NationSpec[] {
  const all = th.war === 'ww2' ? NATIONS_WW2 : NATIONS;
  const t0 = Date.parse(th.start);
  const t1 = Date.parse(th.end);
  return all.filter((n) => {
    const from = n.joins ? Date.parse(n.joins) : -Infinity;
    const until = n.leaves ? Date.parse(n.leaves) : Infinity;
    return from <= t1 && until >= t0;
  });
}

/** İlin o savaştaki sahibi ve tarafı. */
function ownerOf(id: ProvinceId, th: Theatre): { nation: string; side: Side | null } {
  const m = metaOf(id);
  if (!m) return { nation: '', side: null };
  if (th.war === 'ww2') {
    return {
      nation: m.nation38,
      side: m.side38 === 'eksen' ? 'ottoman' : m.side38 === 'muttefik' ? 'entente' : null,
    };
  }
  return {
    nation: m.nation,
    side: m.side === 'ittifak' ? 'ottoman' : m.side === 'itilaf' ? 'entente' : null,
  };
}

/**
 * 1914 Dünya senaryosu — 4.575 ilin üzerine kurulur.
 *
 * Motor iki taraflıdır; eşleme:  ottoman = İttifak, entente = İtilaf.
 * Tarafsız ülkelerin illeri `controller: null` ile başlar ve savaşa girene
 * kadar kimsenin değildir.
 *
 * Birlikler PROSEDÜREL yerleştirilir: her ulusun tarihsel tümen sayısı,
 * kendi illerine nüfus/alan ağırlığına göre dağıtılır. 4.100 kara ili için
 * elle muharebe düzeni yazmak ne mümkün ne de anlamlı; önemli olan doğru
 * büyüklük ve doğru yer.
 */

/** Ulus kimliği -> o ulusa ait kara illeri. */
function groupByNation(th: Theatre): Map<string, Province[]> {
  const out = new Map<string, Province[]>();
  for (const p of provinces()) {
    if (p.isSea) continue;
    const { nation } = ownerOf(p.id, th);
    if (!nation) continue;
    const list = out.get(nation);
    if (list) list.push(p);
    else out.set(nation, [p]);
  }
  return out;
}

/**
 * Seçilen il, ulusun gerçek başkentine yetecek kadar yakın mı.
 *
 * 4 derece ≈ 450 km; bir başkentin kendi ilinin bu kadar uzağa düşmesi
 * ancak haritanın o bölgeyi hiç içermediği anlamına gelir.
 */
function nearEnough(p: Province, capital: readonly [number, number]): boolean {
  return (p.lon - capital[0]) ** 2 + ((p.lat - capital[1]) * 1.4) ** 2 < 16;
}

function nearestProvince(lon: number, lat: number, pool: readonly Province[]): Province | null {
  let best: Province | null = null;
  let bestD = Infinity;
  for (const p of pool) {
    const d = (p.lon - lon) ** 2 + ((p.lat - lat) * 1.4) ** 2;
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}

export interface WorldSetup {
  /** il -> başlangıç sahibi (null = tarafsız). */
  readonly owners: Record<ProvinceId, Side | null>;
  readonly capitals: Record<string, ProvinceId>;
  readonly victoryPoints: Record<ProvinceId, number>;
  readonly supplyHubs: Record<ProvinceId, number>;
  readonly landUnits: Record<UnitId, LandUnit>;
  readonly fleets: Record<UnitId, Fleet>;
}

const SIDE_OF: Record<'ittifak' | 'itilaf' | 'tarafsiz', Side | null> = {
  ittifak: 'ottoman',
  itilaf: 'entente',
  tarafsiz: null,
};

/** Bir ulusun tümenlerini illerine dağıt — sınır illeri önceliklidir. */
function placeDivisions(
  nation: NationSpec,
  own: readonly Province[],
  enemyOwned: ReadonlySet<ProvinceId>,
): Province[] {
  if (own.length === 0) return [];
  // Düşman iline komşu olan iller cepheye yakındır; oraya daha çok tümen.
  const scored = own.map((p) => {
    const frontier = p.neighbours.some((n) => enemyOwned.has(n)) ? 6 : 1;
    const size = (metaOf(p.id)?.cells ?? 1) ** 0.4;
    return { p, w: frontier * size };
  });
  scored.sort((a, b) => b.w - a.w);

  const slots: Province[] = [];
  const total = scored.reduce((n, s) => n + s.w, 0) || 1;
  for (const s of scored) {
    const share = Math.round((s.w / total) * nation.divisions);
    for (let i = 0; i < share; i++) slots.push(s.p);
    if (slots.length >= nation.divisions) break;
  }
  // Yuvarlama kaybını en yüklü illere ekle.
  let i = 0;
  while (slots.length < nation.divisions && scored.length > 0) {
    slots.push(scored[i % scored.length]!.p);
    i++;
  }
  return slots.slice(0, nation.divisions);
}

/**
 * Prosedürel tümenin hangi şablonla kurulacağı. Savaşa göre AYRI tablolar:
 * iki savaşın ulus kimlikleri çakışıyor (`France`, `Bulgaria`, `Canada`),
 * tek tabloda 1940 Fransası 1915 tümeniyle sahaya çıkardı.
 *
 * Burada adı geçmeyen ulus varsayılana düşer; pakette elle yazılmış
 * birliği olan uluslar zaten bu yoldan hiç geçmez.
 */
const TEMPLATE_FOR_WW1: Record<string, string> = {
  'German Empire': 'os_piyade_tumen',
  'Austro-Hungarian Empire': 'os_piyade_tumen',
  'Ottoman Empire': 'os_piyade_tumen',
  Bulgaria: 'os_piyade_tumen',
  France: 'fr_piyade_tumen',
  'United Kingdom of Great Britain and Ireland': 'uk_piyade_tumen',
  'United States of America': 'uk_piyade_tumen',
  Australia: 'anzac_tumen',
  'New Zealand': 'anzac_tumen',
  Canada: 'anzac_tumen',
  India: 'hint_tugay',
  Russia: 'ru_piyade_tumen',
};

const TEMPLATE_FOR_WW2: Record<string, string> = {
  Germany: 'de_ww2_piyade',
  Italy: 'it_ww2_piyade',
  'Empire of Japan': 'jp_piyade_tumen',
  Poland: 'pl_piyade_tumen',
  'United Kingdom': 'uk_ww2_piyade',
  France: 'uk_ww2_piyade',
  USSR: 'su_tufek_tumen',
  'United States': 'us_piyade_tumen',
  Canada: 'uk_ww2_piyade',
  Australia: 'uk_ww2_piyade',
  'New Zealand': 'uk_ww2_piyade',
  'Union of South Africa': 'uk_ww2_piyade',
  Belgium: 'uk_ww2_piyade',
  Netherlands: 'uk_ww2_piyade',
  Norway: 'uk_ww2_piyade',
  Greece: 'it_ww2_piyade',
  Yugoslavia: 'it_ww2_piyade',
  Hungary: 'it_ww2_piyade',
  Romania: 'it_ww2_piyade',
  Bulgaria: 'it_ww2_piyade',
  Finland: 'it_ww2_piyade',
};

/** Ad → kimlik parçası. */
function slug(s: string): string {
  return s
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (c) => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' })[c]!)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function buildWorldSetup(th: Theatre): WorldSetup {
  // Cephenin elle yazılmış tarihsel içeriği varsa, onun kapsadığı ULUSLAR
  // için prosedürel tümen üretimi atlanır.
  const pack = FRONT_PACKS[th.id];
  const scripted = new Set((pack?.formations ?? []).map((f) => f.nation));
  const byNation = groupByNation(th);
  // Paket birlikleri ulus sınırına bakmaz: koordinat hangi kara iline
  // düşüyorsa oraya konur (Stange Müfrezesi Arhavi'de, 3. Kafkas Avcı
  // Tugayı Tiflis'te).
  const landPool = provinces().filter((p) => !p.isSea);
  const nationList = nationsFor(th);
  const byId: Record<string, NationSpec> = Object.fromEntries(
    nationList.map((n) => [n.id, n]),
  );
  const owners: Record<ProvinceId, Side | null> = {};
  const victoryPoints: Record<ProvinceId, number> = {};
  const supplyHubs: Record<ProvinceId, number> = {};
  const capitals: Record<string, ProvinceId> = {};

  for (const p of provinces()) {
    owners[p.id] = p.isSea ? null : ownerOf(p.id, th).side;
    victoryPoints[p.id] = 0;
    supplyHubs[p.id] = 0;
  }

  // Bu cephede savaşmayan ulusların toprakları: savaşa hiç girmemişse
  // tarafsız; yenilmiş/işgal edilmişse kendisini yenen bloğa geçer.
  const t0 = Date.parse(th.start);
  const allSpecs = th.war === 'ww2' ? NATIONS_WW2 : NATIONS;
  const specById: Record<string, NationSpec> = Object.fromEntries(
    allSpecs.map((n) => [n.id, n]),
  );
  for (const [nationId, list] of byNation) {
    const active = byId[nationId];
    if (active) {
      const side = SIDE_OF[active.side];
      for (const p of list) owners[p.id] = side;
      continue;
    }
    const spec = specById[nationId];
    const conquered =
      spec?.leaves !== undefined && Date.parse(spec.leaves) < t0;
    if (conquered && spec) {
      // Yenen blok: kendi tarafının karşıtı.
      const victor: Side = spec.side === 'ittifak' ? 'entente' : 'ottoman';
      for (const p of list) owners[p.id] = victor;
    } else {
      for (const p of list) owners[p.id] = null;
    }
  }

  // Cepheye özgü sahiplik düzeltmeleri (bkz. Theatre.flip).
  for (const f of th.flip ?? []) {
    const list = byNation.get(f.nation);
    if (!list) continue;
    const side: Side = f.to === 'a' ? 'ottoman' : 'entente';
    for (const p of list) owners[p.id] = side;
  }

  // Başkentler: yüksek zafer puanı ve büyük ikmal merkezi.
  for (const spec of nationList) {
    const list = byNation.get(spec.id);
    if (!list || list.length === 0) continue;

    const cap = spec.capital ? nearestProvince(spec.capital[0], spec.capital[1], list) : null;
    // Cephe kutusu haritayı kırpıyor: Kafkas Cephesi'nde yalnız 76 il var.
    // Mesafe sınırı olmadan "Berlin'e en yakın il" Kafkasya'da bir Rus ili
    // seçiliyor, zafer koşulu da onu Alman başkenti sayıp oyunu üçüncü
    // günde bitiriyordu. Başkent ancak GERÇEKTEN haritadaysa sayılır.
    if (cap && spec.capital && nearEnough(cap, spec.capital)) {
      capitals[spec.id] = cap.id;
      victoryPoints[cap.id] = 25;
      supplyHubs[cap.id] = Math.round(spec.manpower / 6);
    }

    // Büyük iller ikincil ikmal merkezi olur.
    //
    // Bunlar ESKİDEN başkent kontrolünün içindeydi: başkent haritanın
    // dışında kalınca ulus TEK BİR ikmal merkezi bile alamıyordu. Kafkas
    // Cephesi'nde İstanbul da Petrograd da bbox'ın dışında olduğu için
    // haritada sıfır ikmal merkezi vardı ve 21 tarihsel tümenin 20'si
    // beşinci günde %0 ikmalle eriyordu. Cephede savaşan ordunun gerisinde
    // daima bir menzil deposu vardır; başkentin uzakta olması bunu
    // değiştirmez.
    const big = [...list]
      .sort((a, b) => (metaOf(b.id)?.cells ?? 0) - (metaOf(a.id)?.cells ?? 0))
      .slice(0, Math.max(2, Math.round(list.length / 14)));
    for (const p of big) {
      if (p.id === capitals[spec.id]) continue;
      victoryPoints[p.id] = Math.max(victoryPoints[p.id]!, 3);
      supplyHubs[p.id] = Math.max(supplyHubs[p.id]!, Math.round(spec.manpower / 30));
    }
  }

  // ── Birlikler ────────────────────────────────────────────────────
  const landUnits: Record<UnitId, LandUnit> = {};
  const fleets: Record<UnitId, Fleet> = {};

  for (const spec of nationList) {
    const list = byNation.get(spec.id);
    const side = SIDE_OF[spec.side];
    if (!list || list.length === 0 || !side) continue;

    const hostile = new Set<ProvinceId>();
    for (const p of provinces()) {
      if (p.isSea) continue;
      const o = owners[p.id];
      if (o && o !== side) hostile.add(p.id);
    }

    const table = th.war === 'ww2' ? TEMPLATE_FOR_WW2 : TEMPLATE_FOR_WW1;
    const templateId = table[spec.id] ?? (th.war === 'ww2' ? 'it_ww2_piyade' : 'os_piyade_tumen');
    const tpl = TEMPLATE_BY_ID[templateId]!;
    const agg = aggregate(tpl);
    // Çizim ulusu şablonun kendi alanından; elle tutulan ikinci bir
    // eşleme yeni şablon eklendiğinde sessizce eskiyordu.
    const nation = tpl.nation;
    const arrives = spec.joins ? Math.max(0, dayOf(spec.joins, th.start)) : 0;

    // Pakette geçen ulusun KARA birlikleri tarihsel listeden gelir; donanma
    // yine üretilir (paketler şimdilik kara teşkilâtı taşıyor).
    const procedural = scripted.has(spec.id) ? [] : placeDivisions(spec, list, hostile);
    procedural.forEach((home, i) => {
      const id = `${spec.id.slice(0, 10).replace(/\W/g, '')}_d${i}`;
      landUnits[id] = {
        id,
        name: `${spec.tr} ${i + 1}. Tümen`,
        nation,
        side,
        templateId,
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
    });

    // ── Donanma ──
    if (spec.capitalShips + spec.cruisers > 0) {
      const capProv = capitals[spec.id];
      const port = capProv
        ? (provinces().find((p) => p.id === capProv)?.neighbours.find((n) => {
            const q = provinces().find((x) => x.id === n);
            return q?.isSea;
          }) ?? null)
        : null;
      const base = port ?? provinces().find((p) => p.isSea)!.id;
      const ships: Fleet['ships'] = [];
      for (let i = 0; i < Math.min(spec.capitalShips, 18); i++) {
        ships.push({
          id: `${spec.id.slice(0, 6)}_cap${i}`,
          name: `${spec.tr} Zırhlı ${i + 1}`,
          nation,
          cls: i < 4 ? 'dretnot' : 'pre_dretnot',
          hull: 1,
          ammo: 1,
          mines: 0,
        });
      }
      for (let i = 0; i < Math.min(spec.cruisers, 10); i++) {
        ships.push({
          id: `${spec.id.slice(0, 6)}_cr${i}`,
          name: `${spec.tr} Kruvazör ${i + 1}`,
          nation,
          cls: 'hafif_kruvazor',
          hull: 1,
          ammo: 1,
          mines: 0,
        });
      }
      const fid = `${spec.id.slice(0, 10).replace(/\W/g, '')}_filo`;
      fleets[fid] = {
        id: fid,
        name: `${spec.tr} Donanması`,
        nation,
        side,
        location: base,
        ships,
        commanderId: null,
        order: null,
        moveProgress: 0,
        embarked: [],
        inCombat: false,
        transited: [],
      };
    }
  }

  // ── Pakette yazılı tarihsel birlikler ────────────────────────────
  // Ulus döngüsünün DIŞINDA: sefer kuvvetlerinin cephede toprağı yoktur.
  // Mezopotamya'da Britanya ve Hindistan'ın bbox içinde tek ili yok, bu
  // yüzden döngü onları atlıyor ve 6. Puna Tümeni hiç sahneye çıkmıyordu.
  for (const f of pack?.formations ?? []) {
    const fspec = byId[f.nation] ?? specById[f.nation];
    const fside = fspec ? SIDE_OF[fspec.side] : null;
    const ftpl = TEMPLATE_BY_ID[f.templateId];
    if (!fside || !ftpl) continue;
    const home = nearestProvince(f.at[0], f.at[1], landPool);
    if (!home) continue;
    const fagg = aggregate(ftpl);
    const fid = `pk_${slug(f.nation).slice(0, 8)}_${slug(f.name)}`;
    const fArrives = f.arrivesOn ? Math.max(0, dayOf(f.arrivesOn, th.start)) : 0;
    landUnits[fid] = {
      id: fid,
      name: f.name,
      nation: ftpl.nation,
      side: fside,
      templateId: f.templateId,
      location: home.id,
      strength: fagg.men,
      maxStrength: fagg.men,
      organisation: fagg.organisation,
      maxOrganisation: fagg.organisation,
      entrenchment: 1,
      experience: 10,
      supplied: 1,
      commanderId: null,
      order: null,
      moveProgress: 0,
      marchingTo: null,
      inCombat: false,
      embarkedIn: fArrives > 0 ? 'bekleme' : null,
      ...(fArrives > 0 ? { arrivesOn: fArrives } : {}),
    };
  }

  // Tarihsel mevzi, tanımı gereği o tarafın toprağıdır.
  //
  // Hata: paket birlikleri gerçek başlangıç mevzilerine konuyor, ama
  // toprak sahipliği Natural Earth sınırlarından geliyordu. Barbarossa
  // 22 Haziran 1941'de başlar ve Guderian'ın panzer grubu Alman işgali
  // altındaki Lublin'dedir — harita ise Lublin'i Müttefik sayıyordu.
  // Sonuç: birlik düşman toprağında kalıyor, ikmal yayılımı ona hiç
  // ulaşmıyor, organizasyonu her gün eriyor ve TEK BİR GÜN BİLE
  // savaşamadan felç oluyordu. Ölçüm: Kafkas'ta 21 paket biriminin 20'si,
  // Normandiya'da 17'nin 15'i beşinci günde %0 ikmaldeydi. On beş cephenin
  // elle yazılmış bütün teşkilâtı bu yüzden sahnede yoktu.
  const claimed = new Set<ProvinceId>();
  for (const u of Object.values(landUnits)) {
    if (u.embarkedIn) continue; // sonradan gelen takviye kendi toprağını açmaz
    if (!u.id.startsWith('pk_')) continue;
    if (claimed.has(u.location)) continue; // ilk gelen tutar
    claimed.add(u.location);
    owners[u.location] = u.side;
  }

  return { owners, capitals, victoryPoints, supplyHubs, landUnits, fleets };
}

const WORLD_SIDES: Readonly<Record<Side, SideState>> = {
  // ottoman = İttifak
  ottoman: {
    side: 'ottoman',
    manpower: 900000,
    manpowerPerDay: 5200,
    morale: 0.72,
    ammo: 900000,
    ammoPerDay: 11000,
    intel: 0.3,
  },
  // entente = İtilaf
  entente: {
    side: 'entente',
    manpower: 1400000,
    manpowerPerDay: 7400,
    morale: 0.74,
    ammo: 1200000,
    ammoPerDay: 15000,
    intel: 0.3,
  },
};

/** Cephe kimliği -> kurulmuş senaryo. Cephe değişince yeniden kurulur. */
let cachedWorld: { id: string; scenario: Scenario } | null = null;

/** Zafer koşulu sayılan ANA güçler (iki savaş birlikte). */
const MAJOR_POWERS: ReadonlySet<string> = new Set([
  'German Empire', 'Austro-Hungarian Empire', 'Ottoman Empire',
  'United Kingdom of Great Britain and Ireland', 'France', 'Russia',
  'Germany', 'Italy', 'Empire of Japan', 'United Kingdom', 'USSR',
  'United States', 'Poland',
]);

export function worldScenario(th: Theatre = DEFAULT_THEATRE): Scenario {
  if (cachedWorld?.id === th.id) return cachedWorld.scenario;
  const setup = buildWorldSetupCached(th);
  const nationList = nationsFor(th);

  // Yalnız bu cephede fiilen BULUNAN ana güçlerin başkentleri sayılır:
  // Kuzey Afrika oynarken Londra'yı almak savaşı bitirmemeli.
  const capsOf = (side: 'ittifak' | 'itilaf') =>
    nationList
      .filter((n) => n.side === side && MAJOR_POWERS.has(n.id) && setup.capitals[n.id])
      .map((n) => setup.capitals[n.id]!);

  const ww2 = th.war === 'ww2';
  const pack = FRONT_PACKS[th.id];
  const scenario: Scenario = {
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
    // CommanderSpec → Commander: `from` ISO tarihi cephe başlangıcına göre
    // gün indeksine çevrilir.
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
    // Olay metinleri 1. Dünya Savaşı için yazıldı ve cephe tarih aralığına
    // göre süzülür; 2. savaşta cephe açıklaması bilgiyi taşıyor.
    // Paket varsa cepheye özgü olaylar; yoksa genel dünya olayları.
    events: pack?.events
      ? pack.events.map((e) => ({ ...e, day: dayOf(e.date, th.start) }))
      : ww2
      ? []
      : WORLD_EVENTS.filter(
          (e) =>
            Date.parse(e.date) >= Date.parse(th.start) &&
            Date.parse(e.date) <= Date.parse(th.end),
        ).map((e) => ({
          id: e.id,
          day: dayOf(e.date, th.start),
          date: e.date,
          title: e.title,
          body: e.body,
          kind: e.kind,
          src: e.src,
        })),
    sides: WORLD_SIDES,
    victory: {
      capitals: { ottoman: capsOf('ittifak'), entente: capsOf('itilaf') },
      ententeStraitProvinces: [],
      ententeCapitalShipLimit: 9999,
      ottomanMustHold: [],
      lastDay: dayOf(th.end, th.start),
      lastDayWinner: 'entente',
      lastDayReason: ww2
        ? `${th.name} sona erdi; Mihver yenildi.`
        : "11 Kasım 1918 — Compiègne'de ateşkes imzalandı. İttifak Devletleri teslim oldu.",
    },
  };
  cachedWorld = { id: th.id, scenario };
  return scenario;
}

export function newWorldGame(
  playerSide: Side = 'ottoman',
  seed = 19140728,
  th: Theatre = DEFAULT_THEATRE,
): GameState {
  const setup = buildWorldSetupCached(th);
  const sc = worldScenario(th);
  setActiveScenario(sc);

  // İl değerleri Natural Earth verisinde yok; senaryo kurulumundan yazılır.
  for (const [id, vp] of Object.entries(setup.victoryPoints)) {
    setProvinceValues(id, { victoryPoints: vp, supplyHub: setup.supplyHubs[id] ?? 0 });
  }

  const provStates: GameState['provinces'] = {};
  for (const p of provinces()) {
    const owner = setup.owners[p.id] ?? null;
    provStates[p.id] = {
      owner,
      controller: owner,
      supply: owner ? 1 : 0,
      fortLevel: 0,
      seen: { ottoman: true, entente: true },
      lastSeen: { ottoman: 0, entente: 0 },
    };
  }

  const state: GameState = {
    day: 0,
    date: th.start,
    phase: 'emir',
    weather: 'acik',
    playerSide,
    provinces: provStates,
    landUnits: setup.landUnits,
    fleets: setup.fleets,
    airWings: {},
    forts: {},
    minefields: {},
    // Cephe paketindeki komutanlar duruma aktarılır; paket yoksa boş.
    commanders: Object.fromEntries(
      sc.commanders.map((c) => [c.id, structuredClone(c) as Commander]),
    ) as Record<string, Commander>,
    sides: structuredClone(WORLD_SIDES) as Record<Side, SideState>,
    reports: [],
    firedEvents: [],
    pendingEvents: [],
    ai: freshAiMemory(),
    rngState: seed,
    outcome: null,
  };
  return state;
}

let setupCache: { id: string; setup: WorldSetup } | null = null;
function buildWorldSetupCached(th: Theatre): WorldSetup {
  if (setupCache?.id !== th.id) setupCache = { id: th.id, setup: buildWorldSetup(th) };
  return setupCache.setup;
}
