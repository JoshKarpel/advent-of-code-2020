import { count, printSolution, readFile, sortNumbers, sumReducer } from './util'

const START = 0

function builtInAdapterRating (adapters: Array<number>) :number {
  return Math.max(...adapters) + 3
}

function buildGraph (adapters: Array<number>): Map<number, Array<number>> {
  adapters = adapters.concat([0, builtInAdapterRating(adapters)])

  const graph = new Map()
  for (const adapter of adapters) {
    graph.set(adapter, adapters.filter(other => {
      const diff = other - adapter
      return diff > 0 && diff <= 3
    }))
  }

  return graph
}

function part1 (adapters: Array<number>): number {
  const graph = buildGraph(adapters)

  const path = [START]
  const diffs = []
  while (path[path.length - 1] !== builtInAdapterRating(adapters)) {
    const prev = path[path.length - 1] || 0
    const nextSet = graph.get(prev) || []
    const next = Math.min(...nextSet)
    path.push(next)
    diffs.push(next - prev)
  }

  const counts = count(diffs)

  return (counts.get(1) || 0) * (counts.get(3) || 0)
}

function part2WithRecursion (adapters: Array<number>): number {
  return numPaths(buildGraph(adapters), START, builtInAdapterRating(adapters))
}

function numPaths (
  graph: Map<number, Array<number>>,
  start: number,
  end: number,
  cache: Map<number, number> = new Map(),
): number {
  if (start === end) {
    return 1
  }

  const alreadyCounted = cache.get(start)
  if (alreadyCounted !== undefined) {
    return alreadyCounted
  }

  const nextAdapters = graph.get(start) || []

  const numPathsBelowStart = nextAdapters.map(next => numPaths(graph, next, end, cache)).reduce(sumReducer)
  cache.set(start, numPathsBelowStart)
  return numPathsBelowStart
}

function part2WithoutRecursion (adapters: Array<number>): number {
  const graph = buildGraph(adapters)

  const numPathsTo = new Map([[0, 1]])

  for (const adapter of Array.from(graph.keys()).sort(sortNumbers)) {
    const numPathsToHere = numPathsTo.get(adapter) || 0

    for (const next of (graph.get(adapter) || [])) {
      numPathsTo.set(next, (numPathsTo.get(next) || 0) + numPathsToHere)
    }
  }

  return numPathsTo.get(builtInAdapterRating(adapters)) || 0
}

const adapters = readFile('data/day_10.txt').split('\n').map(Number)

printSolution(10, 1, part1(adapters))
printSolution(10, 2, part2WithRecursion(adapters))
printSolution(10, 2, part2WithoutRecursion(adapters))
