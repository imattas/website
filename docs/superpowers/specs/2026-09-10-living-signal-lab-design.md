# Living Signal Lab Portfolio Redesign

## Intent

Rebuild the portfolio homepage as an immersive, interactive “living signal lab” for a reverse engineer and security researcher. The redesign should feel like a spatial instrument panel rather than an editorial page while preserving the existing portfolio content, writeup routes, accessibility affordances, and static Vite build.

## Experience direction

- Replace the beige/orange editorial palette with a deep ink canvas, electric cyan, ultraviolet, and ember accents.
- Use a reactive hero scene built from CSS/DOM primitives and existing Framer Motion capabilities rather than adding a new WebGL dependency.
- Make pointer movement, scroll position, hover, and focus drive depth, glow, orbital motion, and reveal states.
- Organize the homepage into “stations”: signal/identity, research profile, selected work, capabilities, and contact.
- Keep the experience performant and legible: motion is decorative, content remains semantic HTML, and reduced-motion/mobile behavior uses static fallbacks.

## Structure

- `App` remains the route owner; existing `/writeups` and `/writeups/:slug` behavior is unchanged.
- `Hero` becomes the primary immersive scene with a central identity lockup, orbital signal visualization, metadata readout, and clear paths to work/writeups.
- `About`, `Work`, `Skills`, and `Contact` are visually re-authored to share the signal-lab system while retaining their current data sources and interactions.
- Existing helper components (`Reveal`, `Magnetic`, `TiltCard`, `CustomCursor`, `ScrollProgress`) are reused or adjusted only where needed.
- Global/component styles are replaced in place to avoid a parallel theme layer.

## Interaction contract

- Pointer position updates a bounded scene transform and ambient glow.
- Hover/focus states expose depth and related metadata without hiding essential content.
- Scroll reveals and progress remain available, but no information depends on animation completing.
- `prefers-reduced-motion` disables continuous scene motion and uses immediate reveals.
- Keyboard focus, skip link, contrast, semantic headings, and touch behavior remain supported.

## Verification

- Run `npm run build` and preserve the existing static route generation/verification gates.
- Inspect the rendered page at desktop and narrow mobile widths with the local preview server.
- Check that `/`, `/writeups`, and at least one generated writeup route load without runtime errors.
- Confirm reduced-motion styles and keyboard-visible focus remain usable.

## Scope boundary

No content rewrite, CMS change, new backend, new routing model, or new 3D/WebGL dependency is included in this pass. The 3D feeling comes from layered gradients, transforms, SVG/CSS geometry, and motion tied to real user input.
