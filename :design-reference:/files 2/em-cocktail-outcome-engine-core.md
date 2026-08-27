# Cocktail Outcome Engine — Core Architecture (Locked)

This supersedes the validation mechanism described in `em-similar-cocktails-feature-summary.md`. The Variant 1 / Variant 2 / 5-option structure from that doc still stands — what changes is *how* a match gets trusted. This file is the base going forward.

---

## The core principle

Trust isn't determined by matching a user's build against a named classic cocktail. It's determined by **how often two ingredients have already been paired together**, counted directly from the sourced data.

Every time a cocktail in the dataset pairs a given spirit with a given citrus, syrup, liqueur, etc., that's one tally mark for that pairing. A pairing with many tally marks is evidenced. A pairing with few or none is a rare or unproven combination — regardless of whether either ingredient individually is common.

This requires no knowledge of cocktail names, no classic-family matching, no "resembles a Cosmopolitan" middleman. It's a direct read of what's actually been made, and how often.

## Why this replaces the classic-family approach

The earlier framing ("this build resembles a Cosmopolitan") was standing in for validation, not actually providing it — it required guessing which family a build belonged to, then trusting that family's reputation. Pairwise frequency does the same job more directly: it's a plain count, computable straight from the schema columns already being collected (Spirit, Citrus, Juice, Syrup, Liqueur, Bitters, Foamer, Top).

## Worked example

Bourbon + lime is rare in the sourced data. Bourbon + lemon is extremely common. This isn't a matter of taste — lemon is the traditional sour partner across whiskey-based drinks; lime's sharper acidity historically pairs with rum, tequila, and gin instead. The pairing-frequency count reflects this automatically: bourbon+lemon accumulates many tally marks across sources, bourbon+lime accumulates almost none. That gap *is* the trust signal — no taste-testing or subjective judgment required, just counting what the data already shows.

## How this drives Variant 1 and Variant 2

- **Variant 1** — the user's exact picks, unchanged, but now carries an honest confidence read: well-evidenced pairing vs. rare/unproven pairing, based on tally counts. No claim about resembling any named drink.
- **Variant 2** — a computable nudge: identify whichever ingredient in the user's pick has the *lowest* pairing count against the rest of the build, and swap it for the *highest*-evidenced alternative within that same category (still respecting the user's other choices). This is a real operation on real numbers, not a fuzzy "closer to a classic" judgment call.
- **5-option expansion** — still stands as documented previously, surfaced only for strong, well-evidenced matches.

## What feeds this

Every source gathered counts toward the same tally table — no source is more "correct" than another, only more or less represented:
- The 504-recipe Queen Bee Mixology pull
- The Pinterest board(s), once scouted
- Elixir Maven's own existing cocktails already on the site

## Guardrails carried over, unchanged

- No classic cocktail names ever appear in user-facing output.
- Suggested amounts and swaps are a starting point, not a mandate — the user's own taste overrides the system.
- This is not a claim of guaranteed quality. It's a restraint against combinations that have effectively never been made before, based on user choice plus evidenced adjustments toward a better-supported outcome.
