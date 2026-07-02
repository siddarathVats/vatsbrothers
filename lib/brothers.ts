/**
 * Per-brother data for the work palette overlays (achievements first, then
 * selected work), opened by clicking a 3D character in the campfire scene,
 * a menu item, or a photo in the "Meet the brothers" section.
 */

export type BrotherId = "sid" | "vin";

export interface Achievement {
  label: string;
  detail?: string;
}

export interface WorkItem {
  title: string;
  blurb: string;
  tech: string[];
  href?: string;
}

export interface BrotherLink {
  kind: "mail" | "linkedin" | "github" | "upwork" | "resume";
  href: string;
  label: string;
}

export interface BrotherProfile {
  id: BrotherId;
  name: string;
  role: string;
  location: string;
  achievements: Achievement[];
  works: WorkItem[];
  links: BrotherLink[];
}

export const BROTHERS: Record<BrotherId, BrotherProfile> = {
  sid: {
    id: "sid",
    name: "Siddarath Vats",
    role: "AI Research Engineer",
    location: "Dallas, TX · M.S. CS (AI), SMU '25",
    achievements: [
      { label: "M.S. Computer Science (AI)", detail: "Southern Methodist University, Dallas — class of 2025" },
      { label: "Silver coin + spot award at Adani Green", detail: "For AI/ML work across a ~9 GW renewable fleet" },
      { label: "+~2% performance ratio, −~10% penalty costs", detail: "SVM/ANN/LSTM forecasting on Vertex AI for the same fleet" },
      { label: "Peer-reviewed book chapter", detail: "Three-phase faults vs. power swings — Nova Science Publishers" },
    ],
    works: [
      {
        title: "EZER",
        blurb: "Lead developer of an AI-native alumni networking platform in production.",
        tech: ["LangGraph", "pgvector", "AI chat"],
        href: "https://app.ezer.network",
      },
      {
        title: "Multi-agent SDOH extraction on MIMIC-3",
        blurb: "SMU Lyle research: DeepSeek, Mistral-7B and LLaMA 3.3 via Ollama on A100s/SuperPOD; annotations fine-tune BioClinicalBERT and Med-BERT.",
        tech: ["LangGraph", "Ollama", "HPC", "TimescaleDB"],
      },
      {
        title: "AI/ML for a ~9 GW renewable fleet",
        blurb: "Adani Green: performance forecasting and penalty-cost reduction models in production.",
        tech: ["SVM/ANN/LSTM", "Vertex AI"],
      },
      {
        title: "SEC EDGAR + Senate disclosures scraper",
        blurb: "Compliance modeling over scraped filings and disclosures.",
        tech: ["Python", "Selenium", "NLP", "LLM"],
      },
      {
        title: "Three-phase faults vs. power swings",
        blurb: "Peer-reviewed chapter, Nova Science Publishers.",
        tech: ["Power systems", "Research"],
      },
    ],
    links: [
      { kind: "mail", href: "mailto:siddarathvats.ele17@gmail.com", label: "Email" },
      { kind: "linkedin", href: "https://linkedin.com/in/siddarath-vats-51bb65155", label: "LinkedIn" },
      { kind: "resume", href: "/Siddarath_Vats_Resume.pdf", label: "Resume" },
    ],
  },
  vin: {
    id: "vin",
    name: "Vinayak Vats",
    role: "Freelance AI + Backend Engineer",
    location: "Ahmedabad, India · Operisoft + Petwell",
    achievements: [
      { label: "Shipped Dockey end-to-end, solo", detail: "WhatsApp-first practice management, live at dockey.in" },
      { label: "~70% fewer no-shows in Dockey pilots", detail: "Automated WhatsApp reminder flows for OPD clinics" },
      { label: "~$300/month AWS savings", detail: "Reverse-engineered Java JAR/.exe binaries into Lambda containers" },
      { label: "~88% CAPTCHA solve accuracy", detail: "TrOCR ONNX pipeline inside a distributed eProcure.gov.in scraper" },
    ],
    works: [
      {
        title: "Dockey",
        blurb: "WhatsApp-first OPD practice management — appointments, prescriptions, certificates, reminders — no app download needed.",
        tech: ["WhatsApp Cloud API", "Node.js", "Postgres", "AWS"],
        href: "https://www.dockey.in",
      },
      {
        title: "GudPet (Petwell)",
        blurb: "Pet-health SaaS with a LangGraph agent over full user history, Bedrock/OpenSearch RAG, and OTEL→New Relic LLM tracing.",
        tech: ["React", "NestJS", "LangGraph", "Bedrock"],
        href: "https://mygudpet.com",
      },
      {
        title: "Operisoft",
        blurb: "Technical Consultant: 4+ microservices on the full AWS stack, a sandboxed Chrome-extension credential relay, wildcard-subdomain multi-tenancy.",
        tech: ["AWS ECS", "API Gateway", "Chrome Extension"],
      },
      {
        title: "eProcure.gov.in distributed scraper",
        blurb: "Government-procurement scraping at scale with TrOCR ONNX CAPTCHA solving (~88%).",
        tech: ["Python", "ONNX", "Distributed"],
      },
    ],
    links: [
      { kind: "mail", href: "mailto:vinayakvats.work@gmail.com", label: "Email" },
      { kind: "github", href: "https://github.com/wolf-4bit", label: "GitHub" },
      { kind: "upwork", href: "https://www.upwork.com/freelancers/~0170ebcfaf68472ea1", label: "Upwork" },
      { kind: "resume", href: "/Vinayak_Vats_Resume.pdf", label: "Resume" },
    ],
  },
};
