<!-- app.vue -->
<template>
  <NuxtErrorBoundary @error="handleError">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <template #error="{ error }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </template>
  </NuxtErrorBoundary>
  <Toast /> 
  <Confirm />
  <MessageDialog/>
</template>


<script setup lang="ts">
import Toast from '@/component/Toast.vue'
import Confirm from './component/Confirm.vue';
import MessageDialog from './component/MessageDialog.vue';
import { errorLog } from '~/utils/common';

const handleError = (error: any) => {
  errorLog('client', error);
};

onMounted(()=>{
  // window.onerror (동기에러)
  window.onerror = (error) => {
    errorLog('client', error)
  }
  
  // unhandledrejection (비동기에러)
  window.addEventListener('unhandledrejection', (event) => {
    errorLog('client', event.reason)
  })
})

</script>