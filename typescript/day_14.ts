import { printSolution, readFile, regExtract, sumReducer } from './util'

type SetMemory = {
    address: number,
    value: number
}

type Mask = Map<number, string>

function part1 (instructions: Array<Mask | SetMemory>): number {
  const memory = new Map()
  let mask = new Map()

  for (const instruction of instructions) {
    if (instruction instanceof Map) {
      mask = instruction
    } else {
      const { address, value } = instruction
      const bitArray = Array.from(value.toString(2)).reverse()
      const filledBitArray = bitArray.concat(Array(36 - bitArray.length).fill(0)).reverse()
      for (const [k, v] of mask) {
        if (v !== 'X') {
          filledBitArray[k] = v
        }
      }
      const maskedValueString = filledBitArray.join('')
      const maskedValue = parseInt(maskedValueString, 2)
      memory.set(address, maskedValue)
    }
  }

  return Array.from(memory.values()).reduce(sumReducer)
}

function part2 (instructions: Array<Mask | SetMemory>): number {
  const memory = new Map()
  let mask = new Map()

  for (const instruction of instructions) {
    if (instruction instanceof Map) {
      mask = instruction
    } else {
      const { address, value } = instruction
      const bitArray = Array.from(address.toString(2)).reverse()
      const filledBitArray = bitArray.concat(Array(36 - bitArray.length).fill(0)).reverse()
      for (const [k, v] of mask) {
        if (v !== '0') {
          filledBitArray[k] = v
        }
      }
      const maskedValueString = filledBitArray.join('')

      const bits = Array.from(thingy(Array.from(maskedValueString).filter(c => c === 'X').length))

      for (const b of bits) {
        const thisAddressBitArray = [...filledBitArray]
        const foo = Array.from(mask.entries()).filter(([_k, v]) => v === 'X')
        for (const [idx, [k]] of Array.from(foo).entries()) {
          thisAddressBitArray[k] = b[idx]
        }
        const thisAddress = parseInt(thisAddressBitArray.join(''), 2)
        memory.set(thisAddress, value)
      }
    }
  }

  return Array.from(memory.values()).reduce(sumReducer)
}

function parseMask (mask: string): Mask {
  return new Map(Array.from(mask).entries())
}

function parseSet (set: string) : SetMemory {
  const match = regExtract(set, /mem\[(\d+)] = (\d+)/)
  return { address: Number(match[1]), value: Number(match[2]) }
}

function * thingy (length: number) : Generator<Array<string>> {
  if (length === 1) {
    yield ['0']
    yield ['1']
  } else {
    for (const t of thingy(length - 1)) {
      yield ['0'].concat(t)
      yield ['1'].concat(t)
    }
  }
}

const foo = readFile('data/day_14.txt').split('\n')
  .map(line => {
    if (line.slice(0, 2) === 'ma') {
      return parseMask(regExtract(line, /mask = (.*)/)[1])
    } else {
      return parseSet(line)
    }
  },
  )

printSolution(14, 1, part1(foo))
printSolution(14, 2, part2(foo))
