import { printSolution, readFile } from './util'

export type Operation = 'acc' | 'jmp' | 'nop'
export type Instruction = { operation: Operation, argument: number }
export type Instructions = Array<Instruction>

export class HGC {
  instructions: Instructions
  pointer: number
  accumulator: number
  terminated: boolean
  parent: HGC | null
  seen: Set<number>

  constructor (
    instructions: Instructions,
    pointer: number = 0,
    accumulator: number = 0,
    terminated: boolean = false,
    seen: Set<number> = new Set(),
    parent: HGC | null = null,
  ) {
    this.instructions = [...instructions]

    this.pointer = pointer
    this.accumulator = accumulator
    this.terminated = terminated
    this.seen = new Set([...seen])

    this.parent = parent
  }

  static fromFile (path: string): HGC {
    return new HGC(HGC.instructionsFromFile(path))
  }

  static instructionsFromFile (path: string): Instructions {
    return readFile(path)
      .split('\n')
      .map(line => {
        const [op, arg] = line.split(' ')
        return { operation: op as Operation, argument: Number(arg) as number }
      })
  }

  copy () {
    return new HGC(
      this.instructions,
      this.pointer,
      this.accumulator,
      this.terminated,
      this.seen,
      this.parent,
    )
  }

  child () {
    return new HGC(
      this.instructions,
      this.pointer,
      this.accumulator,
      this.terminated,
      this.seen,
      this,
    )
  }

  currentInstruction (): Instruction {
    return this.instructions[this.pointer]
  }

  step (n: number = 1): HGC {
    let hgc: HGC = this

    for (let i = 0; i < n; i += 1) {
      hgc = hgc.stepOnce()
    }

    return hgc
  }

  rewind (n: number = 1): HGC {
    let hgc: HGC = this

    for (let i = 0; i < n; i += 1) {
      if (hgc.parent === null) {
        throw new Error('no parent')
      }
      hgc = hgc.parent
    }

    return hgc.copy()
  }

  terminate (): HGC {
    let hgc: HGC = this

    while (!hgc.terminated) {
      hgc = hgc.step()
    }

    return hgc
  }

  private stepOnce (): HGC {
    const hgc: HGC = this.child()

    hgc.seen.add(this.pointer)
    hgc.terminated = hgc.pointer === hgc.instructions.length

    if (hgc.terminated) {
      return hgc
    }

    const { operation, argument } = hgc.currentInstruction()
    switch (operation) {
      case 'acc': {
        hgc.accumulator += argument
        hgc.pointer += 1
        break
      }
      case 'jmp' : {
        hgc.pointer += argument
        break
      }
      case 'nop' : {
        hgc.pointer += 1
        break
      }
    }

    return hgc
  }
}

function runUntilLoop (hgc: HGC): HGC {
  while (!hgc.seen.has(hgc.pointer)) {
    hgc.seen.add(hgc.pointer)
    hgc = hgc.step()
  }
  return hgc
}

function part1 (instructions: Array<Instruction>): number {
  const hgc = new HGC(instructions)
  return runUntilLoop(hgc).accumulator
}

function part2 (instructions: Array<Instruction>): number | null {
  for (const [idx, instruction] of instructions.entries()) {
    const fixed = [...instructions]

    if (instruction.operation === 'jmp') {
      fixed[idx] = { operation: 'nop', argument: instruction.argument }
    } else if (instruction.operation === 'nop') {
      fixed[idx] = { operation: 'jmp', argument: instruction.argument }
    }

    const hgc = runUntilLoop(new HGC(fixed))
    if (hgc.terminated) {
      return hgc.accumulator
    }
  }

  return null
}

const instructions: Instructions = HGC.instructionsFromFile('data/day_08.txt')

printSolution(8, 1, part1(instructions))
printSolution(8, 2, part2(instructions))
