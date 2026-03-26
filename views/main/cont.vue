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
                  <div class="panel-barcode panel-barcode-tr">
                    <span v-for="n in 12" :key="n" class="bar" :style="{ height: 10 + (n % 3) * 3 + 'px' }" />
                    <span class="barcode-num">{{ barcodeForFace(i) }}</span>
                  </div>
                  <div class="panel-image" :style="{ background: project.bg }">
                    <div class="panel-overlay" />
                  </div>
                  <div class="panel-copy panel-copy-outline">
                    <h3 class="panel-title">{{ project.title }}</h3>
                    <span class="panel-meta">-25</span>
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
import { ref, onMounted, onUnmounted } from 'vue'

const portfolioItems = [
  { title: '드시모네몰', meta: 'Commerce · Vue / Nuxt · 2023–', to: '/works/web', image: '/portfolio/web_list3_lichtzen.jpg' },
  { title: 'Agency Sites', meta: 'Web Design · HTML/CSS · 2018–21', to: '/works/web', image: '/portfolio/web_list1_icall.jpg' },
  { title: 'Visual Design', meta: 'Graphic · Photoshop · 2021–23', to: '/works/visual', image: '/portfolio/visual_list5_histore.jpg' },
  { title: 'Brand Identity', meta: 'Logo · After Effects · 2021–23', to: '/works/visual', image: '/portfolio/visual_list7_iscream_logo.jpg' },
  { title: 'Campaign', meta: 'Planning · Illustrator · 2022', to: '/works/visual', image: '/portfolio/visual_list4_iscream_planning.jpg' },
]

// 4면 상자용 (네 면)
const fourFaces = [
  {
    title: '드시모네몰 — Commerce',
    desc: 'PHP → Vue.js → Nuxt.js SSR 전환. 정기구독·결제·VIP 라운지 전 영역 구축. 2,161 commits.',
    bg: 'url(/portfolio/web_list3_lichtzen.jpg) center/cover',
  },
  {
    title: '또박케어 — App WebView',
    desc: '건강관리 앱 웹뷰 화면 개발. 산소지수 시각화, 포인트 교환소, 머니퀴즈 등.',
    bg: 'url(/portfolio/web_list4_jeongwha.jpg) center/cover',
  },
  {
    title: 'Agency Sites — 17 Works',
    desc: '반응형 홈페이지 17개 기획부터 납품까지 1인 풀사이클. 제조·의료·건축·에너지 등 다양한 업종.',
    bg: 'url(/portfolio/web_list5_younginace.jpg) center/cover',
  },
  {
    title: 'Visual Design',
    desc: '상세페이지·기획전·로고·브랜드 아이덴티티 디자인. Photoshop · Illustrator · After Effects.',
    bg: 'url(/portfolio/visual_list5_histore.jpg) center/cover',
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
const boxFaceRadius = ref(175)

function faceStyle (i: number) {
  return {
    transform: `rotateY(${-i * 90}deg) translateZ(${boxFaceRadius.value}px)`,
  }
}
function barcodeForFace (i: number) {
  return `2025Y${String(i + 1).padStart(3, '0')}25`
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
  boxFaceRadius.value = viewportWidth <= 720 ? Math.min(160, viewportWidth * 0.42) : 175
}

onMounted(() => {
  onResize()   // scrollStageHeightPx 등 계산
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
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
  min-height: 360px;
}
.box-3d-rotating {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}
.box-face {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  height: 320px;
  margin-left: -175px;
  margin-top: -160px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  pointer-events: none;
}
.box-face-inner {
  width: 100%;
  height: 100%;
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.18);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 3px;
}

/* 바코드: 면 우상단 */
.panel-barcode.panel-barcode-tr {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  height: auto;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: none;
  border-left: 1px solid rgba(255,255,255,0.15);
  border-bottom-left-radius: 4px;
}
.panel-barcode-tr .bar {
  display: block;
}
.panel-barcode-tr .barcode-num {
  margin-left: 0;
  margin-top: 4px;
  font-size: 10px;
  color: rgba(255,255,255,0.8);
}
.panel-barcode .bar {
  width: 3px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 1px;
}
.panel-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex: 1;
  min-height: 120px;
}
.panel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%);
}
/* 텍스트: 하단 왼쪽 흰색 테두리 박스 */
.panel-copy.panel-copy-outline {
  padding: 12px 14px 16px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 2px;
  margin: 10px;
  margin-top: auto;
  max-width: calc(100% - 20px);
}
.panel-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin: 0 0 4px 0;
  color: #fff;
}
.panel-meta {
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 6px;
  display: block;
}
.panel-desc {
  font-size: 11px;
  line-height: 1.45;
  color: rgba(255,255,255,0.85);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@media (max-width: 720px) {
  .box-face {
    width: 85vw;
    max-width: 320px;
    height: 300px;
    margin-left: calc(-0.5 * min(85vw, 320px));
    margin-top: -150px;
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
