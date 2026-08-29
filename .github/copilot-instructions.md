# Elixir Maven — Always-On Verification Rules

These rules apply automatically to every Copilot interaction in this workspace. No selection or command needed — this file is read on every prompt.

---

## A. Prompt-to-implementation cross-check

Before considering any task complete, re-read the prompt that was given and verify every numbered/bulleted item in it was actually addressed. If something was skipped, partially done, or ambiguous, say so explicitly rather than reporting success by omission.

## B. Regression check against previously-confirmed items

Before finishing any change, check whether it could affect any of these previously-confirmed-working features, and explicitly re-verify the ones that could plausibly be touched:
- The holographic prism gradient on selected chips (must stay gradient, never a flat solid color)
- The ml/oz toggle and per-field unit conversion
- The Guided/Build from Scratch ingredient dropdowns (must render visibly in both Safari and Chrome)
- The Variant/nudge swap display and the "Built from" spec line
- The "Show Similar Cocktails" matching feature (tiered logic, garnish selection, approval-gate eligibility)
- Existing category taxonomy (Aperitif & Liqueur, Syrup subcategories, etc.) — new additions must not silently overwrite or duplicate existing entries

If a change plausibly touches any of the above, confirm it still works before reporting done, don't assume it's unaffected.

## C. Astro-specific security checks

- No secrets or environment variables ever exposed in client-side bundles
- Correct server vs. client component boundaries maintained
- Flag any new dependency with known vulnerabilities
- Sanitize/validate any user-facing free-text input (e.g. Build from Scratch fields) — never trust raw input directly
- No hardcoded credentials, ever, in any file

## D. Build integrity as a hard gate

`npm run build` (or the project's equivalent) must complete with zero errors before any change is reported as complete. A change that breaks the build is not done, regardless of whether the specific requested feature appears to work.

## E. Cross-browser check on interactive elements

For any change touching interactive UI (dropdowns, toggles, forms, buttons), verify it renders and functions correctly in both Safari and Chrome specifically before reporting it fixed — this project has already had one bug that was Safari-only and invisible in Chrome.

## F. Dead code / orphaned reference cleanup

When a feature is explicitly removed or replaced (e.g. a toggle, a UI section), check for and flag any leftover code, imports, or references from the old version that weren't cleaned up.

## G. Single-source-of-truth check for ingredient data

Filter option lists must always pull from the actual ingredient library/data source — never a separate hardcoded duplicate list. When adding new ingredients or categories, confirm they're added to the real source, not created as a parallel list.

## H. Mobile responsiveness check

For any change touching layout, spacing, or new UI components, verify it still renders usably at mobile viewport widths before reporting complete.

## I. Verify against the live site, not just a successful build

A successful build is not the same as a working feature. Before reporting any user-facing change as complete, confirm it's actually visible/functional on the real deployed site — not just that the code compiled without errors. Several confirmed additions this project (Prosecco, Tonic Water, ingredient additions) passed the build but never actually appeared live — this is the single most repeated failure pattern so far and the one this rule exists to close.

---

## General principle behind all of the above

This project has repeatedly had features confirmed working, then silently break again later without being caught until a live report. These rules exist specifically to catch that pattern before it ships, not after.
