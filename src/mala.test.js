import test from 'node:test'
import assert from 'node:assert/strict'
import { compareIngredients, geumjaIngredients, ingredientGroups } from './mala.js'

test('30 unique options include all 14 confirmed picks without plain rice cake', () => {
  const all = ingredientGroups.flatMap(group => group.items)
  assert.equal(all.length, 30)
  assert.equal(new Set(all).size, 30)
  assert.ok(!all.includes('떡'))
  assert.ok(all.includes('치즈떡'))
  assert.equal(geumjaIngredients.length, 14)
  assert.ok(geumjaIngredients.every(item => all.includes(item)))
  assert.ok(geumjaIngredients.includes('백목이버섯'))
  assert.ok(geumjaIngredients.includes('콘치즈떡'))
})

test('identical selections match 100 percent', () => {
  const result = compareIngredients(geumjaIngredients)
  assert.equal(result.score, 100)
  assert.equal(result.shared.length, 14)
  assert.deepEqual(result.onlyYours, [])
  assert.deepEqual(result.onlyGeumja, [])
})

test('empty and disjoint selections match zero', () => {
  assert.equal(compareIngredients([]).score, 0)
  assert.deepEqual(compareIngredients(['양고기']).onlyYours, ['양고기'])
  assert.equal(compareIngredients(['양고기']).score, 0)
})

test('all ingredients do not guarantee 100 percent', () => {
  const all = ingredientGroups.flatMap(group => group.items)
  assert.equal(compareIngredients(all).score, 47)
})

test('partial overlap uses union and ignores duplicates', () => {
  const result = compareIngredients(['소고기', '양고기', '소고기'])
  assert.equal(result.score, 7)
  assert.deepEqual(result.shared, ['소고기'])
  assert.deepEqual(result.onlyYours, ['양고기'])
  assert.equal(result.onlyGeumja.length, 13)
})
