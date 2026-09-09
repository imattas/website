import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getWriteup, formatDate, writeups } from "../content/writeups";

export default function WriteupPost() {
  const { slug } = useParams<{ slug: string }>();
  const writeup = slug ? getWriteup(slug) : undefined;

  if (!writeup) return <Navigate to="/writeups" replace />;

  const { ctfTitle, date, content } = writeup;
  const currentIndex = writeups.findIndex((item) => item.slug === writeup.slug);
  const previous = writeups[currentIndex + 1];
  const next = writeups[currentIndex - 1];

  return (
    <section className="section" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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

          <article className="mdx-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {content}
            </ReactMarkdown>
          </article>

          <nav className="post-navigation" aria-label="Writeup navigation">
            {previous ? <Link to={`/writeups/${previous.slug}`}><span>← Previous</span>{previous.title}</Link> : <span />}
            {next ? <Link to={`/writeups/${next.slug}`}><span>Next →</span>{next.title}</Link> : <span />}
          </nav>
        </motion.div>
      </div>
    </section>
  );
}
