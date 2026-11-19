# Hero güncellemesi — 12 Kasım 2026

SOLARA videosunun 8,2–9,6 saniyeleri kare kare incelendi. Detay görselinin bağımsız bir parça hâlinde kayarak arka plandaki aynı manzaraya yerleşmesi, ana sayfanın açılışına uyarlandı.

- Masaüstü hero yüksekliği 100 svh → 110 svh; mobil 108 svh.
- 1440 px genişlikte başlık 105,12 px → 136,8 px; 1920 px genişlikte 130 px → 172 px.
- Aynı WebP ve aynı kadrajı kullanan iki katman, parça yerleştiğinde piksel konumunu koruyor. Animasyon 1,8 saniye sürüyor; tamamlandığında fazladan katman gizleniyor.
- Sağ alttaki erişilebilir tekrar düğmesi animasyonu yeniden oynatıyor ve hero başlangıcına dönüyor. Ekran okuyucu adı altı dilde mevcut.
- Hareket azaltma tercihinde açılış animasyonu başlamıyor; CSS de animasyonu ve tekrar düğmesini kapatıyor. Bu davranış kod denetimiyle doğrulandı; işletim sistemi tercihi ayrıca değiştirilmedi.
- Yeni fotoğraf veya harici bağımlılık eklenmedi. Mevcut WebP, next/image ve öncelikli hero yüklemesi korundu.

## Doğrulama

- TypeScript kontrolü ve üretim derlemesi başarılı: `hero-build.log`.
- 360, 390, 768, 1440 ve 1920 px genişliklerde yatay taşma yok.
- Altı dilin tamamında 360 px mobil görünüm ortalı; başlık, açıklama ve düğmeler sığıyor.
- Birleşme ara karesi, bitişte parçanın gizlenmesi, tekrar düğmesi ve keşfet kaydırması tarayıcıda doğrulandı.
- Üretim sunucusunda **tek mobil Lighthouse örneği**: performans 100, erişilebilirlik 100, best practices 100, SEO 100. LCP 1,063 sn; TBT 45 ms; CLS 0,0232. Bu ölçüm üç çalıştırmanın medyanı değildir.
- Önceki tam site bağlantı denetimi yeniden çalıştırılmadı; bu değişiklik rota veya içerik bağlantısı eklemiyor.

Dosyalar: `hero-update-checks.json`, `lighthouse-hero-update-summary.json`, `screenshots/hero-update-desktop.png`, `screenshots/hero-update-merging.png`.
