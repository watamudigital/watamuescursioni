# Watamu Escursioni — SEO pillar/cluster, prima ondata (novembre 2026)

## Posizionamento e priorità

Obiettivo: costruire una guida editoriale realmente utile su Watamu, non una rete di pagine doorway o varianti quasi identiche. L'intero sito rimane in modalità demo fino alle verifiche di legalità, operatori, contenuti commerciali e privacy.

**Keyword, volumi, CPC e difficoltà non sono stati misurati**: i raggruppamenti seguenti sono ipotesi semantiche, da validare con Google Search Console, Google Keyword Planner e analisi delle SERP italiane.

| Intento | Keyword guida / varianti naturali | URL canonico | Tipo |
|---|---|---|---|
| Esperienze generali | escursioni Watamu, escursioni da Watamu | `/escursioni-watamu/` | hub attività esistente |
| Destinazione | cosa fare a Watamu, cosa vedere a Watamu | `/cosa-fare-a-watamu/` | guida informativa |
| Budget | prezzi escursioni Watamu, costo Safari Blu Watamu | `/prezzi-escursioni-watamu/` | checklist preventivi |
| Safari informativo | safari da Watamu, Tsavo Est da Watamu | `/safari-da-watamu/` | hub safari |
| Confronto safari | safari Tsavo East 1 giorno, 2 giorni Watamu | `/safari-tsavo-est-uno-o-due-giorni/` | confronto durate |
| Scelta attività | safari blu o snorkeling Watamu | `/safari-blu-o-snorkeling-watamu/` | confronto mare |
| Pianificazione mare | maree Watamu, snorkeling Watamu marea | `/maree-watamu/` | guida pratica, KMFRI |
| Famiglie | Watamu con bambini, escursioni Watamu famiglia | `/watamu-con-bambini/` | guida per esigenze specifiche |
| Pianificazione soggiorno | Watamu 7 giorni, itinerario Watamu | `/watamu-in-7-giorni/` | itinerario modulare |

## Pagine attività esistenti (da preservare)

- `/safari-blu-watamu/` — attività in barca (non la stessa ricerca del confronto Safari Blu/snorkeling)
- `/snorkeling-watamu/` — scheda del Parco Marino
- `/safari-tsavo-east-da-watamu/` — destinazione specifica
- `/mida-creek/` — mangrovie e natura
- `/marafa-hells-kitchen/` — escursione entroterra
- `/rovine-gede/` — storia swahili; il sito di Gedi è patrimonio UNESCO dal 2024

## Internal linking

- Home → guide essenziali → hub `/escursioni-watamu/` → 8 guide editoriali.
- Ognuna delle sei pagine attività esistenti rimanda alle 3 guide più pertinenti.
- Ogni nuova guida rimanda in modo contestuale alle attività esistenti e a quattro guide complementari.
- Non collegare sistematicamente tutti gli URL da ogni pagina; usare anchor naturali in contesto.
- Canonical autoreferenziali, WebPage + BreadcrumbList, FAQ testuali senza FAQPage schema non idoneo.
- Il nuovo cluster è **solo italiano**: non impostare hreflang verso pagine EN/DE/FR inesistenti. Le traduzioni si producono solo se curate e verificate.

## Roadmap contenuti P1 / P2 (non ancora prodotti)

- P1: `/quando-andare-a-watamu/` con evidenze meteo Kenya Meteorological Department/KWS e senza previsioni fuori contesto.
- P1: confronto `/watamu-o-malindi/` solo con ricerca verificata; attenzione a non cannibalizzare le pagine locali.
- P1: informazioni per persone a mobilità ridotta solo dopo verifica dell'accessibilità delle attività.
- P1: rafforzamento schede Gede/Marafa/Mida con dati pratici verificati, foto locali autorizzate e contributi originali.
- P2: traduzioni autentiche e non duplicate dei cluster con relativi URL `/en/`, `/de/`, `/fr/` e hreflang bidirezionale.
- P2: FAQ e articoli nuovi solo se emergono query reali in Search Console.

## Release gate per l'indicizzazione

**Non togliere ancora noindex / Disallow: /**. Controllare:
1. Identità dell'operatore e licenze/assicurazioni per attività offerte, senza promettere servizi non verificati.
2. Prezzi, contatti WhatsApp, servizi realmente acquistabili, trasporti e cancellazioni.
3. Privacy e condizioni aggiornate, ECM/FormsCollect dove serve, fotografie e diritti.
4. Revisione editoriale sul posto per informazioni operative, accessibilità, durate e sicurezza.
5. Controllo pagine `200`, canonical, title, hreflang esistenti, link interni, sitemap, Lighthouse e navigazione mobile.
6. Solo poi: rimuovere `noindex` da **tutte** le pagine che si vogliono indicizzare, correggere `robots.txt` (non basta togliere noindex), inserire riferimento sitemap, verificare proprietà in Search Console e inviare `sitemap.xml`.

## Misurazione (dal lancio)

Su Google Search Console: impression/click/CTR/posizione per cluster e URL, pagine scoperte vs indicizzate, query con intent informativo vs commerciale, copertura lingua, errori nei canonical. In GA4 con consenso: click approfondimenti e richieste WhatsApp, senza doppie installazioni. Rivedere titoli e contenuti ogni 30 giorni sulla base dei dati, non cambiare solo la data per simulare freschezza.

## Fonti validate

- KWS Watamu Marine Park: https://kws.go.ke/park/watamu-marine-national-park-reserve/
- KWS Tsavo East: https://kws.go.ke/park/tsavo-east-national-park/
- KMFRI previsioni maree: https://kmfri.go.ke/tide-predictions
- UNESCO Gedi: https://whc.unesco.org/en/list/1720
- Google SEO: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google spam: https://developers.google.com/search/docs/essentials/spam-policies

## Ruoli dei domini della rete Watamu Digital

- **watamuescursioni.com**: riferimento editoriale e informativo principalmente per le ricerche italiane su più esperienze a Watamu; mantiene pagine dedicate quando la loro intenzione di ricerca è realmente distinta.
- **snorkelingwatamu.com**: approfondimento verticale sullo snorkeling e sulle attività del parco marino, con contenuti specifici e non duplicati.
- **watamu.tours**: eventuale marketplace di operatori reali, in futuro; evitare di copiarvi integralmente guide e pagine dello stesso intento.
- **Juma Safari**: identità e servizi dell'operatore da verificare, non un clone delle guide generiche.

Evitare doorway e reti di link artificiali tra domini di proprietà comune. Eventuali riferimenti tra siti devono essere **contestuali e utili al lettore**, con testi distinti, fonti proprie e controllo dell'intento. Se due pagine hanno sostanzialmente lo stesso contenuto, scegliere un URL principale e consolidare o differenziare il materiale.

Nota: la mappa non autorizza il lancio commerciale dei siti e non sostituisce consenso, autorizzazioni o altri requisiti.
