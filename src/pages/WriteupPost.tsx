import { useParams, Link } from "react-router-dom";
import { isValidElement, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ctfGroups, getWriteup, formatDate, writeups, type Writeup } from "../content/writeups";
import { applyDocumentMeta } from "../documentMeta";
import NotFound from "./NotFound";

function linkKey(value: string) {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // Keep the raw filename when a malformed escape sequence is supplied.
  }
  return decoded
    .replace(/\.mdx$/i, "")
    .replace(/[^a-z0-9]+/gi, "")
    .toLowerCase();
}

function isLocalMdxLink(href: string | undefined) {
  return href?.match(/^(?:\.\.\/|\.\/)+[^?#]+\.mdx(?:[?#].*)?$/i);
}

function resolveLocalWriteup(href: string | undefined, current: Writeup) {
  const match = href?.match(/^(?:\.\.\/|\.\/)+([^?#]+\.mdx)([?#].*)?$/i);
  if (!match) return undefined;
  const targetKey = linkKey(match[1]);
  const candidates = writeups.filter((item) => item.ctfSlug === current.ctfSlug);
  const ctfKey = linkKey(current.ctfSlug);
  const target = candidates.find((item) => {
    const slugKey = linkKey(item.slug);
    return (slugKey.startsWith(ctfKey) ? slugKey.slice(ctfKey.length) : slugKey) === targetKey;
  }) ?? candidates.find((item) => linkKey(item.title).startsWith(targetKey));
  return target ? { target, suffix: match[2] ?? "" } : undefined;
}

function headingText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(headingText).join("");
  if (isValidElement(value)) return headingText(value.props.children);
  return "";
}

function headingSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

function isSafeMarkdownUrl(value: string | undefined) {
  if (!value) return false;
  const href = value.trim();
  if (/^(?:javascript|data|vbscript|file):/i.test(href)) return false;
  if (href.startsWith("#") || href.startsWith("/") || href.startsWith("./") || href.startsWith("../")) return true;
  try {
    const protocol = new URL(href, window.location.origin).protocol;
    return ["http:", "https:", "mailto:", "tel:"].includes(protocol);
  } catch {
    return false;
  }
}

function markdownComponents(currentWriteup: Writeup): Components {
  const headingId = (children: ReactNode) => {
    return headingSlug(headingText(children));
  };

  return {
    a: ({ href, children, ...props }) => {
      const legacyMatch = href?.match(/^\/volume\/2\/([^/]+)\/?$/);
      const linkedWriteup = legacyMatch ? getWriteup(legacyMatch[1]) : undefined;
      const localWriteup = resolveLocalWriteup(href, currentWriteup);
      const localMdxLink = isLocalMdxLink(href);

      if (linkedWriteup || localWriteup) {
        const target = linkedWriteup ?? localWriteup?.target;
        const suffix = localWriteup?.suffix ?? "";
        return <Link to={`/writeups/${target!.slug}${suffix}`}>{children}</Link>;
      }

      if (legacyMatch || localMdxLink) {
        return (
          <span
            className="mdx-unavailable-link"
            aria-label="Original writeup unavailable"
            title="Original writeup unavailable"
          >
            {children}
          </span>
        );
      }

      if (!isSafeMarkdownUrl(href)) {
        return (
          <span
            className="mdx-unavailable-link"
            aria-label="Unsafe link removed"
            title="Unsafe link removed"
          >
            {children}
          </span>
        );
      }

      return <a href={href} {...props}>{children}</a>;
    },
    img: ({ alt, src, ...props }) => isSafeMarkdownUrl(src) ? (
      <img
        {...props}
        src={src}
        alt={alt ?? "Writeup image"}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    ) : (
      <span className="mdx-unavailable-link" aria-label="Unsafe image removed" title="Unsafe image removed">
        Image unavailable
      </span>
    ),
    h1: ({ children, ...props }) => <h1 {...props} id={headingId(children)}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props} id={headingId(children)}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props} id={headingId(children)}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 {...props} id={headingId(children)}>{children}</h4>,
    h5: ({ children, ...props }) => <h5 {...props} id={headingId(children)}>{children}</h5>,
    h6: ({ children, ...props }) => <h6 {...props} id={headingId(children)}>{children}</h6>,
  };
}

export default function WriteupPost() {
  const reducedMotion = useReducedMotion();
  const { slug } = useParams<{ slug: string }>();
  const writeup = slug ? getWriteup(slug) : undefined;
  const [content, setContent] = useState<string | null>(null);
  const [contentSlug, setContentSlug] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [errorSlug, setErrorSlug] = useState<string | null>(null);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    setContent(null);
    setContentSlug(null);
    setLoadError(false);
    setErrorSlug(null);
    if (writeup) {
      writeup.loadContent().then((loaded) => {
        if (active) {
          setContent(loaded);
          setContentSlug(writeup.slug);
        }
      }).catch(() => {
        if (active) {
          setLoadError(true);
          setErrorSlug(writeup.slug);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [writeup]);

  useLayoutEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    const counts = new Map<string, number>();
    for (const heading of article.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
      const base = headingSlug(heading.textContent ?? "");
      const count = counts.get(base) ?? 0;
      counts.set(base, count + 1);
      heading.id = count ? `${base}-${count + 1}` : base;
    }
  }, [content, contentSlug, writeup]);

  useEffect(() => {
    if (!writeup) return;
    const title = writeup.writeupKind === "ctf" || writeup.title.endsWith(` — ${writeup.ctfTitle}`)
      ? writeup.title
      : `${writeup.title} — ${writeup.ctfTitle}`;
    const description = writeup.writeupKind === "ctf"
      ? `${title}, documented by Ian Mattas.`
      : `${title} writeup for ${writeup.ctfTitle}, documented by Ian Mattas.`;
    return applyDocumentMeta({
      title: `${title} | Ian Mattas`,
      description,
      path: `/writeups/${encodeURIComponent(writeup.slug)}`,
    });
  }, [writeup]);

  if (!writeup) return <NotFound />;
  if (loadError && errorSlug === writeup.slug) return <section className="section route-loading" role="alert">This writeup could not be loaded.</section>;
  if (content === null || contentSlug !== writeup.slug) return <section className="section route-loading" role="status">Loading writeup…</section>;

  const { ctfTitle, date } = writeup;
  const ctfWriteups = ctfGroups.find((group) => group.slug === writeup.ctfSlug)?.writeups ?? [];
  const currentIndex = ctfWriteups.findIndex((item) => item.slug === writeup.slug);
  const previous = currentIndex > 0 ? ctfWriteups[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? ctfWriteups[currentIndex + 1] : undefined;

  return (
    <section className="section" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
        >
          <Link
            to="/writeups"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--accent)",
              display: "inline-block",
              marginBottom: 32,
            }}
          >
            ← All writeups
          </Link>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>
              {formatDate(date)}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                padding: "3px 10px",
                border: "1.5px solid var(--ink)",
                background: "var(--lime)",
              }}
            >
              {ctfTitle}
            </span>
          </div>

          <article ref={articleRef} className="mdx-content">
            <ReactMarkdown components={markdownComponents(writeup)} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {content}
            </ReactMarkdown>
          </article>

          <nav className="post-navigation" aria-label="Writeup navigation">
            {previous ? <Link to={`/writeups/${previous.slug}`}><span><span aria-hidden="true">←</span> Previous</span>{previous.title}</Link> : <span />}
            {next ? <Link to={`/writeups/${next.slug}`}><span>Next <span aria-hidden="true">→</span></span>{next.title}</Link> : <span />}
          </nav>
        </motion.div>
      </div>
    </section>
  );
}
