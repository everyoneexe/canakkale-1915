import globeData from '../data/globe.json';
import { THEATRES } from '../data/theatres.ts';
import type { Theatre, WarId } from '../data/theatres.ts';
import { C, css } from '../style/tokens.ts';

/**
 * Cephe seçim küresi.
 *
 * Ortografik izdüşüm — gerçek bir küre görünümü, sürükleyerek döndürülür.
 * Canvas2D kullanılır: tek seferlik bir ekran için Pixi kurmanın anlamı yok
 * ve geometri zaten kaba (107 kıyı halkası, 1.289 köşe).
 *
 * Projeksiyon (λ: boylam, φ: enlem; λ0/φ0 kamera):
 *   cos c = sin φ0 · sin φ + cos φ0 · cos φ · cos(λ−λ0)
 *   görünür  ⟺  cos c > 0        (arka yüz çizilmez)
 *   x = R · cos φ · sin(λ−λ0)
 *   y = −R · (cos φ0 · sin φ − sin φ0 · cos φ · cos(λ−λ0))
 */

const D = Math.PI / 180;

interface GlobeData {
  coast: [number, number][][];
  wars: Record<string, { side: string; ring: [number, number][] }[]>;
}

const DATA = globeData as unknown as GlobeData;

const SIDE_COLOUR: Readonly<Record<string, string>> = {
  ittifak: '#c0453a',
  itilaf: '#4f7fc4',
  eksen: '#c0453a',
  muttefik: '#4f7fc4',
  tarafsiz: '#55503f',
};

export interface GlobeCallbacks {
  onHover(t: Theatre | null): void;
  onPick(t: Theatre): void;
}

export class Globe {
  private cv: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cb: GlobeCallbacks;

  /** Kamera merkezi. */
  private lon0 = 14;
  private lat0 = 32;
  private radius = 220;
  private cx = 0;
  private cy = 0;

  private war: WarId = 'ww1';
  private dragging = false;
  private last = { x: 0, y: 0 };
  private moved = 0;
  private hovered: Theatre | null = null;
  private spin = true;
  /** Yumuşatılacak kamera hedefi. */
  private target: { lon: number; lat: number } | null = null;
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private lastT = 0;
  private raf = 0;
  /** Ekran konumları — tıklama isabeti için her karede güncellenir. */
  private pins: { t: Theatre; x: number; y: number }[] = [];

  constructor(canvas: HTMLCanvasElement, cb: GlobeCallbacks) {
    this.cv = canvas;
    this.cb = cb;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D bağlamı alınamadı');
    this.ctx = ctx;
    this.bind();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  /** Listede seçili cephe — kürede nabızla işaretlenir. */
  selected: Theatre | null = null;

  setWar(war: WarId): void {
    this.war = war;
    const first = THEATRES.find((t) => t.war === war);
    if (first) this.focus(first.pin[0], first.pin[1]);
  }

  /**
   * Belirli bir noktayı öne döndür — SIÇRAMADAN. Hedef saklanır, her kare
   * kısa yoldan yumuşatılır (±180° sarmasını doğru çözerek).
   */
  focus(lon: number, lat: number): void {
    this.target = { lon, lat: Math.max(-70, Math.min(70, lat)) };
    this.spin = false;
    if (this.reduced) {
      this.lon0 = lon;
      this.lat0 = this.target.lat;
      this.target = null;
    }
  }

  /** Cephe seçilip oyun başlarken: küreye dalış hissi. */
  async diveIn(lon: number, lat: number): Promise<void> {
    this.focus(lon, lat);
    if (this.reduced) return;
    const from = this.radius;
    const to = from * 2.6;
    const t0 = performance.now();
    await new Promise<void>((done) => {
      const step = () => {
        const u = Math.min(1, (performance.now() - t0) / 420);
        // ease-out: başta hızlı, sonda yavaş — anında tepki hissi.
        const e = 1 - (1 - u) ** 3;
        this.radius = from + (to - from) * e;
        if (u < 1) requestAnimationFrame(step);
        else done();
      };
      requestAnimationFrame(step);
    });
  }

  start(): void {
    if (this.raf) return;
    const loop = () => {
      const now = performance.now();
      const dt = Math.min(64, now - (this.lastT || now));
      this.lastT = now;

      if (this.target && !this.dragging) {
        // ±180° sarmasında kısa yoldan git.
        let d = ((this.target.lon - this.lon0 + 540) % 360) - 180;
        const k = 1 - Math.exp(-dt / 170);
        const dLat = this.target.lat - this.lat0;
        if (Math.abs(d) < 0.25 && Math.abs(dLat) < 0.25) {
          this.lon0 = this.target.lon;
          this.lat0 = this.target.lat;
          this.target = null;
        } else {
          this.lon0 += d * k;
          this.lat0 += dLat * k;
        }
      } else if (this.spin && !this.dragging) {
        this.lon0 = (this.lon0 + dt * 0.004) % 360;
      }
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private resize(): void {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = this.cv.getBoundingClientRect();
    this.cv.width = Math.round(rect.width * dpr);
    this.cv.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cx = rect.width / 2;
    this.cy = rect.height / 2;
    this.radius = Math.min(rect.width, rect.height) * 0.43;
  }

  // ───────────────────────────────────────────────────── izdüşüm ────

  private project(lon: number, lat: number): { x: number; y: number; vis: boolean } {
    const l = (lon - this.lon0) * D;
    const p = lat * D;
    const p0 = this.lat0 * D;
    const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    return {
      x: this.cx + this.radius * Math.cos(p) * Math.sin(l),
      y: this.cy - this.radius * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)),
      vis: cosc > 0,
    };
  }

  // ───────────────────────────────────────────────────────── çizim ──

  private draw(): void {
    const g = this.ctx;
    const r = this.radius;
    g.clearRect(0, 0, this.cv.width, this.cv.height);

    // Okyanus küresi + ince ışık kenarı.
    g.beginPath();
    g.arc(this.cx, this.cy, r, 0, Math.PI * 2);
    const grad = g.createRadialGradient(
      this.cx - r * 0.35,
      this.cy - r * 0.4,
      r * 0.1,
      this.cx,
      this.cy,
      r,
    );
    grad.addColorStop(0, '#0b1424');
    grad.addColorStop(0.75, '#04080f');
    grad.addColorStop(1, '#010306');
    g.fillStyle = grad;
    g.fill();

    this.drawGraticule();
    this.drawRings(DATA.wars[this.war] ?? [], true);
    this.drawCoast();

    // Kenar halkası — videodaki amber çizgi dili.
    g.beginPath();
    g.arc(this.cx, this.cy, r, 0, Math.PI * 2);
    g.strokeStyle = 'rgba(217,164,65,0.55)';
    g.lineWidth = 1.2;
    g.stroke();

    this.drawPins();
  }

  private drawGraticule(): void {
    const g = this.ctx;
    g.strokeStyle = 'rgba(138,106,46,0.18)';
    g.lineWidth = 0.6;
    for (let lat = -60; lat <= 60; lat += 30) {
      g.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 4) {
        const p = this.project(lon, lat);
        if (!p.vis) {
          started = false;
          continue;
        }
        if (started) g.lineTo(p.x, p.y);
        else {
          g.moveTo(p.x, p.y);
          started = true;
        }
      }
      g.stroke();
    }
    for (let lon = -180; lon < 180; lon += 30) {
      g.beginPath();
      let started = false;
      for (let lat = -80; lat <= 80; lat += 4) {
        const p = this.project(lon, lat);
        if (!p.vis) {
          started = false;
          continue;
        }
        if (started) g.lineTo(p.x, p.y);
        else {
          g.moveTo(p.x, p.y);
          started = true;
        }
      }
      g.stroke();
    }
  }

  private drawRings(
    polys: { side: string; ring: [number, number][] }[],
    filled: boolean,
  ): void {
    const g = this.ctx;
    for (const poly of polys) {
      const colour = SIDE_COLOUR[poly.side] ?? '#55503f';
      g.beginPath();
      let started = false;
      let any = false;
      for (const [lon, lat] of poly.ring) {
        const p = this.project(lon, lat);
        if (!p.vis) {
          started = false;
          continue;
        }
        any = true;
        if (started) g.lineTo(p.x, p.y);
        else {
          g.moveTo(p.x, p.y);
          started = true;
        }
      }
      if (!any) continue;
      g.closePath();
      if (filled) {
        g.fillStyle = colour;
        g.globalAlpha = poly.side === 'tarafsiz' ? 0.3 : 0.55;
        g.fill();
        g.globalAlpha = 1;
      }
      g.strokeStyle = 'rgba(0,0,0,0.5)';
      g.lineWidth = 0.5;
      g.stroke();
    }
  }

  private drawCoast(): void {
    const g = this.ctx;
    g.strokeStyle = 'rgba(217,164,65,0.72)';
    g.lineWidth = 0.9;
    for (const ring of DATA.coast) {
      g.beginPath();
      let started = false;
      for (const [lon, lat] of ring) {
        const p = this.project(lon, lat);
        if (!p.vis) {
          started = false;
          continue;
        }
        if (started) g.lineTo(p.x, p.y);
        else {
          g.moveTo(p.x, p.y);
          started = true;
        }
      }
      g.stroke();
    }
  }

  private drawPins(): void {
    const g = this.ctx;
    this.pins = [];
    for (const t of THEATRES) {
      if (t.war !== this.war) continue;
      const p = this.project(t.pin[0], t.pin[1]);
      if (!p.vis) continue;
      this.pins.push({ t, x: p.x, y: p.y });

      const on = this.hovered?.id === t.id;
      const sel = this.selected?.id === t.id;
      // Seçili iğne yavaşça nabız atar: gözün nereye bakacağını söyler.
      const pulse = sel ? 1 + Math.sin(performance.now() / 420) * 0.16 : 1;
      const rad = (on ? 8 : sel ? 7 : 5) * pulse;

      // Halo
      g.beginPath();
      g.arc(p.x, p.y, rad + 6, 0, Math.PI * 2);
      g.fillStyle = on ? 'rgba(255,195,84,0.22)' : 'rgba(255,195,84,0.08)';
      g.fill();

      g.beginPath();
      g.arc(p.x, p.y, rad, 0, Math.PI * 2);
      g.fillStyle = css(C.accent);
      g.fill();
      g.strokeStyle = '#120d02';
      g.lineWidth = 1.4;
      g.stroke();

      if (on) {
        g.font = '600 12px "JetBrains Mono", monospace';
        g.fillStyle = css(C.text);
        g.textAlign = 'center';
        const label = t.name.toLocaleUpperCase('tr-TR');
        const w = g.measureText(label).width;
        g.fillStyle = 'rgba(0,0,0,0.82)';
        g.fillRect(p.x - w / 2 - 7, p.y - rad - 26, w + 14, 19);
        g.fillStyle = css(C.accent);
        g.fillText(label, p.x, p.y - rad - 12);
      }
    }
  }

  // ───────────────────────────────────────────────────────── girdi ──

  private bind(): void {
    this.cv.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.spin = false;
      this.moved = 0;
      this.last = { x: e.offsetX, y: e.offsetY };
      this.cv.setPointerCapture(e.pointerId);
    });

    this.cv.addEventListener('pointerup', (e) => {
      this.dragging = false;
      if (this.moved > 5) return;
      const hit = this.hitTest(e.offsetX, e.offsetY);
      if (hit) this.cb.onPick(hit);
    });

    this.cv.addEventListener('pointerleave', () => {
      this.dragging = false;
      this.hovered = null;
      this.cb.onHover(null);
    });

    this.cv.addEventListener('pointermove', (e) => {
      if (this.dragging) {
        const dx = e.offsetX - this.last.x;
        const dy = e.offsetY - this.last.y;
        this.moved += Math.abs(dx) + Math.abs(dy);
        this.lon0 -= dx * 0.32;
        this.lat0 = Math.max(-78, Math.min(78, this.lat0 + dy * 0.32));
        this.last = { x: e.offsetX, y: e.offsetY };
        return;
      }
      const hit = this.hitTest(e.offsetX, e.offsetY);
      if (hit?.id !== this.hovered?.id) {
        this.hovered = hit;
        this.cv.style.cursor = hit ? 'pointer' : 'grab';
        this.cb.onHover(hit);
      }
    });

    this.cv.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.radius = Math.max(120, Math.min(900, this.radius * Math.exp(-e.deltaY * 0.0012)));
      },
      { passive: false },
    );
  }

  private hitTest(x: number, y: number): Theatre | null {
    let best: Theatre | null = null;
    let bestD = 16 * 16;
    for (const p of this.pins) {
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = p.t;
      }
    }
    return best;
  }
}
