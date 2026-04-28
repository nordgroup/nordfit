/* =========================
   NordFit translations.js
   Stable translation system
   Languages:
   de, en, fr, es, it, pl, nl, da, sv, no
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const supportedLanguages = ["de", "en", "fr", "es", "it", "pl", "nl", "da", "sv", "no"];
  const defaultLanguage = "de";

  const pageKey = getPageKey();
  const langOptions = Array.from(document.querySelectorAll(".lang-option"));
  const langToggleLabel = document.querySelector(".lang-toggle-label");

  const savedLanguage = getSavedLanguage();
  const activeLanguage = supportedLanguages.includes(savedLanguage)
    ? savedLanguage
    : defaultLanguage;

  applyLanguage(activeLanguage);

  langOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const nextLang = option.dataset.lang?.trim().toLowerCase();
      if (!nextLang || !supportedLanguages.includes(nextLang)) return;

      try {
        localStorage.setItem("nordfit-language", nextLang);
      } catch {}

      applyLanguage(nextLang);
    });
  });

  window.addEventListener("nordfit:language-changed", (event) => {
    const nextLang = event.detail?.language?.trim()?.toLowerCase();
    if (!nextLang || !supportedLanguages.includes(nextLang)) return;
    applyLanguage(nextLang);
  });

  function getSavedLanguage() {
    try {
      return (localStorage.getItem("nordfit-language") || defaultLanguage).toLowerCase();
    } catch {
      return defaultLanguage;
    }
  }

  function getPageKey() {
    const path = window.location.pathname.toLowerCase();

    if (path.endsWith("/mitgliedschaften.html") || path.includes("mitgliedschaften")) return "mitgliedschaften";
    if (path.endsWith("/standorte.html") || path.includes("standorte")) return "standorte";
    if (path.endsWith("/app.html") || path.includes("/app")) return "app";
    if (path.endsWith("/hausordnung.html") || path.includes("hausordnung")) return "hausordnung";
    if (path.endsWith("/kontakt.html") || path.includes("kontakt")) return "kontakt";
    if (path.endsWith("/impressum.html") || path.includes("impressum")) return "impressum";

    return "index";
  }

  function applyLanguage(lang) {
    updateLangLabel(lang);
    updateDocumentLanguage(lang);
    updateLanguageMenuLabels(lang);
    updateCommonNav(lang);
    updateCommonFooter(lang);
    updateCommonStaticText(lang);

    const pageTranslations = translations[pageKey];
    if (!pageTranslations) return;

    const dictionary = pageTranslations[lang] || pageTranslations[defaultLanguage];
    if (!dictionary) return;

    Object.entries(dictionary).forEach(([selector, value]) => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;

      elements.forEach((element) => applyValue(element, value));
    });

    window.dispatchEvent(
      new CustomEvent("nordfit:language-ui-sync", {
        detail: { language: lang },
      })
    );
  }

  function applyValue(element, value) {
    if (typeof value === "string") {
      element.innerHTML = value;
      return;
    }

    if (typeof value !== "object" || value === null) return;

    if ("text" in value) element.textContent = value.text;
    if ("html" in value) element.innerHTML = value.html;
    if ("placeholder" in value && "placeholder" in element) element.placeholder = value.placeholder;
    if ("ariaLabel" in value) element.setAttribute("aria-label", value.ariaLabel);
    if ("content" in value) element.setAttribute("content", value.content);
  }

  function updateLangLabel(lang) {
    if (!langToggleLabel) return;
    langToggleLabel.textContent = lang.toUpperCase();
  }

  function updateLanguageMenuLabels(lang) {
    const labels = languageLabels[lang] || languageLabels[defaultLanguage];
    if (!labels?.length) return;

    langOptions.forEach((option, index) => {
      if (labels[index]) {
        option.textContent = labels[index];
      }

      const isSelected = option.dataset.lang?.trim().toLowerCase() === lang;
      option.classList.toggle("is-selected", isSelected);
      option.classList.toggle("is-active", isSelected);
      option.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
  }

  function updateCommonNav(lang) {
    const labels = navLabels[lang] || navLabels[defaultLanguage];
    const links = document.querySelectorAll(".nav-link");
    if (!labels?.length || !links.length) return;

    links.forEach((link, index) => {
      if (labels[index]) link.textContent = labels[index];
    });
  }

  function updateCommonFooter(lang) {
    const labels = footerLabels[lang] || footerLabels[defaultLanguage];
    const links = document.querySelectorAll(".footer-links a");
    if (!labels?.length || !links.length) return;

    links.forEach((link, index) => {
      if (labels[index]) link.textContent = labels[index];
    });
  }

  function updateCommonStaticText(lang) {
    const copyrightText =
      copyrightLabels[lang] || copyrightLabels[defaultLanguage];

    document.querySelectorAll(".footer-row > .muted").forEach((element) => {
      element.textContent = copyrightText;
    });
  }

  function updateDocumentLanguage(lang) {
    document.documentElement.lang = lang;

    const titleValue = titles[lang]?.[pageKey] || titles[defaultLanguage]?.[pageKey];
    if (titleValue) {
      document.title = titleValue;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionValue =
      descriptions[lang]?.[pageKey] || descriptions[defaultLanguage]?.[pageKey];

    if (metaDescription && descriptionValue) {
      metaDescription.setAttribute("content", descriptionValue);
    }
  }

  const navLabels = {
    de: ["Startseite", "Tarife", "Standorte", "App", "Hausordnung", "Kontakt"],
    en: ["Home", "Memberships", "Locations", "App", "House Rules", "Contact"],
    fr: ["Accueil", "Abonnements", "Sites", "App", "Règlement", "Contact"],
    es: ["Inicio", "Membresías", "Ubicaciones", "App", "Normas", "Contacto"],
    it: ["Home", "Abbonamenti", "Sedi", "App", "Regolamento", "Contatto"],
    pl: ["Start", "Karnety", "Lokalizacje", "Aplikacja", "Regulamin", "Kontakt"],
    nl: ["Home", "Lidmaatschappen", "Locaties", "App", "Huisregels", "Contact"],
    da: ["Hjem", "Medlemskaber", "Lokationer", "App", "Husregler", "Kontakt"],
    sv: ["Hem", "Medlemskap", "Platser", "App", "Regler", "Kontakt"],
    no: ["Hjem", "Medlemskap", "Lokasjoner", "App", "Husregler", "Kontakt"],
  };

  const footerLabels = {
    de: ["Impressum / AGB / Datenschutz", "Hausordnung", "Kontakt", "Instagram"],
    en: ["Legal / Terms / Privacy", "House Rules", "Contact", "Instagram"],
    fr: ["Mentions / CGV / Confidentialité", "Règlement", "Contact", "Instagram"],
    es: ["Legal / Términos / Privacidad", "Normas", "Contacto", "Instagram"],
    it: ["Note legali / Termini / Privacy", "Regolamento", "Contatto", "Instagram"],
    pl: ["Dane prawne / Regulamin / Prywatność", "Regulamin", "Kontakt", "Instagram"],
    nl: ["Juridisch / Voorwaarden / Privacy", "Huisregels", "Contact", "Instagram"],
    da: ["Jura / Vilkår / Privatliv", "Husregler", "Kontakt", "Instagram"],
    sv: ["Juridik / Villkor / Integritet", "Regler", "Kontakt", "Instagram"],
    no: ["Juridisk / Vilkår / Personvern", "Husregler", "Kontakt", "Instagram"],
  };

  const copyrightLabels = {
    de: "© 2030 NordFit/NordGroup. Do not distribute!",
    en: "© 2030 NordFit/NordGroup. Do not distribute!",
    fr: "© 2030 NordFit/NordGroup. Ne pas distribuer !",
    es: "© 2030 NordFit/NordGroup. No distribuir.",
    it: "© 2030 NordFit/NordGroup. Non distribuire.",
    pl: "© 2030 NordFit/NordGroup. Nie rozpowszechniać.",
    nl: "© 2030 NordFit/NordGroup. Niet verspreiden.",
    da: "© 2030 NordFit/NordGroup. Må ikke distribueres.",
    sv: "© 2030 NordFit/NordGroup. Får inte distribueras.",
    no: "© 2030 NordFit/NordGroup. Må ikke distribueres.",
  };

  const languageLabels = {
    de: ["Deutsch", "English", "Français", "Español", "Italiano", "Polski", "Nederlands", "Dansk", "Svenska", "Norsk"],
    en: ["German", "English", "French", "Spanish", "Italian", "Polish", "Dutch", "Danish", "Swedish", "Norwegian"],
    fr: ["Allemand", "Anglais", "Français", "Espagnol", "Italien", "Polonais", "Néerlandais", "Danois", "Suédois", "Norvégien"],
    es: ["Alemán", "Inglés", "Francés", "Español", "Italiano", "Polaco", "Neerlandés", "Danés", "Sueco", "Noruego"],
    it: ["Tedesco", "Inglese", "Francese", "Spagnolo", "Italiano", "Polacco", "Olandese", "Danese", "Svedese", "Norvegese"],
    pl: ["Niemiecki", "Angielski", "Francuski", "Hiszpański", "Włoski", "Polski", "Niderlandzki", "Duński", "Szwedzki", "Norweski"],
    nl: ["Duits", "Engels", "Frans", "Spaans", "Italiaans", "Pools", "Nederlands", "Deens", "Zweeds", "Noors"],
    da: ["Tysk", "Engelsk", "Fransk", "Spansk", "Italiensk", "Polsk", "Nederlandsk", "Dansk", "Svensk", "Norsk"],
    sv: ["Tyska", "Engelska", "Franska", "Spanska", "Italienska", "Polska", "Nederländska", "Danska", "Svenska", "Norska"],
    no: ["Tysk", "Engelsk", "Fransk", "Spansk", "Italiensk", "Polsk", "Nederlandsk", "Dansk", "Svensk", "Norsk"],
  };

  const titles = {
    de: {
      index: "NordFit – Startseite",
      mitgliedschaften: "NordFit – Tarife",
      standorte: "NordFit – Standorte",
      app: "NordFit – App",
      hausordnung: "NordFit – Hausordnung",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Impressum",
    },
    en: {
      index: "NordFit – Home",
      mitgliedschaften: "NordFit – Memberships",
      standorte: "NordFit – Locations",
      app: "NordFit – App",
      hausordnung: "NordFit – House Rules",
      kontakt: "NordFit – Contact",
      impressum: "NordFit – Legal",
    },
    fr: {
      index: "NordFit – Accueil",
      mitgliedschaften: "NordFit – Abonnements",
      standorte: "NordFit – Sites",
      app: "NordFit – App",
      hausordnung: "NordFit – Règlement",
      kontakt: "NordFit – Contact",
      impressum: "NordFit – Mentions légales",
    },
    es: {
      index: "NordFit – Inicio",
      mitgliedschaften: "NordFit – Membresías",
      standorte: "NordFit – Ubicaciones",
      app: "NordFit – App",
      hausordnung: "NordFit – Normas",
      kontakt: "NordFit – Contacto",
      impressum: "NordFit – Aviso legal",
    },
    it: {
      index: "NordFit – Home",
      mitgliedschaften: "NordFit – Abbonamenti",
      standorte: "NordFit – Sedi",
      app: "NordFit – App",
      hausordnung: "NordFit – Regolamento",
      kontakt: "NordFit – Contatto",
      impressum: "NordFit – Note legali",
    },
    pl: {
      index: "NordFit – Strona główna",
      mitgliedschaften: "NordFit – Karnety",
      standorte: "NordFit – Lokalizacje",
      app: "NordFit – Aplikacja",
      hausordnung: "NordFit – Regulamin",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Informacje prawne",
    },
    nl: {
      index: "NordFit – Home",
      mitgliedschaften: "NordFit – Lidmaatschappen",
      standorte: "NordFit – Locaties",
      app: "NordFit – App",
      hausordnung: "NordFit – Huisregels",
      kontakt: "NordFit – Contact",
      impressum: "NordFit – Juridisch",
    },
    da: {
      index: "NordFit – Hjem",
      mitgliedschaften: "NordFit – Medlemskaber",
      standorte: "NordFit – Lokationer",
      app: "NordFit – App",
      hausordnung: "NordFit – Husregler",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Jura",
    },
    sv: {
      index: "NordFit – Hem",
      mitgliedschaften: "NordFit – Medlemskap",
      standorte: "NordFit – Platser",
      app: "NordFit – App",
      hausordnung: "NordFit – Regler",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Juridik",
    },
    no: {
      index: "NordFit – Hjem",
      mitgliedschaften: "NordFit – Medlemskap",
      standorte: "NordFit – Lokasjoner",
      app: "NordFit – App",
      hausordnung: "NordFit – Husregler",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Juridisk",
    },
  };

  const descriptions = {
    de: {
      index: "NordFit – modernes Fitnessstudio mit klarer Atmosphäre, hochwertigen Trainingsbereichen und ruhigem Premium-Design.",
      mitgliedschaften: "NordFit Tarife und Tagespass – klar aufgebaut, fair erklärt und direkt digital über die App verwaltbar.",
      standorte: "NordFit Standorte – klar gedacht, gut erreichbar und so gestaltet, dass der erste Eindruck direkt stimmt.",
      app: "Die NordFit App ist dein Zugang zu Mitgliedschaft, Tagespass und QR-Code-Zutritt – klar, direkt und vollständig digital.",
      hausordnung: "Die Hausordnung von NordFit – klare Regeln für ein ruhiges, sauberes und respektvolles Training.",
      kontakt: "Kontakt zu NordFit – E-Mail, Instagram und Kontaktformular.",
      impressum: "Impressum, AGB und Datenschutz von NordFit.",
    },
    en: {
      index: "NordFit – a modern gym with a clear atmosphere, premium training areas and a calm high-end design.",
      mitgliedschaften: "NordFit memberships and day pass – clear structure, fair wording and full digital handling in the app.",
      standorte: "NordFit locations – clearly planned, easy to reach and designed to feel right from the first impression.",
      app: "The NordFit app is your access to membership, day pass and QR code entry – clear, direct and fully digital.",
      hausordnung: "The NordFit house rules – clear standards for calm, clean and respectful training.",
      kontakt: "Contact NordFit – email, Instagram and contact form.",
      impressum: "Legal notice, terms and privacy of NordFit.",
    },
    fr: {
      index: "NordFit – une salle de sport moderne avec une ambiance claire, des zones premium et un design haut de gamme apaisant.",
      mitgliedschaften: "Abonnements NordFit et pass journalier – structure claire, formulation équitable et gestion numérique via l’application.",
      standorte: "Sites NordFit – clairement pensés, faciles d’accès et conçus pour convaincre dès la première impression.",
      app: "L’application NordFit donne accès à l’abonnement, au pass journalier et à l’entrée QR code – claire, directe et entièrement numérique.",
      hausordnung: "Le règlement NordFit – des règles claires pour un entraînement calme, propre et respectueux.",
      kontakt: "Contact NordFit – e-mail, Instagram et formulaire de contact.",
      impressum: "Mentions légales, conditions générales et confidentialité de NordFit.",
    },
    es: {
      index: "NordFit – gimnasio moderno con ambiente claro, zonas premium y un diseño tranquilo y elegante.",
      mitgliedschaften: "Membresías y pase diario de NordFit – estructura clara, explicación justa y gestión digital en la app.",
      standorte: "Ubicaciones de NordFit – claramente pensadas, fáciles de alcanzar y diseñadas para convencer desde la primera impresión.",
      app: "La app de NordFit es tu acceso a membresía, pase diario y entrada con código QR – clara, directa y totalmente digital.",
      hausordnung: "Las normas de NordFit – reglas claras para un entrenamiento tranquilo, limpio y respetuoso.",
      kontakt: "Contacto de NordFit – correo, Instagram y formulario de contacto.",
      impressum: "Aviso legal, condiciones y privacidad de NordFit.",
    },
    it: {
      index: "NordFit – palestra moderna con atmosfera pulita, aree premium e design elegante e tranquillo.",
      mitgliedschaften: "Abbonamenti NordFit e pass giornaliero – struttura chiara, spiegazione corretta e gestione digitale tramite app.",
      standorte: "Sedi NordFit – pensate con chiarezza, facili da raggiungere e progettate per convincere fin dal primo impatto.",
      app: "L’app NordFit è il tuo accesso ad abbonamento, pass giornaliero e ingresso tramite QR code – chiara, diretta e completamente digitale.",
      hausordnung: "Il regolamento NordFit – regole chiare per un allenamento tranquillo, pulito e rispettoso.",
      kontakt: "Contatto NordFit – e-mail, Instagram e modulo di contatto.",
      impressum: "Note legali, condizioni e privacy di NordFit.",
    },
    pl: {
      index: "NordFit – nowoczesna siłownia z uporządkowaną atmosferą, strefami premium i spokojnym designem.",
      mitgliedschaften: "Karnety NordFit i wejściówka dzienna – jasna struktura, uczciwy opis i pełna obsługa cyfrowa w aplikacji.",
      standorte: "Lokalizacje NordFit – jasno zaplanowane, łatwo dostępne i stworzone tak, by robić dobre pierwsze wrażenie.",
      app: "Aplikacja NordFit daje dostęp do karnetu, wejściówki dziennej i wejścia przez kod QR – jasno, bezpośrednio i całkowicie cyfrowo.",
      hausordnung: "Regulamin NordFit – jasne zasady spokojnego, czystego i pełnego szacunku treningu.",
      kontakt: "Kontakt z NordFit – e-mail, Instagram i formularz kontaktowy.",
      impressum: "Dane prawne, regulamin i prywatność NordFit.",
    },
    nl: {
      index: "NordFit – moderne sportschool met een heldere sfeer, premium trainingsruimtes en een rustige uitstraling.",
      mitgliedschaften: "NordFit lidmaatschappen en dagpas – duidelijke opbouw, eerlijke uitleg en volledig digitaal beheer in de app.",
      standorte: "NordFit locaties – helder doordacht, goed bereikbaar en ontworpen voor een sterke eerste indruk.",
      app: "De NordFit app geeft toegang tot lidmaatschap, dagpas en QR-code toegang – helder, direct en volledig digitaal.",
      hausordnung: "De huisregels van NordFit – duidelijke regels voor rustig, schoon en respectvol trainen.",
      kontakt: "Contact met NordFit – e-mail, Instagram en contactformulier.",
      impressum: "Juridische informatie, voorwaarden en privacy van NordFit.",
    },
    da: {
      index: "NordFit – moderne fitness med klar stemning, premiumområder og roligt design.",
      mitgliedschaften: "NordFit medlemskaber og dagspas – klar struktur, fair forklaring og fuld digital håndtering i appen.",
      standorte: "NordFit lokationer – klart planlagt, lette at nå og designet til at give det rigtige første indtryk.",
      app: "NordFit-appen giver adgang til medlemskab, dagspas og QR-kode adgang – klart, direkte og fuldt digitalt.",
      hausordnung: "NordFits husregler – klare regler for rolig, ren og respektfuld træning.",
      kontakt: "Kontakt NordFit – e-mail, Instagram og kontaktformular.",
      impressum: "Juridisk information, vilkår og privatliv for NordFit.",
    },
    sv: {
      index: "NordFit – ett modernt gym med tydlig känsla, premiumytor och lugn design.",
      mitgliedschaften: "NordFit medlemskap och dagspass – tydlig struktur, rättvis förklaring och full digital hantering i appen.",
      standorte: "NordFit platser – tydligt planerade, lätta att nå och utformade för rätt första intryck.",
      app: "NordFit-appen ger tillgång till medlemskap, dagspass och QR-kodsinträde – tydligt, direkt och helt digitalt.",
      hausordnung: "NordFits regler – tydliga regler för lugn, ren och respektfull träning.",
      kontakt: "Kontakt med NordFit – e-post, Instagram och kontaktformulär.",
      impressum: "Juridisk information, villkor och integritet för NordFit.",
    },
    no: {
      index: "NordFit – moderne treningssenter med tydelig følelse, premiumområder og rolig design.",
      mitgliedschaften: "NordFit medlemskap og dagspass – tydelig struktur, ryddig forklaring og full digital håndtering i appen.",
      standorte: "NordFit lokasjoner – tydelig planlagt, lette å nå og designet for et riktig førsteinntrykk.",
      app: "NordFit-appen gir tilgang til medlemskap, dagspass og QR-kode inngang – tydelig, direkte og fullt digitalt.",
      hausordnung: "NordFits husregler – tydelige regler for rolig, ren og respektfull trening.",
      kontakt: "Kontakt NordFit – e-post, Instagram og kontaktskjema.",
      impressum: "Juridisk informasjon, vilkår og personvern for NordFit.",
    },
  };

  const translations = {
    index: {
      de: {
        ".hero-title": { text: "Ein Studio, das modern wirkt. Und ruhig bleibt." },
        ".hero-subtitle": {
          html: "NordFit ist für Menschen gemacht, die Training nicht einfach nur abhaken wollen, sondern einen Ort suchen, der klar wirkt, hochwertig gedacht ist und sich vom ersten Moment an richtig anfühlt.",
        },
        ".hero-actions a:nth-child(1)": { text: "Mitgliedschaften" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Standorte" },
        ".hero-image-caption h2": { text: "Ein erster Eindruck, der nicht laut sein muss." },
        ".hero-image-caption p": {
          html: "Schon von außen soll NordFit modern, ruhig und sauber wirken. Nicht überladen, nicht austauschbar — sondern so klar, dass man sofort spürt: Hier steckt Anspruch im Detail.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Krafttraining" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functional Training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Regeneration" },
      },
      en: {
        ".hero-title": { text: "A studio that feels modern. And stays calm." },
        ".hero-subtitle": {
          html: "NordFit is made for people who do not want to simply tick training off, but want a place that feels clear, thoughtfully premium and right from the very first moment.",
        },
        ".hero-actions a:nth-child(1)": { text: "Memberships" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Locations" },
        ".hero-image-caption h2": { text: "A first impression that does not need to be loud." },
        ".hero-image-caption p": {
          html: "From the outside, NordFit should already feel modern, calm and clean. Not overloaded, not generic — but clear enough that you immediately feel the attention to detail.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Strength Training" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functional Training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recovery" },
      },
    },

    mitgliedschaften: {
      de: {
        ".hero-title": { text: "Tarife, die klar bleiben." },
        ".hero-subtitle": {
          html: "Bei NordFit soll auf einen Blick verständlich sein, was enthalten ist, wie lange dein Tarif läuft und wie flexibel du später wieder entscheiden kannst.",
        },
        ".info-note-label": { text: "Wichtige Info" },
        ".info-note-text": {
          html: "Abschluss, Verwaltung und Kündigung laufen vollständig über die NordFit App. So bleibt alles an einem Ort — klar, direkt und ohne unnötige Umwege.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .price-line + .muted": { text: "pro Monat" },
        ".pricing-card:nth-of-type(2) .price-line + .muted": { text: "pro Monat" },
        ".pricing-card:nth-of-type(3) .price-line + .muted": { text: "pro Monat" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 Monate Mindestlaufzeit" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Danach monatlich kündbar" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 Monate Mindestlaufzeit" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Danach monatlich kündbar" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 Monate Mindestlaufzeit" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Danach monatlich kündbar" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "Der passende Einstieg, wenn du regelmäßig trainieren willst und dabei bewusst auf ein starkes Preis-Leistungs-Verhältnis achtest.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "Für alle, die planbar bleiben möchten, aber spürbar mehr Flexibilität in ihrem Tarif bevorzugen.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "Die flexibelste Mitgliedschaft für alle, die möglichst frei bleiben und trotzdem direkt starten wollen.",
        },
        ".pricing-card-action .btn": { text: "In der App abschließen" },
        ".daypass-shell .eyebrow": { text: "Tagespass" },
        ".daypass-shell .section-title": { text: "4,90 € pro Tag" },
        ".daypass-shell .muted": {
          text: "Ideal, wenn du NordFit erst kennenlernen möchtest oder ganz bewusst spontan trainieren willst — ohne Mitgliedschaft.",
        },
        ".daypass-shell .btn": { text: "In der App buchen" },
      },

      en: {
        ".hero-title": { text: "Plans that stay clear." },
        ".hero-subtitle": {
          html: "At NordFit, it should be easy to understand at a glance what is included, how long your plan runs and how flexibly you can decide again later.",
        },
        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Sign-up, management and cancellation are handled entirely through the NordFit app. That keeps everything in one place — clear, direct and without unnecessary detours.",
        },
        ".pricing-card:nth-of-type(1) .price-line + .muted": { text: "per month" },
        ".pricing-card:nth-of-type(2) .price-line + .muted": { text: "per month" },
        ".pricing-card:nth-of-type(3) .price-line + .muted": { text: "per month" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 month minimum term" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Monthly cancellation afterwards" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 month minimum term" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Monthly cancellation afterwards" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 month minimum term" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Monthly cancellation afterwards" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "The right entry if you want to train regularly while keeping a strong eye on value.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "For people who want structure but clearly more flexibility in their plan.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "The most flexible membership for anyone who wants to stay as free as possible and still start right away.",
        },
        ".pricing-card-action .btn": { text: "Complete in the app" },
        ".daypass-shell .eyebrow": { text: "Day Pass" },
        ".daypass-shell .section-title": { text: "€4.90 per day" },
        ".daypass-shell .muted": {
          text: "Ideal if you want to get to know NordFit first or train spontaneously without a membership.",
        },
        ".daypass-shell .btn": { text: "Book in the app" },
      },
    },

    standorte: {
      de: {
        ".hero-title": { text: "Ein Standort, der direkt Sinn ergibt." },
        ".hero-subtitle": {
          html: "Der erste NordFit Standort soll nicht nur erreichbar sein. Er soll sich von Anfang an klar, ruhig und stimmig anfühlen — im Eindruck, im Ablauf und im ganzen Konzept.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit startet bewusst mit einem Standort, der nicht überladen wirkt. Weniger Ablenkung, mehr Struktur und ein Studio, das man sofort versteht.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".image-frame-label": { text: "Studio Hauptbild" },
        "section.section-no-top .glass .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "Hier beginnt NordFit mit einem Studio, das auf Ruhe, gute Erreichbarkeit und einen klaren Aufbau ausgelegt ist. Kein unnötig lauter Auftritt, sondern ein Ort, an dem man sich schnell orientieren kann.",
        },
        "section.section-no-top .glass .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Geplant sind 24/7 Zugang, eine saubere App-Anbindung, ein einfacher Ablauf und ein Studio, das bewusst hochwertig statt chaotisch wirkt.",
        },
        "section.section-tight .glass .section-title": { text: "Standort ansehen" },
        "section.section-tight .glass > .muted": {
          text: "Wer NordFit finden will, soll nicht lange suchen müssen. Die Karte und die direkte Routenwahl machen den Standort sofort nachvollziehbar.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "ÖFFNEN IN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Karten" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "ÖFFNEN IN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },

      en: {
        ".hero-title": { text: "A location that makes sense right away." },
        ".hero-subtitle": {
          html: "The first NordFit location should not only be easy to reach. It should feel clear, calm and right from the very beginning — in the impression, in the flow and in the whole concept.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit intentionally starts with a location that does not feel overloaded. Less distraction, more structure and a studio you understand immediately.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".image-frame-label": { text: "Main studio image" },
        "section.section-no-top .glass .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "This is where NordFit begins: with a studio built around calm, accessibility and a clear structure. Not needlessly loud, but a place where you can find your way quickly.",
        },
        "section.section-no-top .glass .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "The plan includes 24/7 access, clean app integration, a simple flow and a studio that feels intentionally premium rather than chaotic.",
        },
        "section.section-tight .glass .section-title": { text: "View location" },
        "section.section-tight .glass > .muted": {
          text: "If you want to find NordFit, you should not have to search for long. The map and direct route options make the location immediately understandable.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Maps" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
    },

    app: {
      de: {
        ".hero-title": { text: "Alles Wichtige. In einer App." },
        ".hero-subtitle": {
          html: "Die NordFit App ist nicht bloß ein Extra. Sie ist der zentrale Zugang zu allem, was bei NordFit bewusst einfach, klar und digital funktionieren soll.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "LADEN IM" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "JETZT BEI" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Wichtige Info" },
        ".info-note-text": {
          html: "Ohne NordFit App gibt es keinen Zutritt zum Studio. Mitgliedschaft, Tagespass, Verwaltung und QR-Code laufen vollständig darüber.",
        },
        ".section-title.large-title": { text: "Ein Konto. Ein QR-Code. Ein klarer Ablauf." },
        ".app-page-hero-grid > div:first-child > p.muted:nth-of-type(1)": {
          text: "Bei NordFit läuft alles über einen einzigen, sauberen Weg. Keine Papierformulare, keine unnötigen Zwischenschritte und kein unklarer Ablauf.",
        },
        ".app-page-hero-grid > div:first-child > p.muted:nth-of-type(2)": {
          text: "In der App schließt du deine Mitgliedschaft ab, buchst deinen Tagespass, verwaltest deine Daten und bekommst den QR-Code, mit dem du direkt ins Studio kommst.",
        },
        ".app-page-hero-grid > div:first-child > p.muted:nth-of-type(3)": {
          text: "Genau deshalb ist die App kein optionales Detail, sondern ein fester Teil des gesamten NordFit Konzepts.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Zutritt per QR-Code" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Dein Zugang liegt direkt in der App — schnell, klar und ohne Umwege." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Mitgliedschaft digital abschließen" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Buchen, einsehen und verwalten an einem Ort." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Tagespass direkt kaufen" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Ideal, wenn du NordFit erst kennenlernen oder spontan trainieren möchtest." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Alles sauber im Blick" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Standort, Zugang und persönliche Verwaltung bleiben klar gebündelt." },
      },

      en: {
        ".hero-title": { text: "Everything important. In one app." },
        ".hero-subtitle": {
          html: "The NordFit app is not just an extra. It is the central access point to everything that is meant to work simply, clearly and digitally at NordFit.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "DOWNLOAD ON THE" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "GET IT ON" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Without the NordFit app, there is no entry to the studio. Membership, day pass, management and QR code all run through it.",
        },
        ".section-title.large-title": { text: "One account. One QR code. One clear flow." },
        ".app-page-hero-grid > div:first-child > p.muted:nth-of-type(1)": {
          text: "At NordFit, everything runs through one clean path. No paper forms, no unnecessary extra steps and no unclear process.",
        },
        ".app-page-hero-grid > div:first-child > p.muted:nth-of-type(2)": {
          text: "In the app, you complete your membership, book your day pass, manage your details and receive the QR code that gets you straight into the studio.",
        },
        ".app-page-hero-grid > div:first-child > p.muted:nth-of-type(3)": {
          text: "That is exactly why the app is not an optional detail, but a fixed part of the entire NordFit concept.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Entry by QR code" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Your access lives directly in the app — fast, clear and without detours." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Complete membership digitally" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Book it, view it and manage it in one place." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Buy a day pass directly" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Ideal if you want to get to know NordFit first or train spontaneously." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Everything clearly in view" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Location, access and personal management stay clearly bundled." },
      },
    },

    hausordnung: {
      de: {
        ".hero-title": { text: "Klare Regeln. Ruhiges Training." },
        ".hero-subtitle": {
          html: "NordFit soll sich sauber, respektvoll und angenehm anfühlen. Diese Hausordnung schafft dafür einen klaren und verlässlichen Rahmen.",
        },
        ".info-note-label": { text: "Grundsatz" },
        ".info-note-text": {
          html: "Wer bei NordFit trainiert, soll sich auf einen fairen, ruhigen und sauberen Ablauf verlassen können. Genau dafür gelten diese Regeln — nicht als Übertreibung, sondern als Standard.",
        },
      },

      en: {
        ".hero-title": { text: "Clear rules. Calm training." },
        ".hero-subtitle": {
          html: "NordFit should feel clean, respectful and easy to enjoy. These house rules create a clear and reliable framework for that.",
        },
        ".info-note-label": { text: "Principle" },
        ".info-note-text": {
          html: "Anyone training at NordFit should be able to rely on a fair, calm and clean environment. These rules exist for exactly that — not as exaggeration, but as a standard.",
        },
      },
    },

    kontakt: {
      de: {
        ".hero-title": { text: "Direkt. Klar. Persönlich." },
        ".hero-subtitle": {
          html: "Wenn du Fragen zu NordFit, zur App, zu deinem Zugang oder zu einer Mitgliedschaft hast, kannst du uns hier auf dem direkten Weg erreichen.",
        },
        ".section-block .section-title": { text: "Kontaktwege" },
        ".contact-form-shell .section-title": { text: "Kontaktformular" },
        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "E-Mail" },
        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },
        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Telefon" },
        ".contact-info-item:nth-of-type(3) .muted": { text: "Bald verfügbar" },
        "label[for='contact-firstname']": { html: "Vorname <span class='required-star'>*</span>" },
        "label[for='contact-lastname']": { html: "Nachname <span class='required-star'>*</span>" },
        "label[for='contact-email']": { html: "E-Mail <span class='required-star'>*</span>" },
        "label[for='contact-phone']": { html: "Telefonnummer <span class='required-star'>*</span>" },
        "label[for='contact-topic']": { html: "Thema <span class='required-star'>*</span>" },
        "label[for='contact-memberid']": { text: "Member ID" },
        "label[for='contact-message']": { html: "Nachricht <span class='required-star'>*</span>" },
        "#contact-firstname": { placeholder: "Dein Vorname" },
        "#contact-lastname": { placeholder: "Dein Nachname" },
        "#contact-email": { placeholder: "deinname@email.de" },
        "#contact-phone": { placeholder: "Deine Telefonnummer" },
        "#contact-memberid": { placeholder: "Optional" },
        "#contact-message": { placeholder: "Schreib uns dein Anliegen ..." },
        "#contact-topic option:nth-child(1)": { text: "Bitte auswählen" },
        "#contact-topic option:nth-child(2)": { text: "Mitgliedschaft" },
        "#contact-topic option:nth-child(3)": { text: "App" },
        "#contact-topic option:nth-child(4)": { text: "Zutritt / QR-Code" },
        "#contact-topic option:nth-child(5)": { text: "Tagespass" },
        "#contact-topic option:nth-child(6)": { text: "Standort" },
        "#contact-topic option:nth-child(7)": { text: "Konto / Daten" },
        "#contact-topic option:nth-child(8)": { text: "Allgemeine Frage" },
        ".contact-form-footer .muted": { text: "Oder direkt per Mail an nordgroup.business@gmail.com" },
        ".required-note": { text: "Felder mit * müssen ausgefüllt werden." },
        ".contact-form-footer .btn": { text: "Nachricht senden" },
      },

      en: {
        ".hero-title": { text: "Direct. Clear. Personal." },
        ".hero-subtitle": {
          html: "If you have questions about NordFit, the app, your access or a membership, you can reach us here directly.",
        },
        ".section-block .section-title": { text: "Contact options" },
        ".contact-form-shell .section-title": { text: "Contact form" },
        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "Email" },
        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },
        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Phone" },
        ".contact-info-item:nth-of-type(3) .muted": { text: "Coming soon" },
        "label[for='contact-firstname']": { html: "First name <span class='required-star'>*</span>" },
        "label[for='contact-lastname']": { html: "Last name <span class='required-star'>*</span>" },
        "label[for='contact-email']": { html: "Email <span class='required-star'>*</span>" },
        "label[for='contact-phone']": { html: "Phone number <span class='required-star'>*</span>" },
        "label[for='contact-topic']": { html: "Topic <span class='required-star'>*</span>" },
        "label[for='contact-memberid']": { text: "Member ID" },
        "label[for='contact-message']": { html: "Message <span class='required-star'>*</span>" },
        "#contact-firstname": { placeholder: "Your first name" },
        "#contact-lastname": { placeholder: "Your last name" },
        "#contact-email": { placeholder: "yourname@email.com" },
        "#contact-phone": { placeholder: "Your phone number" },
        "#contact-memberid": { placeholder: "Optional" },
        "#contact-message": { placeholder: "Write your message here ..." },
        "#contact-topic option:nth-child(1)": { text: "Please choose" },
        "#contact-topic option:nth-child(2)": { text: "Membership" },
        "#contact-topic option:nth-child(3)": { text: "App" },
        "#contact-topic option:nth-child(4)": { text: "Access / QR code" },
        "#contact-topic option:nth-child(5)": { text: "Day pass" },
        "#contact-topic option:nth-child(6)": { text: "Location" },
        "#contact-topic option:nth-child(7)": { text: "Account / Data" },
        "#contact-topic option:nth-child(8)": { text: "General question" },
        ".contact-form-footer .muted": { text: "Or email us directly at nordgroup.business@gmail.com" },
        ".required-note": { text: "Fields marked with * are required." },
        ".contact-form-footer .btn": { text: "Send message" },
      },
    },

    impressum: {
      de: {
        ".hero-title": { text: "Rechtliches. Klar formuliert." },
        ".hero-subtitle": {
          html: "Auch im rechtlichen Bereich soll NordFit nachvollziehbar, transparent und sauber auftreten — ohne unnötige Komplexität und ohne versteckte Formulierungen.",
        },
        ".glass .section-title.large-title": { text: "Impressum" },
        ".legal-actions-card .section-title": { text: "Schnellzugriff" },
        ".legal-actions-card .muted": {
          text: "AGB, Datenschutz und Hausordnung lassen sich hier direkt öffnen — klar erreichbar und ohne langes Suchen.",
        },
        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Firmenname" },
        ".legal-info-row:nth-of-type(2) .legal-label": { text: "E-Mail" },
        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },
        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Adresse" },
        ".legal-info-row:nth-of-type(4) strong": { text: "Bald verfügbar" },
        ".legal-missing-info .muted": {
          text: "Fehlende Angaben werden hier ergänzt, sobald sie final feststehen.",
        },
        ".legal-action-buttons .btn:nth-child(1)": { text: "AGB öffnen" },
        ".legal-action-buttons .btn:nth-child(2)": { text: "Datenschutz öffnen" },
        ".legal-action-buttons .btn:nth-child(3)": { text: "Hausordnung öffnen" },
        "#agb-modal .section-title": { text: "Allgemeine Geschäftsbedingungen" },
        "#agb-modal .muted": {
          text: "Die AGB werden vor Veröffentlichung vollständig ergänzt und rechtlich sauber ausgearbeitet. Bis dahin dient dieser Bereich als sichtbarer Platzhalter.",
        },
        "#privacy-modal .section-title": { text: "Datenschutzerklärung" },
        "#privacy-modal .muted": {
          text: "Die Datenschutzerklärung wird hier vollständig ergänzt, bevor NordFit veröffentlicht wird. Sie soll verständlich formuliert und rechtlich sauber aufgebaut sein.",
        },
        "#rules-modal .section-title": { text: "Hausordnung" },
        "#rules-modal .muted": {
          text: "Die Hausordnung findest du zusätzlich als eigene Seite. Sie schafft den Rahmen für ein sauberes, ruhiges und respektvolles Training bei NordFit.",
        },
      },

      en: {
        ".hero-title": { text: "Legal. Clearly written." },
        ".hero-subtitle": {
          html: "NordFit should appear understandable, transparent and clean even in the legal area — without unnecessary complexity and without hidden wording.",
        },
        ".glass .section-title.large-title": { text: "Legal Notice" },
        ".legal-actions-card .section-title": { text: "Quick access" },
        ".legal-actions-card .muted": {
          text: "Terms, privacy and house rules can be opened directly here — easy to reach and without unnecessary searching.",
        },
        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Company name" },
        ".legal-info-row:nth-of-type(2) .legal-label": { text: "Email" },
        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },
        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Address" },
        ".legal-info-row:nth-of-type(4) strong": { text: "Coming soon" },
        ".legal-missing-info .muted": {
          text: "Missing details will be added here as soon as they are final.",
        },
        ".legal-action-buttons .btn:nth-child(1)": { text: "Open terms" },
        ".legal-action-buttons .btn:nth-child(2)": { text: "Open privacy" },
        ".legal-action-buttons .btn:nth-child(3)": { text: "Open house rules" },
        "#agb-modal .section-title": { text: "Terms and Conditions" },
        "#agb-modal .muted": {
          text: "The terms will be fully completed and legally prepared before publication. Until then, this section serves as a visible placeholder.",
        },
        "#privacy-modal .section-title": { text: "Privacy Policy" },
        "#privacy-modal .muted": {
          text: "The privacy policy will be completed here before NordFit is published. It should be easy to understand and legally sound.",
        },
        "#rules-modal .section-title": { text: "House Rules" },
        "#rules-modal .muted": {
          text: "You can also find the house rules as a separate page. They create the framework for clean, calm and respectful training at NordFit.",
        },
      },
    },
  };
});
