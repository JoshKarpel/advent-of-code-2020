import { sumReducer } from './util'
import util = require('./util');

type Rules = Map<string, Map<string, number>>

const SPECIAL_BAG = 'shiny gold'

function unpackBag (startingBag: string, rules: Rules): Map<string, number> {
  const bagsToUnpack: Array<[string, number]> = [[startingBag, 1]]
  const unpackedBags = new Map()

  while (bagsToUnpack.length > 0) {
    const [unpacking, numUnpacking] = bagsToUnpack.shift() as [string, number] // we won't be in here unless length > 0
    const newBags = rules.get(unpacking) || new Map()
    for (const [newBag, count] of newBags.entries()) {
      unpackedBags.set(newBag, (unpackedBags.get(newBag) || 0) + (count * numUnpacking))
      bagsToUnpack.push([newBag, count * numUnpacking])
    }
  }

  return unpackedBags
}

function unpackAllBags (rules: Rules): Map<string, Map<string, number>> {
  return new Map(Array.from(rules.keys())
    .map(startingBag => [startingBag, unpackBag(startingBag, rules)]),
  )
}

function part1 (rules: Rules): number {
  const unpackedBags = unpackAllBags(rules)

  return Array.from(unpackedBags.entries())
    .filter(([startingBag, unpacked]) => startingBag !== SPECIAL_BAG && unpacked.has(SPECIAL_BAG))
    .length
}

function part2 (rules: Rules): number {
  const unpackedBags = unpackAllBags(rules)

  return Array.from((unpackedBags.get(SPECIAL_BAG) || new Map()).values()).reduce(sumReducer)
}

const rules = new Map(
  util.readFile('data/day_07.txt')
    .split('\n')
    .map(line => {
      const container = util.regExtract(line, /^(\w+\s\w+)/g)[0]
      const contains = (line.match(/(\d+)\s(\w+\s\w+)/g) || []).map(c => [c.slice(2), Number(c[0])]) as Array<[string, number]>
      return [container, new Map(contains)]
    }),
) as Rules

util.printSolution(7, 1, part1(rules))
util.printSolution(7, 2, part2(rules))
