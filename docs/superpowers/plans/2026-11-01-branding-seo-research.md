# Site Identity, SEO, and Research Draft Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Ian's site a new consistent monogram, accurate page-level SEO, and a real unpublished research-article workflow.

**Architecture:** Keep Astro's shared `Layout.astro` as the owner of document metadata and structured data, configured by explicit page props. Keep the research collection and add a static detail route that filters drafts; place the single brand SVG in `public` and consume the same URL in the header and favicon.

**Tech Stack:** Astro 5, TypeScript, Astro Content Collections, static GitHub Pages, SVG, JSON-LD.

**Spec:** `docs/superpowers/specs/2026-11-01-site-identity-seo-research-design.md`

## Global Constraints

- Keep the existing dark background and blue accent palette.
- Use one custom SVG source for the header and favicon; do not reuse the old profile picture or trace the supplied SVG.
- Describe visible page content; avoid keyword stuffing and ranking promises.
- Keep research draft generic and unpublished; invent no vulnerability, CVE, advisory, or affected product.
- Preserve existing sitemap and RSS behavior; unpublished research must stay out of lists, sitemap, search results, and RSS.

## Review Focus

- Small favicon rendering and dark/light contrast: inspect the built favicon at 16px and the header at normal size in both themes (Task 1).
- Canonical URL or social image path on nested pages: inspect generated HTML for homepage, a nested route, and a post (Task 2).
- Structured data on static, profile, and article pages: inspect generated JSON-LD and ensure article fields only appear for article types (Task 2).
- Research slug paths containing nested directories and draft exclusion: build with the draft and check route generation and collection filtering (Task 3).
- Draft leakage into discovery surfaces: inspect sitemap, Pagefind index, and RSS output for the draft title (Task 3).

## File Map

- `public/favicon.svg`: sole custom monogram asset served by the site.
- `src/components/Header.astro`: references the shared public SVG.
- `src/assets/ian-logo.svg`: remove after header migration to avoid a second competing logo source.
- `src/layouts/Layout.astro`: shared metadata and schema controlled by an explicit schema type prop.
- `src/layouts/AboutLayout.astro`, `src/pages/*.astro`, and `src/layouts/PostDetails.astro`: provide page-specific description and schema type.
- `src/pages/research/[...slug].astro`: static detail pages for published research entries.
- `src/pages/research/index.astro`: links to published research details.
- `src/data/research/draft.md`: complete generic draft scaffold, still hidden.
- `astro.config.ts`: exclude draft research paths from sitemap if Astro's content route generation exposes them.

### Task 1: Create and Apply Ian's New Monogram

**Files:**
- Modify: `public/favicon.svg`
- Modify: `src/components/Header.astro`
- Delete: `src/assets/ian-logo.svg`

**Interfaces:**
- Consumes: existing site palette and header layout.
- Produces: `/favicon.svg` as the sole logo source, available as the browser favicon and via `<img src="/favicon.svg">` in the shared header.

- [ ] **Step 1: Design a new compact custom I/M SVG mark** in `public/favicon.svg`. Use the existing blue and white palette, crisp vector shapes, a square viewBox and enough negative space to remain legible at 16px. Do not reuse or trace the supplied path geometry.
- [ ] **Step 2: Point `src/components/Header.astro` to `/favicon.svg`** with descriptive accessible treatment (decorative if the adjacent site title supplies the name).
- [ ] **Step 3: Remove `src/assets/ian-logo.svg`** so there is one canonical logo asset.
- [ ] **Step 4: Run `npm run build`** and inspect the generated header references and `dist/favicon.svg`; confirm the SVG is copied and no stale `ian-logo.svg` reference remains.
- [ ] **Step 5: Commit** as `feat: create shared Ian monogram identity`.

### Task 2: Make Page Metadata and Structured Data Accurate

**Files:**
- Modify: `src/layouts/Layout.astro`
- Modify: `src/layouts/AboutLayout.astro`
- Modify: `src/layouts/PostDetails.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/404.astro`
- Modify: `src/pages/search.astro`
- Modify: `src/pages/statuses.astro`
- Modify: `src/pages/posts/[...page].astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/research/index.astro`

**Interfaces:**
- Consumes: shared `Layout` props for title, description, canonical URL, social image, dates, and a schema kind.
- Produces: `schemaType?: "WebSite" | "WebPage" | "ProfilePage" | "BlogPosting" | "Article"`, defaulting to `WebPage`; only article schema includes article-specific dates and headline. Homepage emits `WebSite` with Person publisher/author, About emits `ProfilePage` with Person mainEntity, and post/research detail pages emit their matching article type.

- [ ] **Step 1: Add an explicit schema type to `Layout.astro`** and build JSON-LD conditionally. Remove the unconditional `BlogPosting` on general pages; retain publisher/author identity for site/profile pages and article dates only for article types.
- [ ] **Step 2: Supply accurate, unique descriptions and schema type per page.** Add concise descriptions based on visible page content to About, Posts listing, Search, and 404; preserve existing meaningful descriptions on other pages. Set homepage schema to `WebSite`, About to `ProfilePage`, blog details to `BlogPosting`, and projects/search/statuses/list pages to `WebPage`.
- [ ] **Step 3: Inspect generated HTML after `npm run build`.** Confirm title, description, canonical, `og:*`, and Twitter fields on `/`, `/about/`, `/posts/`, `/projects/`, `/research/`, `/search/`, and `/404.html`; confirm valid page-appropriate JSON-LD and no `undefined` string values.
- [ ] **Step 4: Commit** as `feat: add page-specific SEO metadata`.

### Task 3: Add a Draftable Research Article Route

**Files:**
- Create: `src/pages/research/[...slug].astro`
- Modify: `src/pages/research/index.astro`
- Modify: `src/data/research/draft.md`
- Modify: `astro.config.ts` only if build evidence shows draft routes enter sitemap.

**Interfaces:**
- Consumes: `research` content collection fields `title`, `description`, `author`, `pubDatetime`, `type`, `identifier`, `tags`, `draft`, and `ogImage`.
- Produces: a static `/research/<entry-id>/` detail page for each non-draft entry, rendered with shared `Layout` using `schemaType="Article"`; index titles link to these pages.

- [ ] **Step 1: Replace the blank research draft with a generic, useful authoring scaffold.** Include summary, affected software/environment, impact, technical analysis, reproduction/evidence, mitigation, disclosure timeline, and references headings. Keep `draft: true`, neutral placeholder prose, and do not invent a finding.
- [ ] **Step 2: Add `getStaticPaths()` to `src/pages/research/[...slug].astro`** using only research entries with `!data.draft`; render the entry body and metadata, and set article schema and canonical URL through `Layout`.
- [ ] **Step 3: Link published entries from `src/pages/research/index.astro`** and retain the current draft filter.
- [ ] **Step 4: Run `npm run build` and inspect outputs.** Confirm published research gets a detail URL, the draft URL and title are absent from built HTML, sitemap, RSS and Pagefind index. Configure sitemap exclusion only if required by observed output.
- [ ] **Step 5: Commit** as `feat: add draftable research article pages`.

### Task 4: Publish and Verify the Site

**Files:**
- No source edits expected.

- [ ] **Step 1: Review the final diff** for stale logo references, generated files, credentials, and unrelated changes.
- [ ] **Step 2: Run `npm run build`** and ensure Astro check, static generation, and Pagefind indexing complete successfully.
- [ ] **Step 3: Push the completed commits to `imattas/website` on `main`** and inspect the GitHub Pages workflow until it completes.
- [ ] **Step 4: Check `https://ianmattas.com` and representative nested pages** for HTTP success, favicon availability, page titles/descriptions, and article routes.
- [ ] **Step 5: Report the deployed commit and any remaining limitation** without claiming search ranking outcomes.
