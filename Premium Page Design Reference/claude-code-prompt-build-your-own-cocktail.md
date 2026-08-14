# Claude Code prompt — Build Your Own Cocktail

Paste everything below into Claude Code once `elixir-maven-holographic-system.html` and `build-your-own-cocktail-prototype.html` are dropped into the repo (e.g. a `/design-reference/` folder). Both are working, tested reference files — treat them as the source of truth for visuals and logic rather than re-deriving anything from prose.

---

Build a new "Build Your Own Cocktail" feature for elixirmaven.com (Astro/Vercel).

## 1. Entry point

Add a CTA button labeled "Build Your Own Cocktail," styled with the same 1px holographic ring treatment as other primary buttons on the site (see `elixir-maven-holographic-system.html`, "Button ring" section). Place it directly underneath the existing "Surprise Me" button on the homepage. This placement isn't locked — if it visually conflicts with the existing filter bar layout, flag it and suggest the closest reasonable alternative rather than forcing it in.

The button links to a new dedicated route: `/build-your-own-cocktail`.

## 2. Visual system

Build the new page's components using `/design-reference/elixir-maven-holographic-system.html` as the exact spec — every section in that file (wordmark, button ring, nav arrows, filter chip, ml/oz toggle, subheading underline, tabs, badges, slider, result card) maps directly to a component this page needs. Match colors, sizing, animation durations, and opacity values exactly as written there rather than approximating.

## 3. Data source — no hardcoded filter lists

Filter chip options (spirit, citrus, juice, syrup, top) must be generated from `elixir_maven_cocktails.json`'s ingredient library, not a separate hardcoded array. Inspect the actual file structure first — don't assume field names match what's in the prototype's placeholder arrays. If the ingredient library isn't already categorized by type (spirit/citrus/juice/syrup/top) in the JSON, flag that as a data-modeling gap before proceeding, since the filter groups depend on that categorization existing.

## 4. Filter interaction

Parallel selection — all filter groups visible and clickable at once, no forced step-by-step sequence. Invalid combinations are prevented by greying out the specific option that would break the build, live, as selections happen — never by letting a selection through and then failing after the fact. Exact rules (implemented and working in the prototype's JS):

- Spirit: pick 1 at full share, or 2 splitting that share evenly. Third spirit chip greys out once 2 are selected.
- Citrus "None" greys out whenever Juice is "None," and vice versa — the sour component can't be empty on both sides at once.
- Syrup has no "None" option — a sweetener is always required to keep the build in the Sour family.

## 5. Construction logic (the ratio baseline)

This page generates a build from the filter picks rather than matching against existing database entries. Port the math exactly as implemented in `build-your-own-cocktail-prototype.html`:

- Spirit total: 50ml (Classic) or 40ml (Adjusted, see below), divided evenly across 1–2 selected spirits.
- Sour total: 20ml, split evenly between citrus and juice if both are selected; the full 20ml goes to whichever one is selected if only one is.
- Syrup: fixed 20ml.
- Top ingredient: added after, no fixed ratio impact, purely a lengthener/finisher.

## 6. Classic / Adjusted toggle

Only appears when a rich spirit (Whiskey or Cognac) is selected AND (Juice ≠ None OR Syrup = Honey). When shown:

- **Classic** — 50ml spirit, standard glass logic (Highball for Soda/Tonic top, Flute for Sparkling wine, Coupe for Foamer, Nick and Nora for no top).
- **Adjusted** — 40ml spirit, glass forced to Coupe, separate calmer garnish set (see prototype's `GARNISH_ADJUSTED`).

Reasoning to preserve in a code comment: full-volume rich spirit against pure citrus matches the IBA's own Sidecar spec (50ml cognac : 20ml citrus : 20ml orange liqueur), so it doesn't need adjusting on its own — it's specifically the addition of juice or honey that calls for trimming the spirit back.

## 7. Result card

Port the triple-martini corner treatment exactly: top-right icon at 9s spin / 0.6 opacity / 64–70px (fastest, direct), a second icon clipped at the bottom edge at 13s / 0.5 opacity, a third sitting behind the cocktail title at 16s / 0.5 opacity / slightly larger. Card height must stay at natural content height (no fixed height) so the bottom icon genuinely clips against the edge rather than fitting inside it.

Below the icons: generated cocktail name, "Built from: [selections]" line, spec list with computed ml amounts, glass + ice line, and a garnish idea row with the two 1px ring arrows cycling through 3 loose suggestions.

## 8. Units

If elixirmaven.com already has an ml/oz toggle component elsewhere on the site, reuse that component and its conversion logic rather than reimplementing the prototype's simplified 30ml-per-oz approximation — the rest of the site should already have the precise conversion this needs to match.

---

## Acceptance checklist

- [ ] "Build Your Own Cocktail" button appears under "Surprise Me," styled with the locked 1px ring
- [ ] New page matches the holographic reference file component-for-component
- [ ] Filter options are pulled from the JSON ingredient library, not hardcoded
- [ ] Selecting a combination that would create an invalid build greys out the conflicting option instead of allowing it
- [ ] Spirit/citrus/juice/syrup math matches the ratio baseline exactly
- [ ] Classic/Adjusted toggle appears only under the correct condition and changes amount, glass, and garnish together
- [ ] Result card's bottom martini icon is visibly clipped by the card edge
- [ ] ml/oz toggle uses the site's existing conversion, not the prototype's approximation
