<template>
  <div class="blocks-page">

    <!-- ── 페이지 헤더 ──────────────────────────────── -->
    <div class="blocks-header">
      <div class="header-inner">

        <!-- 브레드크럼 -->
        <div class="breadcrumb">
          <span class="bc-link" @click="navigateTo('/docs')">docs</span>
          <span class="bc-sep">/</span>
          <span class="bc-current">{{ pageTitle || '…' }}</span>
        </div>

        <h1 class="page-title">{{ pageTitle || '' }}</h1>

      </div>
    </div>

    <!-- ── 콘텐츠 ────────────────────────────────────── -->
    <div class="blocks-body">
      <div class="blocks-inner">

        <!-- 로딩 -->
        <div v-if="isPending" class="state-mono">
          loading<span class="blink">_</span>
        </div>

        <!-- 블록 렌더링 -->
        <div
          v-for="(block, index) in filteredBlocks"
          :key="block.id"
          class="notion-block"
          :class="`nb--${block.type}`"
          :data-aos="getAosAnimation(block.type)"
        >

          <!-- Paragraph -->
          <p v-if="block.type === 'paragraph'" class="nb-paragraph">
            <template v-for="(t, i) in block.paragraph?.rich_text || []" :key="i">
              <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
              <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
            </template>
          </p>

          <!-- Heading 1 -->
          <h1 v-else-if="block.type === 'heading_1'" class="nb-h1">
            <template v-for="(t, i) in block.heading_1?.rich_text || []" :key="i">
              <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
              <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
            </template>
          </h1>

          <!-- Heading 2 -->
          <h2 v-else-if="block.type === 'heading_2'" class="nb-h2">
            <template v-for="(t, i) in block.heading_2?.rich_text || []" :key="i">
              <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
              <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
            </template>
          </h2>

          <!-- Heading 3 -->
          <h3 v-else-if="block.type === 'heading_3'" class="nb-h3">
            <template v-for="(t, i) in block.heading_3?.rich_text || []" :key="i">
              <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
              <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
            </template>
          </h3>

          <!-- Bulleted List -->
          <ul v-else-if="block.type === 'bulleted_list_item'" class="nb-ul">
            <li class="nb-li">
              <template v-for="(t, i) in block.bulleted_list_item?.rich_text || []" :key="i">
                <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
                <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
              </template>
            </li>
          </ul>

          <!-- Numbered List -->
          <ol v-else-if="block.type === 'numbered_list_item'" class="nb-ol">
            <li class="nb-li">
              <template v-for="(t, i) in block.numbered_list_item?.rich_text || []" :key="i">
                <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
                <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
              </template>
            </li>
          </ol>

          <!-- To Do -->
          <div v-else-if="block.type === 'to_do'" class="nb-todo">
            <span class="todo-check" :class="{ 'is-done': block.to_do?.checked }">
              {{ block.to_do?.checked ? '✓' : '○' }}
            </span>
            <span class="todo-text" :class="{ 'is-done': block.to_do?.checked }">
              <template v-for="(t, i) in block.to_do?.rich_text || []" :key="i">
                <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
                <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
              </template>
            </span>
          </div>

          <!-- Toggle -->
          <div v-else-if="block.type === 'toggle'" class="nb-toggle">
            <div class="toggle-head" @click="toggleBlock(block.id)">
              <span class="toggle-icon" :class="{ open: isOpen(block.id) }">▶</span>
              <span class="toggle-title">
                <template v-for="(t, i) in block.toggle?.rich_text || []" :key="i">
                  <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
                  <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
                </template>
              </span>
            </div>
            <div v-if="isOpen(block.id) && block.has_children" class="toggle-body" />
          </div>

          <!-- Quote -->
          <blockquote v-else-if="block.type === 'quote'" class="nb-quote">
            <template v-for="(t, i) in block.quote?.rich_text || []" :key="i">
              <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
              <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
            </template>
          </blockquote>

          <!-- Callout -->
          <div v-else-if="block.type === 'callout'" class="nb-callout">
            <div v-if="block.callout?.icon" class="callout-icon">
              <span v-if="block.callout.icon.type === 'emoji'">{{ block.callout.icon.emoji }}</span>
              <img v-else-if="block.callout.icon.type === 'file'" :src="block.callout.icon.file?.url" alt="icon" />
              <img v-else-if="block.callout.icon.type === 'external'" :src="block.callout.icon.external?.url" alt="icon" />
            </div>
            <div class="callout-text">
              <template v-for="(t, i) in block.callout?.rich_text || []" :key="i">
                <a v-if="t.href" :href="t.href" target="_blank" rel="noopener noreferrer" class="nb-link" :class="getTextStyle(t)">{{ t.plain_text }}</a>
                <span v-else :class="getTextStyle(t)">{{ t.plain_text }}</span>
              </template>
            </div>
          </div>

          <!-- Divider -->
          <div v-else-if="block.type === 'divider'" class="nb-divider" />

          <!-- Code -->
          <div v-else-if="block.type === 'code'" class="nb-code">
            <div class="code-header">
              <span class="code-lang">{{ block.code?.language || 'plain' }}</span>
              <button class="code-copy" @click="copyCode(block.code?.rich_text)">copy</button>
            </div>
            <pre class="code-pre"><code>{{ getCodeText(block.code?.rich_text || []) }}</code></pre>
          </div>

          <!-- Image -->
          <figure v-else-if="block.type === 'image' && getImageUrl(block)" class="nb-figure">
            <img :src="getImageUrl(block)!" :alt="getImageCaption(block)" class="nb-image" loading="lazy" />
            <figcaption v-if="getImageCaption(block)" class="nb-caption">{{ getImageCaption(block) }}</figcaption>
          </figure>

          <!-- Video -->
          <figure v-else-if="block.type === 'video' && getVideoUrl(block)" class="nb-figure">
            <video :src="getVideoUrl(block)!" controls class="nb-video" />
            <figcaption v-if="getVideoCaption(block)" class="nb-caption">{{ getVideoCaption(block) }}</figcaption>
          </figure>

          <!-- File -->
          <div v-else-if="block.type === 'file' && getFileUrl(block)" class="nb-file">
            <a :href="getFileUrl(block)!" target="_blank" rel="noopener noreferrer" class="file-link">
              <span class="file-icon">↓</span>
              <span class="file-name">{{ getFileName(block) || '파일 다운로드' }}</span>
            </a>
          </div>

          <!-- Embed -->
          <div v-else-if="block.type === 'embed' && block.embed?.url" class="nb-embed">
            <iframe :src="block.embed.url" class="embed-frame" frameborder="0" allowfullscreen />
          </div>

          <!-- Link Preview -->
          <div v-else-if="block.type === 'link_preview'" class="nb-link-preview">
            <a :href="block.link_preview?.url" target="_blank" rel="noopener noreferrer" class="nb-link">
              {{ block.link_preview?.url }}
            </a>
          </div>

          <!-- Table -->
          <div v-else-if="block.type === 'table'" class="nb-table-wrap">
            <table class="nb-table">
              <tbody>
                <tr
                  v-for="(row, ri) in block.table?.table_rows || []"
                  :key="ri"
                  :class="{ 'is-header': ri === 0 }"
                >
                  <td
                    v-for="(cell, ci) in row.table_row?.cells || []"
                    :key="ci"
                    class="nb-td"
                  >
                    <span v-for="(t, ti) in cell" :key="ti" :class="getTextStyle(t)">{{ t.plain_text }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRootStore } from '@/stores/useRootStore'
import { sendGet } from '~/utils/api'

const route   = useRoute()
const rootStore = useRootStore()
const pageId  = computed(() => (route.params.id || route.query.id) as string)
const openToggles = ref<Set<string>>(new Set())

/* ── 페이지 정보 ──────────────────────────────────── */
const { data: pageInfoData, isPending: pagePending } = useQuery({
  queryKey: ['notionPage', pageId],
  queryFn: async () => {
    if (!pageId.value) return null
    return await sendGet('api/notionPage', { id: pageId.value })
  },
  enabled: computed(() => !!pageId.value),
})

const notionPageInfo = computed(() => pageInfoData.value || null)

const pageTitle = computed(() => {
  const props = notionPageInfo.value?.properties || {}
  for (const key in props) {
    const p = props[key]
    if (p?.type === 'title' && p?.title?.[0]?.plain_text) return p.title[0].plain_text
  }
  return ''
})

/* ── 블록 데이터 ─────────────────────────────────── */
const { data: notionBlockData, isPending: blockPending } = useQuery({
  queryKey: ['notionBlock', pageId],
  queryFn: async () => {
    if (!pageId.value) return null
    const res = await sendGet('api/notionDetail', { id: pageId.value })
    return res?.results || []
  },
  enabled: computed(() => !!pageId.value),
})

const isPending    = computed(() => pagePending.value || blockPending.value)
const notionBlocks = computed(() => notionBlockData.value || [])

const filteredBlocks = computed(() =>
  notionBlocks.value.filter((b: any) => {
    if (b.type === 'paragraph'           && !b.paragraph?.rich_text?.length)           return false
    if (b.type === 'bulleted_list_item'  && !b.bulleted_list_item?.rich_text?.length)  return false
    if (b.type === 'numbered_list_item'  && !b.numbered_list_item?.rich_text?.length)  return false
    if (b.type === 'code'                && !b.code?.rich_text?.length)                return false
    return true
  })
)

/* ── 유틸 ────────────────────────────────────────── */
const getTextStyle = (text: any) => {
  const s: string[] = []
  if (text.annotations?.bold)          s.push('t-bold')
  if (text.annotations?.italic)        s.push('t-italic')
  if (text.annotations?.underline)     s.push('t-underline')
  if (text.annotations?.strikethrough) s.push('t-strike')
  if (text.annotations?.code)          s.push('t-code')
  return s.join(' ')
}

const getCodeText = (richText: any[]) => richText.map(t => t.plain_text).join('')

const copyCode = async (richText: any[]) => {
  const text = getCodeText(richText || [])
  try {
    await navigator.clipboard.writeText(text)
    rootStore.toast('코드가 복사되었습니다.')
  } catch {}
}

const getImageUrl = (block: any) =>
  block.image?.type === 'file'     ? block.image.file?.url :
  block.image?.type === 'external' ? block.image.external?.url : null

const getImageCaption = (block: any) =>
  block.image?.caption?.map((t: any) => t.plain_text).join('') || ''

const getVideoUrl = (block: any) =>
  block.video?.type === 'file'     ? block.video.file?.url :
  block.video?.type === 'external' ? block.video.external?.url : null

const getVideoCaption = (block: any) =>
  block.video?.caption?.map((t: any) => t.plain_text).join('') || ''

const getFileUrl = (block: any) =>
  block.file?.type === 'file'     ? block.file.file?.url :
  block.file?.type === 'external' ? block.file.external?.url : null

const getFileName = (block: any) =>
  block.file?.caption?.map((t: any) => t.plain_text).join('') || block.file?.name || ''

const toggleBlock = (id: string) => {
  if (openToggles.value.has(id)) openToggles.value.delete(id)
  else openToggles.value.add(id)
}
const isOpen = (id: string) => openToggles.value.has(id)

const getAosAnimation = (type: string) => {
  const map: Record<string, string> = {
    heading_1: 'fade-up', heading_2: 'fade-up', heading_3: 'fade-up',
    paragraph: 'fade-up', code: 'fade-up', image: 'zoom-in',
    video: 'zoom-in', quote: 'fade-right', callout: 'fade-left', table: 'fade-up',
  }
  return map[type] || 'fade-up'
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

/* ── 페이지 ──────────────────────────────────────── */
.blocks-page {
  background: $bg;
  min-height: 100vh;
  color: $ink;
}

/* ── 헤더 ────────────────────────────────────────── */
.blocks-header {
  border-bottom: 1px solid $rule;
  padding: 56px 0 40px;
}

.header-inner {
  max-width: 740px;
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

.bc-sep    { font-family: $mono; font-size: 10px; color: $light; }
.bc-current { font-family: $mono; font-size: 10px; color: $ink; letter-spacing: 0.08em; }

.page-title {
  font-family: $sans;
  font-size: clamp(24px, 3.5vw, 40px);
  font-weight: 600;
  color: $ink;
  margin: 0;
  letter-spacing: -0.025em;
  line-height: 1.25;
  word-break: keep-all;
}

/* ── 본문 ────────────────────────────────────────── */
.blocks-body {
  padding: 56px 0 80px;
}

.blocks-inner {
  max-width: 740px;
  margin: 0 auto;
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

/* ── 블록 공통 ──────────────────────────────────── */
.notion-block { margin-bottom: 0; }

/* ── Paragraph ─────────────────────────────────── */
.nb-paragraph {
  font-family: $sans;
  font-size: 15px;
  line-height: 1.85;
  color: $ink;
  margin: 0 0 1.1em;
  word-break: break-word;
}

/* ── Headings ───────────────────────────────────── */
.nb-h1 {
  font-family: $sans;
  font-size: 28px;
  font-weight: 700;
  color: $ink;
  margin: 2.4em 0 0.7em;
  letter-spacing: -0.025em;
  line-height: 1.25;
  padding-bottom: 10px;
  border-bottom: 1px solid $rule;

  &:first-child { margin-top: 0; }
}

.nb-h2 {
  font-family: $sans;
  font-size: 20px;
  font-weight: 600;
  color: $ink;
  margin: 2em 0 0.6em;
  letter-spacing: -0.02em;
  line-height: 1.35;

  &:first-child { margin-top: 0; }
}

.nb-h3 {
  font-family: $sans;
  font-size: 16px;
  font-weight: 600;
  color: $ink;
  margin: 1.6em 0 0.5em;
  letter-spacing: -0.01em;
  line-height: 1.4;

  &:first-child { margin-top: 0; }
}

/* ── Lists ──────────────────────────────────────── */
.nb-ul {
  list-style: none;
  margin: 0 0 0.5em;
  padding: 0;

  .nb-li {
    font-family: $sans;
    font-size: 15px;
    line-height: 1.85;
    color: $ink;
    padding-left: 18px;
    position: relative;

    &::before {
      content: '—';
      position: absolute;
      left: 0;
      color: $light;
      font-family: $mono;
      font-size: 12px;
    }
  }
}

.nb-ol {
  list-style: none;
  margin: 0 0 0.5em;
  padding: 0;
  counter-reset: nb-counter;

  .nb-li {
    font-family: $sans;
    font-size: 15px;
    line-height: 1.85;
    color: $ink;
    padding-left: 24px;
    position: relative;
    counter-increment: nb-counter;

    &::before {
      content: counter(nb-counter) '.';
      position: absolute;
      left: 0;
      color: $light;
      font-family: $mono;
      font-size: 11px;
      top: 3px;
    }
  }
}

/* ── To Do ──────────────────────────────────────── */
.nb-todo {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 0.5em;
}

.todo-check {
  font-family: $mono;
  font-size: 12px;
  color: $muted;
  flex-shrink: 0;
  margin-top: 4px;

  &.is-done { color: $light; }
}

.todo-text {
  font-family: $sans;
  font-size: 15px;
  line-height: 1.85;
  color: $ink;

  &.is-done {
    text-decoration: line-through;
    color: $light;
  }
}

/* ── Toggle ─────────────────────────────────────── */
.nb-toggle { margin-bottom: 0.8em; }

.toggle-head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  &:hover .toggle-title { opacity: 0.7; }
}

.toggle-icon {
  font-size: 9px;
  color: $muted;
  flex-shrink: 0;
  margin-top: 6px;
  transition: transform 0.2s;

  &.open { transform: rotate(90deg); }
}

.toggle-title {
  font-family: $sans;
  font-size: 15px;
  line-height: 1.85;
  color: $ink;
  transition: opacity 0.15s;
}

.toggle-body {
  margin: 6px 0 0 17px;
  padding-left: 12px;
  border-left: 1px solid $rule;
}

/* ── Quote ──────────────────────────────────────── */
.nb-quote {
  margin: 0 0 1.2em;
  padding: 14px 20px;
  border-left: 2px solid $ink;
  font-family: $sans;
  font-size: 15px;
  line-height: 1.85;
  color: $muted;
  font-style: italic;
}

/* ── Callout ─────────────────────────────────────── */
.nb-callout {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid $rule;
  border-radius: 2px;
  margin-bottom: 1.2em;
}

.callout-icon {
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1.6;

  img { width: 20px; height: 20px; object-fit: contain; }
}

.callout-text {
  font-family: $sans;
  font-size: 14px;
  line-height: 1.8;
  color: $ink;
}

/* ── Divider ─────────────────────────────────────── */
.nb-divider {
  height: 1px;
  background: $rule;
  margin: 2em 0;
}

/* ── Code ───────────────────────────────────────── */
.nb-code {
  margin-bottom: 1.5em;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #2a2a2a;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
}

.code-lang {
  font-family: $mono;
  font-size: 10px;
  color: #666;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.code-copy {
  font-family: $mono;
  font-size: 10px;
  color: #555;
  background: none;
  border: 1px solid #333;
  padding: 2px 8px;
  cursor: pointer;
  letter-spacing: 0.06em;
  transition: color 0.15s, border-color 0.15s;

  &:hover { color: #ccc; border-color: #555; }
}

.code-pre {
  margin: 0;
  padding: 20px 16px;
  background: #111;
  overflow-x: auto;

  code {
    font-family: $mono;
    font-size: 13px;
    line-height: 1.7;
    color: #d4d4d4;
    white-space: pre;
    display: block;
  }
}

/* ── Image / Video ──────────────────────────────── */
.nb-figure {
  margin: 0 0 1.5em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.nb-image {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 2px;
}

.nb-video {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 2px;
}

.nb-caption {
  margin-top: 8px;
  font-family: $mono;
  font-size: 11px;
  color: $light;
  letter-spacing: 0.04em;
}

/* ── File ───────────────────────────────────────── */
.nb-file { margin-bottom: 1em; }

.file-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: $mono;
  font-size: 12px;
  color: $muted;
  border: 1px solid $rule;
  padding: 8px 14px;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s;
  border-radius: 2px;

  &:hover { color: $ink; border-color: $ink; text-decoration: none; }
}

.file-icon {
  font-size: 14px;
  color: $ink;
}

/* ── Embed ──────────────────────────────────────── */
.nb-embed { margin-bottom: 1.5em; }

.embed-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 2px;
}

/* ── Link Preview ─────────────────────────────── */
.nb-link-preview { margin-bottom: 1em; }

/* ── Table ──────────────────────────────────────── */
.nb-table-wrap {
  margin-bottom: 1.5em;
  overflow-x: auto;
}

.nb-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid $rule;
  border-radius: 2px;
  overflow: hidden;
}

.nb-td {
  padding: 10px 14px;
  font-family: $sans;
  font-size: 14px;
  line-height: 1.6;
  color: $ink;
  border-right: 1px solid $rule;
  border-bottom: 1px solid $rule;
  vertical-align: top;

  &:last-child { border-right: none; }
}

tr:last-child .nb-td { border-bottom: none; }

tr.is-header .nb-td {
  background: rgba(0,0,0,0.025);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.02em;
}

/* ── 텍스트 스타일 ───────────────────────────────── */
.nb-link {
  color: $ink;
  text-decoration: underline;
  text-decoration-color: $light;
  text-underline-offset: 3px;
  transition: text-decoration-color 0.15s;

  &:hover { text-decoration-color: $ink; }
}

.t-bold      { font-weight: 700; }
.t-italic    { font-style: italic; }
.t-underline { text-decoration: underline; text-underline-offset: 3px; }
.t-strike    { text-decoration: line-through; }
.t-code {
  font-family: $mono;
  font-size: 0.88em;
  background: rgba(0,0,0,0.06);
  padding: 1px 5px;
  border-radius: 2px;
  color: #c0392b;
}

/* ── 반응형 ─────────────────────────────────────── */
@media (max-width: 600px) {
  .blocks-header { padding: 40px 0 28px; }
  .blocks-body   { padding: 36px 0 56px; }

  .nb-h1 { font-size: 22px; }
  .nb-h2 { font-size: 18px; }
  .nb-h3 { font-size: 15px; }

  .code-pre code { font-size: 12px; }
}
</style>
