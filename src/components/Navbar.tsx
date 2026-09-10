import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { socials } from "../data";

const links = [
  { label: "Home", href: "/#home", num: "00" },
  { label: "About", href: "/#about", num: "01" },
  { label: "Work", href: "/#work", num: "02" },
  { label: "Skills", href: "/#skills", num: "03" },
  { label: "Contact", href: "/#contact", num: "04" },
  { label: "Writeups", href: "/writeups", num: "05" },
];

function currentPage(link: typeof links[number], pathname: string) {
  if (link.label === "Home") return pathname === "/";
  if (link.label === "Writeups") return pathname === "/writeups" || pathname.startsWith("/writeups/");
  return false;
}

export default function Navbar() {
  const reducedMotion = useReducedMotion();
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <motion.header
      initial={reducedMotion ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
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
        <Link to="/#home" aria-label="Ian Mattas home" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", textTransform: "uppercase" }}>
          IM<span className="accent">.</span>
        </Link>

        <ul style={{ display: "flex", gap: 28, listStyle: "none" }} className="desktop-links">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                aria-current={currentPage(l, location.pathname) ? "page" : undefined}
                style={{ color: "var(--ink)", fontSize: "0.95rem", fontWeight: 600, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", marginRight: 4 }}>
                  {l.num}
                </span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-socials" style={{ display: "flex", gap: 16 }}>
          {socials.slice(0, 3).map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>
              {s.label}
            </a>
          ))}
        </div>

        <button
          ref={menuButtonRef}
          className="menu-btn"
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={open ? "mobile-navigation" : undefined}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--ink)",
            fontSize: "1.6rem",
            cursor: "pointer",
          }}
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={reducedMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : undefined}
            style={{ overflow: "hidden", background: "var(--bg)", borderBottom: "2px solid var(--ink)" }}
          >
            <ul style={{ listStyle: "none", padding: "16px 0" }}>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    to={l.href}
                    aria-current={currentPage(l, location.pathname) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    style={{ display: "block", padding: "12px 24px", color: "var(--ink)", fontSize: "1.1rem", fontWeight: 600 }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
