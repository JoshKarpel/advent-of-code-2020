import { difference, printSolution, readFile } from './util'

const FIELD_VALIDATORS = new Map([
  ['cid', /.*/],
  ['byr', /^(19[2-9]\d|200[0-2])$/],
  ['iyr', /^201\d|2020$/],
  ['eyr', /^202\d|2030$/],
  ['hgt', /^(1([5-8]\d|9[0-3])cm|(59|6\d|7[0-6])in)$/],
  ['hcl', /^#[0-9a-f]{6}$/],
  ['ecl', /^(amb|blu|brn|gry|grn|hzl|oth)$/],
  ['pid', /^\d{9}$/],
])
const REQUIRED_FIELDS = Array.from(difference(FIELD_VALIDATORS.keys(), ['cid']))

type Passport = Map<string, string>

function hasRequiredFields (passport: Passport): boolean {
  return REQUIRED_FIELDS.every(field => passport.has(field))
}

function hasValidValues (passport: Passport): boolean {
  return Array.from(passport.entries())
    .every(([field, value]) => {
      const validator = FIELD_VALIDATORS.get(field)
      if (validator === undefined) {
        throw new Error('bad field')
      }
      return value.match(validator) !== null
    })
}

function part1 (passports: Array<Passport>): number {
  return passports.filter(hasRequiredFields).length
}

function part2 (passports: Array<Passport>): number {
  return passports.filter(hasRequiredFields).filter(hasValidValues).length
}

const passports: Array<Passport> = readFile('data/day_04.txt')
  .split('\n\n')
  .map(line => line.split(/\s+/))
  .map(line => new Map(line.map(entry => entry.split(':') as [string, string])))

printSolution(4, 1, part1(passports))
printSolution(4, 2, part2(passports))
