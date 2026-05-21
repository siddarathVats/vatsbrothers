"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  Briefcase,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import { Reveal } from "./reveal";
import { useLightbox } from "./lightbox";

export type Work = {
  kicker: ReactNode;
  title: string;
  body: string;
  chips: string[];
  href?: string;
  /** When true and `href` is set, the whole card becomes clickable. */
  stretch?: boolean;
  media?: { src: string; alt: string };
  mediaGroup?: { src: string; alt: string; caption?: string }[];
};

export type ContactLink = {
  kind: "mail" | "linkedin" | "phone" | "github" | "upwork";
  href: string;
  label: string;
};

export type Fact = { dt: string; dd: ReactNode };

type Props = {
  id: string;
  brother: "sid" | "vin";
  index: string;
  name: string;
  kicker: string;
  initials: string;
  portraitLabel: string;
  portrait?: { src: string; objectPosition?: string };
  contacts: ContactLink[];
  facts: Fact[];
  bio: ReactNode;
  workLabel: string;
  works: Work[];
};

const ICONS = {
  mail: Mail,
  linkedin: Linkedin,
  phone: Phone,
  github: Github,
  upwork: Briefcase,
} as const;

function WorkCard({ work: w }: { work: Work }) {
  const { open } = useLightbox();
  const stretched = w.stretch && w.href;
  return (
    <article
      className={`wcard${w.media ? " wcard--media" : ""}`}
    >
      {stretched && (
        <a
          className="wcard__stretch"
          href={w.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={w.title}
        />
      )}
      <div className="wcard__kicker">{w.kicker}</div>
      <div>
        <h3 className="wcard__title">
          {w.href ? (
            <a
              className="wcard__link"
              href={w.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {w.title}
              <ExternalLink aria-hidden className="wcard__ext" />
            </a>
          ) : (
            w.title
          )}
        </h3>
        <p className="wcard__body">{w.body}</p>
        {w.media && (
          <button
            type="button"
            className="wcard__media"
            onClick={() => open(w.media!)}
            aria-label={`Open image: ${w.media.alt}`}
          >
            <Image
              src={w.media.src}
              alt={w.media.alt}
              width={1600}
              height={900}
              sizes="(min-width: 1000px) 720px, 100vw"
              className="wcard__img"
            />
          </button>
        )}
        {w.mediaGroup && w.mediaGroup.length > 0 && (
          <div
            className={`wcard__gallery${
              w.mediaGroup.length === 1 ? "" : " wcard__gallery--two"
            }`}
          >
            {w.mediaGroup.map((m) => (
              <button
                type="button"
                className="wcard__media"
                key={m.src}
                onClick={() => open({ src: m.src, alt: m.alt })}
                aria-label={`Open image: ${m.alt}`}
              >
                <Image
                  src={m.src}
                  alt={m.alt}
                  width={1200}
                  height={900}
                  sizes="(min-width: 1000px) 360px, 50vw"
                  className="wcard__img"
                />
                {m.caption && (
                  <span className="wcard__caption mono">{m.caption}</span>
                )}
              </button>
            ))}
          </div>
        )}
        <div className="chips">
          {w.chips.map((chip) => (
            <span className="chip" key={chip}>
              {chip}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function BrotherSection({
  id,
  brother,
  index,
  name,
  kicker,
  initials,
  portraitLabel,
  portrait,
  contacts,
  facts,
  bio,
  workLabel,
  works,
}: Props) {
  const { open } = useLightbox();
  return (
    <section
      className="section bro"
      id={id}
      data-brother={brother}
      aria-labelledby={`${id}-h`}
    >
      <div className="container-1200">
        <Reveal>
          <div className="sec-h">
            <span className="dot" aria-hidden />
            <span className="sec-h__index mono">{index}</span>
          </div>
          <h2 className="sec-title" id={`${id}-h`}>
            {name}
          </h2>
          <p className="sec-kicker">{kicker}</p>
        </Reveal>

        <div className="bro__grid">
          <Reveal as="aside" className="bro__left">
            <button
              type="button"
              className={`portrait${portrait ? " portrait--photo" : ""}`}
              aria-label={portrait ? `Open photo of ${name}` : `Photo of ${name}`}
              onClick={() => {
                if (portrait) open({ src: portrait.src, alt: `Photo of ${name}` });
              }}
            >
              {portrait ? (
                <Image
                  src={portrait.src}
                  alt={`Photo of ${name}`}
                  fill
                  sizes="(min-width: 1000px) 300px, 100vw"
                  className="portrait__img"
                  style={{
                    objectFit: "cover",
                    objectPosition: portrait.objectPosition ?? "center",
                  }}
                  priority
                />
              ) : (
                <div className="portrait__initials" aria-hidden>
                  {initials}
                </div>
              )}
              <span className="portrait__label">{portraitLabel}</span>
            </button>
            <div className="contact-row" aria-label={`Contact ${name}`}>
              {contacts.map((c) => {
                const Icon = ICONS[c.kind];
                const external =
                  c.kind === "linkedin" ||
                  c.kind === "github" ||
                  c.kind === "upwork";
                return (
                  <a
                    key={c.kind}
                    className="icon-btn"
                    href={c.href}
                    aria-label={c.label}
                    {...(external
                      ? { target: "_blank", rel: "noreferrer noopener" }
                      : {})}
                  >
                    <Icon aria-hidden />
                  </a>
                );
              })}
            </div>
            <dl className="facts">
              {facts.map((f) => (
                <div key={f.dt}>
                  <dt>{f.dt}</dt>
                  <dd>{f.dd}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="bro__right">
            <Reveal className="bio">{bio}</Reveal>

            <Reveal className="work">
              <div className="work__lbl">{workLabel}</div>
              {works.map((w, i) => (
                <WorkCard key={i} work={w} />
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
