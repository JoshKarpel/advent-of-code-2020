import { difference, mulReducer, printSolution, readFile, regExtract, sumReducer } from './util'

type Ticket = Array<number>
type Tickets = Array<Ticket>

type Range = { lower: number, upper: number }

class Field {
  readonly name: string
  readonly ranges: Array<Range>

  constructor (name: string, ranges: Array<Range>) {
    this.name = name
    this.ranges = ranges
  }

  check (n: number): boolean {
    return this.ranges.some(range => n >= range.lower && n <= range.upper)
  }
}

type Fields = Array<Field>

function part1 (fields: Fields, tickets: Tickets): number {
  return tickets
    .flatMap(ticket => ticket.filter(t => !fields.some(field => field.check(t))))
    .reduce(sumReducer)
}

function part2 (fields: Fields, tickets: Tickets, myTicket: Ticket): number {
  const validTickets = tickets.filter(ticket => ticket.every(t => fields.some(field => field.check(t))))

  const fieldIndices = Array.from(myTicket.keys())

  const possiblePositions: Array<[Field, Set<number>]> = fields
    .map(testField =>
      [
        testField,
        new Set(
          fieldIndices.filter(fieldIdx => validTickets.every(ticket => testField.check(ticket[fieldIdx]))),
        ),
      ],
    )

  possiblePositions.sort(([_f1, s1], [_f2, s2]) => s1.size - s2.size)

  const orderedFields: Map<number, Field> = new Map()

  for (const [field, possibilities] of possiblePositions) {
    const unusedPossibilities = difference(possibilities, orderedFields.keys())
    if (unusedPossibilities.size === 1) {
      const idx = unusedPossibilities.values().next().value as number
      orderedFields.set(idx, field)
    } else {
      throw new Error('this problem is too hard')
    }
  }

  return Array.from(orderedFields.entries())
    .filter(([_idx, field]) => field.name.startsWith('departure'))
    .map(([idx]) => myTicket[idx])
    .reduce(mulReducer)
}

const [rawFields, rawMyTicket, rawTickets] = readFile('data/day_16.txt').split('\n\n')

const fields = rawFields
  .split('\n')
  .map(line => {
    const match = regExtract(line, /([\w\s]+): (\d+)-(\d+) or (\d+)-(\d+)/)
    return new Field(match[1],
      [
        { lower: Number(match[2]), upper: Number(match[3]) },
        { lower: Number(match[4]), upper: Number(match[5]) },
      ],
    )
  })
const myTicket: Ticket = rawMyTicket.split('\n')[1].split(',').map(Number)
const tickets: Tickets = rawTickets.split('\n').slice(1).map(line => line.split(',').map(Number))

printSolution(16, 1, part1(fields, tickets))
printSolution(16, 2, part2(fields, tickets, myTicket))
