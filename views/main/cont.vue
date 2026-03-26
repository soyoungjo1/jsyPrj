<template>
  <section class="portfolio-section">
    <!-- 스크롤 구간: 진입 시 고정, 라벨 분리 → 가운데 이미지 → 4면 우측 이동 → 다음 섹션 -->
    <div
      ref="scrollStageRef"
      class="recent-scroll-stage"
      :style="{ height: scrollStageHeightPx + 'px' }"
    >
      <div class="recent-sticky-viewport">
        <!-- 1. 라벨: 처음엔 붙어 있다가 스크롤 시 양옆으로 이동 -->
        <div class="recent-labels-wrap">
          <span
            class="recent-label recent-label-left"
            :style="{ transform: `translate(calc(-50% + ${labelLeftX}px), -50%)` }"
          >Recent Project</span>
          <span
            class="recent-label recent-label-right"
            :style="{ transform: `translate(calc(-50% + ${labelRightX}px), -50%)` }"
          >4P—Creative—Campaign</span>
        </div>
        <!-- 2. 라벨이 끝에 도달한 뒤 가운데 이미지(4면 스트립) 표시 -->
        <div
          class="recent-center-stage"
          :style="{
            opacity: centerStageOpacity,
            visibility: centerStageOpacity > 0 ? 'visible' : 'hidden',
          }"
        >
          <!-- 4면 상자: 스크롤에 따라 박스 전체가 세로축 기준으로 회전 -->
          <div class="box-3d-wrap">
            <div
              class="box-3d-rotating"
              :style="{ transform: `rotateY(${boxAngleDeg}deg)` }"
            >
              <div
                v-for="(project, i) in fourFaces"
                :key="i"
                class="box-face"
                :style="faceStyle(i)"
              >
                <div class="box-face-inner">
                  <!-- 브라우저 목업 상단 바 -->
                  <div class="panel-browser-bar">
                    <span class="browser-dot dot-red" />
                    <span class="browser-dot dot-yellow" />
                    <span class="browser-dot dot-green" />
                    <span class="browser-url">{{ project.url }}</span>
                    <span class="panel-num">{{ String(i + 1).padStart(2, '0') }}</span>
                  </div>
                  <!-- ASCII 로고 영역 -->
                  <div class="panel-ascii-area">
                    <template v-if="project.logo">
                      <img
                        :id="`logo-img-${i}`"
                        :src="project.logo"
                        :alt="project.title"
                        class="logo-source"
                        crossorigin="anonymous"
                      />
                      <pre :id="`logo-pre-${i}`" class="logo-ascii"></pre>
                    </template>
                    <template v-else>
                      <pre class="logo-ascii logo-ascii-deco">{{ visualDesignAscii }}</pre>
                    </template>
                  </div>
                  <!-- 프로젝트 정보 -->
                  <div class="panel-info">
                    <span class="panel-date">{{ project.date }}</span>
                    <h3 class="panel-title">{{ project.title }}</h3>
                    <p class="panel-desc">{{ project.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 다음 영역: 스크롤로 여기까지 오면 슬라이드(이미지 → 호버 시 아스키 아트) -->
    <PortfolioSlider :items="portfolioItems" />
  </section>

  <!-- ── Section A: Marquee ticker ───────────────────── -->
  <div class="ticker-wrap">
    <div class="ticker-track">
      <span class="ticker-item">FRONTEND DEVELOPER</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">WEB DEVELOPMENT</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">VISUAL DESIGN</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">6+ YEARS</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">SEOUL KR</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">JSY · 조소영</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">FRONTEND DEVELOPER</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">WEB DEVELOPMENT</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">VISUAL DESIGN</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">6+ YEARS</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">SEOUL KR</span>
      <span class="ticker-sep">◈</span>
      <span class="ticker-item">JSY · 조소영</span>
      <span class="ticker-sep">◈</span>
    </div>
  </div>

  <!-- ── Section B: About Teaser ─────────────────────── -->
  <section class="about-teaser">
    <div class="about-teaser-inner">
      <!-- Left: display text -->
      <div class="about-teaser-left">
        <p class="about-display">디자인부터</p>
        <p class="about-display">개발까지.</p>
      </div>

      <!-- Right: stats + CTA -->
      <div class="about-teaser-right">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">6+</span>
            <span class="stat-label">years</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">3</span>
            <span class="stat-label">companies</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">2161</span>
            <span class="stat-label">commits</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">17+</span>
            <span class="stat-label">sites</span>
          </div>
        </div>
        <a href="/about" class="about-cta">→ about.me</a>
      </div>
    </div>
  </section>

  <!-- ── Section C: Footer ────────────────────────────── -->
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="footer-name-en">JSY</span>
          <span class="footer-name-kr">조소영 · Frontend Dev</span>
        </div>
        <nav class="footer-nav">
          <a href="/works/web" class="footer-nav-link">works</a>
          <span class="footer-nav-sep">·</span>
          <a href="/about" class="footer-nav-link">about</a>
          <span class="footer-nav-sep">·</span>
          <a href="/docs" class="footer-nav-link">docs</a>
        </nav>
        <a href="mailto:soyoung.j.dev@gmail.com" class="footer-email">↗ email</a>
      </div>
      <div class="footer-meta">
        <span class="footer-period">2018 → 2026 · Seoul KR</span>
      </div>
      <div class="footer-rule" />
      <p class="footer-copy">©2026 JSY. Built with Nuxt 3.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useAsciiArt } from '~/composables/useAsciiArt'

const portfolioItems = [
  { title: '드시모네몰', meta: 'Commerce · Vue / Nuxt · 2023–', to: '/works/web', image: '/portfolio/web_list3_lichtzen.jpg' },
  { title: 'Agency Sites', meta: 'Web Design · HTML/CSS · 2018–21', to: '/works/web', image: '/portfolio/web_list1_icall.jpg' },
  { title: 'Visual Design', meta: 'Graphic · Photoshop · 2021–23', to: '/works/visual', image: '/portfolio/visual_list5_histore.jpg' },
  { title: 'Brand Identity', meta: 'Logo · After Effects · 2021–23', to: '/works/visual', image: '/portfolio/visual_list7_iscream_logo.jpg' },
  { title: 'Campaign', meta: 'Planning · Illustrator · 2022', to: '/works/visual', image: '/portfolio/visual_list4_iscream_planning.jpg' },
]

const { convertImageToAscii } = useAsciiArt()

const visualDesignAscii = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░                             ░
░   V  I  S  U  A  L          ░
░                             ░
░   D  E  S  I  G  N          ░
░                             ░
░   Photoshop · Illustrator   ░
░   After Effects             ░
░                             ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`.trim()

// 4면 상자용 (네 면)
const fourFaces = [
  {
    title: '헥토헬스케어',
    date: '2023.09 ~',
    desc: 'PHP → Vue.js → Nuxt.js SSR 전환. 정기구독·결제·VIP 라운지 전 영역 구축. 2,161 commits.',
    logo: '/main/hecto_logo.png',
    url: 'hecto-healthcare.com',
  },
  {
    title: '아이스크림몰',
    date: '2021.03 ~ 2023.08',
    desc: '이커머스 전 영역 개발. 상세페이지·기획전·이벤트 페이지 등 다수 구축.',
    logo: '/main/iscream_logo.png',
    url: 'iscreammall.com',
  },
  {
    title: '올하우',
    date: '2020.05 ~ 2021.02',
    desc: '인테리어 플랫폼 반응형 웹 전체 구축 및 앱 웹뷰 대응.',
    logo: '/main/allhow_logo.png',
    url: 'allhow.co.kr',
  },
  {
    title: 'Visual Design',
    date: '2021 ~ 2023',
    desc: '상세페이지·기획전·로고·브랜드 아이덴티티 디자인. Photoshop · Illustrator · After Effects.',
    logo: null,
    url: 'works / visual',
  },
]

const scrollStageRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)

/** 스크롤 구간 높이 = 뷰포트 높이 × 배율 (고정 400vh 대신 계산) */
const SCROLL_STAGE_MULTIPLIER = 4
const scrollStageHeightPx = ref(3600) // 초기값(대략 4×900px), onResize에서 실제값으로 갱신

const PHASE_LABEL_END = 0.2
const PHASE_CENTER_START = 0.2
const PHASE_CENTER_END = 0.28
const PHASE_STRIP_START = 0.28
const PHASE_STRIP_END = 1

let viewportWidth = 1200

function clamp (v: number, a: number, b: number) {
  return Math.max(a, Math.min(v, b))
}

function lerp (t: number, from: number, to: number) {
  return from + (to - from) * t
}

const labelLeftX = ref(0)
const labelRightX = ref(0)
const centerStageOpacity = ref(0)

function updateFromProgress (p: number) {
  scrollProgress.value = p
  const t = p

  // 1. 라벨: 0 ~ PHASE_LABEL_END 구간에서 중앙(0) → 왼쪽(-거리), 오른쪽(+거리)
  const labelT = clamp(t / PHASE_LABEL_END, 0, 1)
  const labelDist = viewportWidth * 0.35
  labelLeftX.value = lerp(labelT, 0, -labelDist)
  labelRightX.value = lerp(labelT, 0, labelDist)

  // 2. 가운데 이미지: 라벨이 끝난 뒤 페이드인
  const centerT = clamp((t - PHASE_CENTER_START) / (PHASE_CENTER_END - PHASE_CENTER_START), 0, 1)
  centerStageOpacity.value = centerT

  // 3. 4면 상자: 스크롤 진행률 → 박스 전체 회전 각도 (0 ~ 360deg)
  const stripT = clamp((t - PHASE_STRIP_START) / (PHASE_STRIP_END - PHASE_STRIP_START), 0, 1)
  boxAngleDeg.value = stripT * 360
}

const boxAngleDeg = ref(0)
const boxFaceRadius = ref(180)

function faceStyle (i: number) {
  return {
    transform: `rotateY(${-i * 90}deg) translateZ(${boxFaceRadius.value}px)`,
  }
}

function onScroll () {
  if (!scrollStageRef.value) return
  const el = scrollStageRef.value
  const rect = el.getBoundingClientRect()
  const stageHeight = el.offsetHeight
  const start = rect.top
  const vh = window.innerHeight
  if (start + stageHeight < 0 || start > vh) return
  const scrolled = -start
  const p = clamp(scrolled / stageHeight, 0, 1)
  updateFromProgress(p)
}

function onResize () {
  if (typeof window === 'undefined') return
  viewportWidth = window.innerWidth
  scrollStageHeightPx.value = window.innerHeight * SCROLL_STAGE_MULTIPLIER
  boxFaceRadius.value = viewportWidth <= 720 ? Math.min(160, viewportWidth * 0.42) : 180
}

onMounted(() => {
  onResize()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)

  // 로고 → ASCII 변환
  nextTick(() => {
    fourFaces.forEach((face, i) => {
      if (!face.logo) return
      const img = document.getElementById(`logo-img-${i}`) as HTMLImageElement
      if (!img) return
      const doConvert = () => convertImageToAscii(`logo-img-${i}`, `logo-pre-${i}`, undefined, undefined, 62, 120)
      if (img.complete && img.naturalWidth > 0) {
        doConvert()
      } else {
        img.addEventListener('load', doConvert)
      }
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.portfolio-section {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fafafa;
}
/* Recent Project 스크롤 구간: 높이는 JS에서 scrollStageHeightPx 로 계산 (기본 4×뷰포트) */
.recent-scroll-stage {
  min-height: 100vh;
  background: #0a0a0a;
}
.recent-sticky-viewport {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #0a0a0a;
}
.recent-labels-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.recent-label-left,
.recent-label-right {
  position: absolute;
  left: 50%;
  top: 50%;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.15em;
  color: #555;
  white-space: nowrap;
  transition: transform 0.05s linear;
}
.recent-center-stage {
  position: relative;
  width: 100%;
  max-width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px 40px;
  transition: opacity 0.25s ease;
}

/* 4면 상자: 스크롤에 따라 박스 전체가 세로축 기준으로 회전 */
.box-3d-wrap {
  perspective: 1400px;
  perspective-origin: 50% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 480px;
}
.box-3d-rotating {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ── 큐브 면 ── */
.box-face {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 360px;
  height: 460px;
  margin-left: -180px;
  margin-top: -230px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  pointer-events: none;
}
.box-face-inner {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0,0,0,0.55);
}

/* ── 브라우저 목업 상단 바 ── */
.panel-browser-bar {
  flex-shrink: 0;
  height: 34px;
  background: #1c1c1e;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
}
.browser-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-red    { background: #ff5f57; }
.dot-yellow { background: #febc2e; }
.dot-green  { background: #28c840; }
.browser-url {
  flex: 1;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 9px;
  color: #666;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.panel-num {
  font-family: var(--font-mono);
  font-size: 9px;
  color: #444;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}

/* ── ASCII 로고 영역 ── */
.panel-ascii-area {
  flex: 1;
  min-height: 0;
  background: #0d0d0d;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 24px 18px;
  position: relative;
}

.logo-source {
  display: none;
}

.logo-ascii {
  font-family: var(--font-mono);
  font-size: 7px;
  line-height: 1.15;
  color: rgba(255, 255, 255, 0.85);
  white-space: pre;
  margin: 0;
  padding: 0;
  text-align: center;
  letter-spacing: 0.04em;
}

.logo-ascii-deco {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.06em;
}

/* ── 하단 프로젝트 정보 ── */
.panel-info {
  flex-shrink: 0;
  padding: 16px 18px 18px;
  background: #fff;
  border-top: 1px solid #ebebeb;
}
.panel-date {
  display: block;
  font-family: var(--font-mono);
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.08em;
  margin-bottom: 5px;
}
.panel-title {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.02em;
  margin: 0 0 7px 0;
}
.panel-desc {
  font-size: 11px;
  line-height: 1.6;
  color: #777;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@media (max-width: 720px) {
  .box-face {
    width: 85vw;
    max-width: 320px;
    height: 400px;
    margin-left: calc(-0.5 * min(85vw, 320px));
    margin-top: -200px;
  }
}

/* ── Section A: Ticker ──────────────────────────── */
.ticker-wrap {
  background: #111111;
  border-top: 1px solid #222222;
  border-bottom: 1px solid #222222;
  height: 48px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.ticker-track {
  display: flex;
  align-items: center;
  gap: 0;
  white-space: nowrap;
  animation: ticker 18s linear infinite;
  will-change: transform;
}

.ticker-item {
  font-family: var(--font-mono);
  font-size: 11px;
  color: #f5f5f4;
  letter-spacing: 0.15em;
  padding: 0 16px;
}

.ticker-sep {
  font-size: 10px;
  color: #444444;
  flex-shrink: 0;
}

@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── Section B: About Teaser ────────────────────── */
.about-teaser {
  background: #f5f5f4;
  border-bottom: 1px solid #e0e0e0;
}

.about-teaser-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 80px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.about-teaser-left {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.about-display {
  font-family: var(--font-sans);
  font-size: clamp(48px, 7vw, 96px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.0;
  color: #111111;
  margin: 0;
}

.about-teaser-right {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: clamp(28px, 3.5vw, 48px);
  font-weight: 700;
  color: #111111;
  letter-spacing: -0.03em;
  line-height: 1;
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #888888;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.about-cta {
  font-family: var(--font-mono);
  font-size: 11px;
  color: #111111;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #111111;
  padding-bottom: 2px;
  text-decoration: none;
  align-self: flex-start;
  transition: opacity 0.15s;
}

.about-cta:hover {
  opacity: 0.5;
}

@media (max-width: 720px) {
  .about-teaser-inner {
    grid-template-columns: 1fr;
    padding: 56px 24px;
    gap: 40px;
  }
}

/* ── Section C: Footer ──────────────────────────── */
.site-footer {
  background: #111111;
  color: #f5f5f4;
}

.footer-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-name-en {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  color: #f5f5f4;
  letter-spacing: 0.1em;
}

.footer-name-kr {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #888888;
  letter-spacing: 0.06em;
}

.footer-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-nav-link {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #888888;
  text-decoration: none;
  letter-spacing: 0.06em;
  transition: opacity 0.15s;
}

.footer-nav-link:hover {
  opacity: 1;
  color: #f5f5f4;
}

.footer-nav-sep {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #333333;
}

.footer-email {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #888888;
  text-decoration: none;
  letter-spacing: 0.06em;
  transition: color 0.15s;
}

.footer-email:hover {
  color: #f5f5f4;
}

.footer-meta {
  display: flex;
  align-items: center;
}

.footer-period {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #444444;
  letter-spacing: 0.06em;
}

.footer-rule {
  height: 1px;
  background: #222222;
  margin: 8px 0 0;
}

.footer-copy {
  font-family: var(--font-mono);
  font-size: 9px;
  color: #444444;
  letter-spacing: 0.06em;
  margin: 0;
}
</style>
