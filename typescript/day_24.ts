import { copyMap, printSolution, readFile } from './util'
import { Vector2 } from './vector'

const DIRECTIONS = new Map([
  ['e', new Vector2(-1, 0)],
  ['ne', new Vector2(0, 1)],
  ['nw', new Vector2(1, 1)],
  ['w', new Vector2(1, 0)],
  ['sw', new Vector2(0, -1)],
  ['se', new Vector2(-1, -1)],
])

const BLACK = 'b'
const WHITE = 'w'
type Black = typeof BLACK
type White = typeof WHITE
type Key = string

function key (vec: Vector2): Key {
  return `${vec.x}|${vec.y}`
}

function invertKey (key: Key): Vector2 {
  const [x, y] = key.split('|').map(Number)
  return new Vector2(x, y)
}

function neighbours (position: Vector2): Array<Vector2> {
  return Array.from(DIRECTIONS.values())
    .map(offset => position.add(offset))
}

function initialize (tiles: Array<Array<Vector2>>): Map<Key, Black | White> {
  const tileColors: Map<Key, Black | White> = new Map()

  for (const directions of tiles) {
    const dir = directions.reduce((a, b) => a.add(b))
    tileColors.set(
      key(dir),
      (tileColors.get(key(dir)) || WHITE) === WHITE ? BLACK : WHITE,
    )
  }

  return tileColors
}

function countBlackTiles (tileColors: Map<string, Black | White>) {
  return Array.from(tileColors.values()).filter(color => color === BLACK).length
}

function part1 (tiles: Array<Array<Vector2>>): number {
  const tileColors = initialize(tiles)
  return Array.from(tileColors.values()).filter(color => color === BLACK).length
}

function part2 (tiles: Array<Array<Vector2>>): number {
  let tileColors = initialize(tiles)

  for (let day = 0; day < 100; day += 1) {
    const newTileColors = copyMap(tileColors)

    let toCheck = Array.from(tileColors.keys()).map(invertKey)
    toCheck = Array.from(new Set(toCheck.concat(...toCheck.flatMap(v => neighbours(v)))))

    for (const vec of toCheck) {
      const tileColor = tileColors.get(key(vec)) || WHITE
      const numBlackNeighbours = neighbours(vec)
        .map(v => tileColors.get(key(v)) || WHITE)
        .filter(color => color === BLACK)
        .length

      if (tileColor === BLACK && (numBlackNeighbours === 0 || numBlackNeighbours > 2)) {
        newTileColors.set(key(vec), WHITE)
      } else if (tileColor === WHITE && (numBlackNeighbours === 2)) {
        newTileColors.set(key(vec), BLACK)
      }
    }
    tileColors = newTileColors
  }

  return countBlackTiles(tileColors)
}

const tiles = readFile('data/day_24.txt')
  .split('\n')
  .map(line => Array.from(line.matchAll(/e|w|nw|sw|ne|se/g)).map(m => m[0]))
  .map(directions => directions.map(d => DIRECTIONS.get(d) || Vector2.zero()))

printSolution(24, 1, part1(tiles))
printSolution(24, 2, part2(tiles))
