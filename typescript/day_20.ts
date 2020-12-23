import { mulReducer, printSolution, readFile, regExtract, zip } from './util'

function range (length: number): Array<number> {
  return Array.from(Array(length).keys())
}

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

    flipTB (): Tile {
      return new Tile(
        this.id,
        [...this.tile].reverse(),
      )
    }

    flipLR (): Tile {
      return new Tile(
        this.id,
        this.tile.map(row => [...row].reverse()),
      )
    }

    rot () {
      return new Tile(
        this.id,
        this.tile[0].map((_, columnIdx) => this.tile.map(row => row[columnIdx])),
      )
    }

    borders (): Array<string> {
      const top = this.tile[0]
      const bottom = this.tile[this.lastIndex - 1]
      const left = range(this.lastIndex).map(x => this.tile[x][0])
      const right = range(this.lastIndex).map(x => this.tile[x][this.lastIndex - 1])

      return [top, bottom, left, right].map(b => b.join(''))
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

function assemble (tiles: Array<Tile>) : Array<Array<Tile>> {
  tiles = [...tiles]
  const assembledTiles: Array<Array<Tile>> = Array.from(Array(tiles.length).keys()).map(_ => Array(tiles.length))
  assembledTiles[5][5] = tiles[0]

  for (const tile of tiles.slice(1)) {
    placeTile(assembledTiles, tile)
  }

  console.log(assembledTiles.map(row => row.map(tile => tile.id)))

  return assembledTiles
}

function placeTile (assembledTiles: Array<Array<Tile>>, tile: Tile) {
  for (const [y, row] of assembledTiles.entries()) {
    for (const [x, placedTile] of row.entries()) {
      if (placedTile === undefined) {
        continue
      }
      for (const [[xOffset, yOffset], edge] of placedTile.bordersWithOffsets()) {
        const matchingTile = findMatchingOrientation(edge, tile)
        if (matchingTile !== undefined) {
          assembledTiles[y + yOffset][x + xOffset] = matchingTile
          console.log('Placed', matchingTile.id, 'at', x + xOffset, y + yOffset)
          return
        }
      }
    }
  }
}

function findMatchingOrientation (edge: string, tile: Tile): Tile | undefined {
  for (const orientation of [tile, tile.flipTB(), tile.flipLR(), tile.flipTB().flipLR(), tile.rot(), tile.rot().flipLR(), tile.rot().flipTB()]) {
    if (orientation.borders().some(e => e === edge)) {
      return orientation
    }
  }

  return undefined
}

function part1 (tiles: Array<Tile>): number {
  const assembled = assemble(tiles)

  const n = assembled.length - 1
  const cornerTiles = [
    assembled[0][0],
    assembled[0][n],
    assembled[n][0],
    assembled[n][n],
  ]

  return cornerTiles.map(tile => tile.id).reduce(mulReducer)
}

// I only have to find the border tiles (really just the corners)
// are the tile edges uniquely paired up?
// if there are exactly an odd number of some edge, one of those tiles must appear on the edge
// once you know all the odds you know all the edges
// recur on the border (throw it out and find corners then build across again)

const tiles = readFile('data/day_20.txt').split('\n\n').map(t => Tile.fromRaw(t))

printSolution(20, 1, part1(tiles))
