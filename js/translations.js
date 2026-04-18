/* =========================
   NordFit translations.js
   Simple page translation system
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const supportedLanguages = ["de", "en", "fr", "it", "es"];
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
    };

    const metaDescriptionMap = {
      de: "NordFit – modernes Fitnessstudio mit klarer Atmosphäre, hochwertigen Trainingsbereichen und ruhigem Premium-Design.",
      en: "NordFit – a modern gym with a clear atmosphere, premium training areas and a calm high-end design.",
      fr: "NordFit – une salle de sport moderne avec une ambiance claire, des zones premium et un design haut de gamme apaisant.",
      it: "NordFit – palestra moderna con atmosfera pulita, aree premium e design elegante e tranquillo.",
      es: "NordFit – gimnasio moderno con ambiente claro, zonas premium y un diseño tranquilo y elegante.",
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
    index: { de: {}, en: {}, fr: {}, it: {}, es: {} },
    mitgliedschaften: { de: {}, en: {}, fr: {}, it: {}, es: {} },
    standorte: { de: {}, en: {}, fr: {}, it: {}, es: {} },
    app: { de: {}, en: {}, fr: {}, it: {}, es: {} },
    hausordnung: { de: {}, en: {}, fr: {}, it: {}, es: {} },
    kontakt: { de: {}, en: {}, fr: {}, it: {}, es: {} },
    impressum: { de: {}, en: {}, fr: {}, it: {}, es: {} }
  };
});
