import { motion } from "framer-motion";
import { programmingLanguages, skillGroups } from "../data";
import Reveal from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <Reveal>
          <p className="section-label">03 — Skills</p>
          <h2 className="section-title">
          How I <span className="accent">work</span>
          </h2>
        </Reveal>

        <div className="skill-index" style={{ marginTop: 56 }}>
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.05}>
              <details className="skill-row" style={{ "--skill-color": group.color } as React.CSSProperties}>
                <summary>
                  <span className="skill-row-number">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{group.title}</h3>
                  <span className="skill-row-toggle" aria-hidden="true">+</span>
                </summary>
                <div className="skill-row-detail">
                  <p>{group.description}</p>
                  <div className="skill-tools">{group.tools.map((tool) => <span className="tag" key={tool}>{tool}</span>)}</div>
                </div>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="languages-section">
            <p className="section-label">Programming languages</p>
            <div className="language-grid">
              {programmingLanguages.map((language, index) => (
                <div className="language-card" key={language.name}>
                  <div className="language-card-heading">
                    <strong>{language.name}</strong>
                    <span>{language.level}%</span>
                  </div>
                  <div className="language-track" aria-label={`${language.name}: ${language.level}%`}>
                    <motion.div
                      className="language-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${language.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: index * 0.08 }}
                      style={{ background: language.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
