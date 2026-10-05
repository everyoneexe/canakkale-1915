import type { DivisionTemplate } from '../core/types.ts';

/** Tümen şablonları — hangi tümen hangi taburlardan kurulu. */

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
    id: 'cn_piyade_tumen',
    name: 'Çin Piyade Tümeni',
    nation: 'cinli',
    // Kalabalık ama topçusuz: Çin tümeninin sorunu insan değil, ateş
    // gücü ve tanksavar yokluğuydu.
    battalions: { piyade: 12, makineli: 2, sahra_topcu: 1 },
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
