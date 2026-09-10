import { promises as fs } from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const indexPath = path.join(dist, "index.html");
const siteUrl = "https://ianmattas.com";
const sitemap = await fs.readFile(path.resolve("public/sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/ianmattas\.com(\/[^<]*)<\/loc>/g)]
  .map((match) => decodeURIComponent(match[1]))
  .filter((route) => route !== "/" && route.startsWith("/writeups"));

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(entryPath));
    else if (entry.name === "index.mdx") files.push(entryPath);
  }
  return files;
}

function frontmatter(raw) {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\s*\n([\s\S]*?)\n---/);
  const fields = {};
  if (!match) return fields;
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) fields[field[1]] = field[2].replace(/^"(.*)"$/, "$1").trim();
  }
  return fields;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function replaceCaptured(html, pattern, value) {
  return html.replace(pattern, (_match, prefix, suffix) => `${prefix}${escapeHtml(value)}${suffix}`);
}

const metadataBySlug = new Map();
for (const file of await collectFiles(path.resolve("src/content/writeups"))) {
  const fields = frontmatter(await fs.readFile(file, "utf8"));
  if (fields.slug && fields.title && fields.ctfTitle) metadataBySlug.set(fields.slug, fields);
}

function routeMetadata(route) {
  if (route === "/writeups") {
    return {
      title: "CTF Writeups — Ian Mattas",
      description: "Reproducible CTF writeups by Ian Mattas covering reversing, pwn, crypto, web, and forensics.",
    };
  }
  const slug = route.slice("/writeups/".length);
  const record = metadataBySlug.get(slug);
  if (!record) return undefined;
  const writeupTitle = record.title.endsWith(` — ${record.ctfTitle}`)
    ? record.title
    : `${record.title} — ${record.ctfTitle}`;
  return {
    title: `${writeupTitle} | Ian Mattas`,
    description: `${writeupTitle} writeup for ${record.ctfTitle}, documented by Ian Mattas.`,
  };
}

for (const route of routes) {
  const destination = path.join(dist, route.slice(1), "index.html");
  await fs.mkdir(path.dirname(destination), { recursive: true });
  let html = await fs.readFile(indexPath, "utf8");
  const metadata = routeMetadata(route);
  if (metadata) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`);
    html = replaceCaptured(html, /(<meta\s+name="description"\s+content=")[^"]*(")/s, metadata.description);
    html = replaceCaptured(html, /(<meta property="og:title" content=")[^"]*(" \/>)/, metadata.title);
    html = replaceCaptured(html, /(<meta property="og:description" content=")[^"]*(" \/>)/, metadata.description);
    html = replaceCaptured(html, /(<meta property="og:url" content=")[^"]*(" \/>)/, `${siteUrl}${route}`);
    html = replaceCaptured(html, /(<meta name="twitter:title" content=")[^"]*(" \/>)/, metadata.title);
    html = replaceCaptured(html, /(<meta name="twitter:description" content=")[^"]*(" \/>)/, metadata.description);
    html = replaceCaptured(html, /(<link rel="canonical" href=")[^"]*(" \/>)/, `${siteUrl}${route}`);
  }
  await fs.writeFile(destination, html);
}

console.log(`Generated ${routes.length} static route entrypoints.`);
