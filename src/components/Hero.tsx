import { useEffect, useState, type CSSProperties, type PointerEvent } from "react";
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
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

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

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  const sceneStyle = {
    "--signal-x": `${pointer.x * 18}px`,
    "--signal-y": `${pointer.y * 18}px`,
  } as CSSProperties;

  return (
    <section
      id="home"
      className="hero-signal"
      style={sceneStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="hero-aurora" aria-hidden="true" />
      <div className="signal-grid" aria-hidden="true" />
      <div className="signal-orbit signal-orbit-one" aria-hidden="true" />
      <div className="signal-orbit signal-orbit-two" aria-hidden="true" />
      <svg className="signal-constellation" viewBox="0 0 800 800" aria-hidden="true">
        <circle className="constellation-ring" cx="400" cy="400" r="260" />
        <circle className="constellation-ring constellation-ring-inner" cx="400" cy="400" r="164" />
        <path className="constellation-path" d="M110 516 258 284 400 400 606 220 690 540 400 680 110 516Z" />
        <circle className="constellation-node" cx="258" cy="284" r="7" />
        <circle className="constellation-node" cx="606" cy="220" r="7" />
        <circle className="constellation-node" cx="690" cy="540" r="7" />
        <circle className="constellation-node" cx="400" cy="680" r="7" />
        <circle className="constellation-node constellation-node-core" cx="400" cy="400" r="12" />
      </svg>
      <div className="signal-readout signal-readout-top" aria-hidden="true">SYS // 0x1A7F</div>
      <div className="signal-readout signal-readout-side" aria-hidden="true">FIELD<br />ACTIVE</div>

      <motion.div
        className="container hero-content"
        variants={reducedMotion ? undefined : container}
        initial={reducedMotion ? false : "hidden"}
        animate={reducedMotion ? undefined : "show"}
      >
        <motion.p variants={item} className="section-label" style={{ marginBottom: 28 }}>
          <span aria-hidden="true">✦</span> Signal detected // Ian Mattas
        </motion.p>

        <motion.h1
          variants={item}
          aria-label="Ian Mattas"
          className="hero-title"
        >
          Ian
          <br />
          <GlitchText text="Mattas" className="outline-text" />
        </motion.h1>

        <motion.div variants={item} className="hero-role">
          <ScrambleText
            key={roleIndex}
            as="h2"
            text={roles[roleIndex]}
            speed={35}
            style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 600, color: "var(--cyan)" }}
          />
        </motion.div>

        <motion.p
          variants={item}
          className="hero-description"
        >
          I make computers do things they weren't supposed to do. Reverse engineering, malware
          analysis, and low-level systems — five years deep.
        </motion.p>

        <motion.div className="hero-actions" variants={item}>
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

      <motion.div
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { delay: 1.2 }}
        className="scroll-cue"
      >
        <motion.div
          animate={reducedMotion ? { y: 0 } : { y: [0, 12, 0] }}
          transition={reducedMotion ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="scroll-cue-label"
        >
          Scroll ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
