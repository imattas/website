# Site identity, SEO, and research draft

Date: 2026-11-01

## Intent

Make Ian's mark consistent across the site, strengthen page-level search and share metadata, and give Research the same unpublished-draft workflow as Posts.

## Approaches

- Refine the supplied I/M paths: retain the existing silhouette, tune its geometry. This preserves the current mark but does not satisfy the request for a new identity.
- Put the supplied mark in a badge: improves favicon contrast but keeps the original mark and adds a container.
- Create a new monogram mark from scratch: a compact, custom I/M symbol using the site's blue and white palette, designed to remain recognizable at header and favicon sizes. **Selected by Ian.** Use one SVG source for the header and favicon, with contrast suitable for both placements.

## Scope

- Replace the current monogram with the new vector; use it across the shared header and as the site favicon.
- Make title, description, canonical, Open Graph, and Twitter metadata reflect each page. Keep structured data accurate to page type: `WebSite`/`Person` on the homepage, `ProfilePage`/`Person` on About, and `BlogPosting` or `Article` only on actual post pages.
- Keep the existing sitemap and RSS behavior. Do not promise a search ranking outcome.
- Add an unpublished research article draft using the research collection schema and a research detail route so published research entries behave like posts. The draft must stay out of lists, sitemap, search results, and RSS.

## Constraints and calls

- Keep the existing dark background and blue accent palette.
- Use the supplied identity as context, but do not reuse the old profile picture or simply trace the supplied SVG.
- Keep the article draft generic and unpublished; do not invent a vulnerability, CVE, advisory, or affected product.
- SEO metadata must describe visible page content and avoid keyword stuffing.