import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
  speed?: number;
  style?: React.CSSProperties;
}

/**
 * Text that "scrambles" through random characters before settling on the real text.
 * Re-triggers when it scrolls into view.
 */
export default function ScrambleText({ text, className, as = "span", speed = 30, style }: ScrambleTextProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const started = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          let frame = 0;
          const total = text.length;
          intervalRef.current = setInterval(() => {
            frame++;
            const progress = frame / (total + 8);
            const revealCount = Math.floor(progress * total);
            let out = "";
            for (let i = 0; i < total; i++) {
              if (i < revealCount) {
                out += text[i];
              } else if (text[i] === " ") {
                out += " ";
              } else {
                out += CHARS[Math.floor(Math.random() * CHARS.length)];
              }
            }
            setDisplay(out);
            if (revealCount >= total) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = null;
              setDisplay(text);
            }
          }, speed);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [reducedMotion, text, speed]);

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className} style={style} aria-label={text}>
      {display}
    </Tag>
  );
}
