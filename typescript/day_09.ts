import { combinations, printSolution, readFile } from './util'

function findBadNumber (numbers: Array<number>, lookback: number): number {
  for (let [idx, target] of numbers.slice(lookback).entries()) {
    idx += lookback
    const nums = new Set(numbers.slice(idx - lookback, idx))

    const combos = Array.from(
      combinations(
        Array.from(
          nums,
        ),
        2,
      ),
    )
    const possible = new Set(combos.map(([a, b]) => a + b))

    if (!possible.has(target)) {
      return target
    }
  }
  return -1
}

function part1 (numbers: Array<number>): number {
  return findBadNumber(numbers, 25)
}

function part2 (numbers: Array<number>): number {
  const badNumber = findBadNumber(numbers, 25)

  for (let start = 0; start < numbers.length - 2; start += 1) {
    for (let end = start + 2; end < numbers.length; end += 1) {
      const slice = numbers.slice(start, end)
      // console.log(slice)
      if (slice.reduce((acc, curr) => acc + curr) === badNumber) {
        return slice.reduce((acc, curr) => acc < curr ? acc : curr) + slice.reduce((acc, curr) => acc > curr ? acc : curr)
      }
    }
  }

  return 0
}

const numbers = readFile('data/day_09.txt').split('\n').map(Number)

printSolution(9, 1, part1(numbers))
printSolution(9, 2, part2(numbers))
