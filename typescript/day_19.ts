import { printSolution, readFile } from './util'

type RawRules = Map<string, Array<string>>;

function part1 (rules: RawRules, messages: Array<string>): number {
  const ruleMap = new Map(
    Array.from(rules.entries())
      .map(([n, rule]) => [n, constructRegExp(rules, rule)]),
  )

  const ruleZero = ruleMap.get('0')
  if (ruleZero === undefined) {
    throw new Error('no rule 0!')
  }

  return messages.filter(message => message.match(ruleZero)).length
}

function part2 (rules: RawRules, messages: Array<string>): number {
  const ruleMap = new Map(
    Array.from(rules.entries())
      .map(([n, rule]) => [n, constructRegExp(rules, rule)]),
  )

  const ruleZero = ruleMap.get('0')
  if (ruleZero === undefined) {
    throw new Error('no rule 0!')
  }

  return messages.filter(message => message.match(ruleZero)).length
}

function constructRegExp (rules: RawRules, rule: Array<string>): RegExp {
  const parts = [...rule]
  while (parts.some(c => rules.has(c))) {
    for (const [idx, part] of parts.entries()) {
      if (rules.has(part)) {
        parts.splice(idx, 1, '(', ...rules.get(part) || part, ')')
        break
      }
    }
  }
  return RegExp(`^${parts.join('')}$`)
}

const [rawRules, rawMessages] = readFile('data/day_19.txt').split('\n\n')
const rules: RawRules = new Map(
  rawRules
    .split('\n')
    .map(line => {
      const [n, rawRule] = line.split(': ')

      const charMatch = rawRule.match(/"(\w)"/)
      if (charMatch !== null) {
        const c = [charMatch[1]]
        return [n, c]
      } else {
        return [n, rawRule.split(' ')]
      }
    },
    ),
)

const messages = rawMessages.split('\n')

printSolution(19, 1, part1(rules, messages))
printSolution(19, 2, part2(rules, messages))
