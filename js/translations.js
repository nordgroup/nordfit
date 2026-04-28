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
    updateFooterCopyright(lang);

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

      const isSelected = option.dataset.lang?.trim()?.toLowerCase() === lang;
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

  function updateFooterCopyright(lang) {
    const footerText = footerCopyright[lang] || footerCopyright[defaultLanguage];
    const footerCopyrightElement = document.querySelector(".footer-row > p.muted");
    if (!footerCopyrightElement || !footerText) return;
    footerCopyrightElement.textContent = footerText;
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
    en: ["Home", "Plans", "Locations", "App", "House Rules", "Contact"],
    fr: ["Accueil", "Tarifs", "Sites", "App", "Règlement", "Contact"],
    es: ["Inicio", "Tarifas", "Ubicaciones", "App", "Normas", "Contacto"],
    it: ["Home", "Tariffe", "Sedi", "App", "Regolamento", "Contatto"],
    pl: ["Start", "Cennik", "Lokalizacje", "Aplikacja", "Regulamin", "Kontakt"],
    nl: ["Home", "Tarieven", "Locaties", "App", "Huisregels", "Contact"],
    da: ["Hjem", "Priser", "Lokationer", "App", "Husregler", "Kontakt"],
    sv: ["Hem", "Priser", "Platser", "App", "Regler", "Kontakt"],
    no: ["Hjem", "Priser", "Lokasjoner", "App", "Husregler", "Kontakt"],
  };

  const footerLabels = {
    de: ["Impressum / AGB / Datenschutz", "Hausordnung", "Kontakt", "Instagram"],
    en: ["Legal / Terms / Privacy", "House Rules", "Contact", "Instagram"],
    fr: ["Mentions / CGV / Confidentialité", "Règlement", "Contact", "Instagram"],
    es: ["Legal / Términos / Privacidad", "Normas", "Contacto", "Instagram"],
    it: ["Note legali / Termini / Privacy", "Regolamento", "Contatto", "Instagram"],
    pl: ["Informacje prawne / Regulamin / Prywatność", "Regulamin", "Kontakt", "Instagram"],
    nl: ["Juridisch / Voorwaarden / Privacy", "Huisregels", "Contact", "Instagram"],
    da: ["Jura / Vilkår / Privatliv", "Husregler", "Kontakt", "Instagram"],
    sv: ["Juridik / Villkor / Integritet", "Regler", "Kontakt", "Instagram"],
    no: ["Juridisk / Vilkår / Personvern", "Husregler", "Kontakt", "Instagram"],
  };

  const footerCopyright = {
    de: "© 2030 NordFit",
    en: "© 2030 NordFit",
    fr: "© 2030 NordFit",
    es: "© 2030 NordFit",
    it: "© 2030 NordFit",
    pl: "© 2030 NordFit",
    nl: "© 2030 NordFit",
    da: "© 2030 NordFit",
    sv: "© 2030 NordFit",
    no: "© 2030 NordFit",
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
      mitgliedschaften: "NordFit – Plans",
      standorte: "NordFit – Locations",
      app: "NordFit – App",
      hausordnung: "NordFit – House Rules",
      kontakt: "NordFit – Contact",
      impressum: "NordFit – Legal",
    },
    fr: {
      index: "NordFit – Accueil",
      mitgliedschaften: "NordFit – Tarifs",
      standorte: "NordFit – Sites",
      app: "NordFit – App",
      hausordnung: "NordFit – Règlement",
      kontakt: "NordFit – Contact",
      impressum: "NordFit – Mentions légales",
    },
    es: {
      index: "NordFit – Inicio",
      mitgliedschaften: "NordFit – Tarifas",
      standorte: "NordFit – Ubicaciones",
      app: "NordFit – App",
      hausordnung: "NordFit – Normas",
      kontakt: "NordFit – Contacto",
      impressum: "NordFit – Aviso legal",
    },
    it: {
      index: "NordFit – Home",
      mitgliedschaften: "NordFit – Tariffe",
      standorte: "NordFit – Sedi",
      app: "NordFit – App",
      hausordnung: "NordFit – Regolamento",
      kontakt: "NordFit – Contatto",
      impressum: "NordFit – Note legali",
    },
    pl: {
      index: "NordFit – Strona główna",
      mitgliedschaften: "NordFit – Cennik",
      standorte: "NordFit – Lokalizacje",
      app: "NordFit – Aplikacja",
      hausordnung: "NordFit – Regulamin",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Informacje prawne",
    },
    nl: {
      index: "NordFit – Home",
      mitgliedschaften: "NordFit – Tarieven",
      standorte: "NordFit – Locaties",
      app: "NordFit – App",
      hausordnung: "NordFit – Huisregels",
      kontakt: "NordFit – Contact",
      impressum: "NordFit – Juridisch",
    },
    da: {
      index: "NordFit – Hjem",
      mitgliedschaften: "NordFit – Priser",
      standorte: "NordFit – Lokationer",
      app: "NordFit – App",
      hausordnung: "NordFit – Husregler",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Jura",
    },
    sv: {
      index: "NordFit – Hem",
      mitgliedschaften: "NordFit – Priser",
      standorte: "NordFit – Platser",
      app: "NordFit – App",
      hausordnung: "NordFit – Regler",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Juridik",
    },
    no: {
      index: "NordFit – Hjem",
      mitgliedschaften: "NordFit – Priser",
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
      index: "NordFit – a modern gym with a clear atmosphere, premium training areas and a calm premium feel.",
      mitgliedschaften: "NordFit plans and day pass – clearly structured, fair and fully managed through the app.",
      standorte: "NordFit locations – clearly designed, easy to reach and built to feel right from the first impression.",
      app: "The NordFit app is your access to membership, day pass and QR code entry – clear, direct and fully digital.",
      hausordnung: "NordFit house rules – clear standards for calm, clean and respectful training.",
      kontakt: "Contact NordFit – email, Instagram and contact form.",
      impressum: "Legal notice, terms and privacy of NordFit.",
    },
    fr: {
      index: "NordFit – une salle moderne avec une atmosphère claire, des zones premium et un design calme.",
      mitgliedschaften: "Tarifs NordFit et pass journalier – clairs, équitables et gérés directement via l’app.",
      standorte: "Sites NordFit – bien pensés, faciles d’accès et conçus pour convaincre dès le premier regard.",
      app: "L’app NordFit donne accès à l’abonnement, au pass journalier et à l’entrée par QR code.",
      hausordnung: "Le règlement NordFit – des règles claires pour un entraînement calme, propre et respectueux.",
      kontakt: "Contact NordFit – e-mail, Instagram et formulaire de contact.",
      impressum: "Mentions légales, CGV et confidentialité de NordFit.",
    },
    es: {
      index: "NordFit – gimnasio moderno con ambiente claro, zonas premium y una estética tranquila.",
      mitgliedschaften: "Tarifas NordFit y pase diario – claras, justas y gestionadas directamente desde la app.",
      standorte: "Ubicaciones NordFit – bien pensadas, accesibles y diseñadas para convencer desde el primer momento.",
      app: "La app de NordFit te da acceso a membresía, pase diario y entrada con código QR.",
      hausordnung: "Las normas de NordFit – reglas claras para un entrenamiento tranquilo, limpio y respetuoso.",
      kontakt: "Contacto de NordFit – correo, Instagram y formulario de contacto.",
      impressum: "Aviso legal, términos y privacidad de NordFit.",
    },
    it: {
      index: "NordFit – palestra moderna con atmosfera pulita, aree premium e design tranquillo.",
      mitgliedschaften: "Tariffe NordFit e pass giornaliero – chiare, corrette e gestite direttamente nell’app.",
      standorte: "Sedi NordFit – ben pensate, facili da raggiungere e progettate per convincere subito.",
      app: "L’app NordFit dà accesso ad abbonamento, pass giornaliero e ingresso con QR code.",
      hausordnung: "Il regolamento NordFit – regole chiare per un allenamento tranquillo, pulito e rispettoso.",
      kontakt: "Contatto NordFit – e-mail, Instagram e modulo di contatto.",
      impressum: "Note legali, termini e privacy di NordFit.",
    },
    pl: {
      index: "NordFit – nowoczesna siłownia z uporządkowaną atmosferą, strefami premium i spokojnym stylem.",
      mitgliedschaften: "Cennik NordFit i wejściówka dzienna – jasno opisane, uczciwe i zarządzane bezpośrednio w aplikacji.",
      standorte: "Lokalizacje NordFit – dobrze przemyślane, łatwo dostępne i zaprojektowane tak, by od razu robiły dobre wrażenie.",
      app: "Aplikacja NordFit daje dostęp do karnetu, wejściówki dziennej i wejścia przez kod QR.",
      hausordnung: "Regulamin NordFit – jasne zasady spokojnego, czystego i pełnego szacunku treningu.",
      kontakt: "Kontakt z NordFit – e-mail, Instagram i formularz kontaktowy.",
      impressum: "Informacje prawne, regulamin i prywatność NordFit.",
    },
    nl: {
      index: "NordFit – moderne sportschool met een heldere sfeer, premium zones en een rustige uitstraling.",
      mitgliedschaften: "NordFit tarieven en dagpas – duidelijk, eerlijk en rechtstreeks via de app beheerd.",
      standorte: "NordFit locaties – slim ontworpen, goed bereikbaar en gemaakt om direct goed aan te voelen.",
      app: "De NordFit app geeft toegang tot lidmaatschap, dagpas en QR-code toegang.",
      hausordnung: "De huisregels van NordFit – duidelijke regels voor rustig, schoon en respectvol trainen.",
      kontakt: "Contact met NordFit – e-mail, Instagram en contactformulier.",
      impressum: "Juridische informatie, voorwaarden en privacy van NordFit.",
    },
    da: {
      index: "NordFit – moderne fitness med klar stemning, premiumområder og roligt design.",
      mitgliedschaften: "NordFit priser og dagspas – klart forklaret, fair og administreret direkte i appen.",
      standorte: "NordFit lokationer – gennemtænkte, lette at nå og designet til at føles rigtige med det samme.",
      app: "NordFit-appen giver adgang til medlemskab, dagspas og QR-kode adgang.",
      hausordnung: "NordFits husregler – klare regler for rolig, ren og respektfuld træning.",
      kontakt: "Kontakt NordFit – e-mail, Instagram og kontaktformular.",
      impressum: "Juridisk information, vilkår og privatliv for NordFit.",
    },
    sv: {
      index: "NordFit – ett modernt gym med tydlig känsla, premiumytor och lugn design.",
      mitgliedschaften: "NordFit priser och dagspass – tydligt, rättvist och direkt hanterat i appen.",
      standorte: "NordFit platser – genomtänkta, lättillgängliga och skapade för att kännas rätt direkt.",
      app: "NordFit-appen ger tillgång till medlemskap, dagspass och QR-kodsinträde.",
      hausordnung: "NordFits regler – tydliga regler för lugn, ren och respektfull träning.",
      kontakt: "Kontakt med NordFit – e-post, Instagram och kontaktformulär.",
      impressum: "Juridisk information, villkor och integritet för NordFit.",
    },
    no: {
      index: "NordFit – moderne treningssenter med tydelig følelse, premiumområder og rolig design.",
      mitgliedschaften: "NordFit priser og dagspass – tydelig, rettferdig og administrert direkte i appen.",
      standorte: "NordFit lokasjoner – gjennomtenkte, enkle å nå og laget for å føles riktige med én gang.",
      app: "NordFit-appen gir tilgang til medlemskap, dagspass og QR-kode inngang.",
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

        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(1) .gallery-placeholder": { text: "Präzise Zonen für fokussiertes Krafttraining" },
        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(2) .gallery-placeholder": { text: "Klare Flächen. Hochwertig geplant." },
        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(3) .gallery-placeholder": { text: "Training, das strukturiert wirkt" },
        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(4) .gallery-placeholder": { text: "Mehr Ruhe. Mehr Fokus." },
        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(5) .gallery-placeholder": { text: "Starkes Setup für konsequentes Training" },

        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(1) .gallery-placeholder": { text: "Cardio in einer ruhigen Atmosphäre" },
        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(2) .gallery-placeholder": { text: "Bewegung mit Klarheit statt Hektik" },
        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(3) .gallery-placeholder": { text: "Sauber geplant. Direkt verständlich." },
        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(4) .gallery-placeholder": { text: "Cardio, das sich leicht anfühlt" },
        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(5) .gallery-placeholder": { text: "Ein Bereich, der Luft lässt" },

        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(1) .gallery-placeholder": { text: "Raum für freie Bewegung" },
        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(2) .gallery-placeholder": { text: "Flexibel trainieren. Klar bleiben." },
        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(3) .gallery-placeholder": { text: "Offene Flächen für echtes Training" },
        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(4) .gallery-placeholder": { text: "Dynamisch, ohne unruhig zu wirken" },
        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(5) .gallery-placeholder": { text: "Training mit Freiheit und Struktur" },

        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(1) .gallery-placeholder": { text: "Erholung als Teil des Konzepts" },
        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(2) .gallery-placeholder": { text: "Mehr Ruhe nach dem Training" },
        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(3) .gallery-placeholder": { text: "Ein Bereich, der bewusst entschleunigt" },
        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(4) .gallery-placeholder": { text: "Regeneration in klarer Umgebung" },
        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(5) .gallery-placeholder": { text: "Zurückkommen. Runterfahren. Weitergehen." },

        "#kraft-1-modal .gallery-placeholder": { text: "Krafttraining mit Fokus auf Klarheit, Qualität und Struktur" },
        "#kraft-2-modal .gallery-placeholder": { text: "Ein Bereich, der Leistung unterstützt, ohne laut zu wirken" },
        "#kraft-3-modal .gallery-placeholder": { text: "Präzise geplant für konsequentes Training" },
        "#kraft-4-modal .gallery-placeholder": { text: "Mehr Übersicht. Mehr Konzentration. Mehr NordFit." },
        "#kraft-5-modal .gallery-placeholder": { text: "Ein starker Trainingsbereich mit ruhiger Wirkung" },

        "#cardio-1-modal .gallery-placeholder": { text: "Cardio, das offen, leicht und klar gedacht ist" },
        "#cardio-2-modal .gallery-placeholder": { text: "Für Bewegung, die sich gut anfühlt" },
        "#cardio-3-modal .gallery-placeholder": { text: "Ein Bereich, der Tempo zulässt und Ruhe behält" },
        "#cardio-4-modal .gallery-placeholder": { text: "Klarer Aufbau für ein direkt verständliches Training" },
        "#cardio-5-modal .gallery-placeholder": { text: "Cardio im NordFit Stil: modern, sauber, zurückhaltend" },

        "#move-1-modal .gallery-placeholder": { text: "Functional Training mit offener, klarer Struktur" },
        "#move-2-modal .gallery-placeholder": { text: "Mehr Freiheit im Training, ohne Unruhe im Raum" },
        "#move-3-modal .gallery-placeholder": { text: "Bewegung braucht Raum — und ein gutes Gefühl dafür" },
        "#move-4-modal .gallery-placeholder": { text: "Dynamische Flächen, klar eingebunden ins Konzept" },
        "#move-5-modal .gallery-placeholder": { text: "Flexibles Training, hochwertig umgesetzt" },

        "#recovery-1-modal .gallery-placeholder": { text: "Regeneration mit derselben Ruhe wie der Rest des Studios" },
        "#recovery-2-modal .gallery-placeholder": { text: "Ein Bereich, der nicht auffällt — sondern gut tut" },
        "#recovery-3-modal .gallery-placeholder": { text: "Weniger Reize. Mehr Erholung." },
        "#recovery-4-modal .gallery-placeholder": { text: "Regeneration, die sich direkt stimmig anfühlt" },
        "#recovery-5-modal .gallery-placeholder": { text: "Ein ruhiger Abschluss für ein starkes Training" },
      },

      en: {
        ".hero-title": { text: "A studio that feels modern. And stays calm." },
        ".hero-subtitle": {
          html: "NordFit is built for people who do not want to simply tick off a workout, but want a place that feels clear, thoughtfully designed and right from the very first moment.",
        },
        ".hero-actions a:nth-child(1)": { text: "Plans" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Locations" },
        ".hero-image-caption h2": { text: "A first impression that never needs to be loud." },
        ".hero-image-caption p": {
          html: "From the outside, NordFit should already feel modern, calm and clean. Not overloaded, not generic — but clear enough that you instantly feel the attention to detail.",
        },

        ".area-section:nth-of-type(1) .area-copy h3": { text: "Strength Training" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functional Training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recovery" },

        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(1) .gallery-placeholder": { text: "Precise zones for focused strength training" },
        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(2) .gallery-placeholder": { text: "Clean spaces. Thoughtfully designed." },
        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(3) .gallery-placeholder": { text: "Training that feels structured" },
        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(4) .gallery-placeholder": { text: "More calm. More focus." },
        ".area-section:nth-of-type(1) .gallery-card:nth-of-type(5) .gallery-placeholder": { text: "A strong setup for consistent training" },

        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(1) .gallery-placeholder": { text: "Cardio in a calm atmosphere" },
        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(2) .gallery-placeholder": { text: "Movement with clarity instead of noise" },
        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(3) .gallery-placeholder": { text: "Cleanly planned. Easy to understand." },
        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(4) .gallery-placeholder": { text: "Cardio that feels light" },
        ".area-section:nth-of-type(2) .gallery-card:nth-of-type(5) .gallery-placeholder": { text: "A space that gives you room to breathe" },

        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(1) .gallery-placeholder": { text: "Room for free movement" },
        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(2) .gallery-placeholder": { text: "Train flexibly. Stay clear." },
        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(3) .gallery-placeholder": { text: "Open spaces for real training" },
        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(4) .gallery-placeholder": { text: "Dynamic without feeling restless" },
        ".area-section:nth-of-type(3) .gallery-card:nth-of-type(5) .gallery-placeholder": { text: "Training with freedom and structure" },

        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(1) .gallery-placeholder": { text: "Recovery as part of the concept" },
        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(2) .gallery-placeholder": { text: "More calm after training" },
        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(3) .gallery-placeholder": { text: "A space designed to slow things down" },
        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(4) .gallery-placeholder": { text: "Recovery in a clear environment" },
        ".area-section:nth-of-type(4) .gallery-card:nth-of-type(5) .gallery-placeholder": { text: "Come back. Slow down. Keep moving." },

        "#kraft-1-modal .gallery-placeholder": { text: "Strength training with a focus on clarity, quality and structure" },
        "#kraft-2-modal .gallery-placeholder": { text: "A space that supports performance without feeling loud" },
        "#kraft-3-modal .gallery-placeholder": { text: "Precisely designed for consistent training" },
        "#kraft-4-modal .gallery-placeholder": { text: "More overview. More focus. More NordFit." },
        "#kraft-5-modal .gallery-placeholder": { text: "A strong training area with a calm feel" },

        "#cardio-1-modal .gallery-placeholder": { text: "Cardio designed to feel open, light and clear" },
        "#cardio-2-modal .gallery-placeholder": { text: "For movement that feels right" },
        "#cardio-3-modal .gallery-placeholder": { text: "A space that allows pace while staying calm" },
        "#cardio-4-modal .gallery-placeholder": { text: "A clear setup for instantly understandable training" },
        "#cardio-5-modal .gallery-placeholder": { text: "Cardio in the NordFit style: modern, clean, understated" },

        "#move-1-modal .gallery-placeholder": { text: "Functional training with an open, clear structure" },
        "#move-2-modal .gallery-placeholder": { text: "More freedom in training without restlessness in the room" },
        "#move-3-modal .gallery-placeholder": { text: "Movement needs space — and a good feeling for it" },
        "#move-4-modal .gallery-placeholder": { text: "Dynamic areas integrated clearly into the concept" },
        "#move-5-modal .gallery-placeholder": { text: "Flexible training, executed with quality" },

        "#recovery-1-modal .gallery-placeholder": { text: "Recovery with the same calm feel as the rest of the studio" },
        "#recovery-2-modal .gallery-placeholder": { text: "A space that does not demand attention — it simply feels good" },
        "#recovery-3-modal .gallery-placeholder": { text: "Less input. More recovery." },
        "#recovery-4-modal .gallery-placeholder": { text: "Recovery that feels right immediately" },
        "#recovery-5-modal .gallery-placeholder": { text: "A calm finish for a strong session" },
      },

      fr: {
        ".hero-title": { text: "Un studio moderne. Et qui reste calme." },
        ".hero-subtitle": {
          html: "NordFit s’adresse à celles et ceux qui ne veulent pas simplement terminer un entraînement, mais trouver un lieu clair, soigné et juste dès le premier instant.",
        },
        ".hero-actions a:nth-child(1)": { text: "Tarifs" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Sites" },
        ".hero-image-caption h2": { text: "Une première impression qui n’a pas besoin d’être bruyante." },
        ".hero-image-caption p": {
          html: "Dès l’extérieur, NordFit doit paraître moderne, calme et propre. Pas chargé, pas interchangeable — mais assez clair pour que l’exigence se ressente immédiatement.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Musculation" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Entraînement fonctionnel" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Récupération" },
      },

      es: {
        ".hero-title": { text: "Un estudio moderno. Y que sigue siendo tranquilo." },
        ".hero-subtitle": {
          html: "NordFit está hecho para personas que no quieren simplemente completar un entrenamiento, sino encontrar un lugar claro, cuidado y acertado desde el primer momento.",
        },
        ".hero-actions a:nth-child(1)": { text: "Tarifas" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Ubicaciones" },
        ".hero-image-caption h2": { text: "Una primera impresión que no necesita ser ruidosa." },
        ".hero-image-caption p": {
          html: "Desde fuera, NordFit ya debe sentirse moderno, tranquilo y limpio. No recargado, no genérico — sino lo bastante claro como para notar el cuidado en cada detalle.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Entrenamiento de fuerza" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Entrenamiento funcional" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recuperación" },
      },

      it: {
        ".hero-title": { text: "Uno studio moderno. E che resta calmo." },
        ".hero-subtitle": {
          html: "NordFit è pensato per chi non vuole semplicemente finire un allenamento, ma trovare un luogo chiaro, curato e giusto fin dal primo momento.",
        },
        ".hero-actions a:nth-child(1)": { text: "Tariffe" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Sedi" },
        ".hero-image-caption h2": { text: "Una prima impressione che non ha bisogno di essere rumorosa." },
        ".hero-image-caption p": {
          html: "Già dall’esterno, NordFit deve apparire moderno, tranquillo e pulito. Non carico, non anonimo — ma abbastanza chiaro da far percepire subito la cura del dettaglio.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Allenamento di forza" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Allenamento funzionale" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recupero" },
      },

      pl: {
        ".hero-title": { text: "Nowoczesne studio. I spokojna atmosfera." },
        ".hero-subtitle": {
          html: "NordFit jest dla osób, które nie chcą po prostu odhaczyć treningu, ale znaleźć miejsce, które od początku wydaje się klarowne, dopracowane i właściwe.",
        },
        ".hero-actions a:nth-child(1)": { text: "Cennik" },
        ".hero-actions a:nth-child(2)": { text: "Aplikacja" },
        ".hero-actions a:nth-child(3)": { text: "Lokalizacje" },
        ".hero-image-caption h2": { text: "Pierwsze wrażenie nie musi być głośne." },
        ".hero-image-caption p": {
          html: "Już z zewnątrz NordFit ma wyglądać nowocześnie, spokojnie i czysto. Nie przeładowanie, nie przypadkowo — ale na tyle jasno, by od razu było czuć dbałość o szczegóły.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Trening siłowy" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Trening funkcjonalny" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Regeneracja" },
      },

      nl: {
        ".hero-title": { text: "Een studio die modern voelt. En rustig blijft." },
        ".hero-subtitle": {
          html: "NordFit is gemaakt voor mensen die een training niet zomaar willen afwerken, maar een plek zoeken die vanaf het eerste moment helder, doordacht en goed aanvoelt.",
        },
        ".hero-actions a:nth-child(1)": { text: "Tarieven" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Locaties" },
        ".hero-image-caption h2": { text: "Een eerste indruk die niet luid hoeft te zijn." },
        ".hero-image-caption p": {
          html: "Van buitenaf moet NordFit al modern, rustig en schoon aanvoelen. Niet druk, niet uitwisselbaar — maar helder genoeg om direct de aandacht voor detail te voelen.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Krachttraining" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functionele training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Herstel" },
      },

      da: {
        ".hero-title": { text: "Et studio, der føles moderne. Og forbliver roligt." },
        ".hero-subtitle": {
          html: "NordFit er til mennesker, der ikke bare vil overstå træningen, men finde et sted der føles klart, gennemtænkt og rigtigt fra første øjeblik.",
        },
        ".hero-actions a:nth-child(1)": { text: "Priser" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Lokationer" },
        ".hero-image-caption h2": { text: "Et første indtryk, der ikke behøver være højt." },
        ".hero-image-caption p": {
          html: "Allerede udefra skal NordFit føles moderne, roligt og rent. Ikke overfyldt, ikke tilfældigt — men klart nok til at man straks mærker omtanken i detaljen.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Styrketræning" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Funktionel træning" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Restitution" },
      },

      sv: {
        ".hero-title": { text: "En studio som känns modern. Och förblir lugn." },
        ".hero-subtitle": {
          html: "NordFit är till för människor som inte bara vill bli klara med ett pass, utan hitta en plats som känns tydlig, genomtänkt och rätt från första stund.",
        },
        ".hero-actions a:nth-child(1)": { text: "Priser" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Platser" },
        ".hero-image-caption h2": { text: "Ett första intryck som inte behöver vara högt." },
        ".hero-image-caption p": {
          html: "Redan utifrån ska NordFit kännas modernt, lugnt och rent. Inte rörigt, inte utbytbart — utan tydligt nog för att man direkt ska känna omsorgen i detaljerna.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Styrketräning" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Funktionell träning" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Återhämtning" },
      },

      no: {
        ".hero-title": { text: "Et studio som føles moderne. Og forblir rolig." },
        ".hero-subtitle": {
          html: "NordFit er for mennesker som ikke bare vil bli ferdige med en økt, men finne et sted som føles tydelig, gjennomtenkt og riktig fra første stund.",
        },
        ".hero-actions a:nth-child(1)": { text: "Priser" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Lokasjoner" },
        ".hero-image-caption h2": { text: "Et førsteinntrykk som ikke trenger å være høyt." },
        ".hero-image-caption p": {
          html: "Allerede utenfra skal NordFit føles moderne, rolig og rent. Ikke overfylt, ikke generisk — men tydelig nok til at man med én gang merker omtanken i detaljene.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Styrketrening" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Funksjonell trening" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Restitusjon" },
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

        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "pro Monat" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "pro Monat" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "pro Monat" },

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

        ".pricing-card:nth-of-type(1) .pricing-card-action .btn": { text: "In der App abschließen" },
        ".pricing-card:nth-of-type(2) .pricing-card-action .btn": { text: "In der App abschließen" },
        ".pricing-card:nth-of-type(3) .pricing-card-action .btn": { text: "In der App abschließen" },

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
          html: "At NordFit, it should be easy to see what is included, how long your plan runs and how flexibly you can decide again later on.",
        },
        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Sign-up, management and cancellation are handled entirely through the NordFit app. That keeps everything in one place — clear, direct and free from unnecessary detours.",
        },

        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "per month" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "per month" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "per month" },

        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 month minimum term" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Monthly cancellation afterwards" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 month minimum term" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Monthly cancellation afterwards" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 month minimum term" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Monthly cancellation afterwards" },

        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "The right starting point if you want to train regularly while keeping strong value in mind.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "For anyone who wants structure, but prefers noticeably more flexibility in their plan.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "The most flexible membership for anyone who wants to stay as free as possible and still get started right away.",
        },

        ".pricing-card:nth-of-type(1) .pricing-card-action .btn": { text: "Set up in the app" },
        ".pricing-card:nth-of-type(2) .pricing-card-action .btn": { text: "Set up in the app" },
        ".pricing-card:nth-of-type(3) .pricing-card-action .btn": { text: "Set up in the app" },

        ".daypass-shell .eyebrow": { text: "Day Pass" },
        ".daypass-shell .section-title": { text: "€4.90 per day" },
        ".daypass-shell .muted": {
          text: "Ideal if you want to get to know NordFit first or train spontaneously — without a membership.",
        },
        ".daypass-shell .btn": { text: "Book in the app" },
      },

      fr: {
        ".hero-title": { text: "Des tarifs qui restent clairs." },
        ".hero-subtitle": {
          html: "Chez NordFit, tout doit être compréhensible d’un seul regard : ce qui est inclus, la durée du tarif et la flexibilité ensuite.",
        },
        ".info-note-label": { text: "Info importante" },
        ".info-note-text": {
          html: "Souscription, gestion et résiliation passent entièrement par l’app NordFit. Tout reste ainsi au même endroit.",
        },
        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "par mois" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "par mois" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "par mois" },
        ".daypass-shell .eyebrow": { text: "Pass journalier" },
        ".daypass-shell .section-title": { text: "4,90 € par jour" },
        ".daypass-shell .btn": { text: "Réserver dans l’app" },
      },

      es: {
        ".hero-title": { text: "Tarifas que siguen siendo claras." },
        ".hero-subtitle": {
          html: "En NordFit debe entenderse de un vistazo qué incluye cada tarifa, cuánto dura y cuánta flexibilidad tienes después.",
        },
        ".info-note-label": { text: "Información importante" },
        ".info-note-text": {
          html: "Alta, gestión y cancelación se realizan por completo en la app de NordFit. Así todo queda en un solo lugar.",
        },
        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "al mes" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "al mes" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "al mes" },
        ".daypass-shell .eyebrow": { text: "Pase diario" },
        ".daypass-shell .section-title": { text: "4,90 € al día" },
        ".daypass-shell .btn": { text: "Reservar en la app" },
      },

      it: {
        ".hero-title": { text: "Tariffe che restano chiare." },
        ".hero-subtitle": {
          html: "Con NordFit deve essere chiaro a colpo d’occhio cosa è incluso, quanto dura la tariffa e quanta flessibilità resta dopo.",
        },
        ".info-note-label": { text: "Informazione importante" },
        ".info-note-text": {
          html: "Attivazione, gestione e disdetta avvengono interamente tramite l’app NordFit. Così tutto resta in un unico posto.",
        },
        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "al mese" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "al mese" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "al mese" },
        ".daypass-shell .eyebrow": { text: "Pass giornaliero" },
        ".daypass-shell .section-title": { text: "4,90 € al giorno" },
        ".daypass-shell .btn": { text: "Prenota nell’app" },
      },

      pl: {
        ".hero-title": { text: "Jasny cennik." },
        ".hero-subtitle": {
          html: "W NordFit od razu ma być jasne, co zawiera dany plan, jak długo trwa i jak elastycznie można później zdecydować dalej.",
        },
        ".info-note-label": { text: "Ważna informacja" },
        ".info-note-text": {
          html: "Aktywacja, zarządzanie i rezygnacja odbywają się całkowicie w aplikacji NordFit.",
        },
        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "miesięcznie" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "miesięcznie" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "miesięcznie" },
        ".daypass-shell .eyebrow": { text: "Wejściówka dzienna" },
        ".daypass-shell .section-title": { text: "4,90 € dziennie" },
        ".daypass-shell .btn": { text: "Kup w aplikacji" },
      },

      nl: {
        ".hero-title": { text: "Tarieven die helder blijven." },
        ".hero-subtitle": {
          html: "Bij NordFit moet je in één oogopslag zien wat inbegrepen is, hoe lang je plan loopt en hoeveel flexibiliteit je later nog hebt.",
        },
        ".info-note-label": { text: "Belangrijke info" },
        ".info-note-text": {
          html: "Afsluiten, beheren en opzeggen verloopt volledig via de NordFit app. Zo blijft alles op één plek.",
        },
        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "per maand" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "per maand" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "per maand" },
        ".daypass-shell .eyebrow": { text: "Dagpas" },
        ".daypass-shell .section-title": { text: "€4,90 per dag" },
        ".daypass-shell .btn": { text: "Boek in de app" },
      },

      da: {
        ".hero-title": { text: "Priser, der forbliver klare." },
        ".hero-subtitle": {
          html: "Hos NordFit skal det med det samme være tydeligt, hvad der er inkluderet, hvor længe planen løber, og hvor fleksibel du er bagefter.",
        },
        ".info-note-label": { text: "Vigtig info" },
        ".info-note-text": {
          html: "Oprettelse, administration og opsigelse foregår fuldt ud i NordFit-appen.",
        },
        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "pr. måned" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "pr. måned" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "pr. måned" },
        ".daypass-shell .eyebrow": { text: "Dagspas" },
        ".daypass-shell .section-title": { text: "4,90 € pr. dag" },
        ".daypass-shell .btn": { text: "Book i appen" },
      },

      sv: {
        ".hero-title": { text: "Priser som förblir tydliga." },
        ".hero-subtitle": {
          html: "Hos NordFit ska det direkt vara tydligt vad som ingår, hur länge planen gäller och hur flexibel du är senare.",
        },
        ".info-note-label": { text: "Viktig info" },
        ".info-note-text": {
          html: "Registrering, hantering och uppsägning sker helt i NordFit-appen.",
        },
        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "per månad" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "per månad" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "per månad" },
        ".daypass-shell .eyebrow": { text: "Dagspass" },
        ".daypass-shell .section-title": { text: "4,90 € per dag" },
        ".daypass-shell .btn": { text: "Boka i appen" },
      },

      no: {
        ".hero-title": { text: "Priser som forblir tydelige." },
        ".hero-subtitle": {
          html: "Hos NordFit skal det være tydelig med én gang hva som er inkludert, hvor lenge planen varer, og hvor fleksibel du er senere.",
        },
        ".info-note-label": { text: "Viktig info" },
        ".info-note-text": {
          html: "Opprettelse, administrasjon og oppsigelse skjer fullt ut i NordFit-appen.",
        },
        ".pricing-card:nth-of-type(1) .muted:first-of-type": { text: "per måned" },
        ".pricing-card:nth-of-type(2) .muted:first-of-type": { text: "per måned" },
        ".pricing-card:nth-of-type(3) .muted:first-of-type": { text: "per måned" },
        ".daypass-shell .eyebrow": { text: "Dagspass" },
        ".daypass-shell .section-title": { text: "4,90 € per dag" },
        ".daypass-shell .btn": { text: "Book i appen" },
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

        ".section-no-top .grid-2 > div:first-child .section-title.large-title": { text: "Grevesmühlen" },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(1)": {
          text: "Hier beginnt NordFit mit einem Studio, das auf Ruhe, gute Erreichbarkeit und einen klaren Aufbau ausgelegt ist. Kein unnötig lauter Auftritt, sondern ein Ort, an dem man sich schnell orientieren kann.",
        },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(2)": {
          text: "Geplant sind 24/7 Zugang, eine saubere App-Anbindung, ein einfacher Ablauf und ein Studio, das bewusst hochwertig statt chaotisch wirkt.",
        },
        ".image-frame-label": { text: "Studio Hauptbild" },

        ".section.section-tight .glass.reveal .section-title": { text: "Standort ansehen" },
        ".section.section-tight .glass.reveal > p.muted": {
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
          html: "The first NordFit location should not simply be easy to reach. It should feel clear, calm and right from the beginning — in its look, in its flow and in the concept as a whole.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit intentionally starts with a location that does not feel overloaded. Less distraction, more structure and a studio you understand immediately.",
        },

        ".section-no-top .grid-2 > div:first-child .section-title.large-title": { text: "Grevesmühlen" },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(1)": {
          text: "This is where NordFit begins: with a studio designed around calm, easy access and a clear layout. Not unnecessarily loud, but a place you can understand quickly.",
        },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(2)": {
          text: "The plan includes 24/7 access, clean app integration, a simple flow and a studio that feels intentionally premium rather than chaotic.",
        },
        ".image-frame-label": { text: "Main studio image" },

        ".section.section-tight .glass.reveal .section-title": { text: "View location" },
        ".section.section-tight .glass.reveal > p.muted": {
          text: "Anyone looking for NordFit should not need to search for long. The map and direct routing make the location easy to understand right away.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Maps" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },

      fr: {
        ".hero-title": { text: "Un site qui a du sens immédiatement." },
        ".hero-subtitle": {
          html: "Le premier site NordFit ne doit pas seulement être accessible. Il doit sembler clair, calme et cohérent dès le départ.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit commence volontairement avec un site qui n’est pas surchargé. Moins de distraction, plus de structure.",
        },
        ".section.section-tight .glass.reveal .section-title": { text: "Voir le site" },
      },

      es: {
        ".hero-title": { text: "Una ubicación que encaja desde el primer momento." },
        ".hero-subtitle": {
          html: "La primera ubicación de NordFit no solo debe ser accesible. Debe sentirse clara, tranquila y coherente desde el inicio.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit empieza conscientemente con una ubicación que no se siente recargada. Menos distracción, más estructura.",
        },
        ".section.section-tight .glass.reveal .section-title": { text: "Ver ubicación" },
      },

      it: {
        ".hero-title": { text: "Una sede che ha subito senso." },
        ".hero-subtitle": {
          html: "La prima sede NordFit non deve solo essere facile da raggiungere. Deve sembrare chiara, calma e coerente fin dall’inizio.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit parte consapevolmente con una sede che non appare sovraccarica. Meno distrazioni, più struttura.",
        },
        ".section.section-tight .glass.reveal .section-title": { text: "Vedi sede" },
      },

      pl: {
        ".hero-title": { text: "Lokalizacja, która od razu ma sens." },
        ".hero-subtitle": {
          html: "Pierwsza lokalizacja NordFit ma być nie tylko łatwo dostępna. Ma od początku wydawać się klarowna, spokojna i spójna.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit startuje świadomie z lokalizacją, która nie jest przeładowana. Mniej rozproszeń, więcej struktury.",
        },
        ".section.section-tight .glass.reveal .section-title": { text: "Zobacz lokalizację" },
      },

      nl: {
        ".hero-title": { text: "Een locatie die meteen logisch voelt." },
        ".hero-subtitle": {
          html: "De eerste NordFit-locatie moet niet alleen goed bereikbaar zijn. Ze moet vanaf het begin helder, rustig en kloppend aanvoelen.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit start bewust met een locatie die niet overvol aanvoelt. Minder afleiding, meer structuur.",
        },
        ".section.section-tight .glass.reveal .section-title": { text: "Locatie bekijken" },
      },

      da: {
        ".hero-title": { text: "En lokation der giver mening med det samme." },
        ".hero-subtitle": {
          html: "Den første NordFit-lokation skal ikke bare være nem at nå. Den skal føles klar, rolig og rigtig fra begyndelsen.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit starter bevidst med en lokation, der ikke føles overfyldt. Færre forstyrrelser, mere struktur.",
        },
        ".section.section-tight .glass.reveal .section-title": { text: "Se lokation" },
      },

      sv: {
        ".hero-title": { text: "En plats som känns rätt direkt." },
        ".hero-subtitle": {
          html: "NordFits första plats ska inte bara vara lätt att nå. Den ska kännas tydlig, lugn och självklar från början.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit startar medvetet med en plats som inte känns överlastad. Mindre distraktion, mer struktur.",
        },
        ".section.section-tight .glass.reveal .section-title": { text: "Visa plats" },
      },

      no: {
        ".hero-title": { text: "En lokasjon som gir mening med én gang." },
        ".hero-subtitle": {
          html: "Den første NordFit-lokasjonen skal ikke bare være lett å nå. Den skal føles tydelig, rolig og riktig fra starten.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit starter bevisst med en lokasjon som ikke føles overlesset. Mindre distraksjon, mer struktur.",
        },
        ".section.section-tight .glass.reveal .section-title": { text: "Se lokasjon" },
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

        ".section-no-top .section-title.large-title": { text: "Ein Konto. Ein QR-Code. Ein klarer Ablauf." },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(1)": {
          text: "Bei NordFit läuft alles über einen einzigen, sauberen Weg. Keine Papierformulare, keine unnötigen Zwischenschritte und kein unklarer Ablauf.",
        },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(2)": {
          text: "In der App schließt du deine Mitgliedschaft ab, buchst deinen Tagespass, verwaltest deine Daten und bekommst den QR-Code, mit dem du direkt ins Studio kommst.",
        },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(3)": {
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
          html: "The NordFit app is not just an extra. It is the central access point to everything at NordFit that is designed to work in a simple, clear and digital way.",
        },

        ".store-badge:nth-of-type(1) .store-badge-small": { text: "DOWNLOAD ON THE" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "GET IT ON" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },

        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Without the NordFit app, there is no entry to the studio. Membership, day pass, account management and QR code access all run through it.",
        },

        ".section-no-top .section-title.large-title": { text: "One account. One QR code. One clear flow." },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(1)": {
          text: "At NordFit, everything runs through one clean path. No paper forms, no unnecessary extra steps and no unclear process.",
        },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(2)": {
          text: "In the app, you set up your membership, book your day pass, manage your details and receive the QR code that gets you straight into the studio.",
        },
        ".section-no-top .grid-2 > div:first-child p.muted:nth-of-type(3)": {
          text: "That is exactly why the app is not an optional extra, but a fixed part of the full NordFit concept.",
        },

        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Entry by QR code" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Your access lives directly in the app — fast, clear and without detours." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Set up membership digitally" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Book it, review it and manage it in one place." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Buy a day pass directly" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Ideal if you want to get to know NordFit first or train spontaneously." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Everything clearly in view" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Location, access and personal account management stay clearly bundled." },
      },

      fr: {
        ".hero-title": { text: "Tout l’essentiel. Dans une app." },
        ".hero-subtitle": {
          html: "L’app NordFit n’est pas un simple extra. C’est l’accès central à tout ce qui doit fonctionner de façon simple, claire et numérique.",
        },
        ".info-note-label": { text: "Info importante" },
        ".info-note-text": {
          html: "Sans l’app NordFit, il n’y a pas d’accès au studio.",
        },
        ".section-no-top .section-title.large-title": { text: "Un compte. Un QR code. Un fonctionnement clair." },
      },

      es: {
        ".hero-title": { text: "Todo lo importante. En una app." },
        ".hero-subtitle": {
          html: "La app de NordFit no es un simple extra. Es el acceso central a todo lo que en NordFit debe funcionar de forma clara, sencilla y digital.",
        },
        ".info-note-label": { text: "Información importante" },
        ".info-note-text": {
          html: "Sin la app de NordFit no hay acceso al estudio.",
        },
        ".section-no-top .section-title.large-title": { text: "Una cuenta. Un código QR. Un proceso claro." },
      },

      it: {
        ".hero-title": { text: "Tutto ciò che conta. In un’unica app." },
        ".hero-subtitle": {
          html: "L’app NordFit non è un semplice extra. È l’accesso centrale a tutto ciò che deve funzionare in modo chiaro, semplice e digitale.",
        },
        ".info-note-label": { text: "Informazione importante" },
        ".info-note-text": {
          html: "Senza l’app NordFit non è possibile entrare nello studio.",
        },
        ".section-no-top .section-title.large-title": { text: "Un account. Un QR code. Un flusso chiaro." },
      },

      pl: {
        ".hero-title": { text: "Wszystko, co ważne. W jednej aplikacji." },
        ".hero-subtitle": {
          html: "Aplikacja NordFit to nie dodatek. To centralny dostęp do wszystkiego, co ma działać prosto, jasno i cyfrowo.",
        },
        ".info-note-label": { text: "Ważna informacja" },
        ".info-note-text": {
          html: "Bez aplikacji NordFit nie ma wejścia do studia.",
        },
        ".section-no-top .section-title.large-title": { text: "Jedno konto. Jeden kod QR. Jasny proces." },
      },

      nl: {
        ".hero-title": { text: "Alles wat belangrijk is. In één app." },
        ".hero-subtitle": {
          html: "De NordFit app is geen extraatje. Het is de centrale toegang tot alles wat bij NordFit eenvoudig, helder en digitaal moet werken.",
        },
        ".info-note-label": { text: "Belangrijke info" },
        ".info-note-text": {
          html: "Zonder de NordFit app is er geen toegang tot de studio.",
        },
        ".section-no-top .section-title.large-title": { text: "Eén account. Eén QR-code. Eén duidelijke flow." },
      },

      da: {
        ".hero-title": { text: "Alt det vigtige. I én app." },
        ".hero-subtitle": {
          html: "NordFit-appen er ikke bare et ekstra lag. Den er den centrale adgang til alt det, der skal fungere enkelt, klart og digitalt.",
        },
        ".info-note-label": { text: "Vigtig info" },
        ".info-note-text": {
          html: "Uden NordFit-appen er der ingen adgang til studiet.",
        },
        ".section-no-top .section-title.large-title": { text: "Én konto. Én QR-kode. Ét klart flow." },
      },

      sv: {
        ".hero-title": { text: "Allt viktigt. I en app." },
        ".hero-subtitle": {
          html: "NordFit-appen är inte bara ett extra tillägg. Den är den centrala vägen till allt som ska fungera enkelt, tydligt och digitalt.",
        },
        ".info-note-label": { text: "Viktig info" },
        ".info-note-text": {
          html: "Utan NordFit-appen finns ingen tillgång till studion.",
        },
        ".section-no-top .section-title.large-title": { text: "Ett konto. En QR-kod. Ett tydligt flöde." },
      },

      no: {
        ".hero-title": { text: "Alt det viktige. I én app." },
        ".hero-subtitle": {
          html: "NordFit-appen er ikke bare et ekstra tillegg. Den er den sentrale veien til alt som skal fungere enkelt, tydelig og digitalt.",
        },
        ".info-note-label": { text: "Viktig info" },
        ".info-note-text": {
          html: "Uten NordFit-appen er det ingen tilgang til studioet.",
        },
        ".section-no-top .section-title.large-title": { text: "Én konto. Én QR-kode. Ett tydelig oppsett." },
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

        ".house-rules-stack > article:nth-of-type(1) .section-title": { text: "Zutritt nur mit gültigem Zugang" },
        ".house-rules-stack > article:nth-of-type(2) .section-title": { text: "Kein Zutritt für Unbefugte" },
        ".house-rules-stack > article:nth-of-type(3) .section-title": { text: "Geeignete Trainingskleidung" },
        ".house-rules-stack > article:nth-of-type(4) .section-title": { text: "Handtuch benutzen" },
        ".house-rules-stack > article:nth-of-type(5) .section-title": { text: "Geräte ordentlich hinterlassen" },
        ".house-rules-stack > article:nth-of-type(6) .section-title": { text: "Respekt im Umgang" },
        ".house-rules-stack > article:nth-of-type(7) .section-title": { text: "Sicher und verantwortungsvoll trainieren" },
        ".house-rules-stack > article:nth-of-type(8) .section-title": { text: "Ruhe und Ordnung im Studio" },
        ".house-rules-stack > article:nth-of-type(9) .section-title": { text: "Sauberkeit zählt mit" },
        ".house-rules-stack > article:nth-of-type(10) .section-title": { text: "Hausrecht" },
      },

      en: {
        ".hero-title": { text: "Clear rules. Calm training." },
        ".hero-subtitle": {
          html: "NordFit should feel clean, respectful and pleasant. These house rules create a clear and reliable framework for that.",
        },
        ".info-note-label": { text: "Principle" },
        ".info-note-text": {
          html: "Anyone training at NordFit should be able to rely on a fair, calm and clean environment. These rules exist for exactly that — not as overstatement, but as a standard.",
        },

        ".house-rules-stack > article:nth-of-type(1) .section-title": { text: "Entry only with valid access" },
        ".house-rules-stack > article:nth-of-type(2) .section-title": { text: "No entry for unauthorized persons" },
        ".house-rules-stack > article:nth-of-type(3) .section-title": { text: "Appropriate training clothing" },
        ".house-rules-stack > article:nth-of-type(4) .section-title": { text: "Use a towel" },
        ".house-rules-stack > article:nth-of-type(5) .section-title": { text: "Leave equipment in order" },
        ".house-rules-stack > article:nth-of-type(6) .section-title": { text: "Respect in how you treat others" },
        ".house-rules-stack > article:nth-of-type(7) .section-title": { text: "Train safely and responsibly" },
        ".house-rules-stack > article:nth-of-type(8) .section-title": { text: "Calm and order in the studio" },
        ".house-rules-stack > article:nth-of-type(9) .section-title": { text: "Cleanliness matters too" },
        ".house-rules-stack > article:nth-of-type(10) .section-title": { text: "House rights" },
      },

      fr: {
        ".hero-title": { text: "Des règles claires. Un entraînement calme." },
        ".hero-subtitle": {
          html: "NordFit doit sembler propre, respectueux et agréable. Ce règlement crée le cadre nécessaire.",
        },
        ".info-note-label": { text: "Principe" },
      },

      es: {
        ".hero-title": { text: "Normas claras. Entrenamiento tranquilo." },
        ".hero-subtitle": {
          html: "NordFit debe sentirse limpio, respetuoso y agradable. Estas normas crean ese marco claro.",
        },
        ".info-note-label": { text: "Principio" },
      },

      it: {
        ".hero-title": { text: "Regole chiare. Allenamento tranquillo." },
        ".hero-subtitle": {
          html: "NordFit deve sembrare pulito, rispettoso e piacevole. Questo regolamento crea un quadro chiaro e affidabile.",
        },
        ".info-note-label": { text: "Principio" },
      },

      pl: {
        ".hero-title": { text: "Jasne zasady. Spokojny trening." },
        ".hero-subtitle": {
          html: "NordFit ma być miejscem czystym, pełnym szacunku i przyjemnym. Ten regulamin tworzy jasne ramy.",
        },
        ".info-note-label": { text: "Zasada" },
      },

      nl: {
        ".hero-title": { text: "Duidelijke regels. Rustig trainen." },
        ".hero-subtitle": {
          html: "NordFit moet schoon, respectvol en prettig aanvoelen. Deze huisregels geven daarvoor een helder kader.",
        },
        ".info-note-label": { text: "Principe" },
      },

      da: {
        ".hero-title": { text: "Klare regler. Rolig træning." },
        ".hero-subtitle": {
          html: "NordFit skal føles rent, respektfuldt og behageligt. Disse regler skaber den klare ramme for det.",
        },
        ".info-note-label": { text: "Princip" },
      },

      sv: {
        ".hero-title": { text: "Tydliga regler. Lugn träning." },
        ".hero-subtitle": {
          html: "NordFit ska kännas rent, respektfullt och behagligt. Dessa regler skapar en tydlig ram för det.",
        },
        ".info-note-label": { text: "Princip" },
      },

      no: {
        ".hero-title": { text: "Tydelige regler. Rolig trening." },
        ".hero-subtitle": {
          html: "NordFit skal føles rent, respektfullt og behagelig. Disse reglene skaper en tydelig og pålitelig ramme.",
        },
        ".info-note-label": { text: "Prinsipp" },
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

      fr: {
        ".hero-title": { text: "Direct. Clair. Personnel." },
        ".hero-subtitle": {
          html: "Si tu as des questions sur NordFit, l’app, ton accès ou un abonnement, tu peux nous joindre ici directement.",
        },
        ".section-block .section-title": { text: "Moyens de contact" },
        ".contact-form-shell .section-title": { text: "Formulaire de contact" },
        ".contact-form-footer .btn": { text: "Envoyer le message" },
      },

      es: {
        ".hero-title": { text: "Directo. Claro. Personal." },
        ".hero-subtitle": {
          html: "Si tienes preguntas sobre NordFit, la app, tu acceso o una membresía, puedes contactarnos aquí directamente.",
        },
        ".section-block .section-title": { text: "Opciones de contacto" },
        ".contact-form-shell .section-title": { text: "Formulario de contacto" },
        ".contact-form-footer .btn": { text: "Enviar mensaje" },
      },

      it: {
        ".hero-title": { text: "Diretto. Chiaro. Personale." },
        ".hero-subtitle": {
          html: "Se hai domande su NordFit, sull’app, sul tuo accesso o su un abbonamento, puoi contattarci qui direttamente.",
        },
        ".section-block .section-title": { text: "Contatti" },
        ".contact-form-shell .section-title": { text: "Modulo di contatto" },
        ".contact-form-footer .btn": { text: "Invia messaggio" },
      },

      pl: {
        ".hero-title": { text: "Bezpośrednio. Jasno. Osobiście." },
        ".hero-subtitle": {
          html: "Jeśli masz pytania o NordFit, aplikację, dostęp lub karnet, możesz skontaktować się z nami tutaj bezpośrednio.",
        },
        ".section-block .section-title": { text: "Kontakt" },
        ".contact-form-shell .section-title": { text: "Formularz kontaktowy" },
        ".contact-form-footer .btn": { text: "Wyślij wiadomość" },
      },

      nl: {
        ".hero-title": { text: "Direct. Helder. Persoonlijk." },
        ".hero-subtitle": {
          html: "Heb je vragen over NordFit, de app, je toegang of een lidmaatschap, dan kun je ons hier direct bereiken.",
        },
        ".section-block .section-title": { text: "Contactopties" },
        ".contact-form-shell .section-title": { text: "Contactformulier" },
        ".contact-form-footer .btn": { text: "Bericht verzenden" },
      },

      da: {
        ".hero-title": { text: "Direkte. Klart. Personligt." },
        ".hero-subtitle": {
          html: "Hvis du har spørgsmål om NordFit, appen, din adgang eller et medlemskab, kan du kontakte os direkte her.",
        },
        ".section-block .section-title": { text: "Kontaktmuligheder" },
        ".contact-form-shell .section-title": { text: "Kontaktformular" },
        ".contact-form-footer .btn": { text: "Send besked" },
      },

      sv: {
        ".hero-title": { text: "Direkt. Tydligt. Personligt." },
        ".hero-subtitle": {
          html: "Om du har frågor om NordFit, appen, ditt tillträde eller ett medlemskap kan du kontakta oss här direkt.",
        },
        ".section-block .section-title": { text: "Kontaktvägar" },
        ".contact-form-shell .section-title": { text: "Kontaktformulär" },
        ".contact-form-footer .btn": { text: "Skicka meddelande" },
      },

      no: {
        ".hero-title": { text: "Direkte. Tydelig. Personlig." },
        ".hero-subtitle": {
          html: "Har du spørsmål om NordFit, appen, tilgangen din eller et medlemskap, kan du kontakte oss direkte her.",
        },
        ".section-block .section-title": { text: "Kontaktmuligheter" },
        ".contact-form-shell .section-title": { text: "Kontaktskjema" },
        ".contact-form-footer .btn": { text: "Send melding" },
      },
    },

    impressum: {
      de: {
        ".hero-title": { text: "Rechtliches. Klar formuliert." },
        ".hero-subtitle": {
          html: "Auch im rechtlichen Bereich soll NordFit nachvollziehbar, transparent und sauber auftreten — ohne unnötige Komplexität und ohne versteckte Formulierungen.",
        },

        ".legal-grid .section-block .section-title.large-title": { text: "Impressum" },
        ".legal-label:nth-of-type(1)": { text: "Firmenname" },
        ".legal-label:nth-of-type(2)": { text: "E-Mail" },
        ".legal-label:nth-of-type(3)": { text: "Instagram" },
        ".legal-label:nth-of-type(4)": { text: "Adresse" },
        ".legal-info-row:nth-of-type(4) strong": { text: "Bald verfügbar" },

        ".legal-missing-info .muted": {
          text: "Fehlende Angaben werden hier ergänzt, sobald sie final feststehen.",
        },

        ".legal-actions-card .section-title": { text: "Schnellzugriff" },
        ".legal-actions-card .muted": {
          text: "AGB, Datenschutz und Hausordnung lassen sich hier direkt öffnen — klar erreichbar und ohne langes Suchen.",
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
          html: "Even in legal matters, NordFit should appear understandable, transparent and clean — without unnecessary complexity and without hidden wording.",
        },

        ".legal-grid .section-block .section-title.large-title": { text: "Legal Notice" },
        ".legal-label:nth-of-type(1)": { text: "Company name" },
        ".legal-label:nth-of-type(2)": { text: "Email" },
        ".legal-label:nth-of-type(3)": { text: "Instagram" },
        ".legal-label:nth-of-type(4)": { text: "Address" },
        ".legal-info-row:nth-of-type(4) strong": { text: "Coming soon" },

        ".legal-missing-info .muted": {
          text: "Missing details will be added here as soon as they are final.",
        },

        ".legal-actions-card .section-title": { text: "Quick access" },
        ".legal-actions-card .muted": {
          text: "Terms, privacy and house rules can be opened directly here — easy to reach and without long searching.",
        },
        ".legal-action-buttons .btn:nth-child(1)": { text: "Open terms" },
        ".legal-action-buttons .btn:nth-child(2)": { text: "Open privacy" },
        ".legal-action-buttons .btn:nth-child(3)": { text: "Open house rules" },

        "#agb-modal .section-title": { text: "Terms and Conditions" },
        "#agb-modal .muted": {
          text: "The terms will be completed in full and worked out properly before publication. Until then, this area serves as a visible placeholder.",
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

      fr: {
        ".hero-title": { text: "Mentions légales. Clairement formulées." },
        ".hero-subtitle": {
          html: "Même dans la partie juridique, NordFit doit rester compréhensible, transparent et propre.",
        },
        ".legal-actions-card .section-title": { text: "Accès rapide" },
      },

      es: {
        ".hero-title": { text: "Legal. Claramente formulado." },
        ".hero-subtitle": {
          html: "También en la parte legal, NordFit debe mostrarse comprensible, transparente y limpio.",
        },
        ".legal-actions-card .section-title": { text: "Acceso rápido" },
      },

      it: {
        ".hero-title": { text: "Area legale. Formulata con chiarezza." },
        ".hero-subtitle": {
          html: "Anche nella parte legale, NordFit deve apparire comprensibile, trasparente e ordinato.",
        },
        ".legal-actions-card .section-title": { text: "Accesso rapido" },
      },

      pl: {
        ".hero-title": { text: "Informacje prawne. Jasno sformułowane." },
        ".hero-subtitle": {
          html: "Również w części prawnej NordFit ma być zrozumiały, przejrzysty i uporządkowany.",
        },
        ".legal-actions-card .section-title": { text: "Szybki dostęp" },
      },

      nl: {
        ".hero-title": { text: "Juridisch. Helder geformuleerd." },
        ".hero-subtitle": {
          html: "Ook in het juridische deel moet NordFit begrijpelijk, transparant en netjes overkomen.",
        },
        ".legal-actions-card .section-title": { text: "Snelle toegang" },
      },

      da: {
        ".hero-title": { text: "Juridisk. Klart formuleret." },
        ".hero-subtitle": {
          html: "Også i den juridiske del skal NordFit fremstå forståeligt, gennemsigtigt og rent.",
        },
        ".legal-actions-card .section-title": { text: "Hurtig adgang" },
      },

      sv: {
        ".hero-title": { text: "Juridik. Tydligt formulerat." },
        ".hero-subtitle": {
          html: "Även i den juridiska delen ska NordFit kännas begripligt, transparent och välordnat.",
        },
        ".legal-actions-card .section-title": { text: "Snabbåtkomst" },
      },

      no: {
        ".hero-title": { text: "Juridisk. Klart formulert." },
        ".hero-subtitle": {
          html: "Også i den juridiske delen skal NordFit fremstå forståelig, transparent og ryddig.",
        },
        ".legal-actions-card .section-title": { text: "Hurtigtilgang" },
      },
    },
  };
});
