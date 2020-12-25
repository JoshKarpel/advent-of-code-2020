import { arrayEqual, count, mulReducer, printSolution, readFile, regExtract, reverseString, rotate90, zip } from './util'

type Pixels = Array<Array<string>>

class Tile {
    readonly id: number
    readonly tile: Pixels
    readonly lastIndex: number

    constructor (id: number, tile: Pixels) {
      this.id = id
      this.tile = tile
      this.lastIndex = tile.length - 1
    }

    static fromRaw (tile: string) {
      const t = tile.split('\n')
      return new Tile(
        Number(regExtract(t[0], /Tile (\d+):/)[1]),
        t.slice(1).map(row => row.split('')),
      )
    }

    flip (): Tile {
      return new Tile(
        this.id,
        [...this.tile].reverse(),
      )
    }

    rotate () {
      return new Tile(
        this.id,
        rotate90(this.tile),
      )
    }

    borders (): Array<string> {
      const top = this.tile[0]
      const bottom = this.tile[this.lastIndex]
      const left = Array.from(this.tile.keys()).map(x => this.tile[x][0])
      const right = Array.from(this.tile.keys()).map(x => this.tile[x][this.lastIndex])

      return [
        top,
        right,
        bottom,
        left,
      ].map(b => b.join(''))
    }

    possibleEdges (): Array<string> {
      return this.borders().flatMap(edge => [edge, reverseString(edge)])
    }

    bordersWithOffsets (): Array<[[number, number], string]> {
      return zip([[0, 1], [0, -1], [1, 0], [0, 1]], this.borders())
    }

    image (): Pixels {
      return this.tile
        .slice(1, this.tile.length - 2)
        .map(row => row.slice(1, row.length - 2))
    }
}

function countEdges (tiles: Array<Tile>): Map<string, number> {
  return count(tiles.flatMap(tile => tile.possibleEdges()))
}

function findCorners (tiles: Array<Tile>) {
  // every edge is unique, so any unpaired edge must be on the edge of the puzzle
  const edgeCounts = countEdges(tiles)

  // a tile with two unpaired edges must be a corner
  return tiles
    .filter(tile => {
      const edgeCountsForTile = count(
        tile.borders()
          .map(edge => edgeCounts.get(edge) || -1),
      )
      return edgeCountsForTile.get(1) === 2 && edgeCountsForTile.get(2) === 2
    })
}

function part1 (tiles: Array<Tile>): number {
  return findCorners(tiles).map(tile => tile.id).reduce(mulReducer)
}

function assembleTiles (tiles: Array<Tile>) : Array<Array<Tile>> {
  const remainingTiles = new Set(tiles)
  const edgeCounts = countEdges(tiles)

  const sideLength = Math.sqrt(tiles.length)
  const assembled = Array(sideLength)
    .fill(undefined)
    .map(_ => Array(sideLength).fill(undefined))

  // place a corner tile
  let topLeftCorner = findCorners(tiles)[0]
  // find orientation
  while (!arrayEqual(topLeftCorner.borders().map(edge => edgeCounts.get(edge)), [1, 2, 2, 1])) {
    topLeftCorner = topLeftCorner.rotate() // no need to flip - this sets the flippiness of the whole puzzle
  }
  assembled[0][0] = topLeftCorner
  remainingTiles.delete(topLeftCorner)

  console.log(assembled)
  console.log(remainingTiles.size)

  return assembled
}

function part2 (tiles: Array<Tile>): number {
  const assembled = assembleTiles(tiles)
  console.log(assembled.map(row => row.map(tile => tile.id)))

  return 0
}

const tiles = readFile('data/day_20.txt').split('\n\n').map(t => Tile.fromRaw(t))

printSolution(20, 1, part1(tiles))
printSolution(20, 2, part2(tiles))
