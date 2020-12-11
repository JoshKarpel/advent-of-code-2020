import { count, printSolution, readFile, sumReducer } from './util'

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

function part2 (adapters: Array<number>): number {
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

const adapters = readFile('data/day_10.txt').split('\n').map(Number)

printSolution(10, 1, part1(adapters))
printSolution(10, 2, part2(adapters))
