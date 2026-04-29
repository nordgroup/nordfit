/* =========================
   NordFit translations.js
   Stable data-i18n system
   Current full support: index.html
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

  const translations = {
    de: {
      meta: {
        title: "NordFit – Startseite",
        description:
          "NordFit ist ein modernes Fitnessstudio mit ruhiger Atmosphäre, klarem Aufbau und hochwertigem Trainingsgefühl.",
      },

      nav: {
        home: "Startseite",
        pricing: "Tarife",
        locations: "Standorte",
        app: "App",
        rules: "Hausordnung",
        contact: "Kontakt",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Fitness, das ruhig aussieht. Und stark wirkt.",
        heroSubtitle:
          "NordFit ist als modernes Studio geplant: klare Räume, gute Orientierung und eine Atmosphäre, die Training nicht lauter macht, als es sein muss.",
        primaryCta: "Tarife ansehen",
        secondaryCta: "Standort ansehen",
        heroImageAlt: "Außenansicht des geplanten NordFit Studios",
        floatingLabel: "Erster Eindruck",
        floatingText: "Klar, hochwertig und bewusst nicht überladen.",

        feelingEyebrow: "Studio-Gefühl",
        feelingTitle: "Nicht mehr. Besser.",
        feelingText:
          "NordFit soll kein Studio sein, das dich mit Eindrücken erschlägt. Es soll sich sauber, ruhig und direkt verständlich anfühlen.",

        featureOneTitle: "Klare Wege",
        featureOneText:
          "Du sollst dich schnell zurechtfinden: ankommen, Zugang öffnen, trainieren. Ohne unnötiges Suchen.",
        featureTwoTitle: "Ruhiger Look",
        featureTwoText:
          "Modern, aber nicht kalt. Hochwertig, aber nicht abgehoben. Genau dieser Mittelweg macht NordFit aus.",
        featureThreeTitle: "Weniger Chaos",
        featureThreeText:
          "Training braucht Energie. Die Umgebung soll dir nicht zusätzlich Unruhe geben, sondern Fokus leichter machen.",

        panelOneEyebrow: "Krafttraining",
        panelOneTitle: "Stark trainieren. Ohne Studiolärm im Kopf.",
        panelOneText:
          "Der Kraftbereich soll konzentriert wirken: Geräte, freie Gewichte und klare Flächen, damit du nicht erst gegen das Studio antrainieren musst.",

        panelTwoEyebrow: "Cardio & Bewegung",
        panelTwoTitle: "Ausdauer, freie Bewegung und genug Luft.",
        panelTwoText:
          "Cardio und Functional Training sollen offen und leicht zugänglich bleiben. Nicht versteckt, nicht eng, nicht kompliziert.",

        panelThreeEyebrow: "Regeneration",
        panelThreeTitle: "Runterkommen gehört auch dazu.",
        panelThreeText:
          "Nach dem Training soll NordFit nicht abrupt enden. Ein ruhiger Abschluss macht aus einem Besuch ein besseres Gefühl.",

        finalEyebrow: "NordFit im Aufbau",
        finalTitle: "Ein Studio muss nicht laut sein, um ernst genommen zu werden.",
        finalText:
          "Die Startseite zeigt den ersten Eindruck. Tarife, Standort und App bleiben bewusst auf eigenen Seiten, damit alles klar getrennt ist.",
        finalPrimary: "Tarife ansehen",
        finalSecondary: "Kontakt aufnehmen",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. Do not distribute!",
        legal: "Impressum / AGB / Datenschutz",
        rules: "Hausordnung",
        contact: "Kontakt",
      },
    },

    en: {
      meta: {
        title: "NordFit – Home",
        description:
          "NordFit is a modern gym concept with a calm atmosphere, clear structure and a premium training feel.",
      },

      nav: {
        home: "Home",
        pricing: "Plans",
        locations: "Locations",
        app: "App",
        rules: "House Rules",
        contact: "Contact",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Fitness that looks calm. And feels strong.",
        heroSubtitle:
          "NordFit is planned as a modern studio: clear spaces, easy orientation and an atmosphere that does not make training louder than it needs to be.",
        primaryCta: "View plans",
        secondaryCta: "View location",
        heroImageAlt: "Exterior view of the planned NordFit studio",
        floatingLabel: "First impression",
        floatingText: "Clear, premium and intentionally not overloaded.",

        feelingEyebrow: "Studio feel",
        feelingTitle: "Not more. Better.",
        feelingText:
          "NordFit should not be a studio that overwhelms you with noise and impressions. It should feel clean, calm and easy to understand right away.",

        featureOneTitle: "Clear flow",
        featureOneText:
          "You should quickly know where to go: arrive, open access, train. Without unnecessary searching.",
        featureTwoTitle: "Calm look",
        featureTwoText:
          "Modern, but not cold. Premium, but not distant. That balance is what NordFit is built around.",
        featureThreeTitle: "Less chaos",
        featureThreeText:
          "Training needs energy. The environment should not add more noise — it should make focus easier.",

        panelOneEyebrow: "Strength training",
        panelOneTitle: "Train strong. Without studio noise in your head.",
        panelOneText:
          "The strength area should feel focused: equipment, free weights and clear zones, so you do not have to train against the room first.",

        panelTwoEyebrow: "Cardio & movement",
        panelTwoTitle: "Endurance, free movement and enough space.",
        panelTwoText:
          "Cardio and functional training should stay open and easy to access. Not hidden, not cramped, not complicated.",

        panelThreeEyebrow: "Recovery",
        panelThreeTitle: "Cooling down matters too.",
        panelThreeText:
          "A NordFit visit should not end abruptly after training. A calmer finish makes the whole visit feel better.",

        finalEyebrow: "NordFit in progress",
        finalTitle: "A gym does not have to be loud to be taken seriously.",
        finalText:
          "The homepage shows the first impression. Plans, location and app stay on their own pages so everything remains clearly separated.",
        finalPrimary: "View plans",
        finalSecondary: "Get in touch",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. Do not distribute!",
        legal: "Legal / Terms / Privacy",
        rules: "House Rules",
        contact: "Contact",
      },
    },

    fr: {
      meta: {
        title: "NordFit – Accueil",
        description:
          "NordFit est un concept de salle de sport moderne avec une atmosphère calme, une structure claire et une sensation premium.",
      },

      nav: {
        home: "Accueil",
        pricing: "Tarifs",
        locations: "Sites",
        app: "App",
        rules: "Règlement",
        contact: "Contact",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Un fitness calme à regarder. Fort à ressentir.",
        heroSubtitle:
          "NordFit est pensé comme un studio moderne : des espaces clairs, une orientation simple et une atmosphère qui ne rend pas l’entraînement plus bruyant qu’il ne doit l’être.",
        primaryCta: "Voir les tarifs",
        secondaryCta: "Voir le site",
        heroImageAlt: "Vue extérieure du studio NordFit prévu",
        floatingLabel: "Première impression",
        floatingText: "Clair, premium et volontairement non surchargé.",

        feelingEyebrow: "Sensation du studio",
        feelingTitle: "Pas plus. Mieux.",
        feelingText:
          "NordFit ne doit pas être une salle qui vous submerge. Le lieu doit être propre, calme et compréhensible dès le départ.",

        featureOneTitle: "Des chemins clairs",
        featureOneText:
          "Vous devez comprendre rapidement le fonctionnement : arriver, ouvrir l’accès, vous entraîner. Sans chercher inutilement.",
        featureTwoTitle: "Un style calme",
        featureTwoText:
          "Moderne, mais pas froid. Premium, mais pas distant. C’est cet équilibre qui définit NordFit.",
        featureThreeTitle: "Moins de chaos",
        featureThreeText:
          "L’entraînement demande de l’énergie. L’environnement ne doit pas ajouter du bruit, mais faciliter la concentration.",

        panelOneEyebrow: "Musculation",
        panelOneTitle: "S’entraîner fort. Sans bruit dans la tête.",
        panelOneText:
          "L’espace musculation doit rester concentré : machines, poids libres et zones claires, sans devoir lutter contre la salle.",

        panelTwoEyebrow: "Cardio & mouvement",
        panelTwoTitle: "Endurance, mouvement libre et assez d’espace.",
        panelTwoText:
          "Le cardio et l’entraînement fonctionnel doivent rester ouverts et faciles d’accès. Pas cachés, pas serrés, pas compliqués.",

        panelThreeEyebrow: "Récupération",
        panelThreeTitle: "Redescendre fait aussi partie du tout.",
        panelThreeText:
          "Une visite NordFit ne doit pas s’arrêter brusquement après l’entraînement. Une fin plus calme améliore toute l’expérience.",

        finalEyebrow: "NordFit en construction",
        finalTitle: "Une salle n’a pas besoin d’être bruyante pour être prise au sérieux.",
        finalText:
          "La page d’accueil montre la première impression. Les tarifs, le site et l’app restent sur leurs propres pages pour garder une structure claire.",
        finalPrimary: "Voir les tarifs",
        finalSecondary: "Nous contacter",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. Ne pas distribuer !",
        legal: "Mentions / CGV / Confidentialité",
        rules: "Règlement",
        contact: "Contact",
      },
    },

    es: {
      meta: {
        title: "NordFit – Inicio",
        description:
          "NordFit es un concepto de gimnasio moderno con ambiente tranquilo, estructura clara y sensación premium.",
      },

      nav: {
        home: "Inicio",
        pricing: "Tarifas",
        locations: "Ubicaciones",
        app: "App",
        rules: "Normas",
        contact: "Contacto",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Fitness que se ve tranquilo. Y se siente fuerte.",
        heroSubtitle:
          "NordFit está pensado como un estudio moderno: espacios claros, orientación sencilla y una atmósfera que no hace el entrenamiento más ruidoso de lo necesario.",
        primaryCta: "Ver tarifas",
        secondaryCta: "Ver ubicación",
        heroImageAlt: "Vista exterior del estudio NordFit planificado",
        floatingLabel: "Primera impresión",
        floatingText: "Claro, premium y deliberadamente no sobrecargado.",

        feelingEyebrow: "Sensación del estudio",
        feelingTitle: "No más. Mejor.",
        feelingText:
          "NordFit no debe ser un estudio que te abrume. Debe sentirse limpio, tranquilo y fácil de entender desde el primer momento.",

        featureOneTitle: "Flujo claro",
        featureOneText:
          "Debes orientarte rápido: llegar, abrir el acceso, entrenar. Sin búsquedas innecesarias.",
        featureTwoTitle: "Aspecto tranquilo",
        featureTwoText:
          "Moderno, pero no frío. Premium, pero no distante. Ese equilibrio define NordFit.",
        featureThreeTitle: "Menos caos",
        featureThreeText:
          "Entrenar requiere energía. El entorno no debe añadir ruido, sino hacer más fácil concentrarse.",

        panelOneEyebrow: "Fuerza",
        panelOneTitle: "Entrena fuerte. Sin ruido de gimnasio en la cabeza.",
        panelOneText:
          "La zona de fuerza debe sentirse enfocada: máquinas, peso libre y áreas claras, sin tener que luchar contra el espacio.",

        panelTwoEyebrow: "Cardio y movimiento",
        panelTwoTitle: "Resistencia, movimiento libre y suficiente espacio.",
        panelTwoText:
          "Cardio y entrenamiento funcional deben ser abiertos y fáciles de usar. No escondidos, no apretados, no complicados.",

        panelThreeEyebrow: "Recuperación",
        panelThreeTitle: "Bajar el ritmo también cuenta.",
        panelThreeText:
          "Una visita a NordFit no debe terminar de golpe tras entrenar. Un cierre más tranquilo mejora toda la experiencia.",

        finalEyebrow: "NordFit en desarrollo",
        finalTitle: "Un gimnasio no tiene que ser ruidoso para ser tomado en serio.",
        finalText:
          "La página de inicio muestra la primera impresión. Tarifas, ubicación y app permanecen en páginas propias para que todo quede claro.",
        finalPrimary: "Ver tarifas",
        finalSecondary: "Contactar",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. No distribuir.",
        legal: "Legal / Términos / Privacidad",
        rules: "Normas",
        contact: "Contacto",
      },
    },

    it: {
      meta: {
        title: "NordFit – Home",
        description:
          "NordFit è un concept di palestra moderna con atmosfera calma, struttura chiara e sensazione premium.",
      },

      nav: {
        home: "Home",
        pricing: "Tariffe",
        locations: "Sedi",
        app: "App",
        rules: "Regolamento",
        contact: "Contatto",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Fitness che sembra calmo. E si sente forte.",
        heroSubtitle:
          "NordFit è pensato come uno studio moderno: spazi chiari, orientamento semplice e un’atmosfera che non rende l’allenamento più rumoroso del necessario.",
        primaryCta: "Vedi tariffe",
        secondaryCta: "Vedi sede",
        heroImageAlt: "Vista esterna dello studio NordFit previsto",
        floatingLabel: "Prima impressione",
        floatingText: "Chiaro, premium e volutamente non sovraccarico.",

        feelingEyebrow: "Sensazione dello studio",
        feelingTitle: "Non di più. Meglio.",
        feelingText:
          "NordFit non deve essere uno studio che ti travolge. Deve sembrare pulito, calmo e subito comprensibile.",

        featureOneTitle: "Percorsi chiari",
        featureOneText:
          "Devi orientarti subito: arrivare, aprire l’accesso, allenarti. Senza cercare inutilmente.",
        featureTwoTitle: "Look calmo",
        featureTwoText:
          "Moderno, ma non freddo. Premium, ma non distante. Questo equilibrio definisce NordFit.",
        featureThreeTitle: "Meno caos",
        featureThreeText:
          "L’allenamento richiede energia. L’ambiente non deve aggiungere rumore, ma facilitare la concentrazione.",

        panelOneEyebrow: "Forza",
        panelOneTitle: "Allenati forte. Senza rumore in testa.",
        panelOneText:
          "L’area forza deve essere concentrata: macchine, pesi liberi e zone chiare, senza dover combattere contro lo spazio.",

        panelTwoEyebrow: "Cardio e movimento",
        panelTwoTitle: "Resistenza, movimento libero e abbastanza spazio.",
        panelTwoText:
          "Cardio e functional training devono restare aperti e facili da usare. Non nascosti, non stretti, non complicati.",

        panelThreeEyebrow: "Recupero",
        panelThreeTitle: "Anche rallentare fa parte del percorso.",
        panelThreeText:
          "Una visita NordFit non deve finire bruscamente dopo l’allenamento. Una chiusura più calma migliora tutta l’esperienza.",

        finalEyebrow: "NordFit in costruzione",
        finalTitle: "Una palestra non deve essere rumorosa per essere presa sul serio.",
        finalText:
          "La homepage mostra la prima impressione. Tariffe, sede e app restano su pagine proprie per mantenere tutto chiaro.",
        finalPrimary: "Vedi tariffe",
        finalSecondary: "Contattaci",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. Non distribuire.",
        legal: "Note legali / Termini / Privacy",
        rules: "Regolamento",
        contact: "Contatto",
      },
    },

    pl: {
      meta: {
        title: "NordFit – Strona główna",
        description:
          "NordFit to koncepcja nowoczesnej siłowni ze spokojną atmosferą, jasną strukturą i premium odczuciem treningu.",
      },

      nav: {
        home: "Start",
        pricing: "Karnety",
        locations: "Lokalizacje",
        app: "Aplikacja",
        rules: "Regulamin",
        contact: "Kontakt",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Fitness, który wygląda spokojnie. I działa mocno.",
        heroSubtitle:
          "NordFit jest planowany jako nowoczesne studio: jasne przestrzenie, łatwa orientacja i atmosfera, która nie robi treningu głośniejszym niż trzeba.",
        primaryCta: "Zobacz karnety",
        secondaryCta: "Zobacz lokalizację",
        heroImageAlt: "Widok zewnętrzny planowanego studia NordFit",
        floatingLabel: "Pierwsze wrażenie",
        floatingText: "Jasne, premium i celowo nieprzeładowane.",

        feelingEyebrow: "Odczucie studia",
        feelingTitle: "Nie więcej. Lepiej.",
        feelingText:
          "NordFit nie ma przytłaczać. Ma być czyste, spokojne i od razu zrozumiałe.",

        featureOneTitle: "Jasny układ",
        featureOneText:
          "Masz szybko wiedzieć, gdzie iść: przyjść, otworzyć dostęp, trenować. Bez zbędnego szukania.",
        featureTwoTitle: "Spokojny wygląd",
        featureTwoText:
          "Nowocześnie, ale nie zimno. Premium, ale nie z dystansem. Na tym balansie opiera się NordFit.",
        featureThreeTitle: "Mniej chaosu",
        featureThreeText:
          "Trening wymaga energii. Otoczenie nie powinno dodawać hałasu, tylko ułatwiać skupienie.",

        panelOneEyebrow: "Trening siłowy",
        panelOneTitle: "Trenuj mocno. Bez hałasu studia w głowie.",
        panelOneText:
          "Strefa siłowa ma być skupiona: sprzęt, wolne ciężary i jasne obszary, bez walki z przestrzenią.",

        panelTwoEyebrow: "Cardio i ruch",
        panelTwoTitle: "Wytrzymałość, swobodny ruch i wystarczająco miejsca.",
        panelTwoText:
          "Cardio i trening funkcjonalny mają być otwarte i łatwo dostępne. Nie ukryte, nie ciasne, nie skomplikowane.",

        panelThreeEyebrow: "Regeneracja",
        panelThreeTitle: "Wyciszenie też ma znaczenie.",
        panelThreeText:
          "Wizyta w NordFit nie powinna kończyć się nagle po treningu. Spokojniejszy koniec daje lepsze odczucie całości.",

        finalEyebrow: "NordFit w budowie",
        finalTitle: "Siłownia nie musi być głośna, żeby traktować ją poważnie.",
        finalText:
          "Strona główna pokazuje pierwsze wrażenie. Karnety, lokalizacja i aplikacja są na osobnych stronach, żeby wszystko było jasne.",
        finalPrimary: "Zobacz karnety",
        finalSecondary: "Kontakt",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. Nie rozpowszechniać.",
        legal: "Dane prawne / Regulamin / Prywatność",
        rules: "Regulamin",
        contact: "Kontakt",
      },
    },

    nl: {
      meta: {
        title: "NordFit – Home",
        description:
          "NordFit is een modern sportschoolconcept met een rustige sfeer, duidelijke structuur en premium trainingsgevoel.",
      },

      nav: {
        home: "Home",
        pricing: "Tarieven",
        locations: "Locaties",
        app: "App",
        rules: "Huisregels",
        contact: "Contact",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Fitness die rustig oogt. En sterk voelt.",
        heroSubtitle:
          "NordFit is gepland als moderne studio: duidelijke ruimtes, eenvoudige oriëntatie en een sfeer die training niet luider maakt dan nodig.",
        primaryCta: "Bekijk tarieven",
        secondaryCta: "Bekijk locatie",
        heroImageAlt: "Buitenaanzicht van de geplande NordFit-studio",
        floatingLabel: "Eerste indruk",
        floatingText: "Helder, premium en bewust niet overladen.",

        feelingEyebrow: "Studiogevoel",
        feelingTitle: "Niet meer. Beter.",
        feelingText:
          "NordFit moet je niet overspoelen met prikkels. Het moet schoon, rustig en direct begrijpelijk aanvoelen.",

        featureOneTitle: "Duidelijke routes",
        featureOneText:
          "Je moet snel weten waar je heen moet: aankomen, toegang openen, trainen. Zonder onnodig zoeken.",
        featureTwoTitle: "Rustige uitstraling",
        featureTwoText:
          "Modern, maar niet koud. Premium, maar niet afstandelijk. Die balans vormt NordFit.",
        featureThreeTitle: "Minder chaos",
        featureThreeText:
          "Training vraagt energie. De omgeving moet geen extra onrust geven, maar focus makkelijker maken.",

        panelOneEyebrow: "Krachttraining",
        panelOneTitle: "Sterk trainen. Zonder studiogeluid in je hoofd.",
        panelOneText:
          "De krachtzone moet gefocust voelen: apparaten, losse gewichten en duidelijke zones, zonder tegen de ruimte te moeten trainen.",

        panelTwoEyebrow: "Cardio & beweging",
        panelTwoTitle: "Uithouding, vrije beweging en genoeg ruimte.",
        panelTwoText:
          "Cardio en functionele training moeten open en makkelijk toegankelijk blijven. Niet verstopt, niet krap, niet ingewikkeld.",

        panelThreeEyebrow: "Herstel",
        panelThreeTitle: "Afkoelen hoort er ook bij.",
        panelThreeText:
          "Een NordFit-bezoek moet niet abrupt eindigen na het trainen. Een rustiger einde maakt de hele ervaring beter.",

        finalEyebrow: "NordFit in opbouw",
        finalTitle: "Een sportschool hoeft niet luid te zijn om serieus te voelen.",
        finalText:
          "De homepage toont de eerste indruk. Tarieven, locatie en app blijven op eigen pagina’s zodat alles duidelijk gescheiden blijft.",
        finalPrimary: "Bekijk tarieven",
        finalSecondary: "Contact opnemen",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. Niet verspreiden.",
        legal: "Juridisch / Voorwaarden / Privacy",
        rules: "Huisregels",
        contact: "Contact",
      },
    },

    sv: {
      meta: {
        title: "NordFit – Hem",
        description:
          "NordFit är ett modernt gymkoncept med lugn atmosfär, tydlig struktur och premiumkänsla.",
      },

      nav: {
        home: "Hem",
        pricing: "Priser",
        locations: "Platser",
        app: "App",
        rules: "Regler",
        contact: "Kontakt",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Fitness som ser lugn ut. Och känns stark.",
        heroSubtitle:
          "NordFit planeras som en modern studio: tydliga ytor, enkel orientering och en atmosfär som inte gör träningen högre än den behöver vara.",
        primaryCta: "Se priser",
        secondaryCta: "Se plats",
        heroImageAlt: "Exteriör av den planerade NordFit-studion",
        floatingLabel: "Första intryck",
        floatingText: "Tydligt, premium och medvetet inte överlastat.",

        feelingEyebrow: "Studiokänsla",
        feelingTitle: "Inte mer. Bättre.",
        feelingText:
          "NordFit ska inte överväldiga dig med intryck. Det ska kännas rent, lugnt och lätt att förstå direkt.",

        featureOneTitle: "Tydligt flöde",
        featureOneText:
          "Du ska snabbt hitta rätt: komma in, öppna tillgången, träna. Utan onödigt letande.",
        featureTwoTitle: "Lugn look",
        featureTwoText:
          "Modernt, men inte kallt. Premium, men inte distanserat. Den balansen är NordFit.",
        featureThreeTitle: "Mindre kaos",
        featureThreeText:
          "Träning kräver energi. Miljön ska inte lägga till oväsen, utan göra fokus enklare.",

        panelOneEyebrow: "Styrketräning",
        panelOneTitle: "Träna starkt. Utan studiobrus i huvudet.",
        panelOneText:
          "Styrkeområdet ska kännas fokuserat: maskiner, fria vikter och tydliga ytor, utan att du först måste kämpa mot rummet.",

        panelTwoEyebrow: "Cardio & rörelse",
        panelTwoTitle: "Uthållighet, fri rörelse och tillräckligt med luft.",
        panelTwoText:
          "Cardio och funktionell träning ska vara öppna och lätta att använda. Inte gömda, inte trånga, inte komplicerade.",

        panelThreeEyebrow: "Återhämtning",
        panelThreeTitle: "Att varva ner hör också till.",
        panelThreeText:
          "Ett NordFit-besök ska inte sluta tvärt efter träningen. Ett lugnare avslut gör hela upplevelsen bättre.",

        finalEyebrow: "NordFit under uppbyggnad",
        finalTitle: "Ett gym behöver inte vara högljutt för att tas på allvar.",
        finalText:
          "Startsidan visar första intrycket. Priser, plats och app finns på egna sidor så att allt hålls tydligt separerat.",
        finalPrimary: "Se priser",
        finalSecondary: "Kontakta oss",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. Får ej distribueras.",
        legal: "Juridik / Villkor / Integritet",
        rules: "Regler",
        contact: "Kontakt",
      },
    },

    da: {
      meta: {
        title: "NordFit – Hjem",
        description:
          "NordFit er et moderne fitnesskoncept med rolig atmosfære, klar struktur og premium træningsfølelse.",
      },

      nav: {
        home: "Hjem",
        pricing: "Priser",
        locations: "Lokationer",
        app: "App",
        rules: "Husregler",
        contact: "Kontakt",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Fitness, der ser roligt ud. Og føles stærkt.",
        heroSubtitle:
          "NordFit planlægges som et moderne studio: klare rum, nem orientering og en atmosfære, der ikke gør træning mere larmende end nødvendigt.",
        primaryCta: "Se priser",
        secondaryCta: "Se lokation",
        heroImageAlt: "Udvendig visning af det planlagte NordFit-studio",
        floatingLabel: "Første indtryk",
        floatingText: "Klart, premium og bevidst ikke overfyldt.",

        feelingEyebrow: "Studiofølelse",
        feelingTitle: "Ikke mere. Bedre.",
        feelingText:
          "NordFit skal ikke overvælde dig med indtryk. Det skal føles rent, roligt og let at forstå med det samme.",

        featureOneTitle: "Klare veje",
        featureOneText:
          "Du skal hurtigt finde rundt: ankomme, åbne adgang, træne. Uden unødvendig søgen.",
        featureTwoTitle: "Roligt look",
        featureTwoText:
          "Moderne, men ikke koldt. Premium, men ikke distanceret. Den balance er NordFit.",
        featureThreeTitle: "Mindre kaos",
        featureThreeText:
          "Træning kræver energi. Omgivelserne skal ikke tilføje støj, men gøre fokus lettere.",

        panelOneEyebrow: "Styrketræning",
        panelOneTitle: "Træn stærkt. Uden studiestøj i hovedet.",
        panelOneText:
          "Styrkeområdet skal føles fokuseret: maskiner, frie vægte og klare zoner, uden at du først skal kæmpe mod rummet.",

        panelTwoEyebrow: "Cardio & bevægelse",
        panelTwoTitle: "Udholdenhed, fri bevægelse og nok plads.",
        panelTwoText:
          "Cardio og funktionel træning skal være åbent og let tilgængeligt. Ikke gemt, ikke trangt, ikke kompliceret.",

        panelThreeEyebrow: "Restitution",
        panelThreeTitle: "At falde ned hører også med.",
        panelThreeText:
          "Et NordFit-besøg skal ikke stoppe brat efter træning. En roligere afslutning gør hele oplevelsen bedre.",

        finalEyebrow: "NordFit under opbygning",
        finalTitle: "Et fitnessstudio behøver ikke være højt for at blive taget seriøst.",
        finalText:
          "Forsiden viser første indtryk. Priser, lokation og app ligger på egne sider, så alt forbliver klart adskilt.",
        finalPrimary: "Se priser",
        finalSecondary: "Kontakt os",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. Må ikke distribueres.",
        legal: "Jura / Vilkår / Privatliv",
        rules: "Husregler",
        contact: "Kontakt",
      },
    },

    no: {
      meta: {
        title: "NordFit – Hjem",
        description:
          "NordFit er et moderne treningskonsept med rolig atmosfære, tydelig struktur og premium treningsfølelse.",
      },

      nav: {
        home: "Hjem",
        pricing: "Priser",
        locations: "Lokasjoner",
        app: "App",
        rules: "Husregler",
        contact: "Kontakt",
      },

      home: {
        eyebrow: "NordFit",
        heroTitle: "Fitness som ser rolig ut. Og føles sterk.",
        heroSubtitle:
          "NordFit planlegges som et moderne studio: tydelige rom, enkel orientering og en atmosfære som ikke gjør treningen mer bråkete enn nødvendig.",
        primaryCta: "Se priser",
        secondaryCta: "Se lokasjon",
        heroImageAlt: "Utvendig visning av det planlagte NordFit-studioet",
        floatingLabel: "Førsteinntrykk",
        floatingText: "Tydelig, premium og bevisst ikke overlesset.",

        feelingEyebrow: "Studiofølelse",
        feelingTitle: "Ikke mer. Bedre.",
        feelingText:
          "NordFit skal ikke overvelde deg med inntrykk. Det skal føles rent, rolig og lett å forstå med en gang.",

        featureOneTitle: "Tydelig flyt",
        featureOneText:
          "Du skal raskt finne frem: komme inn, åpne tilgang, trene. Uten unødvendig leting.",
        featureTwoTitle: "Rolig uttrykk",
        featureTwoText:
          "Moderne, men ikke kaldt. Premium, men ikke distansert. Den balansen er NordFit.",
        featureThreeTitle: "Mindre kaos",
        featureThreeText:
          "Trening krever energi. Omgivelsene skal ikke legge til støy, men gjøre fokus lettere.",

        panelOneEyebrow: "Styrketrening",
        panelOneTitle: "Tren sterkt. Uten studiostøy i hodet.",
        panelOneText:
          "Styrkeområdet skal føles fokusert: apparater, frivekter og tydelige soner, uten at du først må kjempe mot rommet.",

        panelTwoEyebrow: "Cardio og bevegelse",
        panelTwoTitle: "Utholdenhet, fri bevegelse og nok plass.",
        panelTwoText:
          "Cardio og funksjonell trening skal være åpent og lett tilgjengelig. Ikke gjemt, ikke trangt, ikke komplisert.",

        panelThreeEyebrow: "Restitusjon",
        panelThreeTitle: "Å roe ned hører også med.",
        panelThreeText:
          "Et NordFit-besøk skal ikke stoppe brått etter trening. En roligere avslutning gjør hele opplevelsen bedre.",

        finalEyebrow: "NordFit under oppbygging",
        finalTitle: "Et treningssenter trenger ikke være høylytt for å tas seriøst.",
        finalText:
          "Forsiden viser førsteinntrykket. Priser, lokasjon og app ligger på egne sider, så alt holdes tydelig adskilt.",
        finalPrimary: "Se priser",
        finalSecondary: "Kontakt oss",
      },

      footer: {
        copyright: "© 2030 NordFit/NordGroup. Skal ikke distribueres.",
        legal: "Juridisk / Vilkår / Personvern",
        rules: "Husregler",
        contact: "Kontakt",
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
