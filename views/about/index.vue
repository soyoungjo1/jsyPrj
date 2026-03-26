<template>
  <div class="about-page">

    <!-- ── DOT MATRIX HERO ─────────────────────────────── -->
    <section class="hero">
      <canvas ref="dotCanvas" class="dot-canvas" />

      <!-- 좌측 하단 캡션 -->
      <div class="hero-caption left">
        <span class="caption-line">Seoul, KR</span>
        <span class="caption-line">Frontend Developer</span>
        <span class="caption-line">since 2018</span>
      </div>

      <!-- 우측 하단 캡션 -->
      <div class="hero-caption right">
        <span class="caption-line">Design × Development</span>
        <span class="caption-line">조소영 / JSY</span>
      </div>

      <!-- 하단 스크롤 힌트 -->
      <div class="hero-scroll">
        <span class="scroll-text">scroll</span>
        <span class="scroll-arrow">↓</span>
      </div>
    </section>

    <!-- ── BIO ──────────────────────────────────────────── -->
    <section class="bio-section">
      <div class="bio-inner">
        <div class="bio-label">// about.me</div>
        <p class="bio-text">
          디자인부터 개발까지,<br />
          웹의 처음부터 끝을 만드는<br />
          프론트엔드 개발자 조소영입니다.
        </p>
        <div class="bio-stats">
          <div class="stat-item">
            <span class="stat-num">6+</span>
            <span class="stat-label">years</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">3</span>
            <span class="stat-label">companies</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">2161</span>
            <span class="stat-label">commits</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">17+</span>
            <span class="stat-label">sites built</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CAREER ────────────────────────────────────────── -->
    <section class="career-section">
      <div class="section-label-row">
        <span class="section-label">[ career ]</span>
        <div class="section-rule" />
      </div>

      <div
        v-for="(career, ci) in careers"
        :key="ci"
        class="career-row"
        data-aos="fade-up"
        :data-aos-delay="ci * 60"
      >
        <!-- 좌: 연도 + 회사 -->
        <div class="career-left">
          <span class="career-period">{{ career.periodShort }}</span>
          <h3 class="career-company">{{ career.company }}</h3>
          <span class="career-role">{{ career.role }}</span>
          <span class="career-rank">{{ career.rank }}&nbsp;·&nbsp;{{ career.team }}</span>
        </div>

        <!-- 우: 프로젝트 상세 -->
        <div class="career-right">
          <!-- 스택 -->
          <div class="career-stacks">
            <span v-for="s in career.stacks" :key="s" class="c-badge">{{ s }}</span>
          </div>

          <!-- 프로젝트 -->
          <div
            v-for="(proj, pi) in career.projects"
            :key="pi"
            class="proj"
          >
            <div class="proj-head">
              <span class="proj-dot">●</span>
              <span class="proj-name">{{ proj.name }}</span>
              <span v-if="proj.period" class="proj-period">{{ proj.period }}</span>
            </div>
            <ul class="proj-list">
              <li v-for="(t, ti) in proj.tasks" :key="ti">{{ t }}</li>
            </ul>
            <div v-if="proj.stats?.length" class="proj-stats">
              <span v-for="(s, si) in proj.stats" :key="si" class="stat-line">→ {{ s }}</span>
            </div>
          </div>
        </div>

        <div class="career-divider" />
      </div>
    </section>

    <!-- ── SKILLS ──────────────────────────────────────── -->
    <section class="skills-section">
      <div class="section-label-row">
        <span class="section-label">[ stack ]</span>
        <div class="section-rule" />
      </div>

      <div class="skills-grid" data-aos="fade-up">
        <div
          v-for="(group, gi) in skillGroups"
          :key="gi"
          class="skill-row"
        >
          <span class="skill-cat">{{ group.label }}</span>
          <div class="skill-tags">
            <span v-for="s in group.items" :key="s" class="s-tag">{{ s }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FOOTER MARK ────────────────────────────────── -->
    <div class="about-footer">
      <span class="footer-text">©&nbsp;JSY&nbsp;·&nbsp;FRONTEND&nbsp;DEVELOPER&nbsp;·&nbsp;2026</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/* ── Data ────────────────────────────────────────────── */
interface Project {
  name: string
  period?: string
  tasks: string[]
  stats?: string[]
}
interface Career {
  period: string
  periodShort: string
  company: string
  role: string
  rank: string
  team: string
  stacks: string[]
  projects: Project[]
}
interface SkillGroup {
  label: string
  items: string[]
}

const careers: Career[] = [
  {
    period: '2023.12 ~ 현재',
    periodShort: '2023—',
    company: '㈜헥토헬스케어',
    role: 'Frontend Developer',
    rank: '선임연구원',
    team: '서비스운영팀',
    stacks: ['Vue 3', 'Nuxt 3 (SSR)', 'TypeScript', 'Pinia', 'Vuetify 3', 'SCSS', 'Vite'],
    projects: [
      {
        name: '드시모네몰 — PHP → Vue.js 리뉴얼',
        period: '2023.12~2024.09',
        tasks: [
          'PHP 기반 스토어를 Vue.js로 전면 리뉴얼, 클라이언트 렌더링 방식으로 전환',
          'SPA SEO 한계 해결: vite-prerender-plugin 도입',
          'Amplitude · Airbridge · FlareLane · GA4 · Meta Pixel 등 마케팅 스크립트 통합',
          '등급별 할인 적립금 전환 로직 개선, 복합 장바구니·이벤트 페이지 개발',
        ],
      },
      {
        name: '드시모네몰 — Vue.js → Nuxt.js SSR 전환 및 고도화',
        period: '2024.09~현재',
        tasks: [
          'Nuxt.js SSR 전환, Composition API 전면 적용으로 SEO 최적화',
          '마이페이지 전 영역 구축 (주문/배송·취소·반품·교환)',
          '정기구독 고도화 — 합배송·건너뛰기·결제일 변경·해지 플로우 전체 구현',
          '토스페이·라운드페이 추가 (PC·모바일), iframe↔postMessage 팝업 설계',
          '가상계좌·복합결제·취소/재결제 구현, Vitest 단위 테스트 작성',
          'CS AI 챗봇 연동 (SSE 스트림, Nuxt Server API 프록시 구조)',
          'VIP 라운지 시스템 — 등급 기반 접근권한·이벤트·출석체크',
          'Amplitude 등 10개 마케팅 플랫폼 전 페이지 이벤트 설계·연동',
          'XSS 방어 (DOMPurify), 텔레그램 에러 알림 시스템 구축',
          'Husky + commitlint + 깃모지 팀 커밋 컨벤션 체계 구축',
        ],
        stats: [
          'PC 커밋 1,086건 / 모바일 커밋 1,075건 (합계 약 2,161건)',
          '코드 추가 +80,229줄 / 삭제 -42,485줄',
        ],
      },
      {
        name: '또박케어 앱 — 건강관리 앱 웹뷰 화면',
        period: '2023.12~현재',
        tasks: [
          '나의 산소지수 — 워치 혈중 산소 데이터 시각화',
          '포인트 교환소 — 스토어 상품·정기구독 쿠폰 교환',
          '분석 설계 화면 · 머니퀴즈 · 또박한팩 서비스 · 가족 데이터 관리',
          '앱 환경 마케팅 스크립트 최적화 (웹·앱 환경 분기 처리)',
        ],
      },
    ],
  },
  {
    period: '2021.08 ~ 2023.09',
    periodShort: '2021—23',
    company: '㈜아이스크림미디어',
    role: 'Frontend Developer',
    rank: '대리',
    team: '커머스 운영팀',
    stacks: ['HTML', 'CSS', 'JavaScript', 'After Effects'],
    projects: [
      {
        name: '자체 쇼핑몰 플랫폼 운영',
        tasks: [
          'HTML/CSS 마크업 및 JavaScript 인터랙션 구현',
          '지출 증빙 서류 발행 관리자·입점사 페이지 신규 개발',
          '기획전 페이지 개발 — 영상 삽입 및 노출 방식 개선으로 클릭률 향상',
          '증빙서류·합배송·무료배송 안내 페이지 리디자인',
        ],
      },
      {
        name: 'GIF 애니메이션 제작 (After Effects)',
        tasks: [
          '기획전·상세페이지 모션 제작으로 클릭률 기여',
          '브랜드 로고 GIF 제작 (아이덴티티 강화)',
        ],
      },
    ],
  },
  {
    period: '2018.11 ~ 2021.08',
    periodShort: '2018—21',
    company: '올하우㈜',
    role: '웹디자이너 · 퍼블리셔',
    rank: '사원',
    team: '웹개발팀',
    stacks: ['HTML5', 'CSS3', 'jQuery', 'Photoshop', 'Illustrator'],
    projects: [
      {
        name: '반응형 홈페이지 17개 1인 풀사이클',
        tasks: [
          'UI/UX 디자인(Photoshop/Illustrator) → HTML/CSS 마크업 → jQuery 인터랙션',
          '자체 CMS 연동, 호스팅·도메인 연결까지 전 과정 단독 수행',
          '제조·의료·건축·에너지 등 다양한 업종, 총 17개 사이트 납품',
          '요구사항 수렴·수정 피드백·납품 클라이언트 대응 전담',
        ],
      },
    ],
  },
]

const skillGroups: SkillGroup[] = [
  {
    label: 'Frontend',
    items: ['Vue 3', 'Nuxt 3 (SSR)', 'TypeScript', 'JavaScript', 'Pinia', 'Vuetify 3', 'SCSS', 'Swiper', 'GSAP', 'VueUse'],
  },
  {
    label: 'Prior',
    items: ['HTML5', 'CSS3', 'jQuery', 'Photoshop', 'Illustrator', 'After Effects'],
  },
  {
    label: 'Test / DX',
    items: ['Vitest', '@vue/test-utils', 'Husky', 'commitlint', 'Vite'],
  },
  {
    label: 'Analytics',
    items: ['Amplitude', 'Airbridge', 'FlareLane', 'GTM', 'Facebook Pixel', 'Kakao Pixel', 'Naver WCS'],
  },
  {
    label: 'Tools',
    items: ['Git', 'Figma', 'Jira', 'DOMPurify', 'DayJS', 'Axios'],
  },
]

/* ── Dot Matrix Canvas ───────────────────────────────── */
const dotCanvas = ref<HTMLCanvasElement | null>(null)

interface Dot { x: number; y: number; base: number; r: number }
let dots: Dot[] = []
let rafId: number | null = null
const mouse = { x: -9999, y: -9999 }
const BG = '#f5f5f4'
const DOT_COLOR = '#111111'

const buildDots = () => {
  const canvas = dotCanvas.value
  if (!canvas || typeof window === 'undefined') return

  const W = window.innerWidth
  const H = Math.round(W * 0.38)
  canvas.width = W * devicePixelRatio
  canvas.height = H * devicePixelRatio
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'

  const ctx = canvas.getContext('2d')!
  ctx.scale(devicePixelRatio, devicePixelRatio)

  /* 1. 오프스크린 캔버스에 텍스트 렌더 */
  const off = document.createElement('canvas')
  off.width = W
  off.height = H
  const offCtx = off.getContext('2d')!

  offCtx.fillStyle = BG
  offCtx.fillRect(0, 0, W, H)

  const text = 'JSY'
  let fontSize = 80
  const fontFace = '"Arial Black", "Impact", sans-serif'
  offCtx.font = `900 ${fontSize}px ${fontFace}`
  while (offCtx.measureText(text).width < W * 0.82 && fontSize < 1600) {
    fontSize += 8
    offCtx.font = `900 ${fontSize}px ${fontFace}`
  }

  offCtx.fillStyle = DOT_COLOR
  offCtx.textAlign = 'center'
  offCtx.textBaseline = 'middle'
  offCtx.fillText(text, W / 2, H / 2)

  const { data } = offCtx.getImageData(0, 0, W, H)

  /* 2. 도트 위치 계산 */
  dots = []
  const gap = Math.max(7, Math.round(W / 160))
  const baseR = gap * 0.36

  for (let y = gap / 2; y < H; y += gap) {
    for (let x = gap / 2; x < W; x += gap) {
      const idx = (Math.round(y) * W + Math.round(x)) * 4
      const r = data[idx] ?? 255
      const g = data[idx + 1] ?? 255
      const b = data[idx + 2] ?? 255
      const brightness = (r + g + b) / 3
      if (brightness < 100) {
        dots.push({ x, y, base: baseR, r: baseR })
      }
    }
  }

  draw()
}

const draw = () => {
  const canvas = dotCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  const W = canvas.width / devicePixelRatio
  const H = canvas.height / devicePixelRatio

  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = DOT_COLOR

  const RADIUS = Math.min(W, H) * 0.12

  for (const d of dots) {
    const dx = d.x - mouse.x
    const dy = d.y - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const factor = Math.max(0, 1 - dist / RADIUS)
    // 마우스 근처: 도트 축소(구멍처럼)
    d.r = d.base * (1 - factor * 0.72)

    ctx.beginPath()
    ctx.arc(d.x, d.y, Math.max(0.5, d.r), 0, Math.PI * 2)
    ctx.fill()
  }
}

const onMouseMove = (e: MouseEvent) => {
  const canvas = dotCanvas.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

const onMouseLeave = () => {
  mouse.x = -9999
  mouse.y = -9999
}

const loop = () => {
  draw()
  rafId = requestAnimationFrame(loop)
}

const onResize = () => {
  buildDots()
}

onMounted(() => {
  buildDots()
  rafId = requestAnimationFrame(loop)
  window.addEventListener('resize', onResize)
  dotCanvas.value?.addEventListener('mousemove', onMouseMove)
  dotCanvas.value?.addEventListener('mouseleave', onMouseLeave)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  dotCanvas.value?.removeEventListener('mousemove', onMouseMove)
  dotCanvas.value?.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<style scoped lang="scss">
/* ── 변수 ──────────────────────────────────────────── */
$bg: #f5f5f4;
$ink: #111111;
$muted: #888888;
$light: #cccccc;
$rule: #e0e0e0;
$mono: var(--font-mono);
$sans: var(--font-sans);

/* ── 베이스 ────────────────────────────────────────── */
.about-page {
  background: $bg;
  color: $ink;
  min-height: 100vh;
}

/* ── HERO ──────────────────────────────────────────── */
.hero {
  position: relative;
  width: 100%;
  background: $bg;
  cursor: crosshair;
}

.dot-canvas {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: auto;
}

.hero-caption {
  position: absolute;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 3px;

  &.left  { left: 24px; }
  &.right { right: 24px; align-items: flex-end; }
}

.caption-line {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.6;
}

.hero-scroll {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.scroll-text {
  font-family: $mono;
  font-size: 9px;
  color: $light;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.scroll-arrow {
  font-size: 11px;
  color: $light;
  animation: bob 2s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(4px); }
}

/* ── BIO ───────────────────────────────────────────── */
.bio-section {
  border-top: 1px solid $rule;
  padding: 72px 24px;
}

.bio-inner {
  max-width: 860px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 160px 1fr;
  grid-template-rows: auto auto;
  gap: 32px 48px;
  align-items: start;
}

.bio-label {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.1em;
  padding-top: 6px;
}

.bio-text {
  font-family: $sans;
  font-size: clamp(20px, 2.8vw, 32px);
  font-weight: 300;
  line-height: 1.55;
  color: $ink;
  letter-spacing: -0.01em;
  margin: 0;
  word-break: keep-all;
}

.bio-stats {
  grid-column: 2;
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-num {
  font-family: $mono;
  font-size: 28px;
  font-weight: 700;
  color: $ink;
  line-height: 1;
  letter-spacing: -0.03em;
}

.stat-label {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── SECTION 공통 헤더 ─────────────────────────────── */
.section-label-row {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 860px;
  margin: 0 auto 40px;
  padding: 0 24px;
}

.section-label {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}

.section-rule {
  flex: 1;
  height: 1px;
  background: $rule;
}

/* ── CAREER ────────────────────────────────────────── */
.career-section {
  border-top: 1px solid $rule;
  padding: 72px 0 0;
}

.career-row {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto auto;
  gap: 0 48px;
  position: relative;
}

.career-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 2px;
}

.career-period {
  font-family: $mono;
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 700;
  color: $ink;
  line-height: 1;
  letter-spacing: -0.04em;
  margin-bottom: 10px;
}

.career-company {
  font-family: $sans;
  font-size: 15px;
  font-weight: 600;
  color: $ink;
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}

.career-role {
  font-family: $mono;
  font-size: 11px;
  color: $muted;
  letter-spacing: 0.04em;
}

.career-rank {
  font-family: $mono;
  font-size: 10px;
  color: $light;
  letter-spacing: 0.03em;
}

.career-right {
  padding-bottom: 48px;
}

.career-stacks {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 28px;
}

.c-badge {
  font-family: $mono;
  font-size: 9px;
  color: $muted;
  border: 1px solid $rule;
  padding: 2px 7px;
  border-radius: 2px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.proj {
  margin-bottom: 24px;

  &:last-child { margin-bottom: 0; }
}

.proj-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.proj-dot {
  font-size: 7px;
  color: $ink;
  flex-shrink: 0;
  line-height: 2;
}

.proj-name {
  font-family: $sans;
  font-size: 13px;
  font-weight: 500;
  color: $ink;
  letter-spacing: -0.01em;
  line-height: 1.5;
}

.proj-period {
  font-family: $mono;
  font-size: 9px;
  color: $light;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.proj-list {
  list-style: none;
  margin: 0 0 0 15px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  li {
    font-family: $sans;
    font-size: 12px;
    color: $muted;
    line-height: 1.7;
    word-break: keep-all;
    padding-left: 12px;
    position: relative;

    &::before {
      content: '—';
      position: absolute;
      left: 0;
      color: $light;
      font-family: $mono;
    }
  }
}

.proj-stats {
  margin-top: 10px;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-line {
  font-family: $mono;
  font-size: 10px;
  color: $ink;
  letter-spacing: 0.03em;
}

.career-divider {
  grid-column: 1 / -1;
  height: 1px;
  background: $rule;
  margin: 0 0 48px;
}

/* ── SKILLS ─────────────────────────────────────────── */
.skills-section {
  border-top: 1px solid $rule;
  padding: 72px 0;
}

.skills-grid {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 24px;
  align-items: start;
  padding-bottom: 20px;
  border-bottom: 1px solid $rule;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.skill-cat {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding-top: 4px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.s-tag {
  font-family: $mono;
  font-size: 11px;
  color: $ink;
  letter-spacing: 0.02em;
  position: relative;

  &::after {
    content: '/';
    margin-left: 8px;
    color: $light;
  }

  &:last-child::after {
    display: none;
  }
}

/* ── FOOTER MARK ──────────────────────────────────── */
.about-footer {
  border-top: 1px solid $rule;
  padding: 24px 24px;
  display: flex;
  justify-content: flex-end;
}

.footer-text {
  font-family: $mono;
  font-size: 10px;
  color: $light;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ── 반응형 ───────────────────────────────────────── */
@media (max-width: 720px) {
  .bio-inner {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .bio-stats {
    grid-column: 1;
    gap: 24px;
  }

  .career-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .career-left {
    flex-direction: row;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 12px;
  }

  .career-period {
    font-size: 32px;
    margin-bottom: 0;
  }

  .career-right {
    padding-bottom: 0;
  }

  .skill-row {
    grid-template-columns: 80px 1fr;
    gap: 16px;
  }

  .hero-caption.right {
    display: none;
  }

  .stat-num {
    font-size: 22px;
  }
}
</style>
