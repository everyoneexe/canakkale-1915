import { BASE_PX_PER_DEG, buildMosaic } from '../render/terrain-mosaic.ts';
import type { LatLonBox } from '../render/terrain-mosaic.ts';
import { THEATRES } from '../data/theatres.ts';
import type { Theatre, WarId } from '../data/theatres.ts';

/**
 * Cephe seçim küresi — WebGL2 ile GERÇEK küre.
 *
 * Önceki sürüm vektör çokgenlerini bir dairenin içine çiziyordu: düz, ölü,
 * "daire içine basılmış harita" gibi. Burada ekran dörtgenine ortografik bir
 * küre ışın-izi (raycast) yapılıp üstüne gerçek arazi dokusu kaplanıyor:
 *
 *   · `world-relief.webp` — SRTM/ETOPO yüksekliğinden önceden gölgelendirilmiş
 *     arazi ve batimetri (Python'da üretildi)
 *   · `pol-ww1/ww2.webp`  — eşdikdörtgen siyasi maske, savaş başına
 *   · güneş yönüne göre gündüz/gece terminatörü, gece tarafı mavimsi ve karanlık
 *   · Fresnel atmosfer haresi ve dış korona
 *
 * Tek çizim çağrısı; döndürme ve yakınlaştırma GPU'da.
 */

const D = Math.PI / 180;
/** Doku ±82° enlemle sınırlı (Mercator karolardan yeniden örneklendi). */
const LAT_LIM = 82;

export interface GlobeCallbacks {
  onHover(t: Theatre | null): void;
  onPick(t: Theatre): void;
}

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uTerrain;   // eşdikdörtgen arazi (önceden gölgelendirilmiş)
uniform sampler2D uPolitical; // eşdikdörtgen taraf maskesi
uniform vec2  uRes;
uniform vec2  uCentre;
uniform float uRadius;
uniform float uLon0;
uniform float uLat0;
uniform vec3  uSun;
uniform float uPolMix;
uniform float uLatLim;
// Yakınlaştırınca canlı indirilen arazi mozaiği ve kapsadığı kutu
// (batı, güney, doğu, kuzey — derece). uDetailMix 0 ise doku yok.
uniform sampler2D uDetail;
uniform vec4  uDetailBox;
uniform float uDetailMix;

const float PI = 3.14159265359;

void main() {
  // Ekran uzayı: x sağa, ys YUKARI (gl_FragCoord yukarı artar).
  vec2 frag = gl_FragCoord.xy;
  float x = (frag.x - uCentre.x) / uRadius;
  float ys = (frag.y - (uRes.y - uCentre.y)) / uRadius;
  float r2 = x * x + ys * ys;

  // ── Uzay + atmosfer koronası ───────────────────────────────────────
  if (r2 > 1.0) {
    float r = sqrt(r2);
    float glow = exp(-(r - 1.0) * 16.0);
    float lit = clamp(dot(normalize(vec3(x, ys, 0.0)), uSun) * 0.5 + 0.5, 0.0, 1.0);
    vec3 air = vec3(0.26, 0.48, 0.92) * glow * (0.35 + 0.75 * lit);
    outColor = vec4(air, glow * 0.95);
    return;
  }

  float z = sqrt(max(0.0, 1.0 - r2));

  // ── TERS ORTOGRAFİK ───────────────────────────────────────────────
  // İleri izdüşüm (iğneler için JS'te de aynısı):
  //   sx = cos(lat)·sin(lon−lon0)
  //   sy = cos(lat0)·sin(lat) − sin(lat0)·cos(lat)·cos(lon−lon0)
  //   z  = sin(lat0)·sin(lat) + cos(lat0)·cos(lat)·cos(lon−lon0)
  // Tersi (c = asin(ρ), cos c = z, sin c = ρ sadeleşince):
  float s0 = sin(uLat0), c0 = cos(uLat0);
  float lat = asin(clamp(z * s0 + ys * c0, -1.0, 1.0));
  float lon = uLon0 + atan(x, z * c0 - ys * s0);

  // ── Doku örnekleme ────────────────────────────────────────────────
  float u = fract(lon / (2.0 * PI) + 0.5);
  float v = (uLatLim - lat) / (2.0 * uLatLim);
  // Kutuplarda doku yok: kenar satırını uzat, sonra buza karıştır.
  // Doku ±82° ile sınırlı. Kutup bölgesini DÜZ beyaza boyamak kuzeyde
  // kocaman, keskin kenarlı bir elips bırakıyordu. Bunun yerine dokunun
  // kenar satırı uzatılır (clamp) ve üstüne çok hafif bir buz tonu gelir;
  // 82° kuzeyi zaten deniz buzu olduğu için doğal duruyor.
  float polar = (smoothstep(-0.01, -0.09, v) + smoothstep(1.01, 1.09, v)) * 0.30;
  vec2 uv = vec2(u, clamp(v, 0.0, 1.0));

  // Doku düz haritanın koyu zemini için üretildi; kürede daha parlak olmalı.
  vec3 base = texture(uTerrain, uv).rgb * 2.05;

  // ── Yakınlaştırmada canlı mozaik ──────────────────────────────────
  // Zemin dokusu 11 px/derece; küreye yaklaşınca bulanıklaşıyor. İndirilen
  // mozaik kapsadığı kutunun içinde onun yerine geçer. Kenarda sert bir
  // dikdörtgen kalmasın diye kutu sınırına doğru yumuşak geçiş yapılır;
  // pay, kutunun kendi boyutunun %4'ü.
  if (uDetailMix > 0.0) {
    float lonD = degrees(lon);
    lonD = lonD - 360.0 * floor((lonD + 180.0) / 360.0);
    float latD = degrees(lat);
    float w = uDetailBox.x, s = uDetailBox.y, e = uDetailBox.z, n = uDetailBox.w;
    float fx = (e - w) * 0.04;
    float fy = (n - s) * 0.04;
    float inside =
      smoothstep(w, w + fx, lonD) * (1.0 - smoothstep(e - fx, e, lonD)) *
      smoothstep(s, s + fy, latD) * (1.0 - smoothstep(n - fy, n, latD));
    vec2 duv = vec2((lonD - w) / (e - w), (n - latD) / (n - s));
    vec3 det = texture(uDetail, duv).rgb * 2.05;
    base = mix(base, det, inside * uDetailMix);
  }

  vec3 pol = texture(uPolitical, uv).rgb;
  float has = step(0.02, max(pol.r, max(pol.g, pol.b)));

  // Siyasi renk DÜZ bir boya değil: arazinin parlaklığıyla modüle edilir.
  // Böylece dağlar, çöller ve sırtlar taraf renginin altında görünmeye
  // devam eder — Paradox harita modlarının yaptığı şey.
  float lum = dot(base, vec3(0.299, 0.587, 0.114));
  vec3 politicalShaded = pol * (0.42 + 1.55 * lum);
  base = mix(base, politicalShaded, has * uPolMix);
  base = mix(base, vec3(0.72, 0.78, 0.84), clamp(polar, 0.0, 1.0));

  // ── Aydınlatma ────────────────────────────────────────────────────
  vec3 w = vec3(cos(lat) * sin(lon), sin(lat), cos(lat) * cos(lon));
  float ndl = dot(w, uSun);
  float day = smoothstep(-0.20, 0.25, ndl);
  vec3 night = base * 0.17 + vec3(0.010, 0.018, 0.045);
  vec3 col = mix(night, base * (0.60 + 0.60 * max(ndl, 0.0)), day);

  // Alacakaranlık çizgisi.
  col += vec3(0.52, 0.26, 0.10) * exp(-pow((ndl + 0.02) * 7.5, 2.0)) * 0.40;

  // ── Atmosfer: kenara doğru mavi saçılma ───────────────────────────
  // Okyanus, İtilaf mavisinden ayrışsın diye hafifçe koyultulur.
  float landish = step(0.02, max(pol.r, max(pol.g, pol.b)));
  col *= mix(0.88, 1.0, landish);

  float fres = pow(1.0 - z, 3.0);
  col += vec3(0.20, 0.42, 0.85) * fres * (0.30 + 0.70 * day);
  col *= 1.0 - 0.22 * pow(1.0 - z, 7.0);

  outColor = vec4(col, 1.0);
}`;


function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(`gölgelendirici derlenmedi: ${gl.getShaderInfoLog(sh)}`);
  }
  return sh;
}

async function loadTexture(
  gl: WebGL2RenderingContext,
  url: string,
): Promise<WebGLTexture> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((ok, fail) => {
    img.onload = () => ok();
    img.onerror = () => fail(new Error(`doku yüklenemedi: ${url}`));
    img.src = url;
  });
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  // Boylamda sar (±180 dikişi), enlemde kenara sıkıştır.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);
  return tex;
}

export class Globe {
  private cv: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private cb: GlobeCallbacks;

  /** İğne ve etiket katmanı — küre WebGL, işaretler 2D üstte. */
  private overlay: HTMLCanvasElement;
  private octx: CanvasRenderingContext2D;

  private prog!: WebGLProgram;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private terrain: WebGLTexture | null = null;
  private political: Record<string, WebGLTexture> = {};
  private ready = false;
  /** Yakınlaştırmada canlı indirilen arazi mozaiği. */
  private detail: WebGLTexture | null = null;
  private detailBox: LatLonBox | null = null;
  private detailKey = '';
  private detailTimer: number | undefined;
  /** Son geciktirme hangi görünüm için kuruldu. */
  private detailPending = '';
  private detailBusy = false;

  private lon0 = 14;
  private lat0 = 32;
  private radius = 240;
  /** Tüm kürenin kadraja oturduğu yarıçap — zoom sınırlarının dayanağı. */
  private fitRadius = 0;
  private cx = 0;
  private cy = 0;

  private war: WarId = 'ww1';
  selected: Theatre | null = null;

  private dragging = false;
  private last = { x: 0, y: 0 };
  private moved = 0;
  private hovered: Theatre | null = null;
  private spin = true;
  private raf = 0;
  private target: { lon: number; lat: number } | null = null;
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private lastT = 0;
  private pins: { t: Theatre; x: number; y: number }[] = [];

  constructor(canvas: HTMLCanvasElement, cb: GlobeCallbacks) {
    this.cv = canvas;
    this.cb = cb;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) throw new Error('WebGL2 yok');
    this.gl = gl;

    // İğneler için üstte saydam 2D katman.
    this.overlay = document.createElement('canvas');
    this.overlay.className = 'kure-overlay';
    canvas.parentElement?.appendChild(this.overlay);
    this.octx = this.overlay.getContext('2d')!;

    this.initGl();
    this.bind();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private initGl(): void {
    const gl = this.gl;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(`program bağlanmadı: ${gl.getProgramInfoLog(prog)}`);
    }
    this.prog = prog;
    gl.useProgram(prog);

    const quad = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    for (const n of [
      'uTerrain', 'uPolitical', 'uRes', 'uCentre', 'uRadius',
      'uLon0', 'uLat0', 'uSun', 'uPolMix', 'uLatLim',
      'uDetail', 'uDetailBox', 'uDetailMix',
    ]) {
      this.loc[n] = gl.getUniformLocation(prog, n);
    }
    gl.uniform1i(this.loc['uTerrain']!, 0);
    gl.uniform1i(this.loc['uPolitical']!, 1);
    gl.uniform1i(this.loc['uDetail']!, 2);
    gl.uniform1f(this.loc['uLatLim']!, LAT_LIM * D);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  /** Dokular inene kadar küre çizilmez. */
  async load(): Promise<void> {
    const gl = this.gl;
    const [terrain, ww1, ww2] = await Promise.all([
      loadTexture(gl, 'world-relief.webp'),
      loadTexture(gl, 'pol-ww1.webp'),
      loadTexture(gl, 'pol-ww2.webp'),
    ]);
    this.terrain = terrain;
    this.political = { ww1, ww2 };
    this.ready = true;
  }

  setWar(war: WarId): void {
    this.war = war;
    const first = THEATRES.find((t) => t.war === war);
    if (first) this.focus(first.pin[0], first.pin[1]);
  }

  /** Noktayı öne döndür — sıçramadan, ±180 sarmasını kısa yoldan çözerek. */
  focus(lon: number, lat: number): void {
    this.target = { lon, lat: Math.max(-72, Math.min(72, lat)) };
    this.spin = false;
    if (this.reduced) {
      this.lon0 = lon;
      this.lat0 = this.target.lat;
      this.target = null;
    }
  }

  /** Cephe seçilip oyun başlarken: küreye dalış. */
  async diveIn(lon: number, lat: number): Promise<void> {
    this.focus(lon, lat);
    if (this.reduced) return;
    const from = this.radius;
    const to = from * 2.8;
    const t0 = performance.now();
    await new Promise<void>((done) => {
      const step = () => {
        const u = Math.min(1, (performance.now() - t0) / 460);
        this.radius = from + (to - from) * (1 - (1 - u) ** 3);
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
        const d = ((this.target.lon - this.lon0 + 540) % 360) - 180;
        const dLat = this.target.lat - this.lat0;
        const k = 1 - Math.exp(-dt / 170);
        if (Math.abs(d) < 0.25 && Math.abs(dLat) < 0.25) {
          this.lon0 = this.target.lon;
          this.lat0 = this.target.lat;
          this.target = null;
        } else {
          this.lon0 += d * k;
          this.lat0 += dLat * k;
        }
      } else if (this.spin && !this.dragging) {
        this.lon0 = (this.lon0 + dt * 0.0035) % 360;
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
    for (const c of [this.cv, this.overlay]) {
      c.width = Math.max(1, Math.round(rect.width * dpr));
      c.height = Math.max(1, Math.round(rect.height * dpr));
    }
    this.overlay.style.width = `${rect.width}px`;
    this.overlay.style.height = `${rect.height}px`;
    this.octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cx = rect.width / 2;
    this.cy = rect.height / 2;
    // Tüm kürenin kadraja oturduğu yarıçap; zoom sınırları buna göre.
    const fit = Math.min(rect.width, rect.height) * 0.42;
    // Mevcut zoom oranını koru, yoksa pencere boyu değişince küre sıçrıyor.
    const k = this.fitRadius > 0 ? this.radius / this.fitRadius : 1;
    this.fitRadius = fit;
    this.radius = this.clampRadius(fit * k);
  }

  /**
   * Zoom sınırları.
   *
   * ALT sınır sabit 110 px'ti: küre ekranın ortasında minik bir topa
   * düşebiliyordu — ne okunur ne de bir işe yarar. Artık tüm kürenin
   * kadraja oturduğu yarıçapın altına inilemez.
   *
   * ÜST sınır veriye bağlı: merkezde 400 px/derece ≈ 280 m/ekran pikseli.
   * Akan mozaik daha incesini de verebilir ama küre bir CEPHE SEÇİCİ;
   * bundan ötesinde küre bir düzleme dönüşüyor ve seçim bağlamı kayboluyor.
   */
  private clampRadius(r: number): number {
    const hi = (400 * 180) / Math.PI;
    return Math.max(this.fitRadius, Math.min(hi, r));
  }

  // ───────────────────────────────────────────────────── izdüşüm ────

  private project(lon: number, lat: number): { x: number; y: number; vis: boolean } {
    const l = (lon - this.lon0) * D;
    const p = lat * D;
    const p0 = this.lat0 * D;
    const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    return {
      x: this.cx + this.radius * Math.cos(p) * Math.sin(l),
      y:
        this.cy -
        this.radius * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)),
      vis: cosc > 0,
    };
  }

  // ───────────────────────────────────────────────────────── çizim ──

  /**
   * Görünen küre kapağı için canlı arazi mozaiği ister.
   *
   * Ortografik kürede ekranda görünen parça, merkez noktası (lat0, lon0)
   * çevresinde açısal yarıçapı α olan bir KAPAK:
   *
   *     α = asin( min(R, yarı-görüntü) / R )
   *
   * Kapağın enlem/boylam kutusu standart formülle çıkar; boylam açıklığı
   * kutuplara yaklaştıkça genişler ve kapak kutbu içeriyorsa tam tura
   * döner. Çağrı her karede gelir; gerçek iş durulunca bir kez yapılır.
   */
  private streamDetail(): void {
    // Küre kendiliğinden dönerken veya sürüklenirken akış yapma: pencere
    // her karede kayar, indirilen mozaik daha yüklenmeden bayatlar.
    if (this.spin || this.dragging) return;
    const rect = this.cv.getBoundingClientRect();
    const pxPerDeg = (this.radius * Math.PI) / 180;
    if (pxPerDeg <= BASE_PX_PER_DEG * 1.3) {
      if (this.detail) {
        this.gl.deleteTexture(this.detail);
        this.detail = null;
        this.detailBox = null;
        this.detailKey = '';
      }
      return;
    }

    const half = Math.max(rect.width, rect.height) / 2;
    const a = (Math.asin(Math.min(1, half / this.radius)) * 180) / Math.PI;
    const north = Math.min(85, this.lat0 + a);
    const south = Math.max(-85, this.lat0 - a);
    // Kapak kutbu içeriyorsa tüm boylamlar görünür.
    const cosLat = Math.cos((this.lat0 * Math.PI) / 180);
    const full = Math.abs(this.lat0) + a >= 89 || cosLat < 1e-3;
    const dLon = full
      ? 180
      : Math.min(
          180,
          (Math.asin(
            Math.min(1, Math.sin((a * Math.PI) / 180) / cosLat),
          ) *
            180) /
            Math.PI,
        );
    const c = ((this.lon0 + 540) % 360) - 180;
    const view: LatLonBox = {
      west: Math.max(-180, c - dLon),
      east: Math.min(180, c + dLon),
      south,
      north,
    };

    // Geciktirme GÖRÜNÜM DEĞİŞİMİNE bağlı, kareye değil. `draw` saniyede 60
    // kez çağrılıyor; her karede `clearTimeout` yapılınca zamanlayıcı hiç
    // ateşlenmiyordu ve tek bir karo bile indirilmiyordu.
    // Kaba imza: yarım derecelik kayma yeni indirme tetiklemesin.
    const q = (x: number) => Math.round(x * 2) / 2;
    const sig = `${q(view.west)},${q(view.south)},${q(view.east)},${q(view.north)},${Math.round(Math.log2(pxPerDeg) * 2)}`;
    if (sig === this.detailPending) return;
    this.detailPending = sig;
    clearTimeout(this.detailTimer);
    this.detailTimer = window.setTimeout(() => {
      void this.loadDetail(view, pxPerDeg);
    }, 240);
  }

  private async loadDetail(view: LatLonBox, pxPerDeg: number): Promise<void> {
    if (this.detailBusy) return;
    this.detailBusy = true;
    try {
      const m = await buildMosaic(view, pxPerDeg, this.detailKey);
      if (!m) return;
      const gl = this.gl;
      const tex = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, m.canvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (this.detail) gl.deleteTexture(this.detail);
      this.detail = tex;
      this.detailBox = { west: m.west, south: m.south, east: m.east, north: m.north };
      this.detailKey = m.key;
    } catch (e) {
      console.error('küre arazi mozaiği yüklenemedi', e);
    } finally {
      this.detailBusy = false;
    }
  }

  private draw(): void {
    const gl = this.gl;
    const dpr = this.cv.width / Math.max(1, this.cv.getBoundingClientRect().width);
    gl.viewport(0, 0, this.cv.width, this.cv.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (this.ready && this.terrain) {
      gl.useProgram(this.prog);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.terrain);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.political[this.war] ?? this.terrain);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.detail ?? this.terrain);
      gl.uniform1f(this.loc['uDetailMix']!, this.detail ? 1 : 0);
      if (this.detailBox) {
        const b = this.detailBox;
        gl.uniform4f(this.loc['uDetailBox']!, b.west, b.south, b.east, b.north);
      }
      this.streamDetail();

      gl.uniform2f(this.loc['uRes']!, this.cv.width, this.cv.height);
      gl.uniform2f(this.loc['uCentre']!, this.cx * dpr, this.cy * dpr);
      gl.uniform1f(this.loc['uRadius']!, this.radius * dpr);
      gl.uniform1f(this.loc['uLon0']!, this.lon0 * D);
      gl.uniform1f(this.loc['uLat0']!, this.lat0 * D);
      // Siyasi maske 2048×932 — 5,7 px/derece. Dünya görünümünde doğru
      // araç ama yakınlaştırınca dev, merdiven kenarlı bloklara dönüşüp
      // altındaki detaylı araziyi tamamen örtüyor. Küre bir CEPHE SEÇİCİ:
      // uzakta kim nerede, yakında arazi. Karışım zoom'la söner, tamamen
      // kaybolmaz — sahiplik yine okunsun.
      const ppd = (this.radius * Math.PI) / 180;
      const k = Math.min(1, Math.max(0, Math.log2(ppd / 15) / Math.log2(8)));
      gl.uniform1f(this.loc['uPolMix']!, 1 - 0.82 * (k * k * (3 - 2 * k)));

      // Güneş kameranın hafif sol üstünden: terminatör hep kadrajda kalsın.
      const sl = (this.lon0 + 38) * D;
      const sp = 16 * D;
      gl.uniform3f(
        this.loc['uSun']!,
        Math.cos(sp) * Math.sin(sl),
        Math.sin(sp),
        Math.cos(sp) * Math.cos(sl),
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    this.drawPins();
  }

  private drawPins(): void {
    const g = this.octx;
    const rect = this.cv.getBoundingClientRect();
    g.clearRect(0, 0, rect.width, rect.height);
    this.pins = [];

    for (const t of THEATRES) {
      if (t.war !== this.war) continue;
      const p = this.project(t.pin[0], t.pin[1]);
      if (!p.vis) continue;
      this.pins.push({ t, x: p.x, y: p.y });

      const on = this.hovered?.id === t.id;
      const sel = this.selected?.id === t.id;
      const pulse = sel ? 1 + Math.sin(performance.now() / 420) * 0.18 : 1;
      const rad = (on ? 8 : sel ? 7 : 5) * pulse;

      g.beginPath();
      g.arc(p.x, p.y, rad + 7, 0, Math.PI * 2);
      g.fillStyle = on ? 'rgba(255,195,84,0.26)' : 'rgba(255,195,84,0.10)';
      g.fill();

      g.beginPath();
      g.arc(p.x, p.y, rad, 0, Math.PI * 2);
      g.fillStyle = '#ffc354';
      g.fill();
      g.strokeStyle = 'rgba(10,8,2,0.9)';
      g.lineWidth = 1.5;
      g.stroke();

      if (on) {
        const label = t.name.toLocaleUpperCase('tr-TR');
        g.font = '600 12px "JetBrains Mono", monospace';
        g.textAlign = 'center';
        const w = g.measureText(label).width;
        g.fillStyle = 'rgba(0,0,0,0.85)';
        g.fillRect(p.x - w / 2 - 8, p.y - rad - 28, w + 16, 20);
        g.strokeStyle = 'rgba(255,195,84,0.45)';
        g.lineWidth = 1;
        g.strokeRect(p.x - w / 2 - 8, p.y - rad - 28, w + 16, 20);
        g.fillStyle = '#ffc354';
        g.fillText(label, p.x, p.y - rad - 14);
      }
    }
  }

  // ───────────────────────────────────────────────────────── girdi ──

  private bind(): void {
    const el = this.overlay;
    el.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.spin = false;
      this.target = null;
      this.moved = 0;
      this.last = { x: e.offsetX, y: e.offsetY };
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointerup', (e) => {
      this.dragging = false;
      if (this.moved > 5) return;
      const hit = this.hitTest(e.offsetX, e.offsetY);
      if (hit) this.cb.onPick(hit);
    });

    el.addEventListener('pointerleave', () => {
      this.dragging = false;
      this.hovered = null;
      this.cb.onHover(null);
    });

    el.addEventListener('pointermove', (e) => {
      if (this.dragging) {
        const dx = e.offsetX - this.last.x;
        const dy = e.offsetY - this.last.y;
        this.moved += Math.abs(dx) + Math.abs(dy);
        // Derece/piksel SABİT 0,3 idi: yakınlaştırınca tek piksellik hareket
        // küreyi savuruyordu. Ortografik kürede merkezde bir ekran pikseli
        // 180/(π·R) dereceye denk gelir; bu değer kullanılınca imlecin
        // altındaki nokta imlecin altında kalır ve kaydırma zoom'la kendi
        // kendine ağırlaşır.
        const perPx = 180 / (Math.PI * this.radius);
        this.lon0 -= dx * perPx;
        this.lat0 = Math.max(-80, Math.min(80, this.lat0 + dy * perPx));
        this.last = { x: e.offsetX, y: e.offsetY };
        return;
      }
      const hit = this.hitTest(e.offsetX, e.offsetY);
      if (hit?.id !== this.hovered?.id) {
        this.hovered = hit;
        el.style.cursor = hit ? 'pointer' : 'grab';
        this.cb.onHover(hit);
      }
    });

    el.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.radius = this.clampRadius(this.radius * Math.exp(-e.deltaY * 0.0012));
      },
      { passive: false },
    );

    // İki parmakla yakınlaştırma — telefonda tekerlek yok ve küre
    // başlangıç boyutunda kalıyor; küçük cephe iğneleri ayırt edilemiyor.
    const dokunan = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    const mesafe = (): number => {
      const [a, b] = [...dokunan.values()];
      return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
    };
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return;
      dokunan.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (dokunan.size === 2) {
        pinch = mesafe();
        // Pinch sırasında döndürme olmasın; küre parmağın altından kaçıyor.
        this.dragging = false;
      }
    });
    el.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'touch' || !dokunan.has(e.pointerId)) return;
        dokunan.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (dokunan.size !== 2) return;
        const yeni = mesafe();
        if (pinch <= 0 || yeni <= 0) return;
        e.preventDefault();
        this.radius = this.clampRadius(this.radius * (yeni / pinch));
        pinch = yeni;
      },
      { passive: false },
    );
    const birak = (e: PointerEvent): void => {
      if (e.pointerType !== 'touch') return;
      dokunan.delete(e.pointerId);
      if (dokunan.size < 2) pinch = 0;
      if (dokunan.size === 1) this.dragging = false;
    };
    el.addEventListener('pointerup', birak);
    el.addEventListener('pointercancel', birak);
  }

  private hitTest(x: number, y: number): Theatre | null {
    let best: Theatre | null = null;
    let bestD = 17 * 17;
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
