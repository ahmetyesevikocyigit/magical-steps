# Magical Steps content migration audit

Captured 2026-11-11. 887 public URLs inspected; 107 product entities, 39 categories, 39 editorial pages.

The source robots.txt points to /contents/sitemap.xml, which returned HTTP 404. Discovery used actual navigation and body links in all six languages.

## Locale coverage

- en: 102 products; 39 pages; 37 categories.
- tr: 55 products; 4 pages; 21 categories.
- fr: 84 products; 11 pages; 29 categories.
- de: 56 products; 11 pages; 24 categories.
- nl: 49 products; 8 pages; 20 categories.
- ru: 88 products; 10 pages; 33 categories.

## Source inconsistencies retained

- Source prices and per-person/group tables are preserved as requested. The Ephesus / House of Mary / Sirince product advertises $90.00, while its table lists 140 USD (2–6), 90 USD (7–22), and 85 USD (23–42). No automatic price calculation is performed.
- Source English copy contains mistakes; factual text is retained. CP1252 control-character punctuation was repaired.
- Source navigation includes a malformed mailto address; the app uses the visible contact-page address info@magical-steps.com.
- Some source itinerary accordion shells have only numbers and no text. These empty shells were omitted; all substantive program text is retained.
- Old third-party widgets, forms, scripts and decoration are excluded from migrated HTML.

## Unavailable source URLs

- 200: https://www.magical-steps.com/bus-transfer-0.html
- 200: https://www.magical-steps.com/efes-haritası.html
- 200: https://www.magical-steps.com/belek-otelleri.html
- 200: https://www.magical-steps.com/pakketreizen
- 200: https://www.magical-steps.com/istanbul-otelleri.html
- 200: https://www.magical-steps.com/kemer-otelleri.html
- 200: https://www.magical-steps.com/dagelijks-en-kort-pakket-turkije-tours
- 200: https://www.magical-steps.com/kusadasi-otelleri.html
- 200: https://www.magical-steps.com/marmaris-otelleri.html
- 200: https://www.magical-steps.com/ozdere-otelleri.html
- 200: https://www.magical-steps.com/turkei-touren
- 200: https://www.magical-steps.com/landausfluge
- 200: https://www.magical-steps.com/side-otelleri.html
- 200: https://www.magical-steps.com/turkije-reizen
- 200: https://www.magical-steps.com/istanbul-cikis-38626.html
- 200: https://www.magical-steps.com/istanbul-touren
- 200: https://www.magical-steps.com/bodrum-gokova-bodrum-de
- 200: https://www.magical-steps.com/christelijke-reizen
- 200: https://www.magical-steps.com/bodrum-hisaronu-bodrum-de
- 200: https://www.magical-steps.com/islamitische-reizen
- 200: https://www.magical-steps.com/marmaris-fethiye-marmaris-de
- 200: https://www.magical-steps.com/aphrodisias-hierapolis-laodicia-au-depart-distanbul.html
- 200: https://www.magical-steps.com/joodse-reizen
- 200: https://www.magical-steps.com/marmaris-hisaronu-marmaris-de
- 200: https://www.magical-steps.com/lexcursion-pamukkale-au-depart-de-kusadasi.html
- 200: https://www.magical-steps.com/segeln-gulets
- 200: https://www.magical-steps.com/mavi-yolculuk.html
- 200: https://www.magical-steps.com/zorastrian-tours-35155
- 200: https://www.magical-steps.com/priene-miletos-didyma.html
- 200: https://www.magical-steps.com/uberweisen
- 200: https://www.magical-steps.com/bodrum-gokova-bodrum-35169
- 200: https://www.magical-steps.com/marmaris-fethiye-marmaris-38560
- 200: https://www.magical-steps.com/oplata-nalicnymi-po-pribytii.html
- 200: https://www.magical-steps.com/journee-complete-a-istanbul.html
- 200: https://www.magical-steps.com/hillside-houses-herrace-houses.html
- 200: https://www.magical-steps.com/blog-1232.html
- 200: https://www.magical-steps.com/ephesus-travel-blog.html
- 200: https://www.magical-steps.com/around-kusadasi-and-izmir.html
- 200: https://www.magical-steps.com/turkey-blog.html
- 200: https://www.magical-steps.com/blog-o-putesestvijah-v-efese.html
- 200: https://www.magical-steps.com/ann-alans-blog.html
- 200: https://www.magical-steps.com/crystal-family-resort-amp
- 200: https://www.magical-steps.com/vokrug-kusadasy-i-izmirf.html
- 200: https://www.magical-steps.com/ephesus-touren-von-izmir.html
- 200: https://www.magical-steps.com/adam-amp
- 200: https://www.magical-steps.com/blog-o-turcii.html
- 200: https://www.magical-steps.com/salmakis-resort-amp
- 404: https://www.magical-steps.com/ephesus-karte-.html
- 200: https://www.magical-steps.com/mivara-luxury-resort-amp
- 204: https://www.magical-steps.com/blog-1280.html
- 200: https://www.magical-steps.com/blog-enn-i-alana.html
- 200: https://www.magical-steps.com/bodrum-holiday-resortamp
- 200: https://www.magical-steps.com/semejnyj-kurortnyj-spa–otel-crystal-vse-vkljuceno.html
- 200: https://www.magical-steps.com/queen
- 200: https://www.magical-steps.com/royal-alhambra-palace-–-all-inclusive.html
- 200: https://www.magical-steps.com/decouvrez-ephesesa-deesse-artemis.html
- 200: https://www.magical-steps.com/royal-dragon-hotel-–-all-inclusive.html
- 200: https://www.magical-steps.com/crystal-sunrise-queen-luxury-resort-amp
- 200: https://www.magical-steps.com/ephesus-tours-from-izmir-35428.html
- 204: https://www.magical-steps.com/ephesus-reiseblog.html
- 200: https://www.magical-steps.com/seven-churches-tour-35359.html
- 200: https://www.magical-steps.com/nashira-resort-hotel-amp
- 204: https://www.magical-steps.com/rund-um-kusadasi-und-izmir.html
- 200: https://www.magical-steps.com/aprodisias-hierapolis-laodicea-from-istanbul.html
- 204: https://www.magical-steps.com/turkei-blog.html
- 200: https://www.magical-steps.com/transfer
- 200: https://www.magical-steps.com/pamukkale-tours-from-kusadasi-35377.html
- 204: https://www.magical-steps.com/ann-alans-blog-1315.html
- 200: https://www.magical-steps.com/pamukkale-kusadasi-cikis-39160.html
- 200: https://www.magical-steps.com/priene-didyma-miletos.html
- 200: https://www.magical-steps.com/izmir-efes.html
- 200: https://www.magical-steps.com/7-kilise-tur.html
- 200: https://www.magical-steps.com/afrodisyashierapolis-istanbul-cikis.html
- 200: https://www.magical-steps.com/pamukkale-kusadasi-cikis.html
- 200: https://www.magical-steps.com/tam-gun-istanbul.html
- 200: https://www.magical-steps.com/tam-gun-istanbul-38680.html
- 200: https://www.magical-steps.com/gemiler/msc-bellissima.html
- 200: https://www.magical-steps.com/st-paul-efes.html
- 200: https://www.magical-steps.com/gemiler/msc-armonia.html
- 204: https://www.magical-steps.com/the-sign-sile-hotel-spa-istanbul-33347.html
- 204: https://www.magical-steps.com/blog-de-ephesus-travel.html
- 200: https://www.magical-steps.com/efesi-ve-tanrica-artemisi-kesfedin.html
- 200: https://www.magical-steps.com/ephesus-tours-from-kusadasi.html
- 204: https://www.magical-steps.com/kustur-holiday-club-village-33421.html
- 200: https://www.magical-steps.com/neden-bizi-secmelisiniz.html
- 204: https://www.magical-steps.com/autour-de-kusadasi-et-izmir.html
- 204: https://www.magical-steps.com/salmakis-resort-spa.html
- 200: https://www.magical-steps.com/kosullar-ve-sartlar.html
- 204: https://www.magical-steps.com/blog-turquie.html
- 200: https://www.magical-steps.com/privacybeleid.html
- 200: https://www.magical-steps.com/gizlilik-guvenlik.html
- 204: https://www.magical-steps.com/club-marma-hotel-33451.html
- 204: https://www.magical-steps.com/le-blog-dann-alan.html
- 200: https://www.magical-steps.com/tevredenheidsgarantie.html
- 204: https://www.magical-steps.com/mivara-luxury-resort.html
- 200: https://www.magical-steps.com/betaal-contant-bij-aankomst.html
- 204: https://www.magical-steps.com/hotel-in-xanadu-island.html
- 204: https://www.magical-steps.com/efes-gezi-blog.html
- 204: https://www.magical-steps.com/bodrum-holiday-resortspa.html
- 204: https://www.magical-steps.com/kusadasi-cevresi.html
- 204: https://www.magical-steps.com/mi-casa-beach-hotel-33417.html
- 204: https://www.magical-steps.com/doubletree-by-hilton-bodrum-marina-vista-33471.html
- 204: https://www.magical-steps.com/doubletree-by-hilton-bodrum-isil-club-resort-33472.html
- 204: https://www.magical-steps.com/tours/ephesus-tours-from-kusadasi_th/de
- 204: https://www.magical-steps.com/manastir-hotel-suites-33419.html
- 200: https://www.magical-steps.com/efeze-reisblog.html
- 204: https://www.magical-steps.com/crystal-family-resort-spa-–-alles-inklusive.html
- 200: https://www.magical-steps.com/rond-kusadasi-en-izmir.html
- 204: https://www.magical-steps.com/aquaworld-belek-33447.html
- 204: https://www.magical-steps.com/royal-alhambra-palace-tout-inclus.html
- 200: https://www.magical-steps.com/turkije-blog.html
- 204: https://www.magical-steps.com/adam-eva-alles-inklusivenur-fur-erwachsene.html
- 200: https://www.magical-steps.com/ann-alans-blog-nl.html
- 204: https://www.magical-steps.com/ela-quality-resort-belek-alles-inklusive.html
- 204: https://www.magical-steps.com/explorer-istanbulanatolia.html
- 204: https://www.magical-steps.com/kimeros-park-holiday-village-33422.html
- 204: https://www.magical-steps.com/ancien-echos-de-la-turquie-mystique.html
- 204: https://www.magical-steps.com/queens-park-goynuk-all-inclusive.html
- 204: https://www.magical-steps.com/istanbulhistoire-mediterraneenne.html
- 204: https://www.magical-steps.com/koniglicher-alhambra-palast-–-all-inclusive.html
- 204: https://www.magical-steps.com/turkiye-incil-hazineleri.html
- 204: https://www.magical-steps.com/circuit-mystique-de-la-turquie.html
- 404: https://www.magical-steps.com/royal-dragon-hotel-–-all-inclusive-33374.html
- 200: https://www.magical-steps.com/the-sign-sile-hotel-spa-istanbul-35346.html
- 500: https://www.magical-steps.com/ephesus-touren-von-kusadasi.html
- 500: https://www.magical-steps.com/ephesus-touren-ab-istanbul.html
- timeout: https://www.magical-steps.com/car-standard-prive.html
- timeout: https://www.magical-steps.com/navette-standard-partagee.html
- timeout: https://www.magical-steps.com/goulet-xanthos-3-bodrum-hisaronu-bodrum.html
- timeout: https://www.magical-steps.com/goulet-laram-bodrum-gokova-bodrum.html
- timeout: https://www.magical-steps.com/tour-zu-zwei-maria-von-jesus-christus.html
- timeout: https://www.magical-steps.com/antikes-ephesus-und-ephesus-museum.html
- timeout: https://www.magical-steps.com/antikes-ephesus-ephesus-museum-und-reihenhaeuser.html
- timeout: https://www.magical-steps.com/ephesus-dorf-sirince.html
- timeout: https://www.magical-steps.com/hohepunkte-von-ephesus-haus-der-jungfrau-maria.html
- timeout: https://www.magical-steps.com/ephesus-tours-from-bodrum.html
- timeout: https://www.magical-steps.com/customized-ephesus.html
- timeout: https://www.magical-steps.com/biblical-ephesus-tour-from-istanbul-35455.html
- timeout: https://www.magical-steps.com/ephesus-tours-from-istanbul-35429.html
- timeout: https://www.magical-steps.com/biblical-ephesus-tour-35456.html
- timeout: https://www.magical-steps.com/st-johns-and-st-paul-ephesus-tour.html
- timeout: https://www.magical-steps.com/all-in-one-ephesus-tour-35468.html
- timeout: https://www.magical-steps.com/enjoy-roman-ephesus.html
- timeout: https://www.magical-steps.com/two-mary-of-jesus-chris-tour.html
- timeout: https://www.magical-steps.com/ancient-ephesus-and-ephesus-museum-35464.html
- timeout: https://www.magical-steps.com/ancient-ephesusephesus-museumterrace-houses.html
- timeout: https://www.magical-steps.com/ephesus-sirince-village.html
- timeout: https://www.magical-steps.com/highlights-of-ephesus.html
- timeout: https://www.magical-steps.com/oriental-asian-tour-of-istanbul-35387.html
- timeout: https://www.magical-steps.com/full-day-istanbul-tour-explore-the-magnificent-old-city-35422.html
- timeout: https://www.magical-steps.com/half-day-istanbul-tour.html
- timeout: https://www.magical-steps.com/armenian-heritage-35458.html
- timeout: https://www.magical-steps.com/gulet-xanthos-3-bodrum-hisaronu-bodrum-35413.html
- timeout: https://www.magical-steps.com/derya-deniz-marmaris-fethiye-marmaris-35442.html
- timeout: https://www.magical-steps.com/grand-sailor-marmaris-hisaronu-marmaris-35417.html
- timeout: https://www.magical-steps.com/diva-deniz-marmaris-hiasaronu-marmaris.html
- 200: https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/contact-us.html
- 200: https://www.magical-steps.com/ephesus-tours/
- 200: https://www.magical-steps.com/tours-from-kusadasi_6j/
- 200: https://www.magical-steps.com/ozdere-hotels.html
- 200: https://www.magical-steps.com/private-istanbul-tours_g/
- 200: https://www.magical-steps.com/tours/ephesus-tours-from-kusadasi_th/contact-us.html
- 200: https://www.magical-steps.com/tours/ephesus-tours-from-kusadasi_th/tr
- 200: https://www.magical-steps.com/blog/the-history-of-ephesus_u/
- 200: https://www.magical-steps.com/half-day-ephesus-tours_o6/
- 200: https://www.magical-steps.com/cruises.html
- 200: https://www.magical-steps.com/blog/the-house-of-the-virgin-mary-ephesus_2/
- 200: https://www.magical-steps.com/ephesus-tours-from-istanbul_oa/
- 200: https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/
- 200: https://www.magical-steps.com/private-ephesus-tours_6/
- 200: https://www.magical-steps.com/ephesus-from-istanbul_oa/
- 200: https://www.magical-steps.com/antalya-tours.html
- 200: https://www.magical-steps.com/ephesus-travel-blog/
- 200: https://www.magical-steps.com/blog/the-temple-of-artemis-ephesus_oo/
- 200: https://www.magical-steps.com/contact/
- 200: https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/nl
- 200: https://www.magical-steps.com/cappadocia-ephesus-tours_og/
- 200: https://www.magical-steps.com/blog/the-terrace-houses-of-ephesus_66/
- 200: https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/ru
- 200: https://www.magical-steps.com/cappadocia-tours_u/
- 200: https://www.magical-steps.com/istanbul-ephesus-cappadocia-tours_62/
- 200: https://www.magical-steps.com/tours-from-izmir_6h/
- 200: https://www.magical-steps.com/tours/ephesus-tours-from-kusadasi_th/fr
- 200: https://www.magical-steps.com/full-day-ephesus-tours_h/
- 200: https://www.magical-steps.com/tours/ephesus-tours-from-kusadasi_th/nl
- 200: https://www.magical-steps.com/blog/mary-magdalene_6a/
- 200: https://www.magical-steps.com/tours/ephesus-tours-from-kusadasi_th/
- 200: https://www.magical-steps.com/istanbul-tours_g/
- 200: https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/tr
- 200: https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/fr
- 200: https://www.magical-steps.com/tours/ephesus-tours-from-kusadasi_th/ru
- 200: https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/kontaktiere-uns.html
- 200: https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/en
- 200: https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/de
- 200: https://www.magical-steps.com/blog/sirince-village-ephesus_or/

## Unresolved legacy editorial targets

These targets had no recoverable equivalent; anchor markup was removed while readable text was retained.

- http://magical-steps.com/tours/ephesus-tours-from-kusadasi_th/
- http://www.magical-steps.com
- https://magical-steps.com/blog/mary-magdalene_6a/
- https://magical-steps.com/blog/sirince-village-ephesus_or/
- https://magical-steps.com/blog/the-history-of-ephesus_u/
- https://magical-steps.com/blog/the-house-of-the-virgin-mary-ephesus_2/
- https://magical-steps.com/blog/the-temple-of-artemis-ephesus_oo/
- https://magical-steps.com/blog/the-terrace-houses-of-ephesus_66/
- https://magical-steps.com/cappadocia-ephesus-tours_og/
- https://magical-steps.com/ephesus-tours-from-istanbul_oa/
- https://magical-steps.com/istanbul-ephesus-cappadocia-tours_62/
- https://www.magical-steps.com/
- https://www.magical-steps.com/ann-alans-blog-1315.html
- https://www.magical-steps.com/ann-alans-blog-nl.html
- https://www.magical-steps.com/ann-alans-blog.html
- https://www.magical-steps.com/around-kusadasi-and-izmir.html
- https://www.magical-steps.com/autour-de-kusadasi-et-izmir.html
- https://www.magical-steps.com/blog-de-ephesus-travel.html
- https://www.magical-steps.com/blog-enn-i-alana.html
- https://www.magical-steps.com/blog-o-putesestvijah-v-efese.html
- https://www.magical-steps.com/blog-o-turcii.html
- https://www.magical-steps.com/blog-turquie.html
- https://www.magical-steps.com/efes-gezi-blog.html
- https://www.magical-steps.com/efeze-reisblog.html
- https://www.magical-steps.com/ephesus-reiseblog.html
- https://www.magical-steps.com/ephesus-travel-blog.html
- https://www.magical-steps.com/full-day-ephesus-tours_h/
- https://www.magical-steps.com/half-day-ephesus-tours_o6/
- https://www.magical-steps.com/hillside-houses-herrace-houses.html
- https://www.magical-steps.com/kusadasi-cevresi.html
- https://www.magical-steps.com/le-blog-dann-alan.html
- https://www.magical-steps.com/private-ephesus-tours_6/
- https://www.magical-steps.com/reservation/gulet-laram-bodrum-gokova-bodrum.html?book=true&turratekey=01.04.2026-30.04.2026|01.04.2026-30.04.2026|2587|9451|9451|9452||8356
- https://www.magical-steps.com/rond-kusadasi-en-izmir.html
- https://www.magical-steps.com/rund-um-kusadasi-und-izmir.html
- https://www.magical-steps.com/sign-up.html
- https://www.magical-steps.com/tours/enjoy-roman-ephesus-its-christian-heritage_6j/
- https://www.magical-steps.com/turkei-blog.html
- https://www.magical-steps.com/turkey-blog.html
- https://www.magical-steps.com/turkije-blog.html
- https://www.magical-steps.com/vokrug-kusadasy-i-izmirf.html

## Non-English entities with no unambiguous English equivalent

- {"id": "crystal-family-resortspa-all-inclusive", "locale": "nl", "url": "https://www.magical-steps.com/crystal-family-resortspa-all-inclusive.html"}
- {"id": "korolevskij-dvorec-algambra-vse-vkljuceno", "locale": "ru", "url": "https://www.magical-steps.com/korolevskij-dvorec-algambra-vse-vkljuceno.html"}
- {"id": "otel-royal-dragon-vse-vkljuceno", "locale": "ru", "url": "https://www.magical-steps.com/otel-royal-dragon-vse-vkljuceno.html"}
- {"id": "park-korolevy-gejnjuk-vse-vkljuceno", "locale": "ru", "url": "https://www.magical-steps.com/park-korolevy-gejnjuk-vse-vkljuceno.html"}
- {"id": "tury-v-efes-iz-kusadasy", "locale": "ru", "url": "https://www.magical-steps.com/tury-v-efes-iz-kusadasy.html"}

## Final integrity checks

- All 12 required editorial page entities are present.
- 107 products: 66 tours, 32 hotels, 5 sailing products, 4 transfers.
- 39 canonical categories; 39 editorial/map pages; 729 legacy aliases.
- Every legacy alias resolves to an existing new route. All category/product references resolve.
- Imported HTML has no scripts, iframes, forms, inline handlers, or unresolved local hyperlinks.
- Six-language source product coverage: EN 102, TR 55, FR 84, DE 56, NL 49, RU 88. These counts describe original source translations, not completed translation quality.
- The source exposes incomplete hotel descriptions and incomplete translated legal/editorial text. Empty source sections were retained as missing data; no amenities or contractual terms were invented.
- Some non-English source pages reproduce English body text. The UI translation overrides and fallback policy must be read alongside this source archive.
- Original source locale cookies change on cross-language links; the crawler restores each locale preference before requests. Semicolon-containing source hotel paths are preserved.
- A final targeted English recovery restored 11 product pages whose earlier responses were empty source shells or had malformed URL parsing.

### Source bodies copied verbatim from English across locales

- pages/contact: ru
- pages/contact: de
- pages/contact: nl
- pages/contact: fr
- pages/why-choose-us: de
- pages/gallery: nl
- pages/gallery: tr
- pages/gallery: fr
- pages/gallery: ru
- pages/gallery: de
- pages/reviews: ru
- pages/reviews: de
- pages/reviews: nl
- pages/reviews: fr
- pages/ephesus-map: ru
- pages/ephesus-map: nl
- pages/ephesus-map: de
- pages/ephesus-map: fr
- pages/satisfaction-guarantee: de
- pages/satisfaction-guarantee: fr
- pages/satisfaction-guarantee: ru
- pages/terms: de
- pages/terms: ru
- pages/terms: fr
- pages/pay-cash-on-arrival: de
- pages/pay-cash-on-arrival: fr
- categories/tours-from-kusadasi: de
- categories/tours-from-kusadasi: ru
- categories/tours-from-istanbul: ru
- categories/tours-from-istanbul: de
- categories/islamic-tours: tr
- categories/islamic-tours: fr
- categories/zorastrian-tours: tr
- categories/zorastrian-tours: fr
- categories/sagalassos-tours: de
- categories/sagalassos-tours: ru
- categories/christian-tours: fr
- categories/christian-tours: tr
- categories/izmir-tours: de
- categories/izmir-tours: ru
- categories/armenian-tours: nl
- categories/armenian-tours: tr
- categories/armenian-tours: fr
- categories/istanbul-tours: nl
- categories/istanbul-tours: tr
- categories/istanbul-tours: ru
- categories/istanbul-tours: fr
- categories/short-tours: tr
- categories/short-tours: ru
- categories/short-tours: nl
- categories/short-tours: de
- categories/short-tours: fr
- categories/tours-from-izmir: de
- categories/tours-from-izmir: ru
- categories/jewish-tours: fr
- categories/jewish-tours: tr
- categories/ephesus-tours: ru
- categories/ephesus-tours: nl
- categories/ephesus-tours: de
- categories/ephesus-tours: fr
- categories/ephesus-tours: tr
- categories/turkey-tours: tr
- categories/turkey-tours: ru
- categories/turkey-tours: fr
- categories/cappadocia-tours: fr
- categories/cappadocia-tours: ru
- categories/cappadocia-tours: de
- categories/cappadocia-tours: tr
- categories/cappadocia-tours: nl


## Blog ve Scholastica giriş kaydı için odaklı arşiv doğrulaması

Bu kontrol katalog ve yönlendirme verilerini değiştirmedi. Ana blog dizininin altı dildeki kayıtları aynı dört kategori kartını içeriyor. Her kartın görseli ve düğmesi ayrı bir “Read More” bağlantısı olduğundan metin çıkarımında ifade iki kez görünüyordu. Özgün hedefler:

- `/ephesus-travel-blog.html`
- `/around-kusadasi-and-izmir.html`
- `/turkey-blog.html`
- `/ann-alans-blog.html`

Bu dört `.html` hedefin arşivlenmiş yanıtı HTTP 200 olsa da 112 baytlık `<center> X </center>` hata gövdesidir. Bu dört kayıtta dil oturumu bulunmadığından yalnızca arşive dayanarak kalıcı erişilemezlik sonucu çıkarılamaz. İngilizce oturumla yalnızca `/ephesus-travel-blog.html` için yapılmak istenen odaklı yeniden doğrulamada hem `/en` hem `/` oturum başlangıcı HTTP 500 döndü; hedef için yeni geçerli içerik edinilemedi. Bu belirsizlik korunmalıdır. Ana blog dizininin “Read More” metinleri geçerli makale bağlantısı gibi sunulmamalıdır.

Aşağıdaki eski makale adresleri ise İngilizce dil oturumuyla da arşivlenmiş; her biri HTTP 200, `Magical Steps` başlığı ve boş görünür gövde içeren yaklaşık 14 KB tema kabuğu döndürüyor. Kaynak makale metni kurtarılamadı:

- `/blog/the-history-of-ephesus_u/`
- `/blog/the-terrace-houses-of-ephesus_66/`
- `/blog/the-temple-of-artemis-ephesus_oo/`
- `/blog/the-house-of-the-virgin-mary-ephesus_2/`
- `/blog/mary-magdalene_6a/`
- `/blog/sirince-village-ephesus_or/`

Eski `/ephesus-travel-blog/` dizini de EN, FR ve NL arşivlerinde aynı boş tema kabuğunu döndürüyor. Kaynak siteden kurtarılmış, metni bulunan Efes anıt/harita yazıları yeni seyahat günlüğünde gösterilebilir; bunlar kayıp blog yazılarının metni olarak tanıtılmamalıdır.

`/entrance-scholastica-baths.html` için dört arşiv varyantı incelendi. EN, TR ve NL oturumlarında gelen geçerli HTML 14.191 karakterdir ve `Entrance Scholastica Baths` başlığını taşır, fakat görünür gövde, makale metni ve görsel içermez. Dil varyantları ek içerik sağlamaz. Ayrı `/scholastica-baths.html` sayfasında kaynak İngilizce açıklama mevcuttur (927 karakter temiz HTML). Boş giriş kaydı yerine bu mevcut Scholastica Baths yazısına yönlendiren açık bir bağlantı kullanılabilir; girişe özgü bir açıklama uydurulmamalıdır.
