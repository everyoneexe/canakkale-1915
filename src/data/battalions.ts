import type { BattalionKind, BattalionProfile, DivisionTemplate } from '../core/types.ts';

/**
 * Tabur profilleri ve tümen toplaması — şablonların yapı taşı.
 *
 * `units.ts` dört ayrı konuyu (tabur, şablon, arazi, sembol) tek dosyada
 * taşıyordu; zırh eklenince 709 satıra çıktı ve tabur tablosunu görmek
 * için şablon listesini aşmak gerekiyordu.
 */

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
