import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socials } from "../data";

const links = [
  { label: "Home", href: "/#home", num: "00" },
  { label: "About", href: "/#about", num: "01" },
  { label: "Work", href: "/#work", num: "02" },
  { label: "Skills", href: "/#skills", num: "03" },
  { label: "Writeups", href: "/writeups", num: "04" },
  { label: "Contact", href: "/#contact", num: "05" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "var(--bg)" : "transparent",
        borderBottom: scrolled ? "2px solid var(--ink)" : "2px solid transparent",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <nav className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="/#home" aria-label="Ian Mattas home" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", textTransform: "uppercase" }}>
          IM<span className="accent">.</span>
        </a>

        <ul style={{ display: "flex", gap: 28, listStyle: "none" }} className="desktop-links">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                style={{ color: "var(--ink)", fontSize: "0.95rem", fontWeight: 600, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", marginRight: 4 }}>
                  {l.num}
                </span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-socials" style={{ display: "flex", gap: 16 }}>
          {socials.slice(0, 3).map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ color: "var(--ink)", fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>
              {s.label}
            </a>
          ))}
        </div>

        <button
          className="menu-btn"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--ink)",
            fontSize: "1.6rem",
            cursor: "pointer",
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", background: "var(--bg)", borderBottom: "2px solid var(--ink)" }}
          >
            <ul style={{ listStyle: "none", padding: "16px 0" }}>
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    style={{ display: "block", padding: "12px 24px", color: "var(--ink)", fontSize: "1.1rem", fontWeight: 600 }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
