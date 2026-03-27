<template>
  <section class="portfolio-section">
    <!-- 스크롤 구간: 진입 시 고정, 라벨 분리 → 가운데 이미지 → 4면 우측 이동 → 다음 섹션 -->
    <div
      ref="scrollStageRef"
      class="recent-scroll-stage"
      :style="{ height: scrollStageHeightPx + 'px' }"
    >
      <div class="recent-sticky-viewport">
        <!-- 상단 좌측 타이틀 (asciiArt.vue .title.top-left 와 유사) -->
        <h1 class="section-title-top-left">Recent.Project</h1>

        <!-- 1. 라벨: 처음엔 붙어 있다가 스크롤 시 양옆으로 이동 -->
        <div class="recent-labels-wrap">
          <span
            class="recent-label recent-label-left"
            :style="{ transform: `translate(calc(-50% + ${labelLeftX}px), -50%)` }"
          >Featured Work</span>
          <span
            class="recent-label recent-label-right"
            :style="{ transform: `translate(calc(-50% + ${labelRightX}px), -50%)` }"
          >Commerce · Vue · Nuxt</span>
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import type { AsciiFilterOptions } from '~/composables/useAsciiFilter'
import { useAsciiArt } from '~/composables/useAsciiArt'

/** 로고 ASCII 필터. `undefined`면 필터 없음(기존과 동일). 적용할 때만 객체 할당.
 *  예: `import { ASCII_FILTER_PRESET_ONLINE } from '~/composables/useAsciiFilter'` 후
 *      `logoAsciiFilters = { ...ASCII_FILTER_PRESET_ONLINE }` — 가로는 `LOGO_ASCII_MAX_W`를 87 등으로 조절
 */
const logoAsciiFilters: AsciiFilterOptions | undefined = undefined

const LOGO_ASCII_MAX_W = 62
const LOGO_ASCII_MAX_H = 120

const portfolioItems = [
  { title: '드시모네몰', meta: 'Commerce · Vue / Nuxt · 2023–', to: '/works/web', image: '/portfolio/web_list3_lichtzen.jpg' },
  { title: 'Agency Sites', meta: 'Web Design · HTML/CSS · 2018–21', to: '/works/web', image: '/portfolio/web_list1_icall.jpg' },
  { title: 'Visual Design', meta: 'Graphic · Photoshop · 2021–23', to: '/works/visual', image: '/portfolio/visual_list5_histore.jpg' },
  { title: 'Brand Identity', meta: 'Logo · After Effects · 2021–23', to: '/works/visual', image: '/portfolio/visual_list7_iscream_logo.jpg' },
  { title: 'Campaign', meta: 'Planning · Illustrator · 2022', to: '/works/visual', image: '/portfolio/visual_list4_iscream_planning.jpg' },
]

const { convertImageToAscii } = useAsciiArt()

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
    logo: '/main/visual_logo.png',
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
      const doConvert = () =>
        convertImageToAscii(`logo-img-${i}`, `logo-pre-${i}`, undefined, undefined, LOGO_ASCII_MAX_W, LOGO_ASCII_MAX_H, logoAsciiFilters)
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

.section-title-top-left {
  position: absolute;
  top: 5%;
  left: 5%;
  z-index: 10;
  margin: 0;
  pointer-events: none;
  font-family: var(--font-mono);
  font-size: clamp(18px, 2.8vw, 32px);
  font-weight: 400;
  letter-spacing: 0.02em;
  color: #e8e8e6;
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
  border-radius: 0;
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

/* ── 하단 프로젝트 정보 (네 면 동일 높이) ── */
.panel-info {
  flex-shrink: 0;
  box-sizing: border-box;
  height: 152px;
  padding: 12px 18px 14px;
  background: #fff;
  border-top: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
}
.panel-date {
  display: block;
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
  line-height: 1.2;
}
.panel-title {
  flex-shrink: 0;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
  line-height: 1.3;
  min-height: 2.6em;
  max-height: 2.6em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.panel-desc {
  flex-shrink: 0;
  height: calc(11px * 1.55 * 2);
  font-size: 11px;
  line-height: 1.55;
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
</style>
