# 81-Cocktail Self-Match Audit

Run with `node scripts/self-test-81.cjs`.

Method: each published cocktail's spirit, citrus, juice, syrup, puree, and top fields are normalized through the same builder mappings, passed through the UI's nudge step, then evaluated by the UI's `suggestionNames` matching logic.

Result: 46 pass, 35 fail, 81 total.

| Cocktail | Result | Returned result / reason |
| --- | --- | --- |
| Alexander | FAIL | Dry Martini; lost on ratio/name tiebreaker |
| Brandy Alexander | FAIL | Sidecar; lost on ratio/name tiebreaker |
| Americano | FAIL | Mojito; lost on ratio/name tiebreaker |
| Aviation | PASS | Aviation |
| Bahama Mama | PASS | Bahama Mama |
| Between The Sheets | FAIL | Bramble; filtered at Spirit gate after nudge selected Gin, Gin instead of White Rum, Cognac |
| Amaretto Sour | FAIL | Whiskey Sour; lost on ratio/name tiebreaker |
| Aperol Spritz | PASS | Aperol Spritz |
| Baby Guinness | FAIL | No candidate survived all gates |
| Bellini | PASS | Bellini |
| Black Russian | FAIL | Dry Martini; lost on ratio/name tiebreaker |
| White Russian | FAIL | Dry Martini; lost on ratio/name tiebreaker |
| Blue Lagoon | PASS | Blue Lagoon |
| Bramble | FAIL | Aviation; filtered at Syrup gate after nudge selected Honey instead of Sugar Syrup |
| Champagne Cocktail | PASS | Champagne Cocktail |
| Cuba Libre | PASS | Cuba Libre |
| Bloody Mary | PASS | Bloody Mary |
| Bloody Maria | PASS | Bloody Maria |
| Red Snapper | PASS | Red Snapper |
| Boulevardier | FAIL | Mint Julep; lost on ratio/name tiebreaker |
| Caipirinha | PASS | Caipirinha |
| Caipiroska | PASS | Caipiroska |
| Caipirissima | PASS | Caipirissima |
| Cosmopolitan | FAIL | Moscow Mule; filtered at Juice gate after nudge selected Pineapple instead of Cranberry |
| Daiquiri | PASS | Daiquiri |
| Espresso Martini | FAIL | Caipiroska; lost on ratio/name tiebreaker |
| French Connection | FAIL | Sidecar; lost on ratio/name tiebreaker |
| Godfather | FAIL | Rusty Nail; lost on ratio/name tiebreaker |
| Godmother | FAIL | Dry Martini; lost on ratio/name tiebreaker |
| Hugo Spritz | FAIL | Aperol Spritz; lost on ratio/name tiebreaker |
| John Collins | PASS | John Collins; after Sugar syrup -> Honey nudge |
| Dark & Stormy | PASS | Dark & Stormy |
| French 75 | PASS | French 75; after Sugar syrup -> Honey nudge |
| French Martini | PASS | French Martini |
| Hanky Panky | FAIL | Dry Martini; lost on ratio/name tiebreaker |
| Irish Coffee | PASS | Irish Coffee |
| Sidecar | PASS | Sidecar |
| Tequila Sunrise | FAIL | Tommy's Margarita; filtered at Juice gate after nudge selected Cranberry instead of Orange |
| Vesper Martini | PASS | Vesper Martini |
| White Lady | FAIL | Aviation; lost on ratio/name tiebreaker |
| Zombie | PASS | Zombie |
| Sex on the Beach | FAIL | Sea Breeze; lost on ratio/name tiebreaker |
| Singapore Sling | PASS | Singapore Sling; after Grenadine -> Agave nudge |
| Tom Collins | PASS | Tom Collins; after Sugar syrup -> Honey nudge |
| Whiskey Sour | PASS | Whiskey Sour; after Sugar syrup -> Honey nudge |
| Vieux Carré | PASS | Vieux Carré |
| Dirty Martini | FAIL | Gimlet; lost on ratio/name tiebreaker |
| Mimosa | PASS | Mimosa |
| Mojito | PASS | Mojito |
| Negroni | FAIL | Dry Martini; lost on ratio/name tiebreaker |
| Tommy's Margarita | PASS | Tommy's Margarita |
| Dry Martini | FAIL | Gimlet; lost on ratio/name tiebreaker |
| Gimlet | PASS | Gimlet |
| Mint Julep | PASS | Mint Julep |
| Moscow Mule | PASS | Moscow Mule |
| Old Fashioned | PASS | Old Fashioned |
| Piña Colada | PASS | Piña Colada |
| Pisco Flower | FAIL | Tommy's Margarita; filtered at Spirit gate after nudge selected Tequila instead of Pisco |
| Pornstar Martini | PASS | Pornstar Martini |
| Rusty Nail | PASS | Rusty Nail |
| Sea Breeze | PASS | Sea Breeze; after Grapefruit -> Cranberry nudge |
| Paloma | PASS | Paloma |
| Pisco Sour | FAIL | Bramble; filtered at Spirit gate after nudge selected Gin instead of Pisco |
| Planter's Punch | FAIL | Tommy's Margarita; filtered at Spirit gate after nudge selected Tequila instead of Aged Rum |
| Russian Spring Punch | PASS | Russian Spring Punch; after Sugar syrup -> Honey nudge |
| Kir | FAIL | No candidate survived all gates |
| Lemon Drop Martini | FAIL | Blue Lagoon; lost on ratio/name tiebreaker |
| Mai Tai | FAIL | Margarita; filtered at Spirit gate after nudge selected Tequila, Tequila instead of Aged Rum, White Rum |
| Manhattan Dry | FAIL | Rusty Nail; lost on ratio/name tiebreaker |
| Margarita | PASS | Margarita |
| Kamikaze | FAIL | Moscow Mule; lost on ratio/name tiebreaker |
| Kir Royal | FAIL | Aperol Spritz; lost on ratio/name tiebreaker |
| Long Island Iced Tea | PASS | Long Island Iced Tea; after White Rum -> Gin and Sugar syrup -> Agave nudges |
| Manhattan Sweet | FAIL | Rusty Nail; lost on ratio/name tiebreaker |
| Manhattan Perfect | FAIL | Rusty Nail; lost on ratio/name tiebreaker |
| Sangria | FAIL | Mojito; lost on ratio/name tiebreaker |
| Sour Maple | PASS | Sour Maple; after Lemon -> Orange nudge |
| Jungle Bird | PASS | Jungle Bird |
| Penicillin | PASS | Penicillin; after Lemon -> Pineapple nudge |
| Screwdriver | PASS | Screwdriver |
| Basil Smash | PASS | Basil Smash |

## Base-Spirit Audit

Eleven slash-separated values were found, one more than the reported ten. Gimlet was the only unambiguous single-choice mismatch and was changed from `Vodka/Gin` to `Gin or Vodka`.

The ten remaining values are genuine multi-slot or blend recipes. The current public data structure only supports the scalar `base_spirit` display field, so they are deliberately flagged rather than changed to an invented partial schema:

| Cocktail | Current value | Evidence-based classification |
| --- | --- | --- |
| Americano | Campari/Vermouth | Two aperitif slots |
| Bahama Mama | White Rum/Aged Rum/Coconut Rum | Three base-spirit slots |
| Between The Sheets | Rum/Cognac | Two base-spirit slots |
| Champagne Cocktail | Cognac/Sparkling Wine | Cognac base with sparkling-wine top |
| Hugo Spritz | Elderflower Liqueur/Sparkling Wine | Liqueur base with sparkling-wine top |
| Vesper Martini | Gin/Vodka | Two base-spirit slots |
| Zombie | White Rum/Aged Rum/Overproof Rum | Three base-spirit slots |
| Vieux Carré | Whiskey/Cognac | Two base-spirit slots |
| Mai Tai | Aged Rum/White Rum | Two base-spirit slots |
| Long Island Iced Tea | Vodka/Gin/Rum/Tequila | Four base-spirit slots |

A future data-schema change can replace those scalar slash labels with an array such as `base_spirit_slots`; that requires updating the page and card interfaces together.
