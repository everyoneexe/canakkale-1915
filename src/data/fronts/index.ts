import type { FrontPack } from './pack.ts';
import { KAFKAS_PACK } from './ww1-kafkas.ts';

/**
 * Cephe içerik paketleri — `Theatre.id` → paket.
 *
 * Kayıtlı olmayan cephe eskisi gibi tamamen prosedürel kurulur. Liste
 * doldukça cepheler tek tek gerçek teşkilâta geçer.
 */
export const FRONT_PACKS: Readonly<Record<string, FrontPack>> = {
  [KAFKAS_PACK.theatre]: KAFKAS_PACK,
};

export type { FrontPack, FrontFormation } from './pack.ts';
