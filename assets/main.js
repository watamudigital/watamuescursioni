(() => {
  // No bookings or external data collection: all enquiry text is created in-browser.
  document.querySelectorAll('img').forEach((img) => {
    const markUnavailable = () => {
      img.classList.add('image-unavailable');
      const holder = img.closest('.hero-art, .trip-media, .highlight-visual');
      if (holder) holder.classList.add('visual-fallback');
    };
    img.addEventListener('error', markUnavailable, { once: true });
    if (img.complete && img.naturalWidth === 0) markUnavailable();
  });

  const lang = ['it','en','de','fr'].includes(document.documentElement.lang) ? document.documentElement.lang : 'it';
  const copy = {
    it: {
      open:'Apri il menu', close:'Chiudi il menu', title:'Ciao! Vorrei informazioni su un’escursione a Watamu.',
      experience:'Esperienza', choose:'Da consigliare', name:'Nome', guests:'Partecipanti', date:'Data indicativa', flexible:'Da definire',
      notes:'Note', noNotes:'Nessuna', question:'Mi puoi indicare disponibilità, prezzo finale, inclusioni, eventuali tasse/parchi, trasporto e condizioni di cancellazione?',
      done:'Richiesta preparata: puoi copiarla o condividerla. Nessun dato è stato inviato.', copied:'Copiato ✓', fail:'Seleziona e copia il testo'
    },
    en: {
      open:'Open menu', close:'Close menu', title:'Hello! I would like information about an excursion in Watamu.',
      experience:'Experience', choose:'Please advise', name:'Name', guests:'Travellers', date:'Preferred date', flexible:'Flexible',
      notes:'Notes', noNotes:'None', question:'Could you confirm availability, total price, inclusions, park fees, transport and cancellation conditions?',
      done:'Enquiry ready: copy or share it. No data has been sent.', copied:'Copied ✓', fail:'Select and copy the text'
    },
    de: {
      open:'Menü öffnen', close:'Menü schließen', title:'Hallo! Ich interessiere mich für einen Ausflug ab Watamu.',
      experience:'Erlebnis', choose:'Bitte beraten', name:'Name', guests:'Teilnehmende', date:'Wunschtermin', flexible:'Noch offen',
      notes:'Anmerkungen', noNotes:'Keine', question:'Können Sie Verfügbarkeit, Gesamtpreis, enthaltene Leistungen, Parkgebühren, Transport und Stornobedingungen bestätigen?',
      done:'Anfrage vorbereitet. Sie können sie kopieren oder teilen. Es wurden keine Daten versendet.', copied:'Kopiert ✓', fail:'Text markieren und kopieren'
    },
    fr: {
      open:'Ouvrir le menu', close:'Fermer le menu', title:'Bonjour ! Je souhaite des renseignements sur une excursion au départ de Watamu.',
      experience:'Excursion', choose:'Merci de me conseiller', name:'Nom', guests:'Participants', date:'Date souhaitée', flexible:'À définir',
      notes:'Précisions', noNotes:'Aucune', question:'Pouvez-vous confirmer la disponibilité, le prix total, les prestations comprises, les droits d’entrée, le transport et les conditions d’annulation ?',
      done:'Votre demande est prête à copier ou partager. Aucune donnée n’a été envoyée.', copied:'Copié ✓', fail:'Sélectionnez et copiez le texte'
    }
  }[lang];

  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav-links]');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? copy.close : copy.open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label',copy.open);
    }));
  }

  const form = document.querySelector('[data-enquiry-form]');
  const preview = document.querySelector('[data-message-preview]');
  const result = document.querySelector('[data-request-result]');
  const copyBtn = document.querySelector('[data-copy-message]');
  const whatsappBtn = document.querySelector('[data-share-whatsapp]');
  const status = document.querySelector('[data-form-status]');
  if (!form || !preview || !result) return;

  const params = new URLSearchParams(window.location.search);
  const choice = params.get('esperienza') || params.get('experience');
  if (choice && form.elements.experience) {
    const select = form.elements.experience;
    if ([...select.options].some(x => x.value === choice)) select.value = choice;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const chosen = form.elements.experience;
    const experience = chosen.value ? chosen.options[chosen.selectedIndex].textContent : copy.choose;
    const lines = [
      copy.title, copy.experience + ': ' + experience,
      copy.name + ': ' + data.get('name'), copy.guests + ': ' + data.get('guests'),
      copy.date + ': ' + (data.get('date') || copy.flexible),
      copy.notes + ': ' + (data.get('notes') || copy.noNotes),copy.question
    ];
    preview.value = lines.join('\n');
    result.classList.add('visible');
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
    if (status) status.textContent = copy.done;
    if (whatsappBtn) whatsappBtn.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(preview.value);
  });
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    preview.select();
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(preview.value);
      else document.execCommand('copy');
      copyBtn.textContent = copy.copied;
    } catch (err) { copyBtn.textContent = copy.fail; }
  });
})();
