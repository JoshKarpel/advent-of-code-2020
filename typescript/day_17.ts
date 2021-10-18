import { permutations, printSolution, readFile, zip } from './util'

type Active = '#'
type Inactive = '.'
type Activity = Active | Inactive

const ACTIVE: Active = '#'
const INACTIVE: Inactive = '.'

type Coords = Array<number>
type Key = string

class Grid17 {
  grid: Map<Key, Activity>

  constructor () {
    this.grid = new Map()
  }

  static fromFile (path: string, dimension: number): Grid17 {
    const grid = new Grid17()
    const raw = readFile(path)
    for (const [y, row] of raw.split('\n').entries()) {
      for (const [x, elem] of row.split('').entries()) {
        grid.set([x, y].concat(Array(dimension - 2).fill(0)), elem as Activity)
      }
    }
    return grid
  }

  values (): Array<Activity> {
    return Array.from(this.grid.values())
  }

  _key (coords: Coords): Key {
    return coords.join('|')
  }

  _coords (key: Key): Coords {
    return key.split('|').map(Number)
  }

  get (coords: Coords): Activity {
    return this.grid.get(this._key(coords)) || INACTIVE
  }

  set (coords: Coords, activity: Activity) {
    this.grid.set(this._key(coords), activity)
  }

  neighbours (center: Coords): Array<Coords> {
    const arr: Array<Coords> = []
    for (const offsets of permutations([-1, 0, 1], center.length)) {
      if (!offsets.every(o => o === 0)) {
        arr.push(zip(center, offsets).map(([c, o]) => c + o))
      }
    }
    return arr
  }

  copy (): Grid17 {
    const newGrid = new Grid17()
    for (const [k, v] of this.grid.entries()) {
      newGrid.grid.set(k, v)
    }
    return newGrid
  }

  evolve (): Grid17 {
    const newGrid = this.copy()

    let toCheck: Array<string> = Array.from(this.grid.keys())
    toCheck = toCheck
      .concat(
        toCheck
          .flatMap(key => this.neighbours(this._coords(key)))
          .map(this._key),
      )

    for (const key of toCheck) {
      const coords = this._coords(key)
      const activity = this.get(coords)
      const neighourCoords = this.neighbours(coords)

      const numNeighboursActive = neighourCoords
        .map(nc => this.get(nc))
        .filter(a => a === ACTIVE)
        .length

      if (activity === ACTIVE && !(numNeighboursActive === 2 || numNeighboursActive === 3)) {
        newGrid.set(coords, INACTIVE)
      } else if (activity === INACTIVE && numNeighboursActive === 3) {
        newGrid.set(coords, ACTIVE)
      }
    }

    return newGrid
  }
}

function solve (grid: Grid17): number {
  for (let cycle = 0; cycle < 6; cycle += 1) {
    grid = grid.evolve()
  }
  return grid.values().filter(a => a === ACTIVE).length
}

printSolution(17, 1, solve(Grid17.fromFile('data/day_17.txt', 3)))
printSolution(17, 2, solve(Grid17.fromFile('data/day_17.txt', 4)))
