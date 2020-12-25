import { count, mulReducer, printSolution, readFile, regExtract, reverseString, zip } from './util'

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
        this.tile[0].map((_, columnIdx) => this.tile.map(row => row[columnIdx])),
      )
    }

    borders (): Array<string> {
      const top = this.tile[0]
      const bottom = this.tile[this.lastIndex]
      const left = Array.from(this.tile.keys()).map(x => this.tile[x][0])
      const right = Array.from(this.tile.keys()).map(x => this.tile[x][this.lastIndex])

      return [top, bottom, left, right].map(b => b.join(''))
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

function findCorners (tiles: Array<Tile>) {
  // every edge is unique, so any unpaired edge must be on the edge of the puzzle
  const edgeCounts = count(
    tiles.flatMap(tile => tile.possibleEdges()),
  )

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

const tiles = readFile('data/day_20.txt').split('\n\n').map(t => Tile.fromRaw(t))

printSolution(20, 1, part1(tiles))
