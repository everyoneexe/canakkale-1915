/**
 * Paylaşılan DOM yardımcıları.
 *
 * `main.ts` bunları kendi içinde tutuyordu; günlük ve gösterge ayrı
 * modüllere çıkınca üçü de aynı üç küçük yardımcıya muhtaç kaldı.
 */

/** Kimlikle eleman getirir; yoksa sessizce `null` dönmek yerine patlar. */
export const $ = <T extends HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`eleman yok: #${id}`);
  return el as T;
};

/** Türkçe binlik ayracıyla tam sayı. */
export const num = (n: number): string => Math.round(n).toLocaleString('tr-TR');

/**
 * HTML kaçışı. Veri tarihsel metin: içinde tırnak ve kesme işareti var,
 * `innerHTML` ile basıldığı için kaçışsız bırakılamaz.
 */
export const esc = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
