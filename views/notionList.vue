<template>
  <div>
    <p>ddddddddddd</p>
    <button @click="triggerError">에러 발생 테스트</button>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'

const notionList = ref<any[]>([]);

// 강제 에러 발생 함수
const triggerError = () => {
  throw new Error('테스트 에러입니다!');
};

const getNotionList = async () => {
  try {
    const databaseId = 'b25d7dd6abea4a7393adb43e74fd5848'
    const response = await fetch(`/api/notionList?databaseId=${databaseId}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    const res = await response.json();
    notionList.value = res?.results || []
  } catch (error) {
    errorLog('API 호출 에러', error)
  }
}

onMounted(async () => {
  await getNotionList();
})

</script>

<style scoped>

</style>
