import { printSolution, readFile, sumReducer } from './util'

type Deck = Array<number>

function round (deck1: Deck, deck2: Deck): [Deck, Deck] {
  deck1 = [...deck1]
  deck2 = [...deck2]

  const card1 = deck1.shift()
  const card2 = deck2.shift()

  if (card1 === undefined || card2 === undefined) {
    throw new Error('empty deck!')
  }

  if (card1 > card2) {
    deck1.push(card1, card2)
  } else {
    deck2.push(card2, card1)
  }

  return [deck1, deck2]
}

function part1 (deck1: Deck, deck2: Deck): number {
  while ([deck1, deck2].every(d => d.length > 0)) {
    [deck1, deck2] = round(deck1, deck2)
  }

  const winningDeck = deck1.length > 0 ? deck1 : deck2

  return score(winningDeck)
}

function playRecursive (
  deck1: Deck,
  deck2: Deck,
): [[Deck, Deck], number] {
  deck1 = [...deck1]
  deck2 = [...deck2]

  const seen = new Set()

  while ([deck1, deck2].every(d => d.length > 0)) {
    if (seen.has(key(deck1)) && seen.has(key(deck2))) {
      return [[deck1, deck2], 0]
    }
    seen.add(key(deck1))
    seen.add(key(deck2));

    [deck1, deck2] = recursiveRound(deck1, deck2)
  }

  const winner = deck1.length > 0 ? 0 : 1

  return [[deck1, deck2], winner]
}

function recursiveRound (deck1: Deck, deck2: Deck): [Deck, Deck] {
  deck1 = [...deck1]
  deck2 = [...deck2]

  const card1 = deck1.shift()
  const card2 = deck2.shift()

  if (card1 === undefined || card2 === undefined) {
    throw new Error('empty deck!')
  }

  if (card1 <= deck1.length && card2 <= deck2.length) {
    const [, winner] = playRecursive(deck1.slice(0, card1), deck2.slice(0, card2))
    const winningDeck = [deck1, deck2][winner]
    const cards = winner === 0 ? [card1, card2] : [card2, card1]
    winningDeck.push(...cards)
  } else {
    if (card1 > card2) {
      deck1.push(card1, card2)
    } else {
      deck2.push(card2, card1)
    }
  }

  return [deck1, deck2]
}

function key (deck: Deck): string {
  return deck.join('|')
}

function part2 (deck1: Deck, deck2: Deck): number {
  const [decks, winner] = playRecursive(deck1, deck2)

  const winningDeck = decks[winner]

  return score(winningDeck)
}

function score (deck: Deck): number {
  return Array.from(deck.reverse().entries())
    .map(([idx, card]) => (idx + 1) * card)
    .reduce(sumReducer)
}

function parseDeck (str: string): Deck {
  return str
    .split('\n')
    .slice(1)
    .map(Number)
}

const [deck1, deck2] = readFile('data/day_22.txt')
  .split('\n\n')
  .map(parseDeck)

printSolution(22, 1, part1(deck1, deck2))
printSolution(22, 2, part2(deck1, deck2))
