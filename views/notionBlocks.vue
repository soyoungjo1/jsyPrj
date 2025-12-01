<template>
  <div class="notion_blocks_wrap">
    <div 
      v-for="block in filteredBlocks" 
      :key="block.id" 
      class="notion_block"
      :class="`notion_block--${block.type}`"
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

      <!-- Link Preview Block -->
      <div v-else-if="block.type === 'link_preview'" class="link_preview_block">
        <a :href="block.link_preview?.url" target="_blank" rel="noopener noreferrer" class="link_preview_link">
          {{ block.link_preview?.url }}
        </a>
      </div>

      <!-- Other Block Types -->
      <div v-else class="unknown_block">
        <span class="block_type_badge">{{ block.type }}</span>
        <p class="unknown_block_text">지원하지 않는 블록 타입입니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRootStore } from '@/stores/useRootStore';
import { sendGet } from '~/utils/api'

const route = useRoute();
const rootStore = useRootStore();
const notionBlocks = ref<any[]>([]);
const openToggles = ref<Set<string>>(new Set());

const filteredBlocks = computed(() => {
  return notionBlocks.value.filter(block => {
    // 빈 블록 필터링
    if (block.type === 'paragraph' && (!block.paragraph?.rich_text?.length)) return false
    if (block.type === 'bulleted_list_item' && (!block.bulleted_list_item?.rich_text?.length)) return false
    if (block.type === 'numbered_list_item' && (!block.numbered_list_item?.rich_text?.length)) return false
    if (block.type === 'code' && (!block.code?.rich_text?.length)) return false
    return true
  })
})

const getBlocksDetail = async (pageId:string) => {
  try {
    const res = await sendGet('api/notionDetail', { id: pageId });
    notionBlocks.value = res?.results || []
    console.log('notionBlocks.value:::', notionBlocks.value);
  } catch(error){
    rootStore.toast('게시글을 불러오지 못하였습니다.')
  }
}

const getTextStyle = (text: any) => {
  const styles: string[] = []
  if (text.annotations?.bold) styles.push('text_bold')
  if (text.annotations?.italic) styles.push('text_italic')
  if (text.annotations?.underline) styles.push('text_underline')
  if (text.annotations?.strikethrough) styles.push('text_strikethrough')
  if (text.annotations?.code) styles.push('text_code')
  return styles.join(' ')
}

const getCodeText = (richText: any[]) => {
  return richText.map(text => text.plain_text).join('')
}

const getImageUrl = (block: any) => {
  if (block.image?.type === 'file') {
    return block.image.file?.url
  } else if (block.image?.type === 'external') {
    return block.image.external?.url
  }
  return null
}

const getImageCaption = (block: any) => {
  if (block.image?.caption?.length) {
    return block.image.caption.map((text: any) => text.plain_text).join('')
  }
  return ''
}

const toggleBlock = (blockId: string) => {
  if (openToggles.value.has(blockId)) {
    openToggles.value.delete(blockId)
  } else {
    openToggles.value.add(blockId)
  }
}

const isOpen = (blockId: string) => {
  return openToggles.value.has(blockId)
}

onMounted(async () => {
  const pageId = (route.params.id || route.query.id) as string
  console.log('pageId:::::::::::::', pageId);
  if (pageId) {
    getBlocksDetail(pageId)
  }
})

</script>

<style scoped>
.notion_blocks_wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #ffffff;
  min-height: 100vh;
}

.notion_block {
  margin-bottom: 0;
}

/* Paragraph Block */
.paragraph_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.paragraph_text {
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
  margin: 0;
  word-break: break-word;
}

.paragraph_block:last-child .paragraph_text {
  margin-bottom: 0;
}

/* Heading 1 Block */
.heading_1_block {
  padding: 0;
  margin-bottom: 1.5em;
  margin-top: 2.5em;
}

.heading_1_text {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  color: #191f28;
  margin: 0;
  word-break: break-word;
}

.heading_1_block:first-child {
  margin-top: 0;
}

/* Heading 2 Block */
.heading_2_block {
  padding: 0;
  margin-bottom: 1.5em;
  margin-top: 2em;
}

.heading_2_text {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  color: #191f28;
  margin: 0;
  word-break: break-word;
}

.heading_2_block:first-child {
  margin-top: 0;
}

/* Bulleted List Item Block */
.bulleted_list_item_block {
  padding: 0;
  margin-bottom: 1.5em;
}

.bulleted_list {
  margin: 0;
  padding-left: 1.5em;
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

/* Numbered List Item Block */
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

/* Code Block */
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

/* Image Block */
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

/* Link Preview Block */
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

.text_link {
  color: #2563eb;
  text-decoration: none;
}

.text_link:hover {
  text-decoration: underline;
}

/* Text Styles */
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

/* Unknown Block */
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

/* Responsive */
@media (max-width: 768px) {
  .notion_blocks_wrap {
    padding: 24px 16px;
  }

  .paragraph_text,
  .link_preview_link,
  .bulleted_list_item,
  .numbered_list_item {
    font-size: 15px;
  }

  .heading_1_text {
    font-size: 28px;
  }

  .heading_2_text {
    font-size: 22px;
  }

  .code_content {
    font-size: 13px;
  }

  .code_pre {
    padding: 16px;
  }
}
</style>
