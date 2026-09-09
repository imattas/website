// Removes "Full Exploit Script" sections that only contain placeholder text
// (e.g. "No script was needed..." or "No standalone exploit script was present...").
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = "src/content/writeups";

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (extname(p) === ".mdx") out.push(p);
  }
  return out;
}

const PLACEHOLDER = /No (script was needed|standalone exploit script was present|solve script|exploit script)/i;

function processFile(file) {
  const raw = readFileSync(file, "utf8");
  const text = raw.replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect a "Full Exploit Script" heading
    if (/^##\s+Full Exploit Script\s*$/i.test(line.trim())) {
      // Look ahead to see if the section body is a placeholder
      let j = i + 1;
      let body = "";
      while (j < lines.length && !/^##\s+/.test(lines[j]) && !/^---\s*$/.test(lines[j])) {
        body += lines[j] + "\n";
        j++;
      }
      if (PLACEHOLDER.test(body)) {
        // Skip the heading, body, and the following --- separator
        i = j;
        // Skip the --- separator line if present
        if (i < lines.length && /^---\s*$/.test(lines[i])) {
          i++;
        }
        // Skip any blank lines after
        while (i < lines.length && lines[i].trim() === "") {
          i++;
        }
        continue;
      }
    }

    out.push(line);
    i++;
  }

  return out.join("\n");
}

let changed = 0;
for (const file of walk(ROOT)) {
  const before = readFileSync(file, "utf8");
  const after = processFile(file);
  if (after !== before) {
    writeFileSync(file, after, "utf8");
    changed++;
  }
}
console.log(`Removed placeholder script sections in ${changed} files`);
