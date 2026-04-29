/* =========================
   NordFit translations.js
   Stable data-i18n system
   Support: index.html + mitgliedschaften.html
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const supportedLanguages = ["de", "en", "fr", "es", "it", "pl", "nl", "sv", "da", "no"];
  const defaultLanguage = "de";

  const langOptions = document.querySelectorAll(".lang-option");
  const langToggleLabel = document.querySelector(".lang-toggle-label");

  function getSafeLanguage(lang) {
    const cleanLang = String(lang || "").trim().toLowerCase();
    return supportedLanguages.includes(cleanLang) ? cleanLang : defaultLanguage;
  }

  function getSavedLanguage() {
    try {
      return getSafeLanguage(localStorage.getItem("nordfit-language") || defaultLanguage);
    } catch {
      return defaultLanguage;
    }
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem("nordfit-language", getSafeLanguage(lang));
    } catch {
      /* localStorage can be unavailable */
    }
  }

  function getValueByPath(object, path) {
    return String(path || "")
      .split(".")
      .reduce((current, key) => {
        if (current && Object.prototype.hasOwnProperty.call(current, key)) {
          return current[key];
        }

        return undefined;
      }, object);
  }

  function updateLanguageUi(lang) {
    const safeLang = getSafeLanguage(lang);

    if (langToggleLabel) {
      langToggleLabel.textContent = safeLang.toUpperCase();
    }

    langOptions.forEach((option) => {
      const optionLang = getSafeLanguage(option.dataset.lang);
      const isSelected = optionLang === safeLang;

      option.classList.toggle("is-selected", isSelected);
      option.classList.toggle("is-active", isSelected);
      option.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
  }

  function applyLanguage(lang) {
    const safeLang = getSafeLanguage(lang);
    const dictionary = translations[safeLang] || translations[defaultLanguage];

    document.documentElement.lang = safeLang;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const value = getValueByPath(dictionary, key);

      if (typeof value === "string") {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-content]").forEach((element) => {
      const key = element.getAttribute("data-i18n-content");
      const value = getValueByPath(dictionary, key);

      if (typeof value === "string") {
        element.setAttribute("content", value);
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      const instructions = element.getAttribute("data-i18n-attr") || "";

      instructions.split(";").forEach((instruction) => {
        const [attribute, key] = instruction.split(":").map((part) => part.trim());
        if (!attribute || !key) return;

        const value = getValueByPath(dictionary, key);

        if (typeof value === "string") {
          element.setAttribute(attribute, value);
        }
      });
    });

    const titleValue = getValueByPath(dictionary, "meta.title");
    if (typeof titleValue === "string") {
      document.title = titleValue;
    }

    updateLanguageUi(safeLang);

    window.dispatchEvent(
      new CustomEvent("nordfit:language-ui-sync", {
        detail: { language: safeLang },
      })
    );
  }

  const common = {
    de: {
      nav: {
        home: "Startseite",
        pricing: "Tarife",
        locations: "Standorte",
        app: "App",
        rules: "Hausordnung",
        contact: "Kontakt",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. Do not distribute!",
        legal: "Impressum / AGB / Datenschutz",
        rules: "Hausordnung",
        contact: "Kontakt",
      },
    },

    en: {
      nav: {
        home: "Home",
        pricing: "Plans",
        locations: "Locations",
        app: "App",
        rules: "House Rules",
        contact: "Contact",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. Do not distribute!",
        legal: "Legal / Terms / Privacy",
        rules: "House Rules",
        contact: "Contact",
      },
    },

    fr: {
      nav: {
        home: "Accueil",
        pricing: "Tarifs",
        locations: "Sites",
        app: "App",
        rules: "Règlement",
        contact: "Contact",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. Ne pas distribuer !",
        legal: "Mentions / CGV / Confidentialité",
        rules: "Règlement",
        contact: "Contact",
      },
    },

    es: {
      nav: {
        home: "Inicio",
        pricing: "Tarifas",
        locations: "Ubicaciones",
        app: "App",
        rules: "Normas",
        contact: "Contacto",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. No distribuir.",
        legal: "Legal / Términos / Privacidad",
        rules: "Normas",
        contact: "Contacto",
      },
    },

    it: {
      nav: {
        home: "Home",
        pricing: "Tariffe",
        locations: "Sedi",
        app: "App",
        rules: "Regolamento",
        contact: "Contatto",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. Non distribuire.",
        legal: "Note legali / Termini / Privacy",
        rules: "Regolamento",
        contact: "Contatto",
      },
    },

    pl: {
      nav: {
        home: "Start",
        pricing: "Karnety",
        locations: "Lokalizacje",
        app: "Aplikacja",
        rules: "Regulamin",
        contact: "Kontakt",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. Nie rozpowszechniać.",
        legal: "Dane prawne / Regulamin / Prywatność",
        rules: "Regulamin",
        contact: "Kontakt",
      },
    },

    nl: {
      nav: {
        home: "Home",
        pricing: "Tarieven",
        locations: "Locaties",
        app: "App",
        rules: "Huisregels",
        contact: "Contact",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. Niet verspreiden.",
        legal: "Juridisch / Voorwaarden / Privacy",
        rules: "Huisregels",
        contact: "Contact",
      },
    },

    sv: {
      nav: {
        home: "Hem",
        pricing: "Priser",
        locations: "Platser",
        app: "App",
        rules: "Regler",
        contact: "Kontakt",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. Får ej distribueras.",
        legal: "Juridik / Villkor / Integritet",
        rules: "Regler",
        contact: "Kontakt",
      },
    },

    da: {
      nav: {
        home: "Hjem",
        pricing: "Priser",
        locations: "Lokationer",
        app: "App",
        rules: "Husregler",
        contact: "Kontakt",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. Må ikke distribueres.",
        legal: "Jura / Vilkår / Privatliv",
        rules: "Husregler",
        contact: "Kontakt",
      },
    },

    no: {
      nav: {
        home: "Hjem",
        pricing: "Priser",
        locations: "Lokasjoner",
        app: "App",
        rules: "Husregler",
        contact: "Kontakt",
      },
      footer: {
        copyright: "© 2030 NordFit/NordGroup. Skal ikke distribueres.",
        legal: "Juridisk / Vilkår / Personvern",
        rules: "Husregler",
        contact: "Kontakt",
      },
    },
  };

  const translations = {
    de: {
      ...common.de,

      meta: {
        title: "NordFit – Startseite",
        description:
          "NordFit ist ein modernes Fitnessstudio-Konzept mit ruhigem Design, klarer Struktur und hochwertigem Trainingsgefühl.",
      },

      home: {
        heroTitle: "Ruhig im Raum. Stark im Training.",
        heroSubtitle:
          "Ein modernes Studio-Konzept für klare Wege, saubere Flächen und Training, das sich nicht nach Chaos anfühlt.",
        primaryCta: "Tarife ansehen",
        secondaryCta: "Standort ansehen",
        heroImageAlt: "Außenansicht des geplanten NordFit Studios",
        floatingLabel: "Geplant für NordFit",
        floatingText: "Weniger Lärm. Mehr Fokus.",
        feelingTitle: "Nicht größer. Klarer.",
        feelingText:
          "NordFit soll nicht mit Reizen beeindrucken, sondern mit Ordnung. Ein Studio, das man sofort versteht — und gern wieder betritt.",
        featureOneTitle: "Ankommen",
        featureOneText:
          "Klare Orientierung vom ersten Schritt an. Kein Suchen, kein Gedränge, kein unnötiger Ablauf.",
        featureTwoTitle: "Trainieren",
        featureTwoText:
          "Kraft, Cardio und Bewegung sollen sauber getrennt wirken, ohne das Studio künstlich groß zu machen.",
        featureThreeTitle: "Runterkommen",
        featureThreeText:
          "Nach dem Training bleibt das Gefühl ruhig. Kein harter Bruch, kein lauter Abgang.",
        panelOneTitle: "Kraft. Ohne Krach.",
        panelOneText:
          "Der Kraftbereich soll direkt, aufgeräumt und fokussiert wirken. Alles, was du brauchst — ohne überladene Studiowirkung.",
        panelTwoTitle: "Cardio. Luft. Bewegung.",
        panelTwoText:
          "Ausdauer und freie Bewegung brauchen Platz im Kopf und im Raum. NordFit soll genau dieses offene Gefühl geben.",
        panelThreeTitle: "Ein Besuch, der sauber endet.",
        panelThreeText:
          "Training hört nicht beim letzten Satz auf. Ein ruhiger Abschluss macht den Besuch runder.",
        finalTitle: "Leise im Auftritt. Klar im Konzept.",
        finalText:
          "Tarife, Standort und App bleiben bewusst auf eigenen Seiten. So wirkt NordFit nicht voller — sondern verständlicher.",
        finalPrimary: "Tarife ansehen",
        finalSecondary: "Kontakt aufnehmen",
      },

      pricing: {
        heroTitle: "Drei Tarife. Eine klare Entscheidung.",
        heroSubtitle:
          "Wähle, wie flexibel du bleiben möchtest. Basic, Plus und Pro unterscheiden sich nur in Laufzeit und Freiheit — nicht im Trainingsgefühl.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "pro Monat",
        basicDetailOne: "8 Monate Mindestlaufzeit",
        plusDetailOne: "6 Monate Mindestlaufzeit",
        proDetailOne: "3 Monate Mindestlaufzeit",
        cancelMonthly: "Danach monatlich kündbar",
        accessIncluded: "Zutritt über NordFit Zugang",
        moreFlexible: "Mehr Flexibilität bei klarer Planung",
        maximumFreedom: "Maximale Freiheit im NordFit Modell",
        basicText:
          "Für alle, die regelmäßig trainieren möchten und bewusst den günstigsten Einstieg wählen.",
        plusText:
          "Der ausgewogene Tarif, wenn du planbar bleiben willst, aber nicht zu lange gebunden sein möchtest.",
        proText:
          "Für alle, die möglichst frei bleiben möchten und trotzdem direkt mit voller Ruhe starten wollen.",
        recommended: "Empfohlen",
        choosePlan: "Tarif wählen",
        daypassTitle: "Ein Tag. Kein Vertrag.",
        daypassText:
          "Der Tagespass ist für spontanes Training gedacht. Einmal buchen, einmal trainieren, ohne Mitgliedschaft.",
        daypassButton: "Tagespass buchen",
        daypassPrice: "4,90 € einmalig",
        daypassPanelText:
          "Ideal, wenn du NordFit erst ausprobieren möchtest oder nur für einen Tag trainieren willst.",
        finalTitle: "Weniger vergleichen. Einfach wählen.",
        finalText:
          "Jeder Tarif führt ins gleiche Studio. Der Unterschied liegt nur darin, wie viel Flexibilität du möchtest.",
        finalPrimary: "In der App starten",
        finalSecondary: "Frage stellen",
      },
    },

    en: {
      ...common.en,

      meta: {
        title: "NordFit – Home",
        description:
          "NordFit is a modern gym concept with calm design, clear structure and a premium training feel.",
      },

      home: {
        heroTitle: "Calm in space. Strong in training.",
        heroSubtitle:
          "A modern studio concept for clear flow, clean areas and training that does not feel like chaos.",
        primaryCta: "View plans",
        secondaryCta: "View location",
        heroImageAlt: "Exterior view of the planned NordFit studio",
        floatingLabel: "Planned for NordFit",
        floatingText: "Less noise. More focus.",
        feelingTitle: "Not bigger. Clearer.",
        feelingText:
          "NordFit is not meant to impress with noise. It is meant to feel ordered — a studio you understand right away and want to return to.",
        featureOneTitle: "Arrive",
        featureOneText:
          "Clear orientation from the first step. No searching, no crowding, no unnecessary process.",
        featureTwoTitle: "Train",
        featureTwoText:
          "Strength, cardio and movement should feel clearly separated without making the studio artificially large.",
        featureThreeTitle: "Cool down",
        featureThreeText:
          "After training, the feeling stays calm. No hard break, no loud exit.",
        panelOneTitle: "Strength. Without noise.",
        panelOneText:
          "The strength area should feel direct, tidy and focused. Everything you need — without an overloaded studio feel.",
        panelTwoTitle: "Cardio. Air. Movement.",
        panelTwoText:
          "Endurance and free movement need space in the room and in your head. NordFit should create exactly that open feeling.",
        panelThreeTitle: "A visit that ends cleanly.",
        panelThreeText:
          "Training does not end with the last set. A calm finish makes the visit feel more complete.",
        finalTitle: "Quiet in appearance. Clear in concept.",
        finalText:
          "Plans, location and app intentionally stay on their own pages. NordFit feels not fuller — but easier to understand.",
        finalPrimary: "View plans",
        finalSecondary: "Get in touch",
      },

      pricing: {
        heroTitle: "Three plans. One clear choice.",
        heroSubtitle:
          "Choose how flexible you want to stay. Basic, Plus and Pro differ only in term and freedom — not in the training feel.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "per month",
        basicDetailOne: "8 month minimum term",
        plusDetailOne: "6 month minimum term",
        proDetailOne: "3 month minimum term",
        cancelMonthly: "Monthly cancellation afterwards",
        accessIncluded: "Access through NordFit entry",
        moreFlexible: "More flexibility with clear planning",
        maximumFreedom: "Maximum freedom in the NordFit model",
        basicText:
          "For anyone who wants to train regularly and deliberately choose the lowest entry price.",
        plusText:
          "The balanced plan if you want structure, but do not want to be tied down for too long.",
        proText:
          "For anyone who wants maximum freedom while still starting with full calm and clarity.",
        recommended: "Recommended",
        choosePlan: "Choose plan",
        daypassTitle: "One day. No contract.",
        daypassText:
          "The day pass is made for spontaneous training. Book once, train once, without membership.",
        daypassButton: "Book day pass",
        daypassPrice: "€4.90 once",
        daypassPanelText:
          "Ideal if you want to try NordFit first or train for just one day.",
        finalTitle: "Compare less. Choose simply.",
        finalText:
          "Every plan leads to the same studio. The only difference is how much flexibility you want.",
        finalPrimary: "Start in the app",
        finalSecondary: "Ask a question",
      },
    },

    fr: {
      ...common.fr,
      meta: {
        title: "NordFit – Accueil",
        description:
          "NordFit est un concept de salle de sport moderne avec un design calme, une structure claire et une sensation premium.",
      },
      home: common.en.home || {},
      pricing: {
        heroTitle: "Trois tarifs. Un choix clair.",
        heroSubtitle:
          "Choisissez votre niveau de flexibilité. Basic, Plus et Pro diffèrent seulement par la durée et la liberté — pas par l’expérience d’entraînement.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "par mois",
        basicDetailOne: "Durée minimale de 8 mois",
        plusDetailOne: "Durée minimale de 6 mois",
        proDetailOne: "Durée minimale de 3 mois",
        cancelMonthly: "Puis résiliable chaque mois",
        accessIncluded: "Accès via NordFit",
        moreFlexible: "Plus de flexibilité avec une structure claire",
        maximumFreedom: "Liberté maximale dans le modèle NordFit",
        basicText:
          "Pour celles et ceux qui veulent s’entraîner régulièrement avec le prix d’entrée le plus bas.",
        plusText:
          "Le tarif équilibré si vous voulez rester structuré sans vous engager trop longtemps.",
        proText:
          "Pour celles et ceux qui veulent rester aussi libres que possible tout en commençant clairement.",
        recommended: "Recommandé",
        choosePlan: "Choisir",
        daypassTitle: "Un jour. Aucun contrat.",
        daypassText:
          "Le pass journalier est pensé pour un entraînement spontané. Réserver une fois, s’entraîner une fois, sans abonnement.",
        daypassButton: "Réserver le pass",
        daypassPrice: "4,90 € une fois",
        daypassPanelText:
          "Idéal pour essayer NordFit ou s’entraîner seulement une journée.",
        finalTitle: "Moins comparer. Choisir simplement.",
        finalText:
          "Chaque tarif mène au même studio. La seule différence est votre niveau de flexibilité.",
        finalPrimary: "Commencer dans l’app",
        finalSecondary: "Poser une question",
      },
    },

    es: {
      ...common.es,
      meta: {
        title: "NordFit – Inicio",
        description:
          "NordFit es un concepto de gimnasio moderno con diseño tranquilo, estructura clara y sensación premium.",
      },
      home: common.en.home || {},
      pricing: {
        heroTitle: "Tres tarifas. Una decisión clara.",
        heroSubtitle:
          "Elige cuánta flexibilidad quieres. Basic, Plus y Pro solo se diferencian en duración y libertad — no en la experiencia de entrenamiento.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "al mes",
        basicDetailOne: "8 meses de permanencia mínima",
        plusDetailOne: "6 meses de permanencia mínima",
        proDetailOne: "3 meses de permanencia mínima",
        cancelMonthly: "Después cancelación mensual",
        accessIncluded: "Acceso mediante NordFit",
        moreFlexible: "Más flexibilidad con planificación clara",
        maximumFreedom: "Máxima libertad en el modelo NordFit",
        basicText:
          "Para quienes quieren entrenar regularmente y elegir conscientemente el precio de entrada más bajo.",
        plusText:
          "La tarifa equilibrada si quieres estructura sin comprometerte demasiado tiempo.",
        proText:
          "Para quienes quieren la máxima libertad y empezar con claridad.",
        recommended: "Recomendado",
        choosePlan: "Elegir tarifa",
        daypassTitle: "Un día. Sin contrato.",
        daypassText:
          "El pase diario es para entrenar espontáneamente. Reservas una vez, entrenas una vez, sin membresía.",
        daypassButton: "Reservar pase",
        daypassPrice: "4,90 € una vez",
        daypassPanelText:
          "Ideal si quieres probar NordFit primero o entrenar solo un día.",
        finalTitle: "Compara menos. Elige simple.",
        finalText:
          "Todas las tarifas llevan al mismo estudio. La diferencia es cuánta flexibilidad quieres.",
        finalPrimary: "Empezar en la app",
        finalSecondary: "Hacer una pregunta",
      },
    },

    it: {
      ...common.it,
      meta: {
        title: "NordFit – Home",
        description:
          "NordFit è un concept di palestra moderna con design calmo, struttura chiara e sensazione premium.",
      },
      home: common.en.home || {},
      pricing: {
        heroTitle: "Tre tariffe. Una scelta chiara.",
        heroSubtitle:
          "Scegli quanta flessibilità vuoi. Basic, Plus e Pro cambiano solo per durata e libertà — non per esperienza di allenamento.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "al mese",
        basicDetailOne: "Durata minima di 8 mesi",
        plusDetailOne: "Durata minima di 6 mesi",
        proDetailOne: "Durata minima di 3 mesi",
        cancelMonthly: "Poi cancellazione mensile",
        accessIncluded: "Accesso tramite NordFit",
        moreFlexible: "Più flessibilità con pianificazione chiara",
        maximumFreedom: "Massima libertà nel modello NordFit",
        basicText:
          "Per chi vuole allenarsi regolarmente e scegliere il prezzo d’ingresso più basso.",
        plusText:
          "La tariffa equilibrata se vuoi struttura senza restare vincolato troppo a lungo.",
        proText:
          "Per chi vuole restare il più libero possibile e iniziare con chiarezza.",
        recommended: "Consigliato",
        choosePlan: "Scegli tariffa",
        daypassTitle: "Un giorno. Nessun contratto.",
        daypassText:
          "Il pass giornaliero è pensato per allenarsi spontaneamente. Prenoti una volta, ti alleni una volta, senza abbonamento.",
        daypassButton: "Prenota pass",
        daypassPrice: "4,90 € una volta",
        daypassPanelText:
          "Ideale se vuoi provare NordFit o allenarti solo per un giorno.",
        finalTitle: "Confronta meno. Scegli semplice.",
        finalText:
          "Ogni tariffa porta allo stesso studio. Cambia solo quanta flessibilità vuoi.",
        finalPrimary: "Inizia nell’app",
        finalSecondary: "Fai una domanda",
      },
    },

    pl: {
      ...common.pl,
      meta: {
        title: "NordFit – Strona główna",
        description:
          "NordFit to koncepcja nowoczesnej siłowni ze spokojnym designem, jasną strukturą i premium odczuciem treningu.",
      },
      home: common.en.home || {},
      pricing: {
        heroTitle: "Trzy karnety. Jedna jasna decyzja.",
        heroSubtitle:
          "Wybierz, jak elastycznie chcesz zostać. Basic, Plus i Pro różnią się tylko okresem i swobodą — nie odczuciem treningu.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "miesięcznie",
        basicDetailOne: "Minimalny okres 8 miesięcy",
        plusDetailOne: "Minimalny okres 6 miesięcy",
        proDetailOne: "Minimalny okres 3 miesięcy",
        cancelMonthly: "Potem wypowiedzenie miesięczne",
        accessIncluded: "Dostęp przez NordFit",
        moreFlexible: "Więcej elastyczności przy jasnym planie",
        maximumFreedom: "Maksymalna swoboda w modelu NordFit",
        basicText:
          "Dla osób, które chcą trenować regularnie i świadomie wybrać najniższy próg wejścia.",
        plusText:
          "Zrównoważony karnet, gdy chcesz mieć strukturę, ale nie wiązać się zbyt długo.",
        proText:
          "Dla osób, które chcą jak najwięcej swobody i jasnego startu.",
        recommended: "Polecany",
        choosePlan: "Wybierz karnet",
        daypassTitle: "Jeden dzień. Bez umowy.",
        daypassText:
          "Wejście dzienne jest stworzone do spontanicznego treningu. Rezerwujesz raz, trenujesz raz, bez członkostwa.",
        daypassButton: "Zarezerwuj dzień",
        daypassPrice: "4,90 € jednorazowo",
        daypassPanelText:
          "Idealne, jeśli chcesz najpierw wypróbować NordFit albo trenować tylko jeden dzień.",
        finalTitle: "Mniej porównywania. Prosty wybór.",
        finalText:
          "Każdy karnet prowadzi do tego samego studia. Różnica polega tylko na elastyczności.",
        finalPrimary: "Start w aplikacji",
        finalSecondary: "Zadaj pytanie",
      },
    },

    nl: {
      ...common.nl,
      meta: {
        title: "NordFit – Home",
        description:
          "NordFit is een modern sportschoolconcept met rustig design, duidelijke structuur en premium trainingsgevoel.",
      },
      home: common.en.home || {},
      pricing: {
        heroTitle: "Drie tarieven. Eén duidelijke keuze.",
        heroSubtitle:
          "Kies hoeveel flexibiliteit je wilt. Basic, Plus en Pro verschillen alleen in looptijd en vrijheid — niet in trainingsgevoel.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "per maand",
        basicDetailOne: "8 maanden minimale looptijd",
        plusDetailOne: "6 maanden minimale looptijd",
        proDetailOne: "3 maanden minimale looptijd",
        cancelMonthly: "Daarna maandelijks opzegbaar",
        accessIncluded: "Toegang via NordFit",
        moreFlexible: "Meer flexibiliteit met duidelijke planning",
        maximumFreedom: "Maximale vrijheid in het NordFit-model",
        basicText:
          "Voor iedereen die regelmatig wil trainen en bewust de laagste instapprijs kiest.",
        plusText:
          "Het gebalanceerde tarief als je structuur wilt zonder te lang vast te zitten.",
        proText:
          "Voor iedereen die zo vrij mogelijk wil blijven en toch helder wil starten.",
        recommended: "Aanbevolen",
        choosePlan: "Kies tarief",
        daypassTitle: "Eén dag. Geen contract.",
        daypassText:
          "De dagpas is gemaakt voor spontaan trainen. Eén keer boeken, één keer trainen, zonder lidmaatschap.",
        daypassButton: "Dagpas boeken",
        daypassPrice: "€ 4,90 eenmalig",
        daypassPanelText:
          "Ideaal als je NordFit eerst wilt proberen of slechts één dag wilt trainen.",
        finalTitle: "Minder vergelijken. Gewoon kiezen.",
        finalText:
          "Elk tarief leidt naar dezelfde studio. Het verschil is alleen hoeveel flexibiliteit je wilt.",
        finalPrimary: "Start in de app",
        finalSecondary: "Stel een vraag",
      },
    },

    sv: {
      ...common.sv,
      meta: {
        title: "NordFit – Hem",
        description:
          "NordFit är ett modernt gymkoncept med lugn design, tydlig struktur och premiumkänsla.",
      },
      home: common.en.home || {},
      pricing: {
        heroTitle: "Tre priser. Ett tydligt val.",
        heroSubtitle:
          "Välj hur flexibel du vill vara. Basic, Plus och Pro skiljer sig bara i bindningstid och frihet — inte i träningskänslan.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "per månad",
        basicDetailOne: "8 månaders bindningstid",
        plusDetailOne: "6 månaders bindningstid",
        proDetailOne: "3 månaders bindningstid",
        cancelMonthly: "Därefter månadsvis uppsägning",
        accessIncluded: "Tillgång via NordFit",
        moreFlexible: "Mer flexibilitet med tydlig planering",
        maximumFreedom: "Maximal frihet i NordFit-modellen",
        basicText:
          "För dig som vill träna regelbundet och välja den lägsta startnivån.",
        plusText:
          "Det balanserade valet om du vill ha struktur utan att vara bunden för länge.",
        proText:
          "För dig som vill vara så fri som möjligt och ändå börja tydligt.",
        recommended: "Rekommenderad",
        choosePlan: "Välj pris",
        daypassTitle: "En dag. Inget avtal.",
        daypassText:
          "Dagspasset är gjort för spontan träning. Boka en gång, träna en gång, utan medlemskap.",
        daypassButton: "Boka dagspass",
        daypassPrice: "4,90 € en gång",
        daypassPanelText:
          "Perfekt om du vill prova NordFit först eller träna bara en dag.",
        finalTitle: "Jämför mindre. Välj enklare.",
        finalText:
          "Alla priser leder till samma studio. Skillnaden är hur mycket flexibilitet du vill ha.",
        finalPrimary: "Starta i appen",
        finalSecondary: "Ställ en fråga",
      },
    },

    da: {
      ...common.da,
      meta: {
        title: "NordFit – Hjem",
        description:
          "NordFit er et moderne fitnesskoncept med roligt design, klar struktur og premium træningsfølelse.",
      },
      home: common.en.home || {},
      pricing: {
        heroTitle: "Tre priser. Ét klart valg.",
        heroSubtitle:
          "Vælg hvor fleksibel du vil være. Basic, Plus og Pro adskiller sig kun i løbetid og frihed — ikke i træningsfølelse.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "pr. måned",
        basicDetailOne: "8 måneders minimumsperiode",
        plusDetailOne: "6 måneders minimumsperiode",
        proDetailOne: "3 måneders minimumsperiode",
        cancelMonthly: "Derefter månedlig opsigelse",
        accessIncluded: "Adgang via NordFit",
        moreFlexible: "Mere fleksibilitet med klar planlægning",
        maximumFreedom: "Maksimal frihed i NordFit-modellen",
        basicText:
          "Til dig, der vil træne regelmæssigt og vælge den laveste startpris.",
        plusText:
          "Den balancerede pris, hvis du vil have struktur uden at binde dig for længe.",
        proText:
          "Til dig, der vil være så fri som muligt og stadig starte klart.",
        recommended: "Anbefalet",
        choosePlan: "Vælg pris",
        daypassTitle: "Én dag. Ingen kontrakt.",
        daypassText:
          "Dagspasset er lavet til spontan træning. Book én gang, træn én gang, uden medlemskab.",
        daypassButton: "Book dagspas",
        daypassPrice: "4,90 € én gang",
        daypassPanelText:
          "Ideelt, hvis du vil prøve NordFit først eller træne kun én dag.",
        finalTitle: "Sammenlign mindre. Vælg enkelt.",
        finalText:
          "Alle priser fører til samme studio. Forskellen er kun, hvor fleksibel du vil være.",
        finalPrimary: "Start i appen",
        finalSecondary: "Stil et spørgsmål",
      },
    },

    no: {
      ...common.no,
      meta: {
        title: "NordFit – Hjem",
        description:
          "NordFit er et moderne treningskonsept med rolig design, tydelig struktur og premium treningsfølelse.",
      },
      home: common.en.home || {},
      pricing: {
        heroTitle: "Tre priser. Ett tydelig valg.",
        heroSubtitle:
          "Velg hvor fleksibel du vil være. Basic, Plus og Pro skiller seg bare i bindingstid og frihet — ikke i treningsfølelse.",
        basicLabel: "Basic",
        plusLabel: "Plus",
        proLabel: "Pro",
        perMonth: "per måned",
        basicDetailOne: "8 måneders bindingstid",
        plusDetailOne: "6 måneders bindingstid",
        proDetailOne: "3 måneders bindingstid",
        cancelMonthly: "Deretter månedlig oppsigelse",
        accessIncluded: "Tilgang via NordFit",
        moreFlexible: "Mer fleksibilitet med tydelig plan",
        maximumFreedom: "Maksimal frihet i NordFit-modellen",
        basicText:
          "For deg som vil trene regelmessig og velge den laveste inngangsprisen.",
        plusText:
          "Den balanserte prisen hvis du vil ha struktur uten å binde deg for lenge.",
        proText:
          "For deg som vil være så fri som mulig og likevel starte tydelig.",
        recommended: "Anbefalt",
        choosePlan: "Velg pris",
        daypassTitle: "Én dag. Ingen kontrakt.",
        daypassText:
          "Dagspasset er laget for spontan trening. Bestill én gang, tren én gang, uten medlemskap.",
        daypassButton: "Bestill dagspass",
        daypassPrice: "4,90 € én gang",
        daypassPanelText:
          "Perfekt hvis du vil prøve NordFit først eller bare trene én dag.",
        finalTitle: "Sammenlign mindre. Velg enkelt.",
        finalText:
          "Alle priser fører til samme studio. Forskjellen er bare hvor fleksibel du vil være.",
        finalPrimary: "Start i appen",
        finalSecondary: "Still et spørsmål",
      },
    },
  };

  applyLanguage(getSavedLanguage());

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
});
