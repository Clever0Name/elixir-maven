const data = require('../elixir_maven_cocktails.json');

const cocktails = data.cocktails;
const published = cocktails.filter((c) => (c.published ?? true));

const spiritNormalization = {
  'White Rum': ['White Rum'],
  'Dark Rum': ['Dark Rum'],
  'Aged Rum': ['Dark Rum'],
  'Dark Aged Rum': ['Dark Rum'],
  'Spiced Rum': ['Spiced Rum'],
  'Overproof Rum': ['Overproof Rum'],
  'Coconut Rum': ['Coconut Rum'],
  'Blanco Tequila': ['Tequila'],
  Tequila: ['Tequila'],
  Gin: ['Gin'],
  Vodka: ['Vodka'],
  'Citrus Vodka': ['Vodka'],
  'Gin or Vodka': ['Gin', 'Vodka'],
  'Vodka/Gin': ['Vodka', 'Gin'],
  Whiskey: ['Whiskey'],
  'Rye Whiskey': ['Whiskey'],
  'Scotch Whisky': ['Whiskey'],
  'Irish Whiskey': ['Whiskey'],
  'Blended Scotch Whisky': ['Whiskey'],
  'Peated Scotch': ['Whiskey'],
  Bourbon: ['Bourbon']
};

const citrusNormalization = {
  'Lemon Juice': 'Lemon',
  'Lime Juice': 'Lime',
  'Lime Wedges': 'Lime'
};

const juiceNormalization = {
  'Apple Juice': 'Apple',
  'Blood Orange Juice': 'Blood Orange',
  'Cranberry Juice': 'Cranberry',
  'Lemon Juice': 'Lemon',
  'Lime Juice': 'Lime',
  'Orange Juice': 'Orange',
  'Pineapple Juice': 'Pineapple',
  'Pink Grapefruit Juice': 'Grapefruit',
  'Pomegranate Juice': 'Pomegranate'
};

const syrupNormalization = {
  'Agave Syrup': 'Agave',
  'Caramel Syrup': 'Caramel',
  'Cinnamon Syrup': 'Cinnamon',
  'Coconut Syrup': 'Coconut',
  Falernum: 'Falernum',
  Grenadine: 'Grenadine',
  'Honey and Ginger Syrup': 'Honey',
  'Honey Syrup': 'Honey',
  'Maple Syrup': 'Maple',
  Orgeat: 'Orgeat',
  'Sugar Syrup': 'Sugar syrup',
  'Vanilla Syrup': 'Vanilla'
};

const pureeNormalization = {
  'Mango Puree': 'Mango',
  'Mango Purée': 'Mango',
  'Peach Puree': 'Peach',
  'Peach Purée': 'Peach',
  'Passion Fruit Puree': 'Passion Fruit',
  'Passion Fruit Purée': 'Passion Fruit',
  'Strawberry Puree': 'Strawberry',
  'Strawberry Purée': 'Strawberry'
};

const botanicalNormalization = {
  'Fresh Ginger': 'Fresh Ginger',
  'Mint Leaves': 'Mint Leaves',
  'Fresh Basil Leaves': 'Fresh Basil Leaves'
};

const mixerNormalization = {
  'Club Soda': 'Soda',
  Cola: 'Cola',
  'Ginger Beer': 'Ginger Beer',
  'Grapefruit Soda': 'Grapefruit Soda',
  Lemonade: 'Lemonade',
  Prosecco: 'Sparkling Wine',
  'Sparkling Wine': 'Sparkling Wine',
  Soda: 'Soda',
  'Soda Water': 'Soda',
  'Tomato Juice': 'Tomato Juice',
  Tonic: 'Tonic Water',
  'Tonic Water': 'Tonic Water'
};

const aliases = {
  'aged rum': 'dark rum',
  'dark aged rum': 'dark rum',
  'blanco tequila': 'tequila',
  'citrus vodka': 'vodka',
  'gin or vodka': 'vodka-gin',
  'vodka/gin': 'vodka-gin',
  'rye whiskey': 'whiskey',
  'scotch whisky': 'whiskey',
  'irish whiskey': 'whiskey',
  'blended scotch whisky': 'whiskey',
  'peated scotch': 'whiskey',
  'lemon juice': 'lemon',
  'lime juice': 'lime',
  'lime wedges': 'lime',
  'orange juice': 'orange',
  'pineapple juice': 'pineapple',
  'cranberry juice': 'cranberry',
  'pink grapefruit juice': 'grapefruit',
  'agave syrup': 'agave',
  'coconut syrup': 'coconut',
  'vanilla syrup': 'vanilla',
  'maple syrup': 'maple',
  'honey syrup': 'honey',
  'honey and ginger syrup': 'honey',
  'sugar syrup': 'sugar syrup',
  'soda water': 'soda',
  'club soda': 'soda',
  tonic: 'tonic water',
  prosecco: 'sparkling wine',
  champagne: 'sparkling wine',
  'passion fruit puree': 'passion fruit',
  'peach puree': 'peach',
  'mango puree': 'mango',
  'strawberry puree': 'strawberry'
};

const APERITIF_LIQUEUR_OPTIONS = ['Aperol', 'Campari', 'Sweet Vermouth', 'Dry Vermouth', 'Amaretto', 'Elderflower Liqueur', 'Orange Liqueur', 'Midori', 'Crème de Cassis', 'Nectarine', 'RinQuinQuin'];

function normalize(value) {
  const cleaned = String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return aliases[cleaned] || cleaned;
}

function extractIngredients() {
  const categories = {
    spirits: new Set(),
    citrus: new Set(),
    juice: new Set(),
    syrup: new Set(),
    puree: new Set(),
    botanicals: new Set(),
    liqueur: new Set(),
    mixer: new Set(),
    bitters: new Set(),
    foamer: new Set()
  };

  const rejectedSyrups = new Set(['Butterfly Pea Flower Syrup', 'Strawberry Syrup']);
  const allowedPurees = new Set(['Passion Fruit', 'Strawberry', 'Mango', 'Peach']);

  cocktails.forEach((cocktail) => {
    cocktail.ingredients.forEach((ing) => {
      const role = String(ing.role || '').toLowerCase();
      if (role.includes('garnish')) return;

      if (role.includes('spirit')) {
        const mappedSpirits = spiritNormalization[ing.name] || [ing.name];
        mappedSpirits.forEach((spirit) => categories.spirits.add(spirit));
      } else if (role.includes('citrus')) {
        categories.citrus.add(citrusNormalization[ing.name] || ing.name);
      } else if (role.includes('juice')) {
        categories.juice.add(juiceNormalization[ing.name] || ing.name);
      } else if (role.includes('syrup') || role.includes('sweetener')) {
        const syrupName = syrupNormalization[ing.name] || ing.name;
        if (!rejectedSyrups.has(syrupName)) categories.syrup.add(syrupName);
      } else if (role.includes('puree')) {
        const pureeName = pureeNormalization[ing.name] || ing.name;
        if (allowedPurees.has(pureeName)) categories.puree.add(pureeName);
      } else if (role.includes('herb')) {
        const botanicalName = botanicalNormalization[ing.name] || ing.name;
        if (botanicalNormalization[ing.name]) categories.botanicals.add(botanicalName);
      } else if (role === 'ingredient') {
        if (citrusNormalization[ing.name]) categories.citrus.add(citrusNormalization[ing.name]);
        if (botanicalNormalization[ing.name]) categories.botanicals.add(botanicalNormalization[ing.name]);
      } else if (role.includes('liqueur') || role.includes('aperitif') || role.includes('amaro') || role.includes('bitter liqueur')) {
        categories.liqueur.add(ing.name);
      } else if (role.includes('mixer') || role.includes('sparkling wine')) {
        categories.mixer.add(mixerNormalization[ing.name] || ing.name);
      } else if (role.includes('bitters')) {
        categories.bitters.add(ing.name);
      } else if (role.includes('foamer')) {
        categories.foamer.add(ing.name);
      }
    });
  });

  const ingredients = {
    spirits: Array.from(categories.spirits).sort(),
    citrus: ['None', ...Array.from(categories.citrus).sort()],
    juice: ['None', ...Array.from(categories.juice).filter((item) => !['Lemon', 'Lime'].includes(item)).sort()],
    syrup: ['None', ...Array.from(categories.syrup).sort()],
    puree: ['None', ...Array.from(categories.puree).sort()],
    botanicals: ['None', ...Array.from(categories.botanicals).sort()],
    liqueur: Array.from(categories.liqueur).sort(),
    mixer: ['None', ...Array.from(categories.mixer).sort()],
    bitters: Array.from(categories.bitters).sort(),
    foamer: Array.from(categories.foamer).sort()
  };

  if (!ingredients.juice.includes('Blood Orange')) ingredients.juice.push('Blood Orange');
  if (!ingredients.juice.includes('Pomegranate')) ingredients.juice.push('Pomegranate');
  if (!ingredients.syrup.includes('Elderflower')) ingredients.syrup.push('Elderflower');
  if (!ingredients.syrup.includes('Agave')) ingredients.syrup.push('Agave');
  if (!ingredients.syrup.includes('Cinnamon')) ingredients.syrup.push('Cinnamon');
  if (!ingredients.syrup.includes('Caramel')) ingredients.syrup.push('Caramel');
  ingredients.syrup = ingredients.syrup.filter((item) => !['Butterfly Pea Flower Syrup', 'Strawberry Syrup'].includes(item));
  if (!ingredients.foamer.includes('Egg White')) ingredients.foamer.unshift('Egg White');
  if (!ingredients.juice.includes('Apple')) ingredients.juice.push('Apple');
  if (!ingredients.mixer.includes('Tonic Water')) ingredients.mixer.push('Tonic Water');
  if (!ingredients.mixer.includes('Sparkling Wine')) ingredients.mixer.push('Sparkling Wine');
  if (!ingredients.mixer.includes('Grapefruit Soda')) ingredients.mixer.push('Grapefruit Soda');
  if (!ingredients.bitters.includes('Orange Bitters')) ingredients.bitters.push('Orange Bitters');
  if (!ingredients.bitters.includes('Walnut Bitters')) ingredients.bitters.push('Walnut Bitters');
  if (!ingredients.puree.includes('Passion Fruit')) ingredients.puree.push('Passion Fruit');
  if (!ingredients.puree.includes('Strawberry')) ingredients.puree.push('Strawberry');
  if (!ingredients.puree.includes('Mango')) ingredients.puree.push('Mango');
  if (!ingredients.puree.includes('Peach')) ingredients.puree.push('Peach');
  ingredients.puree = ingredients.puree.filter((item) => ['None', 'Passion Fruit', 'Strawberry', 'Mango', 'Peach'].includes(item));
  if (!ingredients.botanicals.includes('Fresh Ginger')) ingredients.botanicals.push('Fresh Ginger');
  if (!ingredients.botanicals.includes('Mint Leaves')) ingredients.botanicals.push('Mint Leaves');
  if (!ingredients.botanicals.includes('Fresh Basil Leaves')) ingredients.botanicals.push('Fresh Basil Leaves');
  if (!ingredients.liqueur.includes('Elderflower Liqueur')) ingredients.liqueur.push('Elderflower Liqueur');
  if (!ingredients.liqueur.includes('Orange Liqueur')) ingredients.liqueur.push('Orange Liqueur');
  if (!ingredients.liqueur.includes('Midori')) ingredients.liqueur.push('Midori');
  if (!ingredients.liqueur.includes('Crème de Cassis')) ingredients.liqueur.push('Crème de Cassis');
  if (!ingredients.liqueur.includes('Nectarine')) ingredients.liqueur.push('Nectarine');

  ingredients.juice = ['None', ...ingredients.juice.filter((item) => item !== 'None').sort()];
  ingredients.syrup = ['None', ...ingredients.syrup.filter((item) => item !== 'None').sort()];
  ingredients.mixer = ['None', ...ingredients.mixer.filter((item) => item !== 'None').sort()];
  ingredients.puree = ['None', ...ingredients.puree.filter((item) => item !== 'None').sort()];
  ingredients.botanicals = ['None', ...ingredients.botanicals.filter((item) => item !== 'None').sort()];
  ingredients.bitters = ingredients.bitters.sort();
  ingredients.liqueur = ingredients.liqueur.sort();

  return ingredients;
}

const ingredients = extractIngredients();
const SPIRITS = ingredients.spirits;
const CITRUS = ingredients.citrus;
const JUICE = ingredients.juice;
const SYRUP = ingredients.syrup;
const PUREE = ingredients.puree;
const BOTANICALS = ingredients.botanicals;
const TOP = ingredients.mixer;
const cooccurrence = require('../:design-reference:/files 2/cooccurrence_table.json');
const evidencePairs = cooccurrence.pairs;

const suggestionCocktails = cocktails.map((cocktail) => {
  const pub = cocktail.published ?? true;
  const approved = cocktail.approved_for_suggestion ?? false;
  return { ...cocktail, published: pub, approved_for_suggestion: pub || approved };
});

const evidence = new Map(
  evidencePairs.map((pair) => [
    [
      `${String(pair.a_category || '').toLowerCase()}|${normalize(pair.a_ingredient)}`,
      `${String(pair.b_category || '').toLowerCase()}|${normalize(pair.b_ingredient)}`
    ].sort().join('::'),
    pair.count
  ])
);

function evidenceLookup(a, b) {
  return evidence.get([
    `${String(a.category || '').toLowerCase()}|${normalize(a.ingredient)}`,
    `${String(b.category || '').toLowerCase()}|${normalize(b.ingredient)}`
  ].sort().join('::')) || 0;
}

function outcomeScores(build) {
  const filled = build.filter((item) => item.ingredient && item.ingredient !== 'None');
  return filled.map((ingredient, index) => {
    const others = filled.filter((_, otherIndex) => otherIndex !== index);
    const average = others.length
      ? others.reduce((sum, other) => sum + evidenceLookup(ingredient, other), 0) / others.length
      : 0;
    return { ingredient, average };
  });
}

function nudgeBuild(originalBuild, alternatives) {
  const build = [...originalBuild];
  const changes = [];
  while (changes.length < 2) {
    const scores = outcomeScores(build).sort((a, b) => a.average - b.average);
    const rest = scores.slice(1).map((score) => score.average).sort((a, b) => a - b);
    const threshold = rest.length ? rest[Math.floor((scores.length - 1) / 2)] : 0;
    const weakest = scores.length > 1 && scores[0].average < threshold ? scores[0] : null;
    if (!weakest) break;
    const index = build.findIndex((item) => item === weakest.ingredient);
    const candidates = (alternatives[weakest.ingredient.category] || [])
      .filter((candidate) => candidate !== 'None' && candidate !== weakest.ingredient.ingredient)
      .map((candidate) => {
        const replacement = { category: weakest.ingredient.category, ingredient: candidate };
        const restBuild = build.filter((_, buildIndex) => buildIndex !== index);
        const avg = restBuild.length
          ? restBuild.reduce((sum, other) => sum + evidenceLookup(replacement, other), 0) / restBuild.length
          : 0;
        return { candidate, average: avg };
      })
      .sort((a, b) => b.average - a.average);

    if (!candidates.length || candidates[0].average <= weakest.average) break;
    build[index] = { category: weakest.ingredient.category, ingredient: candidates[0].candidate };
    changes.push({ from: weakest.ingredient.ingredient, to: candidates[0].candidate });
  }
  return { build, changes };
}

function roleBasedCategory(ingredient) {
  const role = String(ingredient.role || '').toLowerCase();
  if (role.includes('garnish')) return null;
  if (role.includes('base spirit') || role.includes('spirit')) return 'Spirit';
  if (role.includes('citrus')) return 'Citrus';
  if (role.includes('juice')) return 'Juice';
  if (role.includes('syrup') || role.includes('sweetener')) return 'Syrup';
  if (role.includes('puree')) return 'Puree';
  if (role.includes('herb')) return 'Botanical';
  if (role === 'ingredient') return null;
  if (role.includes('liqueur') || role.includes('aperitif') || role.includes('amaro') || role.includes('bitter liqueur')) return 'Liqueur';
  if (role.includes('mixer') || role.includes('sparkling wine')) return 'Top';
  if (role.includes('bitters')) return 'Bitters';
  if (role.includes('foamer')) return 'Foamer';
  return null;
}

function inferCategoryFromName(name) {
  const normalizedName = normalize(name);
  const botanicalNames = new Set(BOTANICALS.filter((i) => i !== 'None').map(normalize));
  const citrusNames = new Set(CITRUS.filter((i) => i !== 'None').map(normalize));
  const juiceNames = new Set(JUICE.filter((i) => i !== 'None').map(normalize));
  const syrupNames = new Set(SYRUP.filter((i) => i !== 'None').map(normalize));
  const pureeNames = new Set(PUREE.filter((i) => i !== 'None').map(normalize));
  const topNames = new Set(TOP.filter((i) => i !== 'None').map(normalize));
  if (botanicalNames.has(normalizedName)) return 'Botanical';
  if (citrusNames.has(normalizedName)) return 'Citrus';
  if (juiceNames.has(normalizedName)) return 'Juice';
  if (syrupNames.has(normalizedName)) return 'Syrup';
  if (pureeNames.has(normalizedName)) return 'Puree';
  if (topNames.has(normalizedName) || normalizedName === 'sparkling wine') return 'Top';
  return null;
}

function roleFor(ingredient) {
  if (String(ingredient.role || '').toLowerCase().includes('garnish')) return 'Excluded';
  return roleBasedCategory(ingredient) || inferCategoryFromName(ingredient.name);
}

function spiritSet(value) {
  const spirit = normalize(value);
  if (spirit === 'vodka-gin') return new Set(['vodka', 'gin']);
  return new Set([spirit]);
}

function spiritsMatch(a, b) {
  const aSet = spiritSet(a);
  const bSet = spiritSet(b);
  return Array.from(aSet).some((v) => bSet.has(v));
}

function buildCategory(item) {
  const aperitifNames = new Set(APERITIF_LIQUEUR_OPTIONS.map(normalize));
  return item.category === 'Spirit' && aperitifNames.has(normalize(item.ingredient)) ? 'Liqueur' : item.category;
}

function sameIngredient(selection, ingredient) {
  if (buildCategory(selection) !== roleFor(ingredient)) return false;
  return buildCategory(selection) === 'Spirit'
    ? spiritsMatch(selection.ingredient, ingredient.name)
    : normalize(selection.ingredient) === normalize(ingredient.name);
}

function suggestionNames(build) {
  const selected = build.filter((item) => item.ingredient).map((item) => ({ ...item, category: buildCategory(item) }));
  const byCategory = (category) => selected.filter((item) => item.category === category);
  let candidates = suggestionCocktails.filter((cocktail) => cocktail.approved_for_suggestion === true);
  let matchedAnyGate = false;

  for (const category of ['Spirit', 'Citrus', 'Juice', 'Syrup', 'Liqueur', 'Puree', 'Botanical', 'Top', 'Bitters', 'Foamer']) {
    const selections = byCategory(category);
    if (!selections.length) continue;
    const hasNone = selections.some((item) => item.ingredient === 'None');
    const chosen = selections.filter((item) => item.ingredient !== 'None');
    const filtered = candidates.filter((cocktail) => {
      const ings = cocktail.ingredients.filter((ingredient) => roleFor(ingredient) === category);
      if (hasNone && ings.length) return false;
      return chosen.every((selection) => ings.some((ingredient) => sameIngredient(selection, ingredient)));
    });

    if (filtered.length) {
      candidates = filtered;
      matchedAnyGate = true;
    } else if (category === 'Spirit' && chosen.length === 1) {
      return [];
    }
  }

  if (!matchedAnyGate) return [];
  const measured = selected.filter((item) => item.amountMl && item.amountMl > 0 && item.ingredient !== 'None');
  const buildTotal = measured.reduce((sum, item) => sum + item.amountMl, 0);

  const ratioDistance = (cocktail) => {
    const ings = cocktail.ingredients;
    const cocktailTotal = ings.reduce((sum, ing) => sum + (ing.amount || 0), 0);
    if (!buildTotal || !cocktailTotal) return 0;
    return measured.reduce((distance, selection) => {
      const ing = ings.find((candidate) => sameIngredient(selection, candidate));
      if (!ing || !ing.amount) return distance;
      return distance + Math.abs((selection.amountMl / buildTotal) - (ing.amount / cocktailTotal));
    }, 0);
  };

  return candidates
    .sort((a, b) => ratioDistance(a) - ratioDistance(b) || a.name.localeCompare(b.name))
    .slice(0, 1)
    .map((cocktail) => cocktail.name);
}

function cocktailToBuilderSelection(cocktail) {
  const result = [];
  const seen = new Set();

  for (const ing of cocktail.ingredients) {
    const role = String(ing.role || '').toLowerCase();
    if (role.includes('garnish')) continue;

    let item = null;

    if (role.includes('base spirit') || role.includes('spirit')) {
      const mappedSpirits = spiritNormalization[ing.name] || [ing.name];
      for (const spirit of mappedSpirits) {
        item = { category: 'Spirit', ingredient: spirit, amountMl: typeof ing.amount === 'number' ? ing.amount : null };
        const key = `${item.category}|${item.ingredient}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(item);
        }
      }
      continue;
    }
    if (role.includes('citrus')) {
      item = { category: 'Citrus', ingredient: citrusNormalization[ing.name] || ing.name, amountMl: typeof ing.amount === 'number' ? ing.amount : null };
    } else if (role.includes('juice')) {
      item = { category: 'Juice', ingredient: juiceNormalization[ing.name] || ing.name, amountMl: typeof ing.amount === 'number' ? ing.amount : null };
    } else if (role.includes('syrup') || role.includes('sweetener')) {
      item = { category: 'Syrup', ingredient: syrupNormalization[ing.name] || ing.name, amountMl: typeof ing.amount === 'number' ? ing.amount : null };
    } else if (role.includes('puree')) {
      item = { category: 'Puree', ingredient: pureeNormalization[ing.name] || ing.name, amountMl: typeof ing.amount === 'number' ? ing.amount : null };
    } else if (role.includes('mixer') || role.includes('sparkling wine')) {
      item = { category: 'Top', ingredient: mixerNormalization[ing.name] || ing.name, amountMl: typeof ing.amount === 'number' ? ing.amount : null };
    }

    if (item) {
      const key = `${item.category}|${item.ingredient}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }
  }

  return result;
}

function analyzeFailure(cocktail, selectedBuild, suggestedName) {
  const reasons = [];
  const categories = ['Spirit', 'Citrus', 'Juice', 'Syrup', 'Liqueur', 'Puree', 'Botanical', 'Top', 'Bitters', 'Foamer'];
  let candidateSet = suggestionCocktails.filter((c) => c.approved_for_suggestion === true);

  for (const category of categories) {
    const selections = selectedBuild.filter((item) => buildCategory(item) === category);
    if (!selections.length) continue;
    const hasNone = selections.some((i) => i.ingredient === 'None');
    const chosen = selections.filter((i) => i.ingredient !== 'None');
    const filtered = candidateSet.filter((c) => {
      const ings = c.ingredients.filter((ingredient) => roleFor(ingredient) === category);
      if (hasNone && ings.length) return false;
      return chosen.every((selection) => ings.some((ingredient) => sameIngredient(selection, ingredient)));
    });

    const selfInBefore = candidateSet.some((c) => c.id === cocktail.id);
    const selfInAfter = filtered.some((c) => c.id === cocktail.id);

    if (selfInBefore && !selfInAfter) {
      reasons.push(`filtered out at ${category} gate`);
      const selfCategoryIngs = cocktail.ingredients.filter((ingredient) => roleFor(ingredient) === category).map((i) => `${i.name} [${i.role}]`);
      const selectedCat = chosen.map((i) => i.ingredient);
      reasons.push(`selected ${category}: ${selectedCat.join(', ') || 'None'}; cocktail has: ${selfCategoryIngs.join(', ') || 'None'}`);
      break;
    }

    if (filtered.length) candidateSet = filtered;
    else if (category === 'Spirit' && chosen.length === 1) {
      reasons.push('spirit hard-stop: zero candidates at Spirit gate');
      break;
    }
  }

  if (!reasons.length) {
    if (!suggestedName) reasons.push('no candidate survived all gates');
    else reasons.push(`lost on ratio/name tiebreaker to "${suggestedName}"`);
  }

  return reasons.join(' | ');
}

const rows = [];
for (const cocktail of published) {
  const build = cocktailToBuilderSelection(cocktail);
  const nudge = nudgeBuild(build, {
    Spirit: SPIRITS,
    Citrus: CITRUS,
    Juice: JUICE,
    Syrup: SYRUP,
    Botanical: BOTANICALS,
    Liqueur: []
  });
  const suggestion = suggestionNames(nudge.build);
  const top = suggestion[0] || '';
  const pass = normalize(top) === normalize(cocktail.name);
  const reason = pass
    ? (nudge.changes.length ? `self-matched after nudge (${nudge.changes.map((c) => `${c.from}->${c.to}`).join(', ')})` : 'self-matched')
    : analyzeFailure(cocktail, nudge.build, top);
  rows.push({
    id: cocktail.id,
    name: cocktail.name,
    result: pass ? 'PASS' : 'FAIL',
    suggested: top || '(none)',
    reason
  });
}

console.log(`published=${published.length}`);
console.log(`pass=${rows.filter((r) => r.result === 'PASS').length}`);
console.log(`fail=${rows.filter((r) => r.result === 'FAIL').length}`);
console.log('---TABLE---');
for (const r of rows) {
  console.log([r.id, r.name, r.result, r.suggested, r.reason].join('\t'));
}
