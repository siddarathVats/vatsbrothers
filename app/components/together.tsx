import { Reveal } from "./reveal";

const CELLS = [
  {
    num: "01 · flagship",
    wide: true,
    title: "Multi-agent systems on LangGraph",
    body: "Design and ship LangGraph multi-agent architectures: routing, tool orchestration, human-in-the-loop, persistent state (PostgresSaver), and cost/latency budgeting. We’ve used it for medical NLP, accelerator marketplaces, and cybersecurity HITL workflows.",
  },
  {
    num: "02",
    title: "RAG that doesn’t degrade",
    body: "Bedrock + OpenSearch, pgvector on Postgres, hybrid retrieval, eval harnesses. We’ll tell you when RAG is the wrong answer.",
  },
  {
    num: "03",
    title: "Data engineering for AI",
    body: "BigQuery, Redshift, S3/GCS, TimescaleDB. ETL that LLMs actually need, not generic warehouse plumbing.",
  },
  {
    num: "04",
    title: "Backend + AWS infra",
    body: "FastAPI / NestJS / Node, Lambda, SES, SQS, Docker. Production-grade defaults, sane IAM, sensible bills.",
  },
  {
    num: "05",
    title: "Observability for LLM apps",
    body: "NewRelic + OpenLLMetry tracing, latency/cost dashboards, drift signals. Built into the stack from day one.",
  },
  {
    num: "06",
    title: "Cost & migration audits",
    body: "Concrete: we cut a client’s vector-search bill by swapping OpenSearch Serverless for pgvector. We do this kind of audit as a fixed-scope engagement.",
  },
] as const;

export function Together() {
  return (
    <section className="section" id="together" aria-labelledby="tog-h">
      <div className="container-1200">
        <Reveal>
          <div className="sec-h">
            <span className="dot" aria-hidden />
            <span className="sec-h__index mono">04 / Together</span>
          </div>
          <h2 className="sec-title" id="tog-h">
            Together
          </h2>
          <p className="sec-kicker">Two engineers · one engagement model</p>
          <p className="sec-lead">
            When we work together, the engagement is small, technical, and
            outcome-shaped. One of us leads the AI architecture and research;
            the other ships the production system and the infra around it.{" "}
            <strong>
              We’re brothers, so the handoff cost is roughly zero
            </strong>{" "}
            . That's the whole point of hiring us as a pair.
          </p>
        </Reveal>

        <Reveal className="bento">
          {CELLS.map((c) => (
            <article
              key={c.num}
              className={`bcell${c.wide ? " bcell--wide" : ""}`}
            >
              <span className="bcell__num mono">{c.num}</span>
              <h3 className="bcell__title">{c.title}</h3>
              <p className="bcell__body">{c.body}</p>
            </article>
          ))}
        </Reveal>

        <Reveal className="together__cta">
          <p>
            Need both of us on something? <span>→</span> Email us
          </p>
          <a className="btn btn--primary" href="#contact">
            Start a conversation{" "}
            <span className="arrow" aria-hidden>
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
