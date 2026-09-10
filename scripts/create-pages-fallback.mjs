import { promises as fs } from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const source = await fs.readFile(path.join(dist, "index.html"), "utf8");
const replace = (html, pattern, value) => html.replace(pattern, (_match, prefix, suffix) => `${prefix}${value}${suffix}`);

let fallback = source.replace(/<title>[\s\S]*?<\/title>/, "<title>Page Not Found — Ian Mattas</title>");
fallback = replace(fallback, /(<meta\s+name="description"\s+content=")[^"]*(")/s, "The requested page could not be found on Ian Mattas's portfolio.");
fallback = replace(fallback, /(<meta\s+name="robots"\s+content=")[^"]*(")/s, "noindex, follow");
fallback = replace(fallback, /(<meta property="og:title" content=")[^"]*(" \/>)/, "Page Not Found — Ian Mattas");
fallback = replace(fallback, /(<meta property="og:description" content=")[^"]*(" \/>)/, "The requested page could not be found on Ian Mattas's portfolio.");
fallback = replace(fallback, /(<meta name="twitter:title" content=")[^"]*(" \/>)/, "Page Not Found — Ian Mattas");
fallback = replace(fallback, /(<meta name="twitter:description" content=")[^"]*(" \/>)/, "The requested page could not be found on Ian Mattas's portfolio.");

await fs.writeFile(path.join(dist, "404.html"), fallback);
console.log("Generated static 404 fallback.");
