/**
 * FACTUAL PORTFOLIO CONTENT MODEL
 *
 * Sourced strictly from docs/portfolio-content.json and design/source/Resume_Nikhil_Sharma_2026-11.docx.
 * No placeholder credentials, invented metrics, or fictional project URLs are present.
 */

export interface PortfolioIdentity {
  name: string;
  title: string;
  headline: string;
  location: string;
  email: string;
  phone?: string;
  portraitPlaceholder: string;
  portraitUrl?: string;
}

export interface PortfolioLinks {
  email: string;
  github: string;
  linkedin: string;
  resumePdf: string;
  resumeDocx: string;
}

export interface PortfolioHome {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  intro: string;
  education: string;
  experienceSignal: string;
  ctaProjects: string;
  ctaResume: string;
  routeCaption: string;
  droneControlLabel: string;
  playButtonLabel: string;
  keyLegend: string;
}

export type ProjectSlug = 'fastcode' | 'scottypi' | 'langmetric';

export interface ProjectDetails {
  problem: string;
  approach: string[];
  qualifier?: string;
  fullSummary?: string;
  baselineMicroseconds?: number;
  optimizedMicroseconds?: number;
  reductionPercent?: number;
  theoreticalSingleCorePeakPercent?: number;
  passages?: number;
  officialCmuSvPages?: number;
  evaluationQuestions?: number;
  metrics?: string[];
  dashboardMeasures?: string[];
  service?: string;
  implementation?: string[];
}

export interface PortfolioProject {
  slug: ProjectSlug;
  number: string;
  name: string;
  title: string;
  subtitle: string;
  category: string;
  dates: string;
  description: string;
  result: string;
  stack: string;
  tags: string[];
  thumbnailType: 'rooftop' | 'staircase' | 'schematic';
  url?: string;
  urlLabel?: string;
  details: ProjectDetails;
}

export interface PortfolioExperience {
  role: string;
  employer: string;
  client?: string;
  isClientEngagement: boolean;
  dates: string;
  location?: string;
  points: string[];
}

export interface PortfolioEducation {
  school: string;
  degree: string;
  year: string;
  location?: string;
  coursework?: string;
}

export interface SkillCategoryGroup {
  category: string;
  items: string[];
}

export interface PortfolioSkills {
  raw: Record<string, string>;
  categories: SkillCategoryGroup[];
}

export interface PortfolioResearch {
  title: string;
  status: 'In review';
  venue: string;
  fullTitle: string;
  summary: string;
}

export interface PortfolioAbout {
  paragraphs: string[];
  focus: string[];
}

export interface ResumeDownloadFile {
  url: string;
  label: string;
  filename: string;
  format: 'PDF' | 'DOCX';
  sizeLabel?: string;
}

export interface PortfolioResumeDownloads {
  pdf: ResumeDownloadFile;
  docx: ResumeDownloadFile;
}

export interface PortfolioContent {
  identity: PortfolioIdentity;
  links: PortfolioLinks;
  home: PortfolioHome;
  projects: PortfolioProject[];
  experience: PortfolioExperience[];
  education: PortfolioEducation[];
  skills: PortfolioSkills;
  research: PortfolioResearch;
  about: PortfolioAbout;
  downloads: PortfolioResumeDownloads;
}

export const portfolioContent: PortfolioContent = {
  identity: {
    name: "Nikhil Sharma",
    title: "Software & Applied AI Engineer",
    headline: "Software and Applied AI Engineer (M.S. in Software Engineering in progress, Carnegie Mellon, Expected 2027)",
    location: "San Jose, CA",
    email: "nikhilmsha@gmail.com",
    phone: "408-480-6489",
    portraitPlaceholder: "Small neutral PHOTO placeholder; no real portrait supplied.",
    portraitUrl: undefined
  },

  links: {
    email: "mailto:nikhilmsha@gmail.com",
    github: "https://github.com/ni-ms",
    linkedin: "https://linkedin.com/in/nikhilmsha",
    resumePdf: "/resume/Nikhil_Sharma_Resume.pdf",
    resumeDocx: "/resume/Nikhil_Sharma_Resume.docx"
  },

  home: {
    eyebrow: "PORTFOLIO / NIKHIL SHARMA",
    headlineLine1: "BACKEND, SYSTEMS",
    headlineLine2: "& APPLIED AI.",
    intro: "I build production backend services and enterprise web applications, with hands-on work in applied AI and CPU optimization.",
    education: "M.S. Software Engineering · Carnegie Mellon · Expected 2027",
    experienceSignal: "Nearly 3 years of engineering experience",
    ctaProjects: "VIEW PROJECTS ↗",
    ctaResume: "VIEW RÉSUMÉ ↗",
    routeCaption: "EXPLORE AT YOUR OWN PACE",
    droneControlLabel: "DRONE VIEW",
    playButtonLabel: "START EXPLORING ↗",
    keyLegend: "WASD MOVE · SPACE JUMP · R RESET"
  },

  projects: [
    {
      slug: "fastcode",
      number: "01",
      name: "FastCode",
      title: "FastCode CPU Kernel Optimization",
      subtitle: "CPU kernel optimization",
      category: "Systems & Performance",
      dates: "Oct – Nov 2026",
      description: "Optimized YOLOv8n convolution using vector instructions, register blocking, and cache-aware input packing.",
      result: "21% lower primary-workload latency vs OpenCV: 684 to 539 µs.",
      stack: "C++ · AVX2/FMA",
      tags: ["C++", "AVX2/FMA", "Kernel Optimization", "YOLOv8n", "Vectorization"],
      thumbnailType: "schematic",
      url: "https://github.com/ni-ms/18645-yolov8n-optimization",
      urlLabel: "GitHub Repository ↗",
      details: {
        problem: "Reduce latency of YOLOv8n FP32 1x1 convolution on a single CPU core.",
        approach: [
          "AVX2/FMA vectorization",
          "Register blocking",
          "Cache-aware input packing"
        ],
        baselineMicroseconds: 684,
        optimizedMicroseconds: 539,
        reductionPercent: 21,
        theoreticalSingleCorePeakPercent: 91,
        qualifier: "Results refer to the primary benchmark workload, not a universal speedup.",
        fullSummary: "Optimized YOLOv8n FP32 1x1 convolution using AVX2/FMA, register blocking, and cache-aware input packing. Cut primary-workload latency 21% versus OpenCV (684 to 539 µs); reached ~91% of theoretical single-core peak."
      }
    },
    {
      slug: "scottypi",
      number: "02",
      name: "ScottyPi",
      title: "ScottyPi Campus Assistant",
      subtitle: "Campus retrieval assistant",
      category: "Applied AI & Retrieval",
      dates: "Fall 2026",
      description: "Combined keyword and dense retrieval with fine-tuned embeddings over official CMU-SV pages.",
      result: "Evaluated on 160 questions using Recall@1, Recall@3, and MRR.",
      stack: "Python · MiniLM · QLoRA",
      tags: ["Python", "MiniLM", "QLoRA", "Hybrid Retrieval", "BM25", "Reciprocal-Rank Fusion"],
      thumbnailType: "staircase",
      url: undefined, // Optional absent URL: no invented repository link
      urlLabel: undefined,
      details: {
        problem: "Build an accurate campus retrieval assistant over official Carnegie Mellon Silicon Valley pages.",
        approach: [
          "BM25 keyword search",
          "Dense retrieval",
          "Reciprocal-rank fusion",
          "Fine-tuned MiniLM embeddings"
        ],
        passages: 133,
        officialCmuSvPages: 20,
        evaluationQuestions: 160,
        metrics: ["Recall@1", "Recall@3", "MRR"],
        qualifier: "Train/dev/test splits; no numerical recall or MRR scores supplied.",
        fullSummary: "Built a campus assistant combining BM25 and dense retrieval, reciprocal-rank fusion, and fine-tuned MiniLM embeddings over 133 passages from 20 official CMU-SV pages. Evaluated using a 160-question dataset with train/dev/test splits and Recall@1, Recall@3, and MRR metrics."
      }
    },
    {
      slug: "langmetric",
      number: "03",
      name: "Langmetric",
      title: "Langmetric",
      subtitle: "Model trace analytics",
      category: "Distributed Systems & Telemetry",
      dates: "Jul 2024 – Present",
      description: "Built dashboards that turn structured model traces into latency, token usage, and cost insights.",
      result: "Aggregates structured model traces into real-time operational dashboards for latency distributions, token usage, and cost.",
      stack: "Rust · Loco RS · SeaORM",
      tags: ["Rust", "Loco RS", "SeaORM", "Model Traces", "Chart.js", "Telemetry"],
      thumbnailType: "rooftop",
      url: "https://langmetric.com/",
      urlLabel: "Live Platform ↗",
      details: {
        service: "Rust service aggregating structured model traces",
        // Factual trace & dashboard objective sourced from DOCX/JSON; avoids unsupported claims
        problem: "Aggregate structured model traces into operational dashboards displaying latency distributions, token usage, and cost metrics.",
        approach: [
          "Loco RS web framework",
          "Asynchronous SeaORM queries",
          "Serde JSON views",
          "Chart.js metric visualizations"
        ],
        implementation: [
          "Loco RS",
          "Asynchronous SeaORM queries",
          "Serde JSON views",
          "Chart.js visualizations"
        ],
        dashboardMeasures: [
          "Latency distributions",
          "Token usage",
          "Cost"
        ],
        // Anti-fabrication provenance note: do not expose fictional traction/revenue metrics.
        qualifier: undefined,
        fullSummary: "Built a Rust service that aggregates structured model traces into dashboards for latency distributions, token usage, and cost. Implemented asynchronous SeaORM queries, Serde JSON views, and Chart.js visualizations."
      }
    }
  ],

  experience: [
    {
      role: "Senior Software Engineer",
      employer: "Tech Mahindra",
      client: "Intuitive Surgical",
      isClientEngagement: true,
      dates: "Nov 2025 – Aug 2026",
      location: "San Jose, CA",
      points: [
        "Optimized search in My Intuitive's ~200,000-hospital directory using SQL indexing, React memoization, and pagination in a shared selector, reducing API requests and speeding up hospital selection for physicians.",
        "Built React pages and Spring Boot/JAX-RS REST APIs for Intuitive's provider search, hospital profiles, and account settings.",
        "Enabled hospital-status changes to flow between Salesforce and Liferay through a bidirectional Java API integration.",
        "Refactored Auth0 login for My Intuitive and Intuitive Learning, fixing redirect loops and handling invalid usernames; updated bearer token handling in JavaScript Actions and deployed changes to production.",
        "Implemented conditional API calls by evaluating flags from Auth0 metadata retrieved through the Java Management SDK.",
        "Developed a shared Redis cache so 6+ Liferay pods could retrieve profile settings by session ID."
      ]
    },
    {
      role: "Actimize Developer",
      employer: "Styrone",
      client: "Nationwide Building Society",
      isClientEngagement: true,
      dates: "Mar 2025 – Oct 2025",
      points: [
        "Architected 25+ parameterized drill-down queries (DDQs) and DART analytical views, optimizing underlying Oracle SQL execution plans to accelerate historical transaction retrieval during fraud investigations.",
        "Engineered custom Java event-driven state handlers and XML lifecycle plugins (rcm.conditionalStatusChange, rcm.postStepChange) to automate fraud-alert state transitions, validation workflows, and follow-up actions.",
        "Developed 20+ production Java reporting plugins from scratch, querying high-volume transaction data and transforming XML via XSLT/XSL-FO into standardized compliance PDF reports for financial investigators.",
        "Extended alert data pipelines via custom XML enrichment (getEnrichmentXML) and dynamic template bindings, customizing investigator UI dashboards with JavaScript, jqGrid, and Velocity.",
        "Integrated external SOAP web services into real-time fraud monitoring flows (Actimize IFM/AIS), building custom data-integration and response interceptors to validate inputs and transform payloads."
      ]
    },
    {
      role: "Associate Full Stack Developer",
      employer: "Exeevo",
      isClientEngagement: false,
      dates: "Jan 2024 – Feb 2025",
      points: [
        "Managed 25+ Spring Boot REST endpoints end to end for healthcare applications, from API design and business-rule implementation through production release.",
        "Developed Microsoft Dynamics 365 APIs into Angular dashboards to display CRM records for a healthcare proof of concept.",
        "Integrated Dynamics 365 entity relationship modeling, managed and unmanaged solution layering, and CRM access controls using security roles, field security, and access team templates.",
        "Built GO app dashboards and document views for medical representatives to access pharmaceutical information, using Angular, RxJS, NgRx state persistence, and Cordova mobile support."
      ]
    }
  ],

  education: [
    {
      school: "Carnegie Mellon University",
      degree: "M.S. in Software Engineering",
      year: "Expected 2027",
      location: "Mountain View, CA",
      coursework: "MPI-based parallel programming, time-series analysis, hybrid RAG, MiniLM fine-tuning"
    },
    {
      school: "BITS Pilani",
      degree: "B.E. Computer Science",
      year: "2024"
    }
  ],

  skills: {
    raw: {
      "Languages": "Java, Python, C/C++, Rust, TypeScript, JavaScript, SQL, PL/SQL",
      "Backend": "Spring Boot, JAX-RS, FastAPI, React, Angular, RxJS, NgRx, WebAssembly (Wasm), WebSockets",
      "AI": "Model Context Protocol (MCP), LangChain, LangGraph, PyTorch, Sentence Transformers, MiniLM",
      "Serving": "vLLM, Ollama, llama.cpp, LangSmith, Arize Phoenix, OpenInference",
      "Infrastructure": "SQL Server, Oracle Database, Redis, SQLAlchemy, Docker, Kubernetes",
      "Search": "Pinecone, Milvus, Qdrant, pgvector, Apache Kafka, Apache Arrow, DuckDB",
      "Systems": "MPI, POSIX threads, Linux IPC, AVX2/FMA, gRPC, Protocol Buffers (Protobuf)",
      "Integrations": "Auth0 Actions and Management API, Salesforce APIs, Dynamics 365 APIs, Liferay DXP, NICE Actimize (ActOne, AIS, IFM), XSLT/XSL-FO"
    },
    categories: [
      {
        category: "Languages",
        items: ["Java", "Python", "C/C++", "Rust", "TypeScript", "JavaScript", "SQL", "PL/SQL"]
      },
      {
        category: "Backend & Web",
        items: ["Spring Boot", "JAX-RS", "FastAPI", "React", "Angular", "RxJS", "NgRx", "WebAssembly (Wasm)", "WebSockets"]
      },
      {
        category: "Applied AI & Agents",
        items: ["Model Context Protocol (MCP)", "LangChain", "LangGraph", "PyTorch", "Sentence Transformers", "MiniLM"]
      },
      {
        category: "Model Serving & Evaluation",
        items: ["vLLM", "Ollama", "llama.cpp", "LangSmith", "Arize Phoenix", "OpenInference"]
      },
      {
        category: "Databases & Infrastructure",
        items: ["SQL Server", "Oracle Database", "Redis", "SQLAlchemy", "Docker", "Kubernetes"]
      },
      {
        category: "Vector Search & Streaming",
        items: ["Pinecone", "Milvus", "Qdrant", "pgvector", "Apache Kafka", "Apache Arrow", "DuckDB"]
      },
      {
        category: "Systems & Networking",
        items: ["MPI", "POSIX threads", "Linux IPC", "AVX2/FMA", "gRPC", "Protocol Buffers (Protobuf)"]
      },
      {
        category: "Enterprise Integrations",
        items: ["Auth0 Actions & Management API", "Salesforce APIs", "Dynamics 365 APIs", "Liferay DXP", "NICE Actimize (ActOne, AIS, IFM)", "XSLT/XSL-FO"]
      }
    ]
  },

  research: {
    title: "Privacy-preserving shared memory for LLM agents",
    status: "In review",
    venue: "Peer-to-Peer Networking and Applications (Springer Nature)",
    fullTitle: "Private Federated Aggregation of LLM-Agent Memory: Usable Shared Memory with a Measurable Leakage-Drop Guarantee under Secure Aggregation and the Skellam Mechanism",
    summary: "Designed a privacy-preserving federated memory framework for multi-agent LLM systems using Secure Aggregation and discrete Skellam differential privacy, providing formal leakage-drop guarantees while preserving shared task utility."
  },

  about: {
    paragraphs: [
      "I build production backend services and enterprise web applications. My experience spans healthcare platforms, fraud investigation tools, and production integrations.",
      "Alongside that work, I explore applied AI and systems performance—from hybrid retrieval and model trace analytics to CPU kernel optimization."
    ],
    focus: [
      "Backend engineering",
      "Applied AI & retrieval",
      "Systems performance"
    ]
  },

  downloads: {
    pdf: {
      url: "/resume/Nikhil_Sharma_Resume.pdf",
      label: "Download Résumé (PDF)",
      filename: "Nikhil_Sharma_Resume.pdf",
      format: "PDF",
      sizeLabel: "~335 KB"
    },
    docx: {
      url: "/resume/Nikhil_Sharma_Resume.docx",
      label: "Download Résumé (DOCX)",
      filename: "Nikhil_Sharma_Resume.docx",
      format: "DOCX",
      sizeLabel: "~31 KB"
    }
  }
};

export const projectsBySlug: Record<ProjectSlug, PortfolioProject> = {
  fastcode: portfolioContent.projects[0],
  scottypi: portfolioContent.projects[1],
  langmetric: portfolioContent.projects[2]
};

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioContent.projects.find((p) => p.slug === slug);
}
