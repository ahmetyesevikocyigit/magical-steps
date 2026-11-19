import json,re
from pathlib import Path
r=Path(__file__).resolve().parents[1];d=r/'src/data';c=json.loads((d/'catalog.json').read_text());o=json.loads((d/'translation-overrides.json').read_text());m=json.loads((d/'messages.json').read_text())
exclude={'en':r'NOT INCLUDED','tr':r'DAHİL DEĞİL|DAHIL DEĞIL|Dahil olmayan hizmetler','fr':r'NON INCLUS','de':r'NICHT ENTHALTEN|Nicht inbegriffen','nl':r'Niet inbegrepen','ru':r'Не включено'}
fees={'en':r'entrance fees|entry fees|admission','tr':r'giriş ücret|giriş bilet','fr':r"frais d.entry|frais d’entr|frais d'entr|droits d.entry",'de':r'Eintritt','nl':r'toegangskosten|entreegeld','ru':r'входные билет|Входных билет'}
notes={}
for item in c['items']:
    if item['kind']!='tour':continue
    rows={}
    for lang,translation in o[item['id']].items():
        body=translation.get('bodyHtml','');heads=list(re.finditer('<h2[^>]*>.*?</h2>',body,re.S));source=item['translations'].get('en',{}).get('bodyHtml','')
        # Compare the published services section; ignore fee mentions in itineraries.
        if len(heads)<2:continue
        section=body[heads[1].end():heads[2].start() if len(heads)>2 else len(body)]
        parts=re.split(exclude[lang],section,flags=re.I,maxsplit=1)
        if len(parts)!=2:continue
        yes=bool(re.search(fees[lang],parts[0],re.I));no=bool(re.search(fees[lang],parts[1],re.I))
        if yes or no:rows[lang]={'included':yes,'excluded':no}
    if any(v['included'] for v in rows.values()) and any(v['excluded'] for v in rows.values()):notes[item['id']]={'entranceFees':True,'sourceUrl':item['sourceUrl'],'versions':rows}
labels=[
'Museum and archaeological-site admission fees will be confirmed in your quote. The published language versions differ on whether they are included.',
'Müze ve ören yeri giriş ücretlerinin kapsama dahil olup olmadığını teklifinde netleştirelim. Yayınlanan programın dil sürümlerinde bu konuda farklı bilgiler var.',
'L’inclusion des billets de musées et de sites archéologiques sera précisée dans votre devis. Les versions linguistiques du programme donnent des informations différentes.',
'Ob Eintrittsgelder für Museen und Ausgrabungsstätten enthalten sind, klären wir im Angebot. Die veröffentlichten Sprachfassungen enthalten hierzu unterschiedliche Angaben.',
'Of toegang tot musea en archeologische sites is inbegrepen, bevestigen we in je offerte. De gepubliceerde taalversies geven hierover verschillende informatie.',
'Включены ли входные билеты в музеи и археологические зоны, уточним в предложении. В языковых версиях опубликованной программы есть расхождения по этому вопросу.']
for lang,text in zip(['en','tr','fr','de','nl','ru'],labels):m[lang]['tripAdmissionNote']=text
(d/'inclusion-conflicts.json').write_text(json.dumps(notes,ensure_ascii=False,indent=2)+'\n');(d/'messages.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print('Source-language admission conflicts:',len(notes))
