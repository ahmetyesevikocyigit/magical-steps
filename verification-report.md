# Magical Steps — doğrulama ve teslim raporu

> **12 Kasım 2026 son güncellemesi:** Hero başlığı küçültüldü, destinasyonlar sol sütunda bağımsız kartlara taşındı. Mobil iki sütunlu kartlar ve birleşme akışı doğrulandı. Ayrıntılar [sol hero kartları raporunda](reports/hero-left-update.md). Önceki performans ölçümleri önceki sürümün kaydıdır.

11.11.2026 23:48 · Yerel üretim sunucusu: [http://127.0.0.1:3000](http://127.0.0.1:3000). İnternete dağıtım yapılmadı.

## Teslim edilen frontend

Next.js App Router, TypeScript, CSS Modules, next-intl ve Motion ile tam ekran açılış, destinasyonlar, filtreli katalog, animasyonlu detay pencereleri, doğrudan detay sayfaları, galeri, iletişim/talep akışı ve footer hazır. İngilizce kökte; Türkçe, Fransızca, Almanca, Hollandaca ve Rusça dil öneklerinde çalışır.

107 hizmet (66 tur, 32 otel, 5 gulet, 4 transfer), 39 kategori ve 39 kurumsal/harita yazısı bulunur. Arama, destinasyon, kategori ve sıralama URL'de; hizmet türü sayfa yolunda saklanır. Detaydan dönünce katalog durumu korunur. Dil seçimi aynı kayıt kimliğinin karşılığını açar.

Talep formu hizmet, tarih, kişi sayısı, ad, e-posta, hareket noktası ve mesajla e-posta taslağı oluşturur. Taslak kopyalanabilir veya kullanıcının e-posta uygulamasında açılabilir. Site mesaj göndermez, ödeme almaz, rezervasyon kaydı oluşturmaz.

## Derleme ve bağlantılar

- Üretim derlemesi ve TypeScript kontrolü başarılı: [build.log](reports/build.log).
- **2,584 HTTP kontrolü, 0 hata**: [ham bağlantı raporu](reports/link-audit.json).
- 1,140 sayfa/kategori adresi; 724 tek adımlı kalıcı **308** yönlendirme; 692 yerel WebP dosyası kontrol edildi.
- Sayfalarda dil, H1, başlık ve canonical varlığı denetlendi. Sitemap, robots, favicon, SVG otel illüstrasyonu ve keşfedilen ek iç bağlantılar doğrulandı.
- 12 yerel WOFF2 dosyası HTTP 200: [varlık kontrolü](reports/asset-checks.json).
- Kaynak URL envanteri: [CSV](reports/url-inventory.csv). İçerik kökeni: [içerik denetimi](content-audit.md).

## Lighthouse

Lighthouse 13.6.0, kurulu Google Chrome ve `next start` üretim sunucusu kullanıldı. Ana sayfada mobil ve masaüstü için ayrı ayrı üç ölçümün medyanı; katalogda üç mobil ölçümün medyanı alındı. Detay ve iletişim sonuçları birer ek mobil örneklemdir.

Mobil profil 412×823, DPR 1,75 ve Lighthouse mobil yavaşlatması; masaüstü profil 1350×940, DPR 1. Bunlar yerel laboratuvar ölçümleridir; yayımlanmış bir alan adının gerçek kullanıcı verisi değildir.

| Sayfa / profil       | Ölçüm | Performans | Erişilebilirlik | Best practices | SEO |
| -------------------- | ----: | ---------: | --------------: | -------------: | --: |
| Ana sayfa · mobil    |     3 |        100 |             100 |            100 | 100 |
| Ana sayfa · masaüstü |     3 |        100 |             100 |            100 | 100 |
| Tur kataloğu · mobil |     3 |         91 |             100 |            100 | 100 |
| Tur detayı · mobil   |     1 |         96 |             100 |            100 | 100 |
| İletişim · mobil     |     1 |        100 |             100 |            100 | 100 |

95 performans hedefine ulaşmayan sayfalar: Tur kataloğu · mobil: **91**. Bu sonuçlar tamamlanmış hedef olarak sunulmuyor.

| Sayfa / profil       |     LCP |     TBT |   CLS |
| -------------------- | ------: | ------: | ----: |
| Ana sayfa · mobil    | 1.06 sn | 15.5 ms | 0.008 |
| Ana sayfa · masaüstü | 0.30 sn |  0.0 ms | 0.000 |
| Tur kataloğu · mobil | 3.54 sn | 15.5 ms | 0.000 |
| Tur detayı · mobil   | 2.79 sn | 27.0 ms | 0.000 |
| İletişim · mobil     | 0.91 sn | 35.0 ms | 0.000 |

Ham ölçümler: [ana sayfa](reports/lighthouse-summary.json), [katalog](reports/lighthouse-catalog-summary.json), [detay](reports/lighthouse-detail-summary.json), [iletişim](reports/lighthouse-contact-summary.json). Tek tek Lighthouse JSON dosyaları aynı klasördedir. Mobil katalog için kalan temel hız açığı ilk büyük görselin boyanma süresidir. Katalog medyanı 91 ile 95 hedefinin altındadır; son tur detayı örneklemi 96 ile hedefi karşılar.

## Tarayıcı ve erişilebilirlik kontrolleri

- Altı dilde arama → destinasyon filtresi → animasyonlu detay → tarih/ad/e-posta ile taslak → kopyalama → filtreli kataloğa dönüş başarılı: [akış kayıtları](reports/ui-flow-checks.json).
- Altı dilde kategori seçimi doğru dil öneki ve kategori başlığıyla açılır: [kategori kayıtları](reports/category-checks.json).
- Otel, gulet ve transfer pencereleri; yenilemeyle doğrudan tam sayfa davranışı başarılı: [hizmet kayıtları](reports/service-checks.json).
- Altı dil arasında aynı turun adresi korunarak dil değiştirildi. İngilizce turda tarayıcı geri tuşu, filtre URL'si ve odak dönüşü doğrulandı.
- 360, 390, 768, 1440 ve 1920 piksel genişliklerde taşma, başlık/kart hizaları ve görsel kırpmalar incelendi: [ekran ölçümleri](reports/responsive-checks.json).
- Mobil menüde Shift+Tab odağı pencere içinde tutar. Escape kapanışı ve iç galeriyi kapatırken ürün penceresinin açık kalması kontrol edildi. Form etiketleri, görünür odak ve gerçek HTML başlıkları kullanıldı.
- Video açılmadan iframe sayısı 0; tıklayınca 1. Üçüncü taraf oynatıcı tıklamadan yüklenmez. Bu kontrol bütün dış videoların oynatılabildiği anlamına gelmez.
- Azaltılmış hareket için Motion tercihi ve CSS kuralları incelendi: büyüme, yakınlaşma ve bulanıklık kaldırılır. İşletim sistemi tercihi değiştirilerek ayrı bir tarayıcı oturumu çalıştırılmadı.
- Otomatik erişilebilirlik denetimi Lighthouse ile yapıldı; tam ekran okuyucu kullanıcı testi yapılmadı.

## Görsel optimizasyonu

Sharp kurulu; tekrar çalıştırılabilir komut `pnpm images:optimize`.

585 raster ana dosya WebP kalite 80'e dönüştürüldü: 78.866.798 → 42.816.254 bayt, **%45,7 tasarruf**. Ek olarak 107 kart kapağı üretildi; tam boy karşılıklarına göre **%48,6 daha küçük**. Kartlar önceden optimize edilmiş WebP olarak, diğer fotoğraflar Next Image boyutlandırmasıyla sunulur. Küçük kaynaklar dönüştürme sırasında büyütülmez; orijinaller çalışma alanının `work/media/originals` klasöründe korunur.

Kaynak/dosya boyutları ve istisnalar: [medya denetimi](media-audit.md), `src/data/media.json`, `src/data/thumbnails.json`. Fontlar ve OFL lisansları yereldir.

## İçerik ve çeviri sınırları

887 kaynak URL tarandı. Eski sitedeki boş tema, hata veya yanlış liste döndüren adresler raporlandı. Eski blog yazılarının kurtarılamayanları uydurulmadı; günlükte erişilebilen Efes yazıları sunulur. Dokuz otel fotoğrafı boş döndüğü için uygun yerlerde sade SVG illüstrasyon kullanılır.

Kaynakta çelişen fiyatlar korunur; otomatik fiyat hesabı veya kur dönüşümü yapılmaz. 1.110 dil/kayıt başlığı, 960 açıklama ve 840 gövde mevcuttur. Geçerli kaynak varken eksik bırakılan alan, değişmiş sayısal değer/para tutarı, bozuk yer tutucu ve HTML bağlantı farkı denetimlerinde hata bulunmadı.

Eksik uzun programlar, bazı açıklamalar ve yasal metinler **makine destekli çevrildi**. Bütün metinler altı dilde bir insan editör tarafından incelenmiş değildir. Yayın öncesinde içeriklerin güncelliği ve uzun çevirilerin dil kalitesi işletme tarafından gözden geçirilmelidir. Ayrıntı: [yerelleştirme denetimi](localization-audit.md).

## Çalıştırma ve ekran kayıtları

[README](README.md) ve [Mac başlatma dosyası](start-local.command) projeyle birlikte teslim edilir. Uygulamanın üretim sunucusu yalnızca `127.0.0.1:3000` üzerinde açık bırakılmıştır.

![Masaüstü ana sayfa](reports/screenshots/home-desktop-1440.png)

[Mobil ana sayfa](reports/screenshots/home-mobile-390.png) · [Detay penceresi](reports/screenshots/detail-desktop-1440.png) · [Mobil footer](reports/screenshots/footer-mobile-390.png)
