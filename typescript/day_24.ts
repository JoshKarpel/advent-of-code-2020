import { copySet, printSolution, readFile } from './util'
import { Vector2 } from './vector'

const DIRECTIONS = new Map([
  ['e', new Vector2(-1, 0)],
  ['ne', new Vector2(0, 1)],
  ['nw', new Vector2(1, 1)],
  ['w', new Vector2(1, 0)],
  ['sw', new Vector2(0, -1)],
  ['se', new Vector2(-1, -1)],
])

type Key = string
type BlackTiles = Set<Key>

function key (tile: Vector2): Key {
  return `${tile.x}|${tile.y}`
}

function invertKey (key: Key): Vector2 {
  const [x, y] = key.split('|').map(Number)
  return new Vector2(x, y)
}

function neighbours (position: Vector2): Array<Vector2> {
  return Array.from(DIRECTIONS.values())
    .map(offset => position.add(offset))
}

function initialize (tiles: Array<Array<Vector2>>): BlackTiles {
  const blackTiles: BlackTiles = new Set()

  for (const directions of tiles) {
    const dir = directions.reduce((a, b) => a.add(b))
    const k = key(dir)
    if (blackTiles.has(k)) {
      blackTiles.delete(k)
    } else {
      blackTiles.add(k)
    }
  }

  return blackTiles
}

function part1 (tiles: Array<Array<Vector2>>): number {
  const blackTiles = initialize(tiles)

  return blackTiles.size
}

function part2 (tiles: Array<Array<Vector2>>, days: number): number {
  let blackTiles = initialize(tiles)

  for (let day = 0; day < days; day += 1) {
    const newBlackTiles = copySet(blackTiles)

    const blackTilePositions = Array.from(blackTiles).map(invertKey)
    const tilesToCheck = new Set(
      blackTilePositions.concat(
        blackTilePositions
          .map(v => neighbours(v))
          .flat(),
      ),
    )

    for (const tile of tilesToCheck) {
      const k = key(tile)

      const isBlack = blackTiles.has(k)
      const numBlackNeighbours = neighbours(tile)
        .filter(neighbour => blackTiles.has(key(neighbour)))
        .length

      if (isBlack && (numBlackNeighbours === 0 || numBlackNeighbours > 2)) {
        newBlackTiles.delete(k)
      } else if (!isBlack && (numBlackNeighbours === 2)) {
        newBlackTiles.add(k)
      }
    }

    blackTiles = newBlackTiles
  }

  return blackTiles.size
}

const tiles = readFile('data/day_24.txt')
  .split('\n')
  .map(line => Array.from(line.matchAll(/e|w|nw|sw|ne|se/g)).map(m => m[0]))
  .map(directions => directions.map(d => DIRECTIONS.get(d) || Vector2.zero()))

printSolution(24, 1, part1(tiles))
printSolution(24, 2, part2(tiles, 100))
