# Magical Steps — tasarım revizyonu

12 Kasım 2026 · Lokal üretim sürümü: http://localhost:3000/tr

## Tasarım kararları

SOLARA videosundaki fotoğraf geçişi yeniden incelendi. BMT, Saran Teknik, Gültekin Peyzaj ve Steelatelier sohbetlerindeki ortak tercihler uygulandı: görselle bütünleşen header, kısa ve doğal metinler, ölçülü başlıklar, mobil merkezleme, tutarlı bağlantılar ve kompakt footer.

- Hero tam ekran panorama olarak düzenlendi. Başlık ortalandı; açıklama kaldırıldı. Kapadokya açılış manzarası oldu.
- Sol alttaki 2×2 seçim kartlarının isimleri fotoğrafın üzerinde. Seçili destinasyonun tur bağlantısı ayrı, belirgin bir butonla gösteriliyor.
- Beyaz boşluk/yapboz efekti kaldırıldı. Seçilen net fotoğraf büyüyüp hareket ederken arka manzara bulanıklıktan netliğe geçiyor; fotoğraf aynı kadrajda bütünleşiyor. Süre 1,55 saniye. Görsel yüklenmeden geçiş başlamıyor. Kaydırma veya boyut değişikliği geçişi güvenle tamamlıyor.
- Sayfa başındaki yinelenen destinasyon bölümü kaldırıldı. Altı tur kartı, hizmetler, işletme tanıtımı, kısa gerçek yorumlar ve iletişim çağrısı daha sıkı bir akışta sunuluyor.
- Dört öne çıkan turun kapak ve detay görselleri mevcut yüksek çözünürlüklü WebP arşivinden seçildi. Next/Image uygun boyutları üretiyor; eski galeri fotoğrafları korunuyor.
- İç sayfalar beyaz zemine, daha ölçülü başlıklara ve okunabilir metin boyutlarına geçti. İletişim bilgileri formdan önce geliyor. Footer bağlantıları büyütüldü; mobil menü ve footer ortalandı.
- Altı dilde ana sayfa ve form metinleri kısaltıldı. Türkçede 55 tur başlığı ile 27 blog başlığı/önizlemesi düzeltildi. Ham kaynak envanteri korunarak çeviri düzeltmeleri ayrı dosyada tutuluyor.
- Dil ana sayfalarının sonundaki `/` yönlendirme döngüsü düzeltildi. Geçersiz dil/yol için içerik üretmeden 404 dönülüyor. Ana sayfa SEO başlığı her dilde özelleştirildi.

## Doğrulama

| Kontrol | Sonuç |
| --- | --- |
| Next.js üretim derlemesi ve TypeScript | Başarılı |
| Otomatik bağlantı taraması | 2566 kontrol, 0 hata |
| Tarama kapsamı | 1140 sayfa, 724 eski URL yönlendirmesi, 692 görsel, diğer varlık ve bağlantılar |
| Hero ekran genişlikleri | 320, 390, 430, 768, 1440, 1920 px; yatay taşma yok |
| Altı dil / 320 px | Başlık ve kartlar çakışmıyor; yatay taşma yok |
| Liste, iletişim, detay, blog / 320 px | Yatay taşma yok |
| Katalog | Arama ve destinasyon filtresi URL'ye işleniyor |
| Detay | Animasyonlu açılış; Escape ile kapanış; odak ve filtre korunması; yenilemede tam sayfa |
| Dil seçimi | Aynı tur için Türkçe → Fransızca karşılığı açıldı |
| Talep formu | Tarih/ad/e-posta/kişi bilgileriyle taslak oluşturma ve kopyalama çalışıyor |
| 404 ve slash yönlendirmesi | 404 ve tek adımlı 308 yanıtları doğrulandı |

Hareket azaltma tercihi kod ve CSS düzeyinde kontrol edildi: fotoğraf uçuşu, büyüme ve bulanıklık devre dışı kalıyor. Bu turda işletim sistemi tercihi değiştirilerek ayrı bir canlı test yapılmadı.

## Lighthouse

URL: http://127.0.0.1:3000/tr · Ölçüm: 2026-11-12T09:30:49.074Z · Üretim sunucusu, her cihaz türünde üç koşumun medyanı.

| Cihaz | Performans | Erişilebilirlik | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobil | 100 | 100 | 100 | 100 |
| Masaüstü | 100 | 100 | 100 | 100 |

Mobil LCP medyanı 1.07 sn, TBT 21 ms, CLS 0. Masaüstü LCP medyanı 0.29 sn, CLS 0.

Bu skorlar yerel Türkçe ana sayfanın laboratuvar ölçümleridir; diğer sayfalar ve canlı barındırma ortamı için aynı skor iddia edilmez. Ayrıntılı rapor, paket içindeki kullanılmayan JavaScript ve görsel boyutlarına ilişkin iyileştirme önerilerini de içerir.

## Dosyalar ve sınırlar

- `reports/lighthouse-designer-home-summary.json`: tüm koşumlar ve medyanlar.
- `reports/link-audit.json`: bağlantı ve yönlendirme sonuçları.
- `reports/designer-review/`: masaüstü/mobil hero, footer ve yerleşim kayıtları.
- `scripts/prepare-hero-media.mjs`: yeniden çalıştırılabilir Sharp/WebP üretimi (`pnpm images:hero`).
- `src/data/translation-overrides.json`: sunum için düzeltilen çeviriler.

Tur programları, fiyat tabloları ve uzun arşiv yazıları bu revizyonda yeniden yazılmadı. Eski arşiv galerilerinde kaynak çözünürlüğünün sınırları devam ediyor. `pamukkale-tours-from-izmir` kaydındaki kaynak başlık Kuşadası dediği için çıkış yeri otomatik olarak İzmir'e çevrilmedi. Önceki içerik aktarım raporundaki kaynak çelişkileri geçerli.
