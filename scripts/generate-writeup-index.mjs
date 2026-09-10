import { promises as fs } from "node:fs";
import path from "node:path";

const root = path.resolve("src/content/writeups");
const output = path.resolve("src/content/writeup-index.generated.ts");
const contentOutput = path.resolve("src/content/writeup-content.generated.ts");
const sitemapOutput = path.resolve("public/sitemap.xml");
const siteUrl = "https://ianmattas.com";
const allowedRemoteImageHosts = new Set(["raw.githubusercontent.com"]);

function parseFrontmatter(raw) {
  const text = raw.replace(/\r\n/g, "\n");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  const fields = {};
  if (!match) return { fields, body: text };
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;
    if (Object.hasOwn(fields, field[1])) {
      throw new Error(`Duplicate frontmatter field: ${field[1]}`);
    }
    fields[field[1]] = field[2].replace(/^"(.*)"$/, "$1").trim();
  }
  return { fields, body: text.slice(match[0].length) };
}

function parseDate(value, slug) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) {
    throw new Error(`Invalid writeup date for ${slug}: ${value ?? "missing"}`);
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid writeup date for ${slug}: ${value}`);
  }
  return value;
}

function parseOrder(value, slug) {
  if (value === undefined || value === "") return 0;
  const order = Number(value);
  if (!Number.isSafeInteger(order)) throw new Error(`Invalid writeup order for ${slug}: ${value}`);
  return order;
}

function markdownLines(body) {
  const lines = body.split("\n");
  const content = [];
  let fence = null;
  for (const line of lines) {
    const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!fence) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (!fence && !/^(?: {4}|\t)/.test(line)) content.push(line);
  }
  return content;
}

function validateDocumentStructure(body, slug) {
  const lines = markdownLines(body);
  let h1Count = 0;
  let previousHeading = 1;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const depth = heading[1].length;
      if (depth === 1) h1Count += 1;
      if (depth > previousHeading + 1) {
        throw new Error(`Skipped heading level in ${slug}: h${previousHeading} to h${depth}`);
      }
      previousHeading = depth;
    }
    for (const image of line.matchAll(/!\[([^\]]*)\]\(/g)) {
      if (!image[1].trim()) throw new Error(`Missing image alt text in ${slug}`);
    }
    for (const link of line.matchAll(/!?\[[^\]]*\]\(([^)]*)\)/g)) {
      const rawDestination = link[1].trim();
      const destination = rawDestination.match(/^<([^>]*)>/)?.[1] ?? rawDestination.split(/\s+/)[0] ?? "";
      if (!destination) throw new Error(`Empty Markdown destination in ${slug}`);
      if (/^(?:javascript|data|vbscript|file):/i.test(destination)) {
        throw new Error(`Unsafe Markdown destination in ${slug}: ${destination}`);
      }
      if (destination.startsWith("//")) {
        throw new Error(`Unsafe protocol-relative Markdown destination in ${slug}: ${destination}`);
      }
      if (link[0].startsWith("!")) {
        try {
          const imageUrl = new URL(destination, "https://ianmattas.com");
          if (imageUrl.protocol !== "https:") {
            throw new Error(`Invalid image URL in ${slug}: ${destination}`);
          }
          if (imageUrl.origin !== "https://ianmattas.com" && !allowedRemoteImageHosts.has(imageUrl.hostname)) {
            throw new Error(`Unapproved remote image host in ${slug}: ${imageUrl.hostname}`);
          }
        } catch (error) {
          if (error instanceof Error && error.message.startsWith("Unapproved remote image host")) throw error;
          throw new Error(`Invalid image URL in ${slug}: ${destination}`);
        }
      }
    }
  }
  if (h1Count !== 1) throw new Error(`Expected exactly one H1 in ${slug}, found ${h1Count}`);
}

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

const records = [];
const slugs = new Set();
const knownSlugs = new Set();
for (const file of await collectFiles(root)) {
  const raw = await fs.readFile(file, "utf8");
  const { fields, body } = parseFrontmatter(raw);
  if (!fields.slug || fields.slug === "writeup-template" || fields.slug === "writeups-index") continue;
  if (knownSlugs.has(fields.slug)) throw new Error(`Duplicate writeup slug: ${fields.slug}`);
  knownSlugs.add(fields.slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug)) {
    throw new Error(`Invalid writeup slug for URL routing: ${fields.slug}`);
  }
  if (slugs.has(fields.slug)) throw new Error(`Duplicate writeup slug: ${fields.slug}`);
  if (!fields.ctfSlug || !fields.ctfTitle || !fields.title?.trim()) {
    throw new Error(`Incomplete writeup metadata: ${fields.slug}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.ctfSlug)) {
    throw new Error(`Invalid CTF slug for ${fields.slug}: ${fields.ctfSlug}`);
  }
  if (fields.writeupKind !== "ctf" && fields.writeupKind !== "challenge") {
    throw new Error(`Invalid writeup kind for ${fields.slug}: ${fields.writeupKind ?? "missing"}`);
  }
  const date = parseDate(fields.date, fields.slug);
  const order = parseOrder(fields.order, fields.slug);
  validateDocumentStructure(body, fields.slug);
  slugs.add(fields.slug);
  const relative = path.relative(path.resolve("src/content"), file).split(path.sep).join("/");
  const parts = relative.split("/");
  records.push({
    path: `./${relative}`,
    slug: fields.slug,
    ctfSlug: fields.ctfSlug ?? parts[1] ?? "",
    ctfTitle: fields.ctfTitle ?? fields.ctfSlug ?? parts[1] ?? "",
    writeupKind: fields.writeupKind,
    title: fields.title ?? "",
    date,
    order,
  });
}

records.sort((a, b) => a.slug.localeCompare(b.slug));
const ctfMetadata = new Map();
for (const record of records) {
  const existing = ctfMetadata.get(record.ctfSlug);
  if (existing && existing.title !== record.ctfTitle) {
    throw new Error(`Conflicting CTF title for ${record.ctfSlug}: ${existing.title} / ${record.ctfTitle}`);
  }
  if (record.writeupKind === "ctf" && existing?.overview) {
    throw new Error(`Duplicate CTF overview for ${record.ctfSlug}: ${existing.overview} / ${record.slug}`);
  }
  ctfMetadata.set(record.ctfSlug, {
    title: record.ctfTitle,
    overview: record.writeupKind === "ctf" ? record.slug : existing?.overview,
  });
}
const linkKey = (value) => decodeURIComponent(value)
  .replace(/\.mdx$/i, "")
  .replace(/[^a-z0-9]+/gi, "")
  .toLowerCase();
const headingKey = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "") || "section";
const recordsByCtf = new Map();
for (const record of records) {
  if (!recordsByCtf.has(record.ctfSlug)) recordsByCtf.set(record.ctfSlug, []);
  recordsByCtf.get(record.ctfSlug).push(record);
}
for (const record of records) {
  const raw = await fs.readFile(path.resolve("src/content", record.path.slice(2)), "utf8");
  const { body } = parseFrontmatter(raw);
  const headingIds = new Set();
  const headingCounts = new Map();
  for (const line of markdownLines(body)) {
    const match = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const base = headingKey(match[1]);
    const count = headingCounts.get(base) ?? 0;
    headingCounts.set(base, count + 1);
    headingIds.add(count ? `${base}-${count + 1}` : base);
  }
  for (const match of raw.matchAll(/\]\(((?:\.\.\/|\.\/)+([^?#)]+\.mdx))([?#][^)]*)?\)/gi)) {
    const targetKey = linkKey(match[2]);
    const candidates = recordsByCtf.get(record.ctfSlug) ?? [];
    const ctfKey = linkKey(record.ctfSlug);
    const exact = candidates.filter((candidate) => {
      const slugKey = linkKey(candidate.slug);
      return (slugKey.startsWith(ctfKey) ? slugKey.slice(ctfKey.length) : slugKey) === targetKey;
    });
    const titleMatches = candidates.filter((candidate) => linkKey(candidate.title).startsWith(targetKey));
    if (exact.length === 0 && titleMatches.length > 1) {
      throw new Error(`Ambiguous local writeup link in ${record.slug}: ${match[1]}`);
    }
    if (exact.length === 0 && titleMatches.length === 0) {
      throw new Error(`Unresolved local writeup link in ${record.slug}: ${match[1]}`);
    }
  }
  for (const match of raw.matchAll(/\]\(\/volume\/2\/([^/)]+)\/?\)/g)) {
    if (!knownSlugs.has(match[1])) {
      throw new Error(`Unresolved legacy writeup link in ${record.slug}: /volume/2/${match[1]}/`);
    }
  }
  for (const match of raw.matchAll(/\]\(#([^\s)]+)\)/g)) {
    if (!headingIds.has(decodeURIComponent(match[1]))) {
      throw new Error(`Unresolved heading fragment in ${record.slug}: #${match[1]}`);
    }
  }
}
const contents = `// Generated by scripts/generate-writeup-index.mjs. Do not edit by hand.\nexport const writeupIndex = ${JSON.stringify(records, null, 2)} as const;\n`;
await fs.writeFile(output, contents);
const contentPaths = records.map((record) => record.path);
const contentModules = `// Generated by scripts/generate-writeup-index.mjs. Do not edit by hand.\nexport const contentModules = import.meta.glob<string>(${JSON.stringify(contentPaths, null, 2)}, { query: "?raw", import: "default" });\n`;
await fs.writeFile(contentOutput, contentModules);
const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
}[character]));
const sitemapUrls = [
  { path: "/", lastmod: undefined },
  { path: "/writeups", lastmod: undefined },
  ...records.map((record) => ({ path: `/writeups/${record.slug}`, lastmod: record.date })),
];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls.flatMap(({ path: urlPath, lastmod }) => [
    "  <url>",
    `    <loc>${escapeXml(`${siteUrl}${urlPath}`)}</loc>`,
    ...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []),
    "  </url>",
  ]),
  "</urlset>",
  "",
].join("\n");
await fs.writeFile(sitemapOutput, sitemap);
console.log(`Generated ${records.length} writeup records.`);
