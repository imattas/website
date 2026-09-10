import { promises as fs } from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const sitemap = await fs.readFile(path.resolve("public/sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/ianmattas\.com(\/[^<]*)<\/loc>/g)]
  .map((match) => decodeURIComponent(match[1]));

function required(value, pattern, message) {
  if (!pattern.test(value)) throw new Error(message);
}

for (const route of routes) {
  const destination = route === "/"
    ? path.join(dist, "index.html")
    : path.join(dist, route.slice(1), "index.html");
  let html;
  try {
    html = await fs.readFile(destination, "utf8");
  } catch {
    throw new Error(`Missing static route output: ${route}`);
  }
  required(html, new RegExp(`<link rel="canonical" href="https:\\/\\/ianmattas\\.com${route.replaceAll("/", "\\/")}" \\/>`), `Invalid canonical for route: ${route}`);
  required(html, /<meta name="robots" content="index, follow, max-image-preview:large" \/>/, `Missing indexable robots metadata: ${route}`);
}

const fallback = await fs.readFile(path.join(dist, "404.html"), "utf8");
if (/<link rel="canonical"/.test(fallback)) throw new Error("404 fallback must not have a canonical URL");
required(fallback, /<meta name="robots" content="noindex, follow" \/>/, "404 fallback must be noindex");

console.log(`Verified ${routes.length} static routes and the 404 fallback.`);
