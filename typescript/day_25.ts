import { printSolution } from './util'

function findLoopSize (key: number, base: number, p: number) {
  let exp = 0
  let value = 1
  while (value !== key) {
    value = (value * base) % p
    exp += 1
  }
  return exp
}

function loop (loops: number, base: number, p: number) {
  let value = 1
  for (let i = 0; i < loops; i += 1) {
    value = (value * base) % p
  }
  return value
}

function part1 (cardKey: number, doorKey: number, base: number, p: number): number {
  const cardLoopSize = findLoopSize(cardKey, base, p)
  const doorLoopSize = findLoopSize(doorKey, base, p)

  const encryptionKeyFromCard = loop(cardLoopSize, doorKey, p)
  const encryptionKeyFromDoor = loop(doorLoopSize, cardKey, p)

  if (encryptionKeyFromCard !== encryptionKeyFromDoor) {
    throw new Error('encryption keys did not match!')
  }

  return encryptionKeyFromCard
}

// const [cardKey, doorKey, base, p] = [5764801, 17807724, 7, 20201227]
const [cardKey, doorKey, base, p] = [2069194, 16426071, 7, 20201227]

printSolution(25, 1, part1(cardKey, doorKey, base, p))
