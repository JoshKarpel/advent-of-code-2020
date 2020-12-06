import fs = require('fs');

export function printSolution (day: number, part: number, solution: number | null): void {
  console.log(`Day ${String(day).padStart(2, '0')}, Part ${part} => ${solution}`)
}

export function readFile (path: string): string {
  return fs.readFileSync(path, 'utf8').trimEnd()
}

export function * combinations<T> (arr: Array<T>, k: number) : Generator<Array<T>> {
  for (const [idx, elem] of arr.entries()) {
    if (k === 1) {
      yield [elem]
    } else {
      for (const next of combinations(arr.slice(idx + 1), k - 1)) {
        yield [elem].concat(next)
      }
    }
  }
}

export function regExtract (str: string, re: RegExp): RegExpMatchArray {
  const match = re.exec(str)
  if (match === null) {
    throw new Error(`failed match on: ${str}`)
  } else {
    return match
  }
}

export function union<T> (a: Iterable<T>, b: Iterable<T>): Set<T> {
  return new Set([...a, ...b])
}

export function intersection<T> (a: Iterable<T>, b: Iterable<T>): Set<T> {
  const bSet = new Set(Array.from(b))
  return new Set(Array.from(a).filter(x => bSet.has(x)))
}

export function difference<T> (a: Iterable<T>, b: Iterable<T>): Set<T> {
  const bSet = new Set(Array.from(b))
  return new Set(Array.from(a).filter(x => !bSet.has(x)))
}
