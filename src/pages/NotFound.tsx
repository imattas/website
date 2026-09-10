import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applyDocumentMeta } from "../documentMeta";

export default function NotFound() {
  const { pathname } = useLocation();

  useEffect(() => applyDocumentMeta({
    title: "Page Not Found — Ian Mattas",
    description: "The requested page could not be found on Ian Mattas's portfolio.",
    path: pathname,
    robots: "noindex, follow",
  }), [pathname]);

  return (
    <section className="section route-loading" aria-labelledby="not-found-title">
      <div className="container">
        <p className="section-label">404 — Not Found</p>
        <h1 id="not-found-title" className="section-title">Page <span className="accent">missing</span></h1>
        <p className="section-sub">That route does not exist. The rest of the site is still here.</p>
          <Link className="btn btn-primary route-home-link" to="/">Back home <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
