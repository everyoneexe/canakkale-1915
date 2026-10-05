import type { HistoricalEvent, Side } from '../core/types.ts';

/**
 * Kampanya açılış brifingi.
 *
 * Oyun bugüne kadar oyuncuyu haritaya bırakıp "TURU BİTİR" diyordu: ne
 * durumda olduğu, neyi kazanmaya çalıştığı ve mekaniğin hangi kısıta
 * dayandığı hiçbir yerde yazmıyordu. Mekanik doğru modellenmiş olsa bile
 * anlatılmayan bir kısıt öğretmez.
 *
 * Brifing olay kartı altyapısını kullanır: kampanya başlarken kuyruğun
 * başına konur, kaynak bağlantısı kartın altında çıkar.
 */

const COMU =
  'https://canakkalesavaslari.comu.edu.tr/canakkale-savaslari-kronolojisi.html';

const OTTOMAN = `Boğazı 403 mayın, yetmiş kadar sabit top ve hareketli obüs \
bataryaları savunuyor. Sayı sende değil: Birleşik Filo'nun karşısına \
çıkacak bir donanman yok ve cephanen "ancak tek bir ciddi saldırıyı \
karşılamaya" yetiyor.

Kazandıran şey döngü: TABYALAR tarayıcıları kovalar, tarayıcılar \
temizleyemeyince MAYIN HATLARI yerinde kalır, mayınlar durdukça zırhlılar \
Dar Boğaz'a giremez. Üç halkadan biri kopar kopmaz boğaz geçilir.

Bu yüzden ağır tabyalarını gereksiz düelloda tüketme; asıl işi mayın \
hatlarına ve hareketli obüslere yaptır. Tarayıcılar ateş altında \
çalışamıyor — tabyan susarsa tarama başlar.

Harita modlarından MAYIN'a bas: her hattın ne zaman, hangi gemiyle \
döküldüğünü ve üstünde kaç mayın kaldığını görürsün.`;

const ENTENTE = `İstanbul'a giden yol boğazdan geçiyor. Elinde 16 zırhlı ve \
yüz parçalık bir donanma var; karşında modern bir filo yok. Buna rağmen iş \
kolay değil.

Sorun şu: zırhlıları mayın hatlarının üstüne süremezsin, önce taranmaları \
gerekir. Tarayıcılar silahsız balıkçı teknesi ve mürettebatı sivil — tabya \
ateşi altında çalışmıyorlar. Üstelik boğazın 4 knotlık akıntısı 9 knotlık \
tekneleri neredeyse yerinde sayduruyor.

Yani önce tabyaları SUSTURACAKSIN, sonra tarayacaksın, sonra geçeceksin. \
Tabyaları betondan yıkmak zor; işe yarayan şey onları bastırıp tarama \
penceresi açmak.

Dikkat: taranmamış tek bir hat bütün planı bitirir. Tarihte Erenköy \
Körfezi'nde gözden kaçan hat 18 Mart'ta üç zırhlıya mal oldu.`;

export function briefingFor(side: Side, day: number, date: string): HistoricalEvent {
  const ottoman = side === 'ottoman';
  return {
    id: `brifing_${side}`,
    day,
    date,
    title: ottoman ? 'Boğaz Savunması — Durum' : 'Boğazı Zorlamak — Durum',
    body: ottoman ? OTTOMAN : ENTENTE,
    kind: 'siyasi',
    src: COMU,
  };
}
