import type { FrontPack } from './pack.ts';
import { KAFKAS_PACK } from './ww1-kafkas.ts';
import { MEZOPOTAMYA_PACK } from './ww1-mezopotamya.ts';
import { SINA_FILISTIN_PACK } from './ww1-sina-filistin.ts';
import { BATI_PACK } from './ww1-bati.ts';
import { DOGU_PACK } from './ww1-dogu.ts';
import { ITALYAN_PACK } from './ww1-italyan.ts';
import { BALKAN_PACK } from './ww1-balkan.ts';
import { DOGU_AFRIKA_PACK } from './ww1-dogu-afrika.ts';
import { POLONYA_PACK } from './ww2-polonya.ts';
import { BATI1940_PACK } from './ww2-bati1940.ts';
import { KUZEY_AFRIKA_PACK } from './ww2-kuzey-afrika.ts';
import { WW2_DOGU_PACK } from './ww2-dogu.ts';
import { PASIFIK_PACK } from './ww2-pasifik.ts';
import { WW2_ITALYA_PACK } from './ww2-italya.ts';
import { NORMANDIYA_PACK } from './ww2-normandiya.ts';

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
  [BATI_PACK.theatre]: BATI_PACK,
  [DOGU_PACK.theatre]: DOGU_PACK,
  [ITALYAN_PACK.theatre]: ITALYAN_PACK,
  [BALKAN_PACK.theatre]: BALKAN_PACK,
  [DOGU_AFRIKA_PACK.theatre]: DOGU_AFRIKA_PACK,
  [POLONYA_PACK.theatre]: POLONYA_PACK,
  [BATI1940_PACK.theatre]: BATI1940_PACK,
  [KUZEY_AFRIKA_PACK.theatre]: KUZEY_AFRIKA_PACK,
  [WW2_DOGU_PACK.theatre]: WW2_DOGU_PACK,
  [PASIFIK_PACK.theatre]: PASIFIK_PACK,
  [WW2_ITALYA_PACK.theatre]: WW2_ITALYA_PACK,
  [NORMANDIYA_PACK.theatre]: NORMANDIYA_PACK,
};

export type { FrontPack, FrontFormation } from './pack.ts';
