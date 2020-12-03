import util = require('./util');

const TREE = '#'

function solve (map: ReadonlyArray<string>, across: number, down: number): number {
  let x = 0
  let count = 0
  for (let rowIdx = 0; rowIdx < map.length; rowIdx += down) {
    const row = map[rowIdx]
    if (row === undefined) { throw new Error('woops') }
    if (row.charAt(x % row.length) === TREE) {
      count += 1
    }
    x += across
  }
  return count
}

function part1 (map: ReadonlyArray<string>): number {
  return solve(map, 3, 1)
}

function part2 (map: ReadonlyArray<string>): number {
  return [
    { across: 1, down: 1 },
    { across: 3, down: 1 },
    { across: 5, down: 1 },
    { across: 7, down: 1 },
    { across: 1, down: 2 }
  ]
    .map(({ across, down }) => solve(map, across, down))
    .reduce((acc, curr) => acc * curr)
}

const map = util.readFileLines('data/day_03.txt')

util.printSolution(3, 1, part1(map))
util.printSolution(3, 2, part2(map))
