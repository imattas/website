import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 3200);
    return () => clearInterval(id);
  }, []);
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
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
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
        className="container"
        variants={container}
        initial="hidden"
        animate="show"
        style={{ position: "relative", zIndex: 2 }}
      >
        <motion.p variants={item} className="section-label" style={{ marginBottom: 28 }}>
          ✦ Aspiring red teamer — CTF grinding
        </motion.p>

        <motion.h1
          variants={item}
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
            <a href="/writeups" className="btn btn-primary">
              View Writeups →
            </a>
          </Magnetic>
          <Magnetic>
            <a href="https://github.com/imattas" target="_blank" rel="noreferrer" className="btn btn-ghost">
              GitHub ↗
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
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
