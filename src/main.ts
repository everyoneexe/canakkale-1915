import './style/app.css';
import type {
  CombatReport,
  GameState,
  HistoricalEvent,
  LandOrderKind,
  NavalOrderKind,
  ProvinceId,
  Side,
} from './core/types.ts';
import { loadMap, prov, provinces } from './core/geo.ts';
import type { MapKind } from './core/geo.ts';
import { WEATHERS } from './data/units.ts';
import { C } from './style/tokens.ts';
import { briefingFor } from './data/briefing.ts';
import { formatDate, newGame, setActiveScenario } from './engine/scenario.ts';
import { newWorldGame } from './engine/world-scenario.ts';
import { SIDE_LABEL_WORLD } from './data/world1914.ts';
import { THEATRES, THEATRE_BY_ID } from './data/theatres.ts';
import type { Theatre, WarId } from './data/theatres.ts';
import { Globe } from './ui/globe.ts';
import { endTurn, applyEffect } from './engine/turn.ts';
import { issueLandOrder, issueNavalOrder } from './engine/orders.ts';
import { liveShips, minefieldsIn } from './engine/naval.ts';
import { MAP_MODES, MapView } from './render/map.ts';
import type { MapMode, Selection } from './render/map.ts';
import { Panel } from './ui/panel.ts';

const $ = <T extends HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`eksik eleman: #${id}`);
  return el as T;
};

const num = (n: number): string => Math.round(n).toLocaleString('tr-TR');
const esc = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Bekleyen emir hedefi — kullanıcı haritadan il seçecek. */
interface PendingOrder {
  kind: 'kara' | 'deniz';
  unitId: string;
  order: LandOrderKind | NavalOrderKind;
}

class Game {
  // Alan başlatıcısı kurucuda çalışır; harita henüz yüklenmemiş olur.
  // start() içinde, loadMap()'ten SONRA atanır.
  private state!: GameState;
  view: MapView;
  private panel: Panel;
  private selection: Selection | null = null;
  private pending: PendingOrder | null = null;
  private eventQueue: HistoricalEvent[] = [];
  private kind: MapKind = 'canakkale';
  /** Bir önceki turun üst bar değerleri — değişenleri vurgulamak için. */
  private oncekiOlcu: Record<string, string> = {};
  private globe: Globe | null = null;
  private war: WarId = 'ww1';
  private theatre: Theatre = THEATRE_BY_ID['ww1_canakkale']!;

  constructor() {
    this.view = new MapView({
      onSelect: (s) => this.select(s),
      onHover: (s, p) => this.hover(s, p),
      onTarget: (id) => this.applyTarget(id),
    });
    this.panel = new Panel($('panel'), {
      issueLand: (unitId, kind, needsTarget) =>
        this.beginOrder({ kind: 'kara', unitId, order: kind }, needsTarget),
      issueNaval: (fleetId, kind, needsTarget) =>
        this.beginOrder({ kind: 'deniz', unitId: fleetId, order: kind }, needsTarget),
      select: (s) => this.select(s),
      focus: (id) => this.view.centreOn(id),
    });
  }

  async start(): Promise<void> {
    // SIRA ÖNEMLİ. geo.ts tekil harita tutmuyor; motor da çizici de harita
    // yüklenmeden hiçbir şey okuyamaz.
    await this.view.init($<HTMLCanvasElement>('harita'));

    this.globe = new Globe($<HTMLCanvasElement>('kure'), {
      onHover: () => {},
      onPick: (th) => this.selectTheatre(th),
    });
    this.globe.setWar('ww1');
    this.globe.start();
    // Arazi ve siyasi maske dokuları inene kadar küre boş çizilir; yükleme
    // bitince kendiliğinden görünür.
    void this.globe.load().catch((e: unknown) => {
      console.error('küre dokuları yüklenemedi', e);
    });

    for (const id of ['ustbar', 'panel', 'modlar', 'gunluk']) {
      $(id).addEventListener('pointerenter', () => {
        $('ipucu').hidden = true;
      });
    }
    this.buildModeButtons();
    this.bindChrome();
    this.buildTheatreList();
    this.selectTheatre(THEATRE_BY_ID['ww1_canakkale']!);

    $('acilis-durum').textContent =
      'Harita: AWS Terrain Tiles (SRTM) · Sınırlar: historical-basemaps (CC-BY-SA) · '
      + 'Yer adları: OpenStreetMap (ODbL)';
    for (const b of document.querySelectorAll<HTMLButtonElement>('.taraf')) {
      b.disabled = false;
    }
  }

  /** Sol sütundaki cephe listesini seçili savaşa göre kur. */
  private buildTheatreList(): void {
    const box = $('cephe-liste');
    box.innerHTML = '';
    for (const th of THEATRES.filter((x) => x.war === this.war)) {
      const b = document.createElement('button');
      b.className = 'cephe';
      b.dataset.cephe = th.id;
      b.setAttribute('aria-pressed', String(th.id === this.theatre.id));
      b.innerHTML =
        `<span class="cp-ad">${esc(th.name)}</span>` +
        `<span class="cp-alt">${esc(th.tagline)}</span>`;
      b.addEventListener('click', () => this.selectTheatre(th));
      box.appendChild(b);
    }
  }

  /** Bir cepheyi seç: küreyi döndür, sağ paneli doldur. */
  private selectTheatre(th: Theatre): void {
    this.theatre = th;
    if (this.globe) {
      this.globe.selected = th;
      this.globe.focus(th.pin[0], th.pin[1]);
    }
    for (const b of document.querySelectorAll<HTMLElement>('.cephe')) {
      b.setAttribute('aria-pressed', String(b.dataset.cephe === th.id));
    }
    $('acilis-detay').hidden = false;
    $('ad-tarih').textContent =
      `${formatDate(th.start).toLocaleUpperCase('tr-TR')} — ` +
      `${formatDate(th.end).toLocaleUpperCase('tr-TR')}`;
    $('ad-ad').textContent = th.name;
    $('ad-ozet').textContent = th.desc;
    $('ad-taraf').innerHTML =
      `<b>${esc(th.sides.a)}</b><br>karşı<br><b>${esc(th.sides.b)}</b>`;
    $('taraf-a-ad').textContent = th.sides.a.toLocaleUpperCase('tr-TR');
    $('taraf-b-ad').textContent = th.sides.b.toLocaleUpperCase('tr-TR');
    const src = $<HTMLAnchorElement>('ad-kaynak');
    src.href = th.src;
    src.textContent = th.src;
  }


  /** Açılış ekranındaki senaryo açıklamasını ve taraf adlarını güncelle. */
  private describeScenario(): void {
    const world = this.kind === 'dunya';
    $('acilis-tarih').textContent = world
      ? '28 TEMMUZ 1914 — 11 KASIM 1918'
      : '19 ŞUBAT 1915 — 9 OCAK 1916';
    $('acilis-baslik').textContent = world ? 'BÜYÜK SAVAŞ 1914' : 'ÇANAKKALE 1915';
    $('acilis-ozet').textContent = world
      ? 'Bütün dünya. 4.575 il, 23 savaşan devlet, iki blok. Cepheler '
        + 'Belçika\'dan Kilimanjaro\'ya kadar uzanıyor.'
      : 'Birleşik Filo boğaz ağzında. Tabyalar mayın hatlarını koruyor, '
        + 'mayın hatları tabyaları. Bu döngü kırılmazsa boğaz geçilmez.';
    $('taraf-a-ad').textContent = world ? SIDE_LABEL_WORLD.ottoman : 'OSMANLI';
    $('taraf-b-ad').textContent = world ? SIDE_LABEL_WORLD.entente : 'İTİLAF';
    $('taraf-a-alt').textContent = world
      ? 'Almanya, Avusturya-Macaristan, Osmanlı, Bulgaristan. İki cephede '
        + 'savaş; ablukayı kır.'
      : 'Boğazı savun. Mayın dök, tabyaları besle, çıkarmaları denize dök.';
    $('taraf-b-alt').textContent = world
      ? 'Britanya, Fransa, Rusya ve müttefikleri. Sayıca üstünsün ama '
        + 'cephelerin dağınık.'
      : 'Boğazı zorla. Mayınları tara, tabyaları sustur, Marmara\'ya çık.';
  }

  async newCampaign(side: Side): Promise<void> {
    const th = this.theatre;
    const useOwnMap = th.ownMap === 'canakkale';
    this.kind = useOwnMap ? 'canakkale' : 'dunya';

    $('acilis-durum').textContent = 'Harita yükleniyor…';
    // SIRA ÖNEMLİ: eski durum yeni haritayla çizilirse prov() eski il
    // kimliklerinde patlar. Önce durumu boşalt, sonra haritayı değiştir.
    this.view.clearState();
    this.selection = null;
    this.pending = null;
    this.eventQueue = [];
    $('panel').hidden = true;
    $('ipucu').hidden = true;

    // Küreye dalış + perdenin bulanıklaşarak çekilmesi. Harita arkada
    // kurulurken geçiş oynuyor: bekleme hissi kayboluyor.
    const dive = this.globe?.diveIn(th.pin[0], th.pin[1]) ?? Promise.resolve();
    $('acilis').dataset.cikis = '1';
    $('harita').dataset.giriyor = '1';

    await loadMap(this.kind, useOwnMap ? undefined : th.bbox);
    await this.view.buildMap();
    setActiveScenario(null);
    this.state = useOwnMap ? newGame(side) : newWorldGame(side, 19140728, th);

    await dive;
    this.globe?.stop();
    $('acilis').hidden = true;
    delete $('acilis').dataset.cikis;
    delete $('harita').dataset.giriyor;
    $('marka-ana').textContent = useOwnMap ? 'ÇANAKKALE' : th.name.toLocaleUpperCase('tr-TR');
    $('marka-yil').textContent = th.start.slice(0, 4);
    this.view.selection = null;
    this.view.targeting = false;
    this.view.setState(this.state);
    this.refresh();
    // SIRA: önce animasyonsuz odakla, SONRA uçuşu başlat. Tersi olursa
    // uçuş biter bitmez centreOn eski (minik) zoom'u hedefleyip geri çıkıyor.
    if (useOwnMap) {
      this.view.focusInstant(side === 'ottoman' ? 'd_dar_bogaz' : 'd_bogaz_agzi');
    }
    this.view.introSweep();

    // Açılış brifingi. Oyuncu haritaya bırakılıp "TURU BİTİR" deniyordu;
    // ne durumda olduğu ve mekaniğin hangi kısıta dayandığı hiçbir yerde
    // yazmıyordu. Doğru modellenmiş ama anlatılmamış kısıt öğretmez.
    if (useOwnMap) {
      this.eventQueue = [
        briefingFor(side, this.state.day, this.state.date),
        ...this.eventQueue,
      ];
      this.showNextEvent();
    }
  }


  // ───────────────────────────────────────────────────────── arayüz ──

  private buildModeButtons(): void {
    const nav = $('modlar');
    nav.innerHTML = '';
    for (const m of MAP_MODES) {
      const b = document.createElement('button');
      b.className = 'mod';
      b.textContent = m.label;
      b.setAttribute('aria-pressed', String(this.view.mode === m.id));
      b.addEventListener('click', () => {
        this.view.mode = m.id as MapMode;
        for (const other of nav.querySelectorAll('.mod')) {
          other.setAttribute('aria-pressed', String(other === b));
        }
        this.describeMode();
        this.view.draw();
      });
      nav.appendChild(b);
    }
    this.describeMode();
  }

  /**
   * Etkin harita modunun ne gösterdiğini yazar.
   *
   * Düğmeler yalnız bir ad taşıyordu; "MAYIN" seçildiğinde ekranda beliren
   * şekillerin anlamı hiçbir yerde yazmıyor, oyuncu yuvarlak lekelere bakıp
   * ne olduğunu kestirmeye çalışıyordu.
   */
  private describeMode(): void {
    const box = $('mod-aciklama');
    const key = (c: string, text: string, line = false) =>
      `<li><i class="${line ? 'cizgi' : ''}" style="background:${c}"></i>${text}</li>`;
    // Taraf adları ve renkleri PALETTEN gelir; sabit yazılırsa tema
    // değişince sessizce yalan söyler.
    const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`;
    const ott = this.state?.playerSide === 'ottoman';
    const own = ott ? 'Osmanlı' : 'İtilaf';
    const foe = ott ? 'İtilaf' : 'Osmanlı';
    const ownC = hex(ott ? C.ottomanDim : C.ententeDim);
    const foeC = hex(ott ? C.ententeDim : C.ottomanDim);

    const text: Record<MapMode, string> = {
      siyasi:
        `<b>SİYASİ</b>İlleri denetleyen tarafa göre boyar.<ul>` +
        key(ownC, `${own} denetiminde`) +
        key(foeC, `${foe} denetiminde`) +
        key(hex(C.land), 'Görülmemiş — keşif yok') +
        `</ul>`,
      arazi:
        `<b>ARAZİ</b>Zemin tipi. Savunmaya kattığı değer yükseldikçe renk ` +
        `koyulaşır: sırtlarda saldırmak pahalıdır.`,
      tedarik:
        `<b>İKMAL</b>İllere ulaşan ikmal oranı. Yeşil bol, kırmızı kesik; ` +
        `ikmalsiz birlik organizasyon kaybeder ve cephane harcayamaz.<ul>` +
        key('#7fc08a', 'Tam ikmal') +
        key(hex(C.accent), 'Zorlanıyor') +
        key(hex(C.mine), 'Kesik') +
        `</ul>`,
      deniz:
        `<b>DENİZ</b>Yalnız deniz illeri. Renk koyuldukça akıntı güçlüdür — ` +
        `Boğaz akıntısı mayın tarama ve gemi hızını düşürür.`,
      mayin:
        `<b>MAYIN</b>Her hat boğazı enlemesine kapatan bir bariyerdir; ` +
        `çizgi hattın kendisi, noktalar üstünde KALAN mayınlardır. Etiket ` +
        `hattın adını ve kalan/başlangıç sayısını verir.<ul>` +
        key(hex(C.mine), `${own} hattı`, true) +
        key(hex(C.hostile), `${foe} hattı — yalnız tespit edilmişse`, true) +
        `</ul>`,
    };
    box.innerHTML = text[this.view.mode];
  }

  private bindChrome(): void {
    $('tur-bitir').addEventListener('click', () => this.endTurn());

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !$<HTMLDivElement>('olay-katman').hidden === false) {
        e.preventDefault();
        this.endTurn();
      }
      if (e.code === 'Escape') this.cancelTargeting();
      const idx = Number(e.key);
      if (idx >= 1 && idx <= MAP_MODES.length) {
        const m = MAP_MODES[idx - 1]!;
        this.view.mode = m.id;
        for (const [i, b] of [...$('modlar').querySelectorAll('.mod')].entries()) {
          b.setAttribute('aria-pressed', String(i === idx - 1));
        }
        this.describeMode();
        this.view.draw();
      }
    });

    $('gunluk-kapat').addEventListener('click', () => {
      const list = $('gunluk-liste');
      const hidden = list.style.display === 'none';
      list.style.display = hidden ? '' : 'none';
      $('gunluk-kapat').textContent = hidden ? 'gizle' : 'göster';
    });

    for (const b of document.querySelectorAll<HTMLButtonElement>('.taraf')) {
      b.addEventListener('click', () => {
        $('acilis').hidden = true;
        void this.newCampaign(b.dataset.taraf as Side);
      });
    }

    for (const b of document.querySelectorAll<HTMLButtonElement>('.savas')) {
      b.addEventListener('click', () => {
        const war = b.dataset.savas as WarId;
        if (war === this.war) return;
        this.war = war;
        for (const o of document.querySelectorAll('.savas')) {
          o.setAttribute('aria-pressed', String(o === b));
        }
        this.globe?.setWar(war);
        const first = THEATRES.find((x) => x.war === war)!;
        this.buildTheatreList();
        this.selectTheatre(first);
      });
    }

    for (const b of document.querySelectorAll<HTMLButtonElement>('.senaryo')) {
      b.addEventListener('click', () => {
        const kind = b.dataset.senaryo as MapKind;
        if (kind === this.kind) return;
        this.kind = kind;
        for (const o of document.querySelectorAll('.senaryo')) {
          o.setAttribute('aria-pressed', String(o === b));
        }
        this.describeScenario();
      });
    }

    $('son-yeniden').addEventListener('click', () => {
      $('son-katman').hidden = true;
      $('acilis').hidden = false;
      this.globe?.start();
    });
  }

  private select(sel: Selection | null): void {
    if (this.pending) return;
    this.selection = sel;
    this.view.selection = sel;
    this.panel.render(this.state, sel);
    this.view.draw();
  }

  private hover(sel: Selection | null, screen: { x: number; y: number }): void {
    const tip = $('ipucu');
    if (!sel) {
      tip.hidden = true;
      return;
    }
    const p = prov(sel.id);
    const st = this.state.provinces[sel.id]!;
    const side = this.state.playerSide;
    if (!st.seen[side]) {
      tip.innerHTML = `<b>${esc(p.name)}</b><i>bilgi yok</i>`;
    } else {
      const units = Object.values(this.state.landUnits).filter(
        (u) => u.location === sel.id && !u.embarkedIn && u.strength > 0,
      );
      const fleets = Object.values(this.state.fleets).filter(
        (f) => f.location === sel.id && liveShips(f).length > 0,
      );
      const mines = minefieldsIn(this.state, sel.id)
        .filter((m) => m.side === side || m.spotted)
        .reduce((n, m) => n + m.mines, 0);
      const bits: string[] = [];
      if (units.length) bits.push(`${num(units.reduce((n, u) => n + u.strength, 0))} asker`);
      if (fleets.length) bits.push(`${fleets.reduce((n, f) => n + liveShips(f).length, 0)} gemi`);
      if (mines) bits.push(`${mines} mayın`);
      bits.push(`ikmal %${Math.round(st.supply * 100)}`);
      tip.innerHTML = `<b>${esc(p.name)}</b><i>${esc(bits.join(' · '))}</i>`;
    }
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    tip.style.left = `${Math.min(screen.x + 16, window.innerWidth - r.width - 10)}px`;
    tip.style.top = `${Math.min(screen.y + 16, window.innerHeight - r.height - 10)}px`;
  }

  // ───────────────────────────────────────────────────────── emirler ──

  private beginOrder(p: PendingOrder, needsTarget: boolean): void {
    if (!needsTarget) {
      this.commitOrder(p, null);
      return;
    }
    this.pending = p;
    this.view.targeting = true;
    this.view.validTargets = this.targetsFor(p);
    this.view.draw();
    this.toast(`Haritadan hedef seç · İptal: Esc`);
  }

  private targetsFor(p: PendingOrder): Set<ProvinceId> {
    const s = this.state;
    const out = new Set<ProvinceId>();
    if (p.kind === 'kara') {
      const u = s.landUnits[p.unitId];
      if (!u) return out;
      if (p.order === 'taarruz') {
        for (const n of prov(u.location).neighbours) {
          if (!prov(n).isSea && s.provinces[n]?.controller !== u.side) out.add(n);
        }
      } else if (p.order === 'cikarma') {
        const f = u.embarkedIn ? s.fleets[u.embarkedIn] : null;
        if (f) for (const n of prov(f.location).neighbours) if (!prov(n).isSea) out.add(n);
      } else {
        for (const q of provinces()) if (!q.isSea) out.add(q.id);
      }
    } else {
      for (const q of provinces()) if (q.isSea) out.add(q.id);
    }
    return out;
  }

  private applyTarget(id: ProvinceId): void {
    const p = this.pending;
    if (!p) return;
    this.commitOrder(p, id);
  }

  private commitOrder(p: PendingOrder, target: ProvinceId | null): void {
    const err =
      p.kind === 'kara'
        ? issueLandOrder(this.state, p.unitId, p.order as LandOrderKind, target)
        : issueNavalOrder(this.state, p.unitId, p.order as NavalOrderKind, target);
    this.cancelTargeting();
    if (err) {
      this.toast(err);
      return;
    }
    this.panel.render(this.state, this.selection);
    this.view.draw();
  }

  private cancelTargeting(): void {
    this.pending = null;
    this.view.targeting = false;
    this.view.validTargets = new Set();
    this.view.draw();
  }

  private toast(msg: string): void {
    const tip = $('ipucu');
    tip.innerHTML = `<b>${esc(msg)}</b>`;
    tip.hidden = false;
    tip.style.left = '50%';
    tip.style.top = '84px';
    window.setTimeout(() => {
      tip.hidden = true;
    }, 2200);
  }

  // ─────────────────────────────────────────────────────────── tur ──

  private endTurn(): void {
    if (this.state.outcome) return;
    if (this.eventQueue.length > 0) return;
    this.cancelTargeting();

    const btn = $<HTMLButtonElement>('tur-bitir');
    btn.dataset.calisiyor = '1';
    const { reports } = endTurn(this.state);
    delete btn.dataset.calisiyor;

    // Çarpışma olan iller kısa süre parlasın: nerede ne olduğu görünsün.
    const hot = reports
      .filter((r) => r.kind === 'kara' || r.kind === 'mayin' || r.kind === 'tabya')
      .map((r) => r.province);
    if (hot.length > 0) this.view.flashCombat(hot);

    this.eventQueue = [...this.state.pendingEvents];
    this.state.pendingEvents = [];
    this.refresh();
    this.showNextEvent();
    if (this.state.outcome) this.showOutcome();
  }

  private refresh(): void {
    const s = this.state;
    // Taraf burada kesinleşir; düğmeler kurulurken `state` henüz yoktu ve
    // açıklama kutusu oyuncuyu yanlış tarafta gösteriyordu.
    this.describeMode();
    $('tarih').textContent = formatDate(s.date).toLocaleUpperCase('tr-TR');
    const w = WEATHERS[s.weather];
    $('hava').textContent = `${w.name} · gün ${s.day}`;

    const me = s.sides[s.playerSide];
    const foe = s.sides[s.playerSide === 'ottoman' ? 'entente' : 'ottoman'];
    const myLand = Object.values(s.landUnits)
      .filter((u) => u.side === s.playerSide && !u.embarkedIn)
      .reduce((n, u) => n + u.strength, 0);
    const myShips = Object.values(s.fleets)
      .filter((f) => f.side === s.playerSide)
      .reduce((n, f) => n + liveShips(f).length, 0);
    const vp = provinces()
      .filter((p) => s.provinces[p.id]!.controller === s.playerSide)
      .reduce((n, p) => n + p.victoryPoints, 0);
    const mines = Object.values(s.minefields)
      .filter((m) => m.side === s.playerSide && m.laidOn <= s.day)
      .reduce((n, m) => n + m.mines, 0);

    const metric = (name: string, value: string, cls = '', barPct?: number, barCls = '') =>
      `<div class="olcu"><span class="olcu-ad">${name}</span>
        <span class="olcu-deger ${cls}">${value}</span>
        ${
          barPct === undefined
            ? ''
            : `<span class="cubuk ${barCls}"><i style="width:${barPct}%"></i></span>`
        }</div>`;

    const onceki = this.oncekiOlcu;
    const simdiki: Record<string, string> = {};
    const rows = [
      metric(
        'TARAF',
        (s.playerSide === 'ottoman' ? this.theatre.sides.a : this.theatre.sides.b)
          .toLocaleUpperCase('tr-TR')
          .slice(0, 22),
        'vurgu',
      ),
      metric(
        'MORAL',
        `%${Math.round(me.morale * 100)}`,
        me.morale < 0.3 ? 'kotu' : '',
        me.morale * 100,
        s.playerSide === 'ottoman' ? 'osm' : 'ent',
      ),
      metric('SAHADA', num(myLand)),
      metric('İNSAN GÜCÜ', num(me.manpower)),
      metric('CEPHANE', num(me.ammo), me.ammo < 5000 ? 'kotu' : ''),
      metric('GEMİ', String(myShips)),
      metric('MAYIN', num(mines)),
      metric('ZAFER PUANI', String(vp), 'vurgu'),
      metric('DÜŞMAN MORALİ', `%${Math.round(foe.morale * 100)}`),
    ];
    $('olculer').innerHTML = rows.join('');

    // Değişen sayıları kısa bir vurguyla işaretle — tur sonunda neyin
    // oynadığı gözden kaçmasın.
    for (const el of $('olculer').querySelectorAll<HTMLElement>('.olcu')) {
      const ad = el.querySelector('.olcu-ad')?.textContent ?? '';
      const dg = el.querySelector<HTMLElement>('.olcu-deger');
      if (!dg) continue;
      simdiki[ad] = dg.textContent ?? '';
      if (onceki[ad] !== undefined && onceki[ad] !== simdiki[ad]) {
        dg.dataset.degisti = '1';
      }
    }
    this.oncekiOlcu = simdiki;

    this.renderLog();
    this.view.setState(s);
    if (this.selection) this.panel.render(s, this.selection);
    $<HTMLButtonElement>('tur-bitir').disabled = s.outcome !== null;
  }

  /**
   * Günlük.
   *
   * Aynı ildeki tabya düellosu her gemi grubu için ayrı rapor üretiyordu:
   * tek turda üç kez "Boğaz Ağzı — tabya düellosu" satırı çıkıyor, yirmi
   * tur sonra ekran birbirinin aynı kayıtlarla doluyordu. Aynı gün + aynı
   * il + aynı başlık tek kayda katlanır, kaç kez olduğu sayıyla verilir.
   * Asıl olaylar (mayın çarpması, batan gemi) böylece gömülmez.
   */
  private renderLog(): void {
    const list = $('gunluk-liste');
    if (this.state.reports.length === 0) {
      list.innerHTML = `<div class="kayit"><div class="kayit-satir">
        Henüz rapor yok. Emirleri ver ve turu bitir.</div></div>`;
      return;
    }

    // Raporlar oyun durumunun parçası; burada KOPYA üzerinde çalışılır.
    // Satırları yerinde biriktirmek render'ı duruma yazan bir yan etki
    // yapardı ve kayıtlar her çizimde şişerdi.
    interface LogEntry {
      readonly report: CombatReport;
      readonly lines: string[];
      count: number;
    }
    const merged: LogEntry[] = [];
    const seen = new Map<string, LogEntry>();
    for (const r of this.state.reports) {
      const key = `${r.day}|${r.province}|${r.title}`;
      const hit = seen.get(key);
      if (!hit) {
        const entry: LogEntry = { report: r, lines: [...r.lines], count: 1 };
        seen.set(key, entry);
        merged.push(entry);
        if (merged.length >= 40) break;
        continue;
      }
      hit.count++;
      // Tekrar eden kaydın ÖZGÜN satırlarını koru: biri "mayına çarptı"
      // diyorsa o satır kaybolmamalı.
      for (const l of r.lines) if (!hit.lines.includes(l)) hit.lines.push(l);
    }

    // Satırları ÖNEME göre sırala. Birleşmiş bir düello kaydında dört adet
    // "1 tabya menzilde · donanma ateşi 130" satırı, aralarındaki tek
    // "mayına çarptı" satırını kesme sınırının altına itiyordu.
    // 'temizlenemedi' BİLEREK dışarıda: tarama raporunda öğretici olan şey
    // sonuç değil, nedensellik zinciri (kapasite → akıntı → tabya ateşi →
    // sonuç). Onu öne çekmek zinciri tersine çeviriyordu.
    const KEY = /mayına çarp|batt|hasarl|savaş dışı|çekil|ele geçir|şehit/i;
    for (const e of merged) {
      e.lines.sort((a, b) => Number(KEY.test(b)) - Number(KEY.test(a)));
    }

    list.innerHTML = merged
      .map(
        ({ report: r, lines, count }) =>
          `<div class="kayit ${r.kind}" data-il="${r.province}">
        <div class="kayit-bas"><span>${esc(r.title)}${count > 1 ? ` ×${count}` : ''}</span>
          <span class="kayit-gun">g${r.day}</span></div>
        ${lines
          .slice(0, 4)
          .map((l) => `<div class="kayit-satir">${esc(l)}</div>`)
          .join('')}
        ${
          lines.length > 4
            ? `<div class="kayit-satir soluk">+${lines.length - 4} satır daha</div>`
            : ''
        }
      </div>`,
      )
      .join('');
    for (const el of list.querySelectorAll<HTMLElement>('.kayit')) {
      el.addEventListener('click', () => {
        const id = el.dataset.il;
        if (id) {
          this.view.centreOn(id);
          this.select({ kind: 'il', id });
        }
      });
    }
  }

  private showNextEvent(): void {
    const e = this.eventQueue.shift();
    const layer = $('olay-katman');
    if (!e) {
      layer.hidden = true;
      return;
    }
    $('olay-tarih').textContent = formatDate(e.date).toLocaleUpperCase('tr-TR');
    $('olay-baslik').textContent = e.title;
    $('olay-govde').textContent = e.body;
    const src = $<HTMLAnchorElement>('olay-kaynak');
    src.href = e.src;
    src.textContent = e.src;

    const box = $('olay-secenek');
    box.innerHTML = '';
    if (e.choices && e.choices.length > 0) {
      for (const c of e.choices) {
        const b = document.createElement('button');
        b.className = 'secenek';
        b.innerHTML = `<b>${esc(c.label)}</b><span>${esc(c.desc)}</span>`;
        b.addEventListener('click', () => {
          applyEffect(this.state, c.effect);
          this.refresh();
          this.showNextEvent();
        });
        box.appendChild(b);
      }
    } else {
      const b = document.createElement('button');
      b.className = 'secenek';
      b.innerHTML = `<b>DEVAM</b>`;
      b.addEventListener('click', () => this.showNextEvent());
      box.appendChild(b);
    }
    layer.hidden = false;
  }

  private showOutcome(): void {
    const o = this.state.outcome;
    if (!o) return;
    $('son-baslik').textContent =
      o.winner === this.state.playerSide ? 'ZAFER' : 'YENİLGİ';
    $('son-govde').textContent = `${o.reason}\n\n${
      o.winner === 'ottoman' ? 'Osmanlı' : 'İtilaf'
    } galip — ${formatDate(this.state.date)}.`;
    $('son-katman').hidden = false;
  }
}

const game = new Game();
// @ts-expect-error hata ayıklama kancası
window.__game = game;
void game.start();
