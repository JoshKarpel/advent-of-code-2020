import { printSolution, readFile } from './util'

type RawRule = Array<string>
type RawRules = Map<string, RawRule>;

function solve (
  rules: RawRules,
  messages: Array<string>,
  regExpConstructor: (rules: RawRules, rule: Array<string>) => string,
): number {
  const ruleMap = new Map(
    Array.from(rules.entries())
      .map(([n, rule]) => [n, regExpConstructor(rules, rule)]),
  )

  const ruleZero = getRuleZero(ruleMap)

  return messages.filter(message => message.match(ruleZero)).length
}

function constructRegExpSource (rules: RawRules, rule: RawRule): string {
  const parts = [...rule]
  while (parts.some(c => rules.has(c))) {
    for (const [idx, part] of parts.entries()) {
      if (rules.has(part)) {
        parts.splice(idx, 1, '(', ...rules.get(part) || part, ')')
        break
      }
    }
  }
  return parts.join('')
}

function constructRegExpSource2 (rules: RawRules, rule: RawRule): string {
  const parts = [...rule]
  while (parts.some(c => rules.has(c))) {
    for (const [idx, part] of parts.entries()) {
      if (rules.has(part)) {
        if (part === '8') {
          parts.splice(idx, 1, '(', ...rules.get(part) || part, ')+')
        } else if (part === '11') {
          const [a, b] = rules.get(part) || ''
          const possibilities = Array.from(Array(7).keys())
            .slice(1)
            .map(n => Array(n).fill(a).concat(Array(n).fill(b)))
            .flatMap(p => ['|', '(', ...p, ')'])
            .slice(1)
          parts.splice(idx, 1, '(', ...possibilities, ')')
        } else {
          parts.splice(idx, 1, '(', ...rules.get(part) || part, ')')
        }
        break
      }
    }
  }
  return parts.join('')
}

function getRuleZero (ruleMap: Map<string, string>): RegExp {
  const ruleZeroSource = ruleMap.get('0')
  if (ruleZeroSource === undefined) {
    throw new Error('no rule 0!')
  }
  return RegExp(`^${ruleZeroSource}$`)
}

const [rawestRules, rawMessages] = readFile('data/day_19.txt').split('\n\n')
const rawRules: RawRules = new Map(
  rawestRules
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

printSolution(19, 1, solve(rawRules, messages, constructRegExpSource))
printSolution(19, 2, solve(rawRules, messages, constructRegExpSource2))
