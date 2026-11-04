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

  // One WhatsApp contact destination, shared across all Italian, English, German and French pages.
  const whatsappNumber = '254741457022';
  const whatsappLabels = {
    it: 'Invia un messaggio WhatsApp',
    en: 'Send WhatsApp message',
    de: 'WhatsApp-Nachricht senden',
    fr: 'Envoyer un message WhatsApp'
  };
  const whatsappLink = message => 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);

  const contactButton = document.createElement('a');
  contactButton.className = 'whatsapp-contact';
  contactButton.href = whatsappLink(copy.title);
  contactButton.target = '_blank';
  contactButton.rel = 'noopener noreferrer';
  contactButton.setAttribute('aria-label', whatsappLabels[lang]);
  contactButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.52-.074-.149-.669-1.612-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01s-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.073c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.446 7.312h-.004a9.66 9.66 0 0 1-4.929-1.35l-.353-.21-3.666.961.979-3.574-.23-.367a9.65 9.65 0 0 1-1.48-5.17c.002-5.326 4.337-9.662 9.666-9.662 2.58.001 5.005 1.007 6.829 2.834a9.598 9.598 0 0 1 2.828 6.834c-.002 5.326-4.337 9.662-9.64 9.662m8.213-17.864A11.88 11.88 0 0 0 12.023 0C5.393 0 .013 5.38.01 12.014c-.001 2.118.553 4.185 1.606 6.006L0 24l6.125-1.606a12.03 12.03 0 0 0 5.893 1.501h.005c6.628 0 12.009-5.38 12.012-12.014A11.93 11.93 0 0 0 20.239 3.83Z"/></svg><span></span>';
  contactButton.querySelector('span').textContent = whatsappLabels[lang];
  document.body.appendChild(contactButton);

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
  if (whatsappBtn) {
    whatsappBtn.href = whatsappLink(copy.title);
    whatsappBtn.textContent = whatsappLabels[lang];
  }
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
    if (whatsappBtn) whatsappBtn.href = whatsappLink(preview.value);
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
