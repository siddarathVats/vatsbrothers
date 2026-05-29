import { Nav } from "./components/nav";
import { Hero } from "./components/hero";
import { MeetBrothers } from "./components/meet-brothers";
import { BrotherSection } from "./components/brother-section";
import { Together } from "./components/together";
import { Stack } from "./components/stack";
import { Contact } from "./components/contact";
import { Footer } from "./components/footer";

export default function Page() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <MeetBrothers />

        <BrotherSection
          id="siddarath"
          brother="sid"
          index="02 / Siddarath"
          name="Siddarath Vats"
          kicker="Dallas, TX · research, AI/ML, data"
          initials="SV"
          portraitLabel="photo · siddarath"
          portrait={{ src: "/people/sid.png", objectPosition: "center 25%" }}
          contacts={[
            {
              kind: "mail",
              href: "mailto:siddarathvats.ele17@gmail.com",
              label: "Email Siddarath",
            },
            {
              kind: "linkedin",
              href: "https://linkedin.com/in/siddarath-vats-51bb65155",
              label: "LinkedIn, Siddarath",
            },
            {
              kind: "phone",
              href: "tel:+14698971611",
              label: "Call Siddarath",
            },
          ]}
          facts={[
            {
              dt: "Email",
              dd: (
                <a href="mailto:siddarathvats.ele17@gmail.com">
                  siddarathvats.ele17@gmail.com
                </a>
              ),
            },
            {
              dt: "SMU",
              dd: <a href="mailto:svats@smu.edu">svats@smu.edu</a>,
            },
            {
              dt: "Phone",
              dd: <a href="tel:+14698971611">+1 (469) 897-1611</a>,
            },
            {
              dt: "LinkedIn",
              dd: (
                <a
                  href="https://linkedin.com/in/siddarath-vats-51bb65155"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  linkedin.com/in/siddarath-vats-51bb65155
                </a>
              ),
            },
            {
              dt: "Resume",
              dd: (
                <a
                  href="/Siddarath_Vats_Resume.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Siddarath_Vats_Resume.pdf
                </a>
              ),
            },
            {
              dt: "Open to",
              dd: "Full-time AI/ML engineering roles, applied research, AI consulting",
            },
          ]}
          bio={
            <>
              <p>
                Siddarath is an AI engineer finishing his M.S. in Computer
                Science (AI) at <strong>Southern Methodist University</strong>.
              </p>
              <p>
                At <strong>SMU Lyle</strong> he is a Research Assistant
                building a LangGraph multi-agent architecture that extracts
                Social Determinants of Health from the MIMIC-3 clinical notes
                dataset, orchestrating DeepSeek, Mistral-7B, and LLaMA 3.3 via
                Ollama on NVIDIA A100s on the SMU SuperPOD HPC cluster. The
                resulting annotations fine-tune BioClinicalBERT and Med-BERT;
                structured SDOH outputs land in TimescaleDB for temporal
                cohort analysis.
              </p>
              <p>
                He is the lead developer at{" "}
                <a
                  href="https://app.ezer.network"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  EZER
                </a>
                , an AI-native alumni networking platform now in production.
                Before SMU, he spent two years as a{" "}
                <strong>Jr. Data Scientist at Adani Green Energy</strong> in
                Ahmedabad. He built AI/ML on GCP Vertex AI for solar plant
                performance monitoring (lifting operational PR by ~2%),
                engineered ETL across BigQuery, Redshift, S3, and GCS under
                CI/CD, and shipped Power BI dashboards for the Solar and Wind
                portfolios used by ~5,000 employees across a ~9 GW renewable
                fleet. Predictive analytics cut penalty costs by ~10%; the
                work was recognized with a{" "}
                <strong>silver coin and a spot recognition award</strong>.
              </p>
              <p>
                His research portfolio includes automated financial report
                analysis over SEC EDGAR and U.S. Senate disclosures, a
                Reddit-data project on low-SES students using GPT-3 narrative
                extraction, and a peer-reviewed Nova Science Publishers
                chapter on three-phase faults vs. power swings. He built an AI
                chess app with the SMU Chess Club and designed a LangGraph-based
                tax-compilation system.
              </p>
            </>
          }
          workLabel="Selected work · 05"
          works={[
            {
              kicker: (
                <>
                  PRODUCT · LEAD DEVELOPER
                  <br />
                  ALUMNI NETWORK
                </>
              ),
              title: "EZER, AI-native alumni networking platform",
              body: "Lead developer on EZER, an AI-native alumni networking platform pairing LangGraph agents with vector search (pgvector on Postgres) and an AI chat surface for warm-intro discovery. Production app at app.ezer.network covers the agent stack, retrieval, embeddings, and the conversational layer on top of the network graph; the analytics surface tracks alumni distribution by major, institution, city, and graduation year.",
              chips: ["LangGraph", "pgvector", "Lambda", "SES", "AI chat"],
              href: "https://app.ezer.network",
              stretch: true,
              mediaGroup: [
                {
                  src: "/projects/ezer-analytics.png",
                  alt: "EZER alumni network analytics dashboard — top majors, institutions, cities, class year distribution",
                  caption: "analytics · alumni",
                },
                {
                  src: "/projects/ezer-ai-chat.png",
                  alt: "EZER AI Assistant chat — natural-language alumni search and mentorship discovery",
                  caption: "EZER AI · chat",
                },
              ],
            },
            {
              kicker: (
                <>
                  SMU LYLE
                  <br />
                  RESEARCH ASSISTANT
                </>
              ),
              title: "Multi-agent SDOH extraction on MIMIC-3",
              body: "LangGraph multi-agent pipeline that routes clinical notes across DeepSeek, Mistral-7B, and LLaMA 3.3 via Ollama on NVIDIA A100s on the SMU SuperPOD HPC cluster. The pipeline extracts Social Determinants of Health; annotations fine-tune BioClinicalBERT and Med-BERT, and structured SDOH outputs land in TimescaleDB for temporal cohort analysis.",
              chips: [
                "LangGraph",
                "Ollama",
                "A100",
                "BioClinicalBERT",
                "TimescaleDB",
              ],
              href: "https://physionet.org/content/mimiciii/1.4/",
            },
            {
              kicker: (
                <>
                  JR. DATA SCIENTIST
                  <br />
                  ADANI GREEN ENERGY
                </>
              ),
              title: "AI/ML for a ~9 GW renewable fleet",
              body: "Designed and deployed SVM, ANN, and LSTM models on GCP Vertex AI for solar plant performance monitoring, improving operational PR by ~2% under MLOps. Built Python/SQL/Power BI pipelines for the Deviation Settlement Mechanism that cut penalty costs by ~10%, and shipped Power BI dashboards for the Solar and Wind portfolios used by ~5,000 employees. Recognized internally with a silver coin and a spot recognition award.",
              chips: ["GCP", "Vertex AI", "BigQuery", "LSTM", "Power BI"],
              mediaGroup: [
                {
                  src: "/projects/adani-ceremony.jpg",
                  alt: "Siddarath receiving the Adani Renewables spot recognition award",
                  caption: "spot recognition · adani",
                },
                {
                  src: "/projects/adani-medals.jpg",
                  alt: "Silver coin and bronze medal from Adani Renewables",
                  caption: "silver coin · medals",
                },
              ],
            },
            {
              kicker: (
                <>
                  RESEARCH
                  <br />
                  SEC EDGAR
                </>
              ),
              title: "SEC EDGAR + Senate disclosures scraper",
              body: "Built a scraper to extract filings out of SEC EDGAR and the U.S. Senate financial-disclosure portal. The pipeline cleans and normalizes the documents, surfaces anomalies, and links flagged filings to public figures for downstream NLP/LLM compliance modeling.",
              chips: ["Python", "Selenium", "NLP", "LLMs"],
              href: "https://www.sec.gov/search-filings",
            },
            {
              kicker: (
                <>
                  PUBLICATION
                  <br />
                  NOVA SCIENCE PUBLISHERS
                </>
              ),
              title: "Three-phase faults vs. power swings (review chapter)",
              body: "Peer-reviewed Nova Science Publishers chapter reviewing the techniques used to distinguish three-phase faults from power swings on transmission systems. Companion B.Eng. thesis on standalone DFIG wind conversion systems with ML-based fault classification (D-Tree, Logistic Regression, SVC, KNN).",
              chips: ["Review", "Power systems", "Fault detection", "ML"],
              href: "https://novapublishers.com/shop/research-challenges-in-science-engineering-and-technology",
            },
          ]}
        />

        <BrotherSection
          id="vinayak"
          brother="vin"
          index="03 / Vinayak"
          name="Vinayak Vats"
          kicker="Ahmedabad, India · AI + backend, freelance"
          initials="VV"
          portraitLabel="photo · vinayak"
          portrait={{ src: "/people/vin.png", objectPosition: "center 20%" }}
          contacts={[
            {
              kind: "mail",
              href: "mailto:vinayakvats.work@gmail.com",
              label: "Email Vinayak",
            },
            {
              kind: "github",
              href: "https://github.com/wolf-4bit",
              label: "GitHub, Vinayak",
            },
            {
              kind: "upwork",
              href: "https://www.upwork.com/freelancers/~0170ebcfaf68472ea1",
              label: "Upwork, Vinayak",
            },
          ]}
          facts={[
            {
              dt: "Email",
              dd: (
                <a href="mailto:vinayakvats.work@gmail.com">
                  vinayakvats.work@gmail.com
                </a>
              ),
            },
            {
              dt: "GitHub",
              dd: (
                <a
                  href="https://github.com/wolf-4bit"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  github.com/wolf-4bit
                </a>
              ),
            },
            {
              dt: "Upwork",
              dd: (
                <a
                  href="https://www.upwork.com/freelancers/~0170ebcfaf68472ea1"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  upwork.com/…/vinayak-vats
                </a>
              ),
            },
            {
              dt: "Resume",
              dd: (
                <a
                  href="/Vinayak_Vats_Resume.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Vinayak_Vats_Resume.pdf
                </a>
              ),
            },
            {
              dt: "Open to",
              dd: "AI-native product consulting, retainer engineering, backend + infra contracts",
            },
          ]}
          bio={
            <>
              <p>
                Vinayak is a freelance AI and backend engineer in Ahmedabad
                shipping full-stack AI systems for product teams: LangGraph
                multi-agent architectures, NestJS / FastAPI / Node backends,
                and AWS infrastructure for clients across India, the
                Netherlands, Singapore, and North America.
              </p>
              <p>
                He is <strong>Technical Consultant at Operisoft Technologies</strong>,
                owning 4+ microservices and the full AWS stack (ECS, ECR,
                CodePipeline, API Gateway). He reverse-engineered Java
                JAR/.exe binaries into Lambda containers (~$300/month saved),
                built a sandboxed Chrome Extension for credential-relay and
                CORS-free third-party API calls, and architected
                wildcard-subdomain multi-tenancy on ACM + ALB. In parallel he
                is a contract engineer on{" "}
                <strong>Petwell Solutions / GudPet</strong>, where he ships a
                NestJS + React pet-health SaaS with a LangGraph AI agent that
                uses each user's full activity history as context, a Bedrock
                Knowledge Base on OpenSearch for semantic retrieval, and
                OpenTelemetry-to-NewRelic tracing for production LLM
                observability. Earlier in 2025 he spent six months at{" "}
                <strong>StepIn Company Corp (Dallas)</strong> architecting a
                NestJS monolith for a LinkedIn-style hiring platform and
                shipping LangGraph candidate-JD matching with Prefect DAGs for
                ingestion.
              </p>
              <p>
                Freelance engagements include <strong>CTT</strong> (Indian
                government procurement intelligence, contractor-tender matching
                with
                pgvector); <strong>Strix/Aegis</strong> (human-in-the-loop
                LangGraph + Textual TUI with Docker sandboxing); and{" "}
                <strong>ThinkZone NGO</strong> (WhatsApp broadcast bot). At{" "}
                <strong>Codomotive</strong> he migrated a legacy MySQL+Java
                backend to serverless Postgres on NeonDB, wrote a Golang Tomcat
                mediator, and built a WebRTC one-to-many comms system. Earlier
                roles include backend internships at{" "}
                <strong>KO.GG Esports</strong> and data work at{" "}
                <strong>Critical X Esports</strong>.
              </p>
              <p>
                Independent work includes <strong>Dockey</strong>, a
                WhatsApp-first practice management system for the Indian OPD
                environment now live at{" "}
                <a
                  href="https://www.dockey.in"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  dockey.in
                </a>
                , and a distributed <strong>eProcure.gov.in scraper</strong>
                {" "}with CAPTCHA solving via TrOCR ONNX (~88% accuracy). He is
                preparing for CFA Level 1 (Nov 2026); interests run to
                distributed scraping infrastructure, Indian government
                procurement data, AI-native product design, and pickleball.
              </p>
            </>
          }
          workLabel="Selected work · 04"
          works={[
            {
              kicker: (
                <>
                  INDEPENDENT
                  <br />
                  HEALTHTECH
                </>
              ),
              title: "Dockey, WhatsApp-first OPD practice management",
              body: "Built and shipped Dockey end-to-end: a WhatsApp-first practice management system that automates the entire patient journey, appointments, prescriptions, medical certificates, and reminders, without requiring patients to download an app. The doctor dashboard handles Rx tracking, reorders, in-house and pickup queues; reminder flows have cut no-shows by up to ~70% in pilots. Positioned as the UPI-style standard for the Indian OPD environment.",
              chips: [
                "WhatsApp Cloud API",
                "Node.js",
                "Postgres",
                "AWS",
                "Reminders",
              ],
              href: "https://www.dockey.in",
              stretch: true,
              mediaGroup: [
                {
                  src: "/projects/dockey-1.png",
                  alt: "Dockey doctor dashboard, patient tracking and Rx reorders",
                  caption: "dashboard · reorders",
                },
                {
                  src: "/projects/dockey-2.png",
                  alt: "Dockey daily Rx queue and reminder workflow",
                  caption: "daily Rx · reminders",
                },
              ],
            },
            {
              kicker: (
                <>
                  CONTRACT
                  <br />
                  PETWELL · GUDPET
                </>
              ),
              title: "GudPet (Petwell Solutions), AI agent + RAG",
              body: "Full-stack engineer on a pet-health SaaS (React + NestJS). Built a LangGraph AI agent that uses each user's full activity history as context for state-aware care guidance, integrated AWS Bedrock Knowledge Base on OpenSearch for semantic document retrieval, instrumented the agent with OpenTelemetry to NewRelic for trace-level visibility into LLM calls and tool invocations, and owned the CI/CD pipeline for staging and production.",
              chips: [
                "NestJS",
                "React",
                "LangGraph",
                "Bedrock",
                "OpenSearch",
                "OTEL",
                "NewRelic",
              ],
              href: "https://www.mygudpet.com",
              stretch: true,
            },
            {
              kicker: (
                <>
                  TECHNICAL CONSULTANT
                  <br />
                  OPERISOFT TECHNOLOGIES
                </>
              ),
              title: "Multi-tenant AWS platform + Chrome Extension reverse-eng",
              body: "Owned 4+ microservices and the full AWS stack (ECS, ECR, CodePipeline, API Gateway). Reverse-engineered Java JAR/.exe binaries into Docker images on AWS Lambda, eliminating dedicated compute and saving ~$300/month. Built a sandboxed Chrome Extension with an in-memory credential relay so the host app can make authenticated third-party API calls without CORS or backend round-trips, and architected wildcard-subdomain multi-tenancy on ACM + ALB with per-tenant SSL.",
              chips: [
                "AWS ECS",
                "Lambda",
                "Docker",
                "Chrome Extension",
                "WXT",
                "ACM/ALB",
              ],
            },
            {
              kicker: <>INDEPENDENT R&amp;D</>,
              title: "eProcure.gov.in distributed scraper",
              body: "Distributed scraper for India's central public procurement portal with CAPTCHA solving via TrOCR ONNX at ~88% accuracy. Tooling that turns the country's procurement records into queryable data for downstream tender-matching pipelines.",
              chips: ["TrOCR", "ONNX", "Apify", "Python"],
            },
          ]}
        />

        <Together />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
