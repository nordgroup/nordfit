/* =========================
   NordFit translations.js
   Stable data-i18n system
   Full support: index.html
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
          "NordFit ist ein modernes Fitnessstudio-Konzept mit ruhigem Design, klarer Struktur und hochwertigem Trainingsgefühl.",
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
          "NordFit is a modern gym concept with calm design, clear structure and a premium training feel.",
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
          "NordFit est un concept de salle de sport moderne avec un design calme, une structure claire et une sensation premium.",
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
        heroTitle: "Calme dans l’espace. Fort à l’entraînement.",
        heroSubtitle:
          "Un concept de studio moderne avec des chemins clairs, des zones propres et un entraînement qui ne ressemble pas au chaos.",
        primaryCta: "Voir les tarifs",
        secondaryCta: "Voir le site",
        heroImageAlt: "Vue extérieure du studio NordFit prévu",
        floatingLabel: "Prévu pour NordFit",
        floatingText: "Moins de bruit. Plus de concentration.",

        feelingTitle: "Pas plus grand. Plus clair.",
        feelingText:
          "NordFit ne doit pas impressionner par le bruit, mais par l’ordre. Un studio que l’on comprend immédiatement — et où l’on revient volontiers.",

        featureOneTitle: "Arriver",
        featureOneText:
          "Une orientation claire dès le premier pas. Pas de recherche, pas de foule, pas de détour inutile.",
        featureTwoTitle: "S’entraîner",
        featureTwoText:
          "Force, cardio et mouvement doivent rester clairement séparés, sans agrandir artificiellement le studio.",
        featureThreeTitle: "Redescendre",
        featureThreeText:
          "Après l’entraînement, la sensation reste calme. Pas de rupture brusque, pas de sortie bruyante.",

        panelOneTitle: "Force. Sans bruit.",
        panelOneText:
          "L’espace force doit être direct, rangé et concentré. Tout ce qu’il faut — sans impression de surcharge.",
        panelTwoTitle: "Cardio. Air. Mouvement.",
        panelTwoText:
          "L’endurance et le mouvement libre ont besoin d’espace, dans la pièce comme dans la tête. NordFit doit créer ce sentiment d’ouverture.",
        panelThreeTitle: "Une visite qui se termine proprement.",
        panelThreeText:
          "L’entraînement ne s’arrête pas au dernier effort. Une fin calme rend toute la visite plus complète.",

        finalTitle: "Discret dans l’apparence. Clair dans le concept.",
        finalText:
          "Les tarifs, le site et l’app restent volontairement sur leurs propres pages. NordFit ne paraît pas plus rempli — mais plus compréhensible.",
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
          "NordFit es un concepto de gimnasio moderno con diseño tranquilo, estructura clara y sensación premium.",
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
        heroTitle: "Calma en el espacio. Fuerza en el entrenamiento.",
        heroSubtitle:
          "Un concepto de estudio moderno con recorridos claros, zonas limpias y entrenamiento que no se siente como caos.",
        primaryCta: "Ver tarifas",
        secondaryCta: "Ver ubicación",
        heroImageAlt: "Vista exterior del estudio NordFit planificado",
        floatingLabel: "Planificado para NordFit",
        floatingText: "Menos ruido. Más foco.",

        feelingTitle: "No más grande. Más claro.",
        feelingText:
          "NordFit no debe impresionar con estímulos, sino con orden. Un estudio que se entiende al instante — y al que apetece volver.",

        featureOneTitle: "Llegar",
        featureOneText:
          "Orientación clara desde el primer paso. Sin búsquedas, sin aglomeraciones, sin procesos innecesarios.",
        featureTwoTitle: "Entrenar",
        featureTwoText:
          "Fuerza, cardio y movimiento deben sentirse claramente separados sin hacer el estudio artificialmente grande.",
        featureThreeTitle: "Bajar el ritmo",
        featureThreeText:
          "Después de entrenar, la sensación sigue tranquila. Sin corte brusco, sin salida ruidosa.",

        panelOneTitle: "Fuerza. Sin ruido.",
        panelOneText:
          "La zona de fuerza debe sentirse directa, ordenada y enfocada. Todo lo que necesitas — sin sensación de sobrecarga.",
        panelTwoTitle: "Cardio. Aire. Movimiento.",
        panelTwoText:
          "La resistencia y el movimiento libre necesitan espacio en la sala y en la cabeza. NordFit debe crear justo esa sensación abierta.",
        panelThreeTitle: "Una visita que termina limpia.",
        panelThreeText:
          "El entrenamiento no termina con la última serie. Un cierre tranquilo hace que la visita se sienta más completa.",

        finalTitle: "Silencioso en presencia. Claro en concepto.",
        finalText:
          "Tarifas, ubicación y app permanecen en páginas propias. NordFit no se siente más lleno — sino más fácil de entender.",
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
          "NordFit è un concept di palestra moderna con design calmo, struttura chiara e sensazione premium.",
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
        heroTitle: "Calmo nello spazio. Forte nell’allenamento.",
        heroSubtitle:
          "Un concept di studio moderno con percorsi chiari, aree pulite e allenamento che non sembra caos.",
        primaryCta: "Vedi tariffe",
        secondaryCta: "Vedi sede",
        heroImageAlt: "Vista esterna dello studio NordFit previsto",
        floatingLabel: "Previsto per NordFit",
        floatingText: "Meno rumore. Più focus.",

        feelingTitle: "Non più grande. Più chiaro.",
        feelingText:
          "NordFit non deve impressionare con stimoli, ma con ordine. Uno studio che si capisce subito — e in cui si torna volentieri.",

        featureOneTitle: "Arrivare",
        featureOneText:
          "Orientamento chiaro dal primo passo. Niente ricerca, niente caos, nessun percorso inutile.",
        featureTwoTitle: "Allenarsi",
        featureTwoText:
          "Forza, cardio e movimento devono risultare ben separati senza rendere lo studio artificialmente grande.",
        featureThreeTitle: "Rallentare",
        featureThreeText:
          "Dopo l’allenamento resta una sensazione calma. Nessuna rottura brusca, nessuna uscita rumorosa.",

        panelOneTitle: "Forza. Senza rumore.",
        panelOneText:
          "L’area forza deve essere diretta, ordinata e focalizzata. Tutto ciò che serve — senza effetto studio sovraccarico.",
        panelTwoTitle: "Cardio. Aria. Movimento.",
        panelTwoText:
          "Resistenza e movimento libero hanno bisogno di spazio, nella stanza e nella testa. NordFit deve dare proprio questa sensazione aperta.",
        panelThreeTitle: "Una visita che finisce bene.",
        panelThreeText:
          "L’allenamento non finisce con l’ultima serie. Una chiusura calma rende la visita più completa.",

        finalTitle: "Silenzioso nell’aspetto. Chiaro nel concetto.",
        finalText:
          "Tariffe, sede e app restano su pagine dedicate. NordFit non sembra più pieno — sembra più comprensibile.",
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
          "NordFit to koncepcja nowoczesnej siłowni ze spokojnym designem, jasną strukturą i premium odczuciem treningu.",
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
        heroTitle: "Spokój w przestrzeni. Siła w treningu.",
        heroSubtitle:
          "Nowoczesna koncepcja studia z jasnym układem, czystymi strefami i treningiem, który nie przypomina chaosu.",
        primaryCta: "Zobacz karnety",
        secondaryCta: "Zobacz lokalizację",
        heroImageAlt: "Widok zewnętrzny planowanego studia NordFit",
        floatingLabel: "Planowane dla NordFit",
        floatingText: "Mniej hałasu. Więcej skupienia.",

        feelingTitle: "Nie większe. Czytelniejsze.",
        feelingText:
          "NordFit nie ma imponować bodźcami, lecz porządkiem. Studio, które rozumiesz od razu — i do którego chcesz wracać.",

        featureOneTitle: "Wejście",
        featureOneText:
          "Jasna orientacja od pierwszego kroku. Bez szukania, bez tłoku, bez zbędnych etapów.",
        featureTwoTitle: "Trening",
        featureTwoText:
          "Siła, cardio i ruch mają być czytelnie oddzielone, bez sztucznego powiększania studia.",
        featureThreeTitle: "Wyciszenie",
        featureThreeText:
          "Po treningu uczucie zostaje spokojne. Bez nagłego przerwania, bez głośnego wyjścia.",

        panelOneTitle: "Siła. Bez hałasu.",
        panelOneText:
          "Strefa siłowa ma być bezpośrednia, uporządkowana i skupiona. Wszystko, czego potrzebujesz — bez przeładowania.",
        panelTwoTitle: "Cardio. Powietrze. Ruch.",
        panelTwoText:
          "Wytrzymałość i swobodny ruch potrzebują miejsca w sali i w głowie. NordFit ma dawać właśnie takie otwarte wrażenie.",
        panelThreeTitle: "Wizyta, która kończy się spokojnie.",
        panelThreeText:
          "Trening nie kończy się na ostatniej serii. Spokojne zakończenie sprawia, że całość działa lepiej.",

        finalTitle: "Ciche w wyglądzie. Jasne w koncepcji.",
        finalText:
          "Karnety, lokalizacja i aplikacja są celowo na osobnych stronach. NordFit nie wydaje się pełniejszy — tylko bardziej zrozumiały.",
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
          "NordFit is een modern sportschoolconcept met rustig design, duidelijke structuur en premium trainingsgevoel.",
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
        heroTitle: "Rust in de ruimte. Sterk in training.",
        heroSubtitle:
          "Een modern studioconcept met duidelijke routes, schone zones en training die niet als chaos voelt.",
        primaryCta: "Bekijk tarieven",
        secondaryCta: "Bekijk locatie",
        heroImageAlt: "Buitenaanzicht van de geplande NordFit-studio",
        floatingLabel: "Gepland voor NordFit",
        floatingText: "Minder lawaai. Meer focus.",

        feelingTitle: "Niet groter. Duidelijker.",
        feelingText:
          "NordFit moet niet indruk maken met prikkels, maar met orde. Een studio die je meteen begrijpt — en graag weer binnenloopt.",

        featureOneTitle: "Aankomen",
        featureOneText:
          "Duidelijke oriëntatie vanaf de eerste stap. Geen zoeken, geen drukte, geen onnodig proces.",
        featureTwoTitle: "Trainen",
        featureTwoText:
          "Kracht, cardio en beweging moeten duidelijk gescheiden voelen zonder de studio kunstmatig groot te maken.",
        featureThreeTitle: "Afkoelen",
        featureThreeText:
          "Na het trainen blijft het gevoel rustig. Geen harde breuk, geen luid vertrek.",

        panelOneTitle: "Kracht. Zonder lawaai.",
        panelOneText:
          "De krachtzone moet direct, opgeruimd en gefocust aanvoelen. Alles wat je nodig hebt — zonder overvolle studiosfeer.",
        panelTwoTitle: "Cardio. Lucht. Beweging.",
        panelTwoText:
          "Uithouding en vrije beweging hebben ruimte nodig in de zaal en in je hoofd. NordFit moet precies dat open gevoel geven.",
        panelThreeTitle: "Een bezoek dat schoon eindigt.",
        panelThreeText:
          "Training eindigt niet bij de laatste set. Een rustig einde maakt het bezoek completer.",

        finalTitle: "Rustig in uitstraling. Helder in concept.",
        finalText:
          "Tarieven, locatie en app blijven bewust op eigen pagina’s. NordFit voelt niet voller — maar begrijpelijker.",
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
          "NordFit är ett modernt gymkoncept med lugn design, tydlig struktur och premiumkänsla.",
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
        heroTitle: "Lugnt i rummet. Starkt i träningen.",
        heroSubtitle:
          "Ett modernt studiokoncept med tydligt flöde, rena ytor och träning som inte känns som kaos.",
        primaryCta: "Se priser",
        secondaryCta: "Se plats",
        heroImageAlt: "Exteriör av den planerade NordFit-studion",
        floatingLabel: "Planerat för NordFit",
        floatingText: "Mindre ljud. Mer fokus.",

        feelingTitle: "Inte större. Tydligare.",
        feelingText:
          "NordFit ska inte imponera med intryck, utan med ordning. En studio du förstår direkt — och gärna återvänder till.",

        featureOneTitle: "Anlända",
        featureOneText:
          "Tydlig orientering från första steget. Inget letande, ingen trängsel, ingen onödig process.",
        featureTwoTitle: "Träna",
        featureTwoText:
          "Styrka, cardio och rörelse ska kännas tydligt separerade utan att studion görs konstlat stor.",
        featureThreeTitle: "Varva ner",
        featureThreeText:
          "Efter träningen stannar känslan lugn. Ingen hård brytning, ingen högljudd utgång.",

        panelOneTitle: "Styrka. Utan brus.",
        panelOneText:
          "Styrkeområdet ska kännas direkt, ordnat och fokuserat. Allt du behöver — utan överlastad studiokänsla.",
        panelTwoTitle: "Cardio. Luft. Rörelse.",
        panelTwoText:
          "Uthållighet och fri rörelse behöver plats i rummet och i huvudet. NordFit ska ge just den öppna känslan.",
        panelThreeTitle: "Ett besök som slutar rent.",
        panelThreeText:
          "Träning slutar inte med sista setet. Ett lugnt avslut gör besöket mer komplett.",

        finalTitle: "Tyst i uttrycket. Tydligt i konceptet.",
        finalText:
          "Priser, plats och app ligger medvetet på egna sidor. NordFit känns inte fylligare — utan lättare att förstå.",
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
          "NordFit er et moderne fitnesskoncept med roligt design, klar struktur og premium træningsfølelse.",
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
        heroTitle: "Roligt i rummet. Stærkt i træningen.",
        heroSubtitle:
          "Et moderne studiokoncept med klare veje, rene områder og træning, der ikke føles som kaos.",
        primaryCta: "Se priser",
        secondaryCta: "Se lokation",
        heroImageAlt: "Udvendig visning af det planlagte NordFit-studio",
        floatingLabel: "Planlagt til NordFit",
        floatingText: "Mindre støj. Mere fokus.",

        feelingTitle: "Ikke større. Klarere.",
        feelingText:
          "NordFit skal ikke imponere med indtryk, men med orden. Et studio, man forstår med det samme — og gerne vender tilbage til.",

        featureOneTitle: "Ankomme",
        featureOneText:
          "Klar orientering fra første skridt. Ingen søgen, ingen trængsel, ingen unødvendig proces.",
        featureTwoTitle: "Træne",
        featureTwoText:
          "Styrke, cardio og bevægelse skal føles klart adskilt uden at gøre studiet kunstigt stort.",
        featureThreeTitle: "Falde ned",
        featureThreeText:
          "Efter træning bliver følelsen rolig. Ingen hård afbrydelse, ingen larmende udgang.",

        panelOneTitle: "Styrke. Uden støj.",
        panelOneText:
          "Styrkeområdet skal føles direkte, ryddeligt og fokuseret. Alt det nødvendige — uden overfyldt studiofølelse.",
        panelTwoTitle: "Cardio. Luft. Bevægelse.",
        panelTwoText:
          "Udholdenhed og fri bevægelse har brug for plads i rummet og i hovedet. NordFit skal give netop den åbne følelse.",
        panelThreeTitle: "Et besøg, der ender rent.",
        panelThreeText:
          "Træning slutter ikke ved sidste sæt. En rolig afslutning gør besøget mere helt.",

        finalTitle: "Stille i udtrykket. Klart i konceptet.",
        finalText:
          "Priser, lokation og app bliver bevidst på egne sider. NordFit virker ikke mere fyldt — men lettere at forstå.",
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
          "NordFit er et moderne treningskonsept med rolig design, tydelig struktur og premium treningsfølelse.",
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
        heroTitle: "Rolig i rommet. Sterk i treningen.",
        heroSubtitle:
          "Et moderne studiokonsept med tydelig flyt, rene soner og trening som ikke føles som kaos.",
        primaryCta: "Se priser",
        secondaryCta: "Se lokasjon",
        heroImageAlt: "Utvendig visning av det planlagte NordFit-studioet",
        floatingLabel: "Planlagt for NordFit",
        floatingText: "Mindre støy. Mer fokus.",

        feelingTitle: "Ikke større. Tydeligere.",
        feelingText:
          "NordFit skal ikke imponere med inntrykk, men med orden. Et studio du forstår med en gang — og gjerne kommer tilbake til.",

        featureOneTitle: "Ankomme",
        featureOneText:
          "Tydelig orientering fra første steg. Ingen leting, ingen trengsel, ingen unødvendig prosess.",
        featureTwoTitle: "Trene",
        featureTwoText:
          "Styrke, cardio og bevegelse skal føles tydelig adskilt uten å gjøre studioet kunstig stort.",
        featureThreeTitle: "Roe ned",
        featureThreeText:
          "Etter trening forblir følelsen rolig. Ingen hard avslutning, ingen bråkete utgang.",

        panelOneTitle: "Styrke. Uten støy.",
        panelOneText:
          "Styrkeområdet skal føles direkte, ryddig og fokusert. Alt du trenger — uten overlesset studiofølelse.",
        panelTwoTitle: "Cardio. Luft. Bevegelse.",
        panelTwoText:
          "Utholdenhet og fri bevegelse trenger plass i rommet og i hodet. NordFit skal gi akkurat den åpne følelsen.",
        panelThreeTitle: "Et besøk som ender rent.",
        panelThreeText:
          "Trening slutter ikke med siste sett. En rolig avslutning gjør besøket mer komplett.",

        finalTitle: "Stille i uttrykket. Klart i konseptet.",
        finalText:
          "Priser, lokasjon og app ligger bevisst på egne sider. NordFit føles ikke fullere — men lettere å forstå.",
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
