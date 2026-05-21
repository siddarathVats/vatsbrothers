"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "./reveal";
import { BookButton } from "./book-button";

export function Contact() {
  const [status, setStatus] = useState<{ color: string; text: string }>({
    color: "var(--accent-joint)",
    text: "",
  });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;
    if (!data.name || !data.email || !data.message) {
      setStatus({
        color: "var(--accent-vin)",
        text: "Name, email and message are required.",
      });
      return;
    }
    setSending(true);
    setStatus({ color: "var(--muted)", text: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus({
        color: "var(--accent-joint)",
        text: "Thanks, we’ll reply within 24 hours.",
      });
      form.reset();
      setTimeout(() => setStatus({ color: "var(--muted)", text: "" }), 6000);
    } catch {
      setStatus({
        color: "var(--accent-vin)",
        text: "Couldn’t send right now. Please email us directly.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" id="contact" aria-labelledby="contact-h">
      <div className="container-1200">
        <Reveal>
          <div className="sec-h">
            <span className="dot" aria-hidden />
            <span className="sec-h__index mono">06 / Contact</span>
          </div>
        </Reveal>
        <div className="contact-grid">
          <Reveal className="contact-left">
            <h2 id="contact-h">Connect with us.</h2>
            <p>
              If you have an AI system that needs shipping, an LLM bill you want
              audited, or a backend you want rewritten, write to us. We reply
              within 24 hours.
            </p>

            <a
              className="email-btn"
              href="mailto:siddarathvats.ele17@gmail.com"
            >
              <span>
                <span className="lbl">Email · Dallas</span>
                <br />
                <span className="addr">siddarathvats.ele17@gmail.com</span>
              </span>
              <span className="arrow" aria-hidden>
                →
              </span>
            </a>
            <a className="email-btn" href="mailto:vinayakvats.work@gmail.com">
              <span>
                <span className="lbl">Email · Ahmedabad</span>
                <br />
                <span className="addr">vinayakvats.work@gmail.com</span>
              </span>
              <span className="arrow" aria-hidden>
                →
              </span>
            </a>

            <BookButton />
          </Reveal>

          <Reveal as="form" className="form" onSubmit={onSubmit} noValidate>
            <div className="row two">
              <div className="field">
                <label htmlFor="f-name">Name</label>
                <input
                  id="f-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="field">
                <label htmlFor="f-email">Email</label>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-company">
                Company{" "}
                <span className="mono" style={{ color: "var(--muted-2)" }}>
                  (optional)
                </span>
              </label>
              <input
                id="f-company"
                name="company"
                type="text"
                autoComplete="organization"
              />
            </div>
            <div className="field">
              <label htmlFor="f-topic">I’m reaching out about…</label>
              <select id="f-topic" name="topic" defaultValue="MVP development">
                <option>MVP development</option>
                <option>Hiring (full-time)</option>
                <option>Consulting / project work</option>
                <option>Press / partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-msg">Message</label>
              <textarea id="f-msg" name="message" rows={6} required />
            </div>
            <div
              className="row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <button className="send" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send"}{" "}
                <span className="arrow" aria-hidden>
                  →
                </span>
              </button>
              <span
                className="form-status mono"
                aria-live="polite"
                style={{ color: status.color }}
              >
                {status.text}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
