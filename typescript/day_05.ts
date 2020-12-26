import { compareNumbers, difference, printSolution, range, readFile } from './util'

function seatID (instructions: string): number {
  return parseInt(
    instructions
      .split('')
      .map(c => c === 'F' || c === 'L' ? '0' : '1')
      .join(''),
    2,
  )
}

function part1 (seats: Array<string>): number {
  return Math.max(...seats.map(seatID))
}

function part2 (seats: Array<string>): number {
  const ids = seats.map(seatID).sort(compareNumbers)
  return [...difference(range(Math.min(...ids), Math.max(...ids) + 1), ids)][0]
}

const seatInstructions = readFile('data/day_05.txt').split('\n')

printSolution(5, 1, part1(seatInstructions))
printSolution(5, 2, part2(seatInstructions))
