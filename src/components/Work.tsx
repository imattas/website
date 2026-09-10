import { motion, useReducedMotion } from "framer-motion";
import { projects } from "../data";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

export default function Work() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="work" className="section" style={{ background: "var(--bg-soft)", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)" }}>
      <div className="container">
        <Reveal>
          <p className="section-label">02 — Selected Work</p>
          <h2 className="section-title">
            Projects I <span className="accent">work on</span>
          </h2>
        </Reveal>

        <div
          className="projects-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 32,
            marginTop: 56,
          }}
        >
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.1}>
              <TiltCard max={6}>
                <motion.a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={reducedMotion ? undefined : { y: -6 }}
                  className="project-card"
                  style={{ display: "block", position: "relative" }}
                >
                  <div
                    style={{
                      height: 200,
                      background: p.gradient,
                      position: "relative",
                      borderBottom: "2px solid var(--ink)",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 20,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: "var(--ink)",
                        color: "var(--bg)",
                        padding: "4px 12px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {p.year}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1.6rem",
                        color: "#fff",
                        textShadow: "2px 2px 0 rgba(0,0,0,0.4)",
                        textTransform: "uppercase",
                      }}
                    >
                      {p.title}
                    </span>
                  </div>

                  <div style={{ padding: "22px 20px" }}>
                    <div className="project-meta">
                      <span>{p.status}</span>
                    </div>
                    <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 18 }}>{p.description}</p>
                    <p className="project-outcome">{p.outcome}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {p.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="project-cta">View repository ↗</span>
                  </div>
                </motion.a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
