import util = require('./util');

function part1 (map: ReadonlyArray<string>): number {
  let x = 0
  let count = 0
  for (const row of map) {
    if (row.charAt(x % row.length) === '#') {
      count += 1
    }
    x += 3
  }
  return count
}

function part2 (map: ReadonlyArray<string>): number {
  const counts = []
  for (const inc of [1, 3, 5, 7]) {
    let x = 0
    let count = 0
    for (const row of map) {
      if (row.charAt(x % row.length) === '#') {
        count += 1
      }
      x += inc
    }
    counts.push(count)
  }

  let x = 0
  let count = 0
  for (const [idx, row] of map.entries()) {
    if ((idx + 1) % 2 === 0) { continue }
    if (row.charAt(x % row.length) === '#') {
      count += 1
    }
    x += 1
  }
  counts.push(count)

  console.log(counts)

  return counts.reduce((acc, curr) => acc * curr)
}

const map = util.readFileLines('data/day_03.txt')

util.printSolution(3, 1, part1(map))
util.printSolution(3, 2, part2(map))
