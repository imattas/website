import { Link, Routes, Route, useLocation } from "react-router-dom";
import { Component, lazy, Suspense, useEffect, useRef, type ReactNode } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Marquee from "./components/Marquee";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import NotFound from "./pages/NotFound";
import { applyDocumentMeta } from "./documentMeta";
const Writeups = lazy(() => import("./pages/Writeups"));
const WriteupPost = lazy(() => import("./pages/WriteupPost"));

const marqueeItems = [
  "Reverse Engineering",
  "Binary Exploitation",
  "Malware Analysis",
  "Binary Obfuscation",
  "Symbolic Execution",
  "Cryptography",
  "Low-Level Systems",
  "CTFs",
];

interface RouteErrorBoundaryState {
  hasError: boolean;
}

class RouteErrorBoundary extends Component<{ children: ReactNode }, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <section className="section route-loading" role="alert" aria-labelledby="route-error-title">
        <div className="container">
          <p className="section-label">Route error</p>
          <h1 id="route-error-title" className="section-title">This page <span className="accent">failed</span></h1>
          <p className="section-sub">The page could not be rendered. Return home and try again.</p>
          <div className="route-error-actions">
            <button className="btn btn-ghost" type="button" onClick={() => this.setState({ hasError: false })}>Try again</button>
            <Link className="btn btn-primary route-home-link" to="/">Back home <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
    );
  }
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const previousLocation = useRef<string | null>(null);
  useEffect(() => {
    const locationKey = `${pathname}${hash}`;
    const isRouteTransition = previousLocation.current !== null && previousLocation.current !== locationKey;
    previousLocation.current = locationKey;
    let frame = 0;
    let observer: MutationObserver | undefined;
    let settleObserver: ResizeObserver | undefined;
    let observerTimeout = 0;
    let settleTimeout = 0;

    const scrollToHash = () => {
      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // Keep the raw fragment when a malformed escape sequence is supplied.
      }
      const target = document.getElementById(id);
      if (!target) return false;
      target.scrollIntoView();
      if (!settleObserver) {
        const article = target.closest("article");
        if (article) {
          settleObserver = new ResizeObserver(() => target.scrollIntoView());
          settleObserver.observe(article);
          settleTimeout = window.setTimeout(() => {
            settleObserver?.disconnect();
            settleObserver = undefined;
          }, 3000);
        }
      }
      return true;
    };

    frame = requestAnimationFrame(() => {
      if (hash) {
        if (scrollToHash()) return;
        observer = new MutationObserver(() => {
          if (scrollToHash()) {
            observer?.disconnect();
            window.clearTimeout(observerTimeout);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        observerTimeout = window.setTimeout(() => observer?.disconnect(), 10000);
        return;
      }
      window.scrollTo(0, 0);
      if (isRouteTransition) document.getElementById("main-content")?.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      settleObserver?.disconnect();
      window.clearTimeout(observerTimeout);
      window.clearTimeout(settleTimeout);
    };
  }, [pathname, hash]);
  return null;
}

function Home() {
  useEffect(() => applyDocumentMeta({
    title: "Ian Mattas — Reverse Engineer & Security Researcher",
    description: "Ian Mattas — reverse engineer, binary exploitation researcher, and CTF player. Reverse engineering, malware analysis, binary obfuscation, and low-level systems.",
    path: "/",
  }), []);

  return (
    <>
      <Hero />
      <Marquee items={marqueeItems} />
      <About />
      <Work />
      <Skills />
      <Contact />
    </>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          const target = document.getElementById("main-content");
          if (!target) return;
          event.preventDefault();
          target.focus();
          target.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <CustomCursor />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <ScrollToTop />
      <Navbar />
      <main id="main-content" tabIndex={-1} style={{ position: "relative", zIndex: 1 }}>
        <RouteErrorBoundary key={`${location.pathname}${location.search}${location.hash}`}>
          <Suspense fallback={<div className="route-loading" role="status">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/writeups" element={<Writeups />} />
              <Route path="/writeups/:slug" element={<WriteupPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
