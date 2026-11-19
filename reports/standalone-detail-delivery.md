# Tekil hizmet sayfaları — 13 Kasım 2026

Kart tıklamalarını açılır pencereye çeviren dört hizmetin `@detail` route ağacı ve DetailFrame kaldırıldı. Tur, otel, gulet ve transfer kartları artık normal Next.js bağlantısıyla kendi adresindeki tam sayfayı açar. Adresler ve altı dil karşılıkları korunur. Kart hover hareketi ve ana sayfadaki hero etkileşimi korunur.

Detay başındaki ana talep butonu korundu; bölüm menüsündeki aynı talep bağlantısı kaldırıldı. Menü yalnızca gerçekten var olan içerik bölümlerini listeler; bölümü olmayan otellerde boş menü oluşturulmaz. Mobilde ana buton görünür. Alt sabit buton ancak giriş bölümü ekranın üstünde kaldıktan sonra görünür; form görünürken gizlenir.

Yerel production build, TypeScript kontrolü ve mevcut 10 içerik/eşleştirme testi geçti. Dört hizmetten örnekler altı dilde hem lokalde hem canlıda kontrol edildi (24 + 24): HTTP 200 ve birincil talep bağlantısı sayısı 1. Tarayıcıda dört kategori kartı tam sayfa açtı, dialog sayısı 0. Klavye Enter ile tur açılışı ve geri dönüşte Kapadokya filtresinin korunması doğrulandı. 360/390 px mobilde taşma yok; sabit talep butonunun form başlığına kaydırıp odakladığı ve ardından gizlendiği doğrulandı.

Temsilî Kapadokya tur detayında üçer mobil/resmî masaüstü Lighthouse ölçümünün medyanı: performans 98/100; erişilebilirlik, best practices ve SEO 100/100. Bu, yerel üretim sunucusu ölçümüdür; canlı tüm site skoru olarak yorumlanmaz.

Canlı adres: https://magical-steps.vercel.app
Deployment: dpl_4X8pbaRDP3h7rrd79MkSEzKtyC2v (production, READY).
Bulut derlemesi 15 saniyede tamamlandı. Kaynak proje ve yerel production build güncellendi. Geri alınabilen eski route/component yedeği /private/tmp/magical-standalone-before-20261113 altında.

Kanıt: standalone-detail-live-checks.json, lighthouse-standalone-detail-summary.json ve screenshots/standalone-detail-live.png.
