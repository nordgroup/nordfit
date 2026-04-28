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
        ".app-need-item:nth-of-type(1) .muted": { text: "Din tillgång finns direkt i appen — snabbt, tyd
