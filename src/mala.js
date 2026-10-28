export const ingredientGroups = [
  { title: '고기·해산물', icon: '🥩', items: ['소고기', '양고기', '돼지고기', '새우', '오징어'] },
  { title: '채소·버섯', icon: '🥬', items: ['청경채', '숙주', '배추', '시금치', '감자', '연근', '팽이버섯', '목이버섯', '새송이버섯', '백목이버섯'] },
  { title: '면·떡', icon: '🍜', items: ['분모자', '중국당면', '옥수수면', '라면사리', '수제비'] },
  { title: '두부·완자·기타', icon: '🧈', items: ['푸주', '건두부', '얼린두부', '유부', '피시볼', '치즈떡', '소시지', '메추리알', '게맛살', '콘치즈떡'] },
]

export const geumjaIngredients = ['소고기', '청경채', '숙주', '감자', '팽이버섯', '분모자', '중국당면', '옥수수면', '푸주', '건두부', '유부', '치즈떡', '백목이버섯', '콘치즈떡']

export function compareIngredients(selected) {
  const yours = new Set(selected)
  const geumjas = new Set(geumjaIngredients)
  const shared = geumjaIngredients.filter(item => yours.has(item))
  const onlyYours = [...yours].filter(item => !geumjas.has(item))
  const onlyGeumja = geumjaIngredients.filter(item => !yours.has(item))
  return {
    shared,
    onlyYours,
    onlyGeumja,
    score: Math.round(shared.length / new Set([...yours, ...geumjas]).size * 100),
  }
}
