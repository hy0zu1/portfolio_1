import test from 'node:test'
import assert from 'node:assert/strict'
import { chooseFood, createTournament, foods, roundLabel, undoFood } from './foodWorldCup.js'

test('32 unique foods are shuffled without changing the source', () => {
  const original = [...foods]
  const game = createTournament()
  assert.equal(foods.length, 32)
  assert.equal(new Set(foods.map(food => food.name)).size, 32)
  assert.deepEqual(new Set(game.round), new Set(foods))
  assert.notEqual(game.round, foods)
  assert.deepEqual(foods, original)
})

test('31 selections advance 32, 16, 8, 4, 2 and produce one champion', () => {
  let game = createTournament()
  const expectedChampion = game.round[0]
  const rounds = []
  for (let i = 0; i < 31; i++) {
    rounds.push(game.round.length)
    const old = game
    game = chooseFood(game, game.round[game.match * 2])
    assert.equal(old.history.length, i)
    assert.equal(game.history.length, i + 1)
  }
  assert.deepEqual(rounds, [...Array(16).fill(32), ...Array(8).fill(16), ...Array(4).fill(8), 4, 4, 2])
  assert.equal(game.champion, expectedChampion)
  assert.equal(chooseFood(game, expectedChampion), game)
})

test('choosing the right candidate advances only the chosen food', () => {
  const game = createTournament()
  const next = chooseFood(game, game.round[1])
  assert.equal(next.match, 1)
  assert.deepEqual(next.nextRound, [game.round[1]])
  assert.equal(next.history[0].winner, game.round[1])
  assert.throws(() => chooseFood(game, game.round[3]))
})

test('round labels and restart state', () => {
  assert.equal(roundLabel(2), '결승')
  assert.equal(roundLabel(32), '32강')
  assert.deepEqual(createTournament().history, [])
  assert.equal(createTournament().champion, null)
})

test('undo restores each exact pairing including round transitions and final', () => {
  let game = createTournament()
  const states = [game]
  assert.equal(undoFood(game), game)
  for (let i = 0; i < 31; i++) {
    game = chooseFood(game, game.round[game.match * 2 + i % 2])
    states.push(game)
  }
  for (let i = 31; i > 0; i--) {
    game = undoFood(game)
    assert.equal(game, states[i - 1])
  }
  assert.equal(game.history.length, 0)
})

test('undoing a final allows choosing the other finalist', () => {
  let game = createTournament()
  for (let i = 0; i < 30; i++) game = chooseFood(game, game.round[game.match * 2])
  const original = chooseFood(game, game.round[0])
  const revised = chooseFood(undoFood(original), game.round[1])
  assert.equal(revised.champion, game.round[1])
  assert.equal(revised.history.length, 31)
})
