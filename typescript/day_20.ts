import { count, flipTopBottom, mulReducer, printSolution, readFile, regExtract, reverseString, rotate90 } from './util'

type Pixels = Array<Array<string>>

class Image {
    readonly id: number
    readonly pixels: Pixels
    readonly sideLength: number

    constructor (id: number, tile: Pixels) {
      this.id = id
      this.pixels = tile
      this.sideLength = tile.length
    }

    static fromRaw (tile: string) {
      const t = tile.split('\n')
      return new Image(
        Number(regExtract(t[0], /Tile (\d+):/)[1]),
        t.slice(1).map(row => row.split('')),
      )
    }

    static combine (grid: Array<Array<Image>>): Image {
      const innerSideLength = grid[0][0].sideLength
      const gridSideLength = grid.length * innerSideLength
      console.log(innerSideLength, gridSideLength)
      const pixels = Array(gridSideLength)
        .fill(null)
        .map(_ => Array(gridSideLength))
      console.log(pixels)
      for (const [gridY, row] of grid.entries()) {
        for (const [gridX, tile] of row.entries()) {
          for (const [tileY, tileRow] of tile.pixels.entries()) {
            for (const [tileX, pixel] of tileRow.entries()) {
              const y = (gridY * innerSideLength) + tileY
              const x = (gridX * innerSideLength) + tileX
              console.log(y, x)
              pixels[y][x] = pixel
            }
          }
        }
      }
      return new Image(
        0,
        pixels,
      )
    }

    flip (): Image {
      return new Image(this.id, flipTopBottom(this.pixels))
    }

    rotate () {
      return new Image(this.id, rotate90(this.pixels))
    }

    borders (): Array<string> {
      return [this.top(), this.right(), this.bottom(), this.left()]
    }

    left () {
      return Array.from(this.pixels.keys()).map(x => this.pixels[x][0]).join('')
    }

    bottom () {
      return this.pixels[this.sideLength - 1].join('')
    }

    top () {
      return this.pixels[0].join('')
    }

    right () {
      return Array.from(this.pixels.keys()).map(x => this.pixels[x][this.sideLength - 1]).join('')
    }

    possibleEdges (): Array<string> {
      return this.borders().flatMap(edge => [edge, reverseString(edge)])
    }

    orientations (): Array<Image> {
      return [
        this,
        this.rotate(),
        this.rotate().rotate(),
        this.rotate().rotate().rotate(),
        this.flip(),
        this.flip().rotate(),
        this.flip().rotate().rotate(),
        this.flip().rotate().rotate().rotate(),
      ]
    }

    withoutBorder (): Image {
      return new Image(
        this.id,
        this.pixels
          .slice(1, this.sideLength - 1)
          .map(row => row.slice(1, this.sideLength - 1)),
      )
    }

    format (): string {
      return this.pixels.map(row => row.join('')).join('\n')
    }
}

function countEdges (tiles: Array<Image>): Map<string, number> {
  return count(tiles.flatMap(tile => tile.possibleEdges()))
}

function findCorners (tiles: Array<Image>) {
  // every edge is unique, so any unpaired edge must be on the edge of the puzzle
  const edgeCounts = countEdges(tiles)

  // a tile with two unpaired edges must be a corner
  return tiles
    .filter(tile => {
      const edgeCountsForTile = count(tile.borders().map(edge => edgeCounts.get(edge) || -1))
      return edgeCountsForTile.get(1) === 2 && edgeCountsForTile.get(2) === 2
    })
}

function part1 (tiles: Array<Image>): number {
  return findCorners(tiles).map(tile => tile.id).reduce(mulReducer)
}

function assembleTiles (tiles: Array<Image>): Array<Array<Image>> {
  const remainingTiles = new Set(tiles)
  const edgeCounts = countEdges(tiles)

  const gridSideLength = Math.sqrt(tiles.length)
  const assembled = Array(gridSideLength)
    .fill(undefined)
    .map(_ => Array(gridSideLength).fill(undefined))

  let referenceTile: Image = tiles[0]

  for (const [rowIdx, row] of assembled.entries()) {
    for (const colIdx of row.keys()) {
      let nextTile
      let nextTileOriented
      if (rowIdx === 0 && colIdx === 0) {
        nextTile = findCorners(tiles)[0]
        nextTileOriented = nextTile.orientations().find(
          tile => edgeCounts.get(tile.top()) === 1 && edgeCounts.get(tile.left()) === 1,
        )
        if (nextTileOriented === undefined) {
          throw new Error('could not figure out orientation of top left corner')
        }
      } else if (colIdx === 0) {
        referenceTile = assembled[rowIdx - 1][colIdx]
        const referenceEdge = referenceTile.bottom()
        nextTile = Array.from(remainingTiles).find(tile => new Set(tile.possibleEdges()).has(referenceEdge))
        if (nextTile === undefined) {
          throw new Error('could not figure out next tile (row start)')
        }
        nextTileOriented = nextTile.orientations().find(tile => tile.top() === referenceEdge)
        if (nextTileOriented === undefined) {
          throw new Error('could not orient next tile (row start)')
        }
      } else {
        const referenceEdge = referenceTile.right()
        nextTile = Array.from(remainingTiles).find(tile => new Set(tile.possibleEdges()).has(referenceEdge))
        if (nextTile === undefined) {
          throw new Error('could not figure out next tile')
        }
        nextTileOriented = nextTile.orientations().find(tile => tile.left() === referenceEdge)
        if (nextTileOriented === undefined) {
          throw new Error('could not orient next tile')
        }
      }

      row[colIdx] = nextTileOriented
      remainingTiles.delete(nextTile)
      referenceTile = nextTileOriented
    }
  }

  return assembled
}

function part2 (tiles: Array<Image>): number {
  const assembled = assembleTiles(tiles)

  console.log(assembled.map(row => row.map(tile => tile.id).join(' ')).join('\n'))

  const withoutBorders = assembled.map(row => row.map(image => image.withoutBorder()))
  const image = Image.combine(withoutBorders)

  console.log(image.format())
  console.log()
  console.log(image.rotate().flip().rotate().rotate().format())

  return 0
}

const tiles = readFile('data/day_20.txt').split('\n\n').map(t => Image.fromRaw(t))

printSolution(20, 1, part1(tiles))
printSolution(20, 2, part2(tiles))
