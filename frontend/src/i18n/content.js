// Bilingual content (IT / EN) for Giacomo Reggianini's site.
// Non-translatable personal data:
export const person = {
  name: "Giacomo Reggianini",
  role: "AI Engineer",
  email: "reggianini.giacomo01@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/giacomo-reggianini-0667bb300/",
    github: "https://github.com/Giacomo117",
    instagram: "https://instagram.com/giacomoreggia_",
  },
};

const projectLinks = {
  autoguardian: "https://github.com/Giacomo117/AutoGuardian",
  drowsiness: "https://github.com/Giacomo117/Drowsiness-State-Detector",
  github: "https://github.com/Giacomo117",
};

export const content = {
  it: {
    nav: {
      home: "Home",
      progetti: "Progetti",
      cosaFaccio: "Cosa Faccio",
      suDiMe: "Su di me",
      contatta: "Contattami",
      dropCosa: [
        { label: "AI & ML", href: "#competenze", desc: "Modelli, deep learning, NLP" },
        { label: "Computer Vision", href: "#competenze", desc: "Detection e analisi immagini" },
        { label: "RAG Systems", href: "#competenze", desc: "Sistemi RAG enterprise" },
        { label: "Sviluppo Software", href: "#competenze", desc: "Backend, API e web app" },
      ],
      dropSu: [
        { label: "Chi sono", href: "#su-di-me", desc: "Profilo personale" },
        { label: "Esperienza", href: "#esperienza", desc: "Percorso professionale" },
        { label: "Formazione", href: "#formazione", desc: "Studi e formazione" },
      ],
    },
    hero: {
      badge: "AI Engineer",
      line1: "Ciao, sono Giacomo",
      line2: "creo soluzioni intelligenti",
      intro:
        "Sistemi RAG, computer vision e AI enterprise — pensati per risolvere problemi reali.",
      cta1: "Esplora i miei lavori",
      cta2: "Mettiti in contatto",
      location: "Modena, Italia",
      mobileBold: "AI Engineering",
      mobileItalic: "per problemi reali",
      mobileCta: "Contattami",
    },
    tech: { title: "Le migliori tecnologie", subtitle: "per i veri esploratori del domani" },
    statements: [
      {
        accent: "blue",
        text:
          "Progetto e sviluppo sistemi intelligenti — da architetture RAG distribuite alla computer vision in tempo reale — trasformando problemi complessi in soluzioni affidabili e pronte alla produzione.",
      },
      {
        accent: "neutral",
        text:
          "Master in AI Engineering all’Università di Modena e Reggio Emilia, con una tesi sui sistemi di Retrieval-Augmented Generation distribuiti e l’orchestrazione multi-client.",
      },
      {
        accent: "violet",
        text:
          "Oggi costruisco soluzioni di AI enterprise e sistemi RAG per le aziende — sempre al lavoro su qualcosa di nuovo ed entusiasmante.",
      },
    ],
    services: {
      kicker: "Cosa faccio",
      titleA: "AI, software e ricerca",
      titleEm: "in armonia",
      intro:
        "Unisco competenze tecniche e sensibilità progettuale per costruire sistemi intelligenti che risolvono problemi reali.",
      items: [
        { tag: "AI & ML", title: "Intelligenza Artificiale", desc: "Modelli su misura, deep learning e automazioni intelligenti che amplificano le capacità del business.", points: ["Deep Learning", "NLP", "LLM & RAG"] },
        { tag: "Computer Vision", title: "Computer Vision", desc: "Applicazioni di visione artificiale in tempo reale per detection, analisi e monitoraggio.", points: ["OpenCV", "PyTorch", "Real-time Detection"] },
        { tag: "Software", title: "Sviluppo Software", desc: "Backend robusti, API e applicazioni web performanti, pensate per scalare.", points: ["Backend & API", "Web App", "Microservices"] },
        { tag: "Enterprise AI", title: "Soluzioni Enterprise", desc: "Architetture cloud-native e sistemi RAG distribuiti per ambienti enterprise.", points: ["RAG Systems", "Cloud / Azure", "Architetture scalabili"] },
      ],
    },
    about: {
      kicker: "Chi sono",
      titleA: "L'ingegnere",
      titleEm: "dietro al codice",
      paragraphs: [
        "Sono Giacomo Reggianini, AI Engineer con base a Modena. Mi occupo di progettare e costruire sistemi intelligenti — dai modelli di computer vision in tempo reale alle architetture RAG distribuite — trasformando problemi complessi in soluzioni affidabili.",
        "Ho conseguito la Laurea Magistrale in Artificial Intelligence Engineering all'Università di Modena e Reggio Emilia con il massimo dei voti, dopo un'esperienza Erasmus all'University of Exeter. Oggi lavoro come AI Software Engineer in E38, dove costruisco soluzioni di AI enterprise per i clienti.",
        "Quando non scrivo codice, mi piace insegnare: faccio tutoring di matematica, fisica e programmazione, perché credo che spiegare sia il modo migliore per capire davvero.",
      ],
      facts: [
        { label: "Base", value: "Modena, Italia" },
        { label: "Ruolo", value: "AI Software Engineer @ E38" },
        { label: "Laurea", value: "AI Engineering · 110L" },
        { label: "Focus", value: "RAG · Computer Vision · LLM" },
      ],
      imageAlt: "Ritratto di Giacomo Reggianini",
    },
    projects: {
      kicker: "Progetti",
      titleA: "Risultati che",
      titleEm: "parlano",
      all: "Tutti i progetti",
      detailsHint: "Clicca per i dettagli",
      swipeHint: "Scorri per vedere tutti",
      association: "In collaborazione con",
      overview: "Panoramica",
      skillsLabel: "Competenze",
      view: "Vedi progetto",
      close: "Chiudi",
    },
    experience: {
      kicker: "Esperienza",
      titleA: "Percorso",
      titleEm: "professionale",
      items: [
        { role: "AI Software Engineer", company: "E38", meta: "Full-time · Da remoto", period: "Feb 2025 - Oggi", desc: "Sviluppo di soluzioni AI enterprise e sistemi RAG per clienti business.", tags: ["Python", "AI/ML", "LangChain", "Microservices"] },
        { role: "Sviluppatore Software Freelance", company: "Libero professionista", meta: "Freelance · Da remoto", period: "Ott 2024 - Feb 2025", desc: "Sviluppo backend e sistemi RAG con LLM per diversi clienti.", tags: ["Backend", "LLM", "RAG Systems", "Python", "Django"] },
        { role: "Tutor Privato", company: "Libero professionista", meta: "Part-time · Modena, Italia", period: "2020 - Oggi", desc: "Insegnamento di matematica, fisica, inglese e informatica a studenti di scuola superiore e università.", tags: ["Matematica", "Fisica", "Programmazione", "Inglese"] },
      ],
    },
    education: {
      kicker: "Formazione",
      titleA: "Percorso",
      titleEm: "accademico",
      thesisLabel: "Tesi:",
      items: [
        { badge: "Laurea Magistrale", field: "Artificial Intelligence Engineering", school: "Università di Modena e Reggio Emilia", location: "Modena, Italia", period: "Set 2023 - Ott 2025", grade: "Voto finale: 110L", thesis: "\"Development of a Distributed Retrieval Augmented Generation System with Multi-Client Orchestration\"", isExchange: false },
        { badge: "Laurea Triennale", field: "Ingegneria Informatica", school: "Università di Modena e Reggio Emilia", location: "Modena, Italia", period: "Set 2020 - Ott 2023", grade: "Voto finale: 107/110", thesis: "Progettazione e sviluppo di un'applicazione di realtà aumentata per il filtraggio del volto su Unity", isExchange: false },
        { badge: "Erasmus+", field: "Computer Engineering", school: "University of Exeter, UK", location: "Exeter, Regno Unito", period: "Gen 2023 - Giu 2023", grade: null, thesis: "Esperienza di studio internazionale nel Regno Unito", isExchange: true },
      ],
    },
    newsletter: {
      title: "Resta connesso",
      subtitle: "Resta in contatto con me così da non perdere nessun aggiornamento",
      placeholder: "Inserisci la tua mail",
      button: "Iscriviti",
      consent: "Autorizzo il trattamento dei dati personali",
      okMsg: "Iscrizione completata. Grazie!",
      errEmail: "Inserisci un indirizzo email valido",
      errConsent: "Devi autorizzare il trattamento dei dati personali",
    },
    contact: {
      kicker: "Contatti",
      titleA: "Mettiamoci",
      titleEm: "in contatto",
      subtitle:
        "Hai un progetto in mente o vuoi semplicemente fare due chiacchiere? Scrivimi su LinkedIn o via email — rispondo sempre.",
      linkedinLabel: "LinkedIn",
      linkedinTitle: "Connettiti con me",
      linkedinDesc: "Per opportunità professionali e networking",
      emailLabel: "Email",
      emailDesc: "Per progetti, collaborazioni o domande",
      copyBtn: "Copia indirizzo email",
      copied: "Email copiata!",
      copiedOk: "Email copiata negli appunti",
      copiedErr: "Impossibile copiare l'email",
    },
    footer: {
      tagline: "Per aspera ad astra",
      follow: "Seguimi",
      columns: [
        { title: "HOME", links: [{ label: "Home", href: "#home" }] },
        { title: "PROGETTI", links: [{ label: "Progetti", href: "#progetti" }] },
        { title: "COSA FACCIO", links: [
          { label: "AI & ML", href: "#competenze" },
          { label: "Computer Vision", href: "#competenze" },
          { label: "RAG Systems", href: "#competenze" },
          { label: "Sviluppo Software", href: "#competenze" },
        ] },
        { title: "SU DI ME", links: [
          { label: "Chi sono", href: "#su-di-me" },
          { label: "Esperienza", href: "#esperienza" },
          { label: "Formazione", href: "#formazione" },
        ] },
        { title: "CONTATTI", links: [{ label: "Contattami", href: "#contattaci" }] },
      ],
      contactsLabel: "Contatti",
      legal: "© 2025 Giacomo Reggianini — AI Engineer — Modena, Italia",
      bottom: [
        { label: "Progetti", href: "#progetti" },
        { label: "Contatti", href: "#contattaci" },
      ],
      back: "Torna su",
    },
  },

  en: {
    nav: {
      home: "Home",
      progetti: "Projects",
      cosaFaccio: "What I Do",
      suDiMe: "About me",
      contatta: "Contact me",
      dropCosa: [
        { label: "AI & ML", href: "#competenze", desc: "Models, deep learning, NLP" },
        { label: "Computer Vision", href: "#competenze", desc: "Detection & image analysis" },
        { label: "RAG Systems", href: "#competenze", desc: "Enterprise RAG systems" },
        { label: "Software Development", href: "#competenze", desc: "Backend, APIs & web apps" },
      ],
      dropSu: [
        { label: "About", href: "#su-di-me", desc: "Personal profile" },
        { label: "Experience", href: "#esperienza", desc: "Professional journey" },
        { label: "Education", href: "#formazione", desc: "Studies & formation" },
      ],
    },
    hero: {
      badge: "AI Engineer",
      line1: "Hi, I'm Giacomo",
      line2: "crafting intelligent solutions",
      intro:
        "RAG systems, computer vision and enterprise AI — built to solve real-world problems.",
      cta1: "Explore My Work",
      cta2: "Get in Touch",
      location: "Modena, Italy",
      mobileBold: "AI Engineering",
      mobileItalic: "for real-world problems",
      mobileCta: "Contact me",
    },
    tech: { title: "The best technologies", subtitle: "for the true explorers of tomorrow" },
    statements: [
      {
        accent: "blue",
        text:
          "I design and build intelligent systems — from distributed RAG architectures to real-time computer vision — turning complex problems into reliable, production-ready solutions.",
      },
      {
        accent: "neutral",
        text:
          "Master in AI Engineering at the University of Modena and Reggio Emilia, with a thesis on distributed Retrieval-Augmented Generation systems and multi-client orchestration.",
      },
      {
        accent: "violet",
        text:
          "Today I build enterprise AI solutions and RAG systems for businesses — always working on something new and exciting.",
      },
    ],
    services: {
      kicker: "What I do",
      titleA: "AI, software and research",
      titleEm: "in harmony",
      intro:
        "I combine technical skills and design sensibility to build intelligent systems that solve real-world problems.",
      items: [
        { tag: "AI & ML", title: "Artificial Intelligence", desc: "Custom models, deep learning and intelligent automation that amplify business capabilities.", points: ["Deep Learning", "NLP", "LLM & RAG"] },
        { tag: "Computer Vision", title: "Computer Vision", desc: "Real-time computer vision applications for detection, analysis and monitoring.", points: ["OpenCV", "PyTorch", "Real-time Detection"] },
        { tag: "Software", title: "Software Development", desc: "Robust backends, APIs and performant web applications, built to scale.", points: ["Backend & API", "Web App", "Microservices"] },
        { tag: "Enterprise AI", title: "Enterprise Solutions", desc: "Cloud-native architectures and distributed RAG systems for enterprise environments.", points: ["RAG Systems", "Cloud / Azure", "Scalable architectures"] },
      ],
    },
    about: {
      kicker: "About me",
      titleA: "The engineer",
      titleEm: "behind the code",
      paragraphs: [
        "I'm Giacomo Reggianini, an AI Engineer based in Modena. I design and build intelligent systems — from real-time computer vision models to distributed RAG architectures — turning complex problems into reliable solutions.",
        "I earned my Master's degree in Artificial Intelligence Engineering at the University of Modena and Reggio Emilia with top honors, after an Erasmus exchange at the University of Exeter. Today I work as an AI Software Engineer at E38, where I build enterprise AI solutions for clients.",
        "When I'm not writing code I enjoy teaching: I tutor maths, physics and programming, because explaining something is the best way to truly understand it.",
      ],
      facts: [
        { label: "Based in", value: "Modena, Italy" },
        { label: "Role", value: "AI Software Engineer @ E38" },
        { label: "Degree", value: "AI Engineering · 110L" },
        { label: "Focus", value: "RAG · Computer Vision · LLM" },
      ],
      imageAlt: "Portrait of Giacomo Reggianini",
    },
    projects: {
      kicker: "Projects",
      titleA: "Results that",
      titleEm: "speak",
      all: "All projects",
      detailsHint: "Click for details",
      swipeHint: "Swipe to see all",
      association: "In association with",
      overview: "Overview",
      skillsLabel: "Skills",
      view: "View project",
      close: "Close",
    },
    experience: {
      kicker: "Experience",
      titleA: "Professional",
      titleEm: "journey",
      items: [
        { role: "AI Software Engineer", company: "E38", meta: "Full-time · Remote", period: "Feb 2025 - Current", desc: "Developing enterprise AI solutions and RAG systems for business clients.", tags: ["Python", "AI/ML", "LangChain", "Microservices"] },
        { role: "Freelance Software Developer", company: "Self-employed", meta: "Freelance · Remote", period: "Oct 2024 - Feb 2025", desc: "Backend development and LLM RAG systems for various clients.", tags: ["Backend", "LLM", "RAG Systems", "Python", "Django"] },
        { role: "Private Tutor", company: "Self-employed", meta: "Part-time · Modena, Italy", period: "2020 - Current", desc: "Teaching mathematics, physics, English, and computer science to high school and university students.", tags: ["Mathematics", "Physics", "Programming", "English"] },
      ],
    },
    education: {
      kicker: "Education",
      titleA: "Academic",
      titleEm: "path",
      thesisLabel: "Thesis:",
      items: [
        { badge: "Master's Degree", field: "Artificial Intelligence Engineering", school: "University of Modena and Reggio Emilia", location: "Modena, Italy", period: "Sep 2023 - Oct 2025", grade: "Final Grade: 110L", thesis: "\"Development of a Distributed Retrieval Augmented Generation System with Multi-Client Orchestration\"", isExchange: false },
        { badge: "Bachelor's Degree", field: "Computer Engineering", school: "University of Modena and Reggio Emilia", location: "Modena, Italy", period: "Sep 2020 - Oct 2023", grade: "Final Grade: 107/110", thesis: "Design and development of an augmented reality application for face filtering on Unity", isExchange: false },
        { badge: "Erasmus+ Exchange", field: "Computer Engineering", school: "University of Exeter, UK", location: "Exeter, United Kingdom", period: "Jan 2023 - Jun 2023", grade: null, thesis: "International study experience in the United Kingdom", isExchange: true },
      ],
    },
    newsletter: {
      title: "Stay connected",
      subtitle: "Stay in touch with me so you don't miss any update",
      placeholder: "Enter your email",
      button: "Subscribe",
      consent: "I authorize the processing of personal data",
      okMsg: "Subscription completed. Thank you!",
      errEmail: "Please enter a valid email address",
      errConsent: "You must authorize the processing of personal data",
    },
    contact: {
      kicker: "Contact",
      titleA: "Let's get",
      titleEm: "in touch",
      subtitle:
        "Got a project in mind or just want to chat? Reach out on LinkedIn or via email — I always reply.",
      linkedinLabel: "LinkedIn",
      linkedinTitle: "Connect with me",
      linkedinDesc: "For professional opportunities and networking",
      emailLabel: "Email",
      emailDesc: "For projects, collaborations or questions",
      copyBtn: "Copy email address",
      copied: "Email copied!",
      copiedOk: "Email copied to clipboard",
      copiedErr: "Could not copy email",
    },
    footer: {
      tagline: "Per aspera ad astra",
      follow: "Follow me",
      columns: [
        { title: "HOME", links: [{ label: "Home", href: "#home" }] },
        { title: "PROJECTS", links: [{ label: "Projects", href: "#progetti" }] },
        { title: "WHAT I DO", links: [
          { label: "AI & ML", href: "#competenze" },
          { label: "Computer Vision", href: "#competenze" },
          { label: "RAG Systems", href: "#competenze" },
          { label: "Software Development", href: "#competenze" },
        ] },
        { title: "ABOUT ME", links: [
          { label: "About", href: "#su-di-me" },
          { label: "Experience", href: "#esperienza" },
          { label: "Education", href: "#formazione" },
        ] },
        { title: "CONTACT", links: [{ label: "Contact me", href: "#contattaci" }] },
      ],
      contactsLabel: "Contact",
      legal: "© 2025 Giacomo Reggianini — AI Engineer — Modena, Italy",
      bottom: [
        { label: "Projects", href: "#progetti" },
        { label: "Contact", href: "#contattaci" },
      ],
      back: "Back to top",
    },
  },
};
