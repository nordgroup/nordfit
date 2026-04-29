/* =========================
   NordFit translations.js
   Stable UI translation layer
   Languages: de, en, fr, es, it, pl, nl, sv, da, no
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const supportedLanguages = ["de", "en", "fr", "es", "it", "pl", "nl", "sv", "da", "no"];
  const defaultLanguage = "de";

  const langOptions = Array.from(document.querySelectorAll(".lang-option"));
  const langToggleLabel = document.querySelector(".lang-toggle-label");

  const pageKey = getPageKey();
  const activeLanguage = getSafeLanguage(getSavedLanguage());

  applyLanguage(activeLanguage);

  langOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const nextLang = getSafeLanguage(option.dataset.lang);

      saveLanguage(nextLang);
      applyLanguage(nextLang);
    });
  });

  window.addEventListener("nordfit:language-changed", (event) => {
    const nextLang = getSafeLanguage(event.detail?.language);
    saveLanguage(nextLang);
    applyLanguage(nextLang);
  });

  function getSavedLanguage() {
    try {
      return localStorage.getItem("nordfit-language") || defaultLanguage;
    } catch {
      return defaultLanguage;
    }
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem("nordfit-language", lang);
    } catch {
      /* localStorage can be unavailable in private/restricted mode */
    }
  }

  function getSafeLanguage(lang) {
    const cleanLang = String(lang || "").trim().toLowerCase();
    return supportedLanguages.includes(cleanLang) ? cleanLang : defaultLanguage;
  }

  function getPageKey() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("mitgliedschaften")) return "mitgliedschaften";
    if (path.includes("standorte")) return "standorte";
    if (path.includes("app")) return "app";
    if (path.includes("hausordnung")) return "hausordnung";
    if (path.includes("kontakt")) return "kontakt";
    if (path.includes("impressum")) return "impressum";

    return "index";
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    updateLangLabel(lang);
    updateLanguageMenuLabels(lang);
    updateNavigationLabels(lang);
    updateFooterLabels(lang);
    updateDocumentMeta(lang);
    updateSharedAriaLabels(lang);

    window.dispatchEvent(
      new CustomEvent("nordfit:language-ui-sync", {
        detail: { language: lang },
      })
    );
  }

  function updateLangLabel(lang) {
    if (!langToggleLabel) return;
    langToggleLabel.textContent = lang.toUpperCase();
  }

  function updateLanguageMenuLabels(lang) {
    const labels = languageLabels[lang] || languageLabels[defaultLanguage];

    langOptions.forEach((option) => {
      const optionLang = getSafeLanguage(option.dataset.lang);
      const isSelected = optionLang === lang;

      option.textContent = labels[optionLang] || labels[defaultLanguage] || option.textContent;
      option.classList.toggle("is-selected", isSelected);
      option.classList.toggle("is-active", isSelected);
      option.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
  }

  function updateNavigationLabels(lang) {
    const labels = navLabels[lang] || navLabels[defaultLanguage];
    const links = document.querySelectorAll(".nav-link");

    links.forEach((link, index) => {
      if (labels[index]) {
        link.textContent = labels[index];
      }
    });
  }

  function updateFooterLabels(lang) {
    const labels = footerLabels[lang] || footerLabels[defaultLanguage];
    const footerLinks = document.querySelectorAll(".footer-links a");

    footerLinks.forEach((link, index) => {
      if (labels[index]) {
        link.textContent = labels[index];
      }
    });

    const copyright = document.querySelector(".footer-row > .muted");
    const copyrightText = copyrightLabels[lang] || copyrightLabels[defaultLanguage];

    if (copyright && copyrightText) {
      copyright.textContent = copyrightText;
    }
  }

  function updateDocumentMeta(lang) {
    const title = pageTitles[lang]?.[pageKey] || pageTitles[defaultLanguage]?.[pageKey];
    const description =
      pageDescriptions[lang]?.[pageKey] || pageDescriptions[defaultLanguage]?.[pageKey];

    if (title) {
      document.title = title;
    }

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription && description) {
      metaDescription.setAttribute("content", description);
    }
  }

  function updateSharedAriaLabels(lang) {
    const labels = sharedAriaLabels[lang] || sharedAriaLabels[defaultLanguage];

    const logo = document.querySelector(".logo");
    const langToggle = document.getElementById("lang-toggle");
    const burger = document.getElementById("burger");
    const nav = document.querySelector(".site-nav");
    const langMenu = document.getElementById("lang-menu");

    if (logo && labels.logo) logo.setAttribute("aria-label", labels.logo);
    if (langToggle && labels.languageToggle) langToggle.setAttribute("aria-label", labels.languageToggle);
    if (burger && labels.burger) burger.setAttribute("aria-label", labels.burger);
    if (nav && labels.mainNav) nav.setAttribute("aria-label", labels.mainNav);
    if (langMenu && labels.languageMenu) langMenu.setAttribute("aria-label", labels.languageMenu);
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
    pl: ["Dane prawne / Regulamin / Prywatność", "Regulamin", "Kontakt", "Instagram"],
    nl: ["Juridisch / Voorwaarden / Privacy", "Huisregels", "Contact", "Instagram"],
    sv: ["Juridik / Villkor / Integritet", "Regler", "Kontakt", "Instagram"],
    da: ["Jura / Vilkår / Privatliv", "Husregler", "Kontakt", "Instagram"],
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
    sv: "© 2030 NordFit/NordGroup. Får ej distribueras.",
    da: "© 2030 NordFit/NordGroup. Må ikke distribueres.",
    no: "© 2030 NordFit/NordGroup. Skal ikke distribueres.",
  };

  const languageLabels = {
    de: {
      de: "Deutsch",
      en: "English",
      fr: "Français",
      es: "Español",
      it: "Italiano",
      pl: "Polski",
      nl: "Nederlands",
      sv: "Svenska",
      da: "Dansk",
      no: "Norsk",
    },
    en: {
      de: "German",
      en: "English",
      fr: "French",
      es: "Spanish",
      it: "Italian",
      pl: "Polish",
      nl: "Dutch",
      sv: "Swedish",
      da: "Danish",
      no: "Norwegian",
    },
    fr: {
      de: "Allemand",
      en: "Anglais",
      fr: "Français",
      es: "Espagnol",
      it: "Italien",
      pl: "Polonais",
      nl: "Néerlandais",
      sv: "Suédois",
      da: "Danois",
      no: "Norvégien",
    },
    es: {
      de: "Alemán",
      en: "Inglés",
      fr: "Francés",
      es: "Español",
      it: "Italiano",
      pl: "Polaco",
      nl: "Neerlandés",
      sv: "Sueco",
      da: "Danés",
      no: "Noruego",
    },
    it: {
      de: "Tedesco",
      en: "Inglese",
      fr: "Francese",
      es: "Spagnolo",
      it: "Italiano",
      pl: "Polacco",
      nl: "Olandese",
      sv: "Svedese",
      da: "Danese",
      no: "Norvegese",
    },
    pl: {
      de: "Niemiecki",
      en: "Angielski",
      fr: "Francuski",
      es: "Hiszpański",
      it: "Włoski",
      pl: "Polski",
      nl: "Niderlandzki",
      sv: "Szwedzki",
      da: "Duński",
      no: "Norweski",
    },
    nl: {
      de: "Duits",
      en: "Engels",
      fr: "Frans",
      es: "Spaans",
      it: "Italiaans",
      pl: "Pools",
      nl: "Nederlands",
      sv: "Zweeds",
      da: "Deens",
      no: "Noors",
    },
    sv: {
      de: "Tyska",
      en: "Engelska",
      fr: "Franska",
      es: "Spanska",
      it: "Italienska",
      pl: "Polska",
      nl: "Nederländska",
      sv: "Svenska",
      da: "Danska",
      no: "Norska",
    },
    da: {
      de: "Tysk",
      en: "Engelsk",
      fr: "Fransk",
      es: "Spansk",
      it: "Italiensk",
      pl: "Polsk",
      nl: "Nederlandsk",
      sv: "Svensk",
      da: "Dansk",
      no: "Norsk",
    },
    no: {
      de: "Tysk",
      en: "Engelsk",
      fr: "Fransk",
      es: "Spansk",
      it: "Italiensk",
      pl: "Polsk",
      nl: "Nederlandsk",
      sv: "Svensk",
      da: "Dansk",
      no: "Norsk",
    },
  };

  const pageTitles = {
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

  const pageDescriptions = {
    de: {
      index: "NordFit ist ein modernes Fitnessstudio mit ruhiger Atmosphäre, digitalem Zugang und klar gestalteten Trainingsbereichen.",
      mitgliedschaften: "NordFit Tarife und Tagespass – klar, fair und digital über die NordFit App verwaltbar.",
      standorte: "NordFit Standorte – klar erreichbar, ruhig gestaltet und digital mit der NordFit App verbunden.",
      app: "Die NordFit App ist dein digitaler Zugang zu Mitgliedschaft, Tagespass, QR-Code und persönlicher Verwaltung.",
      hausordnung: "Die NordFit Hausordnung – klare Regeln für ein sauberes, ruhiges und respektvolles Training.",
      kontakt: "Kontakt zu NordFit – per E-Mail, Instagram oder direkt über das Kontaktformular.",
      impressum: "Impressum, rechtliche Hinweise, AGB und Datenschutzinformationen von NordFit.",
    },
    en: {
      index: "NordFit is a modern gym with a calm atmosphere, digital access and clearly designed training areas.",
      mitgliedschaften: "NordFit plans and day pass – clear, fair and digitally managed through the NordFit app.",
      standorte: "NordFit locations – easy to understand, calmly designed and connected to the NordFit app.",
      app: "The NordFit app is your digital access to membership, day pass, QR code and personal management.",
      hausordnung: "NordFit house rules – clear rules for clean, calm and respectful training.",
      kontakt: "Contact NordFit by email, Instagram or directly through the contact form.",
      impressum: "Legal notice, terms and privacy information for NordFit.",
    },
    fr: {
      index: "NordFit est une salle de sport moderne avec une atmosphère calme, un accès numérique et des espaces d’entraînement clairement conçus.",
      mitgliedschaften: "Tarifs et pass journalier NordFit – clairs, équitables et gérés numériquement via l’application.",
      standorte: "Sites NordFit – faciles à comprendre, conçus avec calme et connectés à l’application NordFit.",
      app: "L’application NordFit est votre accès numérique à l’abonnement, au pass journalier, au QR code et à la gestion personnelle.",
      hausordnung: "Le règlement NordFit – règles claires pour un entraînement propre, calme et respectueux.",
      kontakt: "Contacter NordFit par e-mail, Instagram ou via le formulaire de contact.",
      impressum: "Mentions légales, conditions et informations de confidentialité de NordFit.",
    },
    es: {
      index: "NordFit es un gimnasio moderno con ambiente tranquilo, acceso digital y zonas de entrenamiento claramente diseñadas.",
      mitgliedschaften: "Tarifas y pase diario de NordFit – claros, justos y gestionados digitalmente en la app.",
      standorte: "Ubicaciones NordFit – fáciles de entender, diseñadas con calma y conectadas a la app.",
      app: "La app de NordFit es tu acceso digital a membresía, pase diario, código QR y gestión personal.",
      hausordnung: "Las normas de NordFit – reglas claras para un entrenamiento limpio, tranquilo y respetuoso.",
      kontakt: "Contacta con NordFit por correo, Instagram o mediante el formulario.",
      impressum: "Aviso legal, términos e información de privacidad de NordFit.",
    },
    it: {
      index: "NordFit è una palestra moderna con atmosfera calma, accesso digitale e aree di allenamento chiare.",
      mitgliedschaften: "Tariffe e pass giornaliero NordFit – chiari, equi e gestiti digitalmente tramite l’app.",
      standorte: "Sedi NordFit – facili da capire, progettate con calma e collegate all’app NordFit.",
      app: "L’app NordFit è il tuo accesso digitale ad abbonamento, pass giornaliero, QR code e gestione personale.",
      hausordnung: "Il regolamento NordFit – regole chiare per un allenamento pulito, tranquillo e rispettoso.",
      kontakt: "Contatta NordFit via e-mail, Instagram o tramite il modulo.",
      impressum: "Note legali, termini e informazioni sulla privacy di NordFit.",
    },
    pl: {
      index: "NordFit to nowoczesna siłownia ze spokojną atmosferą, cyfrowym dostępem i jasno zaprojektowanymi strefami treningu.",
      mitgliedschaften: "Cennik i wejście dzienne NordFit – jasno, uczciwie i cyfrowo przez aplikację.",
      standorte: "Lokalizacje NordFit – zrozumiałe, spokojnie zaprojektowane i połączone z aplikacją.",
      app: "Aplikacja NordFit to cyfrowy dostęp do karnetu, wejścia dziennego, kodu QR i zarządzania.",
      hausordnung: "Regulamin NordFit – jasne zasady czystego, spokojnego i pełnego szacunku treningu.",
      kontakt: "Kontakt z NordFit przez e-mail, Instagram lub formularz kontaktowy.",
      impressum: "Informacje prawne, regulamin i prywatność NordFit.",
    },
    nl: {
      index: "NordFit is een moderne sportschool met een rustige sfeer, digitale toegang en helder ontworpen trainingszones.",
      mitgliedschaften: "NordFit tarieven en dagpas – duidelijk, eerlijk en digitaal beheerd via de app.",
      standorte: "NordFit locaties – duidelijk, rustig ontworpen en verbonden met de NordFit-app.",
      app: "De NordFit-app is je digitale toegang tot lidmaatschap, dagpas, QR-code en persoonlijk beheer.",
      hausordnung: "De huisregels van NordFit – duidelijke regels voor schoon, rustig en respectvol trainen.",
      kontakt: "Neem contact op met NordFit via e-mail, Instagram of het contactformulier.",
      impressum: "Juridische informatie, voorwaarden en privacy van NordFit.",
    },
    sv: {
      index: "NordFit är ett modernt gym med lugn atmosfär, digital åtkomst och tydligt utformade träningsytor.",
      mitgliedschaften: "NordFit priser och dagspass – tydligt, rättvist och digitalt via appen.",
      standorte: "NordFit platser – tydliga, lugnt utformade och kopplade till appen.",
      app: "NordFit-appen är din digitala åtkomst till medlemskap, dagspass, QR-kod och personlig hantering.",
      hausordnung: "NordFits regler – tydliga regler för ren, lugn och respektfull träning.",
      kontakt: "Kontakta NordFit via e-post, Instagram eller kontaktformulär.",
      impressum: "Juridisk information, villkor och integritet för NordFit.",
    },
    da: {
      index: "NordFit er et moderne fitnesscenter med rolig atmosfære, digital adgang og klart designede træningsområder.",
      mitgliedschaften: "NordFit priser og dagspas – klart, fair og digitalt via appen.",
      standorte: "NordFit lokationer – tydelige, roligt designede og forbundet med appen.",
      app: "NordFit-appen er din digitale adgang til medlemskab, dagspas, QR-kode og personlig administration.",
      hausordnung: "NordFits husregler – klare regler for ren, rolig og respektfuld træning.",
      kontakt: "Kontakt NordFit via e-mail, Instagram eller kontaktformular.",
      impressum: "Juridisk information, vilkår og privatliv for NordFit.",
    },
    no: {
      index: "NordFit er et moderne treningssenter med rolig atmosfære, digital adgang og tydelig utformede treningsområder.",
      mitgliedschaften: "NordFit priser og dagspass – tydelig, rettferdig og digitalt via appen.",
      standorte: "NordFit lokasjoner – tydelige, rolig utformet og koblet til appen.",
      app: "NordFit-appen er din digitale tilgang til medlemskap, dagspass, QR-kode og personlig administrasjon.",
      hausordnung: "NordFits husregler – tydelige regler for ren, rolig og respektfull trening.",
      kontakt: "Kontakt NordFit via e-post, Instagram eller kontaktskjema.",
      impressum: "Juridisk informasjon, vilkår og personvern for NordFit.",
    },
  };

  const sharedAriaLabels = {
    de: {
      logo: "NordFit Startseite",
      languageToggle: "Sprache auswählen",
      languageMenu: "Sprachauswahl",
      burger: "Menü öffnen",
      mainNav: "Hauptnavigation",
    },
    en: {
      logo: "NordFit home",
      languageToggle: "Choose language",
      languageMenu: "Language selection",
      burger: "Open menu",
      mainNav: "Main navigation",
    },
    fr: {
      logo: "Accueil NordFit",
      languageToggle: "Choisir la langue",
      languageMenu: "Sélection de langue",
      burger: "Ouvrir le menu",
      mainNav: "Navigation principale",
    },
    es: {
      logo: "Inicio de NordFit",
      languageToggle: "Elegir idioma",
      languageMenu: "Selección de idioma",
      burger: "Abrir menú",
      mainNav: "Navegación principal",
    },
    it: {
      logo: "Home NordFit",
      languageToggle: "Scegli lingua",
      languageMenu: "Selezione lingua",
      burger: "Apri menu",
      mainNav: "Navigazione principale",
    },
    pl: {
      logo: "Strona główna NordFit",
      languageToggle: "Wybierz język",
      languageMenu: "Wybór języka",
      burger: "Otwórz menu",
      mainNav: "Główna nawigacja",
    },
    nl: {
      logo: "NordFit home",
      languageToggle: "Taal kiezen",
      languageMenu: "Taalkeuze",
      burger: "Menu openen",
      mainNav: "Hoofdnavigatie",
    },
    sv: {
      logo: "NordFit hem",
      languageToggle: "Välj språk",
      languageMenu: "Språkval",
      burger: "Öppna meny",
      mainNav: "Huvudnavigering",
    },
    da: {
      logo: "NordFit hjem",
      languageToggle: "Vælg sprog",
      languageMenu: "Sprogvalg",
      burger: "Åbn menu",
      mainNav: "Hovednavigation",
    },
    no: {
      logo: "NordFit hjem",
      languageToggle: "Velg språk",
      languageMenu: "Språkvalg",
      burger: "Åpne meny",
      mainNav: "Hovednavigasjon",
    },
  };
});
