import util = require('./util');

const REQUIRED = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
const FIELDS = new Map([
  ['cid', /.*/],
  ['byr', /^(19[2-9]\d|200[0-2])$/],
  ['iyr', /^201\d|2020$/],
  ['eyr', /^202\d|2030$/],
  ['hgt', /^(1([5-8]\d|9[0-3])cm|(59|6\d|7[0-6])in)$/],
  ['hcl', /^#[0-9a-f]{6}$/],
  ['ecl', /^(amb|blu|brn|gry|grn|hzl|oth)$/],
  ['pid', /^\d{9}$/],
])

type Passport = Map<string, string>

function hasRequiredFields (passport: Passport): boolean {
  return REQUIRED.every(field => passport.has(field))
}

function validValues (passport: Passport): boolean {
  return Array.from(passport.entries()).every(([k, v]) => {
    const regex = FIELDS.get(k)
    if (regex === undefined) {
      throw new Error('bad field')
    }
    return regex.exec(v) !== null
  })
}

function part1 (foo: Array<Passport>): number {
  return foo.filter(hasRequiredFields).length
}

function part2 (foo: Array<Passport>): number {
  return foo.filter(hasRequiredFields).filter(validValues).length
}

const passports: Array<Passport> = util.readFile('data/day_04.txt')
  .split('\n\n')
  .map(l => l.split(/\s+/))
  .map(l => new Map(l.map(x => x.split(':') as [string, string])))

util.printSolution(4, 1, part1(passports))
util.printSolution(4, 2, part2(passports))
