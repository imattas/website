import { socials } from "../data";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function Contact() {
  return (
    <section id="contact" className="section" style={{ background: "var(--ink)", color: "var(--bg)" }}>
      <div className="container">
        <Reveal>
          <p className="section-label" style={{ background: "var(--accent)", color: "#fff", borderColor: "var(--bg)", boxShadow: "3px 3px 0 0 var(--bg)" }}>
            04 — Contact
          </p>
          <h2 className="section-title" style={{ color: "var(--bg)" }}>
            Have something <span className="accent">interesting?</span>
          </h2>
          <p className="section-sub" style={{ color: "var(--bg-soft)" }}>
            The best way to reach me is email. Include what you’re working on, what you need, and any useful context.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="contact-panel">
            <div>
              <span className="contact-kicker">Direct line</span>
              <h3>ian@mattas.net</h3>
              <p>Open to security research, systems work, collaboration, and thoughtful technical conversations.</p>
            </div>
            <Magnetic>
              <a className="btn btn-primary" href="mailto:ian@mattas.net?subject=Hello%20Ian">Email me →</a>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="contact-links">
            {socials.filter((s) => s.label !== "Website" && s.label !== "Email").map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-pill" style={{ borderColor: "var(--bg)", color: "var(--bg)", background: "transparent" }}>
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
