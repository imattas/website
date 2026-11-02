# SDD ledger — plan: docs/superpowers/plans/2026-11-01-branding-seo-research.md

Pre-flight: Task 2 consumes Task 1's shared logo only through Layout/header (no import dependency); Task 3 uses Layout schema interface defined in Task 2. Task 4 consumes all build and route outputs.
Ruling: Research entries use content IDs as slugs; trailing slashes are normalized by Astro static routing — consistent with posts route pattern and `getPath` behavior.
Ruling: Extend the approved generic draft scaffold with explicit CVE identifier, CVSS vector/score, affected versions, disclosure status and timeline fields at Ian's request. Values remain placeholders and assert no real vulnerability.

Task 1: in progress
