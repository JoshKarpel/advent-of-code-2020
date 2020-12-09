import { HGC, Instruction, Instructions } from './hgc'
import { printSolution } from './util'

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
