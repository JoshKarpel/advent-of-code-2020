import { mod, printSolution, readFile } from './util'

const NORTH = 'N'
const SOUTH = 'S'
const EAST = 'E'
const WEST = 'W'
const LEFT = 'L'
const RIGHT = 'R'
const FORWARD = 'F'

const DIRECTIONS = [NORTH, EAST, SOUTH, WEST]

type Instruction = [string, number]
type Position = {
  [direction: string]: number
}

function part1 (instructions: Array<Instruction>): number {
  const position: Position = { N: 0, E: 0, W: 0, S: 0 }
  let facing = EAST

  for (const [op, arg] of instructions) {
    if (op === FORWARD) {
      position[facing] += arg
    } else if (op === RIGHT) {
      facing = DIRECTIONS[mod(DIRECTIONS.indexOf(facing) + (arg / 90), DIRECTIONS.length)]
    } else if (op === LEFT) {
      facing = DIRECTIONS[mod(DIRECTIONS.indexOf(facing) - (arg / 90), DIRECTIONS.length)]
    } else {
      position[op] += arg
    }
  }

  return Math.abs(position[NORTH] - position[SOUTH]) + Math.abs(position[EAST] - position[WEST])
}

function part2 (instructions: Array<Instruction>): number {
  const position: Position = { N: 0, E: 0, W: 0, S: 0 }
  let waypoint: Position = { N: 1, E: 10, W: 0, S: 0 }

  for (const [op, arg] of instructions) {
    if (op === FORWARD) {
      for (const dir of DIRECTIONS) {
        position[dir] += waypoint[dir] * arg
      }
    } else if (op === RIGHT) {
      for (let i = 0; i < (arg / 90); i += 1) {
        waypoint = rotateRight(waypoint)
      }
    } else if (op === LEFT) {
      for (let i = 0; i < (arg / 90); i += 1) {
        waypoint = rotateRight(rotateRight(rotateRight(waypoint)))
      }
    } else {
      waypoint[op] += arg
    }
    console.log(position, waypoint)
  }

  return Math.abs(position[NORTH] - position[SOUTH]) + Math.abs(position[EAST] - position[WEST])
}

function rotateRight (position: Position): Position {
  return {
    E: position[NORTH] - position[SOUTH],
    N: -(position[EAST] - position[WEST]),
    S: 0,
    W: 0,
  }
}

const instructions: Array<Instruction> = readFile('data/day_12.txt')
  .split('\n')
  .map(line => [line[0], Number(line.slice(1)) as number])

printSolution(12, 1, part1(instructions))
printSolution(12, 2, part2(instructions))
