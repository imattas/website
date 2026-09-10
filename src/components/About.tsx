import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { roadmap } from "../data";
import { challengeWriteups } from "../content/writeups";

const stats = [
  { value: "05", label: "Years reversing" },
  { value: String(challengeWriteups.length), label: "Writeups published" },
  { value: "22", label: "Repositories" },
  { value: "02", label: "Security orgs" },
];

export default function About() {
  const reducedMotion = useReducedMotion();
  const [openRoadmap, setOpenRoadmap] = useState<number | null>(null);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <p className="section-label">01 — About Me</p>
          <h2 className="section-title">
            Making computers do things they <span className="accent">weren't supposed to</span>
          </h2>
        </Reveal>

        <div
            className="about-layout"
            style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 48,
            marginTop: 48,
            alignItems: "center",
          }}
        >
          <Reveal delay={0.1}>
            <p style={{ color: "var(--ink-soft)", fontSize: "1.15rem", marginBottom: 16 }}>
              I'm Ian — a high school developer and aspiring red teamer from Ohio, five years deep
              into reverse engineering. I’m the owner and captain of <a href="https://idktheflag.sh" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>idktheflag</a> and
              founded <a href="https://github.com/redsecc" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>redsecc</a>.
            </p>
            <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
              My world is reverse engineering, binary exploitation, malware analysis, binary obfuscation, symbolic
              execution, and cryptography. I live in the low-level — disassemblers, debuggers, and
              the guts of how software actually runs.
            </p>
            <div className="availability-note">
              <span className="availability-dot" />
              Open to interesting security, systems, and research collaborations.
            </div>
          </Reveal>

          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {stats.map((s, i) => (
              <TiltCard key={s.label} max={8}>
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: i * 0.1 }}
                  className="stat-card"
                >
                  <div
                    style={{
                      fontSize: "2.6rem",
                      fontWeight: 800,
                      fontFamily: "var(--font-display)",
                      color: "var(--accent)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>
                    {s.label}
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
        <div className="focus-strip">
          <span className="section-label">Now</span>
          <p><strong>Current focus:</strong> building reliable low-level tooling, writing clearer security research, and turning CTF experiments into reusable systems.</p>
        </div>
        <div className="roadmap" role="region" aria-labelledby="roadmap-title">
          <p id="roadmap-title" className="section-label">Roadmap</p>
          <div className="roadmap-track">
            {roadmap.map((item, index) => (
              <div
                className={`roadmap-point${coarsePointer || openRoadmap === index ? " is-open" : ""}`}
                key={item.title}
              >
                <button
                  className="roadmap-marker"
                  type="button"
                  aria-expanded={coarsePointer || openRoadmap === index}
                  aria-controls={`roadmap-card-${index}`}
                  aria-label={`${item.label}: ${item.title}`}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) setOpenRoadmap(index);
                  }}
                  onClick={() => setOpenRoadmap(openRoadmap === index ? null : index)}
                >
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </button>
                <div
                  id={`roadmap-card-${index}`}
                  className="roadmap-card"
                  aria-hidden={!(coarsePointer || openRoadmap === index)}
                >
                  <span className="roadmap-label">{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
