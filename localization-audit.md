# Yerelleştirme denetimi

Son veri sürümü: **11 Kasım 2026, 23:04:53 (Europe/Istanbul)**. Bu rapor uygulama verisini değiştirmez.

## Kapsam ve sonuç

İngilizce, Türkçe, Fransızca, Almanca, Hollandaca ve Rusça tamamlandı. İngilizce kök rotada; diğer diller aynı kayıt kimliğini koruyan dil öneklerinde kullanılır.

| Ölçüm                                          |                                Sonuç |
| ---------------------------------------------- | -----------------------------------: |
| İçerik kaydı                                   | 185: 107 ürün, 39 kategori, 39 sayfa |
| Dil × kayıt karşılığı                          |                        1.110 / 1.110 |
| Dolu başlık                                    |                                1.110 |
| Dolu açıklama                                  |                                  960 |
| Dolu içerik gövdesi                            |                                  840 |
| Arayüz anahtarı                                |           Dil başına 128; toplam 768 |
| Eksik arayüz değeri / anahtar uyuşmazlığı      |                                    0 |
| Geçerli kaynak metni varken boş bırakılan alan |                                    0 |
| Çözümlenmemiş çeviri birimi                    |                                    0 |

25 kaydın açıklaması ve 45 kaydın gövdesi hiçbir dilde geçerli içerik sunmuyor. Bu alanlar boş bırakıldı; otel özellikleri veya program ayrıntıları uydurulmadı. Kaynaktaki hata şablonları ve tek harflik bozuk gövdeler de bu sayılara dahildir.

## Çeviri yöntemi ve köken

Arayüzün 768 metni asistan tarafından doğrudan hazırlanmıştır; insan editör incelemesi yapıldığı iddia edilmez. Altı dilde ana sayfa, menü, footer, talep formu, doğrulama, erişilebilirlik açıklamaları ve iki ana sayfa yorumu hazırlanmıştır. Form metinleri e-posta taslağı hazırlamak ile mesaj göndermek arasındaki farkı açıkça belirtir.

Aşağıdaki sayılar, başlık/açıklama/gövde alanlarının işleme kökenidir. “Kaynak” mevcut dil metninin kullanıldığını belirtir; ortak bölüm başlıkları ve yinelenen açıklamalar temizlenmiş olabilir. “Çevrimdışı” alanlar makine desteklidir; bu gruptaki 40 benzersiz metin birimi ayrıca asistan tarafından tek tek düzeltilmiştir.

| Dil        | Kaynak temelli alan | Asistan yazımı/düzenleme | Çevrimdışı çeviri | Kaynaksız boş alan |
| ---------- | ------------------: | -----------------------: | ----------------: | -----------------: |
| EN         |                 360 |                      116 |                 9 |                 70 |
| TR         |                 122 |                       76 |               287 |                 70 |
| FR         |                 147 |                       82 |               256 |                 70 |
| DE         |                 111 |                       80 |               294 |                 70 |
| NL         |                  35 |                       89 |               361 |                 70 |
| RU         |                 164 |                       97 |               224 |                 70 |
| **Toplam** |             **939** |                  **540** |         **1.431** |            **420** |

896 alan, boşluk normalizasyonu dışında kaynak metniyle aynıdır. Diğer alanlarda çeviri, bölüm adı yerelleştirmesi veya tekrar temizliği bulunur.

Eksik uzun metinler, [Argos Translate’ın resmî çevrimdışı paketleri](https://argos-translate.readthedocs.io/en/latest/source/examples.html) ve CTranslate2 ile derleme hazırlığı sırasında tamamlandı. EN↔TR 1.5, EN↔FR 1.9, EN↔DE 1.3, EN↔NL 1.8 ve EN↔RU 1.9 paketleri kullanıldı. Gerekli yerlerde İngilizce üzerinden geçiş yapıldı. Son veri üretiminde 8.096 benzersiz hedef-dil metin birimi kullanıldı.

Uygulama çalışma anında çeviri servisine bağlanmaz. Modeller, Python ortamı ve önbellekler uygulama paketine eklenmedi; yalnızca yerel JSON metinleri kullanılır. Talep formundaki kullanıcı verileri bu çeviri işleminin parçası değildir.

## Kaynak düzeltmeleri

- Mevcut dil sayfaları ayrı çerez oturumlarıyla incelendi. Yeni bir oturumda yalnızca “X” döndüren yanıtlar gerçek içerik sayılmadı.
- İngilizce kalmış Fransızca/Almanca/Hollandaca/Rusça metinler ve kısmen İngilizce ürün başlıkları tamamlandı. Ana sayfadaki altı ürün başlığı, tüm kategori başlıkları ve zorunlu kurumsal sayfa başlıkları asistan tarafından düzenlendi.
- Açıklamalardaki art arda yinelenen sözcük dizileri kaldırıldı; farklı bilgiler korunarak, örneğin Adam & Eve otelinin yinelenen açılış cümlesi temizlendi.
- Özdere otelleri ve Antalya turları kategorilerinin altı dil kaydındaki “kayıt bulunamadı” şablonları gerçek açıklama olarak kullanılmadı.
- Kuştur Holiday Club Village ve Manastır Hotel & Suites’in Hollandaca “Details / R” gövdeleri kaldırıldı; gerçek otel açıklamaları korundu.
- Gizlilik sayfasının FR/DE/RU ve koşullar sayfasının NL gövdelerinde bulunan üyelik kutusu yerine tam İngilizce yasal kaynak çevrildi.
- Türkçe Mystical Turkey turundaki tek harflik program yerine tam 14 günlük program ve dahil/hariç hizmetler tamamlandı; aynı kaynak fiyat tablosu korundu.
- Shared Standard Shuttle’ın ayrıntıları, Rusça kaynakta bulunan bagaj, 158 cm, 14 durak ve 60/0 dakika kurallarından altı dilde tamamlandı. İngilizce kaynaktaki kişi başı esas da korundu.
- İngilizcesi olmayan beş ürünün başlık/açıklamaları tamamlandı. Rusça Efes turunun tam İngilizce programı asistan tarafından çevrildi.
- Yorum sahiplerinin adları, şirket bilgileri, e-posta ve bağlantı adresleri korundu. Ephesus/Pollio adından kaynaklanan açık “çocuk felci çeşmesi” çeviri hatası düzeltildi.

## Son doğrulama

1.110 kayıt ve toplam 3.330 alan üzerinde otomatik bütünlük karşılaştırması yapıldı. Kaynaktaki gerçek boş alanlar ve yukarıdaki bozuk içerik istisnaları karşılaştırmada açıkça tanımlandı.

| Denetim                                  | Fark / hata |
| ---------------------------------------- | ----------: |
| Kayıt kimliği ve altı dil karşılığı      |           0 |
| Kaynak mevcutken eksik alan              |           0 |
| Yer tutucu belirteci sızıntısı           |           0 |
| Sayısal değer farkı                      |           0 |
| Tutar ve para birimi farkı               |           0 |
| Sayısal fiyat/grup tablosu hücresi farkı |           0 |
| HTML etiket yapısı farkı                 |           0 |
| href / src / id özniteliği farkı         |           0 |
| Arayüz anahtar eşliği / boş metin        |           0 |

Para tutarlarında normal boşluk ile bölünmez boşluk aynı kabul edildi; bu, fiyat değişikliği değildir. Adres ayraçları ve metrekare üst simgesi de anlamsal olarak normalleştirildi. Fiyat hesaplaması yapılmadı, para birimi çevrilmedi. Kaynakta çelişen fiyat veya koşullar otomatik olarak değiştirilmedi.

## İnceleme sınırı

Uzun programlar, bazı açıklamalar ve yasal metinler **makine destekli çeviridir**. Kaynak, sayılar, bağlantılar ve biçim korunumu denetlendi; tüm metinler altı dilde bir uzman tarafından cümle cümle editoryal veya hukuki incelemeden geçirilmiş değildir. Özellikle eski vize, tarih, iptal ve fiyat bilgileri kaynaktaki hâliyle taşınmıştır. Yayın öncesi işletmenin bu içerikleri ve uzun çevirilerin dil kalitesini gözden geçirmesi gerekir.

## Dosyalar

- `src/data/messages.json`: altı dilde arayüz metinleri.
- `src/data/translation-overrides.json`: 185 kimliğin altı dilde son içerikleri; kaynak katalog ayrı tutulur.
- Ara denetim kayıtları: `work/localization/preservation-report.json`, `offline-report.json`, `human-reviewed-cache.json`.

Son içerik JSON’u SHA-256: `1c2e42aa913a760ed139ff311aefb4b80c12d50decfbccbfdacc46fbe28e33e3`.
Kaynak katalog SHA-256: `c66230e7788b83d9a562fc90e52d9b5e63191c79719baa9d6ee233d36f223377`.
