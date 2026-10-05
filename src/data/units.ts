import type {
  BattalionKind,
  BattalionProfile,
  DivisionTemplate,
  Terrain,
  TerrainProfile,
  Weather,
  WeatherProfile,
} from '../core/types.ts';

/**
 * Tabur profilleri. 1915 ölçeğinde: piyade taburu ≈ 800 kişi, Osmanlı alayı
 * 3 tabur, tümeni 3 alay + topçu. Entente tümenleri daha kalabalık ve çok
 * daha fazla topçuya sahipti — 12 Temmuz 1915'te üç saatte 60.000 mermi
 * attılar; Liman von Sanders'in raporu: "Düşman çok cephane, az insan
 * harcıyor. Biz pek çok insan, az cephane feda ediyoruz."
 *   https://canakkalesavaslari.comu.edu.tr/canakkale-savaslari-kronolojisi.html
 */
export const BATTALIONS: Readonly<Record<BattalionKind, BattalionProfile>> = {
  piyade: {
    id: 'piyade',
    name: 'Piyade Taburu',
    men: 800,
    width: 2,
    softAttack: 6,
    breakthrough: 2,
    defence: 14,
    hardAttack: 0.5,
    armour: 0,
    piercing: 0.5,
    hardness: 0,
    organisation: 60,
    hp: 25,
    supplyUse: 0.6,
    guns: 0,
  },
  avci: {
    id: 'avci',
    name: 'Avcı Taburu',
    men: 700,
    width: 2,
    softAttack: 9,
    breakthrough: 4,
    defence: 12,
    hardAttack: 0.5,
    armour: 0,
    piercing: 0.5,
    hardness: 0,
    organisation: 70,
    hp: 22,
    supplyUse: 0.7,
    guns: 0,
  },
  deniz_piyade: {
    id: 'deniz_piyade',
    name: 'Deniz Piyade Taburu',
    men: 750,
    width: 2,
    softAttack: 7,
    breakthrough: 3,
    defence: 11,
    hardAttack: 0.5,
    armour: 0,
    piercing: 0.5,
    hardness: 0,
    organisation: 55,
    hp: 22,
    supplyUse: 0.7,
    guns: 0,
  },
  suvari: {
    id: 'suvari',
    name: 'Süvari Bölüğü',
    men: 400,
    width: 1,
    softAttack: 4,
    breakthrough: 3,
    defence: 6,
    hardAttack: 0,
    armour: 0,
    piercing: 0,
    hardness: 0,
    organisation: 80,
    hp: 12,
    supplyUse: 0.5,
    guns: 0,
  },
  makineli: {
    id: 'makineli',
    name: 'Makineli Tüfek Bölüğü',
    men: 150,
    width: 1,
    softAttack: 12,
    breakthrough: 1,
    defence: 26,
    hardAttack: 0,
    armour: 0,
    piercing: 0,
    hardness: 0,
    organisation: 30,
    hp: 6,
    supplyUse: 0.4,
    guns: 0,
  },
  istihkam: {
    id: 'istihkam',
    name: 'İstihkâm Bölüğü',
    men: 250,
    width: 0,
    softAttack: 2,
    breakthrough: 6,
    defence: 8,
    hardAttack: 1,
    armour: 0,
    piercing: 1,
    hardness: 0,
    organisation: 40,
    hp: 8,
    supplyUse: 0.3,
    guns: 0,
  },
  sahra_topcu: {
    id: 'sahra_topcu',
    name: 'Sahra Topçu Bataryası',
    men: 220,
    width: 1,
    softAttack: 22,
    breakthrough: 8,
    defence: 5,
    hardAttack: 4,
    armour: 0,
    piercing: 6,
    hardness: 0,
    organisation: 20,
    hp: 7,
    supplyUse: 1.4,
    guns: 4,
  },
  obus: {
    id: 'obus',
    name: 'Ağır Obüs Bataryası',
    men: 260,
    width: 1,
    softAttack: 34,
    breakthrough: 18,
    defence: 4,
    hardAttack: 8,
    armour: 0,
    piercing: 10,
    hardness: 0,
    organisation: 15,
    hp: 7,
    supplyUse: 2.6,
    guns: 4,
  },

  // ── Zırhlı ve motorlu ──────────────────────────────────────────────
  // Zırh/delme ölçeği: zırhlı otomobil 3 (tüfek mermisi geçmez, top geçer),
  // 1940 hafif tank 10, 1941-43 orta tank 25, 1944 ağır tank 45. Dönemin
  // sahra topçusu (piercing 6) hafif tankı zor deler, ağır tanka hiç
  // işlemez; tanksavar (40) orta tankı deler, ağır tankta yetersiz kalır.
  zirhli_oto: {
    // Çanakkale'de de vardı: Royal Naval Armoured Car Division, 1915.
    id: 'zirhli_oto',
    name: 'Zırhlı Otomobil Bölüğü',
    men: 120,
    width: 1,
    softAttack: 10,
    breakthrough: 14,
    defence: 6,
    hardAttack: 3,
    armour: 3,
    piercing: 4,
    hardness: 0.6,
    organisation: 50,
    hp: 8,
    supplyUse: 1.0,
    guns: 0,
  },
  motorlu: {
    // Zırhı yok; kamyonla taşınır, sert hedef sayılmaz ama hızlıdır.
    id: 'motorlu',
    name: 'Motorlu Piyade Taburu',
    men: 700,
    width: 2,
    softAttack: 9,
    breakthrough: 6,
    defence: 13,
    hardAttack: 2,
    armour: 0,
    piercing: 3,
    hardness: 0.15,
    organisation: 65,
    hp: 24,
    supplyUse: 1.6,
    guns: 0,
  },
  tank_hafif: {
    id: 'tank_hafif',
    name: 'Hafif Tank Taburu',
    men: 500,
    width: 2,
    softAttack: 14,
    breakthrough: 30,
    defence: 9,
    hardAttack: 8,
    armour: 10,
    piercing: 12,
    hardness: 0.85,
    organisation: 40,
    hp: 18,
    supplyUse: 2.2,
    guns: 0,
  },
  tank_orta: {
    id: 'tank_orta',
    name: 'Orta Tank Taburu',
    men: 600,
    width: 2,
    softAttack: 20,
    breakthrough: 48,
    defence: 13,
    hardAttack: 22,
    armour: 25,
    piercing: 30,
    hardness: 0.9,
    organisation: 38,
    hp: 22,
    supplyUse: 3.2,
    guns: 0,
  },
  tank_agir: {
    id: 'tank_agir',
    name: 'Ağır Tank Taburu',
    men: 650,
    width: 3,
    softAttack: 24,
    breakthrough: 70,
    defence: 18,
    hardAttack: 38,
    armour: 45,
    piercing: 48,
    hardness: 0.95,
    organisation: 32,
    hp: 28,
    supplyUse: 4.8,
    guns: 0,
  },
  tanksavar: {
    // Zırhı yok, görevi tek: gelen tankı durdurmak.
    id: 'tanksavar',
    name: 'Tanksavar Bataryası',
    men: 180,
    width: 1,
    softAttack: 4,
    breakthrough: 3,
    defence: 12,
    hardAttack: 30,
    armour: 0,
    piercing: 40,
    hardness: 0,
    organisation: 25,
    hp: 7,
    supplyUse: 1.1,
    guns: 2,
  },
};

/**
 * Tabur sayılarından tümen istatistiği topla.
 *
 * Saldırı/savunma/delme TOPLANIR — iki kat tabur iki kat ateş demektir.
 * Zırh, delme ve sertlik ise ORTALAMAdır: bir tümene tek tank taburu
 * eklemek onu zırhlı yapmaz. Ortalama cephe genişliğine göre ağırlıklı,
 * çünkü hatta fiilen duran şey genişliktir; genişliği sıfır olan istihkâm
 * bölüğü zırh ortalamasını sulandırmaz.
 */
export function aggregate(t: DivisionTemplate) {
  let men = 0;
  let width = 0;
  let soft = 0;
  let brk = 0;
  let def = 0;
  let hard = 0;
  let org = 0;
  let hp = 0;
  let supply = 0;
  let guns = 0;
  let count = 0;
  // Genişliğe göre ağırlıklı ortalama için pay ve paydalar.
  let armourW = 0;
  let pierceW = 0;
  let pierceBest = 0;
  let bestWidth = 0;
  let hardnessW = 0;
  let weight = 0;
  for (const [kind, n] of Object.entries(t.battalions) as [BattalionKind, number][]) {
    const b = BATTALIONS[kind];
    men += b.men * n;
    width += b.width * n;
    soft += b.softAttack * n;
    brk += b.breakthrough * n;
    def += b.defence * n;
    hard += b.hardAttack * n;
    org += b.organisation * n;
    hp += b.hp * n;
    supply += b.supplyUse * n;
    guns += b.guns * n;
    count += n;
    const w = b.width * n;
    armourW += b.armour * w;
    pierceW += b.piercing * w;
    if (b.piercing > pierceBest) {
      pierceBest = b.piercing;
      bestWidth = w;
    } else if (b.piercing === pierceBest) {
      bestWidth += w;
    }
    hardnessW += b.hardness * w;
    weight += w;
  }
  const pierceMean = weight > 0 ? pierceW / weight : 0;
  // Cephe genişliğinin %15'i en iyi silahsa tam değerine ulaşılır.
  const bestShare = weight > 0 ? Math.min(1, bestWidth / weight / 0.15) : 0;
  return {
    men,
    width,
    softAttack: soft,
    breakthrough: brk,
    defence: def,
    hardAttack: hard,
    armour: weight > 0 ? armourW / weight : 0,
    // Delme düz ortalama DEĞİL. Düz ortalamada tüfekler tanksavarı yutar
    // ve hiçbir piyade tümeni tank deleemez; saf "en iyi silah"ta ise tek
    // bir tanksavar taburu koca tank kolordusunu durdurur. İkisi de yanlış.
    //
    // En iyi silaha YAKLAŞMAK cephede ona ayrılan paya bağlı: genişliğin
    // %15'i tanksavarsa o silahın tam değeri, hiç yoksa düz ortalama.
    // Sovyet tüfek tümeninin 1941 ile 1943 arasındaki farkı tam olarak bu.
    piercing: weight > 0 ? pierceMean + (pierceBest - pierceMean) * bestShare : 0,
    hardness: weight > 0 ? hardnessW / weight : 0,
    // Organizasyon tabur ORTALAMASIdır — büyük tümen daha çok org'a sahip olmaz.
    organisation: count > 0 ? org / count : 0,
    hp,
    supplyUse: supply,
    guns,
  };
}

export const TEMPLATES: readonly DivisionTemplate[] = [
  // ── Osmanlı ──────────────────────────────────────────────────────────
  {
    id: 'os_piyade_tumen',
    name: 'Osmanlı Piyade Tümeni',
    nation: 'osmanli',
    battalions: { piyade: 9, makineli: 2, sahra_topcu: 3, istihkam: 1 },
  },
  {
    id: 'os_piyade_alay',
    name: 'Osmanlı Piyade Alayı',
    nation: 'osmanli',
    battalions: { piyade: 3, makineli: 1 },
  },
  {
    id: 'os_suvari_tugay',
    name: 'Osmanlı Süvari Tugayı',
    nation: 'osmanli',
    battalions: { suvari: 6, makineli: 1 },
  },
  {
    id: 'os_agir_topcu',
    name: 'Ağır Obüs Alayı',
    nation: 'osmanli',
    battalions: { obus: 4, piyade: 1 },
  },
  // ── Alman ────────────────────────────────────────────────────────────
  {
    id: 'de_bahriye',
    name: 'Alman Bahriye Müfrezesi',
    nation: 'alman',
    battalions: { deniz_piyade: 1, makineli: 2, istihkam: 1 },
  },
  // ── İngiliz / ANZAC ──────────────────────────────────────────────────
  {
    id: 'uk_piyade_tumen',
    name: 'İngiliz Piyade Tümeni',
    nation: 'ingiliz',
    battalions: { piyade: 12, makineli: 3, sahra_topcu: 6, obus: 1, istihkam: 2 },
  },
  {
    id: 'uk_deniz_tumen',
    name: 'Kraliyet Deniz Tümeni',
    nation: 'ingiliz',
    battalions: { deniz_piyade: 9, makineli: 2, sahra_topcu: 2, istihkam: 1 },
  },
  {
    id: 'anzac_tumen',
    name: 'ANZAC Tümeni',
    nation: 'anzac',
    battalions: { avci: 9, piyade: 3, makineli: 3, sahra_topcu: 4, istihkam: 2 },
  },
  {
    id: 'hint_tugay',
    name: 'Hint Tugayı',
    nation: 'hint',
    battalions: { piyade: 4, makineli: 1, sahra_topcu: 1 },
  },
  // ── 2. Dünya Savaşı ──────────────────────────────────────────────────
  // Zırhlı tümenler gerçek tank taburu taşır. Tank nesli yıla göre
  // değişir: 1939-40 hafif (Pz I/II, 7TP), 1941-43 orta (T-34, Pz IV,
  // Sherman), 1944- ağır (Tiger, IS-2, Pershing).
  {
    id: 'de_panzer',
    name: 'Alman Panzer Tümeni',
    nation: 'alman',
    // 1939-40: Panzer I/II ağırlıklı, az sayıda III/IV.
    battalions: { tank_hafif: 4, tank_orta: 2, motorlu: 4, sahra_topcu: 3, tanksavar: 1, istihkam: 1 },
  },
  {
    id: 'de_panzer_43',
    name: 'Alman Panzer Tümeni (1943)',
    nation: 'alman',
    // Panzer IV uzun namlu + Panther; tanksavar olarak 88'ler.
    battalions: { tank_orta: 5, motorlu: 4, sahra_topcu: 3, tanksavar: 2, istihkam: 1 },
  },
  {
    id: 'de_agir_panzer',
    name: 'Ağır Panzer Taburu',
    nation: 'alman',
    // Tiger taburu: küçük, pahalı, delinmesi çok zor.
    battalions: { tank_agir: 3, motorlu: 1, istihkam: 1 },
  },
  {
    id: 'de_ww2_piyade',
    name: 'Alman Piyade Tümeni (1939)',
    nation: 'alman',
    battalions: { piyade: 9, makineli: 4, sahra_topcu: 4, obus: 2, tanksavar: 1, istihkam: 1 },
  },
  {
    id: 'su_tufek_tumen',
    name: 'Sovyet Tüfek Tümeni',
    nation: 'sovyet',
    // 1941'de tanksavarı yok denecek kadar azdı — panzer karşısındaki
    // çaresizliğin sayısal sebebi bu.
    battalions: { piyade: 9, makineli: 3, sahra_topcu: 4, istihkam: 1 },
  },
  {
    id: 'su_tufek_tumen_43',
    name: 'Sovyet Tüfek Tümeni (1943)',
    nation: 'sovyet',
    // Kursk'tan itibaren tanksavar yoğun: 45mm ve 76mm bataryaları.
    battalions: { piyade: 9, makineli: 4, sahra_topcu: 4, tanksavar: 3, istihkam: 2 },
  },
  {
    id: 'su_tank_kolordu',
    name: 'Sovyet Tank Kolordusu',
    nation: 'sovyet',
    // T-34: 1941'de hiçbir Alman tankının kolay delemediği zırh.
    battalions: { tank_orta: 6, motorlu: 3, sahra_topcu: 2, istihkam: 1 },
  },
  {
    id: 'su_agir_tank',
    name: 'Sovyet Ağır Tank Alayı',
    nation: 'sovyet',
    battalions: { tank_agir: 3, motorlu: 1, istihkam: 1 },
  },
  {
    id: 'pl_piyade_tumen',
    name: 'Polonya Piyade Tümeni',
    nation: 'polonyali',
    battalions: { piyade: 9, makineli: 2, sahra_topcu: 3 },
  },
  {
    id: 'pl_suvari_tugay',
    name: 'Polonya Süvari Tugayı',
    nation: 'polonyali',
    // Süvari tankla savaşmadı; tanksavar topu taşıyordu — efsanenin aksine.
    battalions: { suvari: 6, makineli: 2, tanksavar: 1, sahra_topcu: 1 },
  },
  {
    id: 'us_piyade_tumen',
    name: 'Amerikan Piyade Tümeni',
    nation: 'amerikan',
    battalions: { piyade: 9, makineli: 4, sahra_topcu: 4, obus: 2, tanksavar: 2, istihkam: 2 },
  },
  {
    id: 'us_zirhli_tumen',
    name: 'Amerikan Zırhlı Tümeni',
    nation: 'amerikan',
    // Sherman: delmesi iyi, zırhı Panther'in altında.
    battalions: { tank_orta: 5, motorlu: 5, sahra_topcu: 3, tanksavar: 1, istihkam: 1 },
  },
  {
    id: 'us_deniz_piyade',
    name: 'Amerikan Deniz Piyade Tümeni',
    nation: 'amerikan',
    battalions: { deniz_piyade: 9, makineli: 4, sahra_topcu: 3, istihkam: 2 },
  },
  {
    id: 'jp_piyade_tumen',
    name: 'Japon Piyade Tümeni',
    nation: 'japon',
    battalions: { piyade: 9, avci: 3, makineli: 2, sahra_topcu: 3 },
  },
  {
    id: 'uk_ww2_piyade',
    name: 'İngiliz Piyade Tümeni (1939)',
    nation: 'ingiliz',
    battalions: { piyade: 9, makineli: 4, sahra_topcu: 4, obus: 1, tanksavar: 1, istihkam: 2 },
  },
  {
    id: 'uk_zirhli_tumen',
    name: 'İngiliz Zırhlı Tümeni',
    nation: 'ingiliz',
    // 1940-41 çölünde hafif kruvazör tanklar ağırlıktaydı.
    battalions: { tank_hafif: 4, tank_orta: 2, motorlu: 3, sahra_topcu: 2, tanksavar: 1, istihkam: 1 },
  },
  {
    id: 'it_ww2_piyade',
    name: 'İtalyan Piyade Tümeni (1940)',
    nation: 'italyan',
    battalions: { piyade: 6, makineli: 2, sahra_topcu: 3 },
  },
  {
    id: 'it_zirhli_tumen',
    name: 'İtalyan Zırhlı Tümeni',
    nation: 'italyan',
    // M13/40: çölde "teneke kutu" lakaplı, zırhı ince.
    battalions: { tank_hafif: 4, motorlu: 3, sahra_topcu: 2, istihkam: 1 },
  },
  // ── Rus ──────────────────────────────────────────────────────────────
  {
    id: 'ru_piyade_tumen',
    name: 'Rus Piyade Tümeni',
    nation: 'rus',
    battalions: { piyade: 16, makineli: 3, sahra_topcu: 6, istihkam: 1 },
  },
  {
    // Plastun: Kuban Kazaklarının yaya tugayı — dağ harbinde seçkin.
    id: 'ru_plastun_tugay',
    name: 'Plastun Tugayı',
    nation: 'rus',
    battalions: { avci: 6, makineli: 2, sahra_topcu: 1 },
  },
  {
    id: 'ru_kazak_tugay',
    name: 'Kazak Süvari Tugayı',
    nation: 'rus',
    battalions: { suvari: 6, makineli: 1 },
  },
  // ── Avusturya-Macaristan ─────────────────────────────────────────────
  {
    id: 'at_piyade_tumen',
    name: 'Avusturya-Macar Piyade Tümeni',
    nation: 'avusturya',
    battalions: { piyade: 12, makineli: 2, sahra_topcu: 5, istihkam: 1 },
  },
  {
    id: 'at_dag_tugay',
    name: 'Avusturya-Macar Dağ Tugayı',
    nation: 'avusturya',
    battalions: { avci: 5, makineli: 2, sahra_topcu: 1 },
  },
  // ── Alman (kara) ─────────────────────────────────────────────────────
  {
    id: 'de_piyade_tumen',
    name: 'Alman Piyade Tümeni',
    nation: 'alman',
    battalions: { piyade: 12, makineli: 3, sahra_topcu: 6, obus: 2, istihkam: 2 },
  },
  {
    id: 'de_alpen_korps',
    name: 'Alman Dağ Kolordusu',
    nation: 'alman',
    battalions: { avci: 8, makineli: 3, sahra_topcu: 3, istihkam: 1 },
  },
  // ── İtalyan ──────────────────────────────────────────────────────────
  {
    id: 'it_piyade_tumen',
    name: 'İtalyan Piyade Tümeni',
    nation: 'italyan',
    battalions: { piyade: 12, makineli: 2, sahra_topcu: 4, istihkam: 1 },
  },
  {
    id: 'it_alpini_tugay',
    name: 'Alpini Tugayı',
    nation: 'italyan',
    battalions: { avci: 6, makineli: 2, sahra_topcu: 1 },
  },
  // ── Sırp / Bulgar / Belçika ──────────────────────────────────────────
  {
    id: 'rs_piyade_tumen',
    name: 'Sırp Piyade Tümeni',
    nation: 'sirp',
    battalions: { piyade: 12, makineli: 2, sahra_topcu: 3 },
  },
  {
    id: 'bg_piyade_tumen',
    name: 'Bulgar Piyade Tümeni',
    nation: 'bulgar',
    battalions: { piyade: 16, makineli: 2, sahra_topcu: 4, istihkam: 1 },
  },
  {
    id: 'be_piyade_tumen',
    name: 'Belçika Piyade Tümeni',
    nation: 'belcika',
    battalions: { piyade: 9, makineli: 2, sahra_topcu: 3 },
  },
  // ── Fransız ──────────────────────────────────────────────────────────
  {
    id: 'fr_piyade_tumen',
    name: 'Fransız Piyade Tümeni',
    nation: 'fransiz',
    battalions: { piyade: 9, deniz_piyade: 2, makineli: 3, sahra_topcu: 6, istihkam: 2 },
  },
];

export const TEMPLATE_BY_ID: Readonly<Record<string, DivisionTemplate>> =
  Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));

/**
 * Arazi profilleri. `combatWidth` bu ilde aynı anda muharebeye girebilecek
 * azami cephe genişliğidir — Arıburnu'nun dar dereleri bir tümenden fazlasını
 * almaz, Truva Ovası tümen tümen yığmaya izin verir.
 */
export const TERRAINS: Readonly<Record<Terrain, TerrainProfile>> = {
  ova: { id: 'ova', name: 'Ova', attackMod: 0, moveCost: 1, combatWidth: 44, digInMod: 1, isSea: false },
  tepe: { id: 'tepe', name: 'Tepelik', attackMod: -0.25, moveCost: 1.4, combatWidth: 30, digInMod: 1.2, isSea: false },
  dag: { id: 'dag', name: 'Sırt / Dağ', attackMod: -0.45, moveCost: 2.2, combatWidth: 18, digInMod: 1.4, isSea: false },
  kayalik: { id: 'kayalik', name: 'Kayalık Dere', attackMod: -0.5, moveCost: 2.6, combatWidth: 14, digInMod: 1.6, isSea: false },
  bataklik: { id: 'bataklik', name: 'Bataklık / Tuzla', attackMod: -0.35, moveCost: 2.0, combatWidth: 22, digInMod: 0.5, isSea: false },
  sahil: { id: 'sahil', name: 'Sahil', attackMod: -0.2, moveCost: 1.1, combatWidth: 20, digInMod: 0.8, isSea: false },
  sehir: { id: 'sehir', name: 'Yerleşim', attackMod: -0.3, moveCost: 1.2, combatWidth: 26, digInMod: 1.5, isSea: false },
  bogaz: { id: 'bogaz', name: 'Dar Boğaz', attackMod: -0.4, moveCost: 1.6, combatWidth: 12, digInMod: 0, isSea: true },
  korfez: { id: 'korfez', name: 'Körfez', attackMod: -0.1, moveCost: 1.1, combatWidth: 28, digInMod: 0, isSea: true },
  acik_deniz: { id: 'acik_deniz', name: 'Açık Deniz', attackMod: 0, moveCost: 1, combatWidth: 60, digInMod: 0, isSea: true },
};

/**
 * Hava. 9 Mart 1915: "Sabah hava sisli, deniz durgun" — sis bombardımanı
 * durdurdu. 25 Kasım 1915: "Gece yağan yoğun yağmur önemli kayıplara yol açtı".
 */
export const WEATHERS: Readonly<Record<Weather, WeatherProfile>> = {
  acik: { id: 'acik', name: 'Açık', gunnery: 1.0, flying: 1.0, movement: 1.0, sweeping: 1.0 },
  puslu: { id: 'puslu', name: 'Puslu', gunnery: 0.6, flying: 0.3, movement: 0.95, sweeping: 0.8 },
  yagmur: { id: 'yagmur', name: 'Yağmurlu', gunnery: 0.75, flying: 0.2, movement: 0.8, sweeping: 0.7 },
  firtina: { id: 'firtina', name: 'Fırtına', gunnery: 0.35, flying: 0.0, movement: 0.6, sweeping: 0.2 },
};

/** Azami siperlenme seviyesi. */
export const MAX_ENTRENCHMENT = 8;

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
