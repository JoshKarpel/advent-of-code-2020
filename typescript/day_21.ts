import { difference, intersection, printSolution, readFile, regExtract } from './util'

type Food = { ingredients: Array<string>, allergens: Array<string> }
type Foods = Array<Food>

function determineAllergenIngredients (foods: Array<Food>): Map<string, string> {
  const possibleIngredientsMap: Map<string, Set<string>> = new Map()

  for (const food of foods) {
    for (const allergen of food.allergens) {
      const possibilities: Set<string> = intersection(
        possibleIngredientsMap.get(allergen) || food.ingredients,
        food.ingredients,
      )

      possibleIngredientsMap.set(allergen, possibilities)
    }
  }

  const possibleIngredients = Array.from(possibleIngredientsMap.entries())
    .sort(([_f1, s1], [_f2, s2]) => s1.size - s2.size)

  const ingredientToAllergen = new Map()
  while (ingredientToAllergen.size < possibleIngredients.length) {
    for (const [allergen, possibilities] of possibleIngredients) {
      const remainingPossibilities = difference(possibilities, ingredientToAllergen.keys())
      if (remainingPossibilities.size === 1) {
        const ingredient = remainingPossibilities.values().next().value as number
        ingredientToAllergen.set(ingredient, allergen)
      }
    }
  }

  return ingredientToAllergen
}

function part1 (foods: Foods): number {
  const ingredientToAllergen = determineAllergenIngredients(foods)

  return foods
    .flatMap(food => food.ingredients)
    .filter(ingredient => !ingredientToAllergen.has(ingredient))
    .length
}

function part2 (foods: Foods): string {
  const ingredientToAllergen = determineAllergenIngredients(foods)

  return Array.from(ingredientToAllergen.entries())
    .sort(([_i1, a1], [_i2, a2]) => a1.localeCompare(a2))
    .map(([ingredient, _allergen]) => ingredient)
    .join(',')
}

const foods = readFile('data/day_21.txt')
  .split('\n')
  .map(line => {
    const match = regExtract(line, /([\w\s]+)\s\(contains\s([\w,\s]+)/)
    return {
      ingredients: match[1].split(' '),
      allergens: match[2].split(', '),
    }
  })

printSolution(21, 1, part1(foods))
printSolution(21, 2, part2(foods))
