import fs = require('fs');

export function printSolution (day: number, part: number, solution: number) {
  console.log(`Day ${day}, Part ${part} => ${solution}`)
}

export function readFileLines (path: string): string[] {
  return fs.readFileSync(path, 'utf8').trimEnd().split('\n')
}
