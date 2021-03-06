import fs = require('fs');

export function printSolution (day: number, part: number, solution: number | string | null): void {
  console.log(`Day ${String(day).padStart(2, '0')}, Part ${part} => ${solution}`)
}

export function readFile (path: string): string {
  return fs.readFileSync(path, 'utf8').trimEnd()
}

export function * combinations<T> (arr: Array<T>, k: number): Generator<Array<T>> {
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

export function * permutations<T> (arr: Array<T>, k: number): Generator<Array<T>> {
  if (k === 1) {
    for (const elem of arr) {
      yield [elem]
    }
  } else {
    for (const next of permutations(arr, k - 1)) {
      for (const elem of arr) {
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

export function sumReducer (accumulator: number, current: number): number {
  return accumulator + current
}

export function mulReducer (accumulator: number, current: number): number {
  return accumulator * current
}

export function maxReducer (a: number, b: number): number {
  return Math.max(a, b)
}

export function minReducer (a: number, b: number): number {
  return Math.min(a, b)
}

export function prefixSum (arr: Array<number>): Array<number> {
  return arr.reduce((acc: Array<number>, curr: number) => acc.concat([acc[acc.length - 1] + curr]), [0]).slice(1)
}

export function count<T> (arr: Array<T>): Map<T, number> {
  const counter = new Map()
  for (const x of arr) {
    counter.set(x, (counter.get(x) || 0) + 1)
  }
  return counter
}

export function compareNumbers (a: number, b: number) {
  return a - b
}

export function mod (n: number, m: number): number {
  return ((n % m) + m) % m
}

export function zip<A, B> (a: Array<A>, b: Array<B>): Array<[A, B]> {
  return Array.from(a.entries()).map(([idx, elem]) => [elem, b[idx]])
}

// https://en.wikipedia.org/wiki/Chinese_remainder_theorem#Search_by_sieving
export function chineseRemainderSieve (divisorsAndRemainders: Array<[number, number]>): number {
  let [increment, x] = divisorsAndRemainders[0]

  for (const [divisor, remainder] of divisorsAndRemainders.slice(1)) {
    while (mod(x, divisor) !== remainder) {
      x += increment
    }
    increment *= divisor
  }

  return x
}

export function rotateLeft<T> (arr: Array<T>, n: number) {
  arr = [...arr]
  if (arr.length === 0) {
    return arr
  } else {
    n = n % arr.length
    arr = arr.slice(n).concat(arr.slice(0, n))
  }
  return arr
}

export function rotateRight<T> (arr: Array<T>, n: number) {
  arr = [...arr]
  if (arr.length === 0) {
    return arr
  } else {
    n = n % arr.length
    arr = arr.slice(arr.length - n, arr.length).concat(arr.slice(0, arr.length - n))
  }
  return arr
}

export function copyMap<K, V> (map: Map<K, V>): Map<K, V> {
  const newMap = new Map()
  for (const [k, v] of map.entries()) {
    newMap.set(k, v)
  }
  return newMap
}

export function copySet<T> (set: Set<T>): Set<T> {
  return new Set([...set])
}

export function reverseString (str: string): string {
  return str.split('').reverse().join('')
}

export function rotate90<T> (arr: Array<Array<T>>): Array<Array<T>> {
  const w = arr.length
  const h = arr[0].length
  const b = new Array(h)
  for (let y = 0; y < h; y++) {
    b[y] = new Array(w)
    for (let x = 0; x < w; x++) {
      b[y][x] = arr[w - 1 - x][y]
    }
  }
  return b
}

export function flipTopBottom<T> (arr: Array<Array<T>>): Array<Array<T>> {
  return [...arr].reverse()
}

export function range (start: number, stop: number): Array<number> {
  return Array.from(Array(stop - start).keys()).map(x => x + start)
}
