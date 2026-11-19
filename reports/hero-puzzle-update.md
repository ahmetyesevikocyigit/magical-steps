# Hero başlığı, kartlar ve eksik parça geçişi — 12 Kasım 2026

- Hero tam ekran kalıyor. Başlık ekranın yatay merkezine alındı; altındaki uzun açıklama kaldırıldı.
- İkiye iki kartlar büyütüldü. İsimler ve yön okları, okunaklı alt karartma ile fotoğraf üzerinde yer alıyor. Kartlarda yüksek çözünürlüklü WebP kaynağından uygun Next Image boyutları kullanılıyor.
- Seçim sırasında yeni manzarada SVG maskesiyle gerçek bir boşluk açılıyor. Seçilen kart bu boşluğa büyüyerek geliyor. Uçan görselin tuvali, hero ile aynı ölçü, görüntü kaynağı, kırpma ve karartmayı kullanıyor. Parça tam oturduğunda maske ve uçan katman birlikte kaldırılıyor; önceki solup kaybolma kaldırıldı.
- Hareket azaltma tercihinde boşluk ve uçuş oluşturulmadan görsel değişiyor. Yükleme hatası mevcut görseli koruyor.

## Kontroller

- Üretim derlemesi ve TypeScript başarılı: `hero-puzzle-build.log`.
- 360×800, 390×844, 768×1024, 1440×900 ve 1920×1080 genişliklerinde yatay taşma görülmedi.
- Ölçülen başlık merkezi sapması 0 px: `hero-puzzle-checks.json`.
- Gerçek Chrome ve yerel tarayıcıda kart seçimi ve kesilmiş alan görüntülendi.
- Mobilde Enter ile seçim sonrası klavye odağı Kapadokya kartında kaldı; tur bağlantısı `/tr/tours?destination=Cappadocia` oldu; boşluk ve uçan katman sayısı 0'a döndü.
- Mobil hero içerik ve fotoğraf için en az 880 px; kısa telefon ekranları doğal olarak kaydırılır.
- Yeni Lighthouse ölçümü yapılmadı.
