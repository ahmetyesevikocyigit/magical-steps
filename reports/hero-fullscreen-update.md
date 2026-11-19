# Hero düzenlemesi — 12 Kasım 2026

Kullanıcının son yönlendirmesine göre bölünmüş düzen kaldırıldı. Hero görseli yeniden tüm alanı kaplıyor; solda okunurluk için yumuşak geçişli bir kaplama var. Başlık 112 px yerine kullanıcının 1680×745 penceresinde 70 px. Başlık, açıklama, ikiye iki seçim kartları ve bağlantılar kompakt bir sol sütunda. Anasayfa başlığı 84 px; mobilde 76 px.

Kartlar doğrudan görsel seçiyor. Aynı seçenekleri tekrar açan modal kaldırıldı. Karttan hero görseline geçiş, WebP kaynakları ve azaltılmış hareket desteği korundu. Geçiş sırasında `aria-disabled` ve olay koruması kullanılarak klavye odağı korunuyor. Tur bağlantısı seçilen destinasyona güncelleniyor.

## Doğrulama

- Üretim derlemesi ve derleme içindeki TypeScript kontrolü başarılı (`hero-fullscreen-build.log`).
- Chrome 1680×745: görsel alanı x=0, y=0, genişlik=1680, yükseklik=745; yatay taşma yok.
- Seçim sonrasında görsel ve tur bağlantısı güncelleniyor; animasyon tamamlanıyor.
- 360×800 ve 390×844 mobil görünüm: ortalı içerik, iki sütun kartlar, yatay taşma yok. 360 px genişlikte içerik ekran yüksekliğini aşabilir ve doğal olarak kaydırılır.
- 1440×900: görsel tam ekran, yatay taşma yok.
- Lighthouse bu görsel düzenlemeden sonra tekrar çalıştırılmadı; eski raporlar önceki sürümlere aittir.

Ekran görüntüleri: `screenshots/hero-fullscreen-desktop.png`, `screenshots/hero-fullscreen-mobile.png`.
