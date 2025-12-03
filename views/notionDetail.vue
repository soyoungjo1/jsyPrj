<template>
  <div class="notion_detail_wrap">
    <!--페이지정보-->
    <div class="page_header">
      <div v-if="pageIcon" class="page_icon">
        <img v-if="pageIconType === 'custom_emoji'" :src="pageIcon" alt="page icon" />
        <span v-else>{{ pageIcon }}</span>
      </div>
      <h1 class="page_title">{{ pageTitle || '문서' }}</h1>
    </div>

    <!--노션디테일-->
    <div class="page_detail">
      <ul>
        <li v-for="(list, index) in notionDetails" :key="index" @click="goBlockPage(list.id)">
          <h3 v-if="list?.child_page">
            <p class="title_emoji">
              <img 
                v-if="getChildPageIconType(list.id) === 'custom_emoji'" 
                :src="getChildPageIcon(list.id)" 
                alt="page icon" 
              />
              <span v-else-if="getChildPageIcon(list.id)">
                {{ getChildPageIcon(list.id) }}
              </span>
              <span v-else>📄</span>
            </p>
            {{ list?.child_page?.title }}
          </h3>
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRootStore } from '@/stores/useRootStore';
import { sendGet } from '~/utils/api'

const route = useRoute();
const rootStore = useRootStore();
const pageId = computed(() => (route.params.id || route.query.id) as string);

const goBlockPage = (pageId: string) => {
  navigateTo(`/docs/detail/blocks/${pageId}`)
}

//1. 페이지 정보 조회하기
const { data: pageInfoData } = useQuery({
  queryKey : ['notionPage', pageId],
  queryFn : async () => {
    if (!pageId.value) return null;
    return await sendGet('api/notionPage', { id: pageId.value });
  },
  enabled: computed(() => !!pageId.value),
})

const notionPageInfo = computed(() => pageInfoData.value || null);
console.log('notionPageInfo::::::::::', notionPageInfo.value);

//1-1. 노션 상세의 아이콘 추출
const pageIcon = computed(()=>{
  const icon = notionPageInfo.value?.icon;
  if(!icon) return;

  if (icon.type === 'emoji') {
    return icon.emoji || ''
  } else if (icon.type === 'custom_emoji') {
    return icon.custom_emoji?.url || ''
  }
  return ''
})

//1-2. 노션 상세의 아이콘 타입
const pageIconType = computed(()=>{
  return notionPageInfo.value?.icon?.type || '';
})

//1-3. 노션 페이지 제목 추출
const pageTitle = computed(()=>{
  const properties = notionPageInfo.value?.properties || {};
  for (const key in properties){
    const prop = properties[key];
    if (prop?.type === 'title' && prop?.title?.[0]?.plain_text) {
      return prop.title[0].plain_text
    }
  }
  return ''
})

// 테스트용 로그
console.log('pageIcon:', pageIcon.value)
console.log('pageIconType:', pageIconType.value)
console.log('pageTitle:', pageTitle.value)

//2. 노션 상세 정보 조회
const { data:notionDetailsData } = useQuery({
  queryKey:['notionDetail', pageId],
  queryFn : async () => {
    if (!pageId.value) return null;
    const res = await sendGet('api/notionDetail', { id: pageId.value })
    const results = res?.results || []

    // child_page 블록들의 아이콘 가져오기 (병렬 처리)
    const childPages = results.filter((detail:any)=> detail.type === 'child_page')
    const childPageIcons : Record<string, { icon: string; type: string }> = {}

    await Promise.all(
      childPages
      .filter((detail: any) => detail.id)
      .map(async (detail:any) => {
        try{
          const iconRes = await sendGet('api/notionPage', { id: detail.id })
          if (iconRes?.icon) {
            let icon = ''
            let type = ''
            if (iconRes.icon.type === 'emoji') {
              icon = iconRes.icon.emoji || ''
              type = 'emoji'
            } else if(iconRes.icon.type === 'custom_emoji'){
              icon = iconRes.icon.custom_emoji?.url || '' 
              type = 'custom_emoji'
            }
            if (icon) {
              childPageIcons[detail.id] = { icon, type }
            }
          }
        } catch(err){
          console.error(`Child Page ${detail.id} 아이콘 가져오기 실패:`, err)
        }
      })
    )
    return { results, childPageIcons }
  },
  enabled: computed(() => !!pageId.value),
})

const notionDetails = computed(() => notionDetailsData.value?.results || [])
const childPageIcons = computed(() => notionDetailsData.value?.childPageIcons || {})
console.log('notionDetails::::::::::', notionDetails.value);
console.log('childPageIcons::::::::::', childPageIcons.value);

//3. 노션 상세 > 자식요소의 아이콘 매칭
const getChildPageIcon = (pageId : string): string => {
  return childPageIcons.value[pageId]?.icon || ''
}

const getChildPageIconType =  (pageId : string): string => {
  return childPageIcons.value[pageId]?.type || ''
}




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

.page_detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page_detail ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.page_detail li {
  margin-bottom: 12px;
}

.page_detail h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #191f28;
  margin: 0;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e8eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page_detail h3:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.title_emoji {
  margin: 0;
  font-size: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.title_emoji img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.title_emoji span {
  display: flex;
  align-items: center;
  justify-content: center;
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

  .page_detail h3 {
    padding: 14px;
    font-size: 15px;
  }
}
</style>