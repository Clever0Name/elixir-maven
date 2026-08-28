export type OutcomeCategory = 'Spirit' | 'Citrus' | 'Juice' | 'Syrup' | 'Liqueur';

export interface BuildIngredient {
  category: OutcomeCategory;
  ingredient: string;
}

export interface EvidencePair {
  a_category: string;
  a_ingredient: string;
  b_category: string;
  b_ingredient: string;
  count: number;
}

export interface BuildChange {
  category: OutcomeCategory;
  from: string;
  to: string;
  reason: string;
}

export interface BuildScore {
  ingredient: BuildIngredient;
  average: number;
}

export interface NudgeResult {
  build: BuildIngredient[];
  changes: BuildChange[];
  scores: BuildScore[];
}

export interface SuggestionCocktail {
  name: string;
  approved_for_suggestion?: boolean;
  published?: boolean;
  ingredients: Array<{ name: string; role: string }>;
}

const ALIASES: Record<string, string> = {
  lemon: 'lemon',
  lime: 'lime',
  grapefruit: 'grapefruit',
  cranberry: 'cranberry juice',
  orange: 'orange juice',
  pineapple: 'pineapple juice',
  'passion fruit': 'passion fruit puree',
  'sugar syrup': 'simple syrup',
  honey: 'honey syrup',
  maple: 'maple syrup',
  orgeat: 'orgeat syrup',
  vanilla: 'vanilla syrup',
  coconut: 'coconut syrup',
  falernum: 'falernum',
  grenadine: 'grenadine',
  whiskey: 'whiskey',
  bourbon: 'bourbon',
  cognac: 'cognac',
  cachaça: 'cachaca',
  aperol: 'aperol',
  campari: 'campari',
  'sweet vermouth': 'sweet vermouth',
  'dry vermouth': 'dry vermouth',
  amaretto: 'amaretto',
};

function normalized(value: string): string {
  const cleaned = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return ALIASES[cleaned] ?? cleaned;
}

function key(category: string, ingredient: string): string {
  return `${category.toLowerCase()}|${normalized(ingredient)}`;
}

export function createEvidenceLookup(pairs: EvidencePair[]): (a: BuildIngredient, b: BuildIngredient) => number {
  const evidence = new Map<string, number>();
  pairs.forEach((pair) => {
    const pairKey = [
      key(pair.a_category, pair.a_ingredient),
      key(pair.b_category, pair.b_ingredient),
    ].sort().join('::');
    evidence.set(pairKey, Math.max(evidence.get(pairKey) ?? 0, pair.count));
  });

  return (a, b) => {
    if (a.category === b.category && normalized(a.ingredient) === normalized(b.ingredient)) return 0;
    const pairKey = [key(a.category, a.ingredient), key(b.category, b.ingredient)].sort().join('::');
    return evidence.get(pairKey) ?? 0;
  };
}

function filledBuild(build: BuildIngredient[]): BuildIngredient[] {
  return build.filter((item) => item.ingredient && item.ingredient !== 'None');
}

export function scoreBuild(build: BuildIngredient[], lookup: (a: BuildIngredient, b: BuildIngredient) => number): BuildScore[] {
  const filled = filledBuild(build);
  return filled.map((ingredient, index) => {
    const others = filled.filter((_, otherIndex) => otherIndex !== index);
    const total = others.reduce((sum, other) => sum + lookup(ingredient, other), 0);
    return { ingredient, average: others.length ? total / others.length : 0 };
  });
}

function confidenceFor(score: number): 'Well-evidenced' | 'Rare pairing' | 'No data yet' {
  if (score >= 4) return 'Well-evidenced';
  if (score > 0) return 'Rare pairing';
  return 'No data yet';
}

export function confidenceReads(build: BuildIngredient[], lookup: (a: BuildIngredient, b: BuildIngredient) => number) {
  return scoreBuild(build, lookup).map((score) => ({
    ...score,
    label: confidenceFor(score.average),
  }));
}

function isMeaningfulOutlier(scores: BuildScore[]): BuildScore | undefined {
  if (scores.length < 2) return undefined;
  const sorted = [...scores].sort((a, b) => a.average - b.average);
  const weakest = sorted[0];
  const rest = sorted.slice(1).map((score) => score.average).sort((a, b) => a - b);
  const midpoint = rest[Math.floor(rest.length / 2)];
  return weakest.average < midpoint ? weakest : undefined;
}

export function findNudge(
  originalBuild: BuildIngredient[],
  alternatives: Record<OutcomeCategory, string[]>,
  lookup: (a: BuildIngredient, b: BuildIngredient) => number,
): NudgeResult {
  let build = [...originalBuild];
  const changes: BuildChange[] = [];

  while (changes.length < 2) {
    const scores = scoreBuild(build, lookup);
    const weakest = isMeaningfulOutlier(scores);
    if (!weakest) break;

    const index = build.findIndex((item) => item === weakest.ingredient);
    const candidates = (alternatives[weakest.ingredient.category] ?? [])
      .filter((candidate) => candidate !== 'None' && candidate !== weakest.ingredient.ingredient)
      .map((candidate) => {
        const replacement = { category: weakest.ingredient.category, ingredient: candidate };
        const rest = build.filter((_, buildIndex) => buildIndex !== index);
        const total = rest.reduce((sum, other) => sum + lookup(replacement, other), 0);
        return { candidate, average: rest.length ? total / rest.length : 0 };
      })
      .sort((a, b) => b.average - a.average);

    if (!candidates.length) break;
    const best = candidates[0];
    if (best.average <= weakest.average) break;

    build[index] = { category: weakest.ingredient.category, ingredient: best.candidate };
    changes.push({
      category: weakest.ingredient.category,
      from: weakest.ingredient.ingredient,
      to: best.candidate,
      reason: `swapped ${weakest.ingredient.ingredient} for ${best.candidate}`,
    });
  }

  return { build, changes, scores: scoreBuild(build, lookup) };
}

function cocktailIngredients(cocktail: SuggestionCocktail): BuildIngredient[] {
  return cocktail.ingredients
    .filter((ingredient) => ['spirit', 'citrus', 'juice', 'syrup', 'liqueur'].some((role) => ingredient.role.toLowerCase().includes(role)))
    .map((ingredient) => ({
      category: ingredient.role.toLowerCase().includes('spirit') ? 'Spirit' :
        ingredient.role.toLowerCase().includes('citrus') ? 'Citrus' :
        ingredient.role.toLowerCase().includes('juice') ? 'Juice' :
        ingredient.role.toLowerCase().includes('syrup') ? 'Syrup' : 'Liqueur',
      ingredient: ingredient.name,
    }));
}

export function rankSuggestions(
  build: BuildIngredient[],
  cocktails: SuggestionCocktail[],
  lookup: (a: BuildIngredient, b: BuildIngredient) => number,
): SuggestionCocktail[] {
  const selected = filledBuild(build);
  return cocktails
    .filter((cocktail) => cocktail.published === true || cocktail.approved_for_suggestion === true)
    .map((cocktail) => {
      const ingredients = cocktailIngredients(cocktail);
      const exactMatches = selected.reduce((matches, item) => matches + (ingredients.some((candidate) =>
        candidate.category === item.category && normalized(candidate.ingredient) === normalized(item.ingredient)) ? 1 : 0), 0);
      const evidenceScore = selected.reduce((total, item) => total + ingredients.reduce((inner, candidate) => inner + lookup(item, candidate), 0), 0);
      return { cocktail, exactMatches, evidenceScore };
    })
    .sort((a, b) => b.exactMatches - a.exactMatches || b.evidenceScore - a.evidenceScore || a.cocktail.name.localeCompare(b.cocktail.name))
    .slice(0, 5)
    .map(({ cocktail }) => cocktail);
}
