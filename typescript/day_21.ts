import { printSolution, readFile, regExtract } from './util'

type Food = {ingredients: Array<string>, allergens: Array<string>}
type Foods = Array<Food>

function part1 (foods: Foods): number {
  console.log(foods)

  const allergenToPossibleIngredients: Map<string, Set<string>> = new Map()
  const ingredientToPossibleAllergens: Map<string, Set<string>> = new Map()

  for (const food of foods) {
    for (const allergen of food.allergens) {
      const possibilities = allergenToPossibleIngredients.get(allergen) || new Set()
      for (const ingredients of food.ingredients) {
        possibilities.add(ingredients)
      }
      allergenToPossibleIngredients.set(allergen, possibilities)
    }

    for (const ingredient of food.ingredients) {
      const possibilities = ingredientToPossibleAllergens.get(ingredient) || new Set()
      for (const allergens of food.allergens) {
        possibilities.add(allergens)
      }
      ingredientToPossibleAllergens.set(ingredient, possibilities)
    }
  }

  console.log(allergenToPossibleIngredients)
  console.log(ingredientToPossibleAllergens)

  return 0
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
