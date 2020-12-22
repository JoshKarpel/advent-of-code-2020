import { isDeepStrictEqual } from 'util'
import { readFile } from './util'

type Offsets = Array<[number, number]>

export const SELF_OFFSETS: Offsets = [
  [0, 0],
]
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
export const TILE_OFFSETS: Offsets = ADJACENT_OFFSETS.concat(SELF_OFFSETS)

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

    display (): void {
      console.log(this.fmt() + '\n')
    }
}
