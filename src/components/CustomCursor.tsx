import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a small dot that tracks instantly and a ring that lags behind.
 * The ring grows when hovering interactive elements.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const media = window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)");

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;
    let listening = false;
    let activated = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (!activated) {
        activated = true;
        document.body.classList.add("has-custom-cursor");
        raf = requestAnimationFrame(tick);
      }

      const target = e.target;
      const nextHovering =
        target instanceof Element &&
          !!target.closest("a, button, input, textarea, .project-card, .stat-card, .skill-card, .social-pill");
      if (nextHovering !== hoveringRef.current) {
        hoveringRef.current = nextHovering;
        setHovering(nextHovering);
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!listening) return;
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      raf = 0;
      listening = false;
      activated = false;
      document.body.classList.remove("has-custom-cursor");
      hoveringRef.current = false;
      setHovering(false);
    };

    const start = () => {
      if (media.matches || listening) return;
      listening = true;
      window.addEventListener("mousemove", onMove);
    };

    const onMediaChange = () => (media.matches ? stop() : start());
    if (typeof media.addEventListener === "function") media.addEventListener("change", onMediaChange);
    else media.addListener(onMediaChange);
    start();

    return () => {
      if (typeof media.removeEventListener === "function") media.removeEventListener("change", onMediaChange);
      else media.removeListener(onMediaChange);
      stop();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className={`cursor-ring${hovering ? " hovering" : ""}`} aria-hidden="true" />
    </>
  );
}
