import { chineseRemainderSieve, mod, printSolution, readFile } from './util'

function part1 (earliest: number, ids: Array<string>): number {
  const recurrenceTimes = ids.filter(id => id !== 'x').map(Number)

  let wait = 0
  while (true) {
    for (const time of recurrenceTimes) {
      if ((wait + earliest) % time === 0) {
        return wait * time
      }
    }
    wait += 1
  }
}

function part2 (ids: Array<string>): number {
  const divisorsAndRemainders: Array<[number, number]> = Array.from(ids.entries())
    .filter(([_idx, id]) => id !== 'x')
    .map(([idx, id]) => [idx, Number(id)])
    .map(([idx, id]) => [id, mod(id - idx, id)])

  return chineseRemainderSieve(divisorsAndRemainders)
}

const [rawEarliest, rawIds] = readFile('data/day_13.txt').split('\n')
const earliest = Number(rawEarliest)
const ids = rawIds.split(',')

printSolution(13, 1, part1(earliest, ids))
printSolution(13, 2, part2(ids))
