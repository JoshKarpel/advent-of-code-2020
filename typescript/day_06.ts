import util = require('./util');

function solve (
  answerGroups: Array<Array<string>>,
  reducer: (acc: Set<string>, curr: Set<string>) => Set<string>,
): number {
  return answerGroups
    .map(group =>
      group
        .map(answers => new Set(Array.from(answers)))
        .reduce((acc, curr) => reducer(acc, curr))
        .size)
    .reduce((acc, curr) => acc + curr)
}

function part1 (answerGroups: Array<Array<string>>): number {
  return solve(answerGroups, util.union)
}

function part2 (answerGroups: Array<Array<string>>): number {
  return solve(answerGroups, util.intersection)
}

const answerGroups = util.readFile('data/day_06.txt')
  .split('\n\n')
  .map(answerGroup => answerGroup.split('\n'))

util.printSolution(6, 1, part1(answerGroups))
util.printSolution(6, 2, part2(answerGroups))
