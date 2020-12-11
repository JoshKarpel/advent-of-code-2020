import { Grid } from './grid'
import { printSolution } from './util'

const FLOOR = '.'
const EMPTY = 'L'
const OCCUPIED = '#'

const ADJACENT_OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

function countAdjacentOccupied (grid: Grid<string>, x: number, y: number) : number {
  return ADJACENT_OFFSETS
    .map(([xOffset, yOffset]) => grid.get(x + xOffset, y + yOffset))
    .filter(seat => seat === OCCUPIED)
    .length
}

function countVisibleOccupied (grid: Grid<string>, x: number, y: number) : number {
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
  grid: Grid<string>,
  counter: (grid: Grid<string>, x: number, y: number) => number,
  occupiedLimit: number,
) : number {
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

  return grid.values().filter(seat => seat === OCCUPIED).length
}

function part1 (grid: Grid<string>): number {
  return solve(grid, countAdjacentOccupied, 4)
}

function part2 (grid: Grid<string>): number {
  return solve(grid, countVisibleOccupied, 5)
}

const grid = Grid.fromFile('data/day_11.txt', char => char)

printSolution(11, 1, part1(grid))
printSolution(11, 2, part2(grid))
