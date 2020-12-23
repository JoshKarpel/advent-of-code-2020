import { count, mulReducer, printSolution, readFile, regExtract, reverseString } from './util'

function range (length: number): Array<number> {
  return Array.from(Array(length).keys())
}

class Tile {
    readonly id: number
    readonly tile: Array<string>
    readonly n: number

    constructor (tiles: Array<string>) {
      this.id = Number(regExtract(tiles[0], /Tile (\d+):/)[1])
      this.tile = tiles.slice(1)
      this.n = tiles.length - 1
    }

    borders (): Array<Array<string>> {
      const top = this.tile[0]
      const bottom = this.tile[this.n - 1]
      const left = range(this.n).map(x => this.tile[x][0]).join('')
      const right = range(this.n).map(x => this.tile[x][this.n - 1]).join('')
      const base = [top, bottom, left, right]
      const flipTB = [top, bottom, reverseString(left), reverseString(right)]
      const flipLR = [reverseString(top), reverseString(bottom), left, right]
      const flipBoth = [reverseString(top), reverseString(bottom), reverseString(left), reverseString(right)]

      return [base, flipTB, flipLR, flipBoth]
    }
}

function part1 (tiles: Array<Tile>): number {
  console.log(tiles.length)

  // for (const tile of tiles) {
  //   console.log(tile)
  //   console.log(tile.borders())
  //   console.log()
  // }

  const cornerTiles: Array<[number, Tile]> = []
  for (const tile of tiles) {
    const allOtherEdges = count(
      tiles
        .filter(t => t.id !== tile.id)
        .flatMap(tile => Array.from(new Set(tile.borders().flat()))),
    )
    // console.log(allOtherEdges)
    for (const [idx, orientation] of tile.borders().entries()) {
      // console.log(orientation)
      const c: Map<number, number> = count(Array.from(orientation.map(e => allOtherEdges.get(e) || 0).values()))
      // console.log('c', c)
      if (c.get(0) === 2 && c.get(1) === 2) {
        cornerTiles.push([idx, tile])
      }
    }
  }

  console.log(cornerTiles)
  const cornerTileIds = new Set(cornerTiles.map(([, tile]) => tile.id))
  const cornerTiles2 = tiles.filter(tile => cornerTileIds.has(tile.id))

  console.log(cornerTiles2)
  console.log(cornerTiles2.length)

  return cornerTiles2.map(tile => tile.id).reduce(mulReducer)
}

// I only have to find the border tiles (really just the corners)
// are the tile edges uniquely paired up?
// if there are exactly an odd number of some edge, one of those tiles must appear on the edge
// once you know all the odds you know all the edges
// recur on the border (throw it out and find corners then build across again)

const tiles = readFile('data/day_20.txt').split('\n\n').map(t => new Tile(t.split('\n')))

printSolution(20, 1, part1(tiles))
