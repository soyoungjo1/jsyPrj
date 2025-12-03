<template>
  <div class="notion_blocks_wrap">
    <h1 class="page_title">{{ pageTitle || '' }}</h1>
    <div 
      v-for="(block, index) in filteredBlocks" 
      :key="block.id" 
      class="notion_block"
      :class="`notion_block--${block.type}`"
      :data-aos="getAosAnimation(block.type)"
    >
      <!-- Paragraph Block -->
      <div v-if="block.type === 'paragraph'" class="paragraph_block">
        <p v-if="block.paragraph?.rich_text?.length" class="paragraph_text">
          <span 
            v-for="(text, idx) in block.paragraph.rich_text" 
            :key="idx"
            :class="getTextStyle(text)"
          >
            <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
              {{ text.plain_text }}
            </a>
            <span v-else>{{ text.plain_text }}</span>
          </span>
        </p>
      </div>

      <!-- Heading 1 Block -->
      <div v-else-if="block.type === 'heading_1'" class="heading_1_block">
        <h1 v-if="block.heading_1?.rich_text?.length" class="heading_1_text">
          <span 
            v-for="(text, idx) in block.heading_1.rich_text" 
            :key="idx"
            :class="getTextStyle(text)"
          >
            <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
              {{ text.plain_text }}
            </a>
            <span v-else>{{ text.plain_text }}</span>
          </span>
        </h1>
      </div>

      <!-- Heading 2 Block -->
      <div v-else-if="block.type === 'heading_2'" class="heading_2_block">
        <h2 v-if="block.heading_2?.rich_text?.length" class="heading_2_text">
          <span 
            v-for="(text, idx) in block.heading_2.rich_text" 
            :key="idx"
            :class="getTextStyle(text)"
          >
            <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
              {{ text.plain_text }}
            </a>
            <span v-else>{{ text.plain_text }}</span>
          </span>
        </h2>
      </div>

      <!-- Heading 3 Block -->
      <div v-else-if="block.type === 'heading_3'" class="heading_3_block">
        <h3 v-if="block.heading_3?.rich_text?.length" class="heading_3_text">
          <span 
            v-for="(text, idx) in block.heading_3.rich_text" 
            :key="idx"
            :class="getTextStyle(text)"
          >
            <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
              {{ text.plain_text }}
            </a>
            <span v-else>{{ text.plain_text }}</span>
          </span>
        </h3>
      </div>

      <!-- Bulleted List Item Block -->
      <div v-else-if="block.type === 'bulleted_list_item'" class="bulleted_list_item_block">
        <ul v-if="block.bulleted_list_item?.rich_text?.length" class="bulleted_list">
          <li class="bulleted_list_item">
            <span 
              v-for="(text, idx) in block.bulleted_list_item.rich_text" 
              :key="idx"
              :class="getTextStyle(text)"
            >
              <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
                {{ text.plain_text }}
              </a>
              <span v-else>{{ text.plain_text }}</span>
            </span>
          </li>
        </ul>
      </div>

      <!-- Numbered List Item Block -->
      <div v-else-if="block.type === 'numbered_list_item'" class="numbered_list_item_block">
        <ol v-if="block.numbered_list_item?.rich_text?.length" class="numbered_list">
          <li class="numbered_list_item">
            <span 
              v-for="(text, idx) in block.numbered_list_item.rich_text" 
              :key="idx"
              :class="getTextStyle(text)"
            >
              <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
                {{ text.plain_text }}
              </a>
              <span v-else>{{ text.plain_text }}</span>
            </span>
          </li>
        </ol>
      </div>

      <!-- To Do Block -->
      <div v-else-if="block.type === 'to_do'" class="to_do_block">
        <div class="to_do_item">
          <input 
            type="checkbox" 
            :checked="block.to_do?.checked" 
            disabled
            class="to_do_checkbox"
          />
          <label class="to_do_label" :class="{ 'to_do_label--checked': block.to_do?.checked }">
            <span 
              v-for="(text, idx) in block.to_do?.rich_text || []" 
              :key="idx"
              :class="getTextStyle(text)"
            >
              <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
                {{ text.plain_text }}
              </a>
              <span v-else>{{ text.plain_text }}</span>
            </span>
          </label>
        </div>
      </div>

      <!-- Toggle Block -->
      <div v-else-if="block.type === 'toggle'" class="toggle_block">
        <div class="toggle_header" @click="toggleBlock(block.id)">
          <span class="toggle_icon" :class="{ 'toggle_icon--open': isOpen(block.id) }">▶</span>
          <div v-if="block.toggle?.rich_text?.length" class="toggle_title">
            <span 
              v-for="(text, idx) in block.toggle.rich_text" 
              :key="idx"
              :class="getTextStyle(text)"
            >
              <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
                {{ text.plain_text }}
              </a>
              <span v-else>{{ text.plain_text }}</span>
            </span>
          </div>
        </div>
        <div v-if="isOpen(block.id) && block.has_children" class="toggle_content">
          <!-- 자식 블록은 나중에 API로 가져올 수 있음 -->
        </div>
      </div>

      <!-- Quote Block -->
      <div v-else-if="block.type === 'quote'" class="quote_block">
        <blockquote class="quote_text">
          <span 
            v-for="(text, idx) in block.quote?.rich_text || []" 
            :key="idx"
            :class="getTextStyle(text)"
          >
            <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
              {{ text.plain_text }}
            </a>
            <span v-else>{{ text.plain_text }}</span>
          </span>
        </blockquote>
      </div>

      <!-- Callout Block -->
      <div v-else-if="block.type === 'callout'" class="callout_block">
        <div class="callout_content">
          <div v-if="block.callout?.icon" class="callout_icon">
            <span v-if="block.callout.icon.type === 'emoji'">{{ block.callout.icon.emoji }}</span>
            <img v-else-if="block.callout.icon.type === 'file'" :src="block.callout.icon.file?.url" alt="icon" />
            <img v-else-if="block.callout.icon.type === 'external'" :src="block.callout.icon.external?.url" alt="icon" />
          </div>
          <div class="callout_text">
            <span 
              v-for="(text, idx) in block.callout?.rich_text || []" 
              :key="idx"
              :class="getTextStyle(text)"
            >
              <a v-if="text.href" :href="text.href" target="_blank" rel="noopener noreferrer" class="text_link">
                {{ text.plain_text }}
              </a>
              <span v-else>{{ text.plain_text }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Divider Block -->
      <div v-else-if="block.type === 'divider'" class="divider_block">
        <hr class="divider_line" />
      </div>

      <!-- Code Block -->
      <div v-else-if="block.type === 'code'" class="code_block">
        <div v-if="block.code?.rich_text?.length" class="code_wrapper">
          <div v-if="block.code?.language" class="code_language">{{ block.code.language }}</div>
          <pre class="code_pre"><code class="code_content">{{ getCodeText(block.code.rich_text) }}</code></pre>
        </div>
      </div>

      <!-- Image Block -->
      <div v-else-if="block.type === 'image'" class="image_block">
        <div v-if="getImageUrl(block)" class="image_wrapper">
          <img 
            :src="getImageUrl(block)" 
            :alt="getImageCaption(block)"
            class="image_content"
            loading="lazy"
          />
          <div v-if="getImageCaption(block)" class="image_caption">
            {{ getImageCaption(block) }}
          </div>
        </div>
      </div>

      <!-- Video Block -->
      <div v-else-if="block.type === 'video'" class="video_block">
        <div v-if="getVideoUrl(block)" class="video_wrapper">
          <video 
            :src="getVideoUrl(block)" 
            controls
            class="video_content"
          />
          <div v-if="getVideoCaption(block)" class="video_caption">
            {{ getVideoCaption(block) }}
          </div>
        </div>
      </div>

      <!-- File Block -->
      <div v-else-if="block.type === 'file'" class="file_block">
        <div v-if="getFileUrl(block)" class="file_wrapper">
          <a :href="getFileUrl(block)" target="_blank" rel="noopener noreferrer" class="file_link">
            <span class="file_icon">📎</span>
            <span class="file_name">{{ getFileName(block) || '파일 다운로드' }}</span>
          </a>
        </div>
      </div>

      <!-- Embed Block -->
      <div v-else-if="block.type === 'embed'" class="embed_block">
        <div v-if="block.embed?.url" class="embed_wrapper">
          <iframe 
            :src="block.embed.url" 
            class="embed_content"
            frameborder="0"
            allowfullscreen
          />
        </div>
      </div>

      <!-- Link Preview Block -->
      <div v-else-if="block.type === 'link_preview'" class="link_preview_block">
        <a :href="block.link_preview?.url" target="_blank" rel="noopener noreferrer" class="link_preview_link">
          {{ block.link_preview?.url }}
        </a>
      </div>

      <!-- Table Block -->
      <div v-else-if="block.type === 'table'" class="table_block">
        <table class="table_content">
          <tbody>
            <tr v-for="(row, rowIdx) in block.table?.table_rows || []" :key="rowIdx" class="table_row">
              <td 
                v-for="(cell, cellIdx) in row.table_row?.cells || []" 
                :key="cellIdx"
                class="table_cell"
              >
                <span 
                  v-for="(text, textIdx) in cell" 
                  :key="textIdx"
                  :class="getTextStyle(text)"
                >
                  {{ text.plain_text }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Unknown Block -->
      <div v-else class="unknown_block">
        <span class="block_type_badge">{{ block.type }}</span>
        <p class="unknown_block_text">지원하지 않는 블록 타입입니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRootStore } from '@/stores/useRootStore';
import { sendGet } from '~/utils/api'

const route = useRoute();
const rootStore = useRootStore();
const pageId = computed(() => (route.params.id || route.query.id) as string);
const openToggles = ref<Set<string>>(new Set());

// 페이지 정보 조회 (제목 추출용)
const { data: pageInfoData } = useQuery({
  queryKey: ['notionPage', pageId],
  queryFn: async () => {
    if (!pageId.value) return null;
    return await sendGet('api/notionPage', { id: pageId.value });
  },
  enabled: computed(() => !!pageId.value),
})

const notionPageInfo = computed(() => pageInfoData.value || null);

// 페이지 제목 추출
const pageTitle = computed(() => {
  const properties = notionPageInfo.value?.properties || {};
  for (const key in properties) {
    const prop = properties[key];
    if (prop?.type === 'title' && prop?.title?.[0]?.plain_text) {
      return prop.title[0].plain_text
    }
  }
  return ''
})

// Notion Blocks 조회
const { data: notionBlockData } = useQuery({
  queryKey: ['notionBlock', pageId],
  queryFn: async () => {
    if (!pageId.value) return null;
    const res = await sendGet('api/notionDetail', { id: pageId.value })
    const results = res?.results || []
    return results
  }, 
  enabled: computed(() => !!pageId.value),
})

const notionBlocks = computed(() => notionBlockData.value || []);
console.log('notionBlocks:::::::::::::::', notionBlocks.value);


// 빈 블록 필터링
const filteredBlocks = computed(() => {
  return notionBlocks.value.filter((block: any) => {
    if (block.type === 'paragraph' && (!block.paragraph?.rich_text?.length)) return false
    if (block.type === 'bulleted_list_item' && (!block.bulleted_list_item?.rich_text?.length)) return false
    if (block.type === 'numbered_list_item' && (!block.numbered_list_item?.rich_text?.length)) return false
    if (block.type === 'code' && (!block.code?.rich_text?.length)) return false
    return true
  })
})

// 텍스트 스타일 추출
const getTextStyle = (text: any) => {
  const styles: string[] = []
  if (text.annotations?.bold) styles.push('text_bold')
  if (text.annotations?.italic) styles.push('text_italic')
  if (text.annotations?.underline) styles.push('text_underline')
  if (text.annotations?.strikethrough) styles.push('text_strikethrough')
  if (text.annotations?.code) styles.push('text_code')
  return styles.join(' ')
}

// 코드 텍스트 추출
const getCodeText = (richText: any[]) => {
  return richText.map(text => text.plain_text).join('')
}

// 이미지 URL 추출
const getImageUrl = (block: any) => {
  if (block.image?.type === 'file') {
    return block.image.file?.url
  } else if (block.image?.type === 'external') {
    return block.image.external?.url
  }
  return null
}

// 이미지 캡션 추출
const getImageCaption = (block: any) => {
  if (block.image?.caption?.length) {
    return block.image.caption.map((text: any) => text.plain_text).join('')
  }
  return ''
}

// 비디오 URL 추출
const getVideoUrl = (block: any) => {
  if (block.video?.type === 'file') {
    return block.video.file?.url
  } else if (block.video?.type === 'external') {
    return block.video.external?.url
  }
  return null
}

// 비디오 캡션 추출
const getVideoCaption = (block: any) => {
  if (block.video?.caption?.length) {
    return block.video.caption.map((text: any) => text.plain_text).join('')
  }
  return ''
}

// 파일 URL 추출
const getFileUrl = (block: any) => {
  if (block.file?.type === 'file') {
    return block.file.file?.url
  } else if (block.file?.type === 'external') {
    return block.file.external?.url
  }
  return null
}

// 파일명 추출
const getFileName = (block: any) => {
  if (block.file?.caption?.length) {
    return block.file.caption.map((text: any) => text.plain_text).join('')
  }
  return block.file?.name || ''
}

// Toggle 열기/닫기
const toggleBlock = (blockId: string) => {
  if (openToggles.value.has(blockId)) {
    openToggles.value.delete(blockId)
  } else {
    openToggles.value.add(blockId)
  }
}

// Toggle 열림 상태 확인
const isOpen = (blockId: string) => {
  return openToggles.value.has(blockId)
}

//AOS애니메이션 추가
const getAosAnimation = (blockType: string) => {
  const animations: Record<string, string> = {
    'heading_1': 'fade-up',
    'heading_2': 'fade-up',
    'heading_3': 'fade-up',
    'paragraph': 'fade-up',
    'code': 'fade-up',
    'image': 'zoom-in',
    'video': 'zoom-in',
    'quote': 'fade-right',
    'callout': 'fade-left',
    'table': 'fade-up',
  }
  return animations[blockType] || 'fade-up'
}

</script>

<style scoped>
.notion_blocks_wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #ffffff;
  min-height: 100vh;
}

.page_title {
  font-size: 36px;
  font-weight: 700;
  color: #191f28;
  margin: 0 0 2em 0;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.notion_block {
  margin-bottom: 0;
}

/* ============================================
   텍스트·기본 콘텐츠 블록
   ============================================ */

/* Paragraph Block */
.paragraph_block {
  padding: 0;
  margin-bottom: 1.2em;
  line-height: 1.5;
}

.paragraph_text {
  font-size: 16px;
  line-height: 1.5;
  color: #2d3748;
  margin: 0;
  word-break: break-word;
}

/* Heading Blocks */
.heading_1_block {
  padding: 0;
  margin-bottom: 1.2em;
  margin-top: 2em;
}

.heading_1_block:first-child {
  margin-top: 0;
}

.heading_1_text {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  color: #191f28;
  margin: 0;
  word-break: break-word;
}

.heading_2_block {
  padding: 0;
  margin-bottom: 1.5em;
  margin-top: 2em;
}

.heading_2_block:first-child {
  margin-top: 0;
}

.heading_2_text {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  color: #191f28;
  margin: 0;
  word-break: break-word;
}

.heading_3_block {
  padding: 0;
  margin-bottom: 1.5em;
  margin-top: 1.5em;
}

.heading_3_block:first-child {
  margin-top: 0;
}

.heading_3_text {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
  color: #191f28;
  margin: 0;
  word-break: break-word;
}

/* List Blocks */
.bulleted_list_item_block {
  padding: 0;
  margin-bottom: 1em;
}

.bulleted_list {
  margin: 0;
  padding-left: 1.2em;
  list-style-type: disc;
}

.bulleted_list_item {
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
  margin-bottom: 0.5em;
}

.bulleted_list_item:last-child {
  margin-bottom: 0;
}

.numbered_list_item_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.numbered_list {
  margin: 0;
  padding-left: 1.5em;
  list-style-type: decimal;
}

.numbered_list_item {
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
  margin-bottom: 0.5em;
}

.numbered_list_item:last-child {
  margin-bottom: 0;
}

/* To Do Block */
.to_do_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.to_do_item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.to_do_checkbox {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: not-allowed;
  accent-color: #2563eb;
}

.to_do_label {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
  cursor: default;
}

.to_do_label--checked {
  text-decoration: line-through;
  color: #8b95a1;
}

/* Toggle Block */
.toggle_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.toggle_header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
}

.toggle_header:hover {
  opacity: 0.8;
}

.toggle_icon {
  font-size: 12px;
  color: #8b95a1;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-top: 4px;
}

.toggle_icon--open {
  transform: rotate(90deg);
}

.toggle_title {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
}

.toggle_content {
  margin-top: 8px;
  margin-left: 20px;
  padding-left: 12px;
  border-left: 2px solid #e5e8eb;
}

/* Quote Block */
.quote_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.quote_text {
  margin: 0;
  padding: 16px 20px;
  border-left: 4px solid #e5e8eb;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
  font-style: italic;
}

/* Callout Block */
.callout_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.callout_content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
  border-radius: 4px;
}

.callout_icon {
  font-size: 24px;
  flex-shrink: 0;
  line-height: 1;
}

.callout_icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.callout_text {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
}

/* Divider Block */
.divider_block {
  padding: 0;
  margin: 2em 0;
}

.divider_line {
  border: none;
  border-top: 2px solid #e5e8eb;
  margin: 0;
}

/* ============================================
   코드 & 수식 블록
   ============================================ */

.code_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.code_wrapper {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.code_language {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 12px;
  color: #8b95a1;
  text-transform: uppercase;
  font-weight: 500;
  z-index: 1;
}

.code_pre {
  margin: 0;
  padding: 20px;
  background: #1e1e1e;
  overflow-x: auto;
}

.code_content {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #d4d4d4;
  white-space: pre;
  word-wrap: normal;
  display: block;
}

/* ============================================
   미디어 블록
   ============================================ */

.image_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.image_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image_content {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

.image_caption {
  margin-top: 8px;
  font-size: 14px;
  color: #8b95a1;
  text-align: center;
  font-style: italic;
}

.video_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.video_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video_content {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
}

.video_caption {
  margin-top: 8px;
  font-size: 14px;
  color: #8b95a1;
  text-align: center;
  font-style: italic;
}

.file_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.file_wrapper {
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e5e8eb;
  border-radius: 8px;
}

.file_link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #2563eb;
  font-size: 16px;
}

.file_link:hover {
  text-decoration: underline;
}

.file_icon {
  font-size: 20px;
}

.file_name {
  flex: 1;
}

.embed_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.embed_wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 비율 */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
}

.embed_content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.link_preview_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.link_preview_link {
  font-size: 16px;
  color: #2563eb;
  text-decoration: none;
  word-break: break-all;
  line-height: 1.8;
}

.link_preview_link:hover {
  text-decoration: underline;
}

/* ============================================
   표 블록
   ============================================ */

.table_block {
  padding: 0;
  margin-bottom: 1.5em;
  overflow-x: auto;
}

.table_content {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e8eb;
  border-radius: 8px;
  overflow: hidden;
}

.table_row {
  border-bottom: 1px solid #e5e8eb;
}

.table_row:last-child {
  border-bottom: none;
}

.table_cell {
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.6;
  color: #2d3748;
  border-right: 1px solid #e5e8eb;
}

.table_cell:last-child {
  border-right: none;
}

.table_row:first-child .table_cell {
  background: #f8f9fa;
  font-weight: 600;
}

/* ============================================
   텍스트 스타일
   ============================================ */

.text_link {
  color: #2563eb;
  text-decoration: none;
}

.text_link:hover {
  text-decoration: underline;
}

.text_bold {
  font-weight: 700;
}

.text_italic {
  font-style: italic;
}

.text_underline {
  text-decoration: underline;
}

.text_strikethrough {
  text-decoration: line-through;
}

.text_code {
  background: #f1f3f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  font-size: 14px;
  color: #e03131;
}

/* ============================================
   기타 블록
   ============================================ */

.unknown_block {
  padding: 0;
  margin-bottom: 1.5em;
  display: flex;
  align-items: center;
  gap: 12px;
}

.block_type_badge {
  background: #f1f3f5;
  color: #8b95a1;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.unknown_block_text {
  font-size: 14px;
  color: #8b95a1;
  margin: 0;
}

/* ============================================
   반응형 디자인
   ============================================ */

@media (max-width: 768px) {
  .notion_blocks_wrap {
    padding: 24px 16px;
  }

  .paragraph_text,
  .link_preview_link,
  .bulleted_list_item,
  .numbered_list_item,
  .to_do_label,
  .callout_text {
    font-size: 15px;
  }

  .heading_1_text {
    font-size: 28px;
  }

  .heading_2_text {
    font-size: 22px;
  }

  .heading_3_text {
    font-size: 18px;
  }

  .code_content {
    font-size: 13px;
  }

  .code_pre {
    padding: 16px;
  }

  .table_block {
    font-size: 14px;
  }

  .table_cell {
    padding: 8px 12px;
  }
}
</style>