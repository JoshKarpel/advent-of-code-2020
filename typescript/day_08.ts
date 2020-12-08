import util = require('./util');

type Instruction = [string, number]

function run (instructions: Array<Instruction>) : [number, boolean] {
  let acc = 0
  let pointer = 0

  const seen = new Set()

  while (true) {
    const terminated = pointer === instructions.length
    if (seen.has(pointer) || terminated) {
      return [acc, terminated]
    }
    seen.add(pointer)

    const [instr, arg] = instructions[pointer] || ['noop', 0]

    if (instr === 'acc') {
      acc += arg
    } else if (instr === 'jmp') {
      pointer += arg - 1
    }

    pointer += 1
  }
}

function part1 (instructions: Array<Instruction>): number {
  const [acc] = run(instructions)
  return acc
}

function part2 (instructions: Array<Instruction>): number {
  for (const [idx, [instr, num]] of instructions.entries()) {
    const fixed = [...instructions]
    if (instr === 'jmp') {
      fixed[idx] = ['nop', num]
    }
    const [acc, terminated] = run(fixed)
    console.log(acc, terminated)
    if (terminated) {
      return acc
    }
  }
  return 0
}

const instructions: Array<Instruction> = util.readFile('data/day_08.txt')
  .split('\n')
  .map(line => {
    const [instr, num] = line.split(' ')

    return [instr as string, Number(num) as number]
  })

util.printSolution(8, 1, part1(instructions))
util.printSolution(8, 2, part2(instructions))
