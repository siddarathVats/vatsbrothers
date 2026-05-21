export function Footer() {
  return (
    <footer className="site" role="contentinfo">
      <div className="container-1200">
        <div className="foot">
          <div>
            <a
              className="logo"
              href="#brothers"
              style={{ fontSize: 14 }}
            >
              <span>vats</span>
              <span className="slash">/</span>
              <b>brothers</b> · 2026
            </a>
            <p
              style={{
                marginTop: 12,
                color: "var(--muted)",
                maxWidth: "38ch",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Two brothers building AI systems. Available together as a small
              consulting practice, or independently for full-time and contract
              roles.
            </p>
          </div>
          <div>
            <h4>Sitemap</h4>
            <nav className="foot__nav" aria-label="Footer">
              <a href="#brothers">Brothers</a>
              <a href="#siddarath">Siddarath</a>
              <a href="#vinayak">Vinayak</a>
              <a href="#together">Together</a>
              <a href="#stack">Stack</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <div>
            <h4>Reach us</h4>
            <div className="foot__social">
              <div className="foot__person">
                <span className="nm">Siddarath Vats</span>
                <div className="links">
                  <a
                    href="mailto:siddarathvats.ele17@gmail.com"
                    aria-label="Email Siddarath"
                  >
                    siddarathvats.ele17@gmail.com
                  </a>
                </div>
                <div className="links">
                  <a
                    href="https://linkedin.com/in/siddarath-vats-51bb65155"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    LinkedIn
                  </a>
                  <span style={{ color: "var(--muted-2)" }}>·</span>
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div className="foot__person">
                <span className="nm">Vinayak Vats</span>
                <div className="links">
                  <a href="mailto:vinayakvats.work@gmail.com">
                    vinayakvats.work@gmail.com
                  </a>
                </div>
                <div className="links">
                  <a
                    href="https://github.com/wolf-4bit"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    GitHub
                  </a>
                  <span style={{ color: "var(--muted-2)" }}>·</span>
                  <a
                    href="https://www.upwork.com/freelancers/~0170ebcfaf68472ea1"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Upwork
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="foot__bottom">
          <span>© 2026 Vats Brothers. All rights reserved.</span>
          <span className="credit">
            Dallas <span>↔</span> Ahmedabad
          </span>
        </div>
      </div>
    </footer>
  );
}
