# Hero başlığı ve sol destinasyon kartları

12 Kasım 2026 · Yerel önizleme: http://127.0.0.1:3000/tr

- Hero başlığı masaüstünde küçültüldü: 1440 px genişlikte 136,8 px yerine 97,92 px.
- Destinasyon seçimi başlık ve butonlarla aynı sol sütuna taşındı. Sağdaki manzara alanını kapatan büyük krem panel kaldırıldı.
- Her destinasyon ayrı, yuvarlatılmış köşeli bir kart: fotoğraf, isim, yön oku; seçili durumda belirgin çerçeve. Kartlarda hafif hover hareketi var.
- Mobilde başlık ve içerik ortalı; kartlar iki sütunda. Küçük resimlerin `sizes` bilgisi yeni düzene uyarlandı; WebP kaynakları korunuyor.
- Masaüstü ve mobilde doğrudan seçim → görselin hero ile birleşmesi → ilgili tur bağlantısı kontrol edildi. Gerçek tıklamada kaydırma konumu korunuyor.
- Üretim derlemesi ve TypeScript kontrolü başarılı: `hero-left-build.log`.
- Bu görsel düzenleme için Lighthouse yeniden ölçülmedi; önceki puanlar bu sürümün yeni ölçümü olarak sunulmuyor.

Ekran görüntüleri: `screenshots/hero-left-desktop.png`, `screenshots/hero-left-mobile.png`. Yerleşim kontrolleri: `hero-left-checks.json`.
