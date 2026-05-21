import Image from "next/image";
import { Reveal } from "./reveal";

export function MeetBrothers() {
  return (
    <section className="section" aria-labelledby="duo-h">
      <div className="container-1200">
        <Reveal>
          <div className="sec-h">
            <span className="dot" aria-hidden />
            <span className="sec-h__index mono">01 / Meet the brothers</span>
          </div>
          <h2 className="sec-title" id="duo-h">
            Two engineers. One last name.
          </h2>
          <p className="sec-kicker">
            A split intro · Dallas, CT &nbsp;·&nbsp; Ahmedabad, IST
          </p>
        </Reveal>

        <Reveal className="duo">
          <article className="duo__card" data-brother="sid">
            <div className="duo__head">
              <div className="avatar avatar--photo" aria-hidden>
                <Image
                  src="/people/sid.png"
                  alt=""
                  width={144}
                  height={144}
                  sizes="72px"
                  className="avatar__img"
                />
              </div>
              <div>
                <h3>
                  <span className="accent-dot" aria-hidden />
                  Siddarath Vats
                </h3>
                <div className="role">
                  AI Research Engineer · M.S. CS (AI), SMU ’25
                </div>
              </div>
            </div>
            <p className="one">
              Multi-agent LLM pipelines and medical NLP, deployed on HPC.
              Ex-Adani Green data scientist (~9 GW renewable portfolio).
            </p>
            <div className="meta">
              <span>
                <span className="city">Dallas, TX</span> · CT
              </span>
              <span className="muted">UTC−5</span>
            </div>
            <a className="jump" href="#siddarath">
              siddarath{" "}
              <span className="arrow" aria-hidden>
                ↓
              </span>
            </a>
          </article>

          <article className="duo__card" data-brother="vin">
            <div className="duo__head">
              <div className="avatar avatar--photo" aria-hidden>
                <Image
                  src="/people/vin.png"
                  alt=""
                  width={144}
                  height={144}
                  sizes="72px"
                  className="avatar__img"
                />
              </div>
              <div>
                <h3>
                  <span className="accent-dot" aria-hidden />
                  Vinayak Vats
                </h3>
                <div className="role">
                  Freelance AI + Backend Engineer · Operisoft + Petwell
                </div>
              </div>
            </div>
            <p className="one">
              Ships LangGraph multi-agent systems, FastAPI/Node backends, and
              AWS infra for clients across India, the Netherlands, Singapore,
              and North America.
            </p>
            <div className="meta">
              <span>
                <span className="city">Ahmedabad, India</span> · IST
              </span>
              <span className="muted">UTC+5:30</span>
            </div>
            <a className="jump" href="#vinayak">
              vinayak{" "}
              <span className="arrow" aria-hidden>
                ↓
              </span>
            </a>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
