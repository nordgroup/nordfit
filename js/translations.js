/* =========================
   NordFit translations.js
   Simple page translation system
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const supportedLanguages = ["de", "en", "fr", "it", "es", "pl"];
  const defaultLanguage = "de";

  const langOptions = document.querySelectorAll(".lang-option");
  const langToggleLabel = document.querySelector(".lang-toggle-label");

  const pageKey = getPageKey();
  const savedLanguage = getSavedLanguage();
  const activeLanguage = supportedLanguages.includes(savedLanguage)
    ? savedLanguage
    : defaultLanguage;

  applyLanguage(activeLanguage);

  langOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const nextLang = option.dataset.lang?.trim().toLowerCase();

      if (!nextLang || !supportedLanguages.includes(nextLang)) return;

      localStorage.setItem("nordfit-language", nextLang);
      applyLanguage(nextLang);
    });
  });

  function getSavedLanguage() {
    try {
      return localStorage.getItem("nordfit-language") || defaultLanguage;
    } catch {
      return defaultLanguage;
    }
  }

  function getPageKey() {
    const path = window.location.pathname.toLowerCase();

    if (path.endsWith("/mitgliedschaften.html") || path.includes("mitgliedschaften")) {
      return "mitgliedschaften";
    }

    if (path.endsWith("/standorte.html") || path.includes("standorte")) {
      return "standorte";
    }

    if (path.endsWith("/app.html") || path.includes("/app")) {
      return "app";
    }

    if (path.endsWith("/hausordnung.html") || path.includes("hausordnung")) {
      return "hausordnung";
    }

    if (path.endsWith("/kontakt.html") || path.includes("kontakt")) {
      return "kontakt";
    }

    if (path.endsWith("/impressum.html") || path.includes("impressum")) {
      return "impressum";
    }

    return "index";
  }

  function applyLanguage(lang) {
    updateLangLabel(lang);
    updateDocumentLanguage(lang);

    const pageTranslations = translations[pageKey];
    if (!pageTranslations) return;

    const dictionary = pageTranslations[lang] || pageTranslations[defaultLanguage];
    if (!dictionary) return;

    Object.entries(dictionary).forEach(([selector, value]) => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;

      elements.forEach((element) => {
        if (typeof value === "string") {
          element.innerHTML = value;
          return;
        }

        if (typeof value !== "object" || value === null) return;

        if ("text" in value) {
          element.textContent = value.text;
        }

        if ("html" in value) {
          element.innerHTML = value.html;
        }

        if ("placeholder" in value && "placeholder" in element) {
          element.placeholder = value.placeholder;
        }

        if ("ariaLabel" in value) {
          element.setAttribute("aria-label", value.ariaLabel);
        }

        if ("content" in value) {
          element.setAttribute("content", value.content);
        }
      });
    });
  }

  function updateLangLabel(lang) {
    if (!langToggleLabel) return;
    langToggleLabel.textContent = lang.toUpperCase();
  }

  function updateDocumentLanguage(lang) {
    document.documentElement.lang = lang;

    const titleMap = {
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
        app: "NordFit – Application",
        hausordnung: "NordFit – Règlement",
        kontakt: "NordFit – Contact",
        impressum: "NordFit – Mentions légales",
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
      es: {
        index: "NordFit – Inicio",
        mitgliedschaften: "NordFit – Membresías",
        standorte: "NordFit – Ubicaciones",
        app: "NordFit – App",
        hausordnung: "NordFit – Normas",
        kontakt: "NordFit – Contacto",
        impressum: "NordFit – Aviso legal",
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
    };

    const metaDescriptionMap = {
      de: "NordFit – modernes Fitnessstudio mit klarer Atmosphäre, hochwertigen Trainingsbereichen und ruhigem Premium-Design.",
      en: "NordFit – a modern gym with a clear atmosphere, premium training areas and a calm high-end design.",
      fr: "NordFit – une salle de sport moderne avec une ambiance claire, des zones premium et un design haut de gamme apaisant.",
      it: "NordFit – palestra moderna con atmosfera pulita, aree premium e design elegante e tranquillo.",
      es: "NordFit – gimnasio moderno con ambiente claro, zonas premium y un diseño tranquilo y elegante.",
      pl: "NordFit – nowoczesna siłownia z uporządkowaną atmosferą, strefami premium i spokojnym designem.",
    };

    const titleValue = titleMap[lang]?.[pageKey];
    if (titleValue) {
      document.title = titleValue;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && metaDescriptionMap[lang]) {
      metaDescription.setAttribute("content", metaDescriptionMap[lang]);
    }
  }

  const translations = {
    index: {
      de: {
        ".nav-link:nth-of-type(1)": { text: "Startseite" },
        ".nav-link:nth-of-type(2)": { text: "Tarife" },
        ".nav-link:nth-of-type(3)": { text: "Standorte" },
        ".nav-link:nth-of-type(4)": { text: "App" },
        ".nav-link:nth-of-type(5)": { text: "Hausordnung" },
        ".nav-link:nth-of-type(6)": { text: "Kontakt" },

        ".home-hero .eyebrow": { text: "NordFit Studio" },
        ".home-hero .hero-title": { html: "Ein Studio, das modern wirkt. Und ruhig bleibt." },
        ".home-hero .hero-subtitle": {
          html: "NordFit verbindet klare Räume, hochwertige Trainingsbereiche und eine Atmosphäre, die ruhig, modern und fokussiert wirkt."
        },

        ".hero-actions a:nth-child(1)": { text: "Mitgliedschaften" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Standorte" },

        ".hero-image-caption h2": { text: "Ein erster Eindruck, der Haltung zeigt." },
        ".hero-image-caption p": {
          html: "Schon von außen soll NordFit modern, hochwertig und ruhig wirken — nicht überladen, nicht beliebig, sondern klar, durchdacht und einladend."
        },

        ".area-headline-block h2": { text: "Für jeden Fokus ein geeigneter Bereich." },
        ".area-headline-block p": {
          html: "NordFit denkt nicht in einem einzigen Raum voller Geräte, sondern in klaren Zonen. So entsteht ein Studio, das strukturierter, ruhiger und hochwertiger wirkt."
        },

        ".area-section:nth-of-type(1) .eyebrow": { text: "Kraftsport" },
        ".area-section:nth-of-type(1) h3": { text: "Krafttraining mit Ruhe und Konzentration." },
        ".area-section:nth-of-type(1) .muted": {
          html: "Freie Gewichte, Maschinen und klar gegliederte Flächen schaffen einen Bereich, in dem fokussiertes Krafttraining im Mittelpunkt steht — ohne unnötige Unruhe."
        },

        ".area-section:nth-of-type(2) .eyebrow": { text: "Ausdauer" },
        ".area-section:nth-of-type(2) h3": { text: "Bewegung mit Weite und Überblick." },
        ".area-section:nth-of-type(2) .muted": {
          html: "Laufbänder, Fahrräder und Ausdauergeräte sind so angeordnet, dass der Bereich offen, klar und leicht wirkt — für ein Training mit Rhythmus und Ruhe."
        },

        ".area-section:nth-of-type(3) .eyebrow": { text: "Bewegung" },
        ".area-section:nth-of-type(3) h3": { text: "Freie Übungen und echte Dynamik." },
        ".area-section:nth-of-type(3) .muted": {
          html: "Dieser Bereich gibt Raum für Mobilität, freie Übungen und funktionelle Bewegungen — offen gedacht, klar strukturiert und nicht unnötig vollgestellt."
        },

        ".area-section:nth-of-type(4) .eyebrow": { text: "Regeneration" },
        ".area-section:nth-of-type(4) h3": { text: "Ruhiger aus dem Training heraus." },
        ".area-section:nth-of-type(4) .muted": {
          html: "Auch der Abschluss einer Einheit soll sich gut anfühlen. Deshalb gehört zu NordFit ein Bereich, der bewusst Ruhe, Erholung und einen klaren Ausklang ermöglicht."
        },

        ".section:last-of-type .eyebrow": { text: "NordFit Gefühl" },
        ".section:last-of-type h2": { text: "Weniger Lärm. Mehr Training." },
        ".section:last-of-type p.muted": {
          html: "Die Startseite soll nicht alles erklären. Sie soll zeigen, wie sich NordFit anfühlt — klar, ruhig und hochwertig."
        },

        ".footer-links a:nth-child(1)": { text: "Impressum / AGB / Datenschutz" },
        ".footer-links a:nth-child(2)": { text: "Hausordnung" },
        ".footer-links a:nth-child(3)": { text: "Kontakt" },
        ".footer-links a:nth-child(4)": { text: "Instagram" }
      },

      en: {
        ".nav-link:nth-of-type(1)": { text: "Home" },
        ".nav-link:nth-of-type(2)": { text: "Memberships" },
        ".nav-link:nth-of-type(3)": { text: "Locations" },
        ".nav-link:nth-of-type(4)": { text: "App" },
        ".nav-link:nth-of-type(5)": { text: "House Rules" },
        ".nav-link:nth-of-type(6)": { text: "Contact" },

        ".home-hero .eyebrow": { text: "NordFit Studio" },
        ".home-hero .hero-title": { html: "A studio that feels modern. And stays calm." },
        ".home-hero .hero-subtitle": {
          html: "NordFit combines clear spaces, premium training areas and an atmosphere that feels calm, modern and focused."
        },

        ".hero-actions a:nth-child(1)": { text: "Memberships" },
        ".hero-actions a:nth-child(2)": { text: "App" },
        ".hero-actions a:nth-child(3)": { text: "Locations" },

        ".hero-image-caption h2": { text: "A first impression that shows intention." },
        ".hero-image-caption p": {
          html: "From the outside, NordFit should already feel modern, premium and calm — not overloaded, not generic, but clear, thoughtful and inviting."
        },

        ".area-headline-block h2": { text: "A dedicated area for every focus." },
        ".area-headline-block p": {
          html: "NordFit is not built as one room full of equipment, but as a studio with clearly defined zones. That creates a more structured, calmer and more premium feeling."
        },

        ".area-section:nth-of-type(1) .eyebrow": { text: "Strength" },
        ".area-section:nth-of-type(1) h3": { text: "Strength training with calm and concentration." },
        ".area-section:nth-of-type(1) .muted": {
          html: "Free weights, machines and clearly structured layouts create an area where focused strength training stays at the center — without unnecessary visual noise."
        },

        ".area-section:nth-of-type(2) .eyebrow": { text: "Cardio" },
        ".area-section:nth-of-type(2) h3": { text: "Movement with openness and overview." },
        ".area-section:nth-of-type(2) .muted": {
          html: "Treadmills, bikes and endurance machines are arranged in a way that feels open, clear and light — for training with rhythm and calm."
        },

        ".area-section:nth-of-type(3) .eyebrow": { text: "Movement" },
        ".area-section:nth-of-type(3) h3": { text: "Free exercises and real dynamics." },
        ".area-section:nth-of-type(3) .muted": {
          html: "This area gives space to mobility, free exercises and functional movement — open in concept, clearly structured and intentionally not overcrowded."
        },

        ".area-section:nth-of-type(4) .eyebrow": { text: "Recovery" },
        ".area-section:nth-of-type(4) h3": { text: "Leaving training in a calmer way." },
        ".area-section:nth-of-type(4) .muted": {
          html: "The end of a session should feel good too. That is why NordFit includes a space intentionally designed for calm, recovery and a clear finish."
        },

        ".section:last-of-type .eyebrow": { text: "NordFit Feeling" },
        ".section:last-of-type h2": { text: "Less noise. More training." },
        ".section:last-of-type p.muted": {
          html: "The homepage should not explain everything. It should show how NordFit feels — clear, calm and premium."
        },

        ".footer-links a:nth-child(1)": { text: "Legal / Terms / Privacy" },
        ".footer-links a:nth-child(2)": { text: "House Rules" },
        ".footer-links a:nth-child(3)": { text: "Contact" },
        ".footer-links a:nth-child(4)": { text: "Instagram" }
      },

      fr: {},
      it: {},
      es: {},
      pl: {}
    },

    mitgliedschaften: {
      de: {},
      en: {},
      fr: {},
      it: {},
      es: {},
      pl: {}
    },

    standorte: {
      de: {},
      en: {},
      fr: {},
      it: {},
      es: {},
      pl: {}
    },

    app: {
      de: {},
      en: {},
      fr: {},
      it: {},
      es: {},
      pl: {}
    },

    hausordnung: {
      de: {},
      en: {},
      fr: {},
      it: {},
      es: {},
      pl: {}
    },

    kontakt: {
      de: {},
      en: {},
      fr: {},
      it: {},
      es: {},
      pl: {}
    },

    impressum: {
      de: {},
      en: {},
      fr: {},
      it: {},
      es: {},
      pl: {}
    }
  };
});
