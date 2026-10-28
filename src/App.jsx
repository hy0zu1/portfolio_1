import { useEffect, useSyncExternalStore } from 'react'
import './App.css'

function subscribeToNavigation(onChange) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function getCurrentLocation() {
  return window.location.hash
}

const projects = []

function PersonalGuide() {
  return (
    <dl className="personal-guide">
      <div><dt>기분 좋아지는 순간</dt><dd>맛있는 거 먹을 때.<br />최애는 마라탕!</dd></div>
      <div><dt>사용 시 주의사항</dt><dd>금자 사용 시 주의:<br />볼륨 조절 불가.</dd></div>
      <div><dt>금자 충전 방법</dt><dd>옆에서 웃겨주기.</dd></div>
      <div><dt>좋아하는 그룹</dt><dd>제로베이스원!</dd></div>
    </dl>
  )
}

function ProjectArtwork({ project, className = '' }) {
  return (
    <div className={`project-art ${project.style} ${className}`} aria-hidden="true">
      <span className="project-number">{project.number}</span>
      {project.style === 'website' && <div className="mini-browser"><div className="mini-toolbar"><i /><i /><i /></div><div className="mini-layout"><span>HELLO!</span><div /><p>My little corner<br />of the internet.</p></div></div>}
      {project.style === 'idea' && <><div className="idea-circle" /><span className="idea-asterisk">✳</span><span className="idea-caption">WHAT IF?</span></>}
      {project.style === 'creative' && <><div className="creative-shape shape-one" /><div className="creative-shape shape-two" /><span className="creative-caption">make<br /><em>something.</em></span></>}
    </div>
  )
}

function App() {
  const currentLocation = useSyncExternalStore(subscribeToNavigation, getCurrentLocation)
  const isPortfolioPage = currentLocation === '#/portfolio'
  const isAboutPage = currentLocation === '#/about' || currentLocation === '#about'
  const isProjectPage = currentLocation.startsWith('#/portfolio/')
  const selectedProject = isProjectPage ? projects.find((project) => currentLocation === `#/portfolio/${project.style}`) : undefined

  useEffect(() => {
    document.title = isProjectPage ? `${selectedProject?.title ?? '프로젝트를 찾을 수 없어요'} | 나의 포트폴리오` : isPortfolioPage ? '포트폴리오 목록 | 나의 포트폴리오' : isAboutPage ? '자기소개 | 나의 포트폴리오' : '나의 포트폴리오'

    if (isPortfolioPage || isAboutPage || isProjectPage) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById(isProjectPage ? 'project-title' : isPortfolioPage ? 'portfolio-title' : 'about-page-title')?.focus({ preventScroll: true })
    } else {
      const targetId = currentLocation.slice(1) || 'home'
      document.getElementById(targetId)?.scrollIntoView({ block: 'start' })
      if (targetId === 'home') document.getElementById('hero-title')?.focus({ preventScroll: true })
    }
  }, [currentLocation, isPortfolioPage, isAboutPage, isProjectPage, selectedProject])

  return (
    <>
      <a className="skip-link" href="#main" onClick={(event) => { event.preventDefault(); document.getElementById('main')?.focus(); document.getElementById('main')?.scrollIntoView({ block: 'start' }) }}>본문으로 바로가기</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label="나의 포트폴리오 홈">
            <span className="brand-symbol" aria-hidden="true">✳</span> my portfolio<span className="brand-dot">.</span>
          </a>
          <nav aria-label="주요 메뉴">
            <a href="#/about" aria-current={isAboutPage ? 'page' : undefined}>자기소개</a>
            <a href="#/portfolio" aria-current={isPortfolioPage || isProjectPage ? 'page' : undefined}>포트폴리오 <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {!isPortfolioPage && !isAboutPage && !isProjectPage && <>
        <section className="hero page-width" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> 금자의 작은 소개 페이지</p>
            <h1 id="hero-title" tabIndex={-1}>어서 와,<br /><span className="underlined">금자는 처음이지?</span></h1>
            <p className="hero-description"><strong>안녕하세요, 금자입니다.</strong><br />발로란트를 비롯한 여러 게임과 잠자기를 좋아해요.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#/portfolio">포트폴리오 보기 <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#/about">어떤 사람인가요? <span aria-hidden="true">→</span></a>
            </div>
            <p className="hero-note"><span aria-hidden="true">✳</span> 게임도 잠도, 내 취향대로!</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-grid" /><div className="art-orbit" /><span className="art-spark">✳</span>
            <div className="floating-label"><span className="status-dot" /> 금자의 취향 모음</div>
            <div className="project-window">
              <div className="window-bar"><span /><span /><span /><p>my-portfolio</p><span className="window-expand">↗</span></div>
              <div className="window-content">
                <span className="window-kicker">게임도 잠도 진심</span>
                <p className="window-title">잘 자고,<br />잘 놀고<span>.</span></p>
                <div className="window-scene"><div className="scene-circle" /><div className="scene-stairs"><i /><i /><i /></div><span>↗</span></div>
                <div className="window-footer"><span>금자의 핫핑크 &amp; 민트</span><span>01 / ∞</span></div>
              </div>
            </div>
            <div className="idea-note"><span>나의 목표</span><p>야무지게 자고<br />야무지게 놀기</p><span className="note-arrow">⤴</span></div>
            <div className="art-caption">게임 <span>＋</span> 잠 <span>＝</span> 금자</div>
          </div>
        </section>
        <div className="section-divider page-width"><span>금자를 조금 더 알아보기</span><span aria-hidden="true">↓</span></div>
        <section className="about-section page-width" id="about" aria-labelledby="about-title">
          <div className="section-heading"><p className="eyebrow">01 / 나에 대하여</p><h2 id="about-title">금자<br />사용 설명서<span>.</span></h2></div>
          <div className="about-content">
            <span className="example-label">금자는 이런 사람</span>
            <h3>함께 어울리고,<br />친구의 이야기를 들어요.</h3>
            <p>친구들과 어울리거나 이야기를 들어주는 편이에요. 게임 실력과 전략도 더 배우고 싶어요.</p>
            <div className="interest-tags"><span># 마라탕</span><span># 제로베이스원</span><span># 친구 이야기</span></div>
            <PersonalGuide />
            <a className="text-link about-more" href="#/about">자기소개 보기 <span aria-hidden="true">→</span></a>
          </div>
        </section>
        <section className="work-invitation">
          <div className="page-width work-invitation-inner">
            <div><p className="eyebrow">02 / 앞으로의 목표</p><h2>야무지게 자고,<br />야무지게 놀기<span>.</span></h2><p className="invitation-description">활동과 작품은 아직 준비 중이에요. 생기면 하나씩 소개할게요.</p></div>
            <a className="button button-primary" href="#/portfolio">포트폴리오 목록 보기 <span aria-hidden="true">↗</span></a>
          </div>
        </section>
        </>}
        {isAboutPage && <section className="about-page page-width" aria-labelledby="about-page-title">
          <a className="text-link list-back" href="#home"><span aria-hidden="true">←</span> 홈으로 돌아가기</a>
          <div className="about-page-heading">
            <p className="eyebrow">금자의 이야기</p>
            <h1 id="about-page-title" tabIndex={-1}>자기소개<span>.</span></h1>
            <p className="list-description">좋아하는 것과 배우는 것, 그리고 앞으로의 나에 대한 이야기.</p>
          </div>
          <div className="about-profile">
            <div className="about-profile-art" aria-hidden="true"><span>✳</span><p>게임도 잠도,<br />내 취향대로.</p><div>핫핑크와 민트,<br />그리고 금자.</div></div>
            <div className="about-content">
              <span className="example-label">금자는 이런 사람</span>
              <h2>안녕하세요,<br />금자입니다<span>.</span></h2>
              <p>발로란트를 비롯한 여러 게임과 잠자기를 좋아해요. 친구들과 어울리고 이야기를 들어주는 편이에요.</p>
              <dl className="about-details">
                <div><dt>관심사와 취미</dt><dd>발로란트도, 다른 게임들도 좋아해요. 잠자기도 빼놓을 수 없어요.</dd></div>
                <div><dt>내가 잘하는 것</dt><dd>친구들과 어울리기, 그리고 친구의 이야기 들어주기.</dd></div>
                <div><dt>배우고 싶은 것</dt><dd>게임 실력과 전략을 더 배우고 싶어요.</dd></div>
                <div><dt>앞으로의 목표</dt><dd>야무지게 자고 야무지게 놀기!</dd></div>
              </dl>
              <section className="personal-guide-section" aria-labelledby="personal-guide-title">
                <h3 id="personal-guide-title">금자 사용 설명서<span>.</span></h3>
                <PersonalGuide />
              </section>
              <a className="button button-primary" href="#/portfolio">포트폴리오 보기 <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>}
        {isPortfolioPage && <section className="portfolio-section portfolio-page" aria-labelledby="portfolio-title">
          <div className="page-width">
            <a className="text-link list-back" href="#home"><span aria-hidden="true">←</span> 홈으로 돌아가기</a>
            <div className="portfolio-heading"><div><p className="eyebrow">금자의 활동과 작품</p><h1 id="portfolio-title" tabIndex={-1}>포트폴리오<span>.</span></h1><p className="list-description">앞으로 채워 갈 금자의 기록이에요.</p></div></div>
            <div className="list-summary"><span>전체 프로젝트</span><span>{projects.length.toString().padStart(2, '0')}</span></div>
            {projects.length === 0 ? <div className="empty-portfolio">
              <span className="empty-symbol" aria-hidden="true">✳</span>
              <h2>아직 준비 중이에요<span>.</span></h2>
              <p>활동이나 작품이 생기면 여기에 소개할게요.</p>
              <a className="button button-primary" href="#/about">금자 먼저 알아보기 <span aria-hidden="true">→</span></a>
            </div> : <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.number}>
                  <a className="project-card-link" href={`#/portfolio/${project.style}`} aria-label={`${project.title} 자세히 보기`}>
                    <ProjectArtwork project={project} />
                    <div className="project-category">{project.category}</div>
                    <h3>{project.title}</h3><p>{project.description}</p>
                    <span className="project-read-more">자세히 보기 <span aria-hidden="true">↗</span></span>
                  </a>
                </article>
              ))}
            </div>}
          </div>
        </section>}
        {isProjectPage && <section className="project-detail page-width" aria-labelledby="project-title">
          <a className="text-link list-back" href="#/portfolio"><span aria-hidden="true">←</span> 포트폴리오 목록으로</a>
          {selectedProject ? <>
            <header className="detail-heading">
              <p className="eyebrow">작품 {selectedProject.number} / {selectedProject.category}</p>
              <h1 id="project-title" tabIndex={-1}>{selectedProject.title}<span>.</span></h1>
              <p className="list-description">{selectedProject.description}</p>
            </header>
            <div className="detail-banner">
              <ProjectArtwork project={selectedProject} className="detail-art" />
              <div className="detail-overview">
                <span className="example-label">금자의 작업</span>
                <h2>프로젝트 소개</h2>
                <p>{selectedProject.overview}</p>
              </div>
            </div>
            <div className="detail-story">
              <section className="detail-story-section" aria-labelledby="project-goal"><h2 id="project-goal"><span>01</span> 왜 만들었나요?</h2><p>{selectedProject.goal}</p></section>
              <section className="detail-story-section" aria-labelledby="project-process"><h2 id="project-process"><span>02</span> 어떻게 만들었나요?</h2><ol>{selectedProject.process.map((step) => <li key={step}>{step}</li>)}</ol></section>
              <section className="detail-story-section" aria-labelledby="project-learning"><h2 id="project-learning"><span>03</span> 무엇을 배웠나요?</h2><p>{selectedProject.learning}</p></section>
            </div>
            <div className="detail-bottom"><p>다른 작업도 둘러보세요.</p><a className="button button-primary" href="#/portfolio">목록으로 돌아가기 <span aria-hidden="true">→</span></a></div>
          </> : <div className="project-not-found"><h1 id="project-title" tabIndex={-1}>프로젝트를 찾을 수 없어요.</h1><p>주소를 확인하거나 포트폴리오 목록에서 작업을 선택해 주세요.</p><a className="button button-primary" href="#/portfolio">포트폴리오 목록 보기 <span aria-hidden="true">→</span></a></div>}
        </section>}
      </main>
      <footer className="site-footer page-width"><a className="wordmark" href="#home">my portfolio<span className="brand-dot">.</span></a><p>나의 이야기는 계속됩니다.</p><button className="back-top" type="button" onClick={() => { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); document.getElementById('main')?.focus({ preventScroll: true }) }}>맨 위로 <span aria-hidden="true">↑</span></button></footer>
    </>
  )
}

export default App
