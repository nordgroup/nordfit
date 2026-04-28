/* =========================
   NordFit translations.js
   Complete translation system
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
    if (!pageTranslations) {
      dispatchUiSync(lang);
      return;
    }

    const dictionary = pageTranslations[lang] || pageTranslations[defaultLanguage];
    if (!dictionary) {
      dispatchUiSync(lang);
      return;
    }

    Object.entries(dictionary).forEach(([selector, value]) => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;
      elements.forEach((element) => applyValue(element, value));
    });

    dispatchUiSync(lang);
  }

  function dispatchUiSync(lang) {
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
    if (labels?.length && links.length) {
      links.forEach((link, index) => {
        if (labels[index]) link.textContent = labels[index];
      });
    }

    const copyright = document.querySelector(".footer-row > .muted");
    const copyrightText = copyrightLabels[lang] || copyrightLabels[defaultLanguage];
    if (copyright && copyrightText) {
      copyright.textContent = copyrightText;
    }
  }

  function updateDocumentLanguage(lang) {
    document.documentElement.lang = lang;

    const titleValue = titles[lang]?.[pageKey] || titles[defaultLanguage]?.[pageKey];
    if (titleValue) document.title = titleValue;

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
    sv: "© 2030 NordFit/NordGroup. Får ej distribueras.",
    no: "© 2030 NordFit/NordGroup. Skal ikke distribueres.",
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
      mitgliedschaften: "NordFit memberships and day pass – clearly structured, fairly explained and fully managed in the app.",
      standorte: "NordFit locations – clearly planned, easy to reach and designed to feel right at first sight.",
      app: "The NordFit app is your access to membership, day pass and QR entry – clear, direct and fully digital.",
      hausordnung: "NordFit house rules – clear standards for calm, clean and respectful training.",
      kontakt: "Contact NordFit – email, Instagram and contact form.",
      impressum: "Legal notice, terms and privacy of NordFit.",
    },
    fr: {
      index: "NordFit – une salle de sport moderne à l’atmosphère claire, avec des zones premium et un design calme.",
      mitgliedschaften: "Abonnements NordFit et pass journalier – clairement présentés, expliqués équitablement et gérés via l’application.",
      standorte: "Sites NordFit – pensés avec clarté, faciles d’accès et conçus pour faire bonne impression dès le départ.",
      app: "L’application NordFit est votre accès à l’abonnement, au pass journalier et à l’entrée QR – claire, directe et entièrement numérique.",
      hausordnung: "Le règlement NordFit – des règles claires pour un entraînement calme, propre et respectueux.",
      kontakt: "Contacter NordFit – e-mail, Instagram et formulaire de contact.",
      impressum: "Mentions légales, CGV et confidentialité de NordFit.",
    },
    es: {
      index: "NordFit – gimnasio moderno con ambiente claro, zonas premium y un diseño tranquilo.",
      mitgliedschaften: "Membresías NordFit y pase diario – claramente estructurados, explicados con transparencia y gestionados en la app.",
      standorte: "Ubicaciones NordFit – pensadas con claridad, fáciles de alcanzar y diseñadas para causar una buena primera impresión.",
      app: "La app de NordFit es tu acceso a membresía, pase diario y entrada QR – clara, directa y totalmente digital.",
      hausordnung: "Las normas de NordFit – reglas claras para un entrenamiento tranquilo, limpio y respetuoso.",
      kontakt: "Contacto con NordFit – correo, Instagram y formulario.",
      impressum: "Aviso legal, términos y privacidad de NordFit.",
    },
    it: {
      index: "NordFit – palestra moderna con atmosfera chiara, aree premium e design tranquillo.",
      mitgliedschaften: "Abbonamenti NordFit e pass giornaliero – chiari, spiegati in modo corretto e gestiti nell’app.",
      standorte: "Sedi NordFit – pensate con chiarezza, facili da raggiungere e progettate per dare subito una buona impressione.",
      app: "L’app NordFit è il tuo accesso ad abbonamento, pass giornaliero e ingresso QR – chiara, diretta e completamente digitale.",
      hausordnung: "Il regolamento NordFit – regole chiare per un allenamento tranquillo, pulito e rispettoso.",
      kontakt: "Contatto NordFit – e-mail, Instagram e modulo di contatto.",
      impressum: "Note legali, termini e privacy di NordFit.",
    },
    pl: {
      index: "NordFit – nowoczesna siłownia z uporządkowaną atmosferą, strefami premium i spokojnym designem.",
      mitgliedschaften: "Karnety NordFit i wejściówka dzienna – jasno przedstawione, uczciwie opisane i zarządzane w aplikacji.",
      standorte: "Lokalizacje NordFit – przemyślane, łatwo dostępne i zaprojektowane tak, by od razu robić dobre wrażenie.",
      app: "Aplikacja NordFit to dostęp do karnetu, wejściówki dziennej i wejścia QR – jasno, prosto i całkowicie cyfrowo.",
      hausordnung: "Regulamin NordFit – jasne zasady spokojnego, czystego i pełnego szacunku treningu.",
      kontakt: "Kontakt z NordFit – e-mail, Instagram i formularz kontaktowy.",
      impressum: "Informacje prawne, regulamin i prywatność NordFit.",
    },
    nl: {
      index: "NordFit – moderne sportschool met een heldere sfeer, premium trainingszones en een rustige uitstraling.",
      mitgliedschaften: "NordFit lidmaatschappen en dagpas – duidelijk opgebouwd, eerlijk uitgelegd en beheerd in de app.",
      standorte: "NordFit locaties – helder doordacht, goed bereikbaar en ontworpen voor een sterke eerste indruk.",
      app: "De NordFit app geeft toegang tot lidmaatschap, dagpas en QR-toegang – helder, direct en volledig digitaal.",
      hausordnung: "De huisregels van NordFit – duidelijke regels voor rustig, schoon en respectvol trainen.",
      kontakt: "Contact met NordFit – e-mail, Instagram en contactformulier.",
      impressum: "Juridische informatie, voorwaarden en privacy van NordFit.",
    },
    da: {
      index: "NordFit – moderne fitnesscenter med klar stemning, premiumområder og roligt design.",
      mitgliedschaften: "NordFit medlemskaber og dagspas – tydeligt opbygget, fair forklaret og styret i appen.",
      standorte: "NordFit lokationer – klart tænkt, lette at nå og designet til at give et stærkt første indtryk.",
      app: "NordFit-appen giver adgang til medlemskab, dagspas og QR-adgang – klart, direkte og fuldt digitalt.",
      hausordnung: "NordFits husregler – klare regler for rolig, ren og respektfuld træning.",
      kontakt: "Kontakt NordFit – e-mail, Instagram og kontaktformular.",
      impressum: "Juridisk information, vilkår og privatliv for NordFit.",
    },
    sv: {
      index: "NordFit – modernt gym med tydlig känsla, premiumytor och lugn design.",
      mitgliedschaften: "NordFit medlemskap och dagspass – tydligt upplagda, rättvist förklarade och hanterade i appen.",
      standorte: "NordFit platser – tydligt planerade, enkla att nå och designade för ett starkt första intryck.",
      app: "NordFit-appen ger tillgång till medlemskap, dagspass och QR-inträde – tydligt, direkt och helt digitalt.",
      hausordnung: "NordFits regler – tydliga regler för lugn, ren och respektfull träning.",
      kontakt: "Kontakta NordFit – e-post, Instagram och kontaktformulär.",
      impressum: "Juridisk information, villkor och integritet för NordFit.",
    },
    no: {
      index: "NordFit – moderne treningssenter med tydelig følelse, premiumområder og rolig design.",
      mitgliedschaften: "NordFit medlemskap og dagspass – tydelig strukturert, rettferdig forklart og administrert i appen.",
      standorte: "NordFit lokasjoner – tydelig planlagt, lette å nå og designet for et sterkt førsteinntrykk.",
      app: "NordFit-appen gir tilgang til medlemskap, dagspass og QR-inngang – tydelig, direkte og helt digitalt.",
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
          html: "NordFit is made for people who do not want to simply tick off a workout, but want a place that feels clear, thoughtfully premium and right from the very first moment.",
        },
        ".hero-actions a:nth-child(1)": { text: "Memberships" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Locations" },
        ".hero-image-caption h2": { text: "A first impression that does not need to be loud." },
        ".hero-image-caption p": {
          html: "From the outside, NordFit should already feel modern, calm and clean. Not overloaded, not generic — but so clear that you feel the attention to detail straight away.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Strength Training" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functional Training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recovery" },
      },
      fr: {
        ".hero-title": { text: "Un studio moderne. Et qui reste calme." },
        ".hero-subtitle": {
          html: "NordFit est conçu pour celles et ceux qui ne veulent pas simplement faire leur séance, mais trouver un lieu clair, haut de gamme et juste dès le premier instant.",
        },
        ".hero-actions a:nth-child(1)": { text: "Abonnements" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Sites" },
        ".hero-image-caption h2": { text: "Une première impression qui n’a pas besoin d’être bruyante." },
        ".hero-image-caption p": {
          html: "Dès l’extérieur, NordFit doit paraître moderne, calme et propre. Pas surchargé, pas interchangeable — mais assez clair pour que l’on sente tout de suite le soin du détail.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Musculation" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Entraînement fonctionnel" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Récupération" },
      },
      es: {
        ".hero-title": { text: "Un estudio moderno. Y que sigue siendo tranquilo." },
        ".hero-subtitle": {
          html: "NordFit está hecho para quienes no quieren simplemente completar su entrenamiento, sino encontrar un lugar claro, premium y correcto desde el primer momento.",
        },
        ".hero-actions a:nth-child(1)": { text: "Membresías" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Ubicaciones" },
        ".hero-image-caption h2": { text: "Una primera impresión que no necesita ser ruidosa." },
        ".hero-image-caption p": {
          html: "Desde fuera, NordFit debe sentirse moderno, tranquilo y limpio. No recargado, no genérico — sino tan claro que se note de inmediato la atención al detalle.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Entrenamiento de fuerza" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Entrenamiento funcional" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recuperación" },
      },
      it: {
        ".hero-title": { text: "Uno studio moderno. E che resta calmo." },
        ".hero-subtitle": {
          html: "NordFit è pensato per chi non vuole semplicemente fare allenamento, ma trovare un luogo chiaro, premium e giusto fin dal primo momento.",
        },
        ".hero-actions a:nth-child(1)": { text: "Abbonamenti" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Sedi" },
        ".hero-image-caption h2": { text: "Una prima impressione che non ha bisogno di essere rumorosa." },
        ".hero-image-caption p": {
          html: "Già dall’esterno, NordFit deve apparire moderno, tranquillo e pulito. Non carico, non generico — ma abbastanza chiaro da far percepire subito la cura dei dettagli.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Allenamento di forza" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Allenamento funzionale" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recupero" },
      },
      pl: {
        ".hero-title": { text: "Nowoczesne studio. I spokojna atmosfera." },
        ".hero-subtitle": {
          html: "NordFit jest dla osób, które nie chcą po prostu odhaczyć treningu, ale znaleźć miejsce, które od pierwszej chwili jest jasne, premium i po prostu dobrze przemyślane.",
        },
        ".hero-actions a:nth-child(1)": { text: "Karnety" },
        ".hero-actions a:nth-child(2)": { text: "Aplikacja" },
        ".hero-actions a:nth-child(3)": { text: "Lokalizacje" },
        ".hero-image-caption h2": { text: "Pierwsze wrażenie, które nie musi być głośne." },
        ".hero-image-caption p": {
          html: "Już z zewnątrz NordFit ma wyglądać nowocześnie, spokojnie i czysto. Nie przeładowanie, nie przypadkowo — ale na tyle jasno, by od razu było czuć dbałość o detale.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Trening siłowy" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Trening funkcjonalny" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Regeneracja" },
      },
      nl: {
        ".hero-title": { text: "Een studio die modern voelt. En rustig blijft." },
        ".hero-subtitle": {
          html: "NordFit is gemaakt voor mensen die hun training niet zomaar willen afvinken, maar een plek zoeken die vanaf het eerste moment helder, premium en goed voelt.",
        },
        ".hero-actions a:nth-child(1)": { text: "Lidmaatschappen" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Locaties" },
        ".hero-image-caption h2": { text: "Een eerste indruk die niet luid hoeft te zijn." },
        ".hero-image-caption p": {
          html: "Aan de buitenkant moet NordFit al modern, rustig en schoon aanvoelen. Niet druk, niet uitwisselbaar — maar zo helder dat je de aandacht voor detail meteen voelt.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Krachttraining" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functionele training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Herstel" },
      },
      da: {
        ".hero-title": { text: "Et studio, der føles moderne. Og forbliver roligt." },
        ".hero-subtitle": {
          html: "NordFit er til mennesker, der ikke bare vil overstå deres træning, men finde et sted, der føles klart, premium og rigtigt fra første øjeblik.",
        },
        ".hero-actions a:nth-child(1)": { text: "Medlemskaber" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Lokationer" },
        ".hero-image-caption h2": { text: "Et første indtryk, der ikke behøver at være højt." },
        ".hero-image-caption p": {
          html: "Udefra skal NordFit allerede føles moderne, roligt og rent. Ikke overfyldt, ikke generisk — men så klart, at man straks mærker sansen for detaljen.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Styrketræning" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Funktionel træning" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Restitution" },
      },
      sv: {
        ".hero-title": { text: "En studio som känns modern. Och förblir lugn." },
        ".hero-subtitle": {
          html: "NordFit är till för människor som inte bara vill få träningen gjord, utan hitta en plats som känns tydlig, premium och rätt från första stund.",
        },
        ".hero-actions a:nth-child(1)": { text: "Medlemskap" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Platser" },
        ".hero-image-caption h2": { text: "Ett första intryck som inte behöver vara högljutt." },
        ".hero-image-caption p": {
          html: "Redan från utsidan ska NordFit kännas modernt, lugnt och rent. Inte överlastat, inte generiskt — utan så tydligt att känslan för detaljer märks direkt.",
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Styrketräning" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Funktionell träning" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Återhämtning" },
      },
      no: {
        ".hero-title": { text: "Et studio som føles moderne. Og forblir rolig." },
        ".hero-subtitle": {
          html: "NordFit er for mennesker som ikke bare vil bli ferdige med treningen, men finne et sted som føles tydelig, premium og riktig fra første øyeblikk.",
        },
        ".hero-actions a:nth-child(1)": { text: "Medlemskap" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Lokasjoner" },
        ".hero-image-caption h2": { text: "Et førsteinntrykk som ikke trenger å være høyt." },
        ".hero-image-caption p": {
          html: "Allerede utenfra skal NordFit føles moderne, rolig og rent. Ikke overfylt, ikke generisk — men så tydelig at sansen for detaljer merkes med én gang.",
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
          html: "At NordFit, it should be easy to understand at a glance what is included, how long your plan runs and how flexible your next decision can be.",
        },
        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Sign-up, management and cancellation are handled entirely through the NordFit app. That keeps everything in one place — clear, direct and without unnecessary detours.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
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
          text: "A strong entry point if you want to train regularly and still keep a close eye on value.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "For anyone who wants a plan that stays structured, while feeling noticeably more flexible.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "The most flexible membership for anyone who wants to stay as free as possible and still start right away.",
        },
        ".pricing-card-action .btn": { text: "Complete in the app" },
        ".daypass-shell .eyebrow": { text: "Day Pass" },
        ".daypass-shell .section-title": { text: "€4.90 per day" },
        ".daypass-shell .muted": {
          text: "Ideal if you want to get to know NordFit first or train spontaneously — without a membership.",
        },
        ".daypass-shell .btn": { text: "Book in the app" },
      },
      fr: {
        ".hero-title": { text: "Des abonnements qui restent clairs." },
        ".hero-subtitle": {
          html: "Chez NordFit, tout doit être compréhensible d’un coup d’œil : ce qui est inclus, la durée de l’abonnement et la flexibilité pour la suite.",
        },
        ".info-note-label": { text: "Info importante" },
        ".info-note-text": {
          html: "Souscription, gestion et résiliation passent entièrement par l’application NordFit. Tout reste ainsi regroupé au même endroit — clair, direct et sans détour inutile.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .muted": { text: "par mois" },
        ".pricing-card:nth-of-type(2) .muted": { text: "par mois" },
        ".pricing-card:nth-of-type(3) .muted": { text: "par mois" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "Durée minimale de 8 mois" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Puis résiliable chaque mois" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "Durée minimale de 6 mois" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Puis résiliable chaque mois" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "Durée minimale de 3 mois" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Puis résiliable chaque mois" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "Une entrée solide si vous souhaitez vous entraîner régulièrement avec un excellent rapport qualité-prix.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "Pour celles et ceux qui veulent quelque chose de structuré, mais avec davantage de flexibilité.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "L’option la plus flexible pour démarrer tout de suite avec le moins d’engagement possible.",
        },
        ".pricing-card-action .btn": { text: "Finaliser dans l’app" },
        ".daypass-shell .eyebrow": { text: "Pass journalier" },
        ".daypass-shell .section-title": { text: "4,90 € par jour" },
        ".daypass-shell .muted": {
          text: "Idéal pour découvrir NordFit ou s’entraîner spontanément — sans abonnement.",
        },
        ".daypass-shell .btn": { text: "Réserver dans l’app" },
      },
      es: {
        ".hero-title": { text: "Tarifas que siguen siendo claras." },
        ".hero-subtitle": {
          html: "En NordFit todo debe entenderse de un vistazo: qué incluye tu tarifa, cuánto dura y qué tan flexible puedes ser después.",
        },
        ".info-note-label": { text: "Información importante" },
        ".info-note-text": {
          html: "La contratación, la gestión y la cancelación se realizan completamente a través de la app de NordFit. Así todo queda en un solo lugar: claro, directo y sin rodeos innecesarios.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .muted": { text: "al mes" },
        ".pricing-card:nth-of-type(2) .muted": { text: "al mes" },
        ".pricing-card:nth-of-type(3) .muted": { text: "al mes" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 meses de permanencia mínima" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Después cancelación mensual" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 meses de permanencia mínima" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Después cancelación mensual" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 meses de permanencia mínima" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Después cancelación mensual" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "Una entrada sólida si quieres entrenar con regularidad y mantener una muy buena relación calidad-precio.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "Para quienes quieren algo estructurado, pero con una flexibilidad claramente mayor.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "La opción más flexible para empezar ya con el menor compromiso posible.",
        },
        ".pricing-card-action .btn": { text: "Completar en la app" },
        ".daypass-shell .eyebrow": { text: "Pase diario" },
        ".daypass-shell .section-title": { text: "4,90 € por día" },
        ".daypass-shell .muted": {
          text: "Ideal si quieres conocer NordFit primero o entrenar de forma espontánea, sin membresía.",
        },
        ".daypass-shell .btn": { text: "Reservar en la app" },
      },
      it: {
        ".hero-title": { text: "Tariffe che restano chiare." },
        ".hero-subtitle": {
          html: "Con NordFit tutto deve essere comprensibile a colpo d’occhio: cosa è incluso, quanto dura il tuo piano e quanta flessibilità hai dopo.",
        },
        ".info-note-label": { text: "Informazione importante" },
        ".info-note-text": {
          html: "Attivazione, gestione e disdetta avvengono completamente tramite l’app NordFit. Così tutto resta in un unico posto — chiaro, diretto e senza passaggi inutili.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .muted": { text: "al mese" },
        ".pricing-card:nth-of-type(2) .muted": { text: "al mese" },
        ".pricing-card:nth-of-type(3) .muted": { text: "al mese" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "Durata minima di 8 mesi" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Poi cancellazione mensile" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "Durata minima di 6 mesi" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Poi cancellazione mensile" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "Durata minima di 3 mesi" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Poi cancellazione mensile" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "Un ottimo ingresso se vuoi allenarti con regolarità mantenendo un forte rapporto qualità-prezzo.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "Per chi desidera qualcosa di strutturato, ma con una flessibilità chiaramente maggiore.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "L’opzione più flessibile per iniziare subito con il minor vincolo possibile.",
        },
        ".pricing-card-action .btn": { text: "Completa nell’app" },
        ".daypass-shell .eyebrow": { text: "Pass giornaliero" },
        ".daypass-shell .section-title": { text: "4,90 € al giorno" },
        ".daypass-shell .muted": {
          text: "Ideale se vuoi conoscere prima NordFit o allenarti spontaneamente, senza abbonamento.",
        },
        ".daypass-shell .btn": { text: "Prenota nell’app" },
      },
      pl: {
        ".hero-title": { text: "Karnety, które pozostają jasne." },
        ".hero-subtitle": {
          html: "W NordFit wszystko powinno być zrozumiałe od razu: co zawiera karnet, jak długo trwa i jak elastyczna może być późniejsza decyzja.",
        },
        ".info-note-label": { text: "Ważna informacja" },
        ".info-note-text": {
          html: "Zakup, zarządzanie i rezygnacja odbywają się całkowicie przez aplikację NordFit. Dzięki temu wszystko pozostaje w jednym miejscu — jasno, bezpośrednio i bez zbędnych kroków.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .muted": { text: "miesięcznie" },
        ".pricing-card:nth-of-type(2) .muted": { text: "miesięcznie" },
        ".pricing-card:nth-of-type(3) .muted": { text: "miesięcznie" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "Minimalny okres 8 miesięcy" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Potem wypowiedzenie miesięczne" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "Minimalny okres 6 miesięcy" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Potem wypowiedzenie miesięczne" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "Minimalny okres 3 miesięcy" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Potem wypowiedzenie miesięczne" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "Świetny start, jeśli chcesz trenować regularnie i jednocześnie zachować bardzo dobry stosunek ceny do jakości.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "Dla osób, które chcą czegoś uporządkowanego, ale z wyraźnie większą elastycznością.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "Najbardziej elastyczna opcja dla tych, którzy chcą zacząć od razu i pozostać możliwie wolni.",
        },
        ".pricing-card-action .btn": { text: "Zakończ w aplikacji" },
        ".daypass-shell .eyebrow": { text: "Wejście dzienne" },
        ".daypass-shell .section-title": { text: "4,90 € za dzień" },
        ".daypass-shell .muted": {
          text: "Idealne, jeśli chcesz najpierw poznać NordFit albo trenować spontanicznie — bez karnetu.",
        },
        ".daypass-shell .btn": { text: "Zarezerwuj w aplikacji" },
      },
      nl: {
        ".hero-title": { text: "Tarieven die helder blijven." },
        ".hero-subtitle": {
          html: "Bij NordFit moet in één oogopslag duidelijk zijn wat is inbegrepen, hoe lang je plan loopt en hoe flexibel je later kunt beslissen.",
        },
        ".info-note-label": { text: "Belangrijke info" },
        ".info-note-text": {
          html: "Afsluiten, beheren en opzeggen loopt volledig via de NordFit-app. Zo blijft alles op één plek — helder, direct en zonder onnodige omwegen.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .muted": { text: "per maand" },
        ".pricing-card:nth-of-type(2) .muted": { text: "per maand" },
        ".pricing-card:nth-of-type(3) .muted": { text: "per maand" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 maanden minimale looptijd" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Daarna maandelijks opzegbaar" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 maanden minimale looptijd" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Daarna maandelijks opzegbaar" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 maanden minimale looptijd" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Daarna maandelijks opzegbaar" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "Een sterke instap als je regelmatig wilt trainen en tegelijk op een goede prijs-kwaliteitverhouding wilt letten.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "Voor iedereen die iets gestructureerds wil, maar met merkbaar meer flexibiliteit.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "De meest flexibele optie voor wie zo vrij mogelijk wil blijven en toch direct wil starten.",
        },
        ".pricing-card-action .btn": { text: "In de app afronden" },
        ".daypass-shell .eyebrow": { text: "Dagpas" },
        ".daypass-shell .section-title": { text: "€ 4,90 per dag" },
        ".daypass-shell .muted": {
          text: "Ideaal als je NordFit eerst wilt leren kennen of spontaan wilt trainen — zonder lidmaatschap.",
        },
        ".daypass-shell .btn": { text: "Boeken in de app" },
      },
      da: {
        ".hero-title": { text: "Priser, der forbliver klare." },
        ".hero-subtitle": {
          html: "Hos NordFit skal det være tydeligt med det samme, hvad der er inkluderet, hvor længe dit medlemskab løber, og hvor fleksibel du senere kan være.",
        },
        ".info-note-label": { text: "Vigtig info" },
        ".info-note-text": {
          html: "Oprettelse, administration og opsigelse foregår fuldt ud i NordFit-appen. Så bliver alt på ét sted — klart, direkte og uden unødige omveje.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .muted": { text: "pr. måned" },
        ".pricing-card:nth-of-type(2) .muted": { text: "pr. måned" },
        ".pricing-card:nth-of-type(3) .muted": { text: "pr. måned" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 måneders minimumsperiode" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Derefter månedlig opsigelse" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 måneders minimumsperiode" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Derefter månedlig opsigelse" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 måneders minimumsperiode" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Derefter månedlig opsigelse" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "Et stærkt udgangspunkt, hvis du vil træne regelmæssigt og samtidig holde øje med høj værdi for pengene.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "Til dem, der vil have noget struktureret, men med mærkbart mere fleksibilitet.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "Den mest fleksible løsning for dem, der vil være så frie som muligt og stadig starte med det samme.",
        },
        ".pricing-card-action .btn": { text: "Afslut i appen" },
        ".daypass-shell .eyebrow": { text: "Dagspas" },
        ".daypass-shell .section-title": { text: "4,90 € pr. dag" },
        ".daypass-shell .muted": {
          text: "Ideelt, hvis du først vil lære NordFit at kende eller træne spontant — uden medlemskab.",
        },
        ".daypass-shell .btn": { text: "Book i appen" },
      },
      sv: {
        ".hero-title": { text: "Priser som förblir tydliga." },
        ".hero-subtitle": {
          html: "Hos NordFit ska det vara lätt att förstå direkt vad som ingår, hur länge ditt medlemskap löper och hur flexibel du kan vara senare.",
        },
        ".info-note-label": { text: "Viktig info" },
        ".info-note-text": {
          html: "Tecknande, hantering och uppsägning sker helt via NordFit-appen. Då finns allt på ett ställe — tydligt, direkt och utan onödiga omvägar.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .muted": { text: "per månad" },
        ".pricing-card:nth-of-type(2) .muted": { text: "per månad" },
        ".pricing-card:nth-of-type(3) .muted": { text: "per månad" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 månaders bindningstid" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Därefter månadsvis uppsägning" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 månaders bindningstid" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Därefter månadsvis uppsägning" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 månaders bindningstid" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Därefter månadsvis uppsägning" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "En stark start om du vill träna regelbundet och samtidigt hålla ögonen på bra värde.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "För dig som vill ha något strukturerat, men med märkbart mer flexibilitet.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "Det mest flexibla alternativet för dig som vill vara så fri som möjligt och ändå komma igång direkt.",
        },
        ".pricing-card-action .btn": { text: "Slutför i appen" },
        ".daypass-shell .eyebrow": { text: "Dagspass" },
        ".daypass-shell .section-title": { text: "4,90 € per dag" },
        ".daypass-shell .muted": {
          text: "Perfekt om du först vill lära känna NordFit eller träna spontant — utan medlemskap.",
        },
        ".daypass-shell .btn": { text: "Boka i appen" },
      },
      no: {
        ".hero-title": { text: "Priser som forblir tydelige." },
        ".hero-subtitle": {
          html: "Hos NordFit skal det være lett å forstå med en gang hva som er inkludert, hvor lenge medlemskapet varer og hvor fleksibel du kan være senere.",
        },
        ".info-note-label": { text: "Viktig info" },
        ".info-note-text": {
          html: "Opprettelse, administrasjon og oppsigelse skjer fullt ut i NordFit-appen. Da blir alt samlet på ett sted — tydelig, direkte og uten unødige omveier.",
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card:nth-of-type(1) .muted": { text: "per måned" },
        ".pricing-card:nth-of-type(2) .muted": { text: "per måned" },
        ".pricing-card:nth-of-type(3) .muted": { text: "per måned" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(1)": { text: "8 måneders bindingstid" },
        ".pricing-card:nth-of-type(1) .pricing-details p:nth-child(2)": { text: "Deretter månedlig oppsigelse" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(1)": { text: "6 måneders bindingstid" },
        ".pricing-card:nth-of-type(2) .pricing-details p:nth-child(2)": { text: "Deretter månedlig oppsigelse" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(1)": { text: "3 måneders bindingstid" },
        ".pricing-card:nth-of-type(3) .pricing-details p:nth-child(2)": { text: "Deretter månedlig oppsigelse" },
        ".pricing-card:nth-of-type(1) .pricing-card-inner > p.muted:last-of-type": {
          text: "En sterk start dersom du vil trene regelmessig og samtidig ha god verdi for pengene.",
        },
        ".pricing-card:nth-of-type(2) .pricing-card-inner > p.muted:last-of-type": {
          text: "For deg som vil ha noe strukturert, men med merkbart mer fleksibilitet.",
        },
        ".pricing-card:nth-of-type(3) .pricing-card-inner > p.muted:last-of-type": {
          text: "Det mest fleksible alternativet for deg som vil være så fri som mulig og likevel starte med en gang.",
        },
        ".pricing-card-action .btn": { text: "Fullfør i appen" },
        ".daypass-shell .eyebrow": { text: "Dagspass" },
        ".daypass-shell .section-title": { text: "4,90 € per dag" },
        ".daypass-shell .muted": {
          text: "Perfekt hvis du først vil bli kjent med NordFit eller trene spontant — uten medlemskap.",
        },
        ".daypass-shell .btn": { text: "Bestill i appen" },
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
        ".location-hero-image .image-frame-label": { text: "Studio Hauptbild" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "Hier beginnt NordFit mit einem Studio, das auf Ruhe, gute Erreichbarkeit und einen klaren Aufbau ausgelegt ist. Kein unnötig lauter Auftritt, sondern ein Ort, an dem man sich schnell orientieren kann.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Geplant sind 24/7 Zugang, eine saubere App-Anbindung, ein einfacher Ablauf und ein Studio, das bewusst hochwertig statt chaotisch wirkt.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "Standort ansehen" },
        "section.section-tight .glass.reveal > .muted": {
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
          html: "The first NordFit location should not only be easy to reach. It should feel clear, calm and right from the very beginning — in its impression, its flow and its overall concept.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit starts intentionally with a location that does not feel overloaded. Less distraction, more structure and a studio you understand straight away.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".location-hero-image .image-frame-label": { text: "Main studio image" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "This is where NordFit begins: with a studio built around calm, accessibility and a clear layout. Not unnecessarily loud, but a place that feels easy to understand.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "The plan includes 24/7 access, clean app integration, a simple flow and a studio that feels intentionally premium rather than chaotic.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "View location" },
        "section.section-tight .glass.reveal > .muted": {
          text: "Anyone looking for NordFit should not have to search for long. The map and direct route options make the location easy to follow right away.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Maps" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
      fr: {
        ".hero-title": { text: "Un site qui a du sens dès le départ." },
        ".hero-subtitle": {
          html: "Le premier site NordFit ne doit pas seulement être accessible. Il doit sembler clair, calme et cohérent dès le début — dans son impression, son fonctionnement et tout le concept.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit démarre volontairement avec un site qui ne paraît pas surchargé. Moins de distraction, plus de structure et un studio que l’on comprend immédiatement.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".location-hero-image .image-frame-label": { text: "Image principale du studio" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "C’est ici que NordFit commence, avec un studio pensé pour le calme, l’accessibilité et une structure claire. Pas une présence inutilement bruyante, mais un lieu facile à comprendre.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Sont prévus : accès 24/7, intégration propre à l’application, déroulement simple et studio volontairement haut de gamme plutôt que chaotique.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "Voir le site" },
        "section.section-tight .glass.reveal > .muted": {
          text: "Trouver NordFit ne doit pas prendre du temps. La carte et le choix direct d’itinéraire rendent le site immédiatement compréhensible.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "OUVRIR DANS" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Plans Apple" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "OUVRIR DANS" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
      es: {
        ".hero-title": { text: "Una ubicación que tiene sentido desde el primer momento." },
        ".hero-subtitle": {
          html: "La primera ubicación de NordFit no solo debe ser accesible. Debe sentirse clara, tranquila y coherente desde el inicio — en la impresión, en el flujo y en todo el concepto.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit empieza de forma consciente con una ubicación que no se siente recargada. Menos distracción, más estructura y un estudio que se entiende de inmediato.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".location-hero-image .image-frame-label": { text: "Imagen principal del estudio" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "Aquí comienza NordFit con un estudio diseñado para la calma, la buena accesibilidad y una estructura clara. Nada de una presencia innecesariamente ruidosa, sino un lugar fácil de entender.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Está previsto acceso 24/7, integración limpia con la app, un flujo sencillo y un estudio que se percibe intencionadamente premium en lugar de caótico.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "Ver ubicación" },
        "section.section-tight .glass.reveal > .muted": {
          text: "Encontrar NordFit no debería llevar tiempo. El mapa y la opción directa de ruta hacen que la ubicación se entienda al instante.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "ABRIR EN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Maps" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "ABRIR EN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
      it: {
        ".hero-title": { text: "Una sede che ha senso fin da subito." },
        ".hero-subtitle": {
          html: "La prima sede NordFit non deve solo essere facile da raggiungere. Deve risultare chiara, calma e coerente fin dall’inizio — nell’impressione, nel flusso e nell’intero concetto.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit parte consapevolmente con una sede che non risulta sovraccarica. Meno distrazione, più struttura e uno studio che si capisce subito.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".location-hero-image .image-frame-label": { text: "Immagine principale dello studio" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "Qui NordFit inizia con uno studio progettato per calma, accessibilità e struttura chiara. Niente presenza inutilmente rumorosa, ma un luogo facile da comprendere.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Sono previsti accesso 24/7, integrazione pulita con l’app, flusso semplice e uno studio volutamente premium invece che caotico.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "Vedi sede" },
        "section.section-tight .glass.reveal > .muted": {
          text: "Trovare NordFit non dovrebbe richiedere tempo. La mappa e la scelta diretta del percorso rendono la sede subito comprensibile.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "APRI IN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Mappe Apple" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "APRI IN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
      pl: {
        ".hero-title": { text: "Lokalizacja, która od razu ma sens." },
        ".hero-subtitle": {
          html: "Pierwsza lokalizacja NordFit ma być nie tylko dostępna. Ma od początku sprawiać wrażenie jasnej, spokojnej i spójnej — w odbiorze, w działaniu i w całym koncepcie.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit startuje świadomie z lokalizacją, która nie wydaje się przeładowana. Mniej rozproszenia, więcej struktury i studio, które rozumie się od razu.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".location-hero-image .image-frame-label": { text: "Główne zdjęcie studia" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "To tutaj NordFit zaczyna od studia zaprojektowanego pod spokój, dobrą dostępność i jasny układ. Bez niepotrzebnie głośnej obecności, ale jako miejsce łatwe do zrozumienia.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Plan obejmuje dostęp 24/7, czyste połączenie z aplikacją, prosty przebieg i studio, które celowo wydaje się premium zamiast chaotyczne.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "Zobacz lokalizację" },
        "section.section-tight .glass.reveal > .muted": {
          text: "Znalezienie NordFit nie powinno zajmować długo. Mapa i bezpośredni wybór trasy sprawiają, że lokalizacja jest od razu czytelna.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "OTWÓRZ W" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Mapy Apple" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "OTWÓRZ W" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
      nl: {
        ".hero-title": { text: "Een locatie die meteen logisch voelt." },
        ".hero-subtitle": {
          html: "De eerste NordFit-locatie moet niet alleen goed bereikbaar zijn. Ze moet vanaf het begin helder, rustig en kloppend aanvoelen — in indruk, verloop en totaalconcept.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit start bewust met een locatie die niet overvol aanvoelt. Minder afleiding, meer structuur en een studio die je meteen begrijpt.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".location-hero-image .image-frame-label": { text: "Hoofdbeeld van de studio" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "Hier begint NordFit met een studio die is ontworpen voor rust, goede bereikbaarheid en een heldere opbouw. Geen onnodig luid optreden, maar een plek die snel te begrijpen is.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Gepland zijn 24/7-toegang, een schone app-koppeling, een eenvoudige flow en een studio die bewust premium aanvoelt in plaats van chaotisch.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "Locatie bekijken" },
        "section.section-tight .glass.reveal > .muted": {
          text: "Wie NordFit zoekt, zou niet lang moeten hoeven zoeken. De kaart en de directe routekeuze maken de locatie meteen duidelijk.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Kaarten" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "OPEN IN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
      da: {
        ".hero-title": { text: "En lokation, der giver mening med det samme." },
        ".hero-subtitle": {
          html: "Den første NordFit-lokation skal ikke bare være let at nå. Den skal føles klar, rolig og rigtig fra start — i indtrykket, forløbet og hele konceptet.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit starter bevidst med en lokation, der ikke virker overfyldt. Mindre distraktion, mere struktur og et studio, man forstår med det samme.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".location-hero-image .image-frame-label": { text: "Studioets hovedbillede" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "Her begynder NordFit med et studio, der er bygget omkring ro, god tilgængelighed og en klar struktur. Ikke en unødigt høj profil, men et sted, man hurtigt forstår.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Planen omfatter 24/7 adgang, ren app-integration, et enkelt forløb og et studio, der bevidst føles premium frem for kaotisk.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "Se lokation" },
        "section.section-tight .glass.reveal > .muted": {
          text: "Hvis man vil finde NordFit, skal det ikke tage lang tid. Kortet og den direkte rute gør lokationen let at forstå med det samme.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "ÅBN I" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Kort" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "ÅBN I" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
      sv: {
        ".hero-title": { text: "En plats som känns rätt direkt." },
        ".hero-subtitle": {
          html: "Den första NordFit-platsen ska inte bara vara lätt att nå. Den ska kännas tydlig, lugn och rätt från början — i intrycket, flödet och hela konceptet.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit startar medvetet med en plats som inte känns överlastad. Mindre distraktion, mer struktur och en studio som man förstår direkt.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".location-hero-image .image-frame-label": { text: "Huvudbild för studion" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "Här börjar NordFit med en studio som är byggd kring lugn, tillgänglighet och en tydlig struktur. Ingen onödigt högljudd närvaro, utan en plats som är lätt att förstå.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Planen omfattar 24/7-åtkomst, ren appintegration, ett enkelt flöde och en studio som medvetet känns premium snarare än kaotisk.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "Se plats" },
        "section.section-tight .glass.reveal > .muted": {
          text: "Den som vill hitta NordFit ska inte behöva leta länge. Kartan och det direkta vägvalet gör platsen enkel att förstå direkt.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "ÖPPNA I" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Kartor" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "ÖPPNA I" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Maps" },
      },
      no: {
        ".hero-title": { text: "En lokasjon som gir mening med én gang." },
        ".hero-subtitle": {
          html: "Den første NordFit-lokasjonen skal ikke bare være enkel å nå. Den skal føles tydelig, rolig og riktig fra starten av — i inntrykket, flyten og hele konseptet.",
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit starter bevisst med en lokasjon som ikke føles overlesset. Mindre distraksjon, mer struktur og et studio man forstår med en gang.",
        },
        ".section-title.large-title": { text: "Grevesmühlen" },
        ".location-hero-image .image-frame-label": { text: "Hovedbilde av studioet" },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(1)": {
          text: "Her begynner NordFit med et studio som er bygget rundt ro, god tilgjengelighet og tydelig oppbygning. Ingen unødvendig høy profil, men et sted som er lett å forstå.",
        },
        "section.section-no-top .grid-2 > div:first-child .muted:nth-of-type(2)": {
          text: "Planen inkluderer 24/7-tilgang, ren appintegrasjon, enkel flyt og et studio som bevisst føles premium i stedet for kaotisk.",
        },
        "section.section-tight .glass.reveal .section-title": { text: "Se lokasjon" },
        "section.section-tight .glass.reveal > .muted": {
          text: "Den som vil finne NordFit, skal ikke måtte lete lenge. Kartet og det direkte rutevalget gjør lokasjonen enkel å forstå med en gang.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "ÅPNE I" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "Apple Kart" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "ÅPNE I" },
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
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {
          text: "Bei NordFit läuft alles über einen einzigen, sauberen Weg. Keine Papierformulare, keine unnötigen Zwischenschritte und kein unklarer Ablauf.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {
          text: "In der App schließt du deine Mitgliedschaft ab, buchst deinen Tagespass, verwaltest deine Daten und bekommst den QR-Code, mit dem du direkt ins Studio kommst.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {
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
          html: "The NordFit app is not just an extra. It is the central access point for everything that is meant to work in a simple, clear and digital way at NordFit.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "DOWNLOAD ON THE" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "GET IT ON" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Without the NordFit app, there is no entry to the studio. Membership, day pass, management and QR access all run through it.",
        },
        ".section-title.large-title": { text: "One account. One QR code. One clear flow." },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {
          text: "At NordFit, everything runs through one clean path. No paper forms, no unnecessary steps and no unclear process.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {
          text: "In the app, you complete your membership, book your day pass, manage your details and receive the QR code that gets you straight into the studio.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {
          text: "That is exactly why the app is not an optional detail, but a fixed part of the entire NordFit concept.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Entry by QR code" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Your access lives directly in the app — fast, clear and without detours." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Complete membership digitally" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Book, view and manage everything in one place." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Buy a day pass directly" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Ideal if you want to get to know NordFit first or train spontaneously." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Everything clearly in view" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Location, access and personal management stay clearly bundled." },
      },
      fr: {
        ".hero-title": { text: "L’essentiel. Dans une seule app." },
        ".hero-subtitle": {
          html: "L’application NordFit n’est pas juste un supplément. C’est l’accès central à tout ce qui doit fonctionner chez NordFit de manière simple, claire et numérique.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "TÉLÉCHARGER SUR" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "DISPONIBLE SUR" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Info importante" },
        ".info-note-text": {
          html: "Sans l’application NordFit, il n’y a pas d’accès au studio. L’abonnement, le pass journalier, la gestion et le QR code passent entièrement par elle.",
        },
        ".section-title.large-title": { text: "Un compte. Un QR code. Un fonctionnement clair." },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {
          text: "Chez NordFit, tout passe par un seul chemin propre. Pas de formulaires papier, pas d’étapes inutiles et pas de déroulement flou.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {
          text: "Dans l’application, vous activez votre abonnement, réservez votre pass journalier, gérez vos données et recevez le QR code qui vous donne accès au studio.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {
          text: "C’est précisément pour cela que l’app n’est pas un détail optionnel, mais une partie fixe de tout le concept NordFit.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Accès par QR code" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Votre accès est directement dans l’app — rapide, clair et sans détour." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Souscrire numériquement" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Réserver, consulter et gérer au même endroit." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Acheter un pass journalier" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Idéal pour découvrir NordFit ou s’entraîner spontanément." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Tout reste clair" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Le site, l’accès et la gestion personnelle restent regroupés clairement." },
      },
      es: {
        ".hero-title": { text: "Todo lo importante. En una sola app." },
        ".hero-subtitle": {
          html: "La app de NordFit no es solo un extra. Es el acceso central a todo lo que en NordFit debe funcionar de forma simple, clara y digital.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "DESCARGAR EN" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "DISPONIBLE EN" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Información importante" },
        ".info-note-text": {
          html: "Sin la app de NordFit no hay acceso al estudio. La membresía, el pase diario, la gestión y el código QR pasan completamente por ella.",
        },
        ".section-title.large-title": { text: "Una cuenta. Un código QR. Un flujo claro." },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {
          text: "En NordFit todo pasa por una sola vía limpia. Sin formularios en papel, sin pasos innecesarios y sin procesos poco claros.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {
          text: "En la app completas tu membresía, reservas tu pase diario, gestionas tus datos y recibes el código QR con el que accedes directamente al estudio.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {
          text: "Precisamente por eso la app no es un detalle opcional, sino una parte fija de todo el concepto NordFit.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Acceso por código QR" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Tu acceso está directamente en la app: rápido, claro y sin rodeos." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Completar membresía digitalmente" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Reservar, ver y gestionar todo en un solo lugar." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Comprar pase diario" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Ideal si quieres conocer NordFit primero o entrenar de forma espontánea." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Todo claramente visible" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Ubicación, acceso y gestión personal permanecen claramente reunidos." },
      },
      it: {
        ".hero-title": { text: "Tutto ciò che conta. In una sola app." },
        ".hero-subtitle": {
          html: "L’app NordFit non è solo un extra. È l’accesso centrale a tutto ciò che in NordFit deve funzionare in modo semplice, chiaro e digitale.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "SCARICA SU" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "DISPONIBILE SU" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Informazione importante" },
        ".info-note-text": {
          html: "Senza l’app NordFit non c’è accesso allo studio. Abbonamento, pass giornaliero, gestione e codice QR passano completamente da lì.",
        },
        ".section-title.large-title": { text: "Un account. Un QR code. Un flusso chiaro." },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {
          text: "In NordFit tutto passa attraverso un unico percorso pulito. Niente moduli cartacei, niente passaggi inutili e niente procedure poco chiare.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {
          text: "Nell’app completi il tuo abbonamento, prenoti il pass giornaliero, gestisci i tuoi dati e ricevi il QR code con cui entri direttamente nello studio.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {
          text: "Proprio per questo l’app non è un dettaglio opzionale, ma una parte fissa dell’intero concetto NordFit.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Accesso con QR code" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Il tuo accesso è direttamente nell’app: veloce, chiaro e senza deviazioni." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Abbonamento digitale" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Prenota, consulta e gestisci tutto in un solo posto." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Acquista un pass giornaliero" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Ideale se vuoi prima conoscere NordFit o allenarti spontaneamente." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Tutto sotto controllo" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Sede, accesso e gestione personale restano chiaramente riuniti." },
      },
      pl: {
        ".hero-title": { text: "Wszystko, co ważne. W jednej aplikacji." },
        ".hero-subtitle": {
          html: "Aplikacja NordFit to nie tylko dodatek. To centralny dostęp do wszystkiego, co w NordFit ma działać prosto, jasno i cyfrowo.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "POBIERZ W" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "DOSTĘPNE W" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Ważna informacja" },
        ".info-note-text": {
          html: "Bez aplikacji NordFit nie ma dostępu do studia. Karnet, wejście dzienne, zarządzanie i kod QR działają całkowicie przez nią.",
        },
        ".section-title.large-title": { text: "Jedno konto. Jeden kod QR. Jeden jasny przebieg." },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {
          text: "W NordFit wszystko działa przez jedną czystą ścieżkę. Bez papierowych formularzy, bez zbędnych kroków i bez niejasnych procesów.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {
          text: "W aplikacji finalizujesz karnet, rezerwujesz wejście dzienne, zarządzasz swoimi danymi i otrzymujesz kod QR, dzięki któremu wchodzisz bezpośrednio do studia.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {
          text: "Właśnie dlatego aplikacja nie jest opcjonalnym dodatkiem, lecz stałą częścią całej koncepcji NordFit.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Wejście przez kod QR" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Twój dostęp jest bezpośrednio w aplikacji — szybko, jasno i bez zbędnych dróg." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Cyfrowe zakończenie karnetu" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Rezerwuj, przeglądaj i zarządzaj wszystkim w jednym miejscu." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Kup wejście dzienne" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Idealne, jeśli chcesz najpierw poznać NordFit albo trenować spontanicznie." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Wszystko jasno widoczne" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Lokalizacja, dostęp i zarządzanie osobiste pozostają jasno zebrane w jednym miejscu." },
      },
      nl: {
        ".hero-title": { text: "Alles wat belangrijk is. In één app." },
        ".hero-subtitle": {
          html: "De NordFit-app is niet zomaar een extra. Het is het centrale toegangspunt voor alles wat bij NordFit bewust eenvoudig, helder en digitaal moet werken.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "DOWNLOAD IN DE" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "NU OP" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Belangrijke info" },
        ".info-note-text": {
          html: "Zonder de NordFit-app is er geen toegang tot de studio. Lidmaatschap, dagpas, beheer en QR-toegang lopen volledig via de app.",
        },
        ".section-title.large-title": { text: "Eén account. Eén QR-code. Eén helder proces." },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {
          text: "Bij NordFit loopt alles via één duidelijke weg. Geen papieren formulieren, geen onnodige tussenstappen en geen onduidelijke processen.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {
          text: "In de app rond je je lidmaatschap af, boek je je dagpas, beheer je je gegevens en ontvang je de QR-code waarmee je direct de studio binnenkomt.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {
          text: "Juist daarom is de app geen optioneel detail, maar een vast onderdeel van het hele NordFit-concept.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Toegang via QR-code" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Je toegang zit direct in de app — snel, helder en zonder omwegen." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Lidmaatschap digitaal afronden" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Boeken, bekijken en beheren op één plek." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Dagpas direct kopen" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Ideaal als je NordFit eerst wilt leren kennen of spontaan wilt trainen." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Alles helder in beeld" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Locatie, toegang en persoonlijk beheer blijven duidelijk gebundeld." },
      },
      da: {
        ".hero-title": { text: "Alt det vigtige. I én app." },
        ".hero-subtitle": {
          html: "NordFit-appen er ikke bare et ekstra lag. Den er den centrale adgang til alt det, der hos NordFit skal fungere enkelt, klart og digitalt.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "HENT I" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "FÅS PÅ" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Vigtig info" },
        ".info-note-text": {
          html: "Uden NordFit-appen er der ingen adgang til studiet. Medlemskab, dagspas, administration og QR-adgang kører fuldt ud gennem appen.",
        },
        ".section-title.large-title": { text: "Én konto. Én QR-kode. Ét klart forløb." },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {
          text: "Hos NordFit går alt gennem én ren vej. Ingen papirformularer, ingen unødige mellemtrin og ingen uklare processer.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {
          text: "I appen afslutter du dit medlemskab, booker dit dagspas, administrerer dine data og modtager QR-koden, der giver dig direkte adgang til studiet.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {
          text: "Derfor er appen ikke en valgfri detalje, men en fast del af hele NordFit-konceptet.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Adgang via QR-kode" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Din adgang ligger direkte i appen — hurtigt, klart og uden omveje." },
        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Afslut medlemskab digitalt" },
        ".app-need-item:nth-of-type(2) .muted": { text: "Book, se og administrer alt på ét sted." },
        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Køb dagspas direkte" },
        ".app-need-item:nth-of-type(3) .muted": { text: "Ideelt, hvis du først vil lære NordFit at kende eller træne spontant." },
        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Alt samlet klart" },
        ".app-need-item:nth-of-type(4) .muted": { text: "Lokation, adgang og personlig administration forbliver tydeligt samlet." },
      },
      sv: {
        ".hero-title": { text: "Allt det viktiga. I en app." },
        ".hero-subtitle": {
          html: "NordFit-appen är inte bara ett extra tillägg. Den är den centrala tillgången till allt som hos NordFit ska fungera enkelt, tydligt och digitalt.",
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "LADDA NER I" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "FINNS PÅ" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },
        ".info-note-label": { text: "Viktig info" },
        ".info-note-text": {
          html: "Utan NordFit-appen finns ingen tillgång till studion. Medlemskap, dagspass, hantering och QR-inträde går helt genom appen.",
        },
        ".section-title.large-title": { text: "Ett konto. En QR-kod. Ett tydligt flöde." },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {
          text: "Hos NordFit går allt genom en ren väg. Inga pappersformulär, inga onödiga steg och inga otydliga processer.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {
          text: "I appen slutför du ditt medlemskap, bokar ditt dagspass, hanterar dina uppgifter och får QR-koden som ger dig direkt tillgång till studion.",
        },
        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {
          text: "Det är därför appen inte är en valfri detalj, utan en fast del av hela NordFit-konceptet.",
        },
        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Inträde med QR-kod" },
        ".app-need-item:nth-of-type(1) .muted": { text: "Din tillgång finns direkt i appen — snabbt, tydlich und utan omvägar." },

        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Slutför medlemskap digitalt" },

        ".app-need-item:nth-of-type(2) .muted": { text: "Boka, se och hantera allt på ett ställe." },

        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Köp dagspass direkt" },

        ".app-need-item:nth-of-type(3) .muted": { text: "Perfekt om du först vill lära känna NordFit eller träna spontant." },

        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Allt tydligt samlat" },

        ".app-need-item:nth-of-type(4) .muted": { text: "Plats, tillgång och personlig hantering hålls tydligt samlade." },

      },

      no: {

        ".hero-title": { text: "Alt det viktige. I én app." },

        ".hero-subtitle": {

          html: "NordFit-appen er ikke bare en ekstra detalj. Den er den sentrale tilgangen til alt som hos NordFit skal fungere enkelt, tydelig og digitalt.",

        },

        ".store-badge:nth-of-type(1) .store-badge-small": { text: "LAST NED I" },

        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },

        ".store-badge:nth-of-type(2) .store-badge-small": { text: "FÅ DEN PÅ" },

        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" },

        ".info-note-label": { text: "Viktig info" },

        ".info-note-text": {

          html: "Uten NordFit-appen er det ingen adgang til studioet. Medlemskap, dagspass, administrasjon og QR-tilgang går fullt ut gjennom appen.",

        },

        ".section-title.large-title": { text: "Én konto. Én QR-kode. Én tydelig flyt." },

        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(1)": {

          text: "Hos NordFit går alt gjennom én ren vei. Ingen papirskjemaer, ingen unødige mellomledd og ingen uklare prosesser.",

        },

        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(2)": {

          text: "I appen fullfører du medlemskapet ditt, bestiller dagspasset, administrerer opplysningene dine og mottar QR-koden som gir deg direkte adgang til studioet.",

        },

        ".app-page-hero-grid > div:first-child > .muted:nth-of-type(3)": {

          text: "Nettopp derfor er appen ikke en valgfri detalj, men en fast del av hele NordFit-konseptet.",

        },

        ".app-need-item:nth-of-type(1) .app-need-title": { text: "Adgang via QR-kode" },

        ".app-need-item:nth-of-type(1) .muted": { text: "Tilgangen din ligger direkte i appen — raskt, tydelig og uten omveier." },

        ".app-need-item:nth-of-type(2) .app-need-title": { text: "Fullfør medlemskap digitalt" },

        ".app-need-item:nth-of-type(2) .muted": { text: "Bestill, se og administrer alt på ett sted." },

        ".app-need-item:nth-of-type(3) .app-need-title": { text: "Kjøp dagspass direkte" },

        ".app-need-item:nth-of-type(3) .muted": { text: "Perfekt hvis du først vil bli kjent med NordFit eller trene spontant." },

        ".app-need-item:nth-of-type(4) .app-need-title": { text: "Alt tydelig samlet" },

        ".app-need-item:nth-of-type(4) .muted": { text: "Lokasjon, adgang og personlig administrasjon holdes tydelig samlet." },

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

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Zutritt nur mit gültigem Zugang" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "Kein Zutritt für Unbefugte" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Geeignete Trainingskleidung" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Handtuch benutzen" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "Geräte ordentlich hinterlassen" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Respekt im Umgang" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "Sicher und verantwortungsvoll trainieren" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Ruhe und Ordnung im Studio" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "Sauberkeit zählt mit" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "Hausrecht" },

      },

      en: {

        ".hero-title": { text: "Clear rules. Calm training." },

        ".hero-subtitle": {

          html: "NordFit should feel clean, respectful and pleasant. These house rules create a clear and reliable framework for that.",

        },

        ".info-note-label": { text: "Principle" },

        ".info-note-text": {

          html: "Anyone training at NordFit should be able to rely on a fair, calm and clean environment. These rules exist for exactly that — not as an overreaction, but as a standard.",

        },

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Entry only with valid access" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "No entry for unauthorized persons" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Appropriate training clothing" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Use a towel" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "Leave equipment in order" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Respectful behaviour" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "Train safely and responsibly" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Calm and order in the studio" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "Cleanliness matters too" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "House rights" },

      },

      fr: {

        ".hero-title": { text: "Des règles claires. Un entraînement calme." },

        ".hero-subtitle": {

          html: "NordFit doit sembler propre, respectueux et agréable. Ce règlement crée pour cela un cadre clair et fiable.",

        },

        ".info-note-label": { text: "Principe" },

        ".info-note-text": {

          html: "Toute personne qui s’entraîne chez NordFit doit pouvoir compter sur un cadre équitable, calme et propre. Ces règles existent exactement pour cela — non pas comme exagération, mais comme standard.",

        },

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Accès uniquement avec une autorisation valide" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "Pas d’accès pour les personnes non autorisées" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Tenue d’entraînement appropriée" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Utiliser une serviette" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "Laisser les appareils en ordre" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Respect dans les échanges" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "S’entraîner en sécurité et avec responsabilité" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Calme et ordre dans le studio" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "La propreté compte aussi" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "Droit de domicile" },

      },

      es: {

        ".hero-title": { text: "Reglas claras. Entrenamiento tranquilo." },

        ".hero-subtitle": {

          html: "NordFit debe sentirse limpio, respetuoso y agradable. Estas normas crean un marco claro y fiable para ello.",

        },

        ".info-note-label": { text: "Principio" },

        ".info-note-text": {

          html: "Quien entrena en NordFit debe poder confiar en un entorno justo, tranquilo y limpio. Estas reglas existen exactamente para eso: no como exageración, sino como estándar.",

        },

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Acceso solo con autorización válida" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "Sin acceso para personas no autorizadas" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Ropa de entrenamiento adecuada" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Usar toalla" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "Dejar el equipo en orden" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Respeto en el trato" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "Entrenar con seguridad y responsabilidad" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Calma y orden en el estudio" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "La limpieza también cuenta" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "Derecho de admisión" },

      },

      it: {

        ".hero-title": { text: "Regole chiare. Allenamento tranquillo." },

        ".hero-subtitle": {

          html: "NordFit deve risultare pulito, rispettoso e piacevole. Questo regolamento crea per questo un quadro chiaro e affidabile.",

        },

        ".info-note-label": { text: "Principio" },

        ".info-note-text": {

          html: "Chi si allena da NordFit deve poter contare su un ambiente equo, tranquillo e pulito. Queste regole esistono esattamente per questo — non come esagerazione, ma come standard.",

        },

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Accesso solo con autorizzazione valida" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "Nessun accesso ai non autorizzati" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Abbigliamento adatto all’allenamento" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Usare un asciugamano" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "Lasciare l’attrezzatura in ordine" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Rispetto nei rapporti" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "Allenarsi in modo sicuro e responsabile" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Calma e ordine nello studio" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "Anche la pulizia conta" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "Diritto di domicilio" },

      },

      pl: {

        ".hero-title": { text: "Jasne zasady. Spokojny trening." },

        ".hero-subtitle": {

          html: "NordFit ma być czysty, pełen szacunku i przyjemny. Ten regulamin tworzy do tego jasne i pewne ramy.",

        },

        ".info-note-label": { text: "Zasada" },

        ".info-note-text": {

          html: "Każdy, kto trenuje w NordFit, powinien móc liczyć na uczciwe, spokojne i czyste otoczenie. Te zasady obowiązują właśnie po to — nie jako przesada, lecz jako standard.",

        },

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Wejście tylko z ważnym dostępem" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "Brak dostępu dla osób nieuprawnionych" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Odpowiedni strój treningowy" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Używaj ręcznika" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "Zostawiaj sprzęt w porządku" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Szacunek w kontakcie z innymi" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "Trenuj bezpiecznie i odpowiedzialnie" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Spokój i porządek w studiu" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "Czystość też się liczy" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "Prawo gospodarza" },

      },

      nl: {

        ".hero-title": { text: "Duidelijke regels. Rustig trainen." },

        ".hero-subtitle": {

          html: "NordFit moet schoon, respectvol en prettig aanvoelen. Deze huisregels zorgen daarvoor met een helder en betrouwbaar kader.",

        },

        ".info-note-label": { text: "Principe" },

        ".info-note-text": {

          html: "Wie bij NordFit traint, moet kunnen rekenen op een eerlijke, rustige en schone omgeving. Precies daarvoor gelden deze regels — niet als overdrijving, maar als standaard.",

        },

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Toegang alleen met geldige toegang" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "Geen toegang voor onbevoegden" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Geschikte trainingskleding" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Gebruik een handdoek" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "Laat apparaten netjes achter" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Respectvolle omgang" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "Train veilig en verantwoordelijk" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Rust en orde in de studio" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "Netheid telt ook mee" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "Huisrecht" },

      },

      da: {

        ".hero-title": { text: "Klare regler. Rolig træning." },

        ".hero-subtitle": {

          html: "NordFit skal føles rent, respektfuldt og behageligt. Disse husregler skaber en klar og pålidelig ramme for det.",

        },

        ".info-note-label": { text: "Princip" },

        ".info-note-text": {

          html: "Alle, der træner hos NordFit, skal kunne stole på et fair, roligt og rent miljø. Reglerne findes netop derfor — ikke som overdrivelse, men som standard.",

        },

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Adgang kun med gyldig adgang" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "Ingen adgang for uvedkommende" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Passende træningstøj" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Brug et håndklæde" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "Efterlad udstyr i orden" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Respektfuld omgang" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "Træn sikkert og ansvarligt" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Ro og orden i studiet" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "Renlighed tæller også" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "Husret" },

      },

      sv: {

        ".hero-title": { text: "Tydliga regler. Lugn träning." },

        ".hero-subtitle": {

          html: "NordFit ska kännas rent, respektfullt och behagligt. Dessa regler skapar en tydlig och pålitlig ram för det.",

        },

        ".info-note-label": { text: "Grundprincip" },

        ".info-note-text": {

          html: "Den som tränar hos NordFit ska kunna lita på en rättvis, lugn och ren miljö. Reglerna finns exakt för det — inte som överdrift, utan som standard.",

        },

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Tillträde endast med giltig tillgång" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "Inget tillträde för obehöriga" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Lämpliga träningskläder" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Använd handduk" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "Lämna utrustningen i ordning" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Respektfullt beteende" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "Träna säkert och ansvarsfullt" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Lugn och ordning i studion" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "Renlighet räknas också" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "Husregler / tillträdesrätt" },

      },

      no: {

        ".hero-title": { text: "Klare regler. Rolig trening." },

        ".hero-subtitle": {

          html: "NordFit skal føles rent, respektfullt og behagelig. Disse husreglene skaper en tydelig og pålitelig ramme for det.",

        },

        ".info-note-label": { text: "Prinsipp" },

        ".info-note-text": {

          html: "Den som trener hos NordFit skal kunne stole på et rettferdig, rolig og rent miljø. Reglene finnes akkurat derfor — ikke som overdrivelse, men som standard.",

        },

        ".house-rules-stack article:nth-of-type(1) .section-title": { text: "Adgang kun med gyldig tilgang" },

        ".house-rules-stack article:nth-of-type(2) .section-title": { text: "Ingen adgang for uvedkommende" },

        ".house-rules-stack article:nth-of-type(3) .section-title": { text: "Egnet treningstøy" },

        ".house-rules-stack article:nth-of-type(4) .section-title": { text: "Bruk håndkle" },

        ".house-rules-stack article:nth-of-type(5) .section-title": { text: "La utstyr være ryddig" },

        ".house-rules-stack article:nth-of-type(6) .section-title": { text: "Respektfull omgang" },

        ".house-rules-stack article:nth-of-type(7) .section-title": { text: "Tren trygt og ansvarlig" },

        ".house-rules-stack article:nth-of-type(8) .section-title": { text: "Ro og orden i studioet" },

        ".house-rules-stack article:nth-of-type(9) .section-title": { text: "Renhet teller også" },

        ".house-rules-stack article:nth-of-type(10) .section-title": { text: "Husrett" },

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

          html: "If you have questions about NordFit, the app, your access or a membership, you can reach us here in the most direct way.",

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

        "#contact-message": { placeholder: "Write your message ..." },

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

          html: "Si vous avez des questions sur NordFit, l’application, votre accès ou un abonnement, vous pouvez nous joindre ici par le chemin le plus direct.",

        },

        ".section-block .section-title": { text: "Moyens de contact" },

        ".contact-form-shell .section-title": { text: "Formulaire de contact" },

        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "E-mail" },

        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },

        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Téléphone" },

        ".contact-info-item:nth-of-type(3) .muted": { text: "Bientôt disponible" },

        "label[for='contact-firstname']": { html: "Prénom <span class='required-star'>*</span>" },

        "label[for='contact-lastname']": { html: "Nom <span class='required-star'>*</span>" },

        "label[for='contact-email']": { html: "E-mail <span class='required-star'>*</span>" },

        "label[for='contact-phone']": { html: "Numéro de téléphone <span class='required-star'>*</span>" },

        "label[for='contact-topic']": { html: "Sujet <span class='required-star'>*</span>" },

        "label[for='contact-memberid']": { text: "Member ID" },

        "label[for='contact-message']": { html: "Message <span class='required-star'>*</span>" },

        "#contact-firstname": { placeholder: "Votre prénom" },

        "#contact-lastname": { placeholder: "Votre nom" },

        "#contact-email": { placeholder: "votrenom@email.fr" },

        "#contact-phone": { placeholder: "Votre numéro de téléphone" },

        "#contact-memberid": { placeholder: "Optionnel" },

        "#contact-message": { placeholder: "Écrivez-nous votre demande ..." },

        "#contact-topic option:nth-child(1)": { text: "Veuillez choisir" },

        "#contact-topic option:nth-child(2)": { text: "Abonnement" },

        "#contact-topic option:nth-child(3)": { text: "App" },

        "#contact-topic option:nth-child(4)": { text: "Accès / QR code" },

        "#contact-topic option:nth-child(5)": { text: "Pass journalier" },

        "#contact-topic option:nth-child(6)": { text: "Site" },

        "#contact-topic option:nth-child(7)": { text: "Compte / Données" },

        "#contact-topic option:nth-child(8)": { text: "Question générale" },

        ".contact-form-footer .muted": { text: "Ou directement par e-mail à nordgroup.business@gmail.com" },

        ".required-note": { text: "Les champs marqués * sont obligatoires." },

        ".contact-form-footer .btn": { text: "Envoyer le message" },

      },

      es: {

        ".hero-title": { text: "Directo. Claro. Personal." },

        ".hero-subtitle": {

          html: "Si tienes preguntas sobre NordFit, la app, tu acceso o una membresía, puedes contactarnos aquí por la vía más directa.",

        },

        ".section-block .section-title": { text: "Vías de contacto" },

        ".contact-form-shell .section-title": { text: "Formulario de contacto" },

        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "Correo" },

        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },

        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Teléfono" },

        ".contact-info-item:nth-of-type(3) .muted": { text: "Disponible pronto" },

        "label[for='contact-firstname']": { html: "Nombre <span class='required-star'>*</span>" },

        "label[for='contact-lastname']": { html: "Apellido <span class='required-star'>*</span>" },

        "label[for='contact-email']": { html: "Correo electrónico <span class='required-star'>*</span>" },

        "label[for='contact-phone']": { html: "Número de teléfono <span class='required-star'>*</span>" },

        "label[for='contact-topic']": { html: "Tema <span class='required-star'>*</span>" },

        "label[for='contact-memberid']": { text: "Member ID" },

        "label[for='contact-message']": { html: "Mensaje <span class='required-star'>*</span>" },

        "#contact-firstname": { placeholder: "Tu nombre" },

        "#contact-lastname": { placeholder: "Tu apellido" },

        "#contact-email": { placeholder: "tunombre@email.com" },

        "#contact-phone": { placeholder: "Tu número de teléfono" },

        "#contact-memberid": { placeholder: "Opcional" },

        "#contact-message": { placeholder: "Escríbenos tu consulta ..." },

        "#contact-topic option:nth-child(1)": { text: "Por favor elige" },

        "#contact-topic option:nth-child(2)": { text: "Membresía" },

        "#contact-topic option:nth-child(3)": { text: "App" },

        "#contact-topic option:nth-child(4)": { text: "Acceso / Código QR" },

        "#contact-topic option:nth-child(5)": { text: "Pase diario" },

        "#contact-topic option:nth-child(6)": { text: "Ubicación" },

        "#contact-topic option:nth-child(7)": { text: "Cuenta / Datos" },

        "#contact-topic option:nth-child(8)": { text: "Pregunta general" },

        ".contact-form-footer .muted": { text: "O directamente por correo a nordgroup.business@gmail.com" },

        ".required-note": { text: "Los campos marcados con * son obligatorios." },

        ".contact-form-footer .btn": { text: "Enviar mensaje" },

      },

      it: {

        ".hero-title": { text: "Diretto. Chiaro. Personale." },

        ".hero-subtitle": {

          html: "Se hai domande su NordFit, sull’app, sul tuo accesso o su un abbonamento, puoi contattarci qui nel modo più diretto.",

        },

        ".section-block .section-title": { text: "Contatti" },

        ".contact-form-shell .section-title": { text: "Modulo di contatto" },

        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "E-mail" },

        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },

        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Telefono" },

        ".contact-info-item:nth-of-type(3) .muted": { text: "Disponibile presto" },

        "label[for='contact-firstname']": { html: "Nome <span class='required-star'>*</span>" },

        "label[for='contact-lastname']": { html: "Cognome <span class='required-star'>*</span>" },

        "label[for='contact-email']": { html: "E-mail <span class='required-star'>*</span>" },

        "label[for='contact-phone']": { html: "Numero di telefono <span class='required-star'>*</span>" },

        "label[for='contact-topic']": { html: "Tema <span class='required-star'>*</span>" },

        "label[for='contact-memberid']": { text: "Member ID" },

        "label[for='contact-message']": { html: "Messaggio <span class='required-star'>*</span>" },

        "#contact-firstname": { placeholder: "Il tuo nome" },

        "#contact-lastname": { placeholder: "Il tuo cognome" },

        "#contact-email": { placeholder: "iltuonome@email.it" },

        "#contact-phone": { placeholder: "Il tuo numero di telefono" },

        "#contact-memberid": { placeholder: "Opzionale" },

        "#contact-message": { placeholder: "Scrivici la tua richiesta ..." },

        "#contact-topic option:nth-child(1)": { text: "Seleziona" },

        "#contact-topic option:nth-child(2)": { text: "Abbonamento" },

        "#contact-topic option:nth-child(3)": { text: "App" },

        "#contact-topic option:nth-child(4)": { text: "Accesso / QR code" },

        "#contact-topic option:nth-child(5)": { text: "Pass giornaliero" },

        "#contact-topic option:nth-child(6)": { text: "Sede" },

        "#contact-topic option:nth-child(7)": { text: "Account / Dati" },

        "#contact-topic option:nth-child(8)": { text: "Domanda generale" },

        ".contact-form-footer .muted": { text: "Oppure direttamente via mail a nordgroup.business@gmail.com" },

        ".required-note": { text: "I campi contrassegnati con * sono obbligatori." },

        ".contact-form-footer .btn": { text: "Invia messaggio" },

      },

      pl: {

        ".hero-title": { text: "Bezpośrednio. Jasno. Osobiście." },

        ".hero-subtitle": {

          html: "Jeśli masz pytania dotyczące NordFit, aplikacji, dostępu lub karnetu, możesz skontaktować się z nami tutaj w najprostszy sposób.",

        },

        ".section-block .section-title": { text: "Sposoby kontaktu" },

        ".contact-form-shell .section-title": { text: "Formularz kontaktowy" },

        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "E-mail" },

        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },

        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Telefon" },

        ".contact-info-item:nth-of-type(3) .muted": { text: "Wkrótce dostępne" },

        "label[for='contact-firstname']": { html: "Imię <span class='required-star'>*</span>" },

        "label[for='contact-lastname']": { html: "Nazwisko <span class='required-star'>*</span>" },

        "label[for='contact-email']": { html: "E-mail <span class='required-star'>*</span>" },

        "label[for='contact-phone']": { html: "Numer telefonu <span class='required-star'>*</span>" },

        "label[for='contact-topic']": { html: "Temat <span class='required-star'>*</span>" },

        "label[for='contact-memberid']": { text: "Member ID" },

        "label[for='contact-message']": { html: "Wiadomość <span class='required-star'>*</span>" },

        "#contact-firstname": { placeholder: "Twoje imię" },

        "#contact-lastname": { placeholder: "Twoje nazwisko" },

        "#contact-email": { placeholder: "twojenazwisko@email.pl" },

        "#contact-phone": { placeholder: "Twój numer telefonu" },

        "#contact-memberid": { placeholder: "Opcjonalnie" },

        "#contact-message": { placeholder: "Napisz swoją wiadomość ..." },

        "#contact-topic option:nth-child(1)": { text: "Proszę wybrać" },

        "#contact-topic option:nth-child(2)": { text: "Karnet" },

        "#contact-topic option:nth-child(3)": { text: "Aplikacja" },

        "#contact-topic option:nth-child(4)": { text: "Dostęp / Kod QR" },

        "#contact-topic option:nth-child(5)": { text: "Wejście dzienne" },

        "#contact-topic option:nth-child(6)": { text: "Lokalizacja" },

        "#contact-topic option:nth-child(7)": { text: "Konto / Dane" },

        "#contact-topic option:nth-child(8)": { text: "Pytanie ogólne" },

        ".contact-form-footer .muted": { text: "Albo bezpośrednio mailowo na nordgroup.business@gmail.com" },

        ".required-note": { text: "Pola oznaczone * są wymagane." },

        ".contact-form-footer .btn": { text: "Wyślij wiadomość" },

      },

      nl: {

        ".hero-title": { text: "Direct. Helder. Persoonlijk." },

        ".hero-subtitle": {

          html: "Als je vragen hebt over NordFit, de app, je toegang of een lidmaatschap, kun je ons hier op de meest directe manier bereiken.",

        },

        ".section-block .section-title": { text: "Contactmogelijkheden" },

        ".contact-form-shell .section-title": { text: "Contactformulier" },

        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "E-mail" },

        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },

        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Telefoon" },

        ".contact-info-item:nth-of-type(3) .muted": { text: "Binnenkort beschikbaar" },

        "label[for='contact-firstname']": { html: "Voornaam <span class='required-star'>*</span>" },

        "label[for='contact-lastname']": { html: "Achternaam <span class='required-star'>*</span>" },

        "label[for='contact-email']": { html: "E-mail <span class='required-star'>*</span>" },

        "label[for='contact-phone']": { html: "Telefoonnummer <span class='required-star'>*</span>" },

        "label[for='contact-topic']": { html: "Onderwerp <span class='required-star'>*</span>" },

        "label[for='contact-memberid']": { text: "Member ID" },

        "label[for='contact-message']": { html: "Bericht <span class='required-star'>*</span>" },

        "#contact-firstname": { placeholder: "Je voornaam" },

        "#contact-lastname": { placeholder: "Je achternaam" },

        "#contact-email": { placeholder: "jenaam@email.nl" },

        "#contact-phone": { placeholder: "Je telefoonnummer" },

        "#contact-memberid": { placeholder: "Optioneel" },

        "#contact-message": { placeholder: "Schrijf ons je bericht ..." },

        "#contact-topic option:nth-child(1)": { text: "Maak een keuze" },

        "#contact-topic option:nth-child(2)": { text: "Lidmaatschap" },

        "#contact-topic option:nth-child(3)": { text: "App" },

        "#contact-topic option:nth-child(4)": { text: "Toegang / QR-code" },

        "#contact-topic option:nth-child(5)": { text: "Dagpas" },

        "#contact-topic option:nth-child(6)": { text: "Locatie" },

        "#contact-topic option:nth-child(7)": { text: "Account / Gegevens" },

        "#contact-topic option:nth-child(8)": { text: "Algemene vraag" },

        ".contact-form-footer .muted": { text: "Of direct per mail naar nordgroup.business@gmail.com" },

        ".required-note": { text: "Velden met * zijn verplicht." },

        ".contact-form-footer .btn": { text: "Bericht verzenden" },

      },

      da: {

        ".hero-title": { text: "Direkte. Klart. Personligt." },

        ".hero-subtitle": {

          html: "Hvis du har spørgsmål om NordFit, appen, din adgang eller et medlemskab, kan du kontakte os her på den mest direkte måde.",

        },

        ".section-block .section-title": { text: "Kontaktmuligheder" },

        ".contact-form-shell .section-title": { text: "Kontaktformular" },

        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "E-mail" },

        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },

        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Telefon" },

        ".contact-info-item:nth-of-type(3) .muted": { text: "Snart tilgængelig" },

        "label[for='contact-firstname']": { html: "Fornavn <span class='required-star'>*</span>" },

        "label[for='contact-lastname']": { html: "Efternavn <span class='required-star'>*</span>" },

        "label[for='contact-email']": { html: "E-mail <span class='required-star'>*</span>" },

        "label[for='contact-phone']": { html: "Telefonnummer <span class='required-star'>*</span>" },

        "label[for='contact-topic']": { html: "Emne <span class='required-star'>*</span>" },

        "label[for='contact-memberid']": { text: "Member ID" },

        "label[for='contact-message']": { html: "Besked <span class='required-star'>*</span>" },

        "#contact-firstname": { placeholder: "Dit fornavn" },

        "#contact-lastname": { placeholder: "Dit efternavn" },

        "#contact-email": { placeholder: "ditnavn@email.dk" },

        "#contact-phone": { placeholder: "Dit telefonnummer" },

        "#contact-memberid": { placeholder: "Valgfrit" },

        "#contact-message": { placeholder: "Skriv din besked ..." },

        "#contact-topic option:nth-child(1)": { text: "Vælg venligst" },

        "#contact-topic option:nth-child(2)": { text: "Medlemskab" },

        "#contact-topic option:nth-child(3)": { text: "App" },

        "#contact-topic option:nth-child(4)": { text: "Adgang / QR-kode" },

        "#contact-topic option:nth-child(5)": { text: "Dagspas" },

        "#contact-topic option:nth-child(6)": { text: "Lokation" },

        "#contact-topic option:nth-child(7)": { text: "Konto / Data" },

        "#contact-topic option:nth-child(8)": { text: "Generelt spørgsmål" },

        ".contact-form-footer .muted": { text: "Eller direkte pr. mail til nordgroup.business@gmail.com" },

        ".required-note": { text: "Felter markeret med * skal udfyldes." },

        ".contact-form-footer .btn": { text: "Send besked" },

      },

      sv: {

        ".hero-title": { text: "Direkt. Tydligt. Personligt." },

        ".hero-subtitle": {

          html: "Om du har frågor om NordFit, appen, din tillgång eller ett medlemskap kan du nå oss här på det mest direkta sättet.",

        },

        ".section-block .section-title": { text: "Kontaktvägar" },

        ".contact-form-shell .section-title": { text: "Kontaktformulär" },

        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "E-post" },

        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },

        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Telefon" },

        ".contact-info-item:nth-of-type(3) .muted": { text: "Kommer snart" },

        "label[for='contact-firstname']": { html: "Förnamn <span class='required-star'>*</span>" },

        "label[for='contact-lastname']": { html: "Efternamn <span class='required-star'>*</span>" },

        "label[for='contact-email']": { html: "E-post <span class='required-star'>*</span>" },

        "label[for='contact-phone']": { html: "Telefonnummer <span class='required-star'>*</span>" },

        "label[for='contact-topic']": { html: "Ämne <span class='required-star'>*</span>" },

        "label[for='contact-memberid']": { text: "Member ID" },

        "label[for='contact-message']": { html: "Meddelande <span class='required-star'>*</span>" },

        "#contact-firstname": { placeholder: "Ditt förnamn" },

        "#contact-lastname": { placeholder: "Ditt efternamn" },

        "#contact-email": { placeholder: "dittnamn@email.se" },

        "#contact-phone": { placeholder: "Ditt telefonnummer" },

        "#contact-memberid": { placeholder: "Valfritt" },

        "#contact-message": { placeholder: "Skriv ditt meddelande ..." },

        "#contact-topic option:nth-child(1)": { text: "Välj gärna" },

        "#contact-topic option:nth-child(2)": { text: "Medlemskap" },

        "#contact-topic option:nth-child(3)": { text: "App" },

        "#contact-topic option:nth-child(4)": { text: "Tillgång / QR-kod" },

        "#contact-topic option:nth-child(5)": { text: "Dagspass" },

        "#contact-topic option:nth-child(6)": { text: "Plats" },

        "#contact-topic option:nth-child(7)": { text: "Konto / Data" },

        "#contact-topic option:nth-child(8)": { text: "Allmän fråga" },

        ".contact-form-footer .muted": { text: "Eller direkt via mail till nordgroup.business@gmail.com" },

        ".required-note": { text: "Fält markerade med * måste fyllas i." },

        ".contact-form-footer .btn": { text: "Skicka meddelande" },

      },

      no: {

        ".hero-title": { text: "Direkte. Tydelig. Personlig." },

        ".hero-subtitle": {

          html: "Hvis du har spørsmål om NordFit, appen, tilgangen din eller et medlemskap, kan du nå oss her på den mest direkte måten.",

        },

        ".section-block .section-title": { text: "Kontaktmuligheter" },

        ".contact-form-shell .section-title": { text: "Kontaktskjema" },

        ".contact-info-item:nth-of-type(1) .contact-info-label": { text: "E-post" },

        ".contact-info-item:nth-of-type(2) .contact-info-label": { text: "Instagram" },

        ".contact-info-item:nth-of-type(3) .contact-info-label": { text: "Telefon" },

        ".contact-info-item:nth-of-type(3) .muted": { text: "Kommer snart" },

        "label[for='contact-firstname']": { html: "Fornavn <span class='required-star'>*</span>" },

        "label[for='contact-lastname']": { html: "Etternavn <span class='required-star'>*</span>" },

        "label[for='contact-email']": { html: "E-post <span class='required-star'>*</span>" },

        "label[for='contact-phone']": { html: "Telefonnummer <span class='required-star'>*</span>" },

        "label[for='contact-topic']": { html: "Tema <span class='required-star'>*</span>" },

        "label[for='contact-memberid']": { text: "Member ID" },

        "label[for='contact-message']": { html: "Melding <span class='required-star'>*</span>" },

        "#contact-firstname": { placeholder: "Ditt fornavn" },

        "#contact-lastname": { placeholder: "Ditt etternavn" },

        "#contact-email": { placeholder: "dittnavn@email.no" },

        "#contact-phone": { placeholder: "Ditt telefonnummer" },

        "#contact-memberid": { placeholder: "Valgfritt" },

        "#contact-message": { placeholder: "Skriv meldingen din ..." },

        "#contact-topic option:nth-child(1)": { text: "Velg gjerne" },

        "#contact-topic option:nth-child(2)": { text: "Medlemskap" },

        "#contact-topic option:nth-child(3)": { text: "App" },

        "#contact-topic option:nth-child(4)": { text: "Tilgang / QR-kode" },

        "#contact-topic option:nth-child(5)": { text: "Dagspass" },

        "#contact-topic option:nth-child(6)": { text: "Lokasjon" },

        "#contact-topic option:nth-child(7)": { text: "Konto / Data" },

        "#contact-topic option:nth-child(8)": { text: "Generelt spørsmål" },

        ".contact-form-footer .muted": { text: "Eller direkte på e-post til nordgroup.business@gmail.com" },

        ".required-note": { text: "Felter merket med * må fylles ut." },

        ".contact-form-footer .btn": { text: "Send melding" },

      },

    },

    impressum: {

      de: {

        ".hero-title": { text: "Rechtliches. Klar formuliert." },

        ".hero-subtitle": {

          html: "Auch im rechtlichen Bereich soll NordFit nachvollziehbar, transparent und sauber auftreten — ohne unnötige Komplexität und ohne versteckte Formulierungen.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Impressum" },

        ".legal-actions-card .section-title": { text: "Schnellzugriff" },

        ".legal-actions-card > .muted": {

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

          html: "Even in legal matters, NordFit should appear understandable, transparent and clean — without unnecessary complexity and without hidden wording.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Legal Notice" },

        ".legal-actions-card .section-title": { text: "Quick access" },

        ".legal-actions-card > .muted": {

          text: "Terms, privacy and house rules can be opened directly here — easy to find and without a long search.",

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

          text: "The terms will be completed in full and prepared properly before publication. Until then, this section serves as a visible placeholder.",

        },

        "#privacy-modal .section-title": { text: "Privacy Policy" },

        "#privacy-modal .muted": {

          text: "The privacy policy will be completed here before NordFit is published. It should be written clearly and structured properly.",

        },

        "#rules-modal .section-title": { text: "House Rules" },

        "#rules-modal .muted": {

          text: "You can also find the house rules as a separate page. They create the framework for clean, calm and respectful training at NordFit.",

        },

      },

      fr: {

        ".hero-title": { text: "Mentions légales. Formulées clairement." },

        ".hero-subtitle": {

          html: "Même dans le domaine juridique, NordFit doit rester compréhensible, transparent et propre — sans complexité inutile et sans formulations cachées.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Mentions légales" },

        ".legal-actions-card .section-title": { text: "Accès rapide" },

        ".legal-actions-card > .muted": {

          text: "CGV, confidentialité et règlement peuvent être ouverts directement ici — faciles à trouver et sans longue recherche.",

        },

        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Nom de l’entreprise" },

        ".legal-info-row:nth-of-type(2) .legal-label": { text: "E-mail" },

        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },

        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Adresse" },

        ".legal-info-row:nth-of-type(4) strong": { text: "Bientôt disponible" },

        ".legal-missing-info .muted": {

          text: "Les informations manquantes seront ajoutées ici dès qu’elles seront définitivement fixées.",

        },

        ".legal-action-buttons .btn:nth-child(1)": { text: "Ouvrir les CGV" },

        ".legal-action-buttons .btn:nth-child(2)": { text: "Ouvrir la confidentialité" },

        ".legal-action-buttons .btn:nth-child(3)": { text: "Ouvrir le règlement" },

        "#agb-modal .section-title": { text: "Conditions générales" },

        "#agb-modal .muted": {

          text: "Les CGV seront complétées intégralement et préparées proprement avant publication. D’ici là, cette section sert de zone visible de remplacement.",

        },

        "#privacy-modal .section-title": { text: "Politique de confidentialité" },

        "#privacy-modal .muted": {

          text: "La politique de confidentialité sera complétée ici avant la publication de NordFit. Elle doit être claire et proprement structurée.",

        },

        "#rules-modal .section-title": { text: "Règlement" },

        "#rules-modal .muted": {

          text: "Le règlement est aussi disponible en page séparée. Il crée le cadre pour un entraînement propre, calme et respectueux chez NordFit.",

        },

      },

      es: {

        ".hero-title": { text: "Legal. Claramente formulado." },

        ".hero-subtitle": {

          html: "También en el ámbito legal, NordFit debe mostrarse comprensible, transparente y limpio — sin complejidad innecesaria y sin formulaciones ocultas.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Aviso legal" },

        ".legal-actions-card .section-title": { text: "Acceso rápido" },

        ".legal-actions-card > .muted": {

          text: "Términos, privacidad y normas pueden abrirse aquí directamente — fáciles de encontrar y sin largas búsquedas.",

        },

        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Nombre de la empresa" },

        ".legal-info-row:nth-of-type(2) .legal-label": { text: "Correo" },

        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },

        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Dirección" },

        ".legal-info-row:nth-of-type(4) strong": { text: "Disponible pronto" },

        ".legal-missing-info .muted": {

          text: "Los datos que falten se añadirán aquí en cuanto estén definitivamente fijados.",

        },

        ".legal-action-buttons .btn:nth-child(1)": { text: "Abrir términos" },

        ".legal-action-buttons .btn:nth-child(2)": { text: "Abrir privacidad" },

        ".legal-action-buttons .btn:nth-child(3)": { text: "Abrir normas" },

        "#agb-modal .section-title": { text: "Términos y condiciones" },

        "#agb-modal .muted": {

          text: "Los términos se completarán por completo y se prepararán correctamente antes de la publicación. Hasta entonces, esta sección sirve como marcador visible.",

        },

        "#privacy-modal .section-title": { text: "Política de privacidad" },

        "#privacy-modal .muted": {

          text: "La política de privacidad se completará aquí antes de que NordFit se publique. Debe estar escrita de forma clara y bien estructurada.",

        },

        "#rules-modal .section-title": { text: "Normas" },

        "#rules-modal .muted": {

          text: "También puedes encontrar las normas como página independiente. Crean el marco para un entrenamiento limpio, tranquilo y respetuoso en NordFit.",

        },

      },

      it: {

        ".hero-title": { text: "Aspetti legali. Formulati con chiarezza." },

        ".hero-subtitle": {

          html: "Anche nell’area legale, NordFit deve presentarsi in modo comprensibile, trasparente e pulito — senza complessità inutili e senza formulazioni nascoste.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Note legali" },

        ".legal-actions-card .section-title": { text: "Accesso rapido" },

        ".legal-actions-card > .muted": {

          text: "Termini, privacy e regolamento possono essere aperti qui direttamente — facili da trovare e senza lunghe ricerche.",

        },

        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Nome dell’azienda" },

        ".legal-info-row:nth-of-type(2) .legal-label": { text: "E-mail" },

        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },

        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Indirizzo" },

        ".legal-info-row:nth-of-type(4) strong": { text: "Disponibile presto" },

        ".legal-missing-info .muted": {

          text: "Le informazioni mancanti saranno aggiunte qui non appena saranno definitive.",

        },

        ".legal-action-buttons .btn:nth-child(1)": { text: "Apri termini" },

        ".legal-action-buttons .btn:nth-child(2)": { text: "Apri privacy" },

        ".legal-action-buttons .btn:nth-child(3)": { text: "Apri regolamento" },

        "#agb-modal .section-title": { text: "Termini e condizioni" },

        "#agb-modal .muted": {

          text: "I termini saranno completati integralmente e preparati correttamente prima della pubblicazione. Fino ad allora, questa sezione funge da segnaposto visibile.",

        },

        "#privacy-modal .section-title": { text: "Informativa sulla privacy" },

        "#privacy-modal .muted": {

          text: "L’informativa sulla privacy sarà completata qui prima della pubblicazione di NordFit. Deve essere scritta in modo chiaro e strutturata correttamente.",

        },

        "#rules-modal .section-title": { text: "Regolamento" },

        "#rules-modal .muted": {

          text: "Il regolamento è disponibile anche come pagina separata. Crea il quadro per un allenamento pulito, tranquillo e rispettoso da NordFit.",

        },

      },

      pl: {

        ".hero-title": { text: "Prawne. Jasno sformułowane." },

        ".hero-subtitle": {

          html: "Również w kwestiach prawnych NordFit ma być zrozumiały, przejrzysty i uporządkowany — bez zbędnej złożoności i bez ukrytych sformułowań.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Informacje prawne" },

        ".legal-actions-card .section-title": { text: "Szybki dostęp" },

        ".legal-actions-card > .muted": {

          text: "Regulamin, prywatność i zasady można otworzyć tutaj bezpośrednio — łatwo dostępne i bez długiego szukania.",

        },

        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Nazwa firmy" },

        ".legal-info-row:nth-of-type(2) .legal-label": { text: "E-mail" },

        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },

        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Adres" },

        ".legal-info-row:nth-of-type(4) strong": { text: "Wkrótce dostępne" },

        ".legal-missing-info .muted": {

          text: "Brakujące dane zostaną tutaj uzupełnione, gdy tylko będą ostatecznie ustalone.",

        },

        ".legal-action-buttons .btn:nth-child(1)": { text: "Otwórz regulamin" },

        ".legal-action-buttons .btn:nth-child(2)": { text: "Otwórz prywatność" },

        ".legal-action-buttons .btn:nth-child(3)": { text: "Otwórz zasady" },

        "#agb-modal .section-title": { text: "Regulamin i warunki" },

        "#agb-modal .muted": {

          text: "Regulamin zostanie uzupełniony w całości i przygotowany poprawnie przed publikacją. Do tego czasu ta sekcja służy jako widoczny placeholder.",

        },

        "#privacy-modal .section-title": { text: "Polityka prywatności" },

        "#privacy-modal .muted": {

          text: "Polityka prywatności zostanie tutaj uzupełniona przed publikacją NordFit. Powinna być napisana jasno i uporządkowana prawidłowo.",

        },

        "#rules-modal .section-title": { text: "Zasady" },

        "#rules-modal .muted": {

          text: "Zasady znajdziesz także jako osobną stronę. Tworzą one ramy dla czystego, spokojnego i pełnego szacunku treningu w NordFit.",

        },

      },

      nl: {

        ".hero-title": { text: "Juridisch. Duidelijk geformuleerd." },

        ".hero-subtitle": {

          html: "Ook op juridisch gebied moet NordFit begrijpelijk, transparant en netjes overkomen — zonder onnodige complexiteit en zonder verborgen formuleringen.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Juridische informatie" },

        ".legal-actions-card .section-title": { text: "Snelle toegang" },

        ".legal-actions-card > .muted": {

          text: "Voorwaarden, privacy en huisregels kunnen hier direct worden geopend — makkelijk bereikbaar en zonder lang zoeken.",

        },

        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Bedrijfsnaam" },

        ".legal-info-row:nth-of-type(2) .legal-label": { text: "E-mail" },

        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },

        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Adres" },

        ".legal-info-row:nth-of-type(4) strong": { text: "Binnenkort beschikbaar" },

        ".legal-missing-info .muted": {

          text: "Ontbrekende gegevens worden hier aangevuld zodra ze definitief vaststaan.",

        },

        ".legal-action-buttons .btn:nth-child(1)": { text: "Voorwaarden openen" },

        ".legal-action-buttons .btn:nth-child(2)": { text: "Privacy openen" },

        ".legal-action-buttons .btn:nth-child(3)": { text: "Huisregels openen" },

        "#agb-modal .section-title": { text: "Algemene voorwaarden" },

        "#agb-modal .muted": {

          text: "De voorwaarden worden voor publicatie volledig aangevuld en netjes uitgewerkt. Tot dan dient dit deel als zichtbare placeholder.",

        },

        "#privacy-modal .section-title": { text: "Privacyverklaring" },

        "#privacy-modal .muted": {

          text: "De privacyverklaring wordt hier aangevuld voordat NordFit wordt gepubliceerd. Ze moet duidelijk zijn geformuleerd en netjes zijn opgebouwd.",

        },

        "#rules-modal .section-title": { text: "Huisregels" },

        "#rules-modal .muted": {

          text: "De huisregels vind je ook als aparte pagina. Ze vormen het kader voor schoon, rustig en respectvol trainen bij NordFit.",

        },

      },

      da: {

        ".hero-title": { text: "Juridisk. Klart formuleret." },

        ".hero-subtitle": {

          html: "Også på det juridiske område skal NordFit fremstå forståeligt, transparent og ordentligt — uden unødig kompleksitet og uden skjulte formuleringer.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Juridisk information" },

        ".legal-actions-card .section-title": { text: "Hurtig adgang" },

        ".legal-actions-card > .muted": {

          text: "Vilkår, privatliv og husregler kan åbnes direkte her — lette at finde og uden lang søgning.",

        },

        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Firmanavn" },

        ".legal-info-row:nth-of-type(2) .legal-label": { text: "E-mail" },

        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },

        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Adresse" },

        ".legal-info-row:nth-of-type(4) strong": { text: "Snart tilgængelig" },

        ".legal-missing-info .muted": {

          text: "Manglende oplysninger tilføjes her, så snart de er endeligt fastlagt.",

        },

        ".legal-action-buttons .btn:nth-child(1)": { text: "Åbn vilkår" },

        ".legal-action-buttons .btn:nth-child(2)": { text: "Åbn privatliv" },

        ".legal-action-buttons .btn:nth-child(3)": { text: "Åbn husregler" },

        "#agb-modal .section-title": { text: "Vilkår og betingelser" },

        "#agb-modal .muted": {

          text: "Vilkårene bliver udfyldt fuldt og ordentligt før offentliggørelse. Indtil da fungerer denne del som synlig pladsholder.",

        },

        "#privacy-modal .section-title": { text: "Privatlivspolitik" },

        "#privacy-modal .muted": {

          text: "Privatlivspolitikken udfyldes her, før NordFit offentliggøres. Den skal være klart formuleret og ordentligt opbygget.",

        },

        "#rules-modal .section-title": { text: "Husregler" },

        "#rules-modal .muted": {

          text: "Husreglerne findes også som separat side. De skaber rammen for ren, rolig og respektfuld træning hos NordFit.",

        },

      },

      sv: {

        ".hero-title": { text: "Juridik. Tydligt formulerad." },

        ".hero-subtitle": {

          html: "Även i juridiska frågor ska NordFit framstå som begripligt, transparent och ordnat — utan onödig komplexitet och utan dolda formuleringar.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Juridisk information" },

        ".legal-actions-card .section-title": { text: "Snabbåtkomst" },

        ".legal-actions-card > .muted": {

          text: "Villkor, integritet och regler kan öppnas direkt här — lätt att hitta och utan lång sökning.",

        },

        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Företagsnamn" },

        ".legal-info-row:nth-of-type(2) .legal-label": { text: "E-post" },

        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },

        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Adress" },

        ".legal-info-row:nth-of-type(4) strong": { text: "Kommer snart" },

        ".legal-missing-info .muted": {

          text: "Saknade uppgifter läggs till här så snart de är slutgiltigt fastställda.",

        },

        ".legal-action-buttons .btn:nth-child(1)": { text: "Öppna villkor" },

        ".legal-action-buttons .btn:nth-child(2)": { text: "Öppna integritet" },

        ".legal-action-buttons .btn:nth-child(3)": { text: "Öppna regler" },

        "#agb-modal .section-title": { text: "Allmänna villkor" },

        "#agb-modal .muted": {

          text: "Villkoren kompletteras fullt ut och förbereds ordentligt före publicering. Tills dess fungerar detta område som synlig platshållare.",

        },

        "#privacy-modal .section-title": { text: "Integritetspolicy" },

        "#privacy-modal .muted": {

          text: "Integritetspolicyn fylls i här innan NordFit publiceras. Den ska vara tydligt skriven och ordentligt strukturerad.",

        },

        "#rules-modal .section-title": { text: "Regler" },

        "#rules-modal .muted": {

          text: "Reglerna finns också som separat sida. De skapar ramen för ren, lugn och respektfull träning hos NordFit.",

        },

      },

      no: {

        ".hero-title": { text: "Juridisk. Tydelig formulert." },

        ".hero-subtitle": {

          html: "Også på det juridiske området skal NordFit fremstå forståelig, transparent og ryddig — uten unødvendig kompleksitet og uten skjulte formuleringer.",

        },

        ".legal-grid article:first-child .section-title.large-title": { text: "Juridisk informasjon" },

        ".legal-actions-card .section-title": { text: "Hurtigtilgang" },

        ".legal-actions-card > .muted": {

          text: "Vilkår, personvern og husregler kan åpnes direkte her — lette å finne og uten lang leting.",

        },

        ".legal-info-row:nth-of-type(1) .legal-label": { text: "Firmanavn" },

        ".legal-info-row:nth-of-type(2) .legal-label": { text: "E-post" },

        ".legal-info-row:nth-of-type(3) .legal-label": { text: "Instagram" },

        ".legal-info-row:nth-of-type(4) .legal-label": { text: "Adresse" },

        ".legal-info-row:nth-of-type(4) strong": { text: "Kommer snart" },

        ".legal-missing-info .muted": {

          text: "Manglende opplysninger legges til her så snart de er endelig fastsatt.",

        },

        ".legal-action-buttons .btn:nth-child(1)": { text: "Åpne vilkår" },

        ".legal-action-buttons .btn:nth-child(2)": { text: "Åpne personvern" },

        ".legal-action-buttons .btn:nth-child(3)": { text: "Åpne husregler" },

        "#agb-modal .section-title": { text: "Vilkår og betingelser" },

        "#agb-modal .muted": {

          text: "Vilkårene blir fullført fullt ut og klargjort ordentlig før publisering. Inntil da fungerer dette området som synlig plassholder.",

        },

        "#privacy-modal .section-title": { text: "Personvernerklæring" },

        "#privacy-modal .muted": {

          text: "Personvernerklæringen fylles inn her før NordFit publiseres. Den skal være tydelig formulert og ordentlig bygget opp.",

        },

        "#rules-modal .section-title": { text: "Husregler" },

        "#rules-modal .muted": {

          text: "Husreglene finner du også som egen side. De skaper rammen for ren, rolig og respektfull trening hos NordFit.",

        },

      },

    },

  };

});
