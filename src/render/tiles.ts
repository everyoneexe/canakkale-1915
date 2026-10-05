import { Container, Sprite, Texture } from 'pixi.js';
import { BASE_PX_PER_DEG, buildMosaic } from './terrain-mosaic.ts';
import type { LatLonBox } from './terrain-mosaic.ts';

/**
 * Çalışma anında arazi karosu akışı — Çanakkale haritası katmanı.
 *
 * Paketteki `world-relief` 11 px/derece (~10 km/piksel); yakınlaştırınca
 * bulanık bir lekeye dönüşüyor. Görünen pencere için `terrain-mosaic`
 * tek bir gölgelendirilmiş görüntü üretir, burada sprite olarak serilir.
 * Aynı üretici küreyi de besler, böylece iki yüzey aynı parlaklıkta.
 */
export class TerrainTiles {
  private readonly layer = new Container();
  private current: Sprite | null = null;
  private lastKey = '';
  private timer: number | undefined;
  private busy = false;

  constructor(
    parent: Container,
    private readonly origin: { lat: number; lon: number },
  ) {
    parent.addChild(this.layer);
  }

  /**
   * Görünen pencereyi bildir. Çağrı ucuzdur: gerçek iş zoom/kaydırma
   * durulduktan sonra bir kez yapılır.
   *
   * @param view     görünen alan, derece cinsinden
   * @param pxPerDeg ekranda boylam derecesi başına piksel
   */
  request(view: LatLonBox, pxPerDeg: number): void {
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => void this.build(view, pxPerDeg), 220);
  }

  private async build(view: LatLonBox, pxPerDeg: number): Promise<void> {
    if (this.busy) return;
    if (pxPerDeg <= BASE_PX_PER_DEG * 1.3) {
      // Zemin dokusu zaten yetiyor: akan katmanı kaldır.
      this.clear();
      return;
    }
    this.busy = true;
    try {
      const m = await buildMosaic(view, pxPerDeg, this.lastKey);
      if (!m) return;
      const o = this.origin;
      const kx = Math.cos((o.lat * Math.PI) / 180) * 111320;
      const ky = 110574;
      const sp = new Sprite(Texture.from(m.canvas));
      sp.x = (m.west - o.lon) * kx;
      sp.y = -(m.north - o.lat) * ky;
      sp.width = (m.east - m.west) * kx;
      sp.height = (m.north - m.south) * ky;
      this.swap(sp);
      this.lastKey = m.key;
    } catch (e) {
      console.error('arazi karoları yüklenemedi', e);
    } finally {
      this.busy = false;
    }
  }

  private swap(sprite: Sprite): void {
    const old = this.current;
    this.layer.addChild(sprite);
    this.current = sprite;
    if (old) {
      this.layer.removeChild(old);
      old.destroy({ texture: true });
    }
  }

  private clear(): void {
    if (!this.current) return;
    this.layer.removeChild(this.current);
    this.current.destroy({ texture: true });
    this.current = null;
    this.lastKey = '';
  }
}
