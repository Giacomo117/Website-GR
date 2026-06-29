// Rich project data (English descriptions, as provided by Giacomo).
// Shared across languages; UI labels are translated separately.

export const projectsData = [
  {
    id: "civetta",
    category: "Enterprise RAG",
    title: "Civetta — Enterprise RAG Platform",
    tech: "Python · JavaScript · Microservices",
    year: "2025",
    association: "E38",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&auto=format&fit=crop",
    summary:
      "A distributed Retrieval-Augmented Generation (RAG) system serving as an intelligent virtual assistant for enterprise environments, built on scalable microservices architecture with multi-tenant support and no-code document management capabilities. The system combines advanced document processing, vector search, and LLM orchestration to deliver domain-specific AI assistance across legal, business intelligence, and customer support sectors.",
    sections: [
      {
        heading: "Core Architecture",
        items: [
          "Microservices Implementation: TypeScript-based orchestrator and frontend with Python-based RAG pipeline, ensuring production-level robustness and research-grade flexibility for document processing.",
          "Multi-Modal Document Processing: Four specialized chunking pipelines including Mistral OCR for PDFs, Semantic chunking, Section-based analysis, and LLaMA 3 70B Z-chunking for optimal content segmentation.",
          "Advanced RAG Pipeline: Redis-based vector database with similarity search, image processing integration using vision models, and contextual caption generation through o1-mini LLM refinement.",
        ],
      },
      {
        heading: "Enterprise Features",
        text:
          "Multi-tenant orchestration with client isolation and dynamic onboarding capabilities. No-code frontend interface enabling autonomous document upload, API key management, and pipeline configuration. Real-time streaming responses via Server-Sent Events with comprehensive observability and monitoring infrastructure. Integration with MinIO object storage for document management and Azure OpenAI for LLM inference.",
      },
    ],
    skills: ["Python", "JavaScript", "TypeScript", "Redis", "Azure OpenAI", "MinIO"],
    links: [],
  },
  {
    id: "autoguardian",
    category: "IoT Platform",
    title: "AutoGuardian",
    tech: "Arduino · Django · MQTT",
    year: "2024",
    association: null,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop",
    summary:
      "A modular IoT platform for vehicle safety monitoring and neighbor-aware emergency alerting, featuring real-time telemetry processing, anomaly detection, and distributed alert dissemination. The system connects Arduino/MCU devices via serial communication to a Django REST API backend, with MQTT-based alert broadcasting for low-latency emergency response coordination between nearby vehicles.",
    sections: [
      {
        heading: "Key Features",
        text:
          "Smart anomaly detection with false-positive suppression by comparing sensor readings across neighboring vehicles. Geospatial neighbor discovery using distance calculations. Web-based dashboard providing real-time vehicle monitoring, alert management, and system overview. REST-first design with clean separation of concerns and comprehensive API endpoints for vehicles, alerts, and contact management.",
      },
    ],
    skills: ["Arduino", "Mosquitto", "Django", "MQTT", "Python"],
    links: [{ label: "GitHub", href: "https://github.com/Giacomo117/AutoGuardian", icon: "github" }],
  },
  {
    id: "drowsiness",
    category: "Computer Vision",
    title: "Drowsiness State Detector",
    tech: "OpenCV · PyTorch · Deep Learning",
    year: "2024",
    association: null,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop",
    summary:
      "A multi-model computer vision application for real-time driver drowsiness detection, composed of three standalone deep learning models working in parallel through multi-threaded processing. Real-time performance achieved through concurrent model inference on webcam input, with OpenCV Haar cascades handling face detection and eye region extraction. A 10-second sliding buffer aggregates detection results for stable drowsiness assessment based on eye closure frequency, yawn rate, and head rotation metrics.",
    sections: [
      {
        heading: "The Three Models",
        items: [
          "Eye State Classification: MobileNetV2 classifier trained to distinguish between open/closed eyes on extracted eye regions.",
          "Yawn Detection: MobileNet trained for binary yawn classification from facial crops.",
          "Facial Keypoint Estimation: PyTorch ResNet50 predicting 68 facial landmarks for head pose analysis.",
        ],
      },
    ],
    skills: ["Python", "OpenCV", "PyTorch", "MobileNet", "ResNet50"],
    links: [{ label: "GitHub", href: "https://github.com/Giacomo117/Drowsiness-State-Detector", icon: "github" }],
  },
  {
    id: "excogita",
    category: "AI Agents",
    title: "Excogita",
    tech: "AutoGen · Kubernetes · Microservices",
    year: "2025",
    association: null,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&auto=format&fit=crop",
    summary:
      "A production-grade platform where multiple AI agents autonomously plan, reason, execute experiments, spend money, and self-govern — engineered to run unattended for days or months. Built on a fully event-driven microservices architecture with 30+ specialized workers communicating via Azure Service Bus.",
    sections: [
      {
        heading: "Core Architecture",
        items: [
          "Multi-Agent Reasoning (AutoGen + Agora): Parliament-style deliberation with voting/merge, Arena team-vs-team debate with jury scoring, Constitutional Guard for deterministic policy enforcement, and Goal Diversity Engine preventing repetitive planning.",
          "Execution Runtime (Agent-Lightning): Kubernetes-native job scheduling with checkpoint/recovery, stuck-job detection, and freeze/unfreeze controls for continuous long-horizon operation.",
          "Financial Autonomy (Payment Agent): Stripe-integrated spending gateway with policy engine, idempotency, reconciliation, and audit trails — agents autonomously execute real-world transactions.",
          "Deterministic Safety (Watchdog): Non-LLM kill-switch with graduated interventions and real-time monitoring — safety without AI reasoning.",
        ],
      },
      {
        heading: "Scientific Discovery Pipeline",
        text:
          "End-to-end automated research: idea generation, novelty verification, hypothesis design, sandboxed code execution with self-debug, LaTeX paper generation, and ensemble peer review with revision cycles.",
      },
      {
        heading: "Intelligence Layer",
        text:
          "Centralized LLM Router with multi-provider model selection, semantic caching, and budget enforcement. Semantic memory (pgvector) enables RAG-based learning across planning cycles.",
      },
      {
        heading: "Operator Experience",
        text:
          "Next.js real-time dashboard with live WebSocket streams, scientific pipeline console, and cost tracking. Human Escalation Agent with Telegram/Email notifications for human-in-the-loop intervention.",
      },
    ],
    skills: ["Python", "TypeScript", "FastAPI", "AutoGen", "Next.js", "PostgreSQL", "Redis", "Azure Service Bus", "Kubernetes", "Docker", "Stripe API"],
    links: [],
  },
  {
    id: "routing",
    category: "Graph DB",
    title: "Routing Algorithm for Graph DBs",
    tech: "Neo4j · APOC · GTFS",
    year: "2024",
    association: "Università degli Studi di Modena e Reggio Emilia",
    image: "https://images.unsplash.com/photo-1502810365585-56ddb3b6a6f1?w=900&auto=format&fit=crop",
    summary:
      "A multi-modal routing system for public transportation networks using Neo4j graph database technology, implementing optimized pathfinding algorithms for real-world transit data. The system processes GTFS (General Transit Feed Specification) data for Modena, Italy, combining bus routes with pedestrian transfers to provide comprehensive journey planning with time-dependent scheduling and geospatial proximity search.",
    sections: [
      {
        heading: "Core Components",
        items: [
          "Graph Database Design: Neo4j implementation with custom data model representing agencies, routes, trips, stops, and stoptimes with time-dependent relationships.",
          "Multi-Modal Pathfinding: Dijkstra algorithm implementation using Graph Data Science (GDS) library with custom waiting_time weights for optimal route calculation.",
          "Geospatial Integration: Proximity search functionality using Neo4j spatial functions to find nearby stops within configurable radius from arbitrary coordinates.",
        ],
      },
    ],
    skills: ["Neo4j", "APOC", "Python", "GDS"],
    links: [{ label: "GitHub", href: "https://github.com/Giacomo117", icon: "github" }],
  },
];
