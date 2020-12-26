import { intersection, printSolution, readFile, sumReducer, union } from './util'

function solve (
  answerGroups: Array<Array<string>>,
  reducer: (acc: Set<string>, curr: Set<string>) => Set<string>,
): number {
  return answerGroups
    .map(group =>
      group
        .map(answers => new Set(answers.split('')))
        .reduce(reducer)
        .size)
    .reduce(sumReducer)
}

function part1 (answerGroups: Array<Array<string>>): number {
  return solve(answerGroups, union)
}

function part2 (answerGroups: Array<Array<string>>): number {
  return solve(answerGroups, intersection)
}

const answerGroups = readFile('data/day_06.txt')
  .split('\n\n')
  .map(answerGroup => answerGroup.split('\n'))

printSolution(6, 1, part1(answerGroups))
printSolution(6, 2, part2(answerGroups))
