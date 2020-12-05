import util = require('./util');

function seatID (instructions: string): number {
  return parseInt(Array.from(instructions).map(c => {
    return c === 'F' || c === 'L' ? '0' : '1'
  }).join(''), 2)
}

function part1 (seats: string[]): number {
  return Math.max(...seats.map(seatID))
}

function part2 (seats: string[]): number | null {
  const ids = new Set(seats.map(seatID))
  for (let i = 0; i < Math.max(...ids); i += 1) {
    if (ids.has(i - 1) && ids.has(i + 1) && !ids.has(i)) {
      return i
    }
  }
  return null
}

const seatInstructions = util.readFile('data/day_05.txt').split('\n')

util.printSolution(5, 1, part1(seatInstructions))
util.printSolution(5, 2, part2(seatInstructions))
