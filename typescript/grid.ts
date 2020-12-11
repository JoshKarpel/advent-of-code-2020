import { isDeepStrictEqual } from 'util'
import { readFile } from './util'

export class Grid<T> {
    grid: Array<Array<T>>

    constructor (grid: Array<Array<T>>) {
      this.grid = grid
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
      const keys: Array<[number, number]> = []
      for (const [y, row] of this.grid.entries()) {
        for (const x of row.keys()) {
          keys.push([x, y])
        }
      }
      return keys
    }

    values (): Array<T> {
      const values = []
      for (const row of this.grid) {
        for (const t of row) {
          values.push(t)
        }
      }
      return values
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

    equalTo (other: Grid<T>): boolean {
      return isDeepStrictEqual(this, other)
    }

    copy (): Grid<T> {
      return new Grid(this.grid.map(row => [...row]))
    }

    fmt (): string {
      return this.grid.map(row => row.join('')).join('\n')
    }

    display (): void {
      console.log(this.fmt() + '\n')
    }

    static fromFile<T> (path: string, converter: (char: string) => T) :Grid<T> {
      return new Grid(
        readFile(path)
          .split('\n')
          .map(line => line.split('').map(converter)),
      )
    }
}
