import util = require('./util');

function seatID (instructions: string): number {
  return parseInt(Array.from(instructions).map(c => {
    return c === 'F' || c === 'L' ? '0' : '1'
  }).join(''), 2)
}

function part1 (seats: Array<string>): number {
  return Math.max(...seats.map(seatID))
}

function part2 (seats: Array<string>): number | null {
  const ids = seats.map(seatID).sort()
  let prev = -1
  for (const id of ids) {
    // did we skip an ID?
    if (id === prev + 2) {
      // the missing ID is in the gap
      return prev + 1
    }
    prev = id
  }
  return null
}

const seatInstructions = util.readFile('data/day_05.txt').split('\n')

util.printSolution(5, 1, part1(seatInstructions))
util.printSolution(5, 2, part2(seatInstructions))
