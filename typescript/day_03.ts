import { printSolution, readFile } from './util'

const TREE = '#'

function solve (map: ReadonlyArray<string>, across: number, down: number): number {
  let x = 0
  let count = 0
  for (const [rowIdx, row] of map.entries()) {
    if (rowIdx % down !== 0) {
      continue
    }
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
    { across: 1, down: 2 },
  ]
    .map(({ across, down }) => solve(map, across, down))
    .reduce((acc, curr) => acc * curr)
}

const map = readFile('data/day_03.txt').split('\n')

printSolution(3, 1, part1(map))
printSolution(3, 2, part2(map))
