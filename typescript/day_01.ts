import util = require('./util');

function part1 (entries: ReadonlyArray<number>): number | null {
  for (const [aIdx, a] of entries.entries()) {
    for (const b of entries.slice(aIdx + 1)) {
      if (a + b === 2020) {
        return a * b
      }
    }
  }
  return null
}

function part2 (entries: ReadonlyArray<number>): number | null {
  for (const [aIdx, a] of entries.entries()) {
    for (const [bIdx, b] of entries.slice(aIdx + 1).entries()) {
      for (const c of entries.slice(aIdx + bIdx + 1)) {
        if (a + b + c === 2020) {
          return a * b * c
        }
      }
    }
  }
  return null
}

const entries: ReadonlyArray<number> = util.readFileLines('data/day_01.txt').map(Number)

util.printSolution(1, 1, part1(entries))
util.printSolution(1, 2, part2(entries))
