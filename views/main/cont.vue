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
                  <div class="panel-image" :style="{ backgroundImage: project.bg }">
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const portfolioItems = [
  {
    title: 'Project A',
    meta: 'Web · 2024',
    to: '/works',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    visualOnly: true,
  },
  {
    title: 'KITOKITO',
    meta: '2019/02/23 (SAT) - 03/24 (SUN)',
    metaExtra: 'MONDAY CLOSE · 10:00 - 18:00 AT NOTJUSTLIBRARY',
    to: '/works',
    bg: 'linear-gradient(145deg, #2d132c 0%, #1a1a2e 60%, #16213e 100%)',
  },
  {
    title: 'Project C',
    meta: 'Branding · 2023',
    to: '/works',
    bg: 'linear-gradient(160deg, #0f3460 0%, #1a1a2e 100%)',
  },
  {
    title: 'Project D',
    meta: 'Visual · 2024',
    to: '/works',
    bg: 'linear-gradient(135deg, #16213e 0%, #2d132c 100%)',
  },
  {
    title: 'Project E',
    meta: 'Web · 2023',
    to: '/works',
    bg: 'linear-gradient(145deg, #0f3460 0%, #1a1a2e 100%)',
  },
]

const recentProjects = [
  {
    title: 'Project A — OOH Campaign',
    desc: '2025년 주요 상업지에 OOH 광고를 설치해 진행한 캠페인입니다. 대형 아웃도어와 키오스크를 활용했습니다.',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    title: 'Project B — OOH Campaign',
    desc: '도심 상업지에서 진행한 "저렴하게 사서 빠르게 받는다" 캠페인. OOH 설치를 통해 브랜드 인지도를 높였습니다.',
    bg: 'linear-gradient(145deg, #2d132c 0%, #1a1a2e 60%, #16213e 100%)',
  },
]
// 4면 상자용 (네 면)
const fourFaces = [
  ...recentProjects,
  {
    title: 'Project C — OOH Campaign',
    desc: '시즌 캠페인으로 대형 광고물과 디지털 스크린을 연동해 브랜드 일관성을 강화했습니다.',
    bg: 'linear-gradient(160deg, #0f3460 0%, #1a1a2e 100%)',
  },
  {
    title: 'Project D — OOH Campaign',
    desc: '팝업과 아웃도어를 결합한 통합 캠페인. 오프라인 터치포인트를 확대했습니다.',
    bg: 'linear-gradient(135deg, #16213e 0%, #2d132c 100%)',
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
  const end = start + stageHeight
  const vh = window.innerHeight
  if (end < 0 || start > vh) return
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

/* 바코드: 면 우상단 (이미지 참고) */
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
/* 텍스트: 하단 왼쪽 흰색 테두리 박스 (이미지 참고) */
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
</style>
