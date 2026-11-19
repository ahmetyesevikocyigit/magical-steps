"""Reproducible, source-backed journey metadata and reviewed UI copy.
Raw catalog translations remain untouched. No price or availability is inferred.
"""
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'src/data'
catalog = json.loads((DATA/'catalog.json').read_text())
locales = ['en','tr','fr','de','nl','ru']
messages = json.loads((DATA/'messages.json').read_text())
copy = {
'finderKeep':['Search only by: {choice}', 'Yalnızca bu tercihle ara: {choice}', 'Rechercher uniquement : {choice}', 'Nur danach suchen: {choice}', 'Zoek alleen op: {choice}', 'Искать только по условию: {choice}'],
'finderRelax_interest':['Explore other interests', 'Diğer ilgi alanlarını keşfet', 'Explorer d’autres envies', 'Andere Interessen entdecken', 'Andere interesses ontdekken', 'Рассмотреть другие интересы'],
'finderRelax_departure':['Try other starting points', 'Başka hareket noktalarına bak', 'Voir d’autres départs', 'Andere Startpunkte zulassen', 'Andere vertrekpunten bekijken', 'Рассмотреть другие города отправления'],
'finderRelax_length':['Try another duration', 'Süreyi esnet', 'Changer la durée', 'Andere Dauer zulassen', 'Andere duur toestaan', 'Рассмотреть другую длительность'],
'finderOptionHelp':['The numbers show matching tours. Options without a match cannot be selected.', 'Sayılar, seçimlerine uyan tur adedini gösterir. Uygun tur olmayan seçenekler seçilemez.', 'Les nombres indiquent les circuits correspondants. Les options sans résultat ne sont pas sélectionnables.', 'Die Zahlen zeigen passende Touren. Optionen ohne Treffer sind nicht auswählbar.', 'De aantallen tonen passende tours. Opties zonder resultaat kun je niet selecteren.', 'Числа показывают подходящие туры. Варианты без совпадений недоступны для выбора.'],
'finderUnavailable':['No tours for these choices', 'Bu seçimlerle tur yok', 'Aucun circuit pour ces choix', 'Keine Tour für diese Auswahl', 'Geen tours bij deze keuzes', 'Нет туров с такими условиями'],
'finderOptionCount':['{count, plural, one {# tour} other {# tours}}', '{count} tur', '{count, plural, one {# circuit} other {# circuits}}', '{count, plural, one {# Tour} other {# Touren}}', '{count, plural, one {# tour} other {# tours}}', '{count, plural, one {# тур} few {# тура} other {# туров}}'],
'finderTitle':['Find your kind of journey','Sana göre bir yolculuk bul','Trouvez le voyage qui vous ressemble','Finde die Reise, die zu dir passt','Vind de reis die bij je past','Найдите путешествие по душе'],
'finderInviteTitle':['Not sure where to begin?','Nereden başlayacağına karar veremedin mi?','Vous hésitez encore ?','Noch unentschlossen?','Nog geen keuze gemaakt?','Не знаете, с чего начать?'],
'finderDescription':['Your time, your starting point, your interests. Three simple choices to find a tour that fits.','Zamanını, hareket noktanı ve ilgini çeken yerleri seç. Üç adımda sana uygun turları birlikte bulalım.','Votre temps, votre point de départ, vos envies. Trois choix simples pour trouver votre circuit.','Deine Zeit, dein Startpunkt, deine Interessen. Mit drei einfachen Angaben zur passenden Tour.','Je tijd, je vertrekpunt, je interesses. Vind in drie eenvoudige stappen een passende tour.','Ваше время, место отправления и интересы. Три простых шага к подходящему туру.'],
'finderStart':['Find my tour','Bana uygun turu bul','Trouver mon circuit','Meine Tour finden','Vind mijn tour','Подобрать тур'],
'finderSteps':['Tour selection steps','Tur seçme adımları','Étapes de sélection','Schritte zur Tourauswahl','Stappen voor tourkeuze','Шаги подбора тура'],
'finderStep_length':['Time','Süre','Durée','Dauer','Duur','Время'],
'finderStep_departure':['Starting point','Hareket noktası','Départ','Startpunkt','Vertrek','Отправление'],
'finderStep_interest':['Interests','İlgi alanı','Envies','Interessen','Interesses','Интересы'],
'finderQuestion_length':['How much time do you have?','Yolculuğa ne kadar zaman ayırdın?','De combien de temps disposez-vous ?','Wie viel Zeit hast du?','Hoeveel tijd heb je?','Сколько времени у вас есть?'],
'finderQuestion_departure':['Where will your journey begin?','Yolculuğun nereden başlasın?','D’où souhaitez-vous partir ?','Wo soll deine Reise beginnen?','Waar begint je reis?','Откуда начнётся путешествие?'],
'finderQuestion_interest':['What would you love to discover?','En çok neyi keşfetmek istersin?','Qu’aimeriez-vous découvrir ?','Was möchtest du entdecken?','Wat wil je ontdekken?','Что вам хотелось бы открыть?'],
'finder_length_any':['I’m flexible','Henüz karar vermedim','Je suis flexible','Ich bin flexibel','Ik ben flexibel','Пока не решил(а)'],
'finder_length_day':['A day','Bir gün','Une journée','Ein Tag','Een dag','Один день'],
'finder_length_short':['2–3 days','2–3 gün','2–3 jours','2–3 Tage','2–3 dagen','2–3 дня'],
'finder_length_week':['4–7 days','4–7 gün','4–7 jours','4–7 Tage','4–7 dagen','4–7 дней'],
'finder_length_long':['8 days or more','8 gün ve üzeri','8 jours ou plus','8 Tage oder mehr','8 dagen of langer','8 дней и больше'],
'finder_departure_any':['Any starting point','Hareket noktası fark etmez','Tous les départs','Beliebiger Startpunkt','Elk vertrekpunt','Любой город'],
'finder_interest_any':['No preference', 'Özel bir tercihim yok', 'Sans préférence', 'Keine bestimmte Vorliebe', 'Geen voorkeur', 'Без предпочтений'],
'finder_interest_history':['Ancient cities & history','Antik kentler ve tarih','Cités antiques et histoire','Antike Städte & Geschichte','Oude steden en geschiedenis','Древние города и история'],
'finder_interest_faith':['Faith & heritage','İnanç ve kültürel miras','Foi et patrimoine','Glaube & Kulturerbe','Geloof en erfgoed','Вера и наследие'],
'finder_interest_landscape':['Landscapes & nature','Doğa ve manzaralar','Nature et paysages','Natur & Landschaften','Natuur en landschappen','Природа и пейзажи'],
'finder_interest_city':['City discoveries','Şehir keşifleri','Découvertes urbaines','Städte entdecken','Steden ontdekken','Знакомство с городом'],
'finderShowResults':['Show my tours','Bana uygun turları göster','Voir mes circuits','Passende Touren anzeigen','Toon mijn tours','Показать туры'],
'finderResultsTitle':['Journeys to make your own','Yolculuğun burada başlayabilir','Votre voyage peut commencer ici','Hier könnte deine Reise beginnen','Hier kan jouw reis beginnen','Ваше путешествие может начаться здесь'],
'finderResultCount':['{count, plural, one {# matching tour} other {# matching tours}}','Seçimlerine uygun {count} tur','{count, plural, one {# circuit correspondant} other {# circuits correspondants}}','{count, plural, one {# passende Tour} other {# passende Touren}}','{count, plural, one {# passende tour} other {# passende tours}}','{count, plural, one {# подходящий тур} few {# подходящих тура} other {# подходящих туров}}'],
'finderChange':['Change my choices','Seçimlerimi değiştir','Modifier mes choix','Auswahl ändern','Mijn keuzes aanpassen','Изменить выбор'],
'finderNoMatch':['We don’t have a published tour matching all three choices. Try a different duration or starting point, or tell us about your plans.','Yayınlanan turlar arasında üç seçimine birden uyan bir rota yok. Süreyi veya hareket noktanı değiştirebilir, istersen yolculuğunu birlikte planlayabiliriz.','Aucun circuit publié ne correspond aux trois choix. Modifiez la durée ou le départ, ou parlez-nous de votre projet.','Keine veröffentlichte Tour passt zu allen drei Angaben. Ändere die Dauer oder den Startpunkt, oder erzähle uns von deinen Plänen.','Geen gepubliceerde tour past bij alle drie je keuzes. Kies een andere duur of vertrekplaats, of vertel ons over je plannen.','Среди опубликованных туров нет варианта по всем трём условиям. Измените длительность или город отправления либо расскажите нам о своих планах.'],
'tripDuration':['Duration','Süre','Durée','Dauer','Duur','Продолжительность'],
'tripDeparture':['Starting point','Hareket noktası','Départ','Startpunkt','Vertrekpunt','Отправление'],
'tripDestination':['Destination','Destinasyon','Destination','Reiseziel','Bestemming','Направление'],
'tripMeeting':['Meeting & return','Buluşma ve dönüş','Rendez-vous et retour','Treffpunkt & Rückkehr','Ontmoeting en terugkeer','Встреча и возвращение'],
'tripMeetingNote':['Tell us your hotel, port or airport in the enquiry. We’ll confirm the meeting place, time and return arrangements for your chosen date.','Talebinde otelini, limanını veya havalimanını belirt. Seçtiğin tarihe göre buluşma yeri, saat ve dönüş düzenini birlikte netleştirelim.','Indiquez votre hôtel, port ou aéroport dans la demande. Nous confirmerons le lieu, l’heure et les modalités du retour pour la date choisie.','Nenne uns in der Anfrage dein Hotel, deinen Hafen oder Flughafen. Treffpunkt, Uhrzeit und Rückkehr stimmen wir für dein Reisedatum mit dir ab.','Vermeld je hotel, haven of luchthaven in je aanvraag. We bevestigen de ontmoetingsplaats, tijd en terugreis voor je gekozen datum.','Укажите в запросе отель, порт или аэропорт. Мы согласуем место и время встречи, а также возвращение на выбранную дату.'],
'tripRoute':['A look at the route','Rotaya bir bakış','Aperçu de l’itinéraire','Die Route im Überblick','De route in beeld','Маршрут на карте'],
'tripMap':['Open in Google Maps','Google Haritalar’da aç','Ouvrir dans Google Maps','In Google Maps öffnen','Openen in Google Maps','Открыть в Google Картах'],
'tripMapNote':['Main stops from the itinerary. This is a location overview, not a live navigation route.','Programdaki başlıca duraklar gösterilir; harita canlı yol tarifi değildir.','Principales étapes du programme. Cette vue de localisation n’est pas un itinéraire de navigation en direct.','Wichtige Stationen des Programms. Die Übersicht zeigt Orte, keine Live-Navigationsroute.','De belangrijkste plaatsen uit het programma. Dit is een locatieoverzicht, geen live navigatieroute.','Основные остановки программы. Обзор показывает расположение мест, а не маршрут навигации.'],
'tripPriceNote':['These published prices come from the existing tour programme. They are not a live quotation; dates, group size and services will be confirmed with your enquiry.','Bu fiyatlar mevcut tur programından aktarılmıştır. Canlı teklif değildir; tarih, kişi sayısı ve hizmetler talebinle birlikte netleştirilir.','Ces tarifs proviennent du programme publié. Ils ne constituent pas un devis en temps réel ; dates, effectif et prestations seront confirmés avec votre demande.','Diese Preise stammen aus dem veröffentlichten Programm. Sie sind kein aktuelles Angebot; Datum, Gruppengröße und Leistungen bestätigen wir mit deiner Anfrage.','Deze prijzen komen uit het bestaande programma. Ze zijn geen actuele offerte; datum, groepsgrootte en diensten worden bij je aanvraag bevestigd.','Цены перенесены из опубликованной программы и не являются актуальным предложением. Даты, число участников и услуги уточняются при запросе.'],
'tripProgramNote':['The detailed programme is shown below. The final schedule is confirmed for your travel date.','Ayrıntılı programı aşağıda bulabilirsin. Kesin akış seyahat tarihine göre netleştirilir.','Le programme détaillé figure ci-dessous. Le déroulement final sera confirmé pour votre date de voyage.','Das ausführliche Programm findest du unten. Den endgültigen Ablauf bestätigen wir für dein Reisedatum.','Hieronder staat het uitgebreide programma. Het definitieve schema wordt voor je reisdatum bevestigd.','Подробная программа приведена ниже. Окончательное расписание уточняется на дату поездки.'],
'tripOtherDetails':['Further details','Diğer ayrıntılar','Autres précisions','Weitere Angaben','Meer details','Дополнительные сведения'],
}
for key, values in copy.items():
    assert len(values)==6,key
    for lang,value in zip(locales,values):messages[lang][key]=value
(DATA/'messages.json').write_text(json.dumps(messages,ensure_ascii=False,indent=2)+'\n')

# Each departure is supported by the programme's arrival/pickup paragraph or its explicit source category.
override_departures={
'all-in-one-ephesus-tour':['Kuşadası','Izmir'],
'ancient-and-old-izmir-tour':['Izmir'],
'ancient-echoes-for-modern-pilgrims':['Istanbul'],
'ancient-echoes-of-mystical-turkey':['Istanbul'],
'armenian-heritage':['Istanbul'],
'biblical-ephesus-tour-from-istanbul':['Istanbul'],
'biblical-ephesus-tour':[],
'biblical-treasures-of-turkey':['Istanbul'],
'breathtaking-istanbul':['Istanbul'],
'customized-ephesus-tour':[],
'discover-the-hidden-beauty-of-eastern-turkey':['Istanbul'],
'ephesus-tours-from-izmir-c':['Bodrum'],
'ephesus-tours-from-izmir-eph-24':['Izmir'],
'explore-exotic-eastern-turkey':['Istanbul'],
'explore-istanbul-and-anatolia':['Istanbul'],
'fascinating-balloon-tour-in-cappadocia':['Cappadocia'],
'gobeklitepe-tours':['Istanbul','Izmir'],
'in-the-steps-of-alexander-the-great':['Istanbul'],
'in-the-steps-of-persian-kings':['Istanbul'],
'in-the-steps-of-st-paul':['Istanbul'],
'islamic-treasures-of-turkey':['Istanbul'],
'istanbul-and-cappadocia-tour':['Istanbul'],
'istanbul-and-ephesus-tour':['Istanbul'],
'istanbul-ephesus-and-cappadocia-tour':['Istanbul'],
'istanbul-in-the-steps-of-sufies':['Istanbul'],
'istanbul-mediterranean-history':['Istanbul'],
'istanbul-the-anatolian-experience':['Istanbul'],
'istanbul-the-islamic-heritage':['Istanbul'],
'jewish-heritage':['Istanbul'],
'magical-turkey':['Istanbul'],
'myra':['Antalya'], 'pergeaspendos':['Antalya'], 'phaselis':['Antalya'],
'oriental-asian-tour-of-istanbul':['Istanbul'],
'pamukkale-tours-from-izmir':['Kuşadası'],
'priene-miletos-didyma-tour':['Kuşadası','Bodrum'],
'rumi-s-call-anatolian-culture':['Istanbul'],
'seven-churches-the-biblical-coast':['Istanbul'],
'seven-churches-tour':['Istanbul'],
'sirince-from-kusadasi':['Kuşadası'],
'the-lost-city-of-sagalassos-tour':['Kuşadası'],
'the-mystical-turkey-tour':['Istanbul'],
'tury-v-efes-iz-kusadasy':['Kuşadası'],
}
facts={}
for item in catalog['items']:
    if item['kind']!='tour':continue
    slug=item['slug'];cats=item['categoryIds'];d=item['duration'];text=item['translations'].get('en',{});body=re.sub('<[^>]+>',' ',text.get('bodyHtml',''))
    days=re.search(r'(\d+)\s*Day',d,re.I)
    days=int(days[1]) if days else (1 if re.search(r'hour|час',d,re.I) else None)
    if slug in ['gobeklitepe-tours','myra','pergeaspendos','phaselis']:days=1
    departure=override_departures.get(slug)
    if departure is None:
        if 'from-istanbul' in slug or item['destination']=='Istanbul':departure=['Istanbul']
        elif 'from-kusadasi' in slug or re.search(r'welcome you at Kusadasi|pick you up from Kusadasi',body,re.I):departure=['Kuşadası']
        else:departure=[]
    interests=[]
    if re.search(r'Ephesus|ancient|archaeolog|archeolog|histor|heritage|Temple',text.get('title','')+' '+body,re.I):interests.append('history')
    if any(re.search(r'christian|islamic|armenian|jewish|zorastrian',c) for c in cats) or re.search(r'Biblical|Churches|St\.|Mary|Christian|Suf|Islamic|Persian Kings',text.get('title',''),re.I):interests.append('faith')
    if item['destination'] in ['Cappadocia','Pamukkale'] or re.search(r'cappadocia|pamukkale|balloon',slug):interests.append('landscape')
    if item['destination'] in ['Istanbul','Izmir']:interests.append('city')
    facts[item['id']]={'days':days,'departures':departure,'interests':interests,'sourceUrl':item['sourceUrl']}

# Coordinates are a lightweight location overview; the ordered stops follow the source text.
places={
'Devrent':(38.673,34.886),'Göreme':(38.641,34.845),'Derinkuyu':(38.373,34.735),'Ihlara':(38.248,34.300),'Kaymaklı':(38.460,34.752),'Mustafapaşa':(38.583,34.899),
'Meryem Ana Evi':(37.912,27.332),'Efes':(37.940,27.341),'Şirince':(37.944,27.431),'Artemis Tapınağı':(37.950,27.364),'Efes Müzesi':(37.949,27.368),
'Hierapolis':(37.925,29.124),'Pamukkale':(37.921,29.121),'Priene':(37.659,27.297),'Milet':(37.530,27.277),'Didyma':(37.385,27.257),
'Boğaziçi':(41.065,29.040),'Kariye':(41.031,28.939),'Süleymaniye':(41.016,28.964),'Mısır Çarşısı':(41.016,28.970),
'Göbeklitepe':(37.223,38.922),'Harran':(36.865,39.026),'Şanlıurfa':(37.167,38.795),
'Thyatira':(38.922,27.839),'Sardes':(38.488,28.040),'Philadelphia':(38.351,28.517),'Laodikeia':(37.836,29.107),'İzmir':(38.423,27.142),'Pergamon':(39.133,27.184)
}
routes={
'cappadocia-tours-from-istanbul':['Devrent','Göreme','Derinkuyu','Ihlara','Kaymaklı','Mustafapaşa'],
'ephesus-house-of-the-virgin-mary-and-sirince-village':['Meryem Ana Evi','Efes','Şirince','Artemis Tapınağı'],
'all-in-one-ephesus-tour':['Meryem Ana Evi','Efes','Efes Müzesi','Artemis Tapınağı'],
'pamukkale-tours-from-kusadasi':['Hierapolis','Pamukkale'],
'pamukkale-tours-from-izmir':['Hierapolis','Pamukkale'],
'priene-miletos-didyma-tour':['Priene','Milet','Didyma'],
'full-day-istanbul-tour-marvelous-istanbul-tour':['Boğaziçi','Kariye','Süleymaniye','Mısır Çarşısı'],
'gobeklitepe-tours':['Göbeklitepe','Harran','Şanlıurfa'],
'seven-churches-tour':['Thyatira','Sardes','Philadelphia','Hierapolis','Laodikeia','Efes','İzmir','Pergamon']
}
for slug,stops in routes.items():facts[slug]['stops']=[{'name':name,'lat':places[name][0],'lng':places[name][1]} for name in stops]
(DATA/'tour-facts.json').write_text(json.dumps(facts,ensure_ascii=False,indent=2)+'\n')
print(f'Prepared {len(facts)} source-linked tour facts and {len(copy)} UI messages in six languages.')
