import util = require('./util');

function solve (entries: Array<number>, target: number, k: number): number | null {
  for (const combo of util.combinations(entries, k)) {
    if (combo.reduce((acc, curr) => acc + curr) === target) {
      return combo.reduce((acc, curr) => acc * curr)
    }
  }
  return null
}

function part1 (entries: Array<number>): number | null {
  return solve(entries, 2020, 2)
}

function part2 (entries: Array<number>): number | null {
  return solve(entries, 2020, 3)
}

const entries = util.readFile('data/day_01.txt').split('\n').map(Number)

util.printSolution(1, 1, part1(entries))
util.printSolution(1, 2, part2(entries))
