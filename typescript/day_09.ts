import { prefixSum, printSolution, readFile } from './util'

function findInvalidNumber (numbers: Array<number>, lookback: number): number {
  for (const [offset, target] of numbers.slice(lookback).entries()) {
    const candidates = new Set(numbers.slice(offset, offset + lookback))

    const isValid = Array.from(candidates)
      .some(candidate => {
        const difference = target - candidate
        return difference !== target && candidates.has(difference)
      })

    if (!isValid) {
      return target
    }
  }

  return -1
}

function part1 (numbers: Array<number>): number {
  return findInvalidNumber(numbers, 25)
}

function part2 (numbers: Array<number>): number {
  const invalidNumber = findInvalidNumber(numbers, 25)
  const sums = prefixSum(numbers)

  let [start, end] = [0, 2]

  while (true) {
    const sum = sums[end + 1] - sums[start]
    if (sum === invalidNumber) {
      const slice = numbers.slice(start, end)
      return Math.min(...slice) + Math.max(...slice)
    } else if (sum <= invalidNumber) {
      end += 1
    } else {
      start += 1
    }
  }
}

const numbers = readFile('data/day_09.txt').split('\n').map(Number)

printSolution(9, 1, part1(numbers))
printSolution(9, 2, part2(numbers))
