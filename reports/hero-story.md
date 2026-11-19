# Hero metninin parçadan başlığa taşınması

12 Kasım 2026 — [yerel önizleme](http://localhost:3000/tr)

Kartlara destinasyonla ilişkili kısa davetler eklendi. Seçimde aynı metin katmanı önce büyüyen fotoğrafın üzerinde durur, ardından görünür kalarak hero başlığının ölçülen konumuna kayar. Başlığın gerçek satırları, font boyutu ve satır yüksekliği kullanılır. Son karede sabit başlıkla yer değiştirir; ayrı bir metin belirmesi yoktur.

Akış 2,65 saniye sürer. Fotoğraf ilk yarıda büyür, metin kısa bir süre fotoğrafta kalır ve son bölümde başlığa taşınır. Türkçe, İngilizce, Fransızca, Almanca, Hollandaca ve Rusça için 72 yeni metin alanı tamamlandı. İlk açılıştaki ana başlık, tam ekran görsel, WebP kaynaklar ve destinasyona bağlı tur bağlantısı korunur.

Azaltılmış hareket tercihinde büyük hareket çalışmaz; seçim doğrudan uygulanır. Kaydırma veya ekran boyutu değişikliği devam eden hareketi güvenle sonlandırır. Animasyon katmanı erişilebilirlik ağacında yinelenmez; gerçek h1 korunur.

Doğrulama:
- Üretim derlemesi ve TypeScript başarılı.
- Kartın erişilebilir adı görünen destinasyon ve davet metnini birlikte içerir. Enter ile seçim ve başlığın değişmesi doğrulandı.
- 390 px genişlikte dört destinasyon seçildi; parça ve son başlık metinleri aynı, hareket sırasında ikinci başlık görünmüyor ve yatay taşma yok.
- 320, 360, 768, 1440 ve 1920 px yerleşimleri kontrol edildi; başlık ve kart alanı çakışmıyor.
- İngilizce, Almanca ve Rusça mobil seçimleri ayrıca kontrol edildi. Altı dilde tüm yeni metinlerin doluluğu doğrulandı.
- Azaltılmış hareket dalı kod üzerinden incelendi; işletim sistemi ayarı değiştirilmedi.
- Görsel kaynak ve URL envanteri değişmedi; önceki katalog/detay kontrol kapsamı bu revizyonda yeniden taranmadı.

Kanıtlar: `hero-story-checks.json`, `screenshots/hero-story-transition.png`, `screenshots/hero-story-desktop.png`, `screenshots/hero-story-mobile.png`.

## Hız kontrolü

Üretim build: `x4xFWo3yEkKoDUVxMG6fG`. Lighthouse, aynı standart mobil ve masaüstü koşullarında üçer kez çalıştırıldı. Medyanlar:

| Profil | Performans | Erişilebilirlik | Best practices | SEO |
|---|---:|---:|---:|---:|
| mobile | 100 | 100 | 100 | 100 |
| desktop | 100 | 100 | 100 | 100 |

Performans koşuları: mobile: [100, 100, 100], desktop: [100, 100, 100]. Geçersiz iz sayısı: 0. Ham sonuçlar `lighthouse-hero-story-*.json` dosyalarındadır.

