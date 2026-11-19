# İçerik, tur seçimi ve detay revizyonu — 12 Kasım 2026

Yerel üretim önizlemesi: [Türkçe ana sayfa](http://localhost:3000/tr), [tur bulucu](http://localhost:3000/tr/find-your-tour), [örnek detay](http://localhost:3000/tr/tours/cappadocia-tours-from-istanbul).

## İçerik kapsamı ve sınırlar

- Katalog: 66 tur, 32 otel, 5 gulet ve 4 transfer; toplam 107 hizmet. Altı dilde 642 ürün/dil kaydının başlığı ve gövdesi dolu.
- Uzun açıklaması eksik veya tek harften oluşan **20 otel** için, eski siteden alınmış konum ve tesis özetleri altı dilde okunabilir açıklamaya dönüştürüldü. Yeni talep yönlendirmeleri eklendi. Bu çalışma, kayıp eski uzun metinlerin birebir kurtarılması değildir. Güncel müsaitlik ve fiyat iddiası eklenmedi.
- Crystal Family için [otelin resmî sayfası](https://crystalhotels.com.tr/oteller/crystal-family) ek doğrulama kaynağı oldu. Sayfa bazındaki kaynaklar `content-refinement.json` içinde.
- Otobüs transferinin başlığı ve talep açıklamaları altı dilde tamamlandı; kapasite, güzergâh veya tarife uydurulmadı. Scholastica hamamı giriş kaydının açıklaması düzenlendi.
- Yedi öne çıkan turun özetleri altı dilde yeniden yazıldı. Yedi Türkçe program ayrıca baştan sona düzenlendi: Kapadokya, Yedi Kilise, Efes–Meryem Ana–Şirince, Pamukkale, İstanbul, Priene–Milet–Didim ve Göbeklitepe.
- Rehber/şoför, transfer, bahşiş, Meryem Ana ve Pollio gibi yanlış çevrilmiş terimler düzeltildi. Başlangıç yedeğine göre 96 içerik kimliğinde, 325 içerik/dil kaydındaki 496 alan değişti. Ayrıntı: `journey-content-diff.json`.
- **Altı özgün blog yazısı hâlâ kurtarılamadı:** Efes tarihi, Yamaç Evler, Artemis Tapınağı, Meryem Ana Evi, Mecdelli Meryem ve Şirince. Kaynak sayfaları boş kabuk/hata döndürüyor, panel veya yedek yok. Erişilebilen Efes yazıları kullanılmaya devam ediyor; yeni metinler eski yazılarmış gibi sunulmadı.
- Önceki envanterdeki 18 otel açığına, yalnızca “R” içeren iki kayıt daha eklendi. Önceki `content-completeness.*` raporları revizyon öncesi fotoğrafıdır; bu rapor güncel durumu açıklar.
- Uzun yabancı dil programlarının tamamı ana dili konuşan editör incelemesinden geçmiş değildir. Mevcut ve makine yardımıyla tamamlanmış çeviriler korundu; bu aşamada hedefli terminoloji, eksik gövdeler, görünür özetler ve yeni arayüz metinleri düzenlendi.

## Fiyatlar ve çelişkiler

642 ürün/dil varyantındaki fiyat tablolarının SHA-256 parmak izleri başlangıç yedeğiyle karşılaştırıldı. İçlerindeki **483 tablo öğesinin** özgün HTML'i değişmedi; otomatik fiyat hesaplaması eklenmedi. Fiyatlar canlı teklif olarak sunulmaz.

46 turda dil sürümleri giriş ücretinin dahil/hariç olması hakkında farklı bilgiler içeriyor. Ayrıntı ekranı bu çelişkili kalemi kesin hizmet listelerinden çıkarıp teklif sırasında netleştirileceğini söylüyor. Diğer hizmetler ve ödeme koşulları korunuyor. Ham kaynak `catalog.json` içinde değişmeden durur; dil bazındaki bulgular `inclusion-conflicts.json` içindedir.

## Tur seçimi ve detaylar

- Üç adım: süre → hareket noktası → ilgi alanı. 66 turun kaynak bağlantılı bilgileri `tour-facts.json` içinde.
- Katalogdaki “Önerilen” sıralaması ana sayfanın öne çıkan altı rotasını başa alır; ada göre sıralama ayrı seçenektir. Dört yüksek çözünürlüklü kapak için katalogda 528 × 400 WebP varyantları üretildi (kalite 80, 15–40 KB); tam boy görseller korunur.
- Seçimler birlikte uygulanır. Bilinmeyen süre/hareket noktası, belirli bir seçime eşleşmiş sayılmaz. Yanıltıcı eski URL adları yerine gerçek program dikkate alınır.
- Sonuç bulunamadığında seçim değiştirme, sıfırlama ve kişisel planlama bağlantısı vardır.
- Adım ve seçimler URL'de tutulur; yenileme, dil değiştirme ve geri dönüşte korunur.
- Detaylar günlük program, dahil/hariç hizmetler, özgün fiyat tabloları, buluşma/dönüş bilgisi, galeri ve talep formu şeklinde ayrılır.
- Dokuz turda ana durakların hafif SVG şeması ve Google Haritalar bağlantısı bulunur. Şema canlı yol tarifi değildir; üçüncü taraf harita başlangıçta yüklenmez.
- Mobil bilgi talebi düğmesi form görünürken gizlenir. Katalogdan açılan detay klavye odağını içeride tutar; Escape ile kapanınca kart odağı geri gelir. Doğrudan URL tam detay sayfasıdır.
- Talep akışı yalnızca e-posta taslağı hazırlar/kopyalar. Site rezervasyon oluşturmaz, e-posta göndermez veya form verisini kaydetmez.

## Performans değişiklikleri

- İlk katalog görseli sunucudan ve yüksek öncelikle gelir. Diğer kart görselleri ekranın 240 piksel yakınına gelince yüklenir; JavaScript kapalıysa `noscript` görseli vardır.
- Hazır Sharp WebP kartları tekrar kodlanmadan kullanılır. Hero/detay görüntülerinin yüksek çözünürlüklü dosyaları korunur. WebP kalite 80 değişmedi.
- Motion'ın geçiş motoru ilk kullanıcı etkileşiminde yüklenir. Başlangıç içeriği görünür kalır. Ekran altı belirme animasyonu küçük bir IntersectionObserver/WAAPI uygulaması kullanır.
- Türkçe için gereken ek normal fontlar yaklaşık 49 KB yerine 5 KB. Kaynak WOFF2, değişken ağırlıklar ve lisanslar korunur. Manifest: `turkish-font-manifest.json`.
- Temel Latin/Türkçe karakterler ile ek Latin karakterleri ayrı font dosyalarına ayrıldı. Orijinal glif kapsamı, normal kalınlıklar ve kerning korunur; kullanılmayan karakterler ilk açılışta indirilmez. `core-font-manifest.json`.
- Katalogda ilk görünümün fotoğrafı öncelikli yüklenir. Font alt kümeleri CSS üzerinden keşfedilir; fotoğrafla yarışan font ön yükleme ipuçları kaldırıldı. Font dosyaları bir gün önbellekte kalır; dosya içeriği değiştirilirken önbellek için URL de sürümlenmelidir. Diğer karakterler ihtiyaç olduğunda yüklenir.
- Uzun tam detay sayfalarının ekran dışındaki bölümlerinde `content-visibility: auto` kullanılır. Bölüm bağlantısına basılınca yükseklikler kaydırmadan önce çözümlenir; modal detay ve baskı görünümü bu ertelemenin dışında tutulur. Mobil rota/form geçişi yeniden doğrulandı (`journey-section-rendering.json`).
- Next.js `experimental.inlineCss` etkin: küçük stil dosyası ilk HTML yanıtıyla gelir. İlk ziyarette stil istek zinciri azalır; karşılığında CSS HTML/RSC içinde tekrarlanabilir ve ayrı dosya önbelleğinin sayfalar arası avantajı azalır. Bu Next.js sürümünde deneysel bir seçenektir.

## Doğrulama

- Üretim derlemesi ve TypeScript kontrolü başarılı.
- Yedi anlamlı otomatik test: kaynakla eşleştirme, yanlış/eksik seçimler, fiyat bütünlüğü, günlük program ayrımı, dahil/hariç ayrımı ve tüm dillerde dolu ürün gövdeleri.
- HTTP taraması (medya yanıt gövdeleri de okunarak): **2.609 kontrol, 0 hata**. 1.146 sayfa, 724 eski URL yönlendirmesi, 708 medya hedefi, 25 font/temel dosya ve 6 keşfedilen bağlantı. `link-audit.json`.
- Tur bulucunun altı dilde aynı üç sonucu koruduğu; yenileme, boş sonuç, sıfırlama, katalog arama/filtre, 36 kartlık sayfalama ve geri tuşu doğrulandı.
- Test verileriyle taslak hazırlandı ve kopyalandı; alıcı/hizmet/tarih/kişi sayısı kontrol edildi. Gerçek e-posta açılmadı veya gönderilmedi.
- Tur bulucu: 320, 360, 390, 430, 768, 1440, 1920 px; katalog ve detay: 360, 390, 768, 1440, 1920 px. Yatay taşma görülmedi. Mobil/masaüstü görsel kontroller ve klavye odağı denemeleri yapıldı. `journey-browser-checks.json`.
- Azaltılmış hareket koşulları kod üzerinden kontrol edildi; bu turda işletim sistemi tercihi değiştirilerek ayrı bir cihaz deneyi yapılmadı.
- Otomatik erişilebilirlik ölçümü Lighthouse/axe kapsamındadır; tam ekran okuyucu sertifikasyonu değildir.

## Tekrar çalıştırma

```sh
pnpm content:refine
pnpm test:journey
pnpm typecheck
pnpm build
pnpm start
AUDIT_URL=http://127.0.0.1:3000 pnpm audit:links
node scripts/audit-journey.mjs
pnpm images:optimize --quality 80
```

`audit-journey.mjs` her seçili sayfa için üç mobil ve üç resmî Lighthouse masaüstü profili çalıştırır. Yerel üretim sunucusu, aynı Chrome ve simüle ağ/CPU koşulları kullanılır. Gerçek kullanıcı performansı cihaz, bağlantı ve yayın ortamına göre değişir. Ölçümler aşağıdaki tablo ve ham JSON dosyalarında saklanır.

## Son üretim ölçümleri

Build: `7QQjNrmHb4mVzPdzzcTYy`. Lighthouse `13.6.0`. Ölçüm zamanı: 2026-11-12T12:06:25.998082+00:00. Her satır, o sayfa için aynı build üzerinde üç geçerli koşunun medyanıdır. Ağ/CPU profili değiştirilmedi; düşük sayısal puanlar çıkarılmadı.

| Sayfa | Mobil performans | Masaüstü performans | Erişilebilirlik | Best practices | SEO |
|---|---:|---:|---:|---:|---:|
| Tur kataloğu | 97 | 100 | 100 | 100 | 100 |
| Otel kataloğu | 95 | 100 | 100 | 100 | 100 |
| Tur bulucu | 100 | 100 | 100 | 100 | 100 |
| Kapadokya detay | 98 | 100 | 100 | 100 | 100 |
| Ana sayfa | 100 | 100 | 100 | 100 | 100 |

### Ham koşu dağılımı

| Sayfa | Mobil üç koşu | Masaüstü üç koşu |
|---|---|---|
| Tur kataloğu | 94, 97, 97 | 100, 100, 100 |
| Otel kataloğu | 98, 95, 95 | 100, 100, 100 |
| Tur bulucu | 100, 100, 100 | 100, 100, 100 |
| Kapadokya detay | 89, 98, 98 | 99, 100, 100 |
| Ana sayfa | 100, 100, 100 | 100, 100, 100 |

Son değişiklik yalnızca detay hero görselinin istek önceliğiydi; bu sayfa yeniden ölçüldü. Diğer sayfaların çalışan kodu değişmediği için tamamlanmış ölçümleri korundu. Sayfa başına build kimlikleri: `catalog`: `hXnFvJDn0yFAP5hNE6SFI`, `hotels`: `hXnFvJDn0yFAP5hNE6SFI`, `finder`: `hXnFvJDn0yFAP5hNE6SFI`, `detail`: `7QQjNrmHb4mVzPdzzcTYy`, `home`: `hXnFvJDn0yFAP5hNE6SFI`.


Geçersiz/eksik iz sayısı: 0. Ayrıntılı profil, Chrome sürümü, metrikler, ham raporlar ve doğrulama özeti `journey-verification.json` içindedir. Önceki uygulama sürümlerinin düşük ölçümleri `lighthouse-history` altında korunur; sonuç tablosunda bu eski sürümlerle medyan karıştırılmadı.


Teknik uygulama kaynakları: [React preload](https://react.dev/reference/react-dom/preload), [Next.js yanıt başlıkları](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers), [MDN content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility).
