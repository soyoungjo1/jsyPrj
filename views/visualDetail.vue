<template>
  <div class="visual-list-page">

    <!-- ── 페이지 헤더 ──────────────────────────────── -->
    <div class="page-header">
      <div class="header-inner">
        <div class="breadcrumb">
          <span class="bc-link" @click="navigateTo('/works')">works</span>
          <span class="bc-sep">/</span>
          <span class="bc-current">visual</span>
        </div>
        <div class="section-label-row">
          <span class="section-label">[ visual works ]</span>
          <div class="section-rule" />
        </div>
        <p class="page-desc">그래픽 디자인 · 브랜드 아이덴티티 · 상세페이지</p>
      </div>
    </div>

    <!-- ── 필터 탭 ──────────────────────────────────── -->
    <div class="filter-wrap">
      <div class="filter-inner">
        <button
          v-for="f in filters"
          :key="f.key"
          class="filter-btn"
          :class="{ active: activeFilter === f.key }"
          @click="activeFilter = f.key"
        >
          {{ f.label }}
          <span class="filter-count">{{ getCount(f.key) }}</span>
        </button>
      </div>
    </div>

    <!-- ── 프로젝트 행 목록 ──────────────────────────── -->
    <div class="list-body">
      <div
        v-for="(proj, idx) in filteredProjects"
        :key="proj.id"
        class="row"
        :class="{
          'row--hovered': hoveredId === proj.id,
          'row--dimmed': hoveredId !== null && hoveredId !== proj.id,
        }"
        @mouseenter="onRowEnter(proj, $event)"
        @mousemove="onRowMove"
        @mouseleave="onRowLeave"
        @click="selected = proj"
      >
        <span class="row-index">{{ String(idx + 1).padStart(2, '0') }}</span>
        <div class="row-main">
          <h3 class="row-title">{{ proj.title }}</h3>
          <span class="row-title-en">{{ proj.titleEn }}</span>
        </div>
        <span class="row-client">{{ proj.client }}</span>
        <span class="row-year">{{ proj.year }}</span>
        <span class="row-type">{{ proj.type }}</span>
        <span class="row-arrow">→</span>
      </div>
    </div>

    <!-- ── ASCII cursor preview ──────────────────────── -->
    <div
      v-if="hoveredId !== null && asciiText"
      class="cursor-preview"
      :style="{ transform: `translate(${cursorPos.x + 20}px, ${cursorPos.y - 80}px)` }"
    >
      <pre class="ascii-pre">{{ asciiText }}</pre>
    </div>

    <!-- ── 상세 패널 ─────────────────────────────────── -->
    <Transition name="panel">
      <div v-if="selected" class="detail-overlay" @click.self="selected = null">
        <div class="detail-panel">

          <button class="panel-close" @click="selected = null">✕ close</button>

          <div class="panel-header">
            <div class="panel-meta">
              <span class="p-client">{{ selected.client }}</span>
              <span class="p-year">{{ selected.year }}</span>
            </div>
            <h2 class="panel-title">{{ selected.title }}</h2>
            <p class="panel-title-en">{{ selected.titleEn }}</p>
            <div class="panel-type">{{ selected.type }}</div>
            <div class="panel-tags">
              <span v-for="t in selected.tags" :key="t" class="ptag">{{ t }}</span>
            </div>
          </div>

          <div class="panel-hero">
            <img :src="selected.thumb" :alt="selected.title" />
          </div>

          <p class="panel-desc">{{ selected.description }}</p>

          <div v-if="selected.images?.length" class="panel-images">
            <div v-for="(img, ii) in selected.images" :key="ii" class="panel-image">
              <img :src="img" :alt="`${selected.title} ${ii + 1}`" loading="lazy" />
            </div>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { visualProjects, type VisualProject } from '@/data/visualProjects'

// ── State ────────────────────────────────────────
const selected     = ref<VisualProject | null>(null)
const activeFilter = ref<string>('all')

// ── Type map ─────────────────────────────────────
const typeMap: Record<string, string> = {
  '상세페이지':              'detail',
  '기획전':                  'campaign',
  '기획전 + 상세페이지':     'campaign',
  '배너 · 팝업':             'graphic',
  '로고 · GIF 애니메이션':   'graphic',
  '로고 · 배너':             'graphic',
  '로고 · 명함':             'graphic',
  '브랜드 디자인':           'graphic',
}

// ── Filters ──────────────────────────────────────
const filters = [
  { key: 'all',      label: 'All' },
  { key: 'detail',   label: '상세페이지' },
  { key: 'campaign', label: '기획전' },
  { key: 'graphic',  label: '그래픽·브랜드' },
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return visualProjects
  return visualProjects.filter(p => typeMap[p.type] === activeFilter.value)
})

const getCount = (key: string) => {
  if (key === 'all') return visualProjects.length
  return visualProjects.filter(p => typeMap[p.type] === key).length
}

// ── ASCII hover ──────────────────────────────────
const asciiCache = new Map<string, string>()
const hoveredId  = ref<string | null>(null)
const cursorPos  = ref({ x: 0, y: 0 })
const asciiText  = ref('')

const asciiChars = '@%#*+=-:. '

async function generateAscii(src: string): Promise<string> {
  if (asciiCache.has(src)) return asciiCache.get(src)!
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const W = 60, H = 28
      const canvas = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, W, H)
      const { data } = ctx.getImageData(0, 0, W, H)
      let result = ''
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i  = (y * W + x) * 4
          const br = (data[i] + data[i + 1] + data[i + 2]) / 3
          result  += asciiChars[Math.floor((br / 255) * (asciiChars.length - 1))]
        }
        result += '\n'
      }
      asciiCache.set(src, result)
      resolve(result)
    }
    img.onerror = () => resolve('')
    img.src = src
  })
}

const onRowEnter = async (proj: VisualProject, e: MouseEvent) => {
  hoveredId.value = proj.id
  cursorPos.value = { x: e.clientX, y: e.clientY }
  asciiText.value = ''
  if (proj.thumb) {
    asciiText.value = await generateAscii(proj.thumb)
  }
}
const onRowMove = (e: MouseEvent) => {
  cursorPos.value = { x: e.clientX, y: e.clientY }
}
const onRowLeave = () => {
  hoveredId.value = null
  asciiText.value = ''
}
</script>

<style scoped lang="scss">
$bg    : #f5f5f4;
$dark  : #111111;
$ink   : #111111;
$muted : #888888;
$light : #cccccc;
$rule  : #e0e0e0;
$mono  : var(--font-mono);
$sans  : var(--font-sans);

/* ── 페이지 ──────────────────────────────────────── */
.visual-list-page {
  background: $bg;
  min-height: 100vh;
  color: $ink;
}

/* ── 헤더 ────────────────────────────────────────── */
.page-header {
  border-bottom: 1px solid $rule;
  padding: 56px 0 40px;
}

.header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.bc-link {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: color 0.15s;
  &:hover { color: $ink; }
}

.bc-sep     { font-family: $mono; font-size: 10px; color: $light; }
.bc-current { font-family: $mono; font-size: 10px; color: $ink; letter-spacing: 0.08em; }

.section-label-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.section-label {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.section-rule {
  flex: 1;
  height: 1px;
  background: $rule;
}

.page-desc {
  font-family: $sans;
  font-size: 13px;
  color: $muted;
  margin: 0;
}

/* ── 필터 ────────────────────────────────────────── */
.filter-wrap {
  border-bottom: 1px solid $rule;
}

.filter-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 0;
}

.filter-btn {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 14px 16px;
  cursor: pointer;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s, border-color 0.15s;

  &:hover  { color: $ink; }
  &.active { color: $ink; border-bottom-color: $ink; }
}

.filter-count {
  font-family: $mono;
  font-size: 9px;
  color: $light;
}

/* ── 본문 ────────────────────────────────────────── */
.list-body {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 0 80px;
}

/* ── 프로젝트 행 ──────────────────────────────────── */
.row {
  min-height: 64px;
  cursor: pointer;
  border-bottom: 1px solid $rule;
  display: grid;
  grid-template-columns: 40px 1fr 160px 80px 140px 32px;
  align-items: center;
  gap: 16px;
  padding: 0 24px 0 0;
  transition: background 0.15s, color 0.15s, border-bottom-color 0.15s;

  &.row--hovered {
    background: $dark;
    color: #fafafa;
    border-bottom-color: transparent;

    .row-client,
    .row-year,
    .row-type  { color: rgba(255, 255, 255, 0.45); }

    .row-title-en { color: rgba(255, 255, 255, 0.4); }

    .row-arrow { transform: translateX(4px); color: #fafafa; }
  }

  &.row--dimmed {
    opacity: 0.35;
  }
}

.row-index {
  font-family: $mono;
  font-size: 11px;
  color: $muted;
  letter-spacing: 0.06em;
  text-align: right;
  padding-right: 8px;
}

.row-main {
  display: flex;
  align-items: baseline;
  min-width: 0;
}

.row-title {
  font-family: $sans;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-title-en {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  margin-left: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.15s;
}

.row-client {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.04em;
  text-align: right;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-year {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.04em;
  text-align: center;
  transition: color 0.15s;
}

.row-type {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.04em;
  text-align: right;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-arrow {
  font-family: $mono;
  font-size: 14px;
  color: $muted;
  text-align: center;
  transition: transform 0.15s, color 0.15s;
}

/* ── ASCII cursor preview ─────────────────────────── */
.cursor-preview {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  background: #111111;
  border: 1px solid #333333;
  padding: 8px;
  width: 220px;
}

.ascii-pre {
  font-family: $mono;
  font-size: 5.5px;
  line-height: 1.1;
  color: #888888;
  white-space: pre;
  margin: 0;
}

/* ── 상세 패널 ──────────────────────────────────── */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 17, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.detail-panel {
  width: min(600px, 90vw);
  height: 100vh;
  background: $bg;
  overflow-y: auto;
  padding: 40px 36px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel-close {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  background: none;
  border: 1px solid $rule;
  padding: 6px 14px;
  cursor: pointer;
  letter-spacing: 0.06em;
  align-self: flex-start;
  transition: color 0.15s, border-color 0.15s;

  &:hover { color: $ink; border-color: $ink; }
}

.panel-header { display: flex; flex-direction: column; gap: 6px; }

.panel-meta {
  display: flex;
  gap: 12px;
}

.p-client  { font-family: $mono; font-size: 10px; color: $muted; letter-spacing: 0.06em; }
.p-year    { font-family: $mono; font-size: 10px; color: $light; letter-spacing: 0.06em; }

.panel-title {
  font-family: $sans;
  font-size: clamp(20px, 2.8vw, 28px);
  font-weight: 700;
  color: $ink;
  margin: 0;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.panel-title-en {
  font-family: $mono;
  font-size: 11px;
  color: $muted;
  margin: 0;
  letter-spacing: 0.04em;
}

.panel-type {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.06em;
}

.panel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.ptag {
  font-family: $mono;
  font-size: 9px;
  color: $muted;
  border: 1px solid $rule;
  padding: 2px 7px;
  border-radius: 1px;
  letter-spacing: 0.04em;
}

.panel-hero img {
  width: 100%;
  height: auto;
  display: block;
}

.panel-desc {
  font-family: $sans;
  font-size: 13px;
  line-height: 1.85;
  color: $muted;
  margin: 0;
  word-break: keep-all;
}

.panel-images {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.panel-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* ── 패널 트랜지션 ───────────────────────────────── */
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.3s;

  .detail-panel { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;

  .detail-panel { transform: translateX(40px); }
}

/* ── 반응형 ─────────────────────────────────────── */
@media (max-width: 900px) {
  .row {
    grid-template-columns: 32px 1fr 80px 60px 32px;
    gap: 12px;
  }

  .row-client { display: none; }
}

@media (max-width: 540px) {
  .row {
    grid-template-columns: 28px 1fr 60px 28px;
    gap: 8px;
  }

  .row-year   { display: none; }
  .row-type   { font-size: 9px; }
  .filter-btn { padding: 12px 10px; font-size: 9px; }
}
</style>
