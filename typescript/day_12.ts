import { printSolution, readFile } from './util'
import { Vector2 } from './vector'

const NORTH = 'N'
const SOUTH = 'S'
const EAST = 'E'
const WEST = 'W'
const LEFT = 'L'
const RIGHT = 'R'
const FORWARD = 'F'

const DIRECTIONS = new Map([
  [EAST, new Vector2(1, 0)],
  [WEST, new Vector2(-1, 0)],
  [NORTH, new Vector2(0, 1)],
  [SOUTH, new Vector2(0, -1)],
])

type Instruction = [string, number]

function part1 (instructions: Array<Instruction>): number {
  let position = new Vector2(0, 0)
  let facing = new Vector2(1, 0)

  for (const [op, arg] of instructions) {
    if (op === FORWARD) {
      position = position.add(facing.mul(arg))
    } else if (op === RIGHT) {
      facing = facing.cw(arg)
    } else if (op === LEFT) {
      facing = facing.ccw(arg)
    } else {
      const direction = DIRECTIONS.get(op)
      if (direction === undefined) {
        throw new Error('bad direction')
      }
      const move = direction.mul(arg)
      position = position.add(move)
    }
  }

  return Math.round(position.manhattan())
}

function part2 (instructions: Array<Instruction>): number {
  let position = new Vector2(0, 0)
  let waypoint = new Vector2(10, 1)

  for (const [op, arg] of instructions) {
    if (op === FORWARD) {
      position = position.add(waypoint.mul(arg))
    } else if (op === RIGHT) {
      waypoint = waypoint.cw(arg)
    } else if (op === LEFT) {
      waypoint = waypoint.ccw(arg)
    } else {
      const direction = DIRECTIONS.get(op)
      if (direction === undefined) {
        throw new Error('bad direction')
      }
      const move = direction.mul(arg)
      waypoint = waypoint.add(move)
    }
  }

  return Math.round(position.manhattan())
}

const instructions: Array<Instruction> = readFile('data/day_12.txt')
  .split('\n')
  .map(line => [line[0], Number(line.slice(1)) as number])

printSolution(12, 1, part1(instructions))
printSolution(12, 2, part2(instructions))
