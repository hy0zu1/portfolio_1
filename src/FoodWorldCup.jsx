import { useEffect, useRef, useState } from 'react'
import { chooseFood, createTournament, roundLabel, undoFood } from './foodWorldCup.js'
import { getRankings, rankingStorageKey, readResults, removeResult, storeResult } from './foodRankings.js'
import './FoodWorldCup.css'

export default function FoodWorldCup() {
  const [game, setGame] = useState(createTournament)
  const [runId, setRunId] = useState(() => crypto.randomUUID())
  const [runs, setRuns] = useState([])
  const [storageError, setStorageError] = useState('')
  const [notice, setNotice] = useState('')
  const heading = useRef(null)
  const hasInteracted = useRef(false)
  const pair = game.round.slice(game.match * 2, game.match * 2 + 2)
  const saved = runs.some(run => run.id === runId)
  const rankings = getRankings(runs)

  function reportStorageError(error) {
    console.error('음식 월드컵 기록 저장소 오류:', error)
    setStorageError('이 브라우저의 기록을 읽거나 저장하지 못했어요. 저장 공간·개인정보 설정을 확인해 줘. 기존 기록은 덮어쓰지 않았어.')
    setNotice('')
  }

  function refreshRankings() {
    try {
      setRuns(readResults(window.localStorage))
      setStorageError('')
    } catch (error) {
      reportStorageError(error)
    }
  }

  useEffect(() => {
    function loadRankings(event) {
      if (event && event.key !== rankingStorageKey && event.key !== null) return
      refreshRankings()
    }
    loadRankings()
    window.addEventListener('storage', loadRankings)
    return () => window.removeEventListener('storage', loadRankings)
  }, [])

  useEffect(() => {
    if (hasInteracted.current) heading.current?.focus({ preventScroll: true })
  }, [game])

  function restart() {
    hasInteracted.current = true
    setGame(createTournament())
    setRunId(crypto.randomUUID())
    setNotice('')
  }

  function selectFood(food) {
    hasInteracted.current = true
    setNotice('')
    setGame(current => current === game ? chooseFood(current, food) : current)
  }

  function saveResult() {
    if (!game.champion) return
    try {
      setRuns(storeResult(window.localStorage, runId, game.history.map(match => match.winner.name)))
      setStorageError('')
      setNotice('이번 판 31경기의 선택을 저장했어! 같은 결과는 한 번만 집계돼.')
    } catch (error) {
      reportStorageError(error)
    }
  }

  function goBack() {
    if (!game.previous) return
    if (saved) {
      try {
        setRuns(removeResult(window.localStorage, runId))
        setStorageError('')
      } catch (error) {
        reportStorageError(error)
        return
      }
    }
    hasInteracted.current = true
    setGame(undoFood(game))
    setNotice('직전 선택을 취소했어. 이번 판을 저장했다면 누적 순위에서도 뺐어. 다시 완성한 뒤 저장해 줘!')
  }

  return (
    <section className="food-page page-width" aria-labelledby="food-title">
      <a className="text-link list-back" href="#home">← 홈으로 돌아가기</a>
      <p className="eyebrow">식사부터 디저트까지 / 음식 취향 월드컵</p>
      <h1 id="food-title" tabIndex={-1}>네 마음속 우승 음식은<span>?</span></h1>
      <p className="food-description">식사 16가지 + 간식 16가지! 더 먹고 싶은 음식을 눌러 최애를 찾아봐.</p>
      <div className="food-progress">
        <label htmlFor="food-progress">총 31번의 선택 중 {game.history.length}번 완료</label>
        <progress id="food-progress" max={31} value={game.history.length} />
      </div>
      <div className="food-arena">
        <h2 ref={heading} tabIndex={-1} aria-live="polite">
          {game.champion ? '오늘의 우승 음식!' : `${roundLabel(game.round.length)} · ${game.match + 1} / ${game.round.length / 2}`}
        </h2>
        {game.champion ? <div className="food-champion">
          <span className="food-trophy" aria-hidden="true">🏆</span>
          <span className="food-emoji" aria-hidden="true">{game.champion.emoji}</span>
          <h3>{game.champion.name}</h3>
          <p>32가지 중 네 마음을 사로잡은 한 가지!</p>
          <div className="food-result-actions">
            <button type="button" className="button button-primary" onClick={saveResult} disabled={saved || !!storageError}>{saved ? '이번 결과 저장 완료 ✓' : '결과 저장하기'}</button>
            <button type="button" className="food-secondary" onClick={restart}>새 대진표로 다시 하기 ↻</button>
          </div>
        </div> : <div className="food-match" key={`${game.round.length}-${game.match}`}>
          {pair.map((food, index) => <button type="button" className="food-choice" key={food.name} onClick={() => selectFood(food)}>
            <span className="food-side">{index === 0 ? '핫핑크 팀' : '민트 팀'}</span>
            <span className="food-emoji" aria-hidden="true">{food.emoji}</span>
            <strong>{food.name}</strong>
            <span>이 음식 선택하기 →</span>
          </button>)}
          <span className="food-versus" aria-hidden="true">VS</span>
        </div>}
        <button type="button" className="food-back food-secondary" disabled={!game.previous} onClick={goBack}>← 이전 선택으로 돌아가기{saved ? ' (이번 저장도 취소)' : ''}</button>
      </div>
      <p role="status" className="food-notice">{notice}</p>
      {storageError && <div role="alert" className="food-storage-error"><p>{storageError}</p><button type="button" className="food-secondary" onClick={refreshRankings}>기록 다시 읽기</button></div>}
      <p className="food-description">대진표는 매번 랜덤! 진행 중인 판은 이동·새로고침하면 초기화돼. 끝까지 마친 뒤 ‘결과 저장하기’를 누른 판만 이 브라우저에 남아.</p>
      <section className="food-ranking" aria-labelledby="food-ranking-title">
        <h2 id="food-ranking-title">이 브라우저 누적 순위<span>.</span></h2>
        <p className="food-description">다른 사람 전체의 결과가 아닌, 이 브라우저에서 저장한 결과야. 매 경기에서 선택된 횟수가 많은 음식이 높은 순위! 같은 횟수는 공동 순위야.</p>
        {storageError ? <p>저장소를 다시 읽으면 최신 순위를 보여 줄게.</p> : <>
          <p>저장한 게임 <strong>{runs.length}판</strong> · 누적 선택 <strong>{runs.length * 31}번</strong></p>
          {rankings.length === 0 ? <p>아직 저장한 결과가 없어. 첫 우승을 정하고 저장해 봐!</p> :
            <ol className="food-ranking-list">{rankings.map(food => <li key={food.name}>
              <span className="food-rank">{food.rank}위</span>
              <span><span aria-hidden="true">{food.emoji} </span>{food.name}</span>
              <strong>{food.count}회 선택</strong>
            </li>)}</ol>}
        </>}
        <p className="food-description">브라우저 데이터를 지우면 누적 순위도 사라져. 비공개 모드에서는 창을 닫을 때 지워질 수 있어.</p>
      </section>
      {game.history.length > 0 && <details className="food-history">
        <summary>내 선택 기록 보기 · {game.history.length}경기</summary>
        <ol>{game.history.map((match, index) => <li key={index}>
          <span>{roundLabel(match.size)} · {match.pair.map(food => food.name).join(' vs ')}</span>
          <strong>선택: {match.winner.name}</strong>
        </li>)}</ol>
      </details>}
    </section>
  )
}
