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
      mitgliedschaften: "NordFit Mitgliedschaften und Tagespass – klare Tarife, flexible Laufzeiten und Abschluss direkt in der App.",
      standorte: "NordFit Standorte – Studio, Lage und erste Eindrücke auf einen Blick.",
      app: "Die NordFit App ist dein Zugang zu Mitgliedschaft, Tagespass und QR-Code-Zutritt bei NordFit.",
      hausordnung: "Die Hausordnung von NordFit – klare Regeln für ein ruhiges, sauberes und respektvolles Training.",
      kontakt: "Kontakt zu NordFit – E-Mail, Instagram und Kontaktformular.",
      impressum: "Impressum, AGB und Datenschutz von NordFit.",
    },
    en: {
      index: "NordFit – a modern gym with a clear atmosphere, premium training areas and a calm high-end design.",
      mitgliedschaften: "NordFit memberships and day pass – clear plans, flexible terms and booking directly in the app.",
      standorte: "NordFit locations – studio, location and first impressions at a glance.",
      app: "The NordFit app is your access to membership, day pass and QR code entry at NordFit.",
      hausordnung: "The NordFit house rules – clear standards for calm, clean and respectful training.",
      kontakt: "Contact NordFit – email, Instagram and contact form.",
      impressum: "Legal notice, terms and privacy of NordFit.",
    },
    fr: {
      index: "NordFit – une salle de sport moderne avec une ambiance claire, des zones premium et un design haut de gamme apaisant.",
      mitgliedschaften: "Abonnements NordFit et pass journalier – des tarifs clairs, des durées flexibles et une réservation via l’application.",
      standorte: "Sites NordFit – studio, emplacement et premières impressions en un coup d’œil.",
      app: "L’application NordFit est votre accès à l’abonnement, au pass journalier et à l’entrée par QR code.",
      hausordnung: "Le règlement NordFit – des règles claires pour un entraînement calme, propre et respectueux.",
      kontakt: "Contact NordFit – e-mail, Instagram et formulaire de contact.",
      impressum: "Mentions légales, conditions générales et confidentialité de NordFit.",
    },
    es: {
      index: "NordFit – gimnasio moderno con ambiente claro, zonas premium y un diseño tranquilo y elegante.",
      mitgliedschaften: "Membresías y pase diario de NordFit – tarifas claras, plazos flexibles y reserva directa desde la app.",
      standorte: "Ubicaciones de NordFit – estudio, ubicación y primeras impresiones de un vistazo.",
      app: "La app de NordFit es tu acceso a membresía, pase diario y entrada con código QR.",
      hausordnung: "Las normas de NordFit – reglas claras para un entrenamiento tranquilo, limpio y respetuoso.",
      kontakt: "Contacto de NordFit – correo, Instagram y formulario de contacto.",
      impressum: "Aviso legal, condiciones y privacidad de NordFit.",
    },
    it: {
      index: "NordFit – palestra moderna con atmosfera pulita, aree premium e design elegante e tranquillo.",
      mitgliedschaften: "Abbonamenti NordFit e pass giornaliero – tariffe chiare, durate flessibili e prenotazione direttamente dall’app.",
      standorte: "Sedi NordFit – studio, posizione e prime impressioni a colpo d’occhio.",
      app: "L’app NordFit è il tuo accesso ad abbonamento, pass giornaliero e ingresso tramite QR code.",
      hausordnung: "Il regolamento NordFit – regole chiare per un allenamento tranquillo, pulito e rispettoso.",
      kontakt: "Contatto NordFit – e-mail, Instagram e modulo di contatto.",
      impressum: "Note legali, condizioni e privacy di NordFit.",
    },
    pl: {
      index: "NordFit – nowoczesna siłownia z uporządkowaną atmosferą, strefami premium i spokojnym designem.",
      mitgliedschaften: "Karnety NordFit i wejściówka dzienna – jasne ceny, elastyczne okresy i rezerwacja bezpośrednio w aplikacji.",
      standorte: "Lokalizacje NordFit – studio, położenie i pierwsze wrażenia w jednym miejscu.",
      app: "Aplikacja NordFit daje dostęp do karnetu, wejściówki dziennej i wejścia przez kod QR.",
      hausordnung: "Regulamin NordFit – jasne zasady spokojnego, czystego i pełnego szacunku treningu.",
      kontakt: "Kontakt z NordFit – e-mail, Instagram i formularz kontaktowy.",
      impressum: "Dane prawne, regulamin i prywatność NordFit.",
    },
    nl: {
      index: "NordFit – moderne sportschool met een heldere sfeer, premium trainingsruimtes en een rustige uitstraling.",
      mitgliedschaften: "NordFit lidmaatschappen en dagpas – duidelijke tarieven, flexibele looptijden en direct boeken in de app.",
      standorte: "NordFit locaties – studio, ligging en eerste indrukken in één oogopslag.",
      app: "De NordFit app geeft toegang tot lidmaatschap, dagpas en QR-code toegang bij NordFit.",
      hausordnung: "De huisregels van NordFit – duidelijke regels voor rustig, schoon en respectvol trainen.",
      kontakt: "Contact met NordFit – e-mail, Instagram en contactformulier.",
      impressum: "Juridische informatie, voorwaarden en privacy van NordFit.",
    },
    da: {
      index: "NordFit – moderne fitness med klar stemning, premiumområder og roligt design.",
      mitgliedschaften: "NordFit medlemskaber og dagspas – klare priser, fleksible perioder og booking direkte i appen.",
      standorte: "NordFit lokationer – studio, placering og første indtryk samlet ét sted.",
      app: "NordFit-appen giver adgang til medlemskab, dagspas og QR-kode adgang hos NordFit.",
      hausordnung: "NordFits husregler – klare regler for rolig, ren og respektfuld træning.",
      kontakt: "Kontakt NordFit – e-mail, Instagram og kontaktformular.",
      impressum: "Juridisk information, vilkår og privatliv for NordFit.",
    },
    sv: {
      index: "NordFit – ett modernt gym med tydlig känsla, premiumytor och lugn design.",
      mitgliedschaften: "NordFit medlemskap och dagspass – tydliga priser, flexibla tider och bokning direkt i appen.",
      standorte: "NordFit platser – studio, läge och första intryck på ett ställe.",
      app: "NordFit-appen ger tillgång till medlemskap, dagspass och QR-kodsinträde hos NordFit.",
      hausordnung: "NordFits regler – tydliga regler för lugn, ren och respektfull träning.",
      kontakt: "Kontakt med NordFit – e-post, Instagram och kontaktformulär.",
      impressum: "Juridisk information, villkor och integritet för NordFit.",
    },
    no: {
      index: "NordFit – moderne treningssenter med tydelig følelse, premiumområder og rolig design.",
      mitgliedschaften: "NordFit medlemskap og dagspass – tydelige priser, fleksible perioder og booking direkte i appen.",
      standorte: "NordFit lokasjoner – studio, plassering og førsteinntrykk samlet på ett sted.",
      app: "NordFit-appen gir tilgang til medlemskap, dagspass og QR-kode inngang hos NordFit.",
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
          html: "NordFit ist für Menschen gedacht, die nicht einfach irgendein Studio wollen, sondern einen Ort, der klar, hochwertig und angenehm im Kopf bleibt.",
        },
        ".hero-actions a:nth-child(1)": { text: "Mitgliedschaften" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Standorte" },
        ".hero-image-caption h2": { text: "Ein erster Eindruck, der direkt hängen bleibt." },
        ".hero-image-caption p": {
          html: "Schon von außen soll NordFit modern, ruhig und sauber wirken. Nicht überladen, nicht beliebig — sondern so, dass man sofort merkt: Hier wurde mit Anspruch gearbeitet.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Krafttraining" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functional Training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Regeneration" },
      },
      en: {
        ".hero-title": { text: "A studio that feels modern. And stays calm." },
        ".hero-subtitle": {
          html: "NordFit is made for people who do not want just any gym, but a place that feels clear, premium and genuinely good to come back to.",
        },
        ".hero-actions a:nth-child(1)": { text: "Memberships" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Locations" },
        ".hero-image-caption h2": { text: "A first impression that stays with you." },
        ".hero-image-caption p": {
          html: "From the outside, NordFit should already feel modern, calm and clean. Not overloaded, not generic — but built in a way that immediately feels intentional.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Strength Training" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functional Training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recovery" },
      },
      fr: {
        ".hero-title": { text: "Un studio moderne. Et qui reste calme." },
        ".hero-subtitle": {
          html: "NordFit s’adresse à celles et ceux qui ne veulent pas simplement une salle de sport, mais un lieu clair, haut de gamme et agréable à retrouver.",
        },
        ".hero-actions a:nth-child(1)": { text: "Abonnements" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Sites" },
        ".hero-image-caption h2": { text: "Une première impression qui reste." },
        ".hero-image-caption p": {
          html: "Dès l’extérieur, NordFit doit paraître moderne, calme et propre. Pas surchargé, pas banal — mais pensé avec une vraie intention.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Musculation" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Entraînement fonctionnel" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Récupération" },
      },
      es: {
        ".hero-title": { text: "Un estudio moderno. Y que sigue siendo tranquilo." },
        ".hero-subtitle": {
          html: "NordFit está pensado para quienes no quieren simplemente cualquier gimnasio, sino un lugar claro, premium y agradable al que volver.",
        },
        ".hero-actions a:nth-child(1)": { text: "Membresías" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Ubicaciones" },
        ".hero-image-caption h2": { text: "Una primera impresión que se queda." },
        ".hero-image-caption p": {
          html: "Desde fuera, NordFit ya debe sentirse moderno, tranquilo y limpio. No recargado, no genérico — sino pensado con intención real.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Entrenamiento de fuerza" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Entrenamiento funcional" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recuperación" },
      },
      it: {
        ".hero-title": { text: "Uno studio moderno. E che resta calmo." },
        ".hero-subtitle": {
          html: "NordFit è pensato per chi non vuole semplicemente una palestra qualsiasi, ma un luogo chiaro, premium e piacevole in cui tornare.",
        },
        ".hero-actions a:nth-child(1)": { text: "Abbonamenti" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Sedi" },
        ".hero-image-caption h2": { text: "Una prima impressione che resta." },
        ".hero-image-caption p": {
          html: "Già dall’esterno, NordFit deve apparire moderno, tranquillo e pulito. Non carico, non banale — ma pensato con un’idea precisa.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Allenamento di forza" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Allenamento funzionale" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recupero" },
      },
      pl: {
        ".hero-title": { text: "Nowoczesne studio. I spokojna atmosfera." },
        ".hero-subtitle": {
          html: "NordFit jest dla osób, które nie chcą po prostu dowolnej siłowni, ale miejsca, które jest jasne, premium i do którego chce się wracać.",
        },
        ".hero-actions a:nth-child(1)": { text: "Karnety" },
        ".hero-actions a:nth-child(2)": { text: "Aplikacja" },
        ".hero-actions a:nth-child(3)": { text: "Lokalizacje" },
        ".hero-image-caption h2": { text: "Pierwsze wrażenie, które zostaje." },
        ".hero-image-caption p": {
          html: "Już z zewnątrz NordFit ma wyglądać nowocześnie, spokojnie i czysto. Nie przeładowanie, nie przypadkowo — ale z wyraźnym pomysłem.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Trening siłowy" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Trening funkcjonalny" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Regeneracja" },
      },
      nl: {
        ".hero-title": { text: "Een studio die modern voelt. En rustig blijft." },
        ".hero-subtitle": {
          html: "NordFit is bedoeld voor mensen die niet zomaar een sportschool willen, maar een plek die helder, premium en prettig aanvoelt.",
        },
        ".hero-actions a:nth-child(1)": { text: "Lidmaatschappen" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Locaties" },
        ".hero-image-caption h2": { text: "Een eerste indruk die blijft hangen." },
        ".hero-image-caption p": {
          html: "Van buitenaf moet NordFit al modern, rustig en schoon aanvoelen. Niet druk, niet willekeurig — maar duidelijk met aandacht ontworpen.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Krachttraining" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functionele training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Herstel" },
      },
      da: {
        ".hero-title": { text: "Et studio, der føles moderne. Og forbliver roligt." },
        ".hero-subtitle": {
          html: "NordFit er til mennesker, der ikke bare vil have et hvilket som helst fitnesscenter, men et sted der føles klart, premium og rart at vende tilbage til.",
        },
        ".hero-actions a:nth-child(1)": { text: "Medlemskaber" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Lokationer" },
        ".hero-image-caption h2": { text: "Et første indtryk, der bliver hængende." },
        ".hero-image-caption p": {
          html: "Allerede udefra skal NordFit føles moderne, roligt og rent. Ikke overfyldt, ikke tilfældigt — men tydeligt gennemtænkt.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Styrketræning" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Funktionel træning" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Restitution" },
      },
      sv: {
        ".hero-title": { text: "En studio som känns modern. Och förblir lugn." },
        ".hero-subtitle": {
          html: "NordFit är till för människor som inte bara vill ha vilket gym som helst, utan en plats som känns tydlig, premium och bra att komma tillbaka till.",
        },
        ".hero-actions a:nth-child(1)": { text: "Medlemskap" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Platser" },
        ".hero-image-caption h2": { text: "Ett första intryck som stannar kvar." },
        ".hero-image-caption p": {
          html: "Redan utifrån ska NordFit kännas modernt, lugnt och rent. Inte rörigt, inte slumpmässigt — utan tydligt genomtänkt.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Styrketräning" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Funktionell träning" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Återhämtning" },
      },
      no: {
        ".hero-title": { text: "Et studio som føles moderne. Og forblir rolig." },
        ".hero-subtitle": {
          html: "NordFit er for mennesker som ikke bare vil ha et hvilket som helst treningssenter, men et sted som føles tydelig, premium og godt å komme tilbake til.",
        },
        ".hero-actions a:nth-child(1)": { text: "Medlemskap" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Lokasjoner" },
        ".hero-image-caption h2": { text: "Et førsteinntrykk som blir værende." },
        ".hero-image-caption p": {
          html: "Allerede utenfra skal NordFit føles moderne, rolig og rent. Ikke overfylt, ikke tilfeldig — men tydelig gjennomtenkt.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Styrketrening" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Funksjonell trening" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Restitusjon" },
      },
    },

    mitgliedschaften: {
      de: {
        ".hero-title": { text: "Klare Tarife. Ohne Umwege." },
        ".hero-subtitle": {
          html: "Bei NordFit soll schon vor dem ersten Training klar sein, was du buchst, wie lange es läuft und wie flexibel du später wieder rauskommst.",
        },
        ".info-note-label": { text: "Wichtige Info" },
        ".info-note-text": {
          html: "Abschluss, Verwaltung und Kündigung laufen vollständig über die NordFit App. So bleibt alles an einem Ort, jederzeit nachvollziehbar und ohne unnötigen Papierkram.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .muted": { text: "pro Monat" },
        ".pricing-card:nth-of-type(2) .muted": { text: "pro Monat" },
        ".pricing-card:nth-of-type(3) .muted": { text: "pro Monat" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 Monate Mindestlaufzeit" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Danach monatlich kündbar" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 Monate Mindestlaufzeit" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Danach monatlich kündbar" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 Monate Mindestlaufzeit" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Danach monatlich kündbar" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "Ideal, wenn du regelmäßig trainieren und dabei bewusst auf den Preis achten willst.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "Eine starke Mitte für alle, die planbar bleiben und trotzdem etwas flexibler sein möchten.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "Passt am besten, wenn du möglichst wenig gebunden sein und trotzdem direkt loslegen willst.",
        },
        ".pricing-card-action .btn": { text: "Über die App buchen" },
        ".daypass-shell .eyebrow": { text: "Tagespass" },
        ".daypass-shell .section-title": { text: "4,90 € pro Tag" },
        ".daypass-shell .muted": {
          text: "Perfekt, wenn du NordFit erst einmal in Ruhe kennenlernen oder einfach spontan trainieren möchtest.",
        },
        ".daypass-shell .btn": { text: "Über die App buchen" },
      },

      en: {
        ".hero-title": { text: "Clear plans. No detours." },
        ".hero-subtitle": {
          html: "At NordFit, it should be clear before your first workout what you are booking, how long it runs and how flexible you stay later on.",
        },
        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Sign-up, management and cancellation are handled entirely through the NordFit app. That keeps everything in one place, easy to follow and free from unnecessary paperwork.",
        },
        ".pricing-card:nth-of-type(1) .muted": { text: "per month" },
        ".pricing-card:nth-of-type(2) .muted": { text: "per month" },
        ".pricing-card:nth-of-type(3) .muted": { text: "per month" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 month minimum term" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Monthly cancellation afterwards" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 month minimum term" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Monthly cancellation afterwards" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 month minimum term" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Monthly cancellation afterwards" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "Ideal if you want to train regularly while keeping a close eye on price.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "A strong middle option for anyone who wants structure with a bit more flexibility.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "Best if you want as little commitment as possible while still getting started right away.",
        },
        ".pricing-card-action .btn": { text: "Book in the app" },
        ".daypass-shell .eyebrow": { text: "Day Pass" },
        ".daypass-shell .section-title": { text: "€4.90 per day" },
        ".daypass-shell .muted": {
          text: "Perfect if you want to get to know NordFit first or just train spontaneously.",
        },
        ".daypass-shell .btn": { text: "Book in the app" },
      },
    },

    standorte: {
      de: {
        ".hero-title": { text: "Ein Standort. Klar gedacht." },
        ".hero-subtitle": {
          html: "Der erste NordFit Standort soll nicht einfach nur erreichbar sein. Er soll sich direkt stimmig anfühlen — von außen, von innen und im ganzen Ablauf.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit startet bewusst mit einem klaren, ruhigen Studio statt mit unnötiger Größe. Weniger Ablenkung, mehr Struktur und ein Standort, den man direkt versteht.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".grid-2 .muted:nth-of-type(1)": {
          text: "Hier beginnt NordFit mit einem Studio, das auf Ruhe, gute Erreichbarkeit und eine klare Struktur ausgelegt ist. Kein überladener Auftritt, sondern ein Ort, an dem man direkt weiß, woran man ist.",
        },
        ".grid-2 .muted:nth-of-type(2)": {
          text: "Geplant sind 24/7 Zugang, eine moderne App-Anbindung, ein sauberer Ablauf und ein Studio, das bewusst hochwertig statt chaotisch wirkt.",
        },
        ".image-frame-label": { text: "Studio Hauptbild" },
        ".glass.reveal:nth-of-type(2) .section-title": { text: "Standort ansehen" },
        ".glass.reveal:nth-of-type(2) .muted": {
          text: "Hier soll man den Standort nicht nur lesen, sondern direkt nachvollziehen können — mit Karte und schneller Route über die bevorzugte App.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "ÖFFNEN IN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Karten" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "ÖFFNEN IN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },

      en: {
        ".hero-title": { text: "One location. Clearly designed." },
        ".hero-subtitle": {
          html: "The first NordFit location should not just be easy to reach. It should feel right straight away — from the outside, from the inside and throughout the whole experience.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit intentionally starts with a clear, calm studio instead of unnecessary size. Less distraction, more structure and a location that makes immediate sense.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".grid-2 .muted:nth-of-type(1)": {
          text: "This is where NordFit begins: with a studio built around calm, accessibility and a clear structure. Not overloaded, but a place that feels easy to understand right away.",
        },
        ".grid-2 .muted:nth-of-type(2)": {
          text: "The plan includes 24/7 access, strong app integration, a clean flow and a studio that feels intentionally premium rather than chaotic.",
        },
        ".image-frame-label": { text: "Main studio image" },
        ".glass.reveal:nth-of-type(2) .section-title": { text: "View location" },
        ".glass.reveal:nth-of-type(2) .muted": {
          text: "The goal is not just to describe the location, but to make it easy to understand directly — with a map and quick routing through your preferred app.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Maps" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
    },

    app: {
      de: {
        ".hero-title": { text: "Ohne App geht’s nicht." },
        ".hero-subtitle": {
          html: "Die NordFit App ist nicht bloß ein Extra. Sie ist der zentrale Weg zu deinem Zugang, deiner Mitgliedschaft und allem, was bei NordFit bewusst digital und klar laufen soll.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "LADEN IM" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "JETZT BEI" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Wichtige Info" },
        ".info-note-text": {
          html: "Ohne NordFit App gibt es keinen Zutritt zum Studio. Mitgliedschaften, Tagespass, Verwaltung und QR-Code laufen vollständig darüber.",
        },
        ".section-title.large-title": { text: "Ein Konto. Ein QR-Code. Ein klarer Zugang." },
        ".grid-2 .muted:nth-of-type(1)": {
          text: "Bei NordFit läuft alles über einen einzigen, sauberen Weg. Du brauchst keine Papierformulare, keine unklaren Abläufe und kein Hin und Her zwischen mehreren Stellen.",
        },
        ".grid-2 .muted:nth-of-type(2)": {
          text: "In der App schließt du deine Mitgliedschaft ab, buchst deinen Tagespass, verwaltest deine Daten und bekommst den QR-Code, mit dem du direkt ins Studio kommst.",
        },
        ".grid-2 .muted:nth-of-type(3)": {
          text: "Genau deshalb ist sie kein optionales Detail, sondern ein fester Teil vom ganzen NordFit Konzept.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Zutritt per QR-Code" },
        ".app-need-item:nth-of-type(1) .muted": {
          text: "Dein Zugang liegt direkt in der App — schnell, klar und ohne Umwege.",
        },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Mitgliedschaft digital abschließen" },
        ".app-need-item:nth-of-type(2) .muted": {
          text: "Buchen, einsehen und verwalten an einem einzigen Ort.",
        },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Tagespass direkt kaufen" },
        ".app-need-item:nth-of-type(3) .muted": {
          text: "Ideal, wenn du NordFit erst einmal testen oder spontan trainieren willst.",
        },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Alles sauber im Blick" },
        ".app-need-item:nth-of-type(4) .muted": {
          text: "Standort, Zugang und persönliche Verwaltung bleiben klar an einer Stelle.",
        },
      },

      en: {
        ".hero-title": { text: "You need the app." },
        ".hero-subtitle": {
          html: "The NordFit app is not just an extra. It is the central route to your access, your membership and everything that is meant to stay digital and clear at NordFit.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "DOWNLOAD ON THE" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "GET IT ON" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Without the NordFit app, there is no entry to the studio. Memberships, day passes, management and QR access all run through it.",
        },
        ".section-title.large-title": { text: "One account. One QR code. One clear way in." },
        ".grid-2 .muted:nth-of-type(1)": {
          text: "At NordFit, everything runs through one clean path. No paper forms, no unclear steps and no jumping between different places.",
        },
        ".grid-2 .muted:nth-of-type(2)": {
          text: "In the app, you sign up for your membership, book your day pass, manage your details and receive the QR code that gets you straight into the studio.",
        },
        ".grid-2 .muted:nth-of-type(3)": {
          text: "That is exactly why it is not optional, but a fixed part of the entire NordFit concept.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Entry by QR code" },
        ".app-need-item:nth-of-type(1) .muted": {
          text: "Your access lives directly in the app — fast, clear and without detours.",
        },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Manage membership digitally" },
        ".app-need-item:nth-of-type(2) .muted": {
          text: "Book it, view it and manage it in one place.",
        },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Buy a day pass directly" },
        ".app-need-item:nth-of-type(3) .muted": {
          text: "Perfect if you want to test NordFit first or train spontaneously.",
        },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Everything in view" },
        ".app-need-item:nth-of-type(4) .muted": {
          text: "Location, access and personal management stay clearly in one place.",
        },
      },
    },

    hausordnung: {
      de: {
        ".hero-title": { text: "Klare Regeln. Ruhiges Training." },
        ".hero-subtitle": {
          html: "NordFit soll sich sauber, respektvoll und angenehm anfühlen. Diese Hausordnung gibt dafür einen klaren Rahmen.",
        },
        ".info-note-label": { text: "Grundsatz" },
        ".info-note-text": {
          html: "Wer bei NordFit trainiert, soll sich auf einen fairen, ruhigen und sauberen Ablauf verlassen können. Genau dafür gelten diese Regeln — nicht als Drama, sondern als Standard.",
        },
        ".grid-2 .section-block:nth-of-type(1) .section-title": { text: "Zutritt nur mit gültigem Zugang" },
        ".grid-2 .section-block:nth-of-type(2) .section-title": { text: "Kein Zutritt für Unbefugte" },
        ".grid-2 .section-block:nth-of-type(3) .section-title": { text: "Geeignete Trainingskleidung" },
        ".grid-2 .section-block:nth-of-type(4) .section-title": { text: "Handtuch benutzen" },
        ".grid-2 .section-block:nth-of-type(5) .section-title": { text: "Geräte ordentlich hinterlassen" },
        ".grid-2 .section-block:nth-of-type(6) .section-title": { text: "Respekt im Umgang" },
        ".grid-2 .section-block:nth-of-type(7) .section-title": { text: "Sicher und verantwortungsvoll trainieren" },
        ".grid-2 .section-block:nth-of-type(8) .section-title": { text: "Ruhe und Ordnung im Studio" },
        ".grid-2 .section-block:nth-of-type(9) .section-title": { text: "Sauberkeit zählt mit" },
        ".grid-2 .section-block:nth-of-type(10) .section-title": { text: "Hausrecht" },
      },

      en: {
        ".hero-title": { text: "Clear rules. Calm training." },
        ".hero-subtitle": {
          html: "NordFit should feel clean, respectful and easy to enjoy. These house rules create the clear framework for that.",
        },
        ".info-note-label": { text: "Principle" },
        ".info-note-text": {
          html: "Anyone training at NordFit should be able to rely on a fair, calm and clean environment. These rules are there for exactly that — not as drama, but as a standard.",
        },
        ".grid-2 .section-block:nth-of-type(1) .section-title": { text: "Entry only with valid access" },
        ".grid-2 .section-block:nth-of-type(2) .section-title": { text: "No entry for unauthorized persons" },
        ".grid-2 .section-block:nth-of-type(3) .section-title": { text: "Appropriate training clothing" },
        ".grid-2 .section-block:nth-of-type(4) .section-title": { text: "Use a towel" },
        ".grid-2 .section-block:nth-of-type(5) .section-title": { text: "Leave equipment in order" },
        ".grid-2 .section-block:nth-of-type(6) .section-title": { text: "Respectful behaviour" },
        ".grid-2 .section-block:nth-of-type(7) .section-title": { text: "Train safely and responsibly" },
        ".grid-2 .section-block:nth-of-type(8) .section-title": { text: "Calm and order in the studio" },
        ".grid-2 .section-block:nth-of-type(9) .section-title": { text: "Cleanliness matters too" },
        ".grid-2 .section-block:nth-of-type(10) .section-title": { text: "House rights" },
      },
    },

    kontakt: {
      de: {
        ".hero-title": { text: "Schreib uns direkt." },
        ".hero-subtitle": {
          html: "Wenn du Fragen zu NordFit, zur App, zu deiner Mitgliedschaft oder zum Studio hast, kannst du uns hier auf dem direkten Weg erreichen.",
        },
        ".section-block .section-title": { text: "Kontaktwege" },
        ".contact-form-shell .section-title": { text: "Kontaktformular" },
        ".contact-info-label:nth-of-type(1)": { text: "E-Mail" },
        ".contact-info-label:nth-of-type(2)": { text: "Instagram" },
        ".contact-info-label:nth-of-type(3)": { text: "Telefon" },
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
        ".hero-title": { text: "Write to us directly." },
        ".hero-subtitle": {
          html: "If you have questions about NordFit, the app, your membership or the studio, you can reach us here directly.",
        },
        ".section-block .section-title": { text: "Contact options" },
        ".contact-form-shell .section-title": { text: "Contact form" },
        ".contact-info-label:nth-of-type(1)": { text: "Email" },
        ".contact-info-label:nth-of-type(2)": { text: "Instagram" },
        ".contact-info-label:nth-of-type(3)": { text: "Phone" },
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
        ".hero-title": { text: "Rechtliches. Klar und offen." },
        ".hero-subtitle": {
          html: "Auch im rechtlichen Teil soll NordFit verständlich, sauber und transparent wirken — ohne unnötige Umwege und ohne versteckte Punkte.",
        },
        ".glass .section-title.large-title": { text: "Impressum" },
        ".legal-actions-card .section-title": { text: "Schnellauswahl" },
        ".legal-actions-card .muted": {
          text: "AGB, Datenschutz und Hausordnung lassen sich direkt hier öffnen — schnell, klar und ohne langes Suchen.",
        },
        ".legal-label:nth-of-type(1)": { text: "Firmenname" },
        ".legal-label:nth-of-type(2)": { text: "E-Mail" },
        ".legal-label:nth-of-type(3)": { text: "Instagram" },
        ".legal-label:nth-of-type(4)": { text: "Adresse" },
        ".legal-info-row:nth-of-type(4) strong": { text: "Bald verfügbar" },
        ".legal-missing-info .muted": {
          text: "Falls noch Angaben ergänzt werden müssen, werden sie hier sauber nachgetragen.",
        },
        ".legal-action-buttons .btn:nth-child(1)": { text: "AGB öffnen" },
        ".legal-action-buttons .btn:nth-child(2)": { text: "Datenschutz öffnen" },
        ".legal-action-buttons .btn:nth-child(3)": { text: "Hausordnung öffnen" },
        "#agb-modal .section-title": { text: "Allgemeine Geschäftsbedingungen" },
        "#agb-modal .muted": {
          text: "Die AGB werden vor Veröffentlichung vollständig und rechtlich sauber ergänzt. Bis dahin dient dieser Bereich als klar sichtbarer Platzhalter.",
        },
        "#privacy-modal .section-title": { text: "Datenschutzerklärung" },
        "#privacy-modal .muted": {
          text: "Die Datenschutzerklärung wird hier vollständig ergänzt, bevor NordFit live geht. Sie soll verständlich formuliert und rechtlich sauber aufgebaut sein.",
        },
        "#rules-modal .section-title": { text: "Hausordnung" },
        "#rules-modal .muted": {
          text: "Die Hausordnung findest du zusätzlich als eigene Seite. Sie sorgt dafür, dass NordFit sauber, ruhig und respektvoll bleibt.",
        },
      },

      en: {
        ".hero-title": { text: "Legal. Clear and open." },
        ".hero-subtitle": {
          html: "Even the legal section should feel understandable, clean and transparent at NordFit — without unnecessary detours and without hidden details.",
        },
        ".glass .section-title.large-title": { text: "Legal Notice" },
        ".legal-actions-card .section-title": { text: "Quick access" },
        ".legal-actions-card .muted": {
          text: "Terms, privacy and house rules can be opened directly here — fast, clear and without unnecessary searching.",
        },
        ".legal-label:nth-of-type(1)": { text: "Company name" },
        ".legal-label:nth-of-type(2)": { text: "Email" },
        ".legal-label:nth-of-type(3)": { text: "Instagram" },
        ".legal-label:nth-of-type(4)": { text: "Address" },
        ".legal-info-row:nth-of-type(4) strong": { text: "Coming soon" },
        ".legal-missing-info .muted": {
          text: "If additional information still needs to be added, it will be completed here clearly.",
        },
        ".legal-action-buttons .btn:nth-child(1)": { text: "Open terms" },
        ".legal-action-buttons .btn:nth-child(2)": { text: "Open privacy" },
        ".legal-action-buttons .btn:nth-child(3)": { text: "Open house rules" },
        "#agb-modal .section-title": { text: "Terms and Conditions" },
        "#agb-modal .muted": {
          text: "The terms will be completed fully and correctly before publication. Until then, this section serves as a clearly visible placeholder.",
        },
        "#privacy-modal .section-title": { text: "Privacy Policy" },
        "#privacy-modal .muted": {
          text: "The privacy policy will be completed here before NordFit goes live. It should be easy to understand and legally sound.",
        },
        "#rules-modal .section-title": { text: "House Rules" },
        "#rules-modal .muted": {
          text: "You can also find the house rules as a separate page. They help ensure that NordFit stays clean, calm and respectful.",
        },
      },
    },
  };
});
