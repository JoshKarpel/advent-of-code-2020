import { printSolution, rotateLeft, rotateRight } from './util'

function move (cups: Array<number>): Array<number> {
  cups = [...cups]

  const pickedUp = cups.slice(1, 4)
  cups.splice(1, 3)

  const remainingCups = new Set(cups)

  let destinationCupLabel = cups[0] - 1
  while (!remainingCups.has(destinationCupLabel)) {
    destinationCupLabel -= 1
    if (destinationCupLabel < Math.min(...remainingCups)) {
      destinationCupLabel = Math.max(...remainingCups)
      break
    }
  }

  const destinationCupIdx = cups.findIndex(cup => cup === destinationCupLabel)
  cups = rotateLeft(cups, destinationCupIdx)
  cups.splice(1, 0, ...pickedUp)
  cups = rotateRight(cups, destinationCupIdx - 1) // shift current index one cw

  return cups
}

function moves (cups: Array<number>, moves: number): Array<number> {
  for (let m = 0; m < moves; m += 1) {
    cups = move(cups)
  }
  return cups
}

function part1 (cups: Array<number>, turns: number): string {
  const cupsAfter = moves(cups, turns)

  return rotateLeft(cupsAfter, cupsAfter.findIndex(cup => cup === 1))
    .slice(1)
    .join('')
}

const cups = '952438716'.split('').map(Number)

printSolution(23, 1, part1(cups, 100))
