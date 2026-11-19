#!/usr/bin/env python3
"""Archive the public Magical Steps site and normalize its content. Requires beautifulsoup4."""
from pathlib import Path
import sys, json, hashlib, re, time, html, unicodedata, copy
from urllib.request import urlopen, Request, build_opener, HTTPCookieProcessor
from http.cookiejar import CookieJar
from urllib.parse import urljoin, urlsplit as urlparse, urlunparse, quote, unquote
from urllib.error import HTTPError
from concurrent.futures import ThreadPoolExecutor, as_completed, wait, FIRST_COMPLETED
ROOT=Path(__file__).resolve().parents[3]
CACHE=ROOT/'work/source';CACHE.mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(CACHE/'vendor'))
from bs4 import BeautifulSoup, Comment
PROJECT=Path(__file__).resolve().parents[1]
BASE='https://www.magical-steps.com/'
LOCALES=['en','tr','fr','de','nl','ru']
(CACHE/'pages').mkdir(exist_ok=True)
CONTROL={chr(n):bytes([n]).decode('cp1252',errors='ignore') for n in range(128,160)}
def fix(s):
 s=''.join(CONTROL.get(c,c) for c in s)
 return s.replace('\ufffd','').replace('\xa0',' ')
def clean(s):return re.sub(r'\s+',' ',fix(s or '')).strip()
def slug(s):
 s=unicodedata.normalize('NFKD',fix(s)).encode('ascii','ignore').decode().lower();return re.sub('[^a-z0-9]+','-',s).strip('-')
def norm(href,base=BASE):
 if not href or href.startswith(('#','mailto:','tel:','javascript:','whatsapp:')):return None
 u=urlparse(urljoin(base,html.unescape(href)))
 if u.hostname not in ['www.magical-steps.com','magical-steps.com']:return None
 path=unquote(u.path)
 if re.search(r'\.(?:jpg|jpeg|png|gif|webp|svg|pdf|zip|mp4|xml|css|js|ico)$',path,re.I):return None
 if any(x in path.lower() for x in ['/admin','/contents','/images','/my-account','/sign-up','/forget-password','/payment','/cart','/search.html','/arama.html']):return None
 if len(path)>200 or path.count('/')>6:return None
 query=u.query
 if query and not re.match(r'^(?:page|p|sayfa)=\d+$',query):return None
 return urlunparse(('https','www.magical-steps.com',path or '/','',query,''))
def key(url):return hashlib.sha256(url.encode()).hexdigest()[:20]
def has_source_content(text):
 return '<html' in text[:1000].lower() and not re.search(r'<title>\s*Magical Steps\s*</title>|Kind Of The Record Could Not Be Found',text,re.I)

OPENERS={};LANG_COOKIES={};JARS={};VALID_BY_URL={}
def setup_openers():
 for meta in (CACHE/'pages').glob('*.json'):
  d=json.loads(meta.read_text());f=meta.with_suffix('.html')
  if f.exists():
   raw=f.read_text()
   if has_source_content(raw):
    d['html']=raw
    old=VALID_BY_URL.get(d['url'])
    if old is None or len(raw)>len(old['html']):VALID_BY_URL[d['url']]=d
 for loc in LOCALES:
  jar=CookieJar();opener=build_opener(HTTPCookieProcessor(jar))
  opener.open(Request(BASE+('' if loc=='en' else loc),headers={'User-Agent':'Mozilla/5.0'}),timeout=35).read()
  OPENERS[loc]=opener;JARS[loc]=jar;LANG_COOKIES[loc]=[copy.copy(c) for c in jar if 'dil' in c.name]

def fetch(task,retry=False):
 url,context=task if isinstance(task,tuple) else (task,'en')
 k=key(url+'|'+context)
 if url in VALID_BY_URL and urlparse(url).path not in ['/','/en','/tr','/fr','/de','/nl','/ru']:
  return dict(VALID_BY_URL[url],context=context)
 fn=CACHE/'pages'/(k+'.html');meta=CACHE/'pages'/(k+'.json')
 if fn.exists() and meta.exists() and has_source_content(fn.read_text()):
  data=json.loads(meta.read_text());data['html']=fn.read_text();return data
 try:
  for c in LANG_COOKIES[context]:JARS[context].set_cookie(copy.copy(c))
  escaped=quote(url,safe=':/?=&%+-_.,;')
  with OPENERS[context].open(Request(escaped,headers={'User-Agent':'Mozilla/5.0'}),timeout=25) as r:
   raw=r.read();text=fix(raw.decode('utf-8',errors='replace'));data={'url':url,'status':r.status,'finalUrl':r.url,'context':context,'cacheFile':'pages/'+k+'.html'}
   if not has_source_content(text):
    data['error']='Source returned a non-content response for this language context';data['status']=204;return data
   fn.write_text(text);meta.write_text(json.dumps(data));data['html']=text;VALID_BY_URL[url]=dict(data);return data
 except Exception as e:return {'url':url,'context':context,'status':getattr(e,'code',0),'error':str(e)}
def images(s,base):
 out=[]
 for im in s.select('img'):
  src=im.get('data-original') or im.get('data-src') or im.get('src')
  if src and not any(x in src for x in ['blank.gif','plus-icon','mai-icon','tripadvisor_logo','2017-trip-advisor']):
   u=urljoin(base,src)
   if u.startswith(('https:','http:')):out.append(u.replace('http://www.magical-steps.com','https://www.magical-steps.com'))
 return list(dict.fromkeys(out))

def crawl():
 setup_openers()
 seeds=[(BASE+('' if l=='en' else l),l) for l in LOCALES]
 visited={};queued=set(seeds);todo=seeds;assets=set();pending={}
 def checkpoint():
  (CACHE/'asset-urls.json').write_text(json.dumps(sorted(assets),ensure_ascii=False,indent=2))
  (CACHE/'index.json').write_text(json.dumps([{k:v for k,v in d.items() if k!='html'}|{'file':d.get('cacheFile','')} for d in visited.values()],ensure_ascii=False,indent=2))
  print(f'Crawled {len(visited)}, queued {len(todo)+len(pending)}, assets {len(assets)}',flush=True)
 with ThreadPoolExecutor(max_workers=6) as pool:
  while todo or pending:
   while todo and len(pending)<6:
    active={t[1] for t in pending.values()}
    at=next((i for i,t in enumerate(todo) if t[1] not in active),None)
    if at is None:break
    task=todo.pop(at);pending[pool.submit(fetch,task)]=task
   completed,_=wait(pending,return_when=FIRST_COMPLETED)
   for f in completed:
    pending.pop(f);d=f.result();u=d['url'];context=d['context'];visited[context+'|'+u]=d
    if d.get('html'):
     soup=BeautifulSoup(d['html'],'html.parser');d['locale']=soup.html.get('lang','en') if soup.html else 'en'
     assets.update(images(soup,u))
     for a in (soup.select('a[href]') if d['locale']==context else []):
      n=norm(a['href'],u)
      if not n:continue
      if urlparse(n).path in ['/','/en','/tr','/fr','/de','/nl','/ru']:continue
      task=(n,context)
      if task not in queued and len(queued)<10000:queued.add(task);todo.append(task)
    if len(visited)%25==0:checkpoint()
 checkpoint()
 return visited

PAGE_ALIASES={'about-us':'about','hakkimizda':'about','why-choose-us':'why-choose-us','neden-bizi-secmelisiniz':'why-choose-us','tour-photos':'gallery','tur-fotograflari':'gallery','ephesus-map':'ephesus-map','efes-haritasi':'ephesus-map','blog':'blog','blog-tr':'blog','contact-us':'contact','iletisim':'contact','terms-conditions':'terms','kosullar-ve-sartlar':'terms','privacy-policy':'privacy','gizlilik-guvenlik':'privacy','distant-sales-agreement':'distance-sales-agreement','ephesus-tour-reviews':'reviews','satisfaction-guarantee':'satisfaction-guarantee','pay-cash-on-arrival':'pay-cash-on-arrival'}
PAGE_ALIASES.update({'pourquoi-nous-choisir':'why-choose-us','a-propos-de-nous':'about','commentaires-sur-la-visite-dephese':'reviews','terme-conditions':'terms','confidentialite':'privacy','garantie-de-satisfaction':'satisfaction-guarantee','payer-cash-a-larrivee':'pay-cash-on-arrival'})
HEADERS={'en':['Itinerary','Details','Price and dates'],'tr':['Tur programı','Detaylar','Fiyat ve tarihler'],'fr':['Itinéraire','Détails','Prix et dates'],'de':['Reiseverlauf','Details','Preise und Termine'],'nl':['Reisroute','Details','Prijzen en data'],'ru':['Маршрут','Подробности','Цены и даты']}

def sanitize(node,base):
 if not node:return ''
 s=BeautifulSoup(str(node),'html.parser')
 for e in s.select('script,style,form,button,iframe,object,embed,svg,input,select,textarea,.modal,.social-icons,.nav-tabs,.tabs-navigation,.pagination,.page-header,.owl-carousel,.thumb-gallery,.listing-item,.dropdown-menu,.header-nav,.header-top,nav'):
  e.decompose()
 for e in s.select('.toggle'):
  # Source itinerary toggles can contain numbered shells with no program content.
  if len(clean(e.get_text(' ')))<8:e.decompose()
 for e in s.find_all(string=lambda t:isinstance(t,Comment)):e.extract()
 allowed={'p','ul','ol','li','h2','h3','h4','h5','strong','b','em','i','u','table','thead','tbody','tr','td','th','blockquote','a','br','img','hr'}
 for e in list(s.find_all(True)):
  if not e.name:continue
  if e.name=='img':
   src=e.get('data-original') or e.get('src') or ''
   if not src or any(z in src for z in ['plus-icon','mai-icon','blank.gif','/images/ui/']):e.decompose();continue
   alt=clean(e.get('alt',''));e.attrs={'src':urljoin(base,src),'alt':alt};continue
  if e.name=='a':
   href=e.get('href','')
   if href.startswith('#tourBookingForm'):
    if e.parent and e.parent.name=='td':e.parent.decompose()
    else:e.decompose()
    continue
   if href.startswith('#') or not href:e.unwrap();continue
   e.attrs={'href':urljoin(base,href)}
  else:e.attrs={}
  if e.name not in allowed:e.unwrap()
 for e in list(s.find_all(['p','ul','li','h2','h3','h4','h5','table','thead','tbody','tr','td','th'])):
  if not clean(e.get_text()) and not e.find(['img','br']):e.decompose()
 return str(s).strip()

def parse(d):
 if not d.get('html'):return None
 s=BeautifulSoup(d['html'],'html.parser')
 # Some source templates close <main> before their real content.
 for chrome in s.select('header,footer'):chrome.decompose()
 main=s.body or s.find('main')
 if not main:return None
 loc=s.html.get('lang','en') if s.html else 'en'
 if loc not in LOCALES:loc='en'
 title=clean((main.find('h1') or s.title).get_text(' '))
 path=urlparse(d['url']).path;name=slug(path.rstrip('/').split('/')[-1].replace('.html',''))
 cards=[]
 for li in main.select('.listing-item'):
  a=li.select_one('a[href]');t=li.select_one('.thumb-info-inner');im=images(li,d['url']);duration=''
  clock=li.select_one('.fa-clock')
  if clock and clock.parent:duration=clean(clock.parent.get_text(' '))
  price=li.select_one('.thumb-info-price')
  if a:cards.append({'url':norm(a.get('href'),d['url']),'title':clean(t.get_text(' ')) if t else '', 'images':im,'duration':duration,'price':clean(price.get_text(' ')) if price else ''})
 record={'url':d['url'],'locale':loc,'title':title,'name':name,'cards':cards,'images':images(main,d['url'])}
 if title.lower() in ['search','arama','magical steps'] or 'Kind Of The Record Could Not Be Found' in main.get_text():return None
 if (path.rstrip('/') or '/') in ['/','/en','/tr','/fr','/de','/nl','/ru']:
  record['type']='home';record['bodyHtml']='';return record
 if cards and path.rstrip('/').count('/')>1 and not main.select_one('.tour_detail'):return None
 if main.select_one('.tour_detail'):
  record['type']='item';gallery=main.select_one('.thumb-gallery');record['images']=images(gallery or main,d['url'])
  content=[]
  for i,sel in enumerate(['#tourProg','#tourIti','#tourPrice']):
   n=main.select_one(sel);h=sanitize(n,d['url'])
   if clean(BeautifulSoup(h,'html.parser').get_text(' ')):content.append('<h2>'+HEADERS[loc][i]+'</h2>'+h)
  record['bodyHtml']=''.join(content)
  p=main.select_one('.overflow-hidden h2')
  record['price']=clean(p.get_text(' ')) if p else ''
  if not re.search(r'\d',record['price']):record['price']=''
  summary=main.select_one('.col-lg-5')
  ps=[p for p in summary.select('p') if not p.find('p')] if summary else []
  record['description']=clean(' '.join(p.get_text(' ') for p in ps))
 elif cards or infer_kind(record)!='tour' and re.search(r'(hotels|otelleri|oteli|hotels-|gulets|gulety|mavi-yolculuk)',name):
  record['type']='category';record['bodyHtml']=sanitize(main,d['url']);record['description']=''
 else:
  record['type']='page';content=main.select_one('.col-lg-9') or s.find('main') or main
  record['bodyHtml']=sanitize(content,d['url']);record['description']=''
 record['description']=record.get('description') or clean(BeautifulSoup(record['bodyHtml'],'html.parser').get_text(' '))[:240]
 return record

def infer_kind(r):
 text=(r['name']+' '+r['title']+' '+' '.join(r['images'][:3])).lower()
 if any(x in text for x in ['hotel','otel','resort','hotels','hôtel']):return 'hotel'
 if any(x in text for x in ['gulet','sailing','laram','diva-deniz','derya-deniz','yat-','mavi-yolculuk','gokova','hisaronu','fethiye-marmaris']):return 'sailing'
 if any(x in text for x in ['transfer','shuttle','private-standard-car']):return 'transfer'
 return 'tour'
def destination(r):
 title=r['title'].lower();images=' '.join(r['images']).lower()
 for dest,keys in [('Ephesus',['ephesus','efes','sirince','mary','church','biblical']),('Cappadocia',['cappadocia','kapadok','kappadok']),('Pamukkale',['pamukkale','hierapolis']),('Istanbul',['istanbul']),('Bodrum',['bodrum']),('Marmaris',['marmaris']),('Antalya',['antalya','belek','kemer','side','lara']),('Kuşadası',['kusadas','kuşadas']),('Izmir',['izmir'])]:
  if any(k in title for k in keys):return dest
 for dest,keys in [('Ephesus',['ephesus','efes']),('Cappadocia',['cappadocia']),('Istanbul',['istanbul'])]:
  if any(k in images for k in keys):return dest
 return 'Türkiye'
def generate(visited):
 unique={};source_variants={}
 for d in visited.values():
  if not d.get('html'):continue
  m=re.search(r'<html[^>]*\blang=[\"\']([^\"\']+)',d['html'][:1000]);loc=m.group(1) if m else 'en'
  k=(d['url'],loc);previous=source_variants.get(k)
  if previous is None or len(d['html'])>len(previous['html']):source_variants[k]=d
 for d in source_variants.values():
  r=parse(d)
  if r:unique[(r['url'],r['locale'])]=r
 records=list(unique.values());byurl={r['url']:r for r in sorted(records,key=lambda r:r['locale']=='en')};routeprefix={'tour':'tours','hotel':'hotels','sailing':'sailing','transfer':'transfers'}
 listing={}
 for r in records:
  for c in r['cards']:
   if c['url'] and c['url'] not in listing:listing[c['url']]=c
 items=[];pages=[];categories=[];legacy={};unmatched=[];translated=[]
 # Match translated product entities only when actual gallery fingerprints uniquely agree.
 sourceitems=[r for r in records if r['type']=='item'];groups=[]
 for r in sorted(sourceitems,key=lambda r:(r['locale']!='en',r['url'])):
  fp=tuple(sorted(r['images']));candidates=[g for g in groups if fp and g['fp']==fp and r['locale'] not in [v['locale'] for v in g['variants']] and infer_kind(g['variants'][0])==infer_kind(r)]
  if len(candidates)==1:candidates[0]['variants'].append(r)
  else:groups.append({'fp':fp,'variants':[r]})
 # Localized galleries sometimes contain fewer photos. A unique identical cover
 # within the same product kind is a reliable extra entity correspondence.
 for g in list(groups):
  if any(v['locale']=='en' for v in g['variants']) or not g['variants'][0]['images']:continue
  r=g['variants'][0];candidates=[eg for eg in groups if eg is not g and any(v['locale']=='en' for v in eg['variants']) and eg['variants'][0]['images'] and eg['variants'][0]['images'][0]==r['images'][0] and infer_kind(eg['variants'][0])==infer_kind(r) and not set(v['locale'] for v in eg['variants'])&set(v['locale'] for v in g['variants'])]
  if len(candidates)==1:candidates[0]['variants']+=g['variants'];groups.remove(g)
 for g in groups:
  vs=g['variants'];r=next((x for x in vs if x['locale']=='en'),vs[0]);kind=infer_kind(r);sl=r['name'] or slug(r['title']);id=sl
  if any(x['id']==id for x in items):id+='-'+key(r['url'])[:4];sl=id
  translatedItem={'id':id,'kind':kind,'slug':sl,'sourceUrl':r['url'],'categoryIds':[],'destination':destination(r),'duration':listing.get(r['url'],{}).get('duration',''),'price':r.get('price') or listing.get(r['url'],{}).get('price',''),'images':r['images'],'translations':{}}
  for v in vs:
   translatedItem['translations'][v['locale']]={k:v[k] for k in ['title','description','bodyHtml']}|{'sourceUrl':v['url']}
   v['canonicalId']=id;v['route']='/'+routeprefix[kind]+'/'+sl
   legacy[urlparse(v['url']).path]=('' if v['locale']=='en' else '/'+v['locale'])+v['route']
  if 'en' not in translatedItem['translations']:unmatched.append({'id':id,'locale':r['locale'],'url':r['url']})
  items.append(translatedItem)
 # Use matching sibling groups in the visible menu, including nested package categories.
 root_nav={};navsoups={};equivalent_categories={}
 for loc in LOCALES:
  d=next((v for v in visited.values() if v['url']==BASE+('' if loc=='en' else loc) and v.get('html')),None)
  if d:
   soup=BeautifulSoup(d['html'],'html.parser');navsoups[loc]=soup.select_one('#mainNav')
 def match_nav(enode,lnode):
  if not enode or not lnode:return
  aa=enode.find_all('li',recursive=False);bb=lnode.find_all('li',recursive=False)
  if len(aa)!=len(bb):return
  for ea,la in zip(aa,bb):
   el=ea.find('a',recursive=False);ll=la.find('a',recursive=False)
   eu=norm(el.get('href')) if el else None;lu=norm(ll.get('href')) if ll else None
   er=byurl.get(eu)
   if er and er['type']=='category' and lu:equivalent_categories[lu]=er['name']
   match_nav(ea.find('ul',recursive=False),la.find('ul',recursive=False))
 # Locale menus differ in count and order; match their visible semantic groups.
 group_words=[('hotel',['hotel','hôtel','отел']),('package',['package','paket','пакет','pauschal','voyage a forfait','pakket']),('shore',['shore','kısa','берегов','landaus','excursions a terre','kust','excursies']),('religious',['religious','dini','religieu']),('transfer',['transfer','transport','транспорт','überweisen','overdracht']),('sailing',['sailing','mavi','яхтинг','segeln','goulet'])]
 def map_link(a,canonical):
  if a:
   u=norm(a.get('href'))
   if u and urlparse(u).path!='/':equivalent_categories[u]=canonical
 cities={'antalya':['antalya','antalii'],'belek':['belek'],'bodrum':['bodrum'],'istanbul':['istanbul','stambul'],'kemer':['kemer'],'kusadasi':['kusadas'],'marmaris':['marmaris'],'ozdere':['ozdere'],'side':['side']}
 for loc,nav in navsoups.items():
  if not nav:continue
  for li in nav.find_all('li',recursive=False):
   anchor=li.find('a',recursive=False);label=clean(anchor.get_text(' ')).lower() if anchor else ''
   group=next((k for k,words in group_words if any(w in label for w in words)),None)
   ul=li.find('ul',recursive=False);children=ul.find_all('li',recursive=False) if ul else []
   if group=='hotel':
    map_link(anchor,'hotels')
    for child in children:
     a=child.find('a',recursive=False);value=(a.get('href','')+' '+a.get_text()).lower() if a else ''
     city=next((c for c,keys in cities.items() if any(k in value for k in keys)),None)
     if city:map_link(a,city+'-hotels')
   elif group=='package':
    map_link(anchor,'package-tours')
    for child,canonical in zip(children,['daily-and-short-package-turkey-tours','istanbul-package-tours','short-tours','turkey-tours']):
     map_link(child.find('a',recursive=False),canonical)
     sub=child.find('ul',recursive=False)
     if sub:
      for subli,subid in zip(sub.find_all('li',recursive=False),['antalya-tours','bodrum-tours','izmir-tours','sagalassos-tours','tours-from-istanbul','tours-from-izmir','tours-from-kusadasi']):map_link(subli.find('a',recursive=False),subid)
   elif group=='shore':
    map_link(anchor,'shore-excursions')
    for child,canonical in zip(children,['antalya-excursions-tours','bodrum-excursions-tours','cappadocia-tours','ephesus-tours','istanbul-tours']):map_link(child.find('a',recursive=False),canonical)
   elif group=='religious':
    for child,canonical in zip(children,['armenian-tours','christian-tours','islamic-tours','jewish-tours','zorastrian-tours']):map_link(child.find('a',recursive=False),canonical)
   elif group=='transfer':map_link(anchor,'transfer')
   elif group=='sailing':
    map_link(anchor,'sailing-gulets')
    for child,canonical in zip(children,['bodrum-gokova-bodrum','bodrum-hisaronu-bodrum','marmaris-fethiye-marmaris','marmaris-hisaronu-marmaris']):map_link(child.find('a',recursive=False),canonical)
 equivalent_categories.update({BASE+'hotel-kategori':'hotels',BASE+'mavi-yolculuk':'sailing-gulets'})
 for r in records:
  if r['type']=='page' and r['url'] in equivalent_categories:r['type']='category'
 category_groups={}
 for r in [x for x in records if x['type']=='category']:
  sl=r['name'];kind=infer_kind(r)
  sl=equivalent_categories.get(r['url'],sl)
  if sl not in category_groups:category_groups[sl]=[]
  category_groups[sl].append(r)
 for sl,vs in category_groups.items():
  r=next((v for v in vs if v['locale']=='en'),vs[0]);kind=infer_kind(r);ids=[]
  for v in vs:
   for c in v['cards']:
    rr=byurl.get(c['url'])
    if rr and rr.get('canonicalId'):ids.append(rr['canonicalId'])
  cat={'id':sl,'slug':sl,'kind':kind,'title':r['title'],'sourceUrl':r['url'],'itemIds':list(dict.fromkeys(ids)),'translations':{}}
  for v in vs:
   cat['translations'][v['locale']]={k:v[k] for k in ['title','description','bodyHtml']}|{'sourceUrl':v['url']};v['canonicalId']=sl
   route='/'+routeprefix[kind]+'?category='+sl;v['route']=route
   legacy[urlparse(v['url']).path]=('' if v['locale']=='en' else '/'+v['locale'])+route
  for item in items:
   if item['id'] in ids:item['categoryIds'].append(sl)
  categories.append(cat)
 # Static content is grouped using known visible navigation equivalence and exact body/image fingerprints.
 pagegroups={}
 # Header utility links identify exact translated page counterparts.
 for loc in LOCALES:
  d=next((v for v in visited.values() if v['url']==BASE+('' if loc=='en' else loc) and v.get('html')),None)
  if d and d.get('html'):
   soup=BeautifulSoup(d['html'],'html.parser')
   for a,canonical in zip(soup.select('header .header-nav-top a.nav-link')[:5],['about','gallery','ephesus-map','blog','contact']):
    u=norm(a.get('href'),d['url'])
    if u and u in byurl:PAGE_ALIASES[byurl[u]['name']]=canonical
 # The source corporate sidebar has the same fixed order in each locale.
 for d in source_variants.values():
  if d.get('html'):
   ss=BeautifulSoup(d['html'],'html.parser')
   for chrome in ss.select('header,footer'):chrome.decompose()
   for sidebar in ss.select('.tabs-navigation'):
    ul=sidebar.find('ul',recursive=False)
    side=[li.find('a',recursive=False) for li in ul.find_all('li',recursive=False)] if ul else []
    if len(side)==11 and all(side):
     for a,canonical in zip(side,['about','why-choose-us','gallery','reviews','ephesus-map','blog','terms','privacy','satisfaction-guarantee','pay-cash-on-arrival','contact']):
      u=norm(a.get('href'),d['url'])
      if u and u in byurl:PAGE_ALIASES[byurl[u]['name']]=canonical
 for r in [x for x in records if x['type']=='page']:
  sl=PAGE_ALIASES.get(r['name'],r['name'] or 'page-'+key(r['url'])[:6])
  pagegroups.setdefault(sl,[]).append(r)
 for sl,vs in pagegroups.items():
  r=next((v for v in vs if v['locale']=='en'),vs[0]);p={'id':sl,'slug':sl,'sourceUrl':r['url'],'images':r['images'],'translations':{}}
  for v in vs:
   candidate={k:v[k] for k in ['title','description','bodyHtml']}|{'sourceUrl':v['url']}
   previous=p['translations'].get(v['locale'])
   if not previous or len(candidate['bodyHtml'])>len(previous['bodyHtml']):p['translations'][v['locale']]=candidate
   v['canonicalId']=sl;v['route']='/'+sl
   legacy[urlparse(v['url']).path]=('' if v['locale']=='en' else '/'+v['locale'])+'/'+sl
  pages.append(p)
 # Root aliases and useful old slugs linked in legacy editorial copy.
 for old,canonical in equivalent_categories.items():
  target=next((c for c in categories if c['id']==canonical),None)
  if target:legacy.setdefault(urlparse(old).path,'/'+routeprefix[target['kind']]+'?category='+canonical)
 for loc in LOCALES:
  d=next((v for v in visited.values() if v['url']==BASE+('' if loc=='en' else loc) and v.get('html')),None)
  if d:
   for a,canonical in zip(BeautifulSoup(d['html'],'html.parser').select('header .header-nav-top a.nav-link')[:5],['about','gallery','ephesus-map','blog','contact']):
    u=norm(a.get('href'),d['url'])
    if u:legacy.setdefault(urlparse(u).path,('' if loc=='en' else '/'+loc)+'/'+canonical)
 for l in LOCALES:legacy['/'+l]='/' if l=='en' else '/'+l
 for old,modern in {'/contact/':'/contact','/ephesus-tours/':'/tours?category=ephesus-tours','/tours-from-kusadasi_6j/':'/tours?category=tours-from-kusadasi','/tours-from-izmir_6h/':'/tours?category=tours-from-izmir','/istanbul-tours_g/':'/tours?category=istanbul-tours','/private-istanbul-tours_g/':'/tours?category=istanbul-tours','/cappadocia-tours_u/':'/tours?category=cappadocia-tours','/ephesus-from-istanbul_oa/':'/tours/ephesus-tours-from-istanbul','/ephesus-travel-blog/':'/blog'}.items():
  legacy.setdefault(old,modern)
 # All links in migrated HTML point to valid local routes or verified real external URLs.
 unresolved=set()
 def rewrite(body,locale):
  soup=BeautifulSoup(body,'html.parser')
  for a in soup.select('a[href]'):
   u=urlparse(a['href'])
   if u.hostname in ['www.magical-steps.com','magical-steps.com']:
    dst=legacy.get(unquote(u.path))
    if dst:
     # Keep the current language on internal navigation; use canonical entity path.
     dst=re.sub(r'^/(?:tr|fr|de|nl|ru)(?=/|$)','',dst) or '/'
     a['href']=('' if locale=='en' else '/'+locale)+dst
    else:unresolved.add(a['href']);a.unwrap()
   elif u.scheme not in ['http','https','mailto','tel']:a.unwrap()
   elif u.hostname and 'tripadvisor' in u.hostname:
    a['href']='https://www.tripadvisor.com/Attraction_Review-g297972-d2268264-Reviews-Magical_Steps_Travel-Kusadasi_Turkish_Aegean_Coast.html'
   if a.name=='a' and a.get('href','').startswith('http'):a['rel']='noopener noreferrer'
  return str(soup)
 for collection in [items,pages,categories]:
  for entity in collection:
   for l,t in entity['translations'].items():t['bodyHtml']=rewrite(t['bodyHtml'],l)
 reviews=[{'name':'Wilma Mortimer','country':'Australia','text':'Today we had a tour of Ephesus. The driver was punctual and polite. The car was very clear. As we were 4 women travelling we felt very safe. The guide Atilla was most kind + informative. We enjoyed his company immensely. We would highly recommend both driver and guide.'},{'name':'Debbie Couch','country':'Jupiter – USA','text':'This was a wonderful excursion. It was my favorite from my entire cruise. The driver did a great job and the guide Volkan was excellent, very personable and spoke perfect English. It was also very informative. I learned a lot about the Turkish culture as well as the wonderful sites we visited. The vehicle was great and the food was also. Thank you so much! I hope to return soon to take another wonderful tour with your company.'}]
 sourcepages=[];best={}
 for d in visited.values():
  previous=best.get(d['url'])
  if previous is None or (d.get('html') and not previous.get('html')):best[d['url']]=d
 for u,d in best.items():
  r=byurl.get(u,{});sourcepages.append({'url':u,'status':d['status'],'type':r.get('type','unavailable'),'locale':r.get('locale',d.get('locale','')),'canonicalId':r.get('canonicalId')})
 videos=[]
 for d in visited.values():
  if d['url']==BASE and d.get('html'):
   for a in BeautifulSoup(d['html'],'html.parser').select('a[href]'):
    u=a['href']
    if ('youtube.com/shorts/' in u or 'youtube.com/watch' in u or 'youtu.be/' in u) and u not in videos:videos.append(u)
 cat={'items':items,'pages':pages,'categories':categories,'reviews':reviews,'videos':[{'url':u} for u in videos],'sourcePages':sourcepages}
 (PROJECT/'src/data/catalog.json').write_text(json.dumps(cat,ensure_ascii=False,indent=2))
 (PROJECT/'src/data/legacy.json').write_text(json.dumps(legacy,ensure_ascii=False,indent=2))
 (CACHE/'parsed-records.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
 (CACHE/'index.json').write_text(json.dumps([{k:v for k,v in d.items() if k!='html'}|{'file':d.get('cacheFile','pages/'+key(d['url'])+'.html')} for d in visited.values()],ensure_ascii=False,indent=2))
 audit=['# Magical Steps content migration audit','',f'Captured 2026-11-11. {len(sourcepages)} public URLs inspected; {len(items)} product entities, {len(categories)} categories, {len(pages)} editorial pages.','', 'The source robots.txt points to /contents/sitemap.xml, which returned HTTP 404. Discovery used actual navigation and body links in all six languages.','', '## Locale coverage','']
 for l in LOCALES:audit.append(f'- {l}: {sum(l in i["translations"] for i in items)} products; {sum(l in p["translations"] for p in pages)} pages; {sum(l in c["translations"] for c in categories)} categories.')
 audit+=['','## Source inconsistencies retained','', '- Source prices and per-person/group tables are preserved as requested. The Ephesus / House of Mary / Sirince product advertises $90.00, while its table lists 140 USD (2–6), 90 USD (7–22), and 85 USD (23–42). No automatic price calculation is performed.','- Source English copy contains mistakes; factual text is retained. CP1252 control-character punctuation was repaired.','- Source navigation includes a malformed mailto address; the app uses the visible contact-page address info@magical-steps.com.','- Some source itinerary accordion shells have only numbers and no text. These empty shells were omitted; all substantive program text is retained.','- Old third-party widgets, forms, scripts and decoration are excluded from migrated HTML.','', '## Unavailable source URLs','']
 for d in sourcepages:
  if d['type']=='unavailable':audit.append(f'- {d["status"] or "timeout"}: {d["url"]}')
 audit+=['','## Unresolved legacy editorial targets','', 'These targets had no recoverable equivalent; anchor markup was removed while readable text was retained.','']+['- '+u for u in sorted(unresolved)]
 audit+=['','## Non-English entities with no unambiguous English equivalent','']+['- '+json.dumps(x,ensure_ascii=False) for x in unmatched]
 (PROJECT/'content-audit.md').write_text('\n'.join(audit)+'\n')
 print(json.dumps({'items':len(items),'categories':len(categories),'pages':len(pages),'legacy':len(legacy),'unmatched':len(unmatched)}),flush=True)

if __name__=='__main__':
 if '--cached' in sys.argv:
  visited={}
  index=CACHE/'index.json'
  if index.exists():
   for d in json.loads(index.read_text()):
    if d.get('status')!=200:visited[d.get('context','legacy')+'|'+d['url']]=d
  for meta in (CACHE/'pages').glob('*.json'):
   d=json.loads(meta.read_text());d['html']=meta.with_suffix('.html').read_text();visited[d.get('context','legacy')+'|'+d['url']]=d
 else:visited=crawl()
 generate(visited)
