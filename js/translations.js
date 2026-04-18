/* =========================
   NordFit translations.js
   Stable translation system
   Languages:
   de, en, fr, es, it, pl, nl, sv, da, no
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const supportedLanguages = ["de", "en", "fr", "es", "it", "pl", "nl", "sv", "da", "no"];
  const defaultLanguage = "de";

  const langOptions = Array.from(document.querySelectorAll(".lang-option"));
  const langToggleLabel = document.querySelector(".lang-toggle-label");

  const pageKey = getPageKey();
  const savedLanguage = getSavedLanguage();
  const activeLanguage = supportedLanguages.includes(savedLanguage)
    ? savedLanguage
    : defaultLanguage;

  bindLanguageEvents();
  applyLanguage(activeLanguage);

  function bindLanguageEvents() {
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
  }

  function getSavedLanguage() {
    try {
      return localStorage.getItem("nordfit-language") || defaultLanguage;
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

  function resolveElements(selector) {
    const nthMatch = selector.match(/^(.*):nth-of-type\((\d+)\)$/);

    if (!nthMatch) {
      return Array.from(document.querySelectorAll(selector));
    }

    const baseSelector = nthMatch[1].trim();
    const index = Number.parseInt(nthMatch[2], 10) - 1;

    if (!baseSelector || Number.isNaN(index) || index < 0) return [];

    const elements = Array.from(document.querySelectorAll(baseSelector));
    return elements[index] ? [elements[index]] : [];
  }

  function setValue(element, value) {
    if (typeof value === "string") {
      element.innerHTML = value;
      return;
    }

    if (typeof value !== "object" || value === null) return;

    if ("text" in value) element.textContent = value.text;
    if ("html" in value) element.innerHTML = value.html;

    if ("placeholder" in value && "placeholder" in element) {
      element.placeholder = value.placeholder;
    }

    if ("ariaLabel" in value) {
      element.setAttribute("aria-label", value.ariaLabel);
    }

    if ("content" in value) {
      element.setAttribute("content", value.content);
    }
  }

  function updateLangLabel(lang) {
    if (!langToggleLabel) return;
    langToggleLabel.textContent = lang.toUpperCase();
  }

  function updateLanguageOptionState(lang) {
    langOptions.forEach((option) => {
      const optionLang = option.dataset.lang?.trim().toLowerCase() || "";
      const isActive = optionLang === lang;

      option.classList.toggle("is-active", isActive);
      option.classList.toggle("is-selected", isActive);
      option.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function updateDocumentLanguage(lang) {
    document.documentElement.lang = lang;

    const titleValue = pageTitles[lang]?.[pageKey] || pageTitles[defaultLanguage]?.[pageKey];
    if (titleValue) {
      document.title = titleValue;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionValue =
      metaDescriptions[lang]?.[pageKey] || metaDescriptions[defaultLanguage]?.[pageKey];

    if (metaDescription && descriptionValue) {
      metaDescription.setAttribute("content", descriptionValue);
    }
  }

  function applyLanguage(lang) {
    updateLangLabel(lang);
    updateLanguageOptionState(lang);
    updateDocumentLanguage(lang);

    const common = commonTranslations[lang] || commonTranslations[defaultLanguage] || {};
    const page = pageTranslations[pageKey]?.[lang]
      || pageTranslations[pageKey]?.[defaultLanguage]
      || {};

    const dictionary = { ...common, ...page };

    Object.entries(dictionary).forEach(([selector, value]) => {
      const elements = resolveElements(selector);
      if (!elements.length) return;

      elements.forEach((element) => setValue(element, value));
    });
  }

  const languageMenuLabels = {
    de: ["Deutsch", "English", "Français", "Español", "Italiano", "Polski", "Nederlands", "Svenska", "Dansk", "Norsk"],
    en: ["German", "English", "French", "Spanish", "Italian", "Polish", "Dutch", "Swedish", "Danish", "Norwegian"],
    fr: ["Allemand", "Anglais", "Français", "Espagnol", "Italien", "Polonais", "Néerlandais", "Suédois", "Danois", "Norvégien"],
    es: ["Alemán", "Inglés", "Francés", "Español", "Italiano", "Polaco", "Neerlandés", "Sueco", "Danés", "Noruego"],
    it: ["Tedesco", "Inglese", "Francese", "Spagnolo", "Italiano", "Polacco", "Olandese", "Svedese", "Danese", "Norvegese"],
    pl: ["Niemiecki", "Angielski", "Francuski", "Hiszpański", "Włoski", "Polski", "Niderlandzki", "Szwedzki", "Duński", "Norweski"],
    nl: ["Duits", "Engels", "Frans", "Spaans", "Italiaans", "Pools", "Nederlands", "Zweeds", "Deens", "Noors"],
    sv: ["Tyska", "Engelska", "Franska", "Spanska", "Italienska", "Polska", "Nederländska", "Svenska", "Danska", "Norska"],
    da: ["Tysk", "Engelsk", "Fransk", "Spansk", "Italiensk", "Polsk", "Nederlandsk", "Svensk", "Dansk", "Norsk"],
    no: ["Tysk", "Engelsk", "Fransk", "Spansk", "Italiensk", "Polsk", "Nederlandsk", "Svensk", "Dansk", "Norsk"]
  };

  const navLabels = {
    de: ["Startseite", "Tarife", "Standorte", "App", "Hausordnung", "Kontakt"],
    en: ["Home", "Memberships", "Locations", "App", "House Rules", "Contact"],
    fr: ["Accueil", "Abonnements", "Sites", "App", "Règlement", "Contact"],
    es: ["Inicio", "Membresías", "Ubicaciones", "App", "Normas", "Contacto"],
    it: ["Home", "Abbonamenti", "Sedi", "App", "Regolamento", "Contatto"],
    pl: ["Start", "Karnety", "Lokalizacje", "Aplikacja", "Regulamin", "Kontakt"],
    nl: ["Home", "Lidmaatschappen", "Locaties", "App", "Huisregels", "Contact"],
    sv: ["Hem", "Medlemskap", "Platser", "App", "Regler", "Kontakt"],
    da: ["Hjem", "Medlemskaber", "Lokationer", "App", "Husregler", "Kontakt"],
    no: ["Hjem", "Medlemskap", "Lokasjoner", "App", "Husregler", "Kontakt"]
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
    no: ["Juridisk / Vilkår / Personvern", "Husregler", "Kontakt", "Instagram"]
  };

  const pageTitles = {
    de: {
      index: "NordFit – Startseite",
      mitgliedschaften: "NordFit – Tarife",
      standorte: "NordFit – Standorte",
      app: "NordFit – App",
      hausordnung: "NordFit – Hausordnung",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Impressum"
    },
    en: {
      index: "NordFit – Home",
      mitgliedschaften: "NordFit – Memberships",
      standorte: "NordFit – Locations",
      app: "NordFit – App",
      hausordnung: "NordFit – House Rules",
      kontakt: "NordFit – Contact",
      impressum: "NordFit – Legal"
    },
    fr: {
      index: "NordFit – Accueil",
      mitgliedschaften: "NordFit – Abonnements",
      standorte: "NordFit – Sites",
      app: "NordFit – App",
      hausordnung: "NordFit – Règlement",
      kontakt: "NordFit – Contact",
      impressum: "NordFit – Mentions légales"
    },
    es: {
      index: "NordFit – Inicio",
      mitgliedschaften: "NordFit – Membresías",
      standorte: "NordFit – Ubicaciones",
      app: "NordFit – App",
      hausordnung: "NordFit – Normas",
      kontakt: "NordFit – Contacto",
      impressum: "NordFit – Aviso legal"
    },
    it: {
      index: "NordFit – Home",
      mitgliedschaften: "NordFit – Abbonamenti",
      standorte: "NordFit – Sedi",
      app: "NordFit – App",
      hausordnung: "NordFit – Regolamento",
      kontakt: "NordFit – Contatto",
      impressum: "NordFit – Note legali"
    },
    pl: {
      index: "NordFit – Strona główna",
      mitgliedschaften: "NordFit – Karnety",
      standorte: "NordFit – Lokalizacje",
      app: "NordFit – Aplikacja",
      hausordnung: "NordFit – Regulamin",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Informacje prawne"
    },
    nl: {
      index: "NordFit – Home",
      mitgliedschaften: "NordFit – Lidmaatschappen",
      standorte: "NordFit – Locaties",
      app: "NordFit – App",
      hausordnung: "NordFit – Huisregels",
      kontakt: "NordFit – Contact",
      impressum: "NordFit – Juridisch"
    },
    sv: {
      index: "NordFit – Hem",
      mitgliedschaften: "NordFit – Medlemskap",
      standorte: "NordFit – Platser",
      app: "NordFit – App",
      hausordnung: "NordFit – Regler",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Juridik"
    },
    da: {
      index: "NordFit – Hjem",
      mitgliedschaften: "NordFit – Medlemskaber",
      standorte: "NordFit – Lokationer",
      app: "NordFit – App",
      hausordnung: "NordFit – Husregler",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Jura"
    },
    no: {
      index: "NordFit – Hjem",
      mitgliedschaften: "NordFit – Medlemskap",
      standorte: "NordFit – Lokasjoner",
      app: "NordFit – App",
      hausordnung: "NordFit – Husregler",
      kontakt: "NordFit – Kontakt",
      impressum: "NordFit – Juridisk"
    }
  };

  const metaDescriptions = {
    de: {
      index: "NordFit – modernes Fitnessstudio mit klarer Atmosphäre, hochwertigen Trainingsbereichen und ruhigem Premium-Design.",
      mitgliedschaften: "NordFit Mitgliedschaften und Tagespass – klare Tarife, flexible Laufzeiten und Abschluss direkt in der App.",
      standorte: "NordFit Standorte – Studio, Lage und erste Eindrücke auf einen Blick.",
      app: "Die NordFit App ist dein Zugang zu Mitgliedschaft, Tagespass und QR-Code-Zutritt bei NordFit.",
      hausordnung: "Die Hausordnung von NordFit – klare Regeln für ein ruhiges, sauberes und respektvolles Training.",
      kontakt: "Kontakt zu NordFit – E-Mail, Instagram und Kontaktformular.",
      impressum: "Impressum, AGB und Datenschutz von NordFit."
    },
    en: {
      index: "NordFit – a modern gym with a clear atmosphere, premium training areas and a calm high-end design.",
      mitgliedschaften: "NordFit memberships and day pass – clear plans, flexible terms and booking directly in the app.",
      standorte: "NordFit locations – studio, location and first impressions at a glance.",
      app: "The NordFit app is your access to membership, day pass and QR code entry at NordFit.",
      hausordnung: "The NordFit house rules – clear standards for calm, clean and respectful training.",
      kontakt: "Contact NordFit – email, Instagram and contact form.",
      impressum: "Legal notice, terms and privacy of NordFit."
    }
  };

  function makeCommonTranslations(lang) {
    const menu = languageMenuLabels[lang];
    const nav = navLabels[lang];
    const footer = footerLabels[lang];

    return {
      ".lang-option:nth-of-type(1)": { text: menu[0] },
      ".lang-option:nth-of-type(2)": { text: menu[1] },
      ".lang-option:nth-of-type(3)": { text: menu[2] },
      ".lang-option:nth-of-type(4)": { text: menu[3] },
      ".lang-option:nth-of-type(5)": { text: menu[4] },
      ".lang-option:nth-of-type(6)": { text: menu[5] },
      ".lang-option:nth-of-type(7)": { text: menu[6] },
      ".lang-option:nth-of-type(8)": { text: menu[7] },
      ".lang-option:nth-of-type(9)": { text: menu[8] },
      ".lang-option:nth-of-type(10)": { text: menu[9] },

      ".nav-link:nth-of-type(1)": { text: nav[0] },
      ".nav-link:nth-of-type(2)": { text: nav[1] },
      ".nav-link:nth-of-type(3)": { text: nav[2] },
      ".nav-link:nth-of-type(4)": { text: nav[3] },
      ".nav-link:nth-of-type(5)": { text: nav[4] },
      ".nav-link:nth-of-type(6)": { text: nav[5] },

      ".footer-links a:nth-of-type(1)": { text: footer[0] },
      ".footer-links a:nth-of-type(2)": { text: footer[1] },
      ".footer-links a:nth-of-type(3)": { text: footer[2] },
      ".footer-links a:nth-of-type(4)": { text: footer[3] }
    };
  }

  const commonTranslations = {
    de: makeCommonTranslations("de"),
    en: makeCommonTranslations("en"),
    fr: makeCommonTranslations("fr"),
    es: makeCommonTranslations("es"),
    it: makeCommonTranslations("it"),
    pl: makeCommonTranslations("pl"),
    nl: makeCommonTranslations("nl"),
    sv: makeCommonTranslations("sv"),
    da: makeCommonTranslations("da"),
    no: makeCommonTranslations("no")
  };

  const pageTranslations = {
    index: {
      de: {
        ".hero-title": { text: "Ein Studio, das modern wirkt. Und ruhig bleibt." },
        ".hero-subtitle": {
          html: "NordFit ist für Menschen gedacht, die nicht einfach irgendein Studio wollen, sondern einen Ort, der klar, hochwertig und angenehm im Kopf bleibt."
        },
        ".hero-actions a:nth-of-type(1)": { text: "Mitgliedschaften" },
        ".hero-actions a:nth-of-type(2)": { text: "App" },
        ".hero-actions a:nth-of-type(3)": { text: "Standorte" },
        ".hero-image-caption h2": { text: "Ein erster Eindruck, der direkt hängen bleibt." },
        ".hero-image-caption p": {
          html: "Schon von außen soll NordFit modern, ruhig und sauber wirken. Nicht überladen, nicht beliebig — sondern so, dass man sofort merkt: Hier wurde mit Anspruch gearbeitet."
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Krafttraining" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functional Training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Regeneration" }
      },
      en: {
        ".hero-title": { text: "A studio that feels modern. And stays calm." },
        ".hero-subtitle": {
          html: "NordFit is made for people who do not want just any gym, but a place that feels clear, premium and genuinely good to come back to."
        },
        ".hero-actions a:nth-of-type(1)": { text: "Memberships" },
        ".hero-actions a:nth-of-type(2)": { text: "App" },
        ".hero-actions a:nth-of-type(3)": { text: "Locations" },
        ".hero-image-caption h2": { text: "A first impression that stays with you." },
        ".hero-image-caption p": {
          html: "From the outside, NordFit should already feel modern, calm and clean. Not overloaded, not generic — but built in a way that immediately feels intentional."
        },
        ".area-section:nth-of-type(1) .area-copy h3": { text: "Strength Training" },
        ".area-section:nth-of-type(2) .area-copy h3": { text: "Cardio" },
        ".area-section:nth-of-type(3) .area-copy h3": { text: "Functional Training" },
        ".area-section:nth-of-type(4) .area-copy h3": { text: "Recovery" }
      }
    },

    mitgliedschaften: {
      de: {
        ".hero-title": { text: "Klare Tarife. Ohne Umwege." },
        ".hero-subtitle": {
          html: "Bei NordFit soll schon vor dem ersten Training klar sein, was du buchst, wie lange es läuft und wie flexibel du später wieder rauskommst."
        },
        ".info-note-label": { text: "Wichtiger Hinweis" },
        ".info-note-text": {
          html: "Abschluss, Verwaltung und Kündigung laufen vollständig über die NordFit App. So bleibt alles an einem Ort, jederzeit nachvollziehbar und ohne unnötigen Papierkram."
        },
        ".pricing-card:nth-of-type(1) .eyebrow": { text: "Basic" },
        ".pricing-card:nth-of-type(2) .eyebrow": { text: "Plus" },
        ".pricing-card:nth-of-type(3) .eyebrow": { text: "Pro" },
        ".pricing-card-action .btn": { text: "Über die App buchen" },
        ".daypass-shell .eyebrow": { text: "Tagespass" },
        ".daypass-shell .section-title": { text: "4,90 € pro Tag" },
        ".daypass-shell .btn": { text: "Über die App buchen" }
      },
      en: {
        ".hero-title": { text: "Clear plans. No detours." },
        ".hero-subtitle": {
          html: "At NordFit, it should be clear before your first workout what you are booking, how long it runs and how flexible you stay later on."
        },
        ".info-note-label": { text: "Important note" },
        ".info-note-text": {
          html: "Sign-up, management and cancellation are handled entirely through the NordFit app. That keeps everything in one place, easy to follow and free from unnecessary paperwork."
        },
        ".pricing-card-action .btn": { text: "Book in the app" },
        ".daypass-shell .eyebrow": { text: "Day Pass" },
        ".daypass-shell .section-title": { text: "€4.90 per day" },
        ".daypass-shell .btn": { text: "Book in the app" }
      }
    },

    standorte: {
      de: {
        ".hero-title": { text: "Ein Standort. Klar gedacht." },
        ".hero-subtitle": {
          html: "Der erste NordFit Standort soll nicht einfach nur erreichbar sein. Er soll sich direkt stimmig anfühlen — von außen, von innen und im ganzen Ablauf."
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit startet bewusst mit einem klaren, ruhigen Studio statt mit unnötiger Größe. Weniger Ablenkung, mehr Struktur und ein Standort, den man direkt versteht."
        }
      },
      en: {
        ".hero-title": { text: "One location. Clearly designed." },
        ".hero-subtitle": {
          html: "The first NordFit location should not just be easy to reach. It should feel right straight away — from the outside, from the inside and throughout the whole experience."
        },
        ".info-note-label": { text: "Info" },
        ".info-note-text": {
          html: "NordFit intentionally starts with a clear, calm studio instead of unnecessary size. Less distraction, more structure and a location that makes immediate sense."
        }
      }
    },

    app: {
      de: {
        ".hero-title": { text: "Ohne App geht’s nicht." },
        ".hero-subtitle": {
          html: "Die NordFit App ist nicht bloß ein Extra. Sie ist der zentrale Weg zu deinem Zugang, deiner Mitgliedschaft und allem, was bei NordFit bewusst digital und klar laufen soll."
        },
        ".info-note-label": { text: "Wichtige Info" },
        ".info-note-text": {
          html: "Ohne NordFit App gibt es keinen Zutritt zum Studio. Mitgliedschaften, Tagespass, Verwaltung und QR-Code laufen vollständig darüber."
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "LADEN IM" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "JETZT BEI" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" }
      },
      en: {
        ".hero-title": { text: "You need the app." },
        ".hero-subtitle": {
          html: "The NordFit app is not just an extra. It is the central route to your access, your membership and everything that is meant to stay digital and clear at NordFit."
        },
        ".info-note-label": { text: "Important info" },
        ".info-note-text": {
          html: "Without the NordFit app, there is no entry to the studio. Memberships, day passes, management and QR access all run through it."
        },
        ".store-badge:nth-of-type(1) .store-badge-small": { text: "DOWNLOAD ON THE" },
        ".store-badge:nth-of-type(1) .store-badge-big": { text: "App Store" },
        ".store-badge:nth-of-type(2) .store-badge-small": { text: "GET IT ON" },
        ".store-badge:nth-of-type(2) .store-badge-big": { text: "Google Play" }
      }
    },

    hausordnung: {
      de: {
        ".hero-title": { text: "Klare Regeln. Ruhiges Training." },
        ".hero-subtitle": {
          html: "NordFit soll sich sauber, respektvoll und angenehm anfühlen. Diese Hausordnung gibt dafür einen klaren Rahmen."
        },
        ".info-note-label": { text: "Grundsatz" },
        ".info-note-text": {
          html: "Wer bei NordFit trainiert, soll sich auf einen fairen, ruhigen und sauberen Ablauf verlassen können. Genau dafür gelten diese Regeln — nicht als Drama, sondern als Standard."
        }
      },
      en: {
        ".hero-title": { text: "Clear rules. Calm training." },
        ".hero-subtitle": {
          html: "NordFit should feel clean, respectful and easy to enjoy. These house rules create the clear framework for that."
        },
        ".info-note-label": { text: "Principle" },
        ".info-note-text": {
          html: "Anyone training at NordFit should be able to rely on a fair, calm and clean environment. These rules are there for exactly that — not as drama, but as a standard."
        }
      }
    },

    kontakt: {
      de: {
        ".hero-title": { text: "Schreib uns direkt." },
        ".hero-subtitle": {
          html: "Wenn du Fragen zu NordFit, zur App, zu deiner Mitgliedschaft oder zum Studio hast, kannst du uns hier auf dem direkten Weg erreichen."
        },
        ".section-block .section-title": { text: "Kontaktwege" },
        ".contact-form-shell .section-title": { text: "Kontaktformular" },
        "label[for='contact-firstname']": { html: "Vorname <span class='required-star'>*</span>" },
        "label[for='contact-lastname']": { html: "Nachname <span class='required-star'>*</span>" },
        "label[for='contact-email']": { html: "E-Mail <span class='required-star'>*</span>" },
        "label[for='contact-phone']": { html: "Telefonnummer <span class='required-star'>*</span>" },
        "label[for='contact-topic']": { html: "Thema <span class='required-star'>*</span>" },
        "label[for='contact-memberid']": { text: "Member ID" },
        "label[for='contact-message']": { html: "Nachricht <span class='required-star'>*</span>" },
        ".required-note": { text: "Felder mit * müssen ausgefüllt werden." },
        ".contact-form-footer .btn": { text: "Nachricht senden" }
      },
      en: {
        ".hero-title": { text: "Write to us directly." },
        ".hero-subtitle": {
          html: "If you have questions about NordFit, the app, your membership or the studio, you can reach us here directly."
        },
        ".section-block .section-title": { text: "Contact options" },
        ".contact-form-shell .section-title": { text: "Contact form" },
        "label[for='contact-firstname']": { html: "First name <span class='required-star'>*</span>" },
        "label[for='contact-lastname']": { html: "Last name <span class='required-star'>*</span>" },
        "label[for='contact-email']": { html: "Email <span class='required-star'>*</span>" },
        "label[for='contact-phone']": { html: "Phone number <span class='required-star'>*</span>" },
        "label[for='contact-topic']": { html: "Topic <span class='required-star'>*</span>" },
        "label[for='contact-memberid']": { text: "Member ID" },
        "label[for='contact-message']": { html: "Message <span class='required-star'>*</span>" },
        ".required-note": { text: "Fields marked with * are required." },
        ".contact-form-footer .btn": { text: "Send message" }
      }
    },

    impressum: {
      de: {
        ".hero-title": { text: "Rechtliches. Klar und offen." },
        ".hero-subtitle": {
          html: "Auch im rechtlichen Teil soll NordFit verständlich, sauber und transparent wirken — ohne unnötige Umwege und ohne versteckte Punkte."
        },
        ".legal-actions-card .section-title": { text: "Schnellauswahl" },
        ".legal-action-buttons .btn:nth-of-type(1)": { text: "AGB öffnen" },
        ".legal-action-buttons .btn:nth-of-type(2)": { text: "Datenschutz öffnen" },
        ".legal-action-buttons .btn:nth-of-type(3)": { text: "Hausordnung öffnen" }
      },
      en: {
        ".hero-title": { text: "Legal. Clear and open." },
        ".hero-subtitle": {
          html: "Even the legal section should feel understandable, clean and transparent at NordFit — without unnecessary detours and without hidden details."
        },
        ".legal-actions-card .section-title": { text: "Quick access" },
        ".legal-action-buttons .btn:nth-of-type(1)": { text: "Open terms" },
        ".legal-action-buttons .btn:nth-of-type(2)": { text: "Open privacy" },
        ".legal-action-buttons .btn:nth-of-type(3)": { text: "Open house rules" }
      }
    }
  };
});
