import { useEffect, useRef, useState } from 'react'
import { compareIngredients, geumjaIngredients, ingredientGroups } from './mala.js'
import './MalaGame.css'

function IngredientList({ items, emptyText }) {
  return items.length > 0
    ? <ul className="mala-tags">{items.map(item => <li key={item}>{item}</li>)}</ul>
    : <p>{emptyText}</p>
}

export default function MalaGame() {
  const [selected, setSelected] = useState([])
  const [showResult, setShowResult] = useState(false)
  const resultTitle = useRef(null)
  const pickerTitle = useRef(null)
  const comparison = compareIngredients(selected)

  useEffect(() => {
    if (showResult) resultTitle.current?.focus()
    else pickerTitle.current?.focus()
  }, [showResult])

  function toggleIngredient(item) {
    setSelected(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item])
  }

  function editBowl(clear) {
    if (clear) setSelected([])
    setShowResult(false)
  }

  return (
    <section className="mala-page page-width" aria-labelledby="mala-title">
      <a className="text-link list-back" href="#home">← 홈으로 돌아가기</a>
      <header className="mala-heading">
        <p className="eyebrow">금자의 취향 실험실 / 마라탕 편</p>
        <h1 id="mala-title" tabIndex={-1}>너의 마라탕,<br />금자랑 얼마나 닮았을까<span>?</span></h1>
        <p>재료를 골라 나만의 한 그릇을 완성해 봐! 마지막에 금자의 픽과 비교해 줄게.</p>
        <ol className="mala-steps" aria-label="게임 순서">
          <li aria-current={!showResult ? 'step' : undefined}>01 재료 고르기</li>
          <li aria-current={showResult ? 'step' : undefined}>02 취향 비교하기</li>
        </ol>
      </header>

      <div hidden={showResult} className="mala-kitchen">
        <div className="mala-picker">
          <h2 ref={pickerTitle} tabIndex={-1}>취향껏 담아 줘!</h2>
          <p>개수 제한 없이 선택해. 한 번 더 누르면 뺄 수 있어.</p>
          {ingredientGroups.map(group => <fieldset className="mala-group" key={group.title}>
            <legend><span aria-hidden="true">{group.icon}</span> {group.title}</legend>
            <div className="mala-options">
              {group.items.map(item => <button type="button" key={item} aria-pressed={selected.includes(item)} onClick={() => toggleIngredient(item)}>
                <span aria-hidden="true">{selected.includes(item) ? '✓' : '＋'}</span> {item}
              </button>)}
            </div>
          </fieldset>)}
        </div>
        <aside className="mala-bowl" aria-labelledby="bowl-title">
          <span className="mala-bowl-icon" aria-hidden="true">🍲</span>
          <h2 id="bowl-title">나의 한 그릇</h2>
          <p className="mala-count" role="status">재료 {selected.length}개 담았어요</p>
          <IngredientList items={selected} emptyText="아직 빈 그릇이야. 좋아하는 재료부터 담아 봐!" />
          <button type="button" className="button button-primary" disabled={selected.length === 0} onClick={() => setShowResult(true)}>완성! 금자랑 비교하기 →</button>
          <button type="button" className="mala-reset" disabled={selected.length === 0} onClick={() => setSelected([])}>그릇 비우기</button>
          <p className="mala-hint">하나 이상 담으면 비교할 수 있어.<br />이 화면을 벗어나거나 새로고침하면 선택은 초기화돼.</p>
        </aside>
      </div>

      {showResult && <section className="mala-result" aria-labelledby="mala-result-title">
        <p className="eyebrow">나만의 한 그릇 완성!</p>
        <h2 id="mala-result-title" ref={resultTitle} tabIndex={-1}>금자와 취향 일치율</h2>
        <p className="mala-score">{comparison.score}<span>%</span></p>
        <p>{comparison.score === 100 ? '금자랑 완전 똑같은 한 그릇이야!' : comparison.score >= 50 ? '우리 같이 마라탕 먹어도 좋겠다!' : '서로 다른 취향도 매력 있지. 네 그릇도 멋져!'}</p>
        <p className="mala-hint">함께 고른 {comparison.shared.length}개 ÷ 둘 중 한 명이라도 고른 {comparison.shared.length + comparison.onlyYours.length + comparison.onlyGeumja.length}개 × 100 (반올림)<br />재미로 보는 취향 비교야. 정답이나 등수는 없어!</p>
        <div className="mala-comparison">
          <article><h3>우리 둘 다 좋아해 · {comparison.shared.length}개</h3><IngredientList items={comparison.shared} emptyText="겹치는 재료는 없지만 취향은 존중!" /></article>
          <article><h3>너만 고른 재료 · {comparison.onlyYours.length}개</h3><IngredientList items={comparison.onlyYours} emptyText="네가 고른 건 금자도 전부 좋아해!" /></article>
          <article><h3>금자만 고른 재료 · {comparison.onlyGeumja.length}개</h3><IngredientList items={comparison.onlyGeumja} emptyText="금자의 픽도 전부 담았네!" /></article>
        </div>
        <details className="mala-geumja"><summary>금자의 원래 한 그릇 보기 · {geumjaIngredients.length}개</summary><IngredientList items={geumjaIngredients} /></details>
        <div className="mala-actions">
          <button type="button" className="button button-primary" onClick={() => editBowl(false)}>내 재료 바꿔 보기</button>
          <button type="button" className="mala-reset" onClick={() => editBowl(true)}>처음부터 다시 하기</button>
        </div>
      </section>}
    </section>
  )
}
