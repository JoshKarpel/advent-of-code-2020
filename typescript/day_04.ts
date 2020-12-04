import { regExtract } from './util'
import util = require('./util');

const NEEDED = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

function part1 (foo: Array<Map<string, string>>): number {
  return foo.filter(f => {
    return NEEDED.every(n => {
      return f.has(n)
    })
  }).length
}

function part2 (foo: Array<Map<string, string>>): number {
  return foo.filter(f => {
    return NEEDED.every(n => {
      return f.has(n)
    })
  }).filter(m => { // @ts-ignore
    console.log()
    return Array.from(m.entries()).every(([k, v]) => {
      let rv: boolean = false
      try {
        console.log(k, v)
        if (k === 'cid') {
          rv = true
        } else if (k === 'byr') {
          const n = Number(regExtract(v, /^(\d{4})$/)[1])
          rv = n >= 1920 && n <= 2002
        } else if (k === 'iyr') {
          const n = Number(regExtract(v, /^(\d{4})$/)[1])
          rv = n >= 2010 && n <= 2020
        } else if (k === 'eyr') {
          const n = Number(regExtract(v, /^(\d{4})$/)[1])
          rv = n >= 2020 && n <= 2030
        } else if (k === 'hgt') {
          const match = regExtract(v, /^(\d+)(cm|in)$/)
          const n = Number(match[1])
          if (match[2] === 'cm') {
            rv = n >= 150 && n <= 193
          } else {
            rv = n >= 59 && n <= 76
          }
        } else if (k === 'hcl') {
          regExtract(v, /^#[0-9a-f]{6}$/)
          rv = true
        } else if (k === 'ecl') {
          regExtract(v, /^(amb|blu|brn|gry|grn|hzl|oth)$/)
          rv = true
        } else if (k === 'pid') {
          regExtract(v, /^\d{9}$/)
          rv = true
        }
      } catch {
        rv = false
      }
      console.log(rv)
      return rv
    })
  }
  ).length
}

const foo = util.readFile('data/day_04.txt')
  .split('\n\n')
  .map(l => l.split(/\s+/))
  .map(l => new Map(l.map(x => x.split(':') as [string, string])))

util.printSolution(4, 1, part1(foo))
util.printSolution(4, 2, part2(foo))
