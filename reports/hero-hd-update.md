# Hero netliği ve görünür destinasyon seçimi

12 Kasım 2026 · [Yerel önizleme](http://127.0.0.1:3000/tr)

## Yapılan değişiklik

Destinasyon seçimi hero içinde sürekli görünen dört fotoğrafla sunuluyor. “Sen nerede olmak isterdin?” ve “Bir yer seç, kendini orada bul.” metinleri deneyimi anlatıyor. Bir fotoğrafa tıklamak aynı kartın birleşme animasyonunu doğrudan başlatıyor; konum ve tur bağlantısı seçimle birlikte değişiyor. Mevcut “Turları keşfet” / “Başka bir yer seç” penceresi de çalışıyor. Dekoratif rozet, otomatik seçim veya sürekli tekrarlanan animasyon eklenmedi.

700 piksel kaynaklar yerine destinasyonlarla eşleşen yüksek çözünürlüklü fotoğraflar kullanıldı. Orijinaller `assets/hero-originals` içinde korunuyor. Sharp kalite 80, effort 5; büyütme yapılmıyor. Masaüstü, mobil kırpım ve küçük önizleme ayrı WebP olarak hazırlanıyor. `next/image` ekranın ihtiyacına göre daha küçük yanıtlar üretiyor. Mobilde `picture/source` dikey kırpımı seçiyor; uçan görsel ve hero aynı mobil kaynağı kullanıyor. Açılışta yalnızca ilk destinasyonun hero görseline yüksek öncelik veriliyor. Diğer destinasyonların büyük görselleri seçim sırasında hazırlanıyor.

| Destinasyon | Orijinal | Masaüstü ana WebP | Mobil ana WebP | Küçük önizleme |
| --- | --- | --- | --- | --- |
| Ephesus | 6000 × 4000 | 3200 × 2133 · 396 KiB | 1080 × 1620 · 165 KiB | 12 KiB |
| Cappadocia | 6960 × 4640 | 3200 × 2133 · 847 KiB | 1080 × 1620 · 242 KiB | 16 KiB |
| Istanbul | 6720 × 4480 | 3200 × 2133 · 254 KiB | 1080 × 1620 · 93 KiB | 7 KiB |
| Pamukkale | 5354 × 3569 | 3200 × 2133 · 1067 KiB | 1080 × 1620 · 266 KiB | 11 KiB |

Bu değerler ana çıktı dosyalarıdır; her ziyaretçiye bu boyutta dosyalar gönderilmez. Mobil Lighthouse ağ kaydında açılış hero yanıtı yaklaşık **89 KiB**, dört küçük önizleme toplam **28 KiB**. Ekran altındaki destinasyon kartları gecikmeli yüklenir. Başlıktaki italik font öncelikli yüklenerek yeni seçim alanının font değişiminden etkilenmesi giderildi.

## Tekrar üretme

Proje klasöründen `node scripts/prepare-hero-media.mjs` veya `pnpm images:hero`. Kaynak bilgileri `assets/hero-originals/sources.json`; gerçek ölçüler, baytlar ve tasarruf oranları `reports/hero-media-manifest.json`. Dosya isimlerindeki içerik özeti önbellekte eski görsel kalmasını engeller. Orijinaller değiştirilmez.

## Doğrulama

- Son üretim derlemesi ve TypeScript kontrolü başarılı: `hero-hd-build.log`.
- 12 yeni görsel HTTP 200 döndü; hepsinin WebP dosya imzası doğrulandı: `hero-hd-assets.json`.
- Dört destinasyonun doğrudan seçimi, görsel eşleşmesi, odak ve filtreli tur bağlantısı kontrol edildi.
- 360, 390, 768, 1440 ve 1920 pikselde yatay taşma yok; seçim alanı ilk ekranın içinde. Altı dilde mobil seçim ve doğru dil önekli tur bağlantısı doğrulandı.
- Mobilde ayrı dikey görsel kullanılıyor. Gerçek tıklamada sayfa kaymıyor; uçan görsel ile hero aynı URL’yi kullanıyor.
- Escape mevcut seçimi koruyor, pencereyi kapatıyor ve odağı açan düğmeye döndürüyor. Konsolda hata/uyarı görülmedi.
- Hareket azaltma tercihini gözeten önceki davranış korunuyor; bu turda işletim sistemi tercihi ayrıca değiştirilmedi.
- Kontroller: `hero-hd-ui-checks.json`. Görüntüler: `screenshots/hero-hd-desktop.png`, `screenshots/hero-hd-mobile.png`.

## Performans

`/tr` üzerinde yerel üretim sunucusu, Lighthouse mobil simülasyonu, üç koşu. Sonuçlar **100, 100, 82**; performans medyanı **100**. Erişilebilirlik, best practices ve SEO üç koşuda da **100**. Medyan LCP **1.06 saniye**, üç koşuda da **CLS 0**.

Üçüncü koşuda TBT yaklaşık 757 ms ve performans 82 çıktı; diğer iki koşuda TBT 25–35 ms idi. Bu dalgalanmanın nedeni kesinleştirilmedi; bütün ölçümler raporda tutuldu. Önceki tek karşılaştırma ölçümü performans 99 idi. Yerel laboratuvar sonucu, canlı ortamda bütün cihazlar için aynı hızın ölçüldüğü anlamına gelmez. Ham sonuçlar: `lighthouse-hero-hd-final-mobile-1.json`–`3.json`; özet: `lighthouse-hero-hd-final-summary.json`. Font düzeltmesinden önceki ölçümler de ayrı dosyalarda korunuyor.

## Görsel kaynakları

Fotoğraflar [Pexels lisansı](https://www.pexels.com/license/) kapsamında kullanıldı; indirme tarihi 12 Kasım 2026. Çıktılarda yeniden boyutlandırma, mobil kırpım ve WebP dönüşümü uygulandı.

- Ephesus: [Fatih Doğrul](https://www.pexels.com/photo/library-of-celsus-in-ephesus-ancient-city-in-turkey-15271623/).
- Cappadocia: [Guerrero De la Luz](https://www.pexels.com/photo/hot-air-balloons-over-cappadocia-at-sunrise-40293086/).
- Istanbul: [MEHMET SÜTLAŞ](https://www.pexels.com/photo/blue-mosque-at-twilight-istanbul-skyline-40622072/).
- Pamukkale: [Mert Ocak](https://www.pexels.com/photo/stunning-travertine-terraces-at-pamukkale-turkey-31022951/).
