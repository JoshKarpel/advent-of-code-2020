import { printSolution, readFile, regExtract, reverseString } from './util'

function range (length: number) : Array<number> {
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

  borders () : Array<Array<string>> {
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
  // console.log(tiles)
  for (const tile of tiles) {
    console.log(tile)
    console.log(tile.borders())
    console.log()
  }

  return 0
}

// I only have to find the border tiles (really just the corners)
// are the tile edges uniquely paired up?
// if there are exactly an odd number of some edge, one of those tiles must appear on the edge
// once you know all the odds you know all the edges
// recur on the border (throw it out and find corners then build across again)

const tiles = readFile('data/day_20.txt').split('\n\n').map(t => new Tile(t.split('\n')))

printSolution(20, 1, part1(tiles))
