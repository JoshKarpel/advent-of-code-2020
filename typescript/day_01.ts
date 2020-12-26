import { combinations, mulReducer, printSolution, readFile } from './util'

function solve (entries: Array<number>, target: number, k: number): number {
  const solution = Array.from(combinations(entries, k))
    .find(combo => combo.reduce((acc, curr) => acc + curr) === target)

  if (solution === undefined) {
    throw new Error('no solution found')
  }

  return solution.reduce(mulReducer)
}

function part1 (entries: Array<number>): number {
  return solve(entries, 2020, 2)
}

function part2 (entries: Array<number>): number {
  return solve(entries, 2020, 3)
}

const entries = readFile('data/day_01.txt').split('\n').map(Number)

printSolution(1, 1, part1(entries))
printSolution(1, 2, part2(entries))
