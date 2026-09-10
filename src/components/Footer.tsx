import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ borderTop: "2px solid var(--ink)", padding: "40px 0", position: "relative", zIndex: 2, background: "var(--bg)" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, textTransform: "uppercase" }}>
          IM<span className="accent">.</span>
        </span>
        <span style={{ color: "var(--muted)", fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>
          © {new Date().getFullYear()} Ian Mattas. Crafted with React &amp; motion.
        </span>
        <Link to="/#home" style={{ color: "var(--ink)", fontSize: "0.9rem", fontWeight: 600 }}>
          Back to top <span aria-hidden="true">↑</span>
        </Link>
      </div>
    </footer>
  );
}
