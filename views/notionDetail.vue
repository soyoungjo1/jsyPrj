<template>
  <div class="detail-page">

    <!-- ── 페이지 헤더 ──────────────────────────────── -->
    <div class="detail-header">
      <div class="header-inner">

        <!-- 브레드크럼 -->
        <div class="breadcrumb">
          <span class="bc-link" @click="navigateTo('/docs')">docs</span>
          <span class="bc-sep">/</span>
          <span class="bc-current">{{ pageTitle || '…' }}</span>
        </div>

        <!-- 타이틀 -->
        <div class="page-title-wrap">
          <div v-if="pageIcon" class="page-icon">
            <img
              v-if="pageIconType === 'custom_emoji'"
              :src="pageIcon"
              alt="icon"
            />
            <span v-else class="icon-emoji">{{ pageIcon }}</span>
          </div>
          <h1 class="page-title">{{ pageTitle || '…' }}</h1>
        </div>

      </div>
    </div>

    <!-- ── 로딩 ──────────────────────────────────────── -->
    <div v-if="isPending" class="state-wrap">
      <span class="state-mono">loading<span class="blink">_</span></span>
    </div>

    <!-- ── 자식 페이지 목록 ──────────────────────────── -->
    <div v-else class="children-wrap">
      <div class="list-count">
        <span class="count-mono">{{ childPages.length }} pages</span>
      </div>

      <ul class="child-list">
        <li
          v-for="(list, index) in childPages"
          :key="list.id"
          class="child-item"
          data-aos="fade-up"
          :data-aos-delay="index * 50"
          @click="goBlockPage(list.id)"
        >
          <span class="item-index">{{ String(index + 1).padStart(2, '0') }}</span>

          <div class="item-icon">
            <img
              v-if="getChildPageIconType(list.id) === 'custom_emoji'"
              :src="getChildPageIcon(list.id)"
              alt="page icon"
            />
            <span v-else-if="getChildPageIcon(list.id)" class="icon-emoji">
              {{ getChildPageIcon(list.id) }}
            </span>
            <span v-else class="icon-fallback">◈</span>
          </div>

          <span class="item-title">{{ list?.child_page?.title || '제목 없음' }}</span>
          <span class="item-arrow">→</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRootStore } from '@/stores/useRootStore'
import { sendGet } from '~/utils/api'

const route = useRoute()
const rootStore = useRootStore()
const pageId = computed(() => (route.params.id || route.query.id) as string)

const goBlockPage = (id: string) => {
  navigateTo(`/docs/detail/blocks/${id}`)
}

/* ── 1. 페이지 정보 ──────────────────────────────── */
const { data: pageInfoData, isPending: pageInfoPending } = useQuery({
  queryKey: ['notionPage', pageId],
  queryFn: async () => {
    if (!pageId.value) return null
    return await sendGet('api/notionPage', { id: pageId.value })
  },
  enabled: computed(() => !!pageId.value),
})

const notionPageInfo = computed(() => pageInfoData.value || null)

const pageIcon = computed(() => {
  const icon = notionPageInfo.value?.icon
  if (!icon) return ''
  if (icon.type === 'emoji')        return icon.emoji || ''
  if (icon.type === 'custom_emoji') return icon.custom_emoji?.url || ''
  return ''
})

const pageIconType = computed(() => notionPageInfo.value?.icon?.type || '')

const pageTitle = computed(() => {
  const props = notionPageInfo.value?.properties || {}
  for (const key in props) {
    const p = props[key]
    if (p?.type === 'title' && p?.title?.[0]?.plain_text) return p.title[0].plain_text
  }
  return ''
})

/* ── 2. 하위 블록 목록 ───────────────────────────── */
const { data: notionDetailsData, isPending: detailPending } = useQuery({
  queryKey: ['notionDetail', pageId],
  queryFn: async () => {
    if (!pageId.value) return null
    const res = await sendGet('api/notionDetail', { id: pageId.value })
    const results = res?.results || []

    const childPages = results.filter((d: any) => d.type === 'child_page')
    const childPageIcons: Record<string, { icon: string; type: string }> = {}

    await Promise.all(
      childPages
        .filter((d: any) => d.id)
        .map(async (d: any) => {
          try {
            const iconRes = await sendGet('api/notionPage', { id: d.id })
            if (iconRes?.icon) {
              let icon = '', type = ''
              if (iconRes.icon.type === 'emoji') {
                icon = iconRes.icon.emoji || ''
                type = 'emoji'
              } else if (iconRes.icon.type === 'custom_emoji') {
                icon = iconRes.icon.custom_emoji?.url || ''
                type = 'custom_emoji'
              }
              if (icon) childPageIcons[d.id] = { icon, type }
            }
          } catch {}
        })
    )
    return { results, childPageIcons }
  },
  enabled: computed(() => !!pageId.value),
})

const isPending = computed(() => pageInfoPending.value || detailPending.value)

const notionDetails   = computed(() => notionDetailsData.value?.results || [])
const childPageIcons  = computed(() => notionDetailsData.value?.childPageIcons || {})
const childPages      = computed(() => notionDetails.value.filter((d: any) => d.type === 'child_page'))

const getChildPageIcon     = (id: string) => childPageIcons.value[id]?.icon || ''
const getChildPageIconType = (id: string) => childPageIcons.value[id]?.type || ''
</script>

<style scoped lang="scss">
$bg    : #f5f5f4;
$ink   : #111111;
$muted : #888888;
$light : #cccccc;
$rule  : #e0e0e0;
$mono  : var(--font-mono);
$sans  : var(--font-sans);

/* ── 레이아웃 ─────────────────────────────────────── */
.detail-page {
  background: $bg;
  min-height: 100vh;
  color: $ink;
}

/* ── 헤더 ────────────────────────────────────────── */
.detail-header {
  border-bottom: 1px solid $rule;
  padding: 56px 0 40px;
}

.header-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 브레드크럼 */
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

.bc-sep {
  font-family: $mono;
  font-size: 10px;
  color: $light;
}

.bc-current {
  font-family: $mono;
  font-size: 10px;
  color: $ink;
  letter-spacing: 0.08em;
}

/* 타이틀 */
.page-title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 4px;
  }
}

.icon-emoji {
  font-size: 28px;
  line-height: 1;
}

.page-title {
  font-family: $sans;
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 600;
  color: $ink;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

/* ── 상태 ────────────────────────────────────────── */
.state-wrap {
  max-width: 860px;
  margin: 60px auto;
  padding: 0 24px;
}

.state-mono {
  font-family: $mono;
  font-size: 12px;
  color: $muted;
  letter-spacing: 0.06em;
}

.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ── 자식 목록 ──────────────────────────────────── */
.children-wrap {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
}

.list-count {
  padding: 20px 0 8px;
  border-bottom: 1px solid $rule;
}

.count-mono {
  font-family: $mono;
  font-size: 10px;
  color: $light;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.child-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.child-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 16px;
  margin: 0 -16px;
  border-bottom: 1px solid $rule;
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);

    .item-title { opacity: 0.65; }
    .item-arrow { transform: translateX(3px); }
  }
}

.item-index {
  font-family: $mono;
  font-size: 10px;
  color: $light;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  width: 24px;
}

.item-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.icon-fallback {
  font-size: 14px;
  color: $light;
}

.item-title {
  flex: 1;
  font-family: $sans;
  font-size: 14px;
  font-weight: 400;
  color: $ink;
  letter-spacing: -0.01em;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.12s;
}

.item-arrow {
  font-family: $mono;
  font-size: 12px;
  color: $light;
  flex-shrink: 0;
  transition: transform 0.15s;
}
</style>
