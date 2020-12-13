import { mod, printSolution, readFile } from './util'

function part1 (earliest: number, ids: Array<number>): number {
  let wait = 0
  while (true) {
    for (const id of ids) {
      if ((wait + earliest) % id === 0) {
        return wait * id
      }
    }
    wait += 1
  }
}

function part2 (ids: Array<string>): number {
  const withIdx: Array<[number, number]> = Array.from(ids.entries())
    .filter(([_idx, id]) => id !== 'x')
    .map(([idx, id]) => [idx, Number(id)])

  const justIds = withIdx.map(([_idx, id]) => id)

  const divisorsAndRemainders = withIdx
    .map(([idx, id]) => [id, mod(id - idx, id)])

  let t = justIds[0]
  let inc = justIds[0]
  for (const [div, rem] of divisorsAndRemainders.slice(1)) {
    while (mod(t, div) !== rem) {
      t += inc
    }
    inc *= div
  }

  return t
}

const [rawEarliest, rawIds] = readFile('data/day_13.txt').split('\n')
const earliest = Number(rawEarliest)
const ids = rawIds.split(',').filter(id => id !== 'x').map(Number)

printSolution(13, 1, part1(earliest, ids))
printSolution(13, 2, part2(rawIds.split(',')))
