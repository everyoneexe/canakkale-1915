import type { CombatReport, ProvinceId } from '../core/types.ts';
import { $, esc } from './dom.ts';

/**
 * Günlük paneli — turun raporlarını okunur bir listeye çevirir.
 *
 * İki sıkıştırma yapar, ikisi de gerekliydi:
 *
 *  1. AYNI gün, aynı il, aynı başlıklı raporlar tek kayıtta birleşir
 *     (`×3`). Boğaz düellosunda aynı gün üç ayrı rapor üretiliyor ve
 *     günlük üç özdeş kutuyla doluyordu.
 *  2. Kayıt başına yalnız dört satır gösterilir.
 *
 * İkincisi tek başına tehlikeli: birleşmiş bir düello kaydında dört adet
 * "1 tabya menzilde · donanma ateşi 130" satırı, aralarındaki tek
 * "mayına çarptı" satırını kesme sınırının altına itiyordu. Bu yüzden
 * ANAHTAR satırlar öne alınır.
 */

/**
 * Öne alınacak satırlar: olayın sonucunu ya da sebebini söyleyenler.
 *
 * `temizlenemedi` BİLEREK dışarıda — tarama raporunda öğretici olan şey
 * sonuç değil, nedensellik zinciri (kapasite → akıntı → tabya ateşi →
 * sonuç); onu öne çekmek zinciri tersine çeviriyor.
 *
 * Zırh satırları anahtar: "neden hiçbir şey olmadı" sorusunun cevabı
 * onlarda. Dördüncü satırın altında kalırlarsa oyuncu panzerin neden
 * durdurulamadığını hiç öğrenemiyor.
 */
const KEY =
  /mayına çarp|batt|hasarl|savaş dışı|çekil|ele geçir|şehit|delemiyor|zırhlı —/i;

/** Kayıt başına gösterilen azami satır. */
const MAX_LINES = 4;
/** Günlükte tutulan azami kayıt. */
const MAX_ENTRIES = 40;

interface LogEntry {
  readonly report: CombatReport;
  readonly lines: string[];
  count: number;
}

function merge(reports: readonly CombatReport[]): LogEntry[] {
  // Raporlar oyun durumunun parçası; burada KOPYA üzerinde çalışılır.
  // Satırları yerinde biriktirmek render'ı duruma yazan bir yan etki
  // yapardı ve kayıtlar her çizimde şişerdi.
  const merged: LogEntry[] = [];
  const seen = new Map<string, LogEntry>();
  for (const r of reports) {
    const key = `${r.day}|${r.province}|${r.title}`;
    const hit = seen.get(key);
    if (!hit) {
      const entry: LogEntry = { report: r, lines: [...r.lines], count: 1 };
      seen.set(key, entry);
      merged.push(entry);
      if (merged.length >= MAX_ENTRIES) break;
      continue;
    }
    hit.count++;
    // Tekrar eden kaydın ÖZGÜN satırlarını koru: biri "mayına çarptı"
    // diyorsa o satır kaybolmamalı.
    for (const l of r.lines) if (!hit.lines.includes(l)) hit.lines.push(l);
  }
  for (const e of merged) {
    e.lines.sort((a, b) => Number(KEY.test(b)) - Number(KEY.test(a)));
  }
  return merged;
}

/** Günlüğü çizer. `onPick` bir kayda tıklanınca o ile odaklanmak için. */
export function renderJournal(
  reports: readonly CombatReport[],
  onPick: (id: ProvinceId) => void,
): void {
  const list = $('gunluk-liste');
  if (reports.length === 0) {
    list.innerHTML = `<div class="kayit"><div class="kayit-satir">
      Henüz rapor yok. Emirleri ver ve turu bitir.</div></div>`;
    return;
  }

  list.innerHTML = merge(reports)
    .map(
      ({ report: r, lines, count }) =>
        `<div class="kayit ${r.kind}" data-il="${r.province}">
      <div class="kayit-bas"><span>${esc(r.title)}${count > 1 ? ` ×${count}` : ''}</span>
        <span class="kayit-gun">g${r.day}</span></div>
      ${lines
        .slice(0, MAX_LINES)
        .map((l) => `<div class="kayit-satir">${esc(l)}</div>`)
        .join('')}
      ${
        lines.length > MAX_LINES
          ? `<div class="kayit-satir soluk">+${lines.length - MAX_LINES} satır daha</div>`
          : ''
      }
    </div>`,
    )
    .join('');

  for (const el of list.querySelectorAll<HTMLElement>('.kayit')) {
    el.addEventListener('click', () => {
      const id = el.dataset.il;
      if (id) onPick(id);
    });
  }
}
