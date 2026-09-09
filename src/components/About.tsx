import { motion } from "framer-motion";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { roadmap } from "../data";

const stats = [
  { value: "05", label: "Years reversing" },
  { value: "200+", label: "Writeups published" },
  { value: "22", label: "Repositories" },
  { value: "02", label: "Security orgs" },
];

export default function About() {
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
              into reverse engineering. I’m the owner and captain of <a href="https://idktheflag.sh" target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>idktheflag</a> and
              founded <a href="https://github.com/redsecc" target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>redsecc</a>.
            </p>
            <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
              My world is reverse engineering, malware analysis, binary obfuscation, symbolic
              execution, and cryptography. I live in the low-level — disassemblers, debuggers, and
              the guts of how software actually runs.
            </p>
            <div className="availability-note" aria-label="Current availability">
              <span className="availability-dot" />
              Open to interesting security, systems, and research collaborations.
            </div>
          </Reveal>

          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {stats.map((s, i) => (
              <TiltCard key={s.label} max={8}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
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
        <div className="roadmap" aria-label="Roadmap">
          <p className="section-label">Roadmap</p>
          <div className="roadmap-track">
            {roadmap.map((item, index) => (
              <div className="roadmap-point" key={item.title}>
                <button className="roadmap-marker" type="button" aria-label={`${item.label}: ${item.title}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
                <div className="roadmap-card">
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
