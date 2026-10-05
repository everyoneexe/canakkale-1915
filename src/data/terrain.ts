import type { Terrain, TerrainProfile, Weather, WeatherProfile } from '../core/types.ts';

/** Arazi, hava ve siperlenme tavanı. */

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
