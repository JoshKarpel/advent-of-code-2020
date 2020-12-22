import { printSolution, readFile } from './util'

function part1 (rules: Map<string, RegExp>, messages: Array<string>): number {
  const ruleZero = rules.get('0')
  if (ruleZero === undefined) {
    throw new Error('no rule 0!')
  }

  return messages.filter(message => message.match(ruleZero)).length
}

const [rawRules, rawMessages] = readFile('data/day_19.txt').split('\n\n')
const rules: Map<string, Array<string>> = new Map(
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
const rules2: Array<[string, RegExp]> = Array.from(rules.entries())
  .map(([n, rule]) => {
    const parts = [...rule]
    while (parts.some(c => rules.has(c))) {
      for (const [idx, part] of parts.entries()) {
        if (rules.has(part)) {
          parts.splice(idx, 1, '(', ...rules.get(part) || part, ')')
          break
        }
      }
    }
    return [n, RegExp(`^${parts.join('')}$`)]
  })
const ruleMap = new Map(rules2)

const messages = rawMessages.split('\n')

printSolution(19, 1, part1(ruleMap, messages))
