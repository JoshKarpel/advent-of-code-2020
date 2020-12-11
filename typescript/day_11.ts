import { printSolution, readFile } from './util'

const FLOOR = '.'
const EMPTY = 'L'
const OCCUPIED = '#'

type Grid = Array<Array<string>>

function fmtGrid (grid: Grid): string {
  return grid.map(line => line.join('')).join('\n')
}

function displayGrid (grid: Grid) {
  console.log(fmtGrid(grid) + '\n')
}

const ADJACENT = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

function countAdjacentOccupied (grid: Grid, x: number, y: number) : number {
  return ADJACENT
    .map(([xOffset, yOffset]) => (grid[y + yOffset] || [])[x + xOffset])
    .filter(seat => seat === OCCUPIED)
    .length
}

function * iterGrid (grid: Grid): Generator<[number, number, string]> {
  for (const [y, row] of grid.entries()) {
    for (const [x, seat] of row.entries()) {
      yield [x, y, seat]
    }
  }
}

function copyGrid (grid: Grid): Grid {
  return grid.map(row => [...row])
}

function part1 (grid: Grid): number {
  displayGrid(grid)

  let prevGrid = null

  while (prevGrid === null || fmtGrid(grid) !== fmtGrid(prevGrid)) {
    prevGrid = copyGrid(grid)

    for (const [x, y, seat] of iterGrid(prevGrid)) {
      const adjacentOccupiedCount = countAdjacentOccupied(prevGrid, x, y)
      if (seat === EMPTY && adjacentOccupiedCount === 0) {
        grid[y][x] = OCCUPIED
      } else if (seat === OCCUPIED && adjacentOccupiedCount >= 4) {
        grid[y][x] = EMPTY
      }
    }
    displayGrid(grid)
  }

  return Array.from(fmtGrid(grid)).filter(seat => seat === OCCUPIED).length
}

function countVisibleOccupied (grid: Grid, x: number, y: number) : number {
  return ADJACENT
    .filter(([xOffset, yOffset]) => {
      let distance = 0
      while (true) {
        distance += 1
        const seat = (grid[y + (yOffset * distance)] || [])[x + (xOffset * distance)]
        if (seat === FLOOR) {
          continue
        }
        return seat === OCCUPIED
      }
    }).length
}

function part2 (grid: Grid): number {
  grid = copyGrid(grid)
  displayGrid(grid)

  let prevGrid = null

  while (prevGrid === null || fmtGrid(grid) !== fmtGrid(prevGrid)) {
    prevGrid = copyGrid(grid)

    for (const [x, y, seat] of iterGrid(prevGrid)) {
      const visibleOccupiedCount = countVisibleOccupied(prevGrid, x, y)
      if (seat === EMPTY && visibleOccupiedCount === 0) {
        grid[y][x] = OCCUPIED
      } else if (seat === OCCUPIED && visibleOccupiedCount >= 5) {
        grid[y][x] = EMPTY
      }
    }

    displayGrid(grid)
  }

  return Array.from(fmtGrid(grid)).filter(seat => seat === OCCUPIED).length
}

const grid = readFile('data/day_11.txt').split('\n').map(line => line.split(''))

printSolution(11, 1, part1(copyGrid(grid)))
printSolution(11, 2, part2(copyGrid(grid)))
