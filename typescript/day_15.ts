import { printSolution, readFile } from './util'

function solve (numbers: Array<number>, maxTurn: number): number {
  const spoken: Array<number> = []
  const turnLastSpoken = new Map()
  const hasBeenSpoken = new Set()

  for (let turn = 1; turn <= maxTurn; turn += 1) {
    if (turn <= numbers.length) {
      spoken.push(numbers[turn - 1])
    } else {
      const lastNumberSpoken = spoken[spoken.length - 1]
      if (!hasBeenSpoken.has(lastNumberSpoken)) {
        spoken.push(0)
      } else {
        const whenLastSpoken = turnLastSpoken.get(lastNumberSpoken)
        spoken.push(turn - whenLastSpoken)
      }
    }

    hasBeenSpoken.add(spoken[spoken.length - 2])
    turnLastSpoken.set(spoken[spoken.length - 2], turn)
  }

  return spoken[spoken.length - 1]
}

const numbers = readFile('data/day_15.txt')
  .split(',')
  .map(Number)

printSolution(15, 1, solve(numbers, 2020))
printSolution(15, 2, solve(numbers, 30_000_000))
