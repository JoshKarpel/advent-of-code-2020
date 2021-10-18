import { maxReducer, minReducer, printSolution, range } from './util'

class Cup<T> {
  readonly value: T
  next: Cup<T> | null

  constructor (
    value: T,
    next: Cup<T> | null,
  ) {
    this.value = value
    this.next = next
  }

  static fromArray<T> (cups: Array<T>): Cup<T> {
    const first = new Cup(cups[0], null)
    let curr: Cup<T> = first
    for (const cup of cups.slice(1)) {
      const nextNode = new Cup(cup, null)
      curr.next = nextNode
      curr = nextNode
    }
    curr.next = first
    return first
  }

  walk<U> (callback: (cup: Cup<T>) => U): Array<U> {
    let node: Cup<T> = this
    const arr = [callback(node)]
    while (node.next !== this && node.next !== null) {
      node = node.next
      arr.push(callback(node))
    }
    return arr
  }

  toArray (): Array<T> {
    return this.walk(node => node.value)
  }

  forward (n: number) {
    let node: Cup<T> = this
    for (let i = 0; i < n; i += 1) {
      if (node.next === null) {
        console.log(node)
        throw new Error('woops, forward ref was null')
      }
      node = node.next
    }
    return node
  }

  findForward (value: T): Cup<T> | null {
    let node: Cup<T> | null = this
    while (node.value !== value) {
      node = node.next
      if (node === null || node === this) {
        return null
      }
    }
    return node
  }
}

function play (cups: Array<number>, moves: number): Cup<number> {
  let currentCup = Cup.fromArray(cups)

  // This is the key trick: by storing the cups as a linked list,
  // it is possible to jump to the position of the destination cup
  // *without searching the list*
  // by storing the nodes in a map of label -> node.
  const labelToCup = new Map(currentCup.walk(cup => [cup.value, cup]))

  const min = cups.reduce(minReducer)
  const max = cups.reduce(maxReducer)

  for (let m = 0; m < moves; m += 1) {
    const firstPickedUp = currentCup.forward(1)
    const lastPickedUp = firstPickedUp.forward(2)

    // snip picked up cups out
    currentCup.next = lastPickedUp.forward(1)
    lastPickedUp.next = null

    // find destination cup label
    const pickedUpLabels = new Set(firstPickedUp.toArray())
    let destinationLabel = currentCup.value - 1
    while (pickedUpLabels.has(destinationLabel) || destinationLabel < min) {
      destinationLabel -= 1
      if (destinationLabel < min) {
        destinationLabel = max
      }
    }

    // get destination cup
    const destinationCup = labelToCup.get(destinationLabel)
    if (destinationCup === undefined) {
      throw new Error(`Failed to find destination cup for label ${destinationLabel}`)
    }
    const afterDestinationCup = destinationCup.forward(1)

    // insert picked up cups
    destinationCup.next = firstPickedUp
    lastPickedUp.next = afterDestinationCup

    // advance current cup
    currentCup = currentCup.forward(1)
  }

  return currentCup
}

function part1 (cups: Array<number>, turns: number): string {
  const currentCup = play(cups, turns)

  const cupOne = currentCup.findForward(1)
  if (cupOne === null) {
    throw new Error('woops, cup 1 was null')
  }
  return cupOne.toArray().slice(1).join('')
}

function part2 (cups: Array<number>, turns: number): number {
  const currentCup = play(cups, turns)

  const cupOne = currentCup.findForward(1)
  if (cupOne === null) {
    throw new Error('woops, cup 1 was null')
  }

  return cupOne.forward(1).value * cupOne.forward(2).value
}

const cups = '952438716'.split('').map(Number)
const oneMillionCups = cups.concat(range(10, 1_000_001))

printSolution(23, 1, part1(cups, 100))
printSolution(23, 2, part2(oneMillionCups, 10_000_000))
