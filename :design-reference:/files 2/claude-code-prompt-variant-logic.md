# Claude Code prompt — Variant 1 / Variant 2 / 5-option outcome logic

Paste into Claude Code with `cooccurrence_table.json` and `em-cocktail-outcome-engine-core.md` both in the repo (e.g. `/design-reference/`). The architecture doc explains the *why*; this prompt is the *build*. This is a full, consolidated rewrite — treat it as replacing any earlier version of this same prompt, not adding to it.

---

## What exists now

`cooccurrence_table.json` — 680 real evidence pairs, built from 539 sourced cocktails (504 from Queen Bee Mixology, 35 from a curated Pinterest board). Each entry:

```json
{"a_category":"Spirit","a_ingredient":"bourbon","b_category":"Citrus","b_ingredient":"lemon","count":14}
```

`count` is how many independent cocktails in the dataset paired those two ingredients. Higher = more evidenced. This covers all pairs across the five core build slots: Spirit, Citrus, Juice, Syrup, Liqueur.

---

## 1. Evidence lookup function

Given two ingredients (with their categories), return the count from the table — 0 if the pair never appears. This is the core primitive everything else calls.

## 2. Variant 1 — confidence read, no changes

Take the user's exact build. For every pair of filled slots, look up evidence. Surface an honest confidence label:

- **Well-evidenced** — high pair counts
- **Rare pairing** — low but nonzero counts (1-2)
- **No data yet** — genuine zeros. This third tier matters: don't let the UI imply judgment on a combination that simply isn't in the dataset yet.

No ingredient changes. No classic-name references anywhere in this variant.

## 3. Variant 2 — the nudge (up to 2 changes, data-driven, not fixed)

Not a fixed single-swap. Evidence isn't independent between slots — fixing one ingredient can change which choice is best-evidenced for a *different* slot, so this has to search rather than greedily fix the single weakest slot in isolation. Iterative process, capped at **2 changes maximum**:

1. Score every filled slot's average evidence against the *other filled slots in this build*.
2. Check whether any slot is a real outlier — meaningfully weaker than the rest of *that same build*, not weak against some fixed global constant.
3. If no slot is an outlier, stop. Zero changes is a valid outcome — it means the build is already well-evidenced throughout.
4. If a slot is an outlier, swap it for whichever alternative in that category has the highest average evidence against the *rest of the current build*.
5. Re-score and repeat from step 2. Stop when no outlier remains, or when 2 changes have been made — whichever comes first. Two is the ceiling: a build needing more than that isn't a nudge anymore, it's a different cocktail.

Show the user every change and why, in plain terms ("swapped lime for lemon") — never expose raw counts or the words "co-occurrence" or "outlier" in the UI.

## 4. Handle sparse data honestly

680 pairs across a large ingredient library means many legitimate combinations will have 0-1 evidence points — a real state, not a bug. Variant 2 still works when evidence is thin (fall back to the highest count available, even if low).

## 5. Known data imperfection, not blocking

A small number of ingredient names in the table are near-duplicates that didn't fully merge during extraction (e.g. "elderflower syrup liqueur" as a separate entry from the far more common "elderflower liqueur," at a count of 1 vs. 16). Long-tail, low-count noise only — doesn't affect which pairings read as well-evidenced. Not worth a cleanup pass right now.

## 6. Ingredient library addition — Elderflower (Syrup)

Add "Elderflower" as its own entry under **Syrup**, in the Spice, Nut & Floral Syrups group (alongside Orgeat and Cinnamon, per the site's existing syrup taxonomy). Distinct from "Elderflower Liqueur," which already exists separately under Liqueur and is one of the most heavily-evidenced ingredients in the table — the two aren't interchangeable, both deserve their own entry.

## 7. The 5-option expansion — toggle-gated, names allowed, single EM list

**Off by default.** Only appears behind an explicit toggle the user chooses to open — never shown automatically alongside Variant 1/2.

**Scoped, deliberate exception to the no-names rule — this is the only place it applies.** Once opened, the 5 suggestions are shown **by name only** — no ingredients, no amounts, no spec of any kind. Variant 1 and Variant 2 are completely unaffected and stay name-free exactly as built above. Don't let this exception leak into how those two are displayed.

**Data source: a single list, not two pools.** Every classic approved for this feature either already is, or will become, a regular entry in EM's own cocktail list, sharing that name — not a separate permanent reference set. A classic may be approved for suggestion before its full page goes live on the site, so give each entry a status flag (e.g. `approved_for_suggestion` vs `published`) rather than building two lists to merge.

**Not yet populated with classics — pending from CleverName.** EM's existing ~80 original cocktails are already in the list; classic entries get added to that same list over time. Wire the ranking logic now against this single-list model; the classic entries arrive later as normal additions to it, no logic changes needed when they do.

**"Name only" governs display, not storage.** Ranking by ingredient overlap requires each entry's full spec internally regardless.

**Accuracy bar:** every classic entry is (or will become) a faithful EM-authored version of that recipe, so EM's own spec is the source of truth — no external citation needed. Minor ml/oz rounding differences from how a recipe was originally typed aren't a concern.

Rank the list by ingredient overlap with the user's build (same category-matching approach as Variant 2), surface the top 5 names. Expect this to be thin on classics early on, improving as more get approved — no rebuild needed, since it queries the live list directly.

---

## Explicitly not in scope for this prompt

- Bitters, Foamer, Top — not part of the swap logic, per the architecture doc's scope (core sour-template slots only)
- Cross-checking against EM's own existing cocktails for Variant 1/2 specifically — not yet folded into the co-occurrence table (section 7 is the one place EM's own list is used directly)

## Guardrails (unchanged, still apply)

- No cocktail names in Variant 1 or Variant 2 output, however obvious a match is. Section 7 is a separate, narrowly-scoped exception — it does not loosen this rule anywhere else.
- Suggested swaps are offered, never forced — the user's original Variant 1 build stays available regardless of what Variant 2 or section 7 suggest.
