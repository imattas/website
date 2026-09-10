import { promises as fs } from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const indexPath = path.join(dist, "index.html");
const sitemap = await fs.readFile(path.resolve("public/sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/ianmattas\.com(\/[^<]*)<\/loc>/g)]
  .map((match) => decodeURIComponent(match[1]))
  .filter((route) => route !== "/" && route.startsWith("/writeups"));

for (const route of routes) {
  const destination = path.join(dist, route.slice(1), "index.html");
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(indexPath, destination);
}

console.log(`Generated ${routes.length} static route entrypoints.`);
