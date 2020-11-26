import util = require('./util');

const lines = util.readFileLines('data/day_01.txt')

console.log(lines)

const asNumbers = lines.map(Number)

console.log(asNumbers)
console.log(asNumbers)

const soln = asNumbers.reduce((acc, curr) => acc + curr)

util.printSolution(1, 1, soln)
