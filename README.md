# Watamu Escursioni — v0.3 (IT / EN / DE / FR)

Sito dimostrativo di escursioni e safari a Watamu, Kenya. Il progetto è proprietario della repository **watamudigital/watamuescursioni** e il deployment esistente rimane sotto il team Vercel **Equipe Creative Agency**.

## Cosa comprende
- Homepage in quattro lingue: `/`, `/en/`, `/de/`, `/fr/`.
- Pagine di safari Tsavo East, Safari Blu, snorkeling, Mida Creek, Marafa, rovine di Gede e pagina madre delle escursioni, tradotte in tutte le lingue.
- Selettore lingua con mantenimento del percorso, titoli/metadati e `hreflang`.
- Design verde foresta, crema e oro; frasi principali: «L'Africa ti resta dentro» e «Non visitare soltanto. Lasciati sorprendere».
- Modulo **dimostrativo** che compone una richiesta via WhatsApp: non invia né salva i dati su un server.

## Stato e sicurezza
**Prototipo non operativo.** Nessuna prenotazione, pagamento o offerta è confermata. Le foto sono illustrative e attribuite; il numero WhatsApp di un operatore non è ancora verificato. Il progetto resta `noindex` e `robots.txt` blocca i crawler fino al lancio commerciale.

## Anteprima
https://watamuescursioni.com/ (dominio associato al progetto Vercel esistente)

## Sviluppo e collaborazione
Sito statico HTML/CSS/JS. Test locale: `python -m http.server 8000`. Le pagine HTML pubblicate sono già presenti nel repository; gli script editoriali di generazione v0.3 sono conservati nel pacchetto originale del progetto e andranno sincronizzati separatamente prima di rigenerare tutto.

Leggi `CONTRIBUTING.md` prima delle prime pull request. Il modulo commerciale futuro sarà gestito attraverso FormsCollect e il contratto ECM privacy, non con un database parallelo.

## Da completare
1. Verifica licenze/servizi, prezzo, itinerari e contatti dell'operatore.
2. Privacy e condizioni di prenotazione, foto reali e autorizzazioni.
3. Collegamento permanente GitHub → Vercel al progetto esistente, più deployment PR.
4. Test FormCollect in IT/EN/DE/FR e adeguamento policy privacy; vedere [issue pilota FormsCollect #32](https://github.com/equipe-suite/forms/issues/32).
5. Solo alla fine rimozione `noindex`, configurazione sitemap/GA4/Search Console.
