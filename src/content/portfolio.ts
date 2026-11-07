/**
 * CENTRALIZED PORTFOLIO CONTENT MODEL
 *
 * NOTE FOR OWNER:
 * Once available, replace placeholder values with your real LinkedIn profile information.
 * Look for comments marked [LINKEDIN_IMPORT_FIELD].
 * Do NOT invent credentials, employers, or metrics here.
 */

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  thumbnailType: 'rooftop' | 'staircase' | 'schematic';
  externalUrl?: string;
  details: {
    challenge: string;
    approach: string;
    outcome: string;
  };
}

export interface ExplorationItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  tech: string[];
  status: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  organization: string;
  summary: string;
  highlights: string[];
}

export interface PortfolioData {
  owner: {
    // [LINKEDIN_IMPORT_FIELD]: Full Name
    name: string;
    // [LINKEDIN_IMPORT_FIELD]: Professional headline
    headline: string;
    // [LINKEDIN_IMPORT_FIELD]: Location
    location: string;
    // [LINKEDIN_IMPORT_FIELD]: Optional resume PDF link
    resumePdfUrl?: string;
    // [LINKEDIN_IMPORT_FIELD]: Optional portrait URL (strictly confined to Resume section, NEVER landing hero)
    resumePortraitUrl?: string;
  };
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    subhead: string;
    ctaWork: string;
    routeCaption: string;
    droneControlLabel: string;
    playButtonLabel: string;
    keyLegend: string;
  };
  navigation: Array<{
    id: string;
    label: string;
    href: string;
    isExternal?: boolean;
  }>;
  projects: ProjectItem[];
  explorations: ExplorationItem[];
  resume: {
    summary: string;
    experiences: ExperienceItem[];
    skills: {
      category: string;
      items: string[];
    }[];
    education: {
      degree: string;
      school: string;
      year: string;
    }[];
  };
  contact: {
    heading: string;
    subhead: string;
    // [LINKEDIN_IMPORT_FIELD]: Contact email
    emailPlaceholder: string;
    // [LINKEDIN_IMPORT_FIELD]: Social links
    socials: Array<{
      platform: string;
      label: string;
      url: string;
      isPlaceholder?: boolean;
    }>;
  };
}

export const portfolioData: PortfolioData = {
  owner: {
    name: "YOUR NAME", // [LINKEDIN_IMPORT_FIELD]: Replace with actual full name
    headline: "Creative Technologist & Systems Architect", // [LINKEDIN_IMPORT_FIELD]
    location: "San Francisco, CA / Remote", // [LINKEDIN_IMPORT_FIELD]
    resumePdfUrl: undefined, // [LINKEDIN_IMPORT_FIELD]: Set only when actual PDF is provided
    resumePortraitUrl: undefined // [LINKEDIN_IMPORT_FIELD]: Optional portrait for Resume section only
  },
  hero: {
    eyebrow: "PERSONAL PORTFOLIO / 001",
    headlineLine1: "WORK",
    headlineLine2: "& IDEAS.",
    subhead: "A collection of projects, ideas, and experiments.",
    ctaWork: "VIEW PROJECTS ↗",
    routeCaption: "EXPLORE AT YOUR OWN PACE",
    droneControlLabel: "DRONE VIEW",
    playButtonLabel: "START EXPLORING ↗",
    keyLegend: "WASD MOVE · SPACE JUMP · R RESET"
  },
  navigation: [
    { id: "work", label: "WORK", href: "#work" },
    { id: "explorations", label: "EXPLORATIONS", href: "#explorations" },
    { id: "resume", label: "RÉSUMÉ", href: "#resume" },
    { id: "contact", label: "CONTACT ↗", href: "#contact", isExternal: true }
  ],
  projects: [
    {
      id: "project-one",
      number: "01",
      title: "PROJECT ONE",
      subtitle: "Autonomous Spatial Dioramas",
      category: "Real-time 3D / WebGL",
      year: "2026",
      description: "Interactive architectural environment engineered with React Three Fiber and Rapier physics. Features high-precision drone camera perspectives and physically responsive concrete structures.",
      tags: ["R3F", "Three.js", "Rapier", "TypeScript"],
      thumbnailType: "rooftop",
      details: {
        challenge: "Achieving high-fidelity architectural lighting and smooth 60fps simulation on mobile and desktop web browsers.",
        approach: "Implemented modular instanced geometry, directional shadow maps with bias tuning, and an isolated physics step controller.",
        outcome: "A lightweight, responsive 3D diorama that loads instantly and degrades gracefully on devices without WebGL support."
      }
    },
    {
      id: "project-two",
      number: "02",
      title: "PROJECT TWO",
      subtitle: "Multi-Touch Physics Controller",
      category: "Interaction & Input",
      year: "2026",
      description: "Custom touch input system with pointer capture, coyote-time jump buffering, and simultaneous multi-finger hold-and-jump ergonomics.",
      tags: ["PointerEvents", "Input Ergonomics", "Rapier", "Mobile Web"],
      thumbnailType: "staircase",
      details: {
        challenge: "Eliminating stuck keys and gesture conflicts when users slide thumbs between mobile control buttons and browser edges.",
        approach: "Built a dual-pointer manager utilizing setPointerCapture with explicit pointerup, pointercancel, and blur reconciliation handlers.",
        outcome: "Rock-solid touch controls with zero sticky buttons, safe-area compliance, and immediate focus restoration."
      }
    },
    {
      id: "project-three",
      number: "03",
      title: "PROJECT THREE",
      subtitle: "Restrained Motion & Section Reveals",
      category: "Motion & Design Systems",
      year: "2026",
      description: "Unified animation system pairing GSAP ScrollTrigger with React lifecycles. Orchestrates typography reveals, route SVG stroke drawing, and camera transitions.",
      tags: ["GSAP", "@gsap/react", "ScrollTrigger", "A11y"],
      thumbnailType: "schematic",
      details: {
        challenge: "Preventing conflicting camera tweens between GSAP timelines and real-time physics render loops.",
        approach: "Established single-owner property rules where GSAP only drives camera parameter targets while the frame loop handles interpolation.",
        outcome: "Polished, stutter-free cinematic transitions that strictly honor prefers-reduced-motion preferences."
      }
    }
  ],
  explorations: [
    {
      id: "exp-01",
      number: "01",
      title: "Deterministic Visual Regression Harness",
      summary: "Headless capture pipeline fixing camera angles, physics frames, and asset settling times for pixel-accurate layout review.",
      tech: ["Playwright", "Canvas API", "WebGL"],
      status: "Verified"
    },
    {
      id: "exp-02",
      number: "02",
      title: "Procedural Architectural Bevels",
      summary: "Lightweight algorithmic mesh generation providing rounded concrete edges without high polygon counts or heavy GLB downloads.",
      tech: ["Three.js", "Geometry Buffers", "Normals"],
      status: "Active"
    },
    {
      id: "exp-03",
      number: "03",
      title: "Adaptive DPR & Shadow LOD Scaling",
      summary: "Dynamic resolution scaling maintaining 60fps across low-power mobile devices and high-DPI desktop displays.",
      tech: ["Performance Observer", "Three.js"],
      status: "Prototype"
    }
  ],
  resume: {
    summary: "Professional background awaiting LinkedIn data import. Focuses on interactive 3D web applications, robust client-side architecture, and accessible user experiences.",
    experiences: [
      {
        period: "2024 — PRESENT",
        role: "Senior Creative Technologist [Placeholder]",
        organization: "Digital Systems Studio",
        summary: "Specialized in WebGL architectures, real-time physics systems, and design systems engineering.",
        highlights: [
          "Architected real-time web 3D interactive experiences for desktop and mobile.",
          "Designed accessible multi-touch controllers with pointer capture and zero-latency feedback.",
          "Built automated visual comparison pipelines ensuring cross-device fidelity."
        ]
      },
      {
        period: "2022 — 2024",
        role: "Interactive Developer [Placeholder]",
        organization: "Creative Media Lab",
        summary: "Developed design systems, animated web applications, and WebGL prototypes.",
        highlights: [
          "Integrated GSAP motion frameworks with modern React application state.",
          "Optimized asset loading and render budgets for mobile performance."
        ]
      }
    ],
    skills: [
      {
        category: "3D & Real-Time",
        items: ["Three.js", "React Three Fiber", "Drei", "Rapier Physics", "GLSL / Shaders", "Blender"]
      },
      {
        category: "Frontend & Architecture",
        items: ["TypeScript", "React 19", "Vite", "GSAP", "ScrollTrigger", "CSS Variables", "HTML5 Canvas"]
      },
      {
        category: "Quality & Systems",
        items: ["Playwright", "Vitest", "A11y (WCAG 2.1)", "Performance Profiling", "Responsive Ergonomics"]
      }
    ],
    education: [
      {
        degree: "B.S. in Computer Science / Media Design [Placeholder]",
        school: "University [Awaiting LinkedIn Import]",
        year: "2022"
      }
    ]
  },
  contact: {
    heading: "CONNECT & EXPLORE",
    subhead: "Ready to discuss new projects, creative technology collaborations, or system architecture.",
    emailPlaceholder: "contact@example.com", // [LINKEDIN_IMPORT_FIELD]
    socials: [
      { platform: "LinkedIn", label: "LinkedIn ↗", url: "https://linkedin.com", isPlaceholder: true },
      { platform: "GitHub", label: "GitHub ↗", url: "https://github.com", isPlaceholder: true },
      { platform: "Email", label: "Email ↗", url: "mailto:contact@example.com", isPlaceholder: true }
    ]
  }
};
