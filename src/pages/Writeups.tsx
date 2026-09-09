import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ctfGroups, writeups } from "../content/writeups";
import Reveal from "../components/Reveal";

function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Writeups() {
  const [open, setOpen] = useState<string | null>(ctfGroups[0]?.slug ?? null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const total = ctfGroups.reduce((n, g) => n + g.writeups.length, 0);
  const categories = Array.from(new Set(writeups.map((w) => w.ctfTitle))).sort();
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

  return (
    <section className="section" style={{ minHeight: "80vh" }}>
      <div className="container">
        <Reveal>
          <p className="section-label">05 — Writeups</p>
          <h2 className="section-title">
            CTF <span className="accent">writeups</span>
          </h2>
          <p className="section-sub">
            {total} writeups across {ctfGroups.length} competitions — reversing, pwn, crypto, web,
            forensics, and more.
          </p>
        </Reveal>

        <div className="writeup-filters" aria-label="Filter writeups">
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
                    <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                      <h3
                        style={{
                          fontSize: "1.5rem",
                          textTransform: "uppercase",
                          color: "var(--ink)",
                        }}
                      >
                        {group.title}
                      </h3>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.8rem",
                          color: "var(--muted)",
                        }}
                      >
                        {group.writeups.length} writeups
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
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
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
