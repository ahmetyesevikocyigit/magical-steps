# Magical Steps — içerik kapsamı ve kalan işler

12 Kasım 2026 · Kaynak envanteri + yerel veri dosyaları + seçilmiş canlı kaynak sayfaları karşılaştırıldı. Bu çalışma bütün kaynak URL'lerin yeni baştan taranması değildir.

**Sonuç:** Ana katalog ve erişilebilir içerikler büyük ölçüde alındı. Eksiksiz bir birebir kopya iddiası doğru değil. Yeni sitedeki kırık bağlantı kontrolü, eski sitenin tüm içeriğinin kurtarıldığını kanıtlamaz.

## Aktarılanlar

- 107 hizmet: 66 tur, 32 otel, 5 gulet, 4 transfer.
- 39 kategori ve 39 kurumsal/Efes/harita yazısı.
- 585 kaynak raster görselin WebP karşılığı, 8 video bağlantısı ve yerel önizlemeleri. Daha sonra eklenen yüksek çözünürlüklü hero görselleri ayrı manifestte.
- Yorum sayfasında 130 kaynak yorum bloğu; bazı bloklarda birden fazla kişinin yorumu var. Ana sayfada iki seçili yorum gösteriliyor.
- Programlar, mevcut dahil/hariç bilgileri, kaynak fiyatlar, iletişim, yasal içerikler, tur fotoğrafları ve Efes haritası.
- Altı dilde sayfa karşılıkları. Eksik çeviriler makine destekli tamamlandı; tam editör onayı yok.
- Son bağlantı denetiminde 724 eski yol için 308 yönlendirmesi doğrulandı. Kurtarılamayan bazı eski adreslerin birebir yeni içeriği yok.

## Eksik veya kısmi kalan içerik

**Eski blog:** Dört eski kategori adresi bugünkü İngilizce oturumlu denemede HTTP 500 verdi. Eski Efes tarihi makalesi HTTP 200 ile yalnızca boş tema kabuğu döndürdü. Önceki taramada kurtarılamayan altı makale: Efes tarihi, Yamaç Evler, Artemis Tapınağı, Meryem Ana Evi, Mary Magdalene ve Şirince. Yeni seyahat günlüğünde erişilebilen Efes anıt/harita yazıları var; bunlar kayıp makalelerin birebir karşılığı değildir. Eski panel veya yedek varsa bu metinler oradan kurtarılabilir.

**Otel detayları:** 18 otelde ayrıntılı kaynak gövdesi yok. Bazılarında kısa tanıtım ve fotoğraflar mevcut. Oda tipleri, olanaklar veya koşullar uydurulmadı. Liste aşağıda.

**Diğer boş kayıtlar:** Bus Transfer açıklaması boş. Skolastika Hamamları giriş sayfasının özgün gövdesi yok; mevcut Skolastika Hamamları yazısına bağlantı var.

**Görseller:** Dokuz otel görseli boş dosya döndü. MSC Bellissima ve MSC Armonia gemi görselleri 404 döndü. Dekoratif eski rozet/placeholder dosyalarının bazıları da alınamadı. Bu durum bütün otel fotoğraflarının eksik olduğu anlamına gelmez; ilgili kayıtlarda erişilebilir diğer görseller bulunuyor.

**Güncellik:** Fiyat ve grup tabloları kaynaktaki biçimde korundu. Örneğin Efes–Meryem Ana–Şirince kartı 90 USD gösterirken tabloda 2–6 kişi için 140 USD, 7–22 kişi için 90 USD, 23–42 kişi için 85 USD var. Canlı satış öncesinde fiyat, sezon ve dahil hizmetler işletme tarafından netleştirilmeli.

887 kaynak URL içinde 195 kullanılamayan yanıt kaydı var. Bunların bir kısmı bozuk dil bağlantıları ve yinelenen adresler; 195 farklı ürün kayıp diye yorumlanamaz.

## İçerik aktarımından ayrı olan işler

Mevcut talep formu e-posta taslağı hazırlar; otomatik gönderim veya rezervasyon kaydı oluşturmaz. Canlı müsaitlik, ödeme, üyelik, yönetim paneli ve eski arama/rezervasyon servisleri bu frontend aşamasına dahil edilmedi.

## Önerilen sıra

1. Kaynak/panel yedeğinden eksikleri tamamlamak; otel detayları, fiyatlar ve uzun çevirileri editörden geçirmek.
2. Gerçek talep gönderimi, işletmeye bildirim ve talep takibi. Ardından tur/fiyat/görsel/çeviri yönetimi için panel.
3. Tur detaylarında kısa bilgi özeti, günlük rota, buluşma noktası ve harita; mobilde görünür talep butonu.
4. 130 yorum bloğunu aranabilir/sayfalanabilir kartlara dönüştürmek; gerçek misafir fotoğraf ve videolarını ilişkili turlarla eşlemek.
5. Efes, Kapadokya, İstanbul ve Pamukkale için bağımsız destinasyon rehberleri; tur karşılaştırma ve kaydetme/paylaşma.
6. Otel/gulet müsaitlik sistemi ve ödeme, işletmenin fiyatlandırma/operasyon akışı kesinleşince ayrı aşama.

## Ayrıntılı açıklaması olmayan oteller

- Adam & Eve 5* All Inclusive - Adults Only
- Aquaworld Belek 5*
- Bodrum Holiday Resort 5*
- Club Marma Hotel 5*
- Crystal Sunrise Queen Luxury Resort 5* All Inclusive
- D Maris Bay 5*
- DoubleTree by Hilton Bodrum Isil Club Resort 5*
- DoubleTree by Hilton Bodrum Marina Vista 4*
- Ela Quality Resort Belek 5* All Inclusive
- Grand Park Lara 5* All Inclusive
- Grand Yazici Club Turban 5*
- Grand Yazici Marmaris Palace 5* All Inclusive
- Innvista Hotel 5*
- Kimeros Park Holiday Village 5*
- Marmaris Bay Resort 5*
- Salmakis Resort 5*
- Sunrise Resort Hotel 5* All Inclusive
- Crystal Family Resort & Spa — All inclusive

Ham denetim: `reports/content-completeness.json`. Önceki kaynak envanteri: `reports/url-inventory.csv`. Kaynak istisnaları: `content-audit.md`, `media-audit.md`, `localization-audit.md`.
