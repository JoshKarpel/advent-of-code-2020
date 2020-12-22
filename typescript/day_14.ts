import { permutations, printSolution, readFile, regExtract, sumReducer } from './util'

type Mask = Array<[number, string]>
type SetMemory = {
    address: number,
    value: number
}

const LENGTH = 36
const X = 'X'
const ZERO = '0'
const ONE = '1'
const BITS = [ZERO, ONE]

function part1 (instructions: Array<Mask | SetMemory>): number {
  const memory = new Map()
  let mask: Mask = []

  for (const instruction of instructions) {
    if (instruction instanceof Array) {
      mask = instruction
    } else {
      const { address, value } = instruction

      const bitArray = toBitArray(value, LENGTH)
      for (const [k, v] of mask.filter(([_k, v]) => v !== X)) {
        bitArray[k] = v
      }

      memory.set(address, toDecimal(bitArray))
    }
  }

  return Array.from(memory.values()).reduce(sumReducer)
}

function part2 (instructions: Array<Mask | SetMemory>): number {
  const memory = new Map()
  let mask: Mask = []

  for (const instruction of instructions) {
    if (instruction instanceof Array) {
      mask = instruction
    } else {
      const { address, value } = instruction

      const baseBitArray = toBitArray(address, LENGTH)
      for (const [k, v] of mask.filter(([_k, v]) => v !== ZERO)) {
        baseBitArray[k] = v
      }

      const numX = baseBitArray.filter(c => c === X).length
      for (const floatingBits of permutations(BITS, numX)) {
        const addressBitArray = [...baseBitArray]
        for (const [idx, [k]] of mask.filter(([_k, v]) => v === X).entries()) {
          addressBitArray[k] = floatingBits[idx]
        }

        memory.set(toDecimal(addressBitArray), value)
      }
    }
  }

  return Array.from(memory.values()).reduce(sumReducer)
}

function toBitArray (n: number, fill: number): Array<string> {
  const arr = n.toString(2).split('')
  return Array(fill - arr.length).fill(0).concat(arr)
}

function toDecimal (bits: Array<string>): number {
  return parseInt(bits.join(''), 2)
}

function parseMask (line: string): Mask {
  const match = regExtract(line, /mask = (.*)/)
  return Array.from(Array.from(match[1]).entries())
}

function parseSet (line: string): SetMemory {
  const match = regExtract(line, /mem\[(\d+)] = (\d+)/)
  return { address: Number(match[1]), value: Number(match[2]) }
}

function parseLine (line: string): Mask | SetMemory {
  if (line.slice(0, 2) === 'ma') {
    return parseMask(line)
  } else {
    return parseSet(line)
  }
}

const instructions = readFile('data/day_14.txt')
  .split('\n')
  .map(parseLine)

printSolution(14, 1, part1(instructions))
printSolution(14, 2, part2(instructions))
