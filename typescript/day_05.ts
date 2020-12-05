import util = require('./util');

function findSeatID (bsp: string): number {
  const fb = Array.from(bsp.slice(0, 7)).map(c => { return c === 'F' ? 'lower' : 'upper' })
  const lr = Array.from(bsp.slice(7)).map(c => { return c === 'L' ? 'lower' : 'upper' })

  return (doIt(fb, 128) * 8) + doIt(lr, 8)
}

function doIt (instructions: string[], max: number) : number {
  let lower = 0
  let upper = max

  for (const instr of instructions) {
    if (instr === 'lower') {
      upper = Math.floor((upper + lower) / 2)
    } else if (instr === 'upper') {
      lower = Math.ceil((upper + lower) / 2)
    }
  }
  return lower
}

function part1 (seats: string[]): number {
  return Math.max(...seats.map(findSeatID))
}

function part2 (seats: string[]): number {
  const ids = new Set(seats.map(findSeatID))
  for (let i = 0; i < Math.max(...ids); i += 1) {
    if (ids.has(i - 1) && ids.has(i + 1) && !ids.has(i)) {
      return i
    }
  }
  return -1
}

const seats = util.readFile('data/day_05.txt').split('\n')

// doIt(Array.from('FBFBBFFRLR').map(c => { return c === 'F' ? 'lower' : 'upper' }), 127)

util.printSolution(5, 1, part1(seats))
util.printSolution(5, 2, part2(seats))
