import { printSolution, readFile } from './util'
import { isDeepStrictEqual } from 'util'

const FLOOR = '.'
const EMPTY = 'L'
const OCCUPIED = '#'

type Offsets = Array<[number, number]>
export const MANHATTAN_OFFSETS: Offsets = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
]
export const DIAGONAL_OFFSETS: Offsets = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
]
export const ADJACENT_OFFSETS: Offsets = MANHATTAN_OFFSETS.concat(DIAGONAL_OFFSETS)

export class Grid2<T> {
    grid: Array<Array<T>>

    constructor (grid: Array<Array<T>>) {
      this.grid = grid
    }

    static fromFile<T> (path: string, converter: (char: string) => T): Grid2<T> {
      return new Grid2(
        readFile(path)
          .split('\n')
          .map(line => line.split('').map(converter)),
      )
    }

    get (x: number, y: number): T | undefined {
      return (this.grid[y] || [])[x]
    }

    entries (): Array<[number, number, T]> {
      const entries: Array<[number, number, T]> = []
      for (const [y, row] of this.grid.entries()) {
        for (const [x, t] of row.entries()) {
          entries.push([x, y, t])
        }
      }
      return entries
    }

    keys (): Array<[number, number]> {
      return this
        .entries()
        .map(([x, y, _t]) => [x, y])
    }

    values (): Array<T> {
      return this
        .entries()
        .map(([_x, _y, t]) => t)
    }

    set (x: number, y: number, t: T) {
      const row = this.grid[y]

      if (row === undefined) {
        throw new Error(`You tried to set a value in row ${y}, but there are only ${this.grid.length} rows`)
      }

      if (x > row.length) {
        throw new Error(`You tried to set a value in column ${x}, but there are only ${row.length} columns`)
      }

      row[x] = t
    }

    offsets (x: number, y: number, offsets: Array<[number, number]>): Array<[number, number, T | undefined]> {
      return offsets
        .map(([xOffset, yOffset]) => {
          const xO = x + xOffset
          const yO = y + yOffset
          return [xO, yO, this.get(xO, yO)]
        })
    }

    offsetKeys (xCenter: number, yCenter: number, offsets: Array<[number, number]>): Array<[number, number]> {
      return this
        .offsets(xCenter, yCenter, offsets)
        .map(([x, y, _t]) => [x, y])
    }

    offsetValues (xCenter: number, yCenter: number, offsets: Array<[number, number]>): Array<T | undefined> {
      return this
        .offsets(xCenter, yCenter, offsets)
        .map(([_x, _y, t]) => t)
    }

    equalTo (other: Grid2<T>): boolean {
      return isDeepStrictEqual(this, other)
    }

    copy (): Grid2<T> {
      return new Grid2(this.grid.map(row => [...row]))
    }

    fmt (): string {
      return this.grid.map(row => row.join('')).join('\n')
    }
}

function countAdjacentOccupied (grid: Grid2<string>, x: number, y: number): number {
  return grid
    .offsetValues(x, y, ADJACENT_OFFSETS)
    .filter(seat => seat === OCCUPIED)
    .length
}

function countVisibleOccupied (grid: Grid2<string>, x: number, y: number): number {
  return ADJACENT_OFFSETS
    .map(([xOffset, yOffset]) => {
      let distance = 0
      while (true) {
        distance += 1
        const seat = grid.get(x + (xOffset * distance), y + (yOffset * distance))
        if (seat === FLOOR) {
          continue
        }
        return seat
      }
    })
    .filter(seat => seat === OCCUPIED)
    .length
}

function solve (
  grid: Grid2<string>,
  counter: (grid: Grid2<string>, x: number, y: number) => number,
  occupiedLimit: number,
): number {
  grid = grid.copy()
  let prevGrid = null

  while (prevGrid === null || !grid.equalTo(prevGrid)) {
    prevGrid = grid.copy()

    for (const [x, y, seat] of prevGrid.entries()) {
      const count = counter(prevGrid, x, y)
      if (seat === EMPTY && count === 0) {
        grid.set(x, y, OCCUPIED)
      } else if (seat === OCCUPIED && count >= occupiedLimit) {
        grid.set(x, y, EMPTY)
      }
    }
  }

  return grid
    .values()
    .filter(seat => seat === OCCUPIED)
    .length
}

function part1 (grid: Grid2<string>): number {
  return solve(grid, countAdjacentOccupied, 4)
}

function part2 (grid: Grid2<string>): number {
  return solve(grid, countVisibleOccupied, 5)
}

const grid = Grid2.fromFile('data/day_11.txt', char => char)

printSolution(11, 1, part1(grid))
printSolution(11, 2, part2(grid))
