import { Reveal } from "./reveal";
import { Marquee } from "./marquee";

const GROUPS: Array<{ label: string; items: string[]; dur: number }> = [
  {
    label: "Languages",
    dur: 42,
    items: ["Python", "TypeScript", "JavaScript", "SQL", "R", "Bash"],
  },
  {
    label: "AI & ML",
    dur: 60,
    items: [
      "LangGraph",
      "LangChain",
      "ADK",
      "Hugging Face",
      "PyTorch",
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "Ollama",
      "Bedrock",
      "Gemini",
      "OpenAI",
      "BioClinicalBERT",
    ],
  },
  {
    label: "Cloud & Infra",
    dur: 54,
    items: [
      "AWS Lambda",
      "AWS SES",
      "AWS SQS",
      "SageMaker",
      "Bedrock",
      "OpenSearch",
      "GCP Vertex AI",
      "BigQuery",
      "Cloud Scheduler",
      "Docker",
      "Vercel",
      "NVIDIA A100",
      "SuperPOD HPC",
    ],
  },
  {
    label: "Data",
    dur: 50,
    items: [
      "PostgreSQL",
      "pgvector",
      "BigQuery",
      "Redshift",
      "TimescaleDB",
      "MySQL",
      "Athena",
      "PySpark",
      "Apify",
      "Selenium",
    ],
  },
  {
    label: "Frontend & Tooling",
    dur: 52,
    items: [
      "Next.js",
      "React 19",
      "Tailwind v4",
      "shadcn/ui",
      "RJSF",
      "Motion",
      "FastAPI",
      "NestJS",
      "Node.js",
      "WhatsApp Cloud API",
    ],
  },
];

export function Stack() {
  return (
    <section className="section" id="stack" aria-labelledby="stack-h">
      <div className="container-1200">
        <Reveal>
          <div className="sec-h">
            <span className="dot" aria-hidden />
            <span className="sec-h__index mono">05 / Stack</span>
          </div>
          <h2 className="sec-title" id="stack-h">
            Stack
          </h2>
          <p className="sec-kicker">What we reach for, by category.</p>
        </Reveal>
      </div>

      <Reveal className="stack-wrap">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <div className="container-1200">
              <span className="marquee__label">{g.label}</span>
            </div>
            <Marquee items={g.items} durationSec={g.dur} />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
