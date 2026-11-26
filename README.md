# Magical Steps — Next.js seyahat sitesi

Altı dilde tur, otel, gulet ve transfer kataloğu. Tam ekran destinasyon seçimi, tur bulucu, bağımsız detay sayfaları ve e-posta taslağı hazırlayan talep formu içerir. Ödeme, üyelik ve yönetim paneli bu aşamanın kapsamında değildir.

Canlı önizleme: https://magical-steps.vercel.app

## Çalıştırma

Node.js 22+ ve pnpm 11 gerekir. Bu bilgisayarda Node 24 ile doğrulandı.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Önizleme: http://127.0.0.1:3000

Üretim modu:

```sh
pnpm build
pnpm start
```

Mac üzerinde `start-local.command` dosyası da kullanılabilir. Yerel sunucu yalnızca loopback adresinde dinler. Uygulamayı çalıştırmak için API anahtarı veya `.env` dosyası gerekmez.

## İçerik ve diller

- İngilizce kökte; Türkçe `/tr`, Fransızca `/fr`, Almanca `/de`, Hollandaca `/nl`, Rusça `/ru` altında.
- 107 hizmet: 66 tur, 32 otel, 5 gulet, 4 transfer. 39 kategori ve 39 kurumsal/harita yazısı.
- Kaynak bilgiler `src/data/catalog.json`, çeviri tamamlamaları `translation-overrides.json`, arayüz metinleri `messages.json` içinde. Eksik uzun içerikler çevrimdışı makine çevirisiyle tamamlandı; kapsam, sayı/bağlantı bütünlüğü ve editoryal inceleme sınırı `localization-audit.md` dosyasında.
- `src/data/legacy.json` eski yolları yeni içeriklere bağlar. Kaynak envanteri `reports/url-inventory.csv` içindedir.
- Eski sitede bazı sayfalar boş tema, yanlış otel listesi veya sunucu hatası döndürüyordu. Ayrıntılar `content-audit.md` içindedir. Bu içerikler uydurulmadı. Seyahat günlüğü, erişilebilen Efes yazılarını sunar.
- Kaynak başlangıç fiyatları ve kişi grubu tabloları korunur. Birbirleriyle çelişen kaynak fiyatlar otomatik hesaplamaya sokulmaz; para miktarları değiştirilmez.

## Talep akışı

Tur, otel, gulet veya transfer detayındaki form; hizmet, tarih, kişi sayısı, ad, e-posta, hareket noktası ve mesajla taslak hazırlar. Kullanıcı taslağı kopyalayabilir veya kendi e-posta uygulamasında `info@magical-steps.com` adresine açabilir. Site e-posta göndermez, rezervasyon oluşturmaz ve form verisini sunucuya kaydetmez.

## Görseller

Sharp kurulu. Toplu dönüştürme:

```sh
pnpm images:optimize
pnpm images:optimize --quality 80
```

585 raster kaynak WebP'ye dönüştürüldü. Katalog için 107 kaynak kartına ek dört seçilmiş destinasyon kapağıyla toplam 111 küçük WebP varyantı üretilir. Yeni dört kapak 528 × 400 piksel ve yaklaşık 15–40 KB boyutundadır. Tam boy galeri görselleri korunur. Boyutlar, kaynak URL'ler ve gerçek dosya tasarrufu `src/data/media.json` içinde. Varsayılan kalite 80; küçük görseller büyütülmez. Orijinaller bu çalışma alanının `work/media/originals` klasöründe korunur. Proje başka klasöre taşındığında komut mevcut manifestten kaynakları tekrar indirebilir.

Tek bir yeni fotoğraf için:

```sh
node scripts/optimize-images.mjs --input foto.jpg --output public/images/yeni-foto --name yeni-foto --quality 80
```

Görseller `next/image` bileşeniyle sunulur. Sharp ile önceden küçültülmüş kart WebP dosyaları ikinci kez kodlanmadan doğrudan yüklenir; hero, detay ve galeri görselleri Next Image ile ekran boyutuna göre üretilir. Fontlar yerel WOFF2; lisansları `public/fonts` altında. Videolar kullanıcı tıklayana kadar üçüncü taraf oynatıcı yüklemez. Kaynakta boş dönen otel fotoğrafları için başka bir otelin fotoğrafı yerine sade bir SVG illüstrasyon gösterilir. Boş dönen dokuz otel görseli ve diğer medya istisnaları `media-audit.md` içinde kayıtlıdır.

## Doğrulama

```sh
pnpm typecheck
pnpm build
AUDIT_URL=http://127.0.0.1:3000 pnpm audit:links
AUDIT_URL=http://127.0.0.1:3000/ pnpm audit:lighthouse
```

Lighthouse komutu her ekran profili için üç ölçüm ve medyan üretir. Chrome kurulu olmalıdır; macOS Chrome yolu scriptte tanımlıdır. Tek ölçüm için `node scripts/audit-lighthouse.mjs --single`; yalnızca mobilde üç ölçüm için `--mobile-only`; farklı rapor adı için `AUDIT_LABEL=contact` kullanılır.

Son detay sayfası revizyonunun sonuçları `reports/compact-detail-delivery.md` dosyasındadır. Bu sürümün yerel üretim ölçümünde performans medyanı mobilde 93, masaüstünde 100; diğer üç kategori her iki profilde 100'dür. Mobil 95+ hedefi henüz karşılanmamıştır. Önceki içerik ve tur deneyimi sonuçları `reports/journey-delivery.md` dosyasında korunur. Önceki sürümlerin ölçümleri `verification-report.md` içinde tarihsel kayıt olarak tutulur. Üretimde canonical ve hreflang alan adı `https://www.magical-steps.com` olarak hazırlanmıştır; farklı bir alan adına geçilecekse `src/lib/content.ts` ve kök metadata güncellenmelidir.

## Yapı

Next.js App Router ve TypeScript; sunucuda üretilen içerik; CSS Modules; next-intl; Motion. İstemci bileşenleri menü, katalog filtreleri, animasyon, galeri ve talep formuyla sınırlıdır. Tur, otel, gulet ve transfer detayları her giriş biçiminde bağımsız sayfa olarak açılır. Galeri ve özet üstte birlikte yer alır; program, fiyat ve rota bilgileri kompakt bir düzen kullanır. Azaltılmış hareket tercihinde ölçek/bulanıklık hareketleri kaldırılır.

## Tur seçimi ve içerik revizyonu

`/tr/find-your-tour` (diğer beş dilde de karşılığı var) süre, hareket noktası ve ilgi alanıyla 66 turu eşleştirir. Üç koşul birlikte uygulanır; doğrulanmamış süre veya hareket noktası belirli bir seçime uyuyormuş gibi gösterilmez. Seçimler ve adımlar URL'de tutulur. Tur ayrıntılarında günlük program, dahil/hariç hizmetler, kaynak fiyatlar, dokuz rota için başlıca durakların şeması ve mobil bilgi talebi bulunur.

20 otelin eksik uzun açıklaması, mevcut kaynak özetleri ve doğrulanabilen bilgilerle yeniden düzenlendi. Bunlar kayıp eski metinlerin birebir kurtarılması değildir. Altı özgün blog yazısı kaynakta hâlâ erişilemiyor. Altı dildeki yeni metinler ve hedefli düzeltmeler `reports/content-refinement.json`, `reports/journey-content-diff.json` ve `reports/turkish-program-review.json` içinde izlenir. 46 turda dil sürümleri arasındaki giriş ücreti çelişkileri teklif sırasında doğrulanacak bilgi olarak sunulur; orijinal kayıtlar korunur.

```sh
pnpm content:refine
pnpm test:journey
node scripts/audit-journey.mjs
```

Son komut tur kataloğu, otel kataloğu, tur bulucu, örnek detay ve ana sayfa için ayrı ayrı üç mobil ve üç masaüstü Lighthouse ölçümü alır. Sonuçlar `reports/lighthouse-journey-final-*-summary.json` dosyalarına yazılır. iCloud dışındaki bir çalışma klasörüne yazmak için `AUDIT_REPORT_DIR=/private/tmp/magical-audits` kullanılabilir; ham ölçümleri teslim raporuyla birlikte saklayın.

Türkçe font alt kümelerini yeniden üretmek için isteğe bağlı derleme bağımlılıkları `scripts/font-requirements.txt` içindedir; ardından `python scripts/prepare-turkish-fonts.py` ve `python scripts/prepare-core-fonts.py` çalıştırılır. Orijinal fontlar ve lisanslar korunur. Toplu WebP dönüşümünün varsayılan kalitesi 80'dir; detay sayfasındaki küçük önizlemeler ve kapak Next Image üzerinden kalite 75, tam ekran galeri kalite 90 ile sunulur.

## Depo kapsamı

Kaynak kodu, altı dilin yerel içerikleri, hazır WebP görselleri, yerel fontlar ve lisansları, hero orijinalleri, optimizasyon komutları ve içerik/test raporları depodadır. `node_modules`, derleme çıktıları, eski derleme yedekleri, makineye özgü Vercel bağlantısı ve ortam değişkenleri takip edilmez. Ham Lighthouse raporları yerel çalışma alanında tutulur; son ölçüm özeti depoya eklenmiştir.

## Static responsive WebP images (26 November 2026)

`pnpm images:responsive` generates responsive WebP files at quality 80 from the existing published masters. Original files are retained. `src/lib/image-loader.ts` selects those files for `next/image`, including hero preloading, without using Vercel's runtime image optimizer. This fixes the `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` response observed on mobile hero images. Commit generated `public/images/responsive` files and `src/data/image-widths.json` before deploying; rerun the command after adding or changing media. A source image's hashed filename must change when its bytes change.

`pnpm test:media` checks all generated loader URLs, mobile/desktop hero dimensions, aspect ratios and WebP decoding. The complete image-size manifest is in `reports/responsive-media-manifest.json`.
