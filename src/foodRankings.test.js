import test from 'node:test'
import assert from 'node:assert/strict'
import { foods } from './foodWorldCup.js'
import { getRankings, rankingStorageKey, readResults, removeResult, storeResult } from './foodRankings.js'

function memoryStorage() {
  const items = new Map()
  return {
    getItem: key => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, value),
  }
}

const choices = foods.slice(0, 31).map(food => food.name)

test('results persist once per run and accumulate every match selection', () => {
  const storage = memoryStorage()
  assert.deepEqual(readResults(storage), [])
  storeResult(storage, 'first', choices)
  storeResult(storage, 'first', choices)
  assert.equal(readResults(storage).length, 1)
  const runs = storeResult(storage, 'second', choices)
  const rankings = getRankings(runs)
  assert.equal(runs.length, 2)
  assert.equal(rankings.length, 31)
  assert.equal(rankings.reduce((sum, food) => sum + food.count, 0), 62)
  assert.ok(rankings.every(food => food.count === 2 && food.rank === 1))
})

test('removing a saved run and saving its corrected result does not double count', () => {
  const storage = memoryStorage()
  storeResult(storage, 'other', choices)
  storeResult(storage, 'current', choices)
  const remaining = removeResult(storage, 'current')
  assert.deepEqual(remaining.map(run => run.id), ['other'])
  const corrected = choices.map(() => foods[31].name)
  const runs = storeResult(storage, 'current', corrected)
  const rankings = getRankings(runs)
  assert.equal(rankings[0].name, foods[31].name)
  assert.equal(rankings[0].count, 31)
  assert.equal(rankings[0].rank, 1)
  assert.equal(rankings[1].rank, 2)
  assert.equal(rankings.reduce((sum, food) => sum + food.count, 0), 62)
})

test('malformed storage is reported without replacing it', () => {
  const storage = memoryStorage()
  for (const raw of ['{', 'null', '{"version":2,"runs":[]}', '{"version":1,"runs":[{}]}']) {
    storage.setItem(rankingStorageKey, raw)
    assert.throws(() => readResults(storage))
    assert.throws(() => storeResult(storage, 'new', choices))
    assert.equal(storage.getItem(rankingStorageKey), raw)
  }
})

test('incomplete or unknown choices cannot be saved', () => {
  const storage = memoryStorage()
  assert.throws(() => storeResult(storage, 'partial', choices.slice(1)))
  assert.throws(() => storeResult(storage, 'invalid', Array(31).fill('unknown')))
  assert.deepEqual(readResults(storage), [])
})

test('storage read and write failures are surfaced', () => {
  assert.throws(() => readResults({ getItem() { throw new Error('Access denied') } }), /Access denied/)
  assert.throws(() => storeResult({
    getItem() { return null },
    setItem() { throw new Error('Storage full') },
  }, 'first', choices), /Storage full/)
})
