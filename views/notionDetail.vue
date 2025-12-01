<template>
  <div class="notion_detail_wrap">
    <div class="page_header">
      <div v-if="pageIcon" class="page_icon">
        <img v-if="pageIconType === 'file' || pageIconType === 'external'" :src="pageIcon" alt="page icon" />
        <span v-else>{{ pageIcon }}</span>
      </div>
      <h1 class="page_title">{{ pageTitle || '문서' }}</h1>
    </div>
    <div class="notion_blocks">
      <div 
        v-for="block in notionDetails" 
        :key="block.id" 
        class="notion_block"
        :class="`notion_block--${block.type}`"
      >
        <!-- Child Page Block -->
        <div v-if="block.type === 'child_page'" class="child_page_card">
          <div class="child_page_icon">
            <img v-if="getChildPageIconType(block.id) === 'file' || getChildPageIconType(block.id) === 'external'" :src="getChildPageIcon(block.id)" alt="page icon" />
            <span v-else-if="getChildPageIcon(block.id)">{{ getChildPageIcon(block.id) }}</span>
            <span v-else>📄</span>
          </div>
          <div class="child_page_content" @click="goBlockPage(block.id)">
            <h3 class="child_page_title">{{ block.child_page?.title || '제목 없음' }}</h3>
          </div>
        </div>

        <!-- Paragraph Block -->
        <div v-else-if="block.type === 'paragraph'" class="paragraph_block">
          <p v-if="block.paragraph?.rich_text?.length" class="paragraph_text">
            <span 
              v-for="(text, idx) in block.paragraph.rich_text" 
              :key="idx"
              :class="getTextStyle(text)"
            >
              {{ text.plain_text }}
            </span>
          </p>
          <p v-else class="paragraph_empty">빈 문단</p>
        </div>

        <!-- Other Block Types -->
        <div v-else class="unknown_block">
          <span class="block_type_badge">{{ block.type }}</span>
          <p class="unknown_block_text">지원하지 않는 블록 타입입니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRootStore } from '@/stores/useRootStore';
import { sendGet } from '~/utils/api'

const route = useRoute();
const rootStore = useRootStore();
const notionDetails = ref<any[]>([]);
const pageTitle = ref<string>('');
const pageIcon = ref<string>('');
const pageIconType = ref<string>('');
const childPageIcons = ref<Record<string, { icon: string; type: string }>>({});

const goBlockPage = (pageId: string) => {
  navigateTo(`/docs/detail/blocks/${pageId}`)
}

const getPageInfo = async (pageId: string) => {
  try {
    const res = await sendGet('api/notionPage', { id: pageId });
    console.log('페이지 정보 응답:', res);
    console.log('페이지 아이콘:', res?.icon);
    
    // Notion 페이지 아이콘 추출
    if (res?.icon) {
      if (res.icon.type === 'emoji') {
        pageIcon.value = res.icon.emoji || '';
        pageIconType.value = 'emoji';
      } else if (res.icon.type === 'file') {
        pageIcon.value = res.icon.file?.url || '';
        pageIconType.value = 'file';
      } else if (res.icon.type === 'external') {
        pageIcon.value = res.icon.external?.url || '';
        pageIconType.value = 'external';
      }
    }
    // Notion 페이지 제목 추출 (다양한 속성명 지원)
    const properties = res?.properties || {};
    for (const key in properties) {
      const prop = properties[key];
      if (prop?.type === 'title' && prop?.title?.[0]?.plain_text) {
        pageTitle.value = prop.title[0].plain_text;
        break;
      }
    }
  } catch(error) {
    console.error('페이지 정보 가져오기 실패:', error);
    // 페이지 정보 가져오기 실패 시 무시
  }
}

const getNotionDetails = async (pageId: string) => {
  try {
    const res = await sendGet('api/notionDetail', { id: pageId });
    notionDetails.value = res?.results || []
    console.log('notionBlocks.value:::', notionDetails.value);
    
    // child_page 블록들의 아이콘 가져오기 (병렬 처리)
    const childPages = notionDetails.value.filter(detail => detail.type === 'child_page');
    await Promise.all(
      childPages
        .filter(detail => detail.id)
        .map(detail => fetchChildPageIcon(detail.id))
    );
  } catch(error){
    rootStore.toast('게시글을 불러오지 못하였습니다.')
  }
}

const fetchChildPageIcon = async (pageId: string) => {
  try {
    const res = await sendGet('api/notionPage', { id: pageId });
    console.log(`Child Page ${pageId} 정보:`, res);
    console.log(`Child Page ${pageId} 아이콘:`, res?.icon);
    
    if (res?.icon) {
      let icon = '';
      let type = '';
      if (res.icon.type === 'emoji') {
        icon = res.icon.emoji || '';
        type = 'emoji';
      } else if (res.icon.type === 'file') {
        icon = res.icon.file?.url || '';
        type = 'file';
      } else if (res.icon.type === 'external') {
        icon = res.icon.external?.url || '';
        type = 'external';
      }
      if (icon) {
        childPageIcons.value[pageId] = { icon, type };
      }
    }
  } catch(error) {
    console.error(`Child Page ${pageId} 아이콘 가져오기 실패:`, error);
    // 아이콘 가져오기 실패 시 무시
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

const getChildPageIcon = (pageId: string): string => {
  return childPageIcons.value[pageId]?.icon || '';
}

const getChildPageIconType = (pageId: string): string => {
  return childPageIcons.value[pageId]?.type || '';
}

onMounted(async () => {
  const pageId = (route.params.id || route.query.id) as string
  if (pageId) {
    await Promise.all([
      getPageInfo(pageId),
      getNotionDetails(pageId)
    ])
  } 
})
</script>

<style scoped>
.notion_detail_wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.page_header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e8eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page_icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page_icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.page_title {
  font-size: 24px;
  font-weight: 700;
  color: #191f28;
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.02em;
}

.notion_blocks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notion_block {
  background: #ffffff;
  border-radius: 12px;
  transition: all 0.2s ease;
}

/* Child Page Card */
.child_page_card {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 16px;
  cursor: pointer;
  border: 1px solid #e5e8eb;
}

.child_page_card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.child_page_icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f5;
  border-radius: 8px;
  flex-shrink: 0;
  overflow: hidden;
}

.child_page_icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.child_page_content {
  flex: 1;
  min-width: 0;
}

.child_page_title {
  font-size: 16px;
  font-weight: 600;
  color: #191f28;
  margin: 0 0 6px 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.child_page_meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta_text {
  font-size: 13px;
  color: #8b95a1;
  font-weight: 400;
}

/* Paragraph Block */
.paragraph_block {
  padding: 16px 20px;
  border: 1px solid #e5e8eb;
}

.paragraph_text {
  font-size: 15px;
  line-height: 1.7;
  color: #191f28;
  margin: 0;
  word-break: break-word;
}

.paragraph_empty {
  font-size: 15px;
  color: #8b95a1;
  margin: 0;
  font-style: italic;
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
  padding: 16px 20px;
  border: 1px solid #e5e8eb;
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
  .notion_detail_wrap {
    padding: 16px;
  }

  .page_header {
    margin-bottom: 20px;
    padding-bottom: 16px;
  }

  .page_title {
    font-size: 20px;
  }

  .child_page_card {
    padding: 16px;
  }

  .paragraph_block {
    padding: 14px 16px;
  }
}
</style>