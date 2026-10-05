import type { CommanderSpec } from '../commanders.ts';
import type { EventSpec } from '../events.ts';

/**
 * Cephe içerik paketi.
 *
 * Çanakkale dışındaki her cephe aynı dünya il haritasını açıyor ve bütün
 * içeriğini PROSEDÜREL üretiyordu: tümenler ulusun nüfusundan hesaplanıp
 * `"Rusya 7. Tümen"` diye adlandırılıyor, komutan listesi boş geliyor,
 * 2. Dünya Savaşı'nda hiç olay çıkmıyordu. Harita ve mekanik ortak olsa da
 * tarihsel içerik cepheye özgüdür.
 *
 * Paket prosedürel üretimi ULUS BAZINDA devre dışı bırakır: `formations`
 * listesinde geçen ulusların birlikleri elle yazılmış teşkilâttan gelir,
 * geçmeyenler eskisi gibi üretilir. Böylece bir cephe yarım da
 * doldurulabilir — Osmanlı ordusu gerçek, komşu tarafsız prosedürel.
 *
 * Birimin TARAFI ulus künyesinden (`world1914.ts` / `world1939.ts`), çizim
 * ulusu ise şablondan gelir; paket ikisini de tekrar etmez.
 */

/** Tarihsel bir birlik: adı, nereye konduğu, ne zaman geldiği. */
export interface FrontFormation {
  /** `NATIONS` / `NATIONS_WW2` içindeki ulus kimliği. */
  readonly nation: string;
  /** Haritada görünecek ad — `"9. Kolordu"`, `"1. Kafkas Kolordusu"`. */
  readonly name: string;
  /** `TEMPLATE_BY_ID` anahtarı. */
  readonly templateId: string;
  /** Konuş yeri [lon, lat]; en yakın kara ili seçilir. */
  readonly at: readonly [number, number];
  /** Cephe başlangıcından sonra sahneye çıkacaksa ISO tarih. */
  readonly arrivesOn?: string;
  readonly src: string;
}

export interface FrontPack {
  /** `Theatre.id` ile birebir aynı. */
  readonly theatre: string;
  readonly formations: readonly FrontFormation[];
  readonly commanders: readonly CommanderSpec[];
  readonly events: readonly EventSpec[];
}
