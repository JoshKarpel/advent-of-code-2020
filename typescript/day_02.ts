import util = require('./util');

interface Entry {
    first: number,
    second: number,
    letter: string,
    password: string
}

function part1 (entries: Array<Entry>): number {
  return entries.filter(entry => {
    const count = Array.from(entry.password).filter(char => char === entry.letter).length
    return entry.first <= count && count <= entry.second
  }).length
}

function part2 (entries: Array<Entry>): number {
  return entries.filter(entry => {
    const first = entry.password.charAt(entry.first - 1) === entry.letter
    const second = entry.password.charAt(entry.second - 1) === entry.letter
    return (first || second) && !(first && second)
  }).length
}

const entries = util.readFile('data/day_02.txt')
  .split('\n')
  .map(line => util.regExtract(line, /(\d+)-(\d+) (\w): (\w+)/))
  .map(match => {
    return {
      first: Number(match[1]),
      second: Number(match[2]),
      letter: String(match[3]),
      password: String(match[4]),
    }
  })

util.printSolution(2, 1, part1(entries))
util.printSolution(2, 2, part2(entries))
