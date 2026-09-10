import { writeupIndex } from "./writeup-index.generated";

export interface WriteupFrontmatter {
  title: string;
  date: string;
  author?: string;
  slug: string;
  order?: number;
  writeupKind?: "root" | "ctf" | "challenge" | "template";
  ctfSlug?: string;
  ctfTitle?: string;
}

export interface Writeup {
  path: string;
  writeupKind: "ctf" | "challenge";
  slug: string;
  ctfSlug: string;
  ctfTitle: string;
  title: string;
  date: string;
  order: number;
  loadContent: () => Promise<string>;
}

export interface CtfGroup {
  slug: string;
  title: string;
  writeups: Writeup[];
}

const contentModules = import.meta.glob<string>("./writeups/**/index.mdx", {
  query: "?raw",
  import: "default",
});

function parseFrontmatter(raw: string): { fm: Record<string, string>; body: string } {
  // Normalize CRLF -> LF so regexes are robust across platforms.
  const text = raw.replace(/\r\n/g, "\n");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { fm: {}, body: text };
  const fm: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) {
      fm[m[1]] = m[2].replace(/^"(.*)"$/, "$1").trim();
    }
  }
  return { fm, body: text.slice(match[0].length) };
}

const all: Writeup[] = writeupIndex.map((record) => ({
  ...record,
  loadContent: async () => {
    const loader = contentModules[record.path];
    if (!loader) throw new Error(`Missing writeup content: ${record.path}`);
    return parseFrontmatter(await loader()).body;
  },
}));

export const writeups: Writeup[] = all.sort((a, b) => (a.date < b.date ? 1 : -1));
export const challengeWriteups = writeups.filter((w) => w.writeupKind === "challenge");

// Group challenge writeups by CTF, sorted by order within each group.
export const ctfGroups: CtfGroup[] = (() => {
  const map = new Map<string, CtfGroup>();
  for (const w of challengeWriteups) {
    if (!map.has(w.ctfSlug)) {
      map.set(w.ctfSlug, { slug: w.ctfSlug, title: w.ctfTitle, writeups: [] });
    }
    map.get(w.ctfSlug)!.writeups.push(w);
  }
  return Array.from(map.values())
    .map((g) => ({ ...g, writeups: g.writeups.sort((a, b) => a.order - b.order) }))
    .sort((a, b) => a.title.localeCompare(b.title));
})();

export function getWriteup(slug: string): Writeup | undefined {
  return all.find((w) => w.slug === slug);
}

export function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
