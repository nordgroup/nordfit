/* =========================
   NordFit translations.js
   Stable data-i18n system
   Support: index.html + mitgliedschaften.html + standorte.html + app.html
   Full content: DE + EN
   Other languages: nav/footer + EN content fallback
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const supportedLanguages = ["de", "en", "fr", "es", "it", "pl", "nl", "sv", "da", "no"];
  const defaultLanguage = "de";
  const contentFallbackLanguage = "en";

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

  function deepMerge(...objects) {
    const output = {};

    objects.forEach((object) => {
      if (!object || typeof object !== "object") return;

      Object.entries(object).forEach(([key, value]) => {
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          output[key] &&
          typeof output[key] === "object" &&
          !Array.isArray(output[key])
        ) {
          output[key] = deepMerge(output[key], value);
        } else {
          output[key] = value;
        }
      });
    });

    return output;
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

  function getDictionary(lang) {
    const safeLang = getSafeLanguage(lang);

    const fallbackContent = pageContent[contentFallbackLanguage] || {};
    const selectedContent = pageContent[safeLang] || {};
    const selectedCommon = common[safeLang] || common[defaultLanguage];

    return deepMerge(fallbackContent, selectedContent, selectedCommon);
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
    const dictionary = getDictionary(safeLang);

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

  const pageContent = {
    de: {
      meta: {
        title: "NordFit",
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

      locations: {
        heroTitle: "Grevesmühlen. Klarer Startpunkt.",
        heroSubtitle:
          "Der erste NordFit Standort soll ruhig erreichbar sein, sauber wirken und ohne Umwege verstanden werden.",
        primaryCta: "Karte ansehen",
        secondaryCta: "Frage stellen",

        imageLabel: "Studio Außenansicht",
        floatingLabel: "Geplanter Standort",
        floatingText: "Grevesmühlen",

        feelingTitle: "Gut erreichbar. Nicht überladen.",
        feelingText:
          "NordFit soll nicht wie ein lauter Fitness-Tempel wirken. Der Standort soll klar sein: ankommen, Zugang öffnen, trainieren, fertig.",

        featureOneTitle: "Ort",
        featureOneText:
          "Grevesmühlen als ruhiger Startpunkt zwischen Alltag, Erreichbarkeit und nordischem Gefühl.",
        featureTwoTitle: "Zugang",
        featureTwoText:
          "Der Besuch soll einfach bleiben. Kein komplizierter Ablauf, kein unnötiger Empfangsweg.",
        featureThreeTitle: "Eindruck",
        featureThreeText:
          "Modern, ruhig und sauber. Der Standort soll direkt nach NordFit wirken — nicht beliebig.",

        mapTitle: "Standort finden.",
        mapText:
          "Die genaue Adresse wird ergänzt, sobald der Standort final feststeht. Bis dahin bleibt Grevesmühlen als geplanter Bereich sichtbar.",
        addressLabel: "Adresse",
        addressValue: "(Straße) (Hausnummer), (PLZ) Grevesmühlen",
        accessLabel: "Zugang",
        accessValue: "Digital über NordFit Zugang",
        cityLabel: "Standort",
        cityValue: "Grevesmühlen",
        mapIframeTitle: "NordFit Standort Karte",
        openIn: "ÖFFNEN IN",
        appleMaps: "Apple Karten",
        googleMaps: "Google Maps",

        finalTitle: "Ein Standort soll sich richtig anfühlen.",
        finalText:
          "Für NordFit zählt nicht nur die Adresse. Wichtig ist, dass der Ort zum Konzept passt: ruhig, verständlich und gut erreichbar.",
        finalPrimary: "Tarife ansehen",
        finalSecondary: "Kontakt aufnehmen",
      },

      appPage: {
        heroTitle: "Ein Zugang. Alles drin.",
        heroSubtitle:
          "Die NordFit App ist der ruhige Mittelpunkt: Mitgliedschaft, Tagespass und QR-Code-Zutritt an einem Ort.",

        appStoreSmall: "LADEN IM",
        appStoreBig: "App Store",
        googlePlaySmall: "JETZT BEI",
        googlePlayBig: "Google Play",

        appImageAlt: "Ansicht der NordFit App",
        floatingLabel: "NordFit Zugang",
        floatingText: "Digital. Direkt. Übersichtlich.",

        feelingTitle: "Weniger Wege. Mehr Überblick.",
        feelingText:
          "Die App soll nicht kompliziert wirken. Sie soll genau das bündeln, was du brauchst — und alles andere weglassen.",

        featureOneTitle: "Zugang",
        featureOneText:
          "Dein QR-Code liegt direkt in der App. Öffnen, scannen, trainieren.",
        featureTwoTitle: "Mitgliedschaft",
        featureTwoText:
          "Tarif abschließen, Daten prüfen und alles sauber an einem Ort behalten.",
        featureThreeTitle: "Tagespass",
        featureThreeText:
          "Spontan trainieren, ohne Vertrag. Einmal buchen, einmal nutzen.",

        panelTitle: "Alles, was Zugang braucht.",
        panelText:
          "NordFit bleibt bewusst digital. Nicht, weil es technisch wirken soll — sondern weil ein klarer Ablauf einfacher ist.",

        finalTitle: "Einfach starten. Ohne Papier.",
        finalText:
          "Mitgliedschaft und Tagespass führen über die App. So bleibt der Einstieg klar und der Zugang direkt.",
        finalPrimary: "Tarife ansehen",
        finalSecondary: "Frage stellen",
      },
    },

    en: {
      meta: {
        title: "NordFit",
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

      locations: {
        heroTitle: "Grevesmühlen. A clear starting point.",
        heroSubtitle:
          "The first NordFit location should be easy to reach, feel clean and make sense without extra explanation.",
        primaryCta: "View map",
        secondaryCta: "Ask a question",

        imageLabel: "Studio exterior",
        floatingLabel: "Planned location",
        floatingText: "Grevesmühlen",

        feelingTitle: "Easy to reach. Not overloaded.",
        feelingText:
          "NordFit should not feel like a loud fitness temple. The location should be simple: arrive, open access, train, done.",

        featureOneTitle: "Place",
        featureOneText:
          "Grevesmühlen as a calm starting point between everyday life, accessibility and a northern feel.",
        featureTwoTitle: "Access",
        featureTwoText:
          "The visit should stay simple. No complicated process, no unnecessary reception route.",
        featureThreeTitle: "Impression",
        featureThreeText:
          "Modern, calm and clean. The location should feel like NordFit right away — not generic.",

        mapTitle: "Find the location.",
        mapText:
          "The exact address will be added once the location is final. Until then, Grevesmühlen remains visible as the planned area.",
        addressLabel: "Address",
        addressValue: "(Street) (Number), (ZIP) Grevesmühlen",
        accessLabel: "Access",
        accessValue: "Digital through NordFit access",
        cityLabel: "Location",
        cityValue: "Grevesmühlen",
        mapIframeTitle: "NordFit location map",
        openIn: "OPEN IN",
        appleMaps: "Apple Maps",
        googleMaps: "Google Maps",

        finalTitle: "A location should feel right.",
        finalText:
          "For NordFit, the address is not the only thing that matters. The place has to fit the concept: calm, understandable and easy to reach.",
        finalPrimary: "View plans",
        finalSecondary: "Get in touch",
      },

      appPage: {
        heroTitle: "One access. Everything inside.",
        heroSubtitle:
          "The NordFit app is the calm center: membership, day pass and QR entry in one place.",

        appStoreSmall: "DOWNLOAD ON THE",
        appStoreBig: "App Store",
        googlePlaySmall: "GET IT ON",
        googlePlayBig: "Google Play",

        appImageAlt: "View of the NordFit app",
        floatingLabel: "NordFit access",
        floatingText: "Digital. Direct. Clear.",

        feelingTitle: "Fewer steps. More overview.",
        feelingText:
          "The app should not feel complicated. It should bring together exactly what you need — and leave out everything else.",

        featureOneTitle: "Access",
        featureOneText:
          "Your QR code lives directly in the app. Open, scan, train.",
        featureTwoTitle: "Membership",
        featureTwoText:
          "Choose your plan, check your details and keep everything neatly in one place.",
        featureThreeTitle: "Day pass",
        featureThreeText:
          "Train spontaneously, without a contract. Book once, use once.",

        panelTitle: "Everything access needs.",
        panelText:
          "NordFit stays intentionally digital. Not to feel technical — but because a clear flow is simpler.",

        finalTitle: "Start simply. Without paper.",
        finalText:
          "Membership and day pass run through the app. That keeps the start clear and access direct.",
        finalPrimary: "View plans",
        finalSecondary: "Ask a question",
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
