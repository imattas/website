import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ctfGroups, challengeWriteups } from "../content/writeups";
import Reveal from "../components/Reveal";
import { applyDocumentMeta } from "../documentMeta";

function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Writeups() {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState<string | null>(ctfGroups[0]?.slug ?? null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    return applyDocumentMeta({
      title: "CTF Writeups — Ian Mattas",
      description: "Reproducible CTF writeups by Ian Mattas covering reversing, pwn, crypto, web, and forensics.",
      path: "/writeups",
    });
  }, []);
  const total = ctfGroups.reduce((n, g) => n + g.writeups.length, 0);
  const categories = Array.from(new Set(challengeWriteups.map((w) => w.ctfTitle))).sort();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = ctfGroups
    .map((group) => ({
      ...group,
      writeups: group.writeups.filter((w) =>
        (category === "all" || w.ctfTitle === category) &&
        (!normalizedQuery || `${w.title} ${w.ctfTitle}`.toLowerCase().includes(normalizedQuery))
      ),
    }))
    .filter((group) => group.writeups.length > 0);
  const filteredCount = filteredGroups.reduce((count, group) => count + group.writeups.length, 0);

  useEffect(() => {
    if (filteredGroups.length > 0 && !filteredGroups.some((group) => group.slug === open)) {
      setOpen(filteredGroups[0].slug);
    }
  }, [category, normalizedQuery]);

  return (
    <section className="section" style={{ minHeight: "80vh" }}>
      <div className="container">
        <Reveal>
          <p className="section-label">05 — Writeups</p>
          <h1 className="section-title">
            CTF <span className="accent">writeups</span>
          </h1>
          <p className="section-sub">
            {total} writeups across {ctfGroups.length} competitions — reversing, pwn, crypto, web,
            forensics, and more.
          </p>
        </Reveal>

        <div className="writeup-filters" role="search" aria-label="Filter writeups">
          <label className="sr-only" htmlFor="writeup-search">Search writeups</label>
          <input
            id="writeup-search"
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search challenges or competitions..."
            type="search"
          />
          <label className="sr-only" htmlFor="writeup-category">Filter by competition</label>
          <select id="writeup-category" className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All competitions</option>
            {categories.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <p className="sr-only" aria-live="polite">
          {filteredCount} matching writeup{filteredCount === 1 ? "" : "s"}.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 56 }}>
          {filteredGroups.map((group, gi) => {
            const isOpen = open === group.slug;
            return (
              <Reveal key={group.slug} delay={gi * 0.05}>
                <div
                  style={{
                    background: "var(--paper)",
                    border: "2px solid var(--ink)",
                    boxShadow: isOpen ? "var(--shadow)" : "var(--shadow-sm)",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : group.slug)}
                    aria-expanded={isOpen}
                    aria-controls={`writeups-${group.slug}`}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      padding: "20px 24px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                      <span
                        role="heading"
                        aria-level={3}
                        style={{
                          fontSize: "1.5rem",
                          textTransform: "uppercase",
                          color: "var(--ink)",
                        }}
                      >
                        {group.title}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.8rem",
                          color: "var(--muted)",
                        }}
                      >
                        {group.writeups.length} writeups
                      </span>
                    </span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: reducedMotion ? 0 : (isOpen ? 45 : 0) }}
                      transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.8rem",
                        color: "var(--accent)",
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`writeups-${group.slug}`}
                        initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                        animate={reducedMotion ? undefined : { height: "auto", opacity: 1 }}
                        exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            padding: "0 24px 24px",
                          }}
                        >
                          {group.writeups.map((w) => (
                            <Link
                              key={w.slug}
                              to={`/writeups/${w.slug}`}
                              className="writeup-row"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 20,
                                padding: "14px 20px",
                                background: "var(--bg)",
                                border: "2px solid var(--ink)",
                                boxShadow: "var(--shadow-sm)",
                                flexWrap: "wrap",
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 200 }}>
                                <h4
                                  style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "1rem",
                                    textTransform: "uppercase",
                                    marginBottom: 2,
                                  }}
                                >
                                  {w.title}
                                </h4>
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.72rem",
                                    color: "var(--muted)",
                                  }}
                                >
                                  {formatDate(w.date)}
                                </span>
                              </div>
                              <span
                                aria-hidden="true"
                                style={{
                                  fontFamily: "var(--font-display)",
                                  fontWeight: 800,
                                  fontSize: "1.3rem",
                                  color: "var(--accent)",
                                }}
                              >
                                →
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
          {filteredGroups.length === 0 && <p className="empty-state">No writeups match that search.</p>}
        </div>
      </div>
    </section>
  );
}
