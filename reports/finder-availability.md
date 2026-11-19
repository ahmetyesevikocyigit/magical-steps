# Tur bulucu: boş sonuçlar ve panel yönetimi

Tarih: 2026-11-12T18:03:54.266301+00:00. Üretim derlemesi: `c0ImE6fAGuOtuPDnWkfwy`.

## Bulgular

66 turun tamamı tur bulucuya bağlı. Eski arayüz süre, hareket noktası ve ilgi alanını birbirinden bağımsız sunuyordu. Katalogdaki 175 olası filtre birleşiminin 99'u sonuç vermiyor; bunların seçilebilir olması ziyaretçiyi boş sonuca yönlendiriyordu. Bu sayı eksik tur bağlantısı sayısı değildir.

Kaynak veride 1 süre ve 2 hareket noktası doğrulanamıyor:

- `sirince-from-kusadasi`: süre belirtilmemiş.
- `biblical-ephesus-tour`: hareket noktası belirtilmemiş.
- `customized-ephesus-tour`: metin limandan alımı söylüyor, hangi liman olduğu belirsiz.

Bu bilgiler tahmin edilmedi. Bilinmeyen alanlar belirli filtrelerle eşleştirilmez, “fark etmez” seçiminde tur listede kalır. İlgi alanları mevcut kaynak metinlerden türetilen sınıflandırmadır; işletme tarafından ileride gözden geçirilebilir.

## Uygulanan düzeltmeler

- Her seçenekte önceki yanıtlara göre gerçek eşleşme sayısı gösterilir; sıfır sonuçlu seçenek native `disabled` olur.
- Önceki bir yanıt değişirse ona bağlı sonraki yanıtlar sıfırlanır.
- Seçimler anında URL'ye yazılır. Sonuçtan tarayıcı geri tuşuyla dönüşte, yenilemede ve dil değişiminde korunur.
- Geçersiz kombinasyon içeren eski bağlantılarda, açıkça hangi tercihi değiştireceğini belirten ve gerçek sonuç sayısı gösteren alternatifler sunulur. Filtreler kullanıcıdan habersiz genişletilmez.
- “Hepsinden biraz” yerine “Özel bir tercihim yok” kullanılır; bu seçenek tüm ilgi alanlarını içeren tur garantisi anlamına gelmez.
- Yeni metinler altı dile ve tekrar çalıştırılabilir içerik hazırlama betiğine eklendi.

## Doğrulama

10 test geçti; tüm 175 kombinasyon tarandı. Arayüzün izin verdiği yolların tamamı sonuç veriyor. Eski 99 boş kombinasyonun her biri için en az bir açık filtre değişikliğiyle sonuç üreten alternatif bulundu. Kaynak fiyat tablolarını koruyan mevcut testler de geçti. TypeScript ve production build başarılı.

Tarayıcıda uzun tur → İstanbul → doğa akışı 2 tur verdi. Uzun turda Bodrum seçilemiyor. Eski uzun tur + Bodrum + şehir bağlantısı için hareket noktasını esnetme önerisi Enter ile açıldığında 4 tur görüldü. Geri tuşu, yenileme ve altı dil arasında geçiş doğrulandı. 320, 390, 430, 1440 px ölçümlerinde yatay taşma yok.

Yerel production `/tr/find-your-tour` sayfasında üç mobil ve üç resmî masaüstü Lighthouse çalışmasının medyanı: performans **100/100**, erişilebilirlik **100/100**, best practices **100/100**, SEO **100/100** (mobil/masaüstü). Bunlar canlı site veya tüm site için yeni ölçüm değildir. Ham sonuçlar `lighthouse-finder-availability-final-*.json` dosyalarında. İlk altı çalışma, geri tuşu düzeltmesinden önceki sürüm için ayrı `lighthouse-finder-availability-*.json` dosyalarında korunur; son medyana karıştırılmadı.

## Gelecekte panelden yönetim — henüz uygulanmadı

Tek tur kaydı hem kataloğu hem tur bulucuyu beslemeli. Tur düzenleme ekranına gün cinsinden süre, birden fazla seçilebilir hareket noktası, ilgi alanı kutuları ve yayın/tur bulucuda gösterim durumu konur. Yayına alma öncesinde eksik bilgiler gösterilir ve turun hangi seçimlerle bulunabildiği önizlenir. Sayılar ve uygun seçenekler kayıtlar üzerinden otomatik hesaplanır; yönetici kombinasyonları ayrı ayrı bağlamaz.

Altı dil aynı tur kimliğini ve aynı filtre kimliklerini kullanır. Çeviri alanları ayrı düzenlenebilir; tur eşleştirmesi altı kez kurulmaz. Mevcut yerel JSON veri kaynağı ileride veritabanı/API ile değiştirilir. Siteyi yayına almak tek başına admin paneli oluşturmaz; bu çalışma backend veya panel eklemedi.
