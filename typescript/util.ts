import fs = require('fs');

export function printSolution (day: number, part: number, solution: number): void {
  console.log(`Day ${day}, Part ${part} => ${solution}`)
}

export function readFileLines (path: string): ReadonlyArray<string> {
  return fs.readFileSync(path, 'utf8').trimEnd().split('\n')
}
