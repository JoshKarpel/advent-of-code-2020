import util = require('./util');

type Rules = Map<string, Map<string, number>>

const SPECIAL_BAG = 'shiny gold'

function part1 (rules: Rules): number {
  const totalBags = Array.from(rules.keys())
    .map(
      startingBag => {
        const bagsToUnpack = [[startingBag, 1]]
        const totalBags = new Map([[startingBag, 1]])

        while (bagsToUnpack.length > 0) {
          const [unpacking, numUnpacking] = bagsToUnpack.shift() as [string, number]
          const newBags = rules.get(unpacking) as Map<string, number>
          for (const [newBag, count] of newBags.entries()) {
            totalBags.set(newBag, (totalBags.get(newBag) || 0) + (count * numUnpacking))
            bagsToUnpack.push([newBag, count * numUnpacking])
          }
        }

        return [startingBag, totalBags]
      },
    ) as Array<[string, Map<string, number>]>

  return totalBags
    .filter(([startingBag, unpacked]) => startingBag !== SPECIAL_BAG && unpacked.has(SPECIAL_BAG))
    .length
}

function part2 (rules: Rules): number {
  const totalBags = new Map(Array.from(rules.keys())
    .map(
      startingBag => {
        const bagsToUnpack = [[startingBag, 1]]
        const totalBags = new Map()

        while (bagsToUnpack.length > 0) {
          const [unpacking, numUnpacking] = bagsToUnpack.shift() as [string, number]
          const newBags = rules.get(unpacking) as Map<string, number>
          for (const [newBag, count] of newBags.entries()) {
            totalBags.set(newBag, (totalBags.get(newBag) || 0) + (count * numUnpacking))
            bagsToUnpack.push([newBag, count * numUnpacking])
          }
        }

        return [startingBag, totalBags]
      },
    ) as Array<[string, Map<string, number>]>)

  return Array.from((totalBags.get(SPECIAL_BAG) as Map<string, number>).values()).reduce((acc, sum) => acc + sum)
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
