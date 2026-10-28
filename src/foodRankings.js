import { foods } from './foodWorldCup.js'

export const rankingStorageKey = 'geumja-food-worldcup-results-v1'

export function readResults(storage) {
  const raw = storage.getItem(rankingStorageKey)
  if (raw === null) return []
  const data = JSON.parse(raw)
  const knownFoods = new Set(foods.map(food => food.name))
  if (
    data?.version !== 1 || !Array.isArray(data.runs) ||
    !data.runs.every(run =>
      typeof run?.id === 'string' && run.id.length > 0 &&
      Array.isArray(run.choices) && run.choices.length === 31 &&
      run.choices.every(name => knownFoods.has(name))) ||
    new Set(data.runs.map(run => run.id)).size !== data.runs.length
  ) {
    throw new Error('저장된 음식 월드컵 기록의 형식이 올바르지 않습니다.')
  }
  return data.runs
}

export function storeResult(storage, id, choices) {
  const runs = readResults(storage)
  if (runs.some(run => run.id === id)) return runs
  if (!id || choices.length !== 31 || !choices.every(name => foods.some(food => food.name === name))) {
    throw new Error('완료된 31경기의 선택만 저장할 수 있습니다.')
  }
  const next = [...runs, { id, choices }]
  storage.setItem(rankingStorageKey, JSON.stringify({ version: 1, runs: next }))
  return next
}

export function removeResult(storage, id) {
  const runs = readResults(storage)
  const next = runs.filter(run => run.id !== id)
  if (next.length !== runs.length) {
    storage.setItem(rankingStorageKey, JSON.stringify({ version: 1, runs: next }))
  }
  return next
}

export function getRankings(runs) {
  const counts = new Map(foods.map(food => [food.name, 0]))
  for (const run of runs) {
    for (const name of run.choices) counts.set(name, counts.get(name) + 1)
  }
  const entries = foods.map(food => ({ ...food, count: counts.get(food.name) }))
    .filter(food => food.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ko'))
  let rank = 0
  return entries.map((food, index) => {
    if (index === 0 || food.count !== entries[index - 1].count) rank = index + 1
    return { ...food, rank }
  })
}
