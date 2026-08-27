---

# Similar Cocktails Search Result — Feature Spec

## Status: NOT BUILDABLE YET
This feature depends on a validated ingredient-combination dataset (see Dependency section). Do not implement until that dataset exists and is cross-referenced against multiple independent sources.

## What this is
When a user builds a cocktail from their filter picks, the result isn't just their raw build, it's presented alongside two structured variants, plus an optional expansion. This sits alongside (not instead of) the existing Classic/Adjusted toggle.

## Variant 1 — Exact match, classic-family framing
Uses exactly what the user picked. No ingredient substitution, no amount changes. What changes is the presentation: glass, ice, and general character are shaped to match whichever classic cocktail family the ingredient combination resembles.
Example: cranberry + lemon, vodka-leaning (even without vodka specifically selected) reads as Cosmopolitan-adjacent, the juice/citrus profile does the identifying, not the spirit choice alone.
No classic cocktail name is ever shown here, family framing only.

## Variant 2 — A genuinely different spec leaning toward a classic
NOT a single-ingredient nudge or amount tweak. This is a distinct spec that leans toward whichever classic cocktail shares underlying structural signals with the user's build: base spirit, citrus choice (lime vs lemon), presence/absence of a syrup or gomme-style sweetener, and broader flavor-family pattern (e.g. sour + citrus + foam top vs. tropical + passionfruit/pineapple like a Pornstar Martini). The matching is pattern-based across the whole build, not a delta off Variant 1.
Format: "Similar to: [Cocktail Name]"
This is currently the ONLY place a classic cocktail name is allowed to appear in user-facing output, an explicit, deliberate exception to the standing no-classic-names rule. This exception may be removed later (name hidden or replaced with family language only), TBD.

## Expandable "5 more" option
Hidden by default. Only appears, and only surfaces real documented variations of whichever family got matched, not generic alternatives. A Mojito-family match unlocks known Mojito variants (spicy, virgin, coconut, etc.); a Pornstar Martini-family match unlocks its documented relatives. These five must vary meaningfully from Variant 1, Variant 2, or both, not repeat one with cosmetic tweaks.

## Why Variant 1 and Variant 2 are both needed
Different intents, not a redundant pair. Variant 1 respects the user's exact choices ("I want my drink"). Variant 2 offers a path to something more historically correct ("I want the drink"). Neither replaces the other.

## Dependency this feature rests on
None of this, Variant 1's family-matching, Variant 2's pattern-matching, or the 5-option expansion, works without a real dataset of which ingredient combinations are validated as actually tasting right together, confirmed across many independent sources, not assumed. Without that dataset, the system falls back to ratio math that's balanced but not provably good-tasting.
This dataset is the cocktail-schema data-mining work currently in progress (spirit/citrus/juice/syrup/liqueur/bitters/foamer/top extraction, cross-referenced against the Sour-template ratio baseline). That work is the certification step this feature depends on.

## Guardrails
- No classic cocktail names ever appear in user-facing output, EXCEPT Variant 2's "Similar to: [Name]" label specifically (see above).
- Suggested amounts are a starting point, not a mandate, the user's own taste overrides the system's suggestion.
- "Classics" pool = the original 76 Elixir Maven cocktails, plus Jungle Bird, Screwdriver, and Penicillin (confirmed genuine historical classics added later). Sour Maple and Basil Smash are NOT classics (EM originals). More historical classics may be added to this pool over time, always explicitly specified, never automatic.

---
