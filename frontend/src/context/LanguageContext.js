import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const languages = {
  en: { code: 'en', name: 'English', flagImg: '/inglese.png' },
  it: { code: 'it', name: 'Italiano', flagImg: '/italia.png' },
  fr: { code: 'fr', name: 'Français', flagImg: '/francia.png' },
  es: { code: 'es', name: 'Español', flagImg: '/spagna.png' },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// All translations
const translations = {
  en: {
    nav: {
      projects: 'Projects',
      formation: 'Formation',
      experience: 'Experience',
      contact: 'Contact',
      chat: 'Chat with AI',
    },
    hero: {
      welcome: 'Welcome to my portfolio',
      greeting: "Hi, I'm",
      name: 'Giacomo',
      role: 'AI Engineer',
      roleShort: 'AI Engineer crafting intelligent solutions',
      description: 'I build intelligent systems that solve real-world problems. Specialized in RAG systems, computer vision, and enterprise AI solutions.',
      cta: 'Explore My Work',
      chatCta: 'Chat with AI',
    },
    projects: {
      title: 'Featured',
      titleHighlight: 'Projects',
      subtitle: 'Innovative solutions leveraging AI, IoT, and enterprise architectures',
      learnMore: 'Learn More',
      viewGithub: 'View on GitHub',
      askAI: 'Ask AI about this',
      civetta: {
        title: 'Civetta - Enterprise RAG Platform',
        description: 'A distributed Retrieval-Augmented Generation (RAG) system serving as an intelligent virtual assistant for enterprise environments, built on scalable microservices architecture with multi-tenant support and no-code document management capabilities.',
      },
      autoguardian: {
        title: 'AutoGuardian',
        description: 'A modular IoT platform for vehicle safety monitoring and neighbor-aware emergency alerting, featuring real-time telemetry processing, anomaly detection, and distributed alert dissemination.',
      },
      drowsiness: {
        title: 'Drowsiness State Detector',
        description: 'A multi-model computer vision application for real-time driver drowsiness detection, composed of three standalone deep learning models working in parallel through multi-threaded processing.',
      },
      more: {
        title: 'And Many More!',
        description: 'Explore my other projects including mobile applications, web services, and research work in AI and distributed systems. Always working on something new and exciting!',
      },
    },
    formation: {
      title: 'Education &',
      titleHighlight: 'Formation',
      subtitle: 'Academic journey and continuous learning path',
      master: {
        degree: "Master's Degree",
        field: 'Artificial Intelligence Engineering',
        university: 'University of Modena and Reggio Emilia',
        grade: 'Grade: 110L cum laude',
        thesis: 'Thesis: "Development of a Distributed Retrieval Augmented Generation System with Multi-Client Orchestration"',
      },
      bachelor: {
        degree: "Bachelor's Degree",
        field: 'Computer Engineering',
        university: 'University of Modena and Reggio Emilia',
        grade: 'Grade: 107/110',
      },
      erasmus: {
        program: 'Erasmus+ Exchange',
        university: 'University of Exeter, UK',
        description: 'International study experience in the United Kingdom',
      },
    },
    experience: {
      title: 'Work',
      titleHighlight: 'Experience',
      subtitle: 'Professional journey in software development and AI',
      current: 'Current',
      e38: {
        role: 'AI Software Engineer',
        company: 'E38',
        description: 'Developing enterprise AI solutions and RAG systems for business clients.',
      },
      freelance: {
        role: 'Freelance Software Developer',
        company: 'Self-employed',
        description: 'Backend development and LLM RAG systems for various clients.',
      },
      tutor: {
        role: 'Private Tutor',
        company: 'Self-employed',
        location: 'Modena, Italy',
        type: 'Part-time',
        description: 'Teaching mathematics, physics, English, and computer science to high school and university students.',
      },
    },
    contact: {
      title: 'Get in',
      titleHighlight: 'Touch',
      subtitle: "Have a project in mind? Let's collaborate and build something amazing together.",
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      locationValue: 'Modena, Italy',
      social: 'Social',
      chatTitle: 'Or chat with my AI assistant',
      chatDescription: 'Get instant answers about my work, skills, and availability.',
      chatButton: 'Start AI Chat',
      contactInfo: 'Contact Information',
      connectWith: 'Connect with me',
      ctaTitle: "Let's Build Something Amazing",
      ctaDescription: "I'm currently available for freelance work and open to discussing new opportunities in AI engineering, distributed systems, and enterprise solutions.",
      sendEmail: 'Send me an Email',
      connectLinkedIn: 'Connect on LinkedIn',
    },
    footer: {
      rights: 'All rights reserved.',
      madeWith: 'Made with',
      and: 'and',
    },
    terminal: {
      welcome: "Welcome to Giacomo's Interactive Terminal v2.0",
      helpText: "Ask me what you want! Or type 'help' for available commands.",
      loading: 'Loading Portfolio...',
      placeholder: 'Type a command or ask anything...',
      help: {
        title: 'Available commands:',
        help: 'Show this help message',
        ls: 'List directory contents',
        lsla: 'List all files including hidden',
        cd: 'Change directory',
        cat: 'Display file contents',
        pwd: 'Print working directory',
        clear: 'Clear terminal',
        whoami: 'Display current user',
        date: 'Show current date/time',
        echo: 'Print text',
        neofetch: 'System information',
        aiHint: 'Or just type any question to ask the AI about Giacomo.',
      },
    },
    chat: {
      openButton: 'Open AI Chat',
      projectQuestion: 'What would you like to know about',
      moreProjects: 'What other projects has Giacomo worked on?',
    },
    voice: {
      title: 'Ask Me Anything',
      subtitle: 'Curious about my projects, skills, or experience? Just ask!',
      recording: 'Recording...',
      transcribing: 'Transcribing...',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      speakClearly: "Speak clearly, then click 'Stop Recording' when done",
      clickButton: 'Click the button and ask me anything about my projects, skills, or experience!',
    },
  },
  it: {
    nav: {
      projects: 'Progetti',
      formation: 'Formazione',
      experience: 'Esperienza',
      contact: 'Contatti',
      chat: 'Chatta con AI',
    },
    hero: {
      welcome: 'Benvenuto nel mio portfolio',
      greeting: 'Ciao, sono',
      name: 'Giacomo',
      role: 'AI Engineer',
      roleShort: 'AI Engineer che crea soluzioni intelligenti',
      description: 'Costruisco sistemi intelligenti che risolvono problemi reali. Specializzato in sistemi RAG, computer vision e soluzioni AI enterprise.',
      cta: 'Esplora i Miei Lavori',
      chatCta: 'Chatta con AI',
    },
    projects: {
      title: 'Progetti',
      titleHighlight: 'in Evidenza',
      subtitle: 'Soluzioni innovative che sfruttano AI, IoT e architetture enterprise',
      learnMore: 'Scopri di Più',
      viewGithub: 'Vedi su GitHub',
      askAI: "Chiedi all'AI",
      civetta: {
        title: 'Civetta - Piattaforma RAG Enterprise',
        description: 'Un sistema distribuito di Retrieval-Augmented Generation (RAG) che funge da assistente virtuale intelligente per ambienti enterprise, costruito su architettura microservizi scalabile con supporto multi-tenant e gestione documenti no-code.',
      },
      autoguardian: {
        title: 'AutoGuardian',
        description: 'Una piattaforma IoT modulare per il monitoraggio della sicurezza dei veicoli e allerta di emergenza tra veicoli vicini, con elaborazione telemetrica in tempo reale, rilevamento anomalie e diffusione distribuita degli allarmi.',
      },
      drowsiness: {
        title: 'Rilevatore Stato Sonnolenza',
        description: "Un'applicazione multi-modello di computer vision per il rilevamento in tempo reale della sonnolenza del conducente, composta da tre modelli di deep learning standalone che lavorano in parallelo tramite elaborazione multi-thread.",
      },
      more: {
        title: 'E Molti Altri!',
        description: 'Esplora i miei altri progetti tra cui applicazioni mobile, servizi web e lavori di ricerca in AI e sistemi distribuiti. Sempre al lavoro su qualcosa di nuovo ed entusiasmante!',
      },
    },
    formation: {
      title: 'Istruzione e',
      titleHighlight: 'Formazione',
      subtitle: 'Percorso accademico e apprendimento continuo',
      master: {
        degree: 'Laurea Magistrale',
        field: 'Ingegneria Intelligenza Artificiale',
        university: 'Università di Modena e Reggio Emilia',
        grade: 'Voto: 110L con lode',
        thesis: 'Development of a Distributed Retrieval Augmented Generation System with Multi-Client Orchestration',
      },
      bachelor: {
        degree: 'Laurea Triennale',
        field: 'Ingegneria Informatica',
        university: 'Università di Modena e Reggio Emilia',
        grade: 'Voto: 107/110',
      },
      erasmus: {
        program: 'Erasmus+ Scambio',
        university: 'University of Exeter, UK',
        description: 'Esperienza di studio internazionale nel Regno Unito',
      },
    },
    experience: {
      title: 'Esperienza',
      titleHighlight: 'Lavorativa',
      subtitle: 'Percorso professionale nello sviluppo software e AI',
      current: 'Attuale',
      e38: {
        role: 'AI Software Engineer',
        company: 'E38',
        description: 'Sviluppo di soluzioni AI enterprise e sistemi RAG per clienti aziendali.',
      },
      freelance: {
        role: 'Sviluppatore Software Freelance',
        company: 'Libero professionista',
        description: 'Sviluppo backend e sistemi RAG LLM per vari clienti.',
      },
      tutor: {
        role: 'Tutor Privato',
        company: 'Libero professionista',
        location: 'Modena, Italia',
        type: 'Part-time',
        description: 'Insegnamento di matematica, fisica, inglese e informatica a studenti delle superiori e universitari.',
      },
    },
    contact: {
      title: 'Resta in',
      titleHighlight: 'Contatto',
      subtitle: 'Hai un progetto in mente? Collaboriamo e costruiamo qualcosa di straordinario insieme.',
      email: 'Email',
      phone: 'Telefono',
      location: 'Posizione',
      locationValue: 'Modena, Italia',
      social: 'Social',
      chatTitle: 'Oppure chatta con il mio assistente AI',
      chatDescription: 'Ottieni risposte immediate sul mio lavoro, competenze e disponibilità.',
      chatButton: 'Avvia Chat AI',
      contactInfo: 'Informazioni di Contatto',
      connectWith: 'Connettiti con me',
      ctaTitle: 'Costruiamo Qualcosa di Straordinario',
      ctaDescription: 'Sono attualmente disponibile per lavoro freelance e aperto a discutere nuove opportunità in ingegneria AI, sistemi distribuiti e soluzioni enterprise.',
      sendEmail: 'Inviami una Email',
      connectLinkedIn: 'Connettiti su LinkedIn',
    },
    footer: {
      rights: 'Tutti i diritti riservati.',
      madeWith: 'Fatto con',
      and: 'e',
    },
    terminal: {
      welcome: 'Benvenuto nel Terminale Interattivo di Giacomo v2.0',
      helpText: "Chiedimi quello che vuoi! Oppure scrivi 'help' per i comandi disponibili.",
      loading: 'Caricamento Portfolio...',
      placeholder: 'Scrivi un comando o chiedi qualsiasi cosa...',
      help: {
        title: 'Comandi disponibili:',
        help: 'Mostra questo messaggio di aiuto',
        ls: 'Elenca contenuti directory',
        lsla: 'Elenca tutti i file inclusi nascosti',
        cd: 'Cambia directory',
        cat: 'Mostra contenuto file',
        pwd: 'Stampa directory corrente',
        clear: 'Pulisci terminale',
        whoami: 'Mostra utente corrente',
        date: 'Mostra data/ora corrente',
        echo: 'Stampa testo',
        neofetch: 'Informazioni sistema',
        aiHint: "Oppure scrivi qualsiasi domanda per chiedere all'AI riguardo Giacomo.",
      },
    },
    chat: {
      openButton: 'Apri Chat AI',
      projectQuestion: 'Cosa vorresti sapere su',
      moreProjects: 'Su quali altri progetti ha lavorato Giacomo?',
    },
    voice: {
      title: 'Chiedimi Qualsiasi Cosa',
      subtitle: 'Curioso dei miei progetti, competenze o esperienza? Chiedi pure!',
      recording: 'Registrazione...',
      transcribing: 'Trascrizione...',
      startRecording: 'Inizia Registrazione',
      stopRecording: 'Ferma Registrazione',
      speakClearly: "Parla chiaramente, poi clicca 'Ferma Registrazione' quando hai finito",
      clickButton: 'Clicca il pulsante e chiedimi qualsiasi cosa sui miei progetti, competenze o esperienza!',
    },
  },
  fr: {
    nav: {
      projects: 'Projets',
      formation: 'Formation',
      experience: 'Expérience',
      contact: 'Contact',
      chat: "Discuter avec l'IA",
    },
    hero: {
      welcome: 'Bienvenue sur mon portfolio',
      greeting: 'Bonjour, je suis',
      name: 'Giacomo',
      role: 'Ingénieur IA',
      roleShort: 'Ingénieur IA créant des solutions intelligentes',
      description: 'Je construis des systèmes intelligents qui résolvent des problèmes réels. Spécialisé dans les systèmes RAG, la vision par ordinateur et les solutions IA entreprise.',
      cta: 'Découvrir Mon Travail',
      chatCta: "Discuter avec l'IA",
    },
    projects: {
      title: 'Projets',
      titleHighlight: 'Vedettes',
      subtitle: "Solutions innovantes utilisant l'IA, l'IoT et les architectures entreprise",
      learnMore: 'En Savoir Plus',
      viewGithub: 'Voir sur GitHub',
      askAI: "Demander à l'IA",
      civetta: {
        title: 'Civetta - Plateforme RAG Entreprise',
        description: "Un système distribué de Retrieval-Augmented Generation (RAG) servant d'assistant virtuel intelligent pour les environnements entreprise, construit sur une architecture microservices évolutive avec support multi-locataires et gestion de documents no-code.",
      },
      autoguardian: {
        title: 'AutoGuardian',
        description: "Une plateforme IoT modulaire pour la surveillance de la sécurité des véhicules et l'alerte d'urgence entre véhicules voisins, avec traitement télémétrique en temps réel, détection d'anomalies et diffusion distribuée des alertes.",
      },
      drowsiness: {
        title: 'Détecteur de Somnolence',
        description: 'Une application multi-modèle de vision par ordinateur pour la détection en temps réel de la somnolence du conducteur, composée de trois modèles de deep learning autonomes travaillant en parallèle via un traitement multi-thread.',
      },
      more: {
        title: 'Et Bien Plus!',
        description: "Découvrez mes autres projets incluant des applications mobiles, des services web et des travaux de recherche en IA et systèmes distribués. Toujours en train de travailler sur quelque chose de nouveau et passionnant!",
      },
    },
    formation: {
      title: 'Éducation et',
      titleHighlight: 'Formation',
      subtitle: 'Parcours académique et apprentissage continu',
      master: {
        degree: 'Master',
        field: "Ingénierie de l'Intelligence Artificielle",
        university: 'Université de Modène et Reggio Émilie',
        grade: 'Note: 110L avec félicitations',
        thesis: 'Thèse: "Développement d\'un Système Distribué de Retrieval Augmented Generation avec Orchestration Multi-Client"',
      },
      bachelor: {
        degree: 'Licence',
        field: 'Ingénierie Informatique',
        university: 'Université de Modène et Reggio Émilie',
        grade: 'Note: 107/110',
      },
      erasmus: {
        program: 'Échange Erasmus+',
        university: 'Université d\'Exeter, UK',
        description: "Expérience d'études internationale au Royaume-Uni",
      },
    },
    experience: {
      title: 'Expérience',
      titleHighlight: 'Professionnelle',
      subtitle: "Parcours professionnel dans le développement logiciel et l'IA",
      current: 'Actuel',
      e38: {
        role: 'Ingénieur Logiciel IA',
        company: 'E38',
        description: "Développement de solutions IA entreprise et systèmes RAG pour clients professionnels.",
      },
      freelance: {
        role: 'Développeur Logiciel Freelance',
        company: 'Indépendant',
        description: 'Développement backend et systèmes RAG LLM pour divers clients.',
      },
      tutor: {
        role: 'Tuteur Privé',
        company: 'Indépendant',
        location: 'Modène, Italie',
        type: 'Temps partiel',
        description: 'Enseignement des mathématiques, physique, anglais et informatique aux lycéens et étudiants universitaires.',
      },
    },
    contact: {
      title: 'Restons en',
      titleHighlight: 'Contact',
      subtitle: "Vous avez un projet en tête? Collaborons et construisons quelque chose d'incroyable ensemble.",
      email: 'Email',
      phone: 'Téléphone',
      location: 'Localisation',
      locationValue: 'Modène, Italie',
      social: 'Réseaux Sociaux',
      chatTitle: 'Ou discutez avec mon assistant IA',
      chatDescription: 'Obtenez des réponses instantanées sur mon travail, mes compétences et ma disponibilité.',
      chatButton: 'Démarrer Chat IA',
      contactInfo: 'Informations de Contact',
      connectWith: 'Connectez-vous avec moi',
      ctaTitle: 'Construisons Quelque Chose d\'Incroyable',
      ctaDescription: 'Je suis actuellement disponible pour du travail freelance et ouvert à discuter de nouvelles opportunités en ingénierie IA, systèmes distribués et solutions entreprise.',
      sendEmail: 'Envoyez-moi un Email',
      connectLinkedIn: 'Connectez-vous sur LinkedIn',
    },
    footer: {
      rights: 'Tous droits réservés.',
      madeWith: 'Fait avec',
      and: 'et',
    },
    terminal: {
      welcome: 'Bienvenue dans le Terminal Interactif de Giacomo v2.0',
      helpText: "Demandez-moi ce que vous voulez! Ou tapez 'help' pour les commandes disponibles.",
      loading: 'Chargement du Portfolio...',
      placeholder: 'Tapez une commande ou posez une question...',
      help: {
        title: 'Commandes disponibles:',
        help: "Afficher ce message d'aide",
        ls: 'Lister le contenu du répertoire',
        lsla: 'Lister tous les fichiers y compris cachés',
        cd: 'Changer de répertoire',
        cat: 'Afficher le contenu du fichier',
        pwd: 'Afficher le répertoire courant',
        clear: 'Effacer le terminal',
        whoami: "Afficher l'utilisateur courant",
        date: "Afficher la date/heure",
        echo: 'Afficher du texte',
        neofetch: 'Informations système',
        aiHint: "Ou tapez simplement une question pour demander à l'IA à propos de Giacomo.",
      },
    },
    chat: {
      openButton: 'Ouvrir Chat IA',
      projectQuestion: 'Que voulez-vous savoir sur',
      moreProjects: 'Sur quels autres projets Giacomo a-t-il travaillé?',
    },
    voice: {
      title: 'Demandez-Moi N\'importe Quoi',
      subtitle: 'Curieux de mes projets, compétences ou expérience? Demandez simplement!',
      recording: 'Enregistrement...',
      transcribing: 'Transcription...',
      startRecording: 'Démarrer l\'Enregistrement',
      stopRecording: 'Arrêter l\'Enregistrement',
      speakClearly: "Parlez clairement, puis cliquez sur 'Arrêter l'Enregistrement' quand c'est fini",
      clickButton: 'Cliquez sur le bouton et demandez-moi n\'importe quoi sur mes projets, compétences ou expérience!',
    },
  },
  es: {
    nav: {
      projects: 'Proyectos',
      formation: 'Formación',
      experience: 'Experiencia',
      contact: 'Contacto',
      chat: 'Chatear con IA',
    },
    hero: {
      welcome: 'Bienvenido a mi portfolio',
      greeting: 'Hola, soy',
      name: 'Giacomo',
      role: 'Ingeniero de IA',
      roleShort: 'Ingeniero de IA creando soluciones inteligentes',
      description: 'Construyo sistemas inteligentes que resuelven problemas reales. Especializado en sistemas RAG, visión por computadora y soluciones de IA empresarial.',
      cta: 'Explorar Mi Trabajo',
      chatCta: 'Chatear con IA',
    },
    projects: {
      title: 'Proyectos',
      titleHighlight: 'Destacados',
      subtitle: 'Soluciones innovadoras aprovechando IA, IoT y arquitecturas empresariales',
      learnMore: 'Saber Más',
      viewGithub: 'Ver en GitHub',
      askAI: 'Preguntar a la IA',
      civetta: {
        title: 'Civetta - Plataforma RAG Empresarial',
        description: 'Un sistema distribuido de Retrieval-Augmented Generation (RAG) que sirve como asistente virtual inteligente para entornos empresariales, construido sobre arquitectura de microservicios escalable con soporte multi-tenant y gestión de documentos sin código.',
      },
      autoguardian: {
        title: 'AutoGuardian',
        description: 'Una plataforma IoT modular para monitoreo de seguridad vehicular y alertas de emergencia entre vehículos cercanos, con procesamiento telemétrico en tiempo real, detección de anomalías y difusión distribuida de alertas.',
      },
      drowsiness: {
        title: 'Detector de Somnolencia',
        description: 'Una aplicación multi-modelo de visión por computadora para detección en tiempo real de somnolencia del conductor, compuesta por tres modelos de deep learning independientes trabajando en paralelo mediante procesamiento multi-hilo.',
      },
      more: {
        title: '¡Y Muchos Más!',
        description: 'Explora mis otros proyectos incluyendo aplicaciones móviles, servicios web y trabajo de investigación en IA y sistemas distribuidos. ¡Siempre trabajando en algo nuevo y emocionante!',
      },
    },
    formation: {
      title: 'Educación y',
      titleHighlight: 'Formación',
      subtitle: 'Trayectoria académica y aprendizaje continuo',
      master: {
        degree: 'Maestría',
        field: 'Ingeniería de Inteligencia Artificial',
        university: 'Universidad de Módena y Reggio Emilia',
        grade: 'Nota: 110L cum laude',
        thesis: 'Tesis: "Desarrollo de un Sistema Distribuido de Retrieval Augmented Generation con Orquestación Multi-Cliente"',
      },
      bachelor: {
        degree: 'Licenciatura',
        field: 'Ingeniería Informática',
        university: 'Universidad de Módena y Reggio Emilia',
        grade: 'Nota: 107/110',
      },
      erasmus: {
        program: 'Intercambio Erasmus+',
        university: 'Universidad de Exeter, UK',
        description: 'Experiencia de estudios internacional en el Reino Unido',
      },
    },
    experience: {
      title: 'Experiencia',
      titleHighlight: 'Laboral',
      subtitle: 'Trayectoria profesional en desarrollo de software e IA',
      current: 'Actual',
      e38: {
        role: 'Ingeniero de Software IA',
        company: 'E38',
        description: 'Desarrollo de soluciones de IA empresarial y sistemas RAG para clientes corporativos.',
      },
      freelance: {
        role: 'Desarrollador de Software Freelance',
        company: 'Autónomo',
        description: 'Desarrollo backend y sistemas RAG LLM para diversos clientes.',
      },
      tutor: {
        role: 'Tutor Privado',
        company: 'Autónomo',
        location: 'Módena, Italia',
        type: 'Tiempo parcial',
        description: 'Enseñanza de matemáticas, física, inglés e informática a estudiantes de secundaria y universitarios.',
      },
    },
    contact: {
      title: 'Ponte en',
      titleHighlight: 'Contacto',
      subtitle: '¿Tienes un proyecto en mente? Colaboremos y construyamos algo increíble juntos.',
      email: 'Correo',
      phone: 'Teléfono',
      location: 'Ubicación',
      locationValue: 'Módena, Italia',
      social: 'Redes Sociales',
      chatTitle: 'O chatea con mi asistente de IA',
      chatDescription: 'Obtén respuestas instantáneas sobre mi trabajo, habilidades y disponibilidad.',
      chatButton: 'Iniciar Chat IA',
      contactInfo: 'Información de Contacto',
      connectWith: 'Conéctate conmigo',
      ctaTitle: 'Construyamos Algo Increíble',
      ctaDescription: 'Actualmente estoy disponible para trabajo freelance y abierto a discutir nuevas oportunidades en ingeniería de IA, sistemas distribuidos y soluciones empresariales.',
      sendEmail: 'Envíame un Email',
      connectLinkedIn: 'Conectar en LinkedIn',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      madeWith: 'Hecho con',
      and: 'y',
    },
    terminal: {
      welcome: 'Bienvenido al Terminal Interactivo de Giacomo v2.0',
      helpText: "¡Pregúntame lo que quieras! O escribe 'help' para comandos disponibles.",
      loading: 'Cargando Portfolio...',
      placeholder: 'Escribe un comando o pregunta cualquier cosa...',
      help: {
        title: 'Comandos disponibles:',
        help: 'Mostrar este mensaje de ayuda',
        ls: 'Listar contenido del directorio',
        lsla: 'Listar todos los archivos incluyendo ocultos',
        cd: 'Cambiar directorio',
        cat: 'Mostrar contenido del archivo',
        pwd: 'Imprimir directorio actual',
        clear: 'Limpiar terminal',
        whoami: 'Mostrar usuario actual',
        date: 'Mostrar fecha/hora actual',
        echo: 'Imprimir texto',
        neofetch: 'Información del sistema',
        aiHint: 'O simplemente escribe cualquier pregunta para preguntar a la IA sobre Giacomo.',
      },
    },
    chat: {
      openButton: 'Abrir Chat IA',
      projectQuestion: '¿Qué te gustaría saber sobre',
      moreProjects: '¿En qué otros proyectos ha trabajado Giacomo?',
    },
    voice: {
      title: 'Pregúntame Cualquier Cosa',
      subtitle: '¿Curioso sobre mis proyectos, habilidades o experiencia? ¡Solo pregunta!',
      recording: 'Grabando...',
      transcribing: 'Transcribiendo...',
      startRecording: 'Iniciar Grabación',
      stopRecording: 'Detener Grabación',
      speakClearly: "Habla claramente, luego haz clic en 'Detener Grabación' cuando termines",
      clickButton: '¡Haz clic en el botón y pregúntame cualquier cosa sobre mis proyectos, habilidades o experiencia!',
    },
  },
};
