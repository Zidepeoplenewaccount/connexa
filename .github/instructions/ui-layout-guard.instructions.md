---
applyTo: "src/**/*.{js,jsx,ts,tsx,css,scss,html}"
description: "Connexa UI structure guard: preserve layout hierarchy and styling; allow SEO-only updates to title, meta description, and small text copy edits."
---

# Connexa UI Layout Guard

## Mandatory constraints
- Do not redesign or restructure the page.
- Do not add or remove sections, components, wrappers, or containers.
- Do not change spacing systems, typography systems, or layout hierarchy.
- Do not inject new content blocks into the UI.
- Do not change existing CSS layout behavior unless explicitly requested by the user.

## Allowed without explicit approval
- Update title tag.
- Update meta description.
- Make small text-only copy edits inside existing elements.

## Requires explicit user approval first
- Any new section.
- Any component tree change.
- Any global style or spacing change.
- Any navigation or routing structure change.
