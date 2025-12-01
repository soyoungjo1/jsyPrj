<template>
  <div>
    <p>ddddddddddd</p>
    <button @click="triggerError">에러 발생 테스트</button>
    <div class="notion_list_wrap">
      <ul>
        <li v-for="(item, index) in notionList" :key="item.id || index" class="notion_item">
          <a @click="goDetail(item.id)" class="notion_link">
            <div class="notion_icon">
              <img v-if="item.icon?.type === 'custom_emoji'" :src="item.icon.custom_emoji.url" alt="icon" />
              <img v-else-if="item.icon?.type === 'external'" :src="item.icon.external.url" alt="icon" />
            </div>
            <div class="notion_content">
              <h3 class="notion_title">
                {{ getTitle(item) }}
              </h3>
              <div class="notion_meta">
                <span class="created_date">{{ formatDate(item.created_time) }}</span>
                <span class="edited_date">{{ formatDate(item.last_edited_time) }}</span>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRootStore } from '@/stores/useRootStore';
import { sendGet } from '~/utils/api'

const rootStore = useRootStore();
const config = useRuntimeConfig();
const notionList = ref<any[]>([]);

// 강제 에러 발생 함수
const triggerError = () => {
  throw new Error('테스트 에러입니다!');
};

// 제목 추출 함수
const getTitle = (item: any) => {
  return item.properties?.['문서 이름']?.title?.[0]?.plain_text || '제목 없음'
}

// 날짜 포맷 함수
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getNotionList = async () => {
  try {
    const databaseId = config.public.notionDocsDataId
    const res = await sendGet('api/notionList', { databaseId })
    notionList.value = res?.results || []
    console.log('notionList::::::::::::::', notionList.value);
  } catch (error) {
    rootStore.toast('리스트를 불러오지 못했습니다.')
  }
}

const goDetail = (pageId: string) => {
  navigateTo(`/docs/detail/${pageId}`)
}


onMounted(async () => {
  await getNotionList();
})

</script>

<style scoped>
.notion_list_wrap {
  padding: 20px;
}

.notion_list_wrap ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notion_item {
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.notion_item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notion_link {
  display: flex;
  align-items: center;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  gap: 16px;
}

.notion_icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notion_icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.notion_content {
  flex: 1;
  min-width: 0;
}

.notion_title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.notion_meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.created_date::before {
  content: '생성: ';
}

.edited_date::before {
  content: '수정: ';
}
</style>
