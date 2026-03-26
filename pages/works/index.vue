<template>
  <div class="works-landing">

    <!-- ── LEFT: WEB ────────────────────────────────── -->
    <div
      class="works-half works-half--web"
      :class="{ 'is-hovered': hovered === 'web', 'is-dimmed': hovered === 'visual' }"
      @mouseenter="hovered = 'web'"
      @mouseleave="hovered = null"
      @click="navigateTo('/works/web')"
    >
      <!-- 배경 이미지 콜라주 -->
      <div class="bg-collage">
        <div
          v-for="(img, i) in webPreviews"
          :key="i"
          class="collage-img"
          :style="{ backgroundImage: `url(${img})`, '--i': i }"
        />
      </div>

      <div class="half-content">
        <div class="half-label">[ 01 ]</div>
        <h2 class="half-title">WEB</h2>
        <div class="half-sub">
          <span class="half-count">{{ webCount }} works</span>
          <span class="half-desc">Frontend Development<br />& Web Design</span>
        </div>
        <div class="half-tags">
          <span v-for="t in webTags" :key="t" class="htag">{{ t }}</span>
        </div>
        <div class="half-cta">enter →</div>
      </div>
    </div>

    <!-- ── CENTER DIVIDER ────────────────────────────── -->
    <div class="works-divider">
      <div class="divider-line" />
      <span class="divider-mark">◈</span>
      <div class="divider-line" />
    </div>

    <!-- ── RIGHT: VISUAL ─────────────────────────────── -->
    <div
      class="works-half works-half--visual"
      :class="{ 'is-hovered': hovered === 'visual', 'is-dimmed': hovered === 'web' }"
      @mouseenter="hovered = 'visual'"
      @mouseleave="hovered = null"
      @click="navigateTo('/works/visual')"
    >
      <!-- 배경 이미지 콜라주 -->
      <div class="bg-collage">
        <div
          v-for="(img, i) in visualPreviews"
          :key="i"
          class="collage-img"
          :style="{ backgroundImage: `url(${img})`, '--i': i }"
        />
      </div>

      <div class="half-content">
        <div class="half-label">[ 02 ]</div>
        <h2 class="half-title">VISUAL</h2>
        <div class="half-sub">
          <span class="half-count">{{ visualCount }} works</span>
          <span class="half-desc">Graphic Design<br />& Brand Identity</span>
        </div>
        <div class="half-tags">
          <span v-for="t in visualTags" :key="t" class="htag">{{ t }}</span>
        </div>
        <div class="half-cta">enter →</div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { webProjects } from '@/data/webProjects'
import { visualProjects } from '@/data/visualProjects'

const hovered = ref<'web' | 'visual' | null>(null)

const webCount    = webProjects.length
const visualCount = visualProjects.length

const webPreviews    = webProjects.slice(2, 8).map(p => p.thumb)
const visualPreviews = visualProjects.slice(0, 6).map(p => p.thumb)

const webTags    = ['Vue 3', 'Nuxt', 'TypeScript', 'HTML/CSS', 'jQuery']
const visualTags = ['Photoshop', 'Illustrator', 'After Effects', 'Figma']
</script>

<style scoped lang="scss">
$bg    : #f5f5f4;
$ink   : #111111;
$muted : #888888;
$light : #cccccc;
$rule  : #e0e0e0;
$mono  : var(--font-mono);
$sans  : var(--font-sans);

.works-landing {
  display: flex;
  height: calc(100vh - 60px); // 헤더 높이 제외
  background: $bg;
  overflow: hidden;
  cursor: pointer;
}

/* ── 절반 패널 ───────────────────────────────────── */
.works-half {
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 48px 40px;
  overflow: hidden;
  transition: flex 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-hovered {
    flex: 1.3;

    .bg-collage { opacity: 0.18; }
    .half-title { letter-spacing: -0.04em; }
    .half-cta   { opacity: 1; transform: translateX(0); }
  }

  &.is-dimmed {
    flex: 0.7;

    .half-title { opacity: 0.3; }
    .half-label,
    .half-sub,
    .half-tags  { opacity: 0.2; }
  }
}

/* ── 배경 콜라주 ────────────────────────────────── */
.bg-collage {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
}

.collage-img {
  background-size: cover;
  background-position: center;
  filter: grayscale(100%);
}

/* ── 콘텐츠 ─────────────────────────────────────── */
.half-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.half-label {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.12em;
  transition: opacity 0.4s;
}

.half-title {
  font-family: $sans;
  font-size: clamp(56px, 9vw, 130px);
  font-weight: 900;
  color: $ink;
  line-height: 0.9;
  letter-spacing: -0.03em;
  transition: letter-spacing 0.4s, opacity 0.4s;
  margin: 0;
}

.half-sub {
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: opacity 0.4s;
}

.half-count {
  font-family: $mono;
  font-size: 10px;
  color: $muted;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.half-desc {
  font-family: $sans;
  font-size: 13px;
  color: $muted;
  line-height: 1.6;
}

.half-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  transition: opacity 0.4s;
}

.htag {
  font-family: $mono;
  font-size: 9px;
  color: $muted;
  border: 1px solid $rule;
  padding: 2px 7px;
  border-radius: 1px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.half-cta {
  font-family: $mono;
  font-size: 11px;
  color: $ink;
  letter-spacing: 0.1em;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.3s, transform 0.3s;
  margin-top: 4px;
}

/* ── 중앙 구분선 ─────────────────────────────────── */
.works-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  width: 1px;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}

.divider-line {
  flex: 1;
  width: 1px;
  background: $rule;
}

.divider-mark {
  font-size: 10px;
  color: $light;
  padding: 8px 0;
  writing-mode: horizontal-tb;
}

/* ── 반응형 ─────────────────────────────────────── */
@media (max-width: 680px) {
  .works-landing {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 60px);
  }

  .works-half {
    flex: 1;
    min-height: 45vh;
    align-items: flex-start;
    padding: 36px 24px;

    &.is-hovered,
    &.is-dimmed {
      flex: 1;

      .half-title { opacity: 1; letter-spacing: -0.03em; }
      .half-label, .half-sub, .half-tags { opacity: 1; }
    }
  }

  .works-divider {
    flex-direction: row;
    width: 100%;
    height: 1px;
    padding: 0 24px;
  }

  .divider-line {
    flex: 1;
    width: auto;
    height: 1px;
    background: $rule;
  }

  .half-title { font-size: 56px; }

  .half-cta { opacity: 1; transform: none; }
}
</style>
