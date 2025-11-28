<template>
  <div>
    <p>ddddddddddd</p>
    <button @click="triggerError">에러 발생 테스트</button>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRootStore } from '@/stores/useRootStore';
import { sendGet } from '~/utils/api'

const rootStore = useRootStore();
const notionList = ref<any[]>([]);

// 강제 에러 발생 함수
const triggerError = () => {
  throw new Error('테스트 에러입니다!');
};

const getNotionList = async () => {
  try {
    const databaseId = 'b25d7dd6abea4a7393adb43e74fd5848'
    const res = await sendGet('api/notionList', { databaseId })
    notionList.value = res?.results || []
    console.log('notionList::::::::::::::', notionList.value);
  } catch (error) {
    rootStore.toast('리스트를 불러오지 못했습니다.')
  }
}


onMounted(async () => {
  await getNotionList();
})

</script>

<style scoped>

</style>
