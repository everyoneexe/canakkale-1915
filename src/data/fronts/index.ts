import type { FrontPack } from './pack.ts';
import { KAFKAS_PACK } from './ww1-kafkas.ts';
import { MEZOPOTAMYA_PACK } from './ww1-mezopotamya.ts';
import { SINA_FILISTIN_PACK } from './ww1-sina-filistin.ts';

/**
 * Cephe içerik paketleri — `Theatre.id` → paket.
 *
 * Kayıtlı olmayan cephe eskisi gibi tamamen prosedürel kurulur. Liste
 * doldukça cepheler tek tek gerçek teşkilâta geçer.
 */
export const FRONT_PACKS: Readonly<Record<string, FrontPack>> = {
  [KAFKAS_PACK.theatre]: KAFKAS_PACK,
  [MEZOPOTAMYA_PACK.theatre]: MEZOPOTAMYA_PACK,
  [SINA_FILISTIN_PACK.theatre]: SINA_FILISTIN_PACK,
};

export type { FrontPack, FrontFormation } from './pack.ts';
