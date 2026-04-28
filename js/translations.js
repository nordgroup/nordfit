/* =========================
   NordFit translations.js
   Stable translation system
   Languages:
   de, en, fr, es, it, pl, nl, sv, da, no
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const supportedLanguages = ["de", "en", "fr", "es", "it", "pl", "nl", "sv", "da", "no"];
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

  function updateFooterCopyright(lang) {
    const footerText = footerCopyright[lang] || footerCopyright[defaultLanguage];
    const footerCopyrightElement = document.querySelector(".footer-row > p.muted");
    if (!footerCopyrightElement) return;
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
    sv: ["Hem", "Priser", "Platser", "App", "Regler", "Kontakt"],
    da: ["Hjem", "Priser", "Lokationer", "App", "Husregler", "Kontakt"],
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
    sv: ["Juridik / Villkor / Integritet", "Regler", "Kontakt", "Instagram"],
    da: ["Jura / Vilkår / Privatliv", "Husregler", "Kontakt", "Instagram"],
    no: ["Juridisk / Vilkår / Personvern", "Husregler", "Kontakt", "Instagram"],
  };

  const footerCopyright = {
    de: "© 2030 NordFit / NordGroup. Do not distribute!",
    en: "© 2030 NordFit / NordGroup. Do not distribute!",
    fr: "© 2030 NordFit / NordGroup. Do not distribute!",
    es: "© 2030 NordFit / NordGroup. Do not distribute!",
    it: "© 2030 NordFit / NordGroup. Do not distribute!",
    pl: "© 2030 NordFit / NordGroup. Do not distribute!",
    nl: "© 2030 NordFit / NordGroup. Do not distribute!",
    sv: "© 2030 NordFit / NordGroup. Do not distribute!",
    da: "© 2030 NordFit / NordGroup. Do not distribute!",
    no: "© 2030 NordFit / NordGroup. Do not distribute!",
  };

  const languageLabels = {
    de: ["Deutsch", "English", "Français", "Español", "Italiano", "Polski", "Nederlands", "Svenska", "Dansk", "Norsk"],
    en: ["German", "English", "French", "Spanish", "Italian", "Polish", "Dutch", "Swedish", "Danish", "Norwegian"],
    fr: ["Allemand", "Anglais", "Français", "Espagnol", "Italien", "Polonais", "Néerlandais", "Suédois", "Danois", "Norvégien"],
    es: ["Alemán", "Inglés", "Francés", "Español", "Italiano", "Polaco", "Neerlandés", "Sueco", "Danés", "Noruego"],
    it: ["Tedesco", "Inglese", "Francese", "Spagnolo", "Italiano", "Polacco", "Olandese", "Svedese", "Danese", "Norvegese"],
    pl: ["Niemiecki", "Angielski", "Francuski", "Hiszpański", "Włoski", "Polski", "Niderlandzki", "Szwedzki", "Duński", "Norweski"],
    nl: ["Duits", "Engels", "Frans", "Spaans", "Italiaans", "Pools", "Nederlands", "Zweeds", "Deens", "Noors"],
    sv: ["Tyska", "Engelska", "Franska", "Spanska", "Italienska", "Polska", "Nederländska", "Svenska", "Danska", "Norska"],
    da: ["Tysk", "Engelsk", "Fransk", "Spansk", "Italiensk", "Polsk", "Nederlandsk", "Svensk", "Dansk", "Norsk"],
    no: ["Tysk", "Engelsk", "Fransk", "Spansk", "Italiensk", "Polsk", "Nederlandsk", "Svensk", "Dansk", "Norsk"],
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
    sv: {
      index: "NordFit – Hem",
      mitgliedschaften: "NordFit – Priser",
      standorte: "NordFit – Platser",
      app: "NordFit – App",
      hausordnung: "NordFit – Regler",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Juridik",
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
      impressum: "Aviso legal, condiciones y privacidad de NordFit.",
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
    sv: {
      index: "NordFit – ett modernt gym med tydlig känsla, premiumytor och lugn design.",
      mitgliedschaften: "NordFit priser och dagspass – tydligt, rättvist och direkt hanterat i appen.",
      standorte: "NordFit platser – genomtänkta, lättillgängliga och skapade för att kännas rätt direkt.",
      app: "NordFit-appen ger tillgång till medlemskap, dagspass och QR-kodsinträde.",
      hausordnung: "NordFits regler – tydliga regler för lugn, ren och respektfull träning.",
      kontakt: "Kontakt med NordFit – e-post, Instagram och kontaktformulär.",
      impressum: "Juridisk information, villkor och integritet för NordFit.",
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
      },
      fr: {
        ".hero-title": { text: "Un studio moderne. Et qui reste calme." }
      },
      es: {
        ".hero-title": { text: "Un estudio moderno. Y que sigue siendo tranquilo." }
      },
      it: {
        ".hero-title": { text: "Uno studio moderno. E che resta calmo." }
      },
      pl: {
        ".hero-title": { text: "Nowoczesne studio. I spokojna atmosfera." }
      },
      nl: {
        ".hero-title": { text: "Een studio die modern voelt. En rustig blijft." }
      },
      sv: {
        ".hero-title": { text: "En studio som känns modern. Och förblir lugn." }
      },
      da: {
        ".hero-title": { text: "Et studio, der føles moderne. Og forbliver roligt." }
      },
      no: {
        ".hero-title": { text: "Et studio som føles moderne. Og forblir rolig." }
      }
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
        ".daypass-shell .eyebrow": { text: "Tagespass" },
        ".daypass-shell .section-title": { text: "4,90 € pro Tag" },
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
        ".daypass-shell .eyebrow": { text: "Day Pass" },
        ".daypass-shell .section-title": { text: "€4.90 per day" },
        ".daypass-shell .btn": { text: "Book in the app" },
      }
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
        ".image-frame-label": { text: "Studio Hauptbild" },
        ".section.section-tight .glass.reveal .section-title": { text: "Standort ansehen" },
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
        ".image-frame-label": { text: "Main studio image" },
        ".section.section-tight .glass.reveal .section-title": { text: "View location" },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Maps" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      }
    },

    app: {
      de: {
        ".hero-title": { text: "Alles Wichtige. In einer App." },
        ".hero-subtitle": {
          html: "Die NordFit App ist nicht bloß ein Extra. Sie ist der zentrale Zugang zu allem, was bei NordFit bewusst einfach, klar und digital funktionieren soll.",
        },
        ".info-note-label": { text: "Wichtige Info" },
        ".info-note-text": {
          html: "Ohne NordFit App gibt es keinen Zutritt zum Studio. Mitgliedschaft, Tagespass, Verwaltung und QR-Code laufen vollständig darüber.",
        },
        ".section-no-top .section-title.large-title": { text: "Ein Konto. Ein QR-Code. Ein klarer Ablauf." },
      },
      en: {
        ".hero-title": { text: "Everything important. In one app." },
        ".hero-subtitle": {
          html: "The NordFit app is not just an extra. It is the central access point to everything at NordFit that is designed to work in a simple, clear and digital way.",
        },
        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Without the NordFit app, there is no entry to the studio. Membership, day pass, account management and QR code access all run through it.",
        },
        ".section-no-top .section-title.large-title": { text: "One account. One QR code. One clear flow." },
      }
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
      }
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
        ".contact-form-footer .btn": { text: "Send message" },
      }
    },

    impressum: {
      de: {
        ".hero-title": { text: "Rechtliches. Klar formuliert." },
        ".hero-subtitle": {
          html: "Auch im rechtlichen Bereich soll NordFit nachvollziehbar, transparent und sauber auftreten — ohne unnötige Komplexität und ohne versteckte Formulierungen.",
        },
        ".legal-grid .section-block .section-title.large-title": { text: "Impressum" },
        ".legal-actions-card .section-title": { text: "Schnellzugriff" },
        ".legal-action-buttons .btn:nth-child(1)": { text: "AGB öffnen" },
        ".legal-action-buttons .btn:nth-child(2)": { text: "Datenschutz öffnen" },
        ".legal-action-buttons .btn:nth-child(3)": { text: "Hausordnung öffnen" },
        "#agb-modal .section-title": { text: "Allgemeine Geschäftsbedingungen" },
        "#privacy-modal .section-title": { text: "Datenschutzerklärung" },
        "#rules-modal .section-title": { text: "Hausordnung" },
      },
      en: {
        ".hero-title": { text: "Legal. Clearly written." },
        ".hero-subtitle": {
          html: "Even in legal matters, NordFit should appear understandable, transparent and clean — without unnecessary complexity and without hidden wording.",
        },
        ".legal-grid .section-block .section-title.large-title": { text: "Legal Notice" },
        ".legal-actions-card .section-title": { text: "Quick access" },
        ".legal-action-buttons .btn:nth-child(1)": { text: "Open terms" },
        ".legal-action-buttons .btn:nth-child(2)": { text: "Open privacy" },
        ".legal-action-buttons .btn:nth-child(3)": { text: "Open house rules" },
        "#agb-modal .section-title": { text: "Terms and Conditions" },
        "#privacy-modal .section-title": { text: "Privacy Policy" },
        "#rules-modal .section-title": { text: "House Rules" },
      }
    }
  };
});
