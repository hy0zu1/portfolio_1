export const foods = [
  ['마라탕', '🍲'], ['떡볶이', '🌶️'], ['치킨', '🍗'], ['피자', '🍕'],
  ['햄버거', '🍔'], ['초밥', '🍣'], ['삼겹살', '🥓'], ['파스타', '🍝'],
  ['라면', '🍜'], ['김밥', '🍙'], ['돈가스', '🍱'], ['냉면', '🥢'],
  ['쌀국수', '🍜'], ['찜닭', '🍗'], ['곱창', '🔥'], ['타코', '🌮'],
  ['아이스크림', '🍦'], ['케이크', '🍰'], ['도넛', '🍩'], ['쿠키', '🍪'],
  ['붕어빵', '🐟'], ['호떡', '🥞'], ['와플', '🧇'], ['크레페', '🥞'],
  ['마카롱', '🧁'], ['탕후루', '🍡'], ['빙수', '🍧'], ['초콜릿', '🍫'],
  ['푸딩', '🍮'], ['츄러스', '🥖'], ['감자튀김', '🍟'], ['팝콘', '🍿'],
].map(([name, emoji]) => ({ name, emoji }))

export function createTournament() {
  const round = [...foods]
  for (let i = round.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = round[i]
    round[i] = round[j]
    round[j] = current
  }
  return { round, nextRound: [], match: 0, history: [], champion: null, previous: null }
}

export function chooseFood(state, winner) {
  if (state.champion) return state
  const pair = state.round.slice(state.match * 2, state.match * 2 + 2)
  if (!pair.includes(winner)) throw new Error('현재 대결에 없는 음식은 선택할 수 없습니다.')
  const nextRound = [...state.nextRound, winner]
  const history = [...state.history, { size: state.round.length, pair, winner }]
  if (nextRound.length === state.round.length / 2) {
    if (nextRound.length === 1) return { ...state, history, champion: winner, previous: state }
    return { round: nextRound, nextRound: [], match: 0, history, champion: null, previous: state }
  }
  return { ...state, nextRound, match: state.match + 1, history, previous: state }
}

export function undoFood(state) {
  return state.previous ?? state
}

export function roundLabel(size) {
  return size === 2 ? '결승' : `${size}강`
}
