# Hero — seçilen destinasyonun manzarayla birleşmesi

12 Kasım 2026 · Yerel üretim önizlemesi: http://127.0.0.1:3000/tr

## Davranış

“Turları keşfet” dört destinasyonun seçim ekranını açar. Tıklanan kartın gerçek ekrandaki konumu geçişin başlangıcıdır. Aynı destinasyonun yüksek boyutlu WebP görseli hazır olduğunda kart hero’ya taşınır, kırpması arka planla hizalanır ve arka planın içine karışır. Hero görseli, konum metni ve tur bağlantısı seçime göre değişir. “Başka bir yer seç” aynı akışı tekrar açar. Açılışta otomatik birleşme ve tekrar oynatma düğmesi kaldırılmıştır.

Referansın seçim → seçilen görsel → hero ilişkisi tur destinasyonlarına uyarlandı. Ödeme veya rezervasyon onayı eklenmedi.

## Doğrulama

- Üretim derlemesi ve TypeScript başarılı: `hero-selection-build.log`.
- Efes, Kapadokya, İstanbul ve Pamukkale: seçili kart, hero görseli, odak ve bağlantı eşleşiyor.
- Pamukkale bağlantısı katalogda Pamukkale filtresini ve 4 sonucu açıyor.
- İngilizce, Türkçe, Fransızca, Almanca, Hollandaca ve Rusçada seçim ve dil önekli bağlantı kontrol edildi.
- 360, 390, 768, 1440 ve 1920 piksel genişliklerde yatay taşma yok. 360/390 pikselde başlık ortalı. Hero yüksekliği masaüstünde 110svh, mobilde 108svh.
- Klavye odağı seçim penceresinde tutuluyor; Escape önceki seçimi koruyor, kaydırma kilidini kaldırıyor ve odağı açan düğmeye geri veriyor. Seçim tamamlanınca odak ilgili tur bağlantısına geçiyor.
- Uçan görsel ile hero aynı görsel URL’sini kullanıyor. Tarayıcı konsolunda hata veya uyarı yok.
- Hareket azaltma tercihi kodda kontrol ediliyor: uçuş atlanıyor, bulanıklık ve büyüme kaldırılıyor. Bu turda işletim sisteminin tercihi değiştirilerek ayrıca sınanmadı.
- Bu değişiklik için Lighthouse tekrar ölçülmedi; önceki raporun puanları yeni seçim akışının ölçümü olarak sunulmuyor.

Ham kontroller: `hero-selection-checks.json`, `hero-selection-http.json`. Ekran görüntüleri: `screenshots/hero-selection-picker.png`, `screenshots/hero-selection-merging.png`, `screenshots/hero-selection-result.png`, `screenshots/hero-selection-mobile.png`.

## Yerel dosya kurtarma notu

iCloud bazı proje dosyalarını yalnızca bulutta bıraktığı için yerel sunucunun dosya istekleri bekliyordu. Kaynakların ve mevcut sürüm bağımlılıklarının yerel kopyaları kurtarıldı; paket sürümleri değiştirilmedi. İçerik kataloğunun SHA-256 özeti önceki değerle aynı. 106 WebP ve 2 küçük kart görseli kayıtlı kaynak URL’lerinden aynı boyut, kalite 80 ve effort 5 ile yeniden üretildi; dosya boyutları mevcut manifestle eşleşti. İki font aynı kaynaklarından aynı dosya boyutlarıyla geri alındı. Erişilemeyen favicon ve otel yer tutucu SVG’si yeniden oluşturuldu; eski bulut yer tutucuları `work/hero-reference/cloud-public-before-recovery` altında korundu. Public dizininde bulutta kalan dosya yok; sunucu standart iş parçacığı ayarlarıyla tekrar başlatıldı. Bu not, bütün çalışma klasörünün bulut durumunu garanti etmez.
