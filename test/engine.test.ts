import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import { loadMap, prov, provinceDist, provinces } from '../src/core/geo.ts';
import { aggregate } from '../src/data/battalions.ts';
import { TERRAINS } from '../src/data/terrain.ts';
import { MINEFIELDS } from '../src/data/minefields.ts';
import { FORTS } from '../src/data/forts.ts';
import { GUN_BY_ID } from '../src/data/guns.ts';
import { dayOf, newGame } from '../src/engine/scenario.ts';
import { endTurn } from '../src/engine/turn.ts';
import { CRIPPLED_HULL, liveShips, minefieldsIn, resolveNavalFire } from '../src/engine/naval.ts';
import { computeSupply } from '../src/engine/supply.ts';
import { Rng } from '../src/engine/rng.ts';
import {
  effectiveFirepower,
  pierceFactor,
  templateStats,
} from '../src/engine/combat.ts';
import { THEATRES } from '../src/data/theatres.ts';
import { newWorldGame } from '../src/engine/world-scenario.ts';
import { issueLandOrder } from '../src/engine/orders.ts';
import { FRONT_PACKS } from '../src/data/fronts/index.ts';
import { TEMPLATE_BY_ID } from '../src/data/templates.ts';
import { TRAITS } from '../src/data/commanders.ts';
import { NATIONS } from '../src/data/world1914.ts';
import { NATIONS_WW2 } from '../src/data/world1939.ts';

/**
 * Bu dosyadaki her test, geliştirme sırasında FİİLEN yaşanmış bir hatayı
 * yeniden yakalamak için var. Hiçbiri "fonksiyon çağrılıyor mu" testi değil.
 */

// Harita artık tekil değil; her şeyden önce yüklenmeli.
before(async () => {
  await loadMap('canakkale');
});

describe('harita verisi', () => {
  it('her ilin en az bir komşusu var', () => {
    for (const p of provinces()) {
      assert.ok(p.neighbours.length > 0, `${p.id} komşusuz`);
    }
  });

  it('komşuluk simetrik', () => {
    for (const p of provinces()) {
      for (const n of p.neighbours) {
        assert.ok(
          prov(n).neighbours.includes(p.id),
          `${p.id} -> ${n} tek yönlü`,
        );
      }
    }
  });

  it('kara illeri deniz arazisi taşımaz', () => {
    for (const p of provinces()) {
      const prof = TERRAINS[p.terrain];
      assert.ok(prof, `${p.id}: bilinmeyen arazi ${p.terrain}`);
      assert.equal(prof.isSea, p.isSea, `${p.id} arazi/ortam uyumsuz`);
    }
  });

  it('Dar Boğaz tarihsel genişliğiyle uyumlu (1500 m ± 400)', () => {
    // Yükseklik verisinden ölçülen 1,40 km; kaynaklarda 1.600 yarda (1.500 m).
    const w = prov('d_dar_bogaz').straitWidth;
    assert.ok(w !== undefined && Math.abs(w - 1500) <= 400, `ölçülen ${w}`);
  });
});

describe('tarihsel veri bütünlüğü', () => {
  it('18 Mart öncesi 11 mayın hattı ve 403 mayın', () => {
    assert.equal(MINEFIELDS.length, 11);
    assert.equal(
      MINEFIELDS.reduce((n, m) => n + m.mines, 0),
      403,
    );
  });

  it('Nusret hattı 8 Mart 1915, 26 mayın', () => {
    const n = MINEFIELDS.find((m) => m.id === 'hat_11_nusret');
    assert.ok(n);
    assert.equal(n.mines, 26);
    assert.equal(n.laidOn, '1915-03-08');
  });

  it('her tabyanın topu tanımlı', () => {
    for (const f of FORTS) {
      const ids = Object.keys(f.guns);
      assert.ok(ids.length > 0, `${f.id} topsuz`);
      for (const g of ids) {
        assert.ok(GUN_BY_ID[g], `${f.id}: bilinmeyen top ${g}`);
      }
    }
  });

  it('yaklaşık konumlu tabyalar gerekçe taşır', () => {
    for (const f of FORTS) {
      if (!f.approx) continue;
      assert.ok(f.posNote && f.posNote.length > 40, `${f.id} posNote eksik`);
    }
  });

  it('cephe paketlerindeki bütün başvurular gerçek', () => {
    // Paket verisi METİNLE başvuruyor: şablon kimliği, ulus kimliği,
    // komutan özelliği. Hiçbirini tsc denetleyemez ve üçü de sessizce
    // bozulur: bilinmeyen şablon tur ortasında istisna atar, aralık dışı
    // olay HİÇ ateşlenmez, bilinmeyen özellik hiçbir şey yapmaz.
    // Bu test yazıldığında üç gerçek hata yakaladı.
    const ww1 = new Set(NATIONS.map((n) => n.id));
    const ww2 = new Set(NATIONS_WW2.map((n) => n.id));
    const sorun: string[] = [];

    for (const p of Object.values(FRONT_PACKS)) {
      const th = THEATRES.find((t) => t.id === p.theatre);
      assert.ok(th, `paket kayıtsız tiyatroya bağlı: ${p.theatre}`);
      const uluslar = th!.war === 'ww2' ? ww2 : ww1;

      for (const f of p.formations) {
        if (!TEMPLATE_BY_ID[f.templateId]) {
          sorun.push(`${p.theatre}: bilinmeyen şablon ${f.templateId} (${f.name})`);
        }
        if (!uluslar.has(f.nation)) {
          sorun.push(`${p.theatre}: bilinmeyen ulus ${f.nation} (${f.name})`);
        }
        if (f.arrivesOn && (f.arrivesOn < th!.start || f.arrivesOn > th!.end)) {
          sorun.push(`${p.theatre}: ${f.name} cephe dışında varıyor (${f.arrivesOn})`);
        }
      }
      for (const c of p.commanders) {
        for (const t of c.traits) {
          if (!TRAITS[t]) sorun.push(`${p.theatre}: bilinmeyen özellik ${t} (${c.name})`);
        }
      }
      for (const e of p.events) {
        if (e.date < th!.start || e.date > th!.end) {
          sorun.push(`${p.theatre}: ${e.id} cephe dışında (${e.date}, ${th!.start}..${th!.end})`);
        }
        if (!e.src) sorun.push(`${p.theatre}: ${e.id} kaynaksız`);
      }
    }
    assert.deepEqual(sorun, []);
  });

  it('komutan kimlikleri bütün cephelerde benzersiz', () => {
    // Aynı kişi birden çok cephede olabilir (Rommel üç cephede) ama
    // kimlikler çakışırsa komutan kaydı sessizce üzerine yazılır.
    const gorulen = new Map<string, string>();
    const cakisan: string[] = [];
    for (const p of Object.values(FRONT_PACKS)) {
      for (const c of p.commanders) {
        const onceki = gorulen.get(c.id);
        if (onceki) cakisan.push(`${c.id}: ${onceki} ve ${p.theatre}`);
        else gorulen.set(c.id, p.theatre);
      }
    }
    assert.deepEqual(cakisan, []);
  });
});

describe('deniz harbi', () => {
  it('kıyı topçusu gemi BATIRMAZ, savaş dışı bırakır', () => {
    // 18 Mart'ta dört gemi savaş dışı kaldı, hiçbiri tabya ateşiyle batmadı.
    const s = newGame('ottoman');
    const fleet = s.fleets['uk_hat_a']!;
    fleet.location = 'd_dar_bogaz';
    fleet.order = { kind: 'bombardiman', target: 'd_dar_bogaz', path: [] };
    const rng = new Rng(1);
    for (let i = 0; i < 120; i++) {
      resolveNavalFire(s, rng);
      for (const f of Object.values(s.forts)) f.ammo = f.maxAmmo;
    }
    for (const sh of fleet.ships) {
      assert.ok(sh.hull > 0, `${sh.name} tabya ateşiyle battı`);
      assert.ok(sh.hull <= CRIPPLED_HULL, `${sh.name} hiç yıpranmadı`);
    }
  });

  it('tabya hasarı filo büyüklüğüyle çarpılmaz, PAYLAŞILIR', () => {
    // Hata: günlük hasar bütçesi gemi sayısıyla çarpılıyordu; 15 tekneli
    // tarama filosu 15 kat hasar alıp iki günde yok oluyordu.
    //
    // Doğru davranış: tabyaların günlük çıktısı sabittir, filoya PAYLAŞTIRILIR.
    // Yani filo büyüdükçe TOPLAM hasar sabit kalır, gemi BAŞINA hasar düşer.
    // (Gemi başına tavan 1 gemilik filoda bağlayıcı olduğu için karşılaştırma
    //  tavanın bağlamadığı iki büyük filo arasında yapılır.)
    const run = (count: number): { total: number; perShip: number } => {
      const s = newGame('ottoman');
      const f = s.fleets['uk_hat_a']!;
      const model = f.ships[1]!; // HMS Agamemnon — pre-dretnot
      f.ships = Array.from({ length: count }, (_, i) => ({
        ...model,
        id: `t${i}`,
        name: `Test ${i}`,
      }));
      f.location = 'd_dar_bogaz';
      f.order = { kind: 'bombardiman', target: 'd_dar_bogaz', path: [] };
      resolveNavalFire(s, new Rng(7));
      const total = f.ships.reduce((n, sh) => n + (1 - sh.hull), 0);
      return { total, perShip: total / count };
    };

    const six = run(6);
    const eighteen = run(18);
    assert.ok(six.total > 0.2, `hasar yok: ${six.total}`);
    // Toplam hasar aynı bütçeden gelir — gemi sayısı üç katına çıkınca
    // toplam en fazla biraz oynar, üç katına ÇIKMAZ.
    assert.ok(
      eighteen.total < six.total * 1.5,
      `6 gemi toplam ${six.total.toFixed(3)}, 18 gemi ${eighteen.total.toFixed(3)}`,
    );
    // Ve gemi başına hasar belirgin biçimde düşer.
    assert.ok(
      eighteen.perShip < six.perShip * 0.6,
      `gemi başına 6:${six.perShip.toFixed(3)} 18:${eighteen.perShip.toFixed(3)}`,
    );
  });

  it('maliyeti bir günlük bütçeyi aşan ilk adımda filo kilitlenmez', () => {
    // Hata: ilk sıçrama 42.400 m, bütçe 42.000 m -> filo sonsuza dek durdu.
    const s = newGame('ottoman');
    const f = s.fleets['uk_hat_c']!;
    f.location = 'd_ege_acik';
    const from = f.location;
    // Tek sıçramada en pahalı komşuyu hedefle.
    const costly = prov(from).neighbours
      .filter((n) => prov(n).isSea)
      .sort((a, b) => provinceDist(from, b) - provinceDist(from, a))[0]!;
    f.order = { kind: 'seyret', target: costly, path: [costly] };
    endTurn(s);
    assert.notEqual(s.fleets['uk_hat_c']!.location, from, 'filo hiç ilerlemedi');
  });

  it('gelecekte dökülecek mayın hattı bugün suda değil', () => {
    const s = newGame('ottoman');
    const nusret = s.minefields['hat_11_nusret']!;
    assert.ok(nusret.laidOn > 0, 'Nusret hattı senaryo başında aktif');
    assert.ok(
      !minefieldsIn(s, nusret.province).some((m) => m.id === 'hat_11_nusret'),
      '8 Mart hattı 19 Şubat günü etkin',
    );
  });

  it('Nusret hattı İtilaf tarafından görülmemiş, Kepez hatları görülmüş', () => {
    const s = newGame('ottoman');
    assert.equal(s.minefields['hat_11_nusret']!.spotted, false);
    assert.equal(s.minefields['hat_1']!.spotted, true);
  });
});

describe('ikmal', () => {
  it('tartışmalı sahildeki köprübaşı denizden beslenir', () => {
    // Hata: çıkarma yapan birlik il hâlâ düşman kontrolünde olduğu için
    // %0 ikmalle kalıp eriyordu.
    const s = newGame('ottoman');
    const u = s.landUnits['uk_tumen_29']!;
    u.embarkedIn = null;
    u.location = 'kumkale';
    assert.equal(s.provinces['kumkale']!.controller, 'ottoman');
    const { capacity } = computeSupply(s);
    assert.ok(
      capacity['kumkale']!.entente > 0,
      'köprübaşına denizden ikmal akmıyor',
    );
  });
});

describe('kampanya', () => {
  it('başlangıç durumu tutarlı', () => {
    const s = newGame('ottoman');
    assert.equal(s.day, 0);
    assert.equal(s.date, '1915-02-19');
    assert.equal(Object.keys(s.forts).length, FORTS.length);
    for (const f of Object.values(s.fleets)) {
      assert.ok(prov(f.location).isSea, `${f.id} karada`);
    }
  });

  it('varışı sonraki tarihte olan hava filosu sahada değil', () => {
    const s = newGame('ottoman');
    const late = s.airWings['uk_bombardiman']!;
    assert.equal(late.planes, 0, 'Temmuz filosu Şubat günü sahada');
    const early = s.airWings['os_hava_bolugu']!;
    assert.ok(early.planes > 0);
  });

  it('aynı tohum aynı sonucu verir (deterministik)', () => {
    const play = (): string => {
      const s = newGame('ottoman', 4242);
      for (let i = 0; i < 40; i++) endTurn(s);
      return JSON.stringify({
        gun: s.day,
        osm: s.sides.ottoman.morale,
        ent: s.sides.entente.morale,
        gemi: Object.values(s.fleets).reduce((n, f) => n + liveShips(f).length, 0),
        mayin: Object.values(s.minefields).reduce((n, m) => n + m.mines, 0),
      });
    };
    assert.equal(play(), play());
  });

  it('kampanya sonuna kadar çöküp kilitlenmeden oynanır', () => {
    const s = newGame('ottoman');
    let guard = 0;
    while (!s.outcome && guard++ < 400) endTurn(s);
    assert.ok(s.outcome, 'kampanya bitmedi');
    assert.ok(s.day <= dayOf('1916-01-09') + 1, `gün ${s.day}`);
  });

  it('tarihsel çıkarma gününden önce İtilaf karaya çıkmaz', () => {
    const s = newGame('ottoman');
    const landing = dayOf('1915-04-25');
    while (s.day < landing) {
      endTurn(s);
      for (const u of Object.values(s.landUnits)) {
        if (u.side !== 'entente' || u.embarkedIn || u.strength <= 0) continue;
        assert.ok(
          prov(u.location).isSea === false &&
            (u.location === 'bozcaada' || u.location === 'gokceada'),
          `${u.name} ${s.date} günü ${u.location} ilinde — çıkarmadan önce`,
        );
      }
    }
  });

  it('bir günlük yoldan uzun yürüyüş birkaç günde tamamlanır', () => {
    // Hata: `moveProgress` birikiyor ama HİÇ KULLANILMIYOR ve 0.95'te
    // tavanlanıyordu. Günlük yolu (9 km) aşan her adım sonsuza kadar
    // yarım kalıyordu. Çanakkale'de Gelibolu -> Kireçtepe adımı 74 km
    // eşdeğer; o yürüyüş hiç bitmiyordu. Dünya haritasında komşular
    // medyan 65 km olduğu için orada kara birlikleri hiç yürüyemiyordu.
    const s = newGame('ottoman');
    const u = Object.values(s.landUnits).find(
      (x) => x.side === 'ottoman' && !x.embarkedIn,
    )!;
    u.location = 'gelibolu';
    const hedef = 'kirectepe';
    const km =
      (provinceDist('gelibolu', hedef) * TERRAINS[prov(hedef).terrain].moveCost) / 1000;
    assert.ok(km > 9, `adım ${km.toFixed(0)} km — günlük yoldan kısa, hata yakalanmaz`);

    let gun = 0;
    for (; gun < 25 && u.location !== hedef; gun++) {
      u.order = { kind: 'yuru', target: hedef, path: [hedef] };
      endTurn(s);
    }
    assert.equal(u.location, hedef, `${gun} günde Gelibolu -> Kireçtepe bitmedi`);
    // Tek günde ışınlanmamalı: yol gerçekten günlere yayılmalı.
    assert.ok(gun >= 3, `yürüyüş ${gun} günde bitti — çok hızlı`);
  });
});

describe('çıkarma', () => {
  /**
   * Hedefe üç birlik bindirip bir tur çevirir; kaybı ve raporu döndürür.
   * Deniz desteği her çağrıda aynı kaldığı için tahkimat karşılaştırması
   * geçerli olur.
   */
  function cikar(fortLevel: number) {
    const s = newGame('entente', 99);
    const hedef = 'seddulbahir';
    const def = Object.values(s.landUnits).find(
      (u) => u.side === 'ottoman' && !u.embarkedIn,
    )!;
    def.location = hedef;
    def.entrenchment = 4;
    s.provinces[hedef]!.fortLevel = fortLevel;
    s.provinces[hedef]!.controller = 'ottoman';

    const filo = Object.values(s.fleets).find((f) => f.side === 'entente')!;
    const binen = Object.values(s.landUnits)
      .filter((u) => u.side === 'entente')
      .slice(0, 3);
    for (const u of binen) {
      u.embarkedIn = filo.id;
      u.location = filo.location;
      u.order = { kind: 'cikarma', target: hedef, path: [] };
      filo.embarked.push(u.id);
    }
    const once = binen.map((u) => u.strength);
    endTurn(s);
    const rapor = s.reports.find((r) => r.title.includes('çıkarma'));
    const kayip = binen.reduce((n, u, i) => n + (once[i]! - u.strength), 0);
    return { s, rapor, kayip, binen };
  }

  it('sahile sığmayan birlik gemide kalır, ertesi gün ikinci dalga olur', () => {
    // Eskiden bütün ordu tek günde karaya yığılabiliyordu; köprübaşı
    // sorunu — Gelibolu'nun da Normandiya'nın da şeklini veren sorun —
    // oyunda hiç yoktu.
    const { rapor, binen } = cikar(0);
    assert.ok(rapor, 'çıkarma raporu yok');
    const karada = binen.filter((u) => !u.embarkedIn);
    const gemide = binen.filter((u) => u.embarkedIn);
    assert.ok(karada.length >= 1, 'hiç birlik karaya çıkmadı');
    assert.ok(gemide.length >= 1, 'üç tümenin üçü de dar koya tek günde sığdı');
    assert.ok(
      rapor!.lines.some((l) => l.includes('sığmadı')),
      'ikinci dalga oyuncuya söylenmiyor',
    );
    // Gemide kalan emrini korumalı, yoksa ikinci dalga hiç gelmez.
    assert.equal(gemide[0]!.order?.kind, 'cikarma');
  });

  it('sahil tahkimatı çıkarma kaybını artırır ve 2. seviyede doymaz', () => {
    // Kayıp tavanı sabit %40 iken 2. seviye tahkimat tavanı doyuruyordu:
    // betonarme sahil ile tel örgülü sahil aynı kayıbı veriyordu.
    const a = cikar(0).kayip;
    const b = cikar(2).kayip;
    const c = cikar(4).kayip;
    assert.ok(b > a * 1.2, `tahkimat 2 (${b}) tahkimatsızdan (${a}) belirgin fazla değil`);
    assert.ok(c > b * 1.2, `tahkimat 4 (${c}) tahkimat 2'den (${b}) belirgin fazla değil`);
  });

  it('köprübaşı ayağının altındaki ile taarruz edebilir', () => {
    // Hata: taarruz hedefi yalnız KOMŞU il olabiliyordu. Karaya çıkan
    // birlik düşmanla AYNI ilin içindedir; emri ne oyuncu verebiliyor
    // ne de yapay zekâ. Köprübaşı kumsalda sonsuza kadar oturuyordu —
    // Pasifik'te 150 turda 293 çıkarma yapılıyor, tek ada alınmıyordu.
    const s = newGame('entente', 5);
    const il = 'seddulbahir';
    const def = Object.values(s.landUnits).find(
      (u) => u.side === 'ottoman' && !u.embarkedIn,
    )!;
    def.location = il;
    const atk = Object.values(s.landUnits).find((u) => u.side === 'entente')!;
    atk.embarkedIn = null;
    atk.location = il;
    s.provinces[il]!.controller = 'ottoman';

    // Emir kabul edilmeli.
    const hata = issueLandOrder(s, atk.id, 'taarruz', il);
    assert.equal(hata, null, `emir reddedildi: ${hata}`);

    endTurn(s);
    const rapor = s.reports.find(
      (r) => r.province === il && r.title.includes('muharebe'),
    );
    assert.ok(rapor, 'köprübaşı taarruzu hiç çözülmedi');
  });
});

describe('zırh', () => {
  it('1915 şablonlarının hiçbirinde zırh yok — zırh kuralı o cepheye hiç dokunmaz', () => {
    // Zırh/delme eklenirken asıl risk Çanakkale dengesini bozmaktı.
    for (const id of [
      'os_piyade_tumen',
      'os_suvari_tugay',
      'uk_piyade_tumen',
      'uk_deniz_tumen',
      'anzac_tumen',
      'fr_piyade_tumen',
    ]) {
      const s = templateStats(id);
      assert.equal(s.armour, 0, `${id} zırhlı çıktı`);
      assert.equal(s.hardness, 0, `${id} sert hedef sayılıyor`);
    }
    // Zırhsız savunana karşı delme çarpanı daima tam.
    assert.equal(pierceFactor(0, 0), 1);
    assert.equal(pierceFactor(0, 99), 1);
  });

  it('delme zırhın altına düştükçe ateş yarıya iner, aşınca tam etki eder', () => {
    assert.equal(pierceFactor(20, 20), 1, 'eşit delme tam etki etmeli');
    assert.equal(pierceFactor(20, 40), 1, 'fazla delme tam etkiyi aşmamalı');
    assert.equal(pierceFactor(20, 10), 0.5, 'yarı delme yarı etki');
    assert.equal(pierceFactor(20, 2), 0.5, 'taban 0.5 altına inmemeli');
    const mid = pierceFactor(20, 15);
    assert.ok(mid > 0.5 && mid < 1, `ara değer ${mid}`);
  });

  it('sert hedefe yumuşak ateş işlemez, zırhlı ateş işler', () => {
    // Tamamen yumuşak hedef: yalnız softAttack sayılır.
    assert.equal(effectiveFirepower(100, 10, 0), 100);
    // Tamamen zırhlı hedef: yalnız hardAttack sayılır.
    assert.equal(effectiveFirepower(100, 10, 1), 10);
    // Yarı sert: ikisinin ortası.
    assert.equal(effectiveFirepower(100, 10, 0.5), 55);
  });

  it('tanksavarı olmayan 1941 tüfek tümeni T-34 zırhını delemez, 1943 tümeni deler', () => {
    // Hata sınıfı: delme düz ortalama alınırsa tüfekler tanksavarı yutar ve
    // hiçbir piyade tümeni tank deleemez; saf "en iyi silah" alınırsa tek
    // tanksavar taburu koca tank kolordusunu durdurur.
    const t34 = templateStats('su_tank_kolordu').armour;
    assert.ok(t34 > 0, 'tank kolordusunun zırhı yok');
    const yil41 = templateStats('su_tufek_tumen').piercing;
    const yil43 = templateStats('su_tufek_tumen_43').piercing;
    assert.ok(yil41 < t34, `1941 tümeni (${yil41}) T-34 zırhını (${t34}) deliyor`);
    assert.ok(yil43 > t34, `1943 tümeni (${yil43}) T-34 zırhını (${t34}) delemiyor`);
    assert.ok(
      pierceFactor(t34, yil41) < pierceFactor(t34, yil43),
      'tanksavar eklemek hiçbir şeyi değiştirmedi',
    );
  });

  it('tümene tek tank taburu eklemek onu zırhlı yapmaz', () => {
    // Zırh toplanırsa bir tank taburu tümeni yenilmez kılardı; ortalama alınır.
    const tek = aggregate({
      id: 'x',
      name: 'x',
      nation: 'alman',
      battalions: { piyade: 9, makineli: 3, tank_orta: 1 },
    });
    const saf = aggregate({
      id: 'y',
      name: 'y',
      nation: 'alman',
      battalions: { tank_orta: 6 },
    });
    assert.ok(
      tek.armour < saf.armour * 0.4,
      `tek tanklı tümen ${tek.armour}, saf tank ${saf.armour}`,
    );
    assert.ok(tek.hardness < 0.3, `sertlik ${tek.hardness}`);
  });
});

/**
 * Dünya haritası testleri EN SONDA: `loadMap` küresel durumu değiştirir,
 * bundan sonra Çanakkale testleri çalışmaz.
 */
describe('dünya haritası', () => {
  const kafkas = THEATRES.find((t) => t.id === 'ww1_kafkas')!;

  before(async () => {
    await loadMap('dunya', kafkas.bbox);
  });

  it('başkenti haritanın dışında kalan cephede de ikmal merkezi var', () => {
    // Hata: ikincil depolar başkent kontrolünün İÇİNDEydi. Kafkas bbox'ında
    // ne İstanbul ne Petrograd var, bu yüzden haritada SIFIR ikmal merkezi
    // kuruluyordu; 21 tarihsel tümenin 20'si beşinci günde %0 ikmaldeydi.
    const s = newWorldGame('entente', 7, kafkas);
    const hubs = provinces().filter((p) => p.supplyHub > 0);
    assert.ok(hubs.length > 0, 'cephede hiç ikmal merkezi yok');
    const sides = new Set(hubs.map((h) => s.provinces[h.id]?.controller));
    assert.ok(sides.has('ottoman'), 'Osmanlı tarafının deposu yok');
    assert.ok(sides.has('entente'), 'Rus tarafının deposu yok');
  });

  it('pakette yazılı tümenler ikmalsiz kalmıyor', () => {
    const s = newWorldGame('entente', 7, kafkas);
    for (let i = 0; i < 5; i++) endTurn(s);
    const pack = Object.values(s.landUnits).filter(
      (u) => u.id.startsWith('pk_') && !u.embarkedIn,
    );
    assert.ok(pack.length > 10, `paket birliği ${pack.length}`);
    const dry = pack.filter((u) => u.supplied < 0.1);
    assert.ok(
      dry.length < pack.length / 2,
      `${pack.length} tümenin ${dry.length} tanesi ikmalsiz`,
    );
  });

});
