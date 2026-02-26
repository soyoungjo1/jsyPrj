<template>
  <section class="portfolio-slider">
    <!-- 상단: 큰 설명 텍스트 블록 (왼쪽 정렬, 넓은 여백) -->
    <div class="portfolio-hero-text">
      <p class="portfolio-desc">
        ASCII art is a technique where images are created using text characters.
        It became popular in early computer graphics and is still used for its unique digital aesthetic.
      </p>
    </div>

    <!-- 하단: 스와이퍼 슬라이드 (최대 5개) -->
    <div class="work-swiper-wrap">
      <Swiper
        :modules="modules"
        :space-between="swiperOptions.spaceBetween"
        :slides-per-view="swiperOptions.slidesPerView"
        :loop="swiperOptions.loop"
        :pagination="swiperOptions.pagination"
        :breakpoints="swiperOptions.breakpoints"
        class="work-swiper"
        @swiper="onSwiper"
      >
        <SwiperSlide
          v-for="(item, i) in displayItems"
          :key="i"
          class="work-slide"
        >
          <div
            class="work-item"
            @mouseenter="onSlideHover(i)"
            @mouseleave="hoveredIndex = null"
          >
            <NuxtLink :to="item.to" class="work-link">
              <span class="work-index">{{ String(i + 1).padStart(2, '0') }}.</span>
              <div class="work-content">
                <!-- 02 스타일: 메타 블록 있음 (visualOnly가 아닐 때만) -->
                <div v-if="!item.visualOnly" class="work-meta-block">
                  <span class="work-title">{{ item.title }}</span>
                  <span class="work-meta">{{ item.meta }}</span>
                  <span v-if="item.metaExtra" class="work-meta-extra">{{ item.metaExtra }}</span>
                </div>
                <!-- 시각 영역: 이미지(호버 전) → 아스키 아트(호버 시) -->
                <div class="work-visual work-visual-lines">
                  <img
                    :id="`portfolio-img-${i}`"
                    :src="slideImageSrc(item)"
                    class="work-image"
                    :class="{ hidden: hoveredIndex === i }"
                    crossorigin="anonymous"
                    alt=""
                  />
                  <pre
                    :id="`portfolio-pre-${i}`"
                    class="work-ascii"
                    :class="{ active: hoveredIndex === i }"
                  ></pre>
                </div>
              </div>
            </NuxtLink>
          </div>
        </SwiperSlide>
      </Swiper>
      <div v-if="displayItems.length > 1" class="swiper-nav">
        <button type="button" class="swiper-btn swiper-prev" aria-label="이전" @click="slidePrev">
          <span>←</span>
        </button>
        <button type="button" class="swiper-btn swiper-next" aria-label="다음" @click="slideNext">
          <span>→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const { convertImageToAscii } = useAsciiArt()

export interface PortfolioSlideItem {
  title: string
  meta: string
  to: string
  image?: string
  bg?: string
  asciiArt?: string
  metaExtra?: string
  /** true면 01 스타일: 번호 + 시각만 (메타 블록 숨김) */
  visualOnly?: boolean
}

const props = withDefaults(
  defineProps<{
    items: PortfolioSlideItem[]
    maxSlides?: number
  }>(),
  { maxSlides: 5 }
)

const hoveredIndex = ref<number | null>(null)
const swiperInstance = ref<SwiperType | null>(null)

const modules = [Navigation, Pagination]
const displayItems = computed(() => props.items.slice(0, props.maxSlides))

const swiperOptions = computed(() => ({
  spaceBetween: 24,
  slidesPerView: 1,
  loop: displayItems.value.length > 1,
  pagination: { clickable: true },
  breakpoints: {
    640: { slidesPerView: 1 },
    900: { slidesPerView: 2 },
  },
}))

function onSwiper (swiper: SwiperType) {
  swiperInstance.value = swiper
}
function slidePrev () {
  swiperInstance.value?.slidePrev()
}
function slideNext () {
  swiperInstance.value?.slideNext()
}

const DEFAULT_IMAGE_PATH = '/assets/images/TESTTESTTEST.png'

function slideImageSrc (item: PortfolioSlideItem) {
  return item.image ?? DEFAULT_IMAGE_PATH
}

function onSlideHover (i: number) {
  const imgId = `portfolio-img-${i}`
  const preId = `portfolio-pre-${i}`
  convertImageToAscii(imgId, preId, undefined, undefined, 150, 150)
  nextTick(() => {
    hoveredIndex.value = i
  })
}

</script>

<style scoped>
.portfolio-slider {
  background: #e5e5e5;
  color: #111;
  min-height: 100vh;
  padding: clamp(48px, 10vw, 120px) clamp(32px, 8vw, 100px);
  position: relative;
}
.portfolio-slider::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.02) 2px,
    rgba(0, 0, 0, 0.02) 3px
  );
  pointer-events: none;
}

.portfolio-hero-text {
  max-width: 100%;
  margin-bottom: clamp(48px, 8vw, 80px);
}
.portfolio-desc {
  font-family: var(--font-sans);
  font-size: clamp(18px, 3.5vw, 28px);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.02em;
  color: #111;
  margin: 0;
  max-width: 100%;
}

.work-swiper-wrap {
  position: relative;
  z-index: 1;
  padding-bottom: 48px;
}
.work-swiper {
  overflow: hidden;
}
.work-slide {
  height: auto;
}
.work-item {
  margin: 0;
  height: 100%;
}
.work-link {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s ease;
  height: 100%;
}
.work-link:hover {
  opacity: 0.9;
}
.work-index {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
  color: #111;
}
.work-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.work-meta-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.work-title {
  font-family: var(--font-sans);
  font-size: clamp(15px, 2vw, 18px);
  font-weight: 700;
  color: #111;
  display: block;
}
.work-meta,
.work-meta-extra {
  font-family: var(--font-mono);
  font-size: 12px;
  color: #333;
  line-height: 1.5;
}
.work-visual {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  min-height: 200px;
  overflow: hidden;
  background: #d8d8d8;
}
.work-visual-lines::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.04) 3px,
    rgba(0, 0, 0, 0.04) 4px
  );
  pointer-events: none;
  z-index: 2;
}
.work-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.25s ease;
}
.work-image.hidden {
  opacity: 0;
  pointer-events: none;
}
.work-ascii {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 7px;
  line-height: 1.15;
  letter-spacing: 0.02em;
  color: #111;
  white-space: pre;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.25s ease;
  background: #e0e0e0;
  z-index: 1;
}
.work-ascii.active {
  opacity: 1;
}

.swiper-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
.swiper-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #333;
  background: transparent;
  color: #111;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.swiper-btn:hover {
  background: #111;
  color: #e5e5e5;
}

:deep(.swiper-pagination) {
  position: relative;
  margin-top: 16px;
}
:deep(.swiper-pagination-bullet) {
  background: #666;
  opacity: 0.5;
}
:deep(.swiper-pagination-bullet-active) {
  background: #111;
  opacity: 1;
}
</style>
