import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyDocumentMeta } from "../documentMeta";

export default function NotFound() {
  useEffect(() => applyDocumentMeta({
    title: "Page Not Found — Ian Mattas",
    description: "The requested page could not be found on Ian Mattas's portfolio.",
    path: window.location.pathname,
    robots: "noindex, follow",
  }), []);

  return (
    <section className="section route-loading" aria-labelledby="not-found-title">
      <div className="container">
        <p className="section-label">404 — Not Found</p>
        <h1 id="not-found-title" className="section-title">Page <span className="accent">missing</span></h1>
        <p className="section-sub">That route does not exist. The rest of the site is still here.</p>
        <Link className="btn btn-primary route-home-link" to="/">Back home →</Link>
      </div>
    </section>
  );
}
