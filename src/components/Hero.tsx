import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import Magnetic from "./Magnetic";
import ScrambleText from "./ScrambleText";
import GlitchText from "./GlitchText";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const roles = ["Reverse Engineer", "Security Researcher", "Malware Analyst", "CTF Player"];

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let id: number | undefined;
    const start = () => {
      if (document.hidden || id !== undefined) return;
      id = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 3200);
    };
    const stop = () => {
      if (id === undefined) return;
      window.clearInterval(id);
      id = undefined;
    };
    const onVisibilityChange = () => (document.hidden ? stop() : start());

    document.addEventListener("visibilitychange", onVisibilityChange);
    start();
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stop();
    };
  }, [reducedMotion]);
  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        borderBottom: "2px solid var(--ink)",
      }}
    >
      {/* Big background word */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 1.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          right: "-2%",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(8rem, 24vw, 22rem)",
          lineHeight: 0.8,
          color: "var(--ink)",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
        aria-hidden="true"
      >
        RE
      </motion.div>

      <motion.div
      className="container hero-content"
        variants={reducedMotion ? undefined : container}
        initial={reducedMotion ? false : "hidden"}
        animate={reducedMotion ? undefined : "show"}
        style={{ position: "relative", zIndex: 2 }}
      >
        <motion.p variants={item} className="section-label" style={{ marginBottom: 28 }}>
          <span aria-hidden="true">✦</span> Aspiring red teamer — CTF grinding
        </motion.p>

        <motion.h1
          variants={item}
          aria-label="Ian Mattas"
          style={{ fontSize: "clamp(3.2rem, 10vw, 8rem)", fontWeight: 800, textTransform: "uppercase" }}
        >
          Ian
          <br />
          <GlitchText text="Mattas" className="outline-text" />
        </motion.h1>

        <motion.div variants={item} style={{ marginTop: 24, minHeight: "2.4rem" }}>
          <ScrambleText
            key={roleIndex}
            as="h2"
            text={roles[roleIndex]}
            speed={35}
            style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 600, color: "var(--ink-soft)" }}
          />
        </motion.div>

        <motion.p
          variants={item}
          style={{ maxWidth: 520, color: "var(--muted)", fontSize: "1.15rem", marginTop: 20 }}
        >
          I make computers do things they weren't supposed to do. Reverse engineering, malware
          analysis, and low-level systems — five years deep.
        </motion.p>

        <motion.div variants={item} style={{ display: "flex", gap: 20, marginTop: 44, flexWrap: "wrap" }}>
          <Magnetic>
            <Link to="/writeups" className="btn btn-primary">
              View Writeups <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
          <Magnetic>
            <a href="https://github.com/imattas" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { delay: 1.2 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}
      >
        <motion.div
          animate={reducedMotion ? { y: 0 } : { y: [0, 12, 0] }}
          transition={reducedMotion ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Scroll ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
