<template>
  <div class="docs-page">

    <!-- ── 페이지 헤더 ──────────────────────────────── -->
    <div class="docs-header">
      <div class="header-inner">
        <div class="section-label-row">
          <span class="section-label">[ docs ]</span>
          <div class="section-rule" />
        </div>
        <p class="docs-desc">개발 과정에서 기록한 문서들을 모아놓은 공간입니다.</p>
      </div>
    </div>

    <!-- ── 로딩 ──────────────────────────────────────── -->
    <div v-if="isPending" class="state-wrap">
      <span class="state-mono">loading<span class="blink">_</span></span>
    </div>

    <!-- ── 에러 ──────────────────────────────────────── -->
    <div v-else-if="isError" class="state-wrap">
      <span class="state-mono err">[ error ] 리스트를 불러오지 못했습니다.</span>
      <button class="retry-btn" @click="listRefetch()">retry ↺</button>
    </div>

    <!-- ── 목록 ──────────────────────────────────────── -->
    <div v-else class="docs-list-wrap">
      <div class="list-count">
        <span class="count-mono">{{ notionList.length }} documents</span>
      </div>

      <ul class="docs-list">
        <li
          v-for="(item, index) in notionList"
          :key="item.id || index"
          class="docs-item"
          data-aos="fade-up"
          :data-aos-delay="index * 40"
          @click="goDetail(item.id)"
        >
          <span class="item-index">{{ String(index + 1).padStart(2, '0') }}</span>

          <div class="item-icon">
            <img
              v-if="item.icon?.type === 'custom_emoji'"
              :src="item.icon.custom_emoji.url"
              alt="icon"
            />
            <img
              v-else-if="item.icon?.type === 'external'"
              :src="item.icon.external.url"
              alt="icon"
            />
            <span v-else class="icon-fallback">◈</span>
          </div>

          <span class="item-title">{{ getTitle(item) }}</span>

          <div class="item-meta">
            <span class="item-date">{{ formatDate(item.last_edited_time) }}</span>
            <span class="item-arrow">→</span>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRootStore } from '@/stores/useRootStore'
import { sendGet } from '~/utils/api'

const rootStore = useRootStore()
const config = useRuntimeConfig()

const getTitle = (item: any) => {
  return item.properties?.['문서 이름']?.title?.[0]?.plain_text || '제목 없음'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const { data: notionListData, isPending, isFetching, refetch, isError, error } = useQuery({
  queryKey: ['notionList', config.public.notionDocsDataId],
  queryFn: async () => {
    const databaseId = config.public.notionDocsDataId
    const res = await sendGet('api/notionList', { databaseId })
    return res?.results || []
  },
  enabled: !!config.public.notionDocsDataId,
})

watch(error, (err) => {
  if (err) rootStore.toast('리스트를 불러오지 못했습니다.')
})

const notionList = computed(() => notionListData.value || [])
const listRefetch = () => refetch()

const goDetail = (pageId: string) => {
  navigateTo(`/docs/detail/${pageId}`)
}
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
.docs-page {
  background: $bg;
  min-height: 100vh;
  color: $ink;
}

/* ── 헤더 ────────────────────────────────────────── */
.docs-header {
  border-bottom: 1px solid $rule;
  padding: 56px 0 40px;
}

.header-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-label-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
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

.docs-desc {
  font-family: $sans;
  font-size: 13px;
  color: $muted;
  margin: 0;
  letter-spacing: 0;
  line-height: 1.6;
}

/* ── 상태 ────────────────────────────────────────── */
.state-wrap {
  max-width: 860px;
  margin: 60px auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}

.state-mono {
  font-family: $mono;
  font-size: 12px;
  color: $muted;
  letter-spacing: 0.06em;

  &.err { color: $ink; }
}

.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.retry-btn {
  font-family: $mono;
  font-size: 11px;
  color: $muted;
  background: none;
  border: 1px solid $rule;
  padding: 6px 14px;
  cursor: pointer;
  letter-spacing: 0.06em;
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: $ink;
    border-color: $ink;
  }
}

/* ── 목록 ────────────────────────────────────────── */
.docs-list-wrap {
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

.docs-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.docs-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid $rule;
  cursor: pointer;
  transition: background 0.12s;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;

  &:hover {
    background: rgba(0, 0, 0, 0.025);

    .item-title   { opacity: 0.65; }
    .item-arrow   { transform: translateX(3px); }
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

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.item-date {
  font-family: $mono;
  font-size: 10px;
  color: $light;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.item-arrow {
  font-family: $mono;
  font-size: 12px;
  color: $light;
  transition: transform 0.15s;
}

/* ── 반응형 ─────────────────────────────────────── */
@media (max-width: 600px) {
  .item-date { display: none; }

  .docs-item { gap: 12px; }
}
</style>
