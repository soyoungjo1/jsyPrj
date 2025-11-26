<!-- app.vue -->
<template>
  <NuxtErrorBoundary @error="handleError">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </NuxtErrorBoundary>
  <Toast /> 
  <Confirm />
  <MessageDialog/>
</template>


<script setup lang="ts">
import Toast from '@/component/Toast.vue'
import Confirm from './component/Confirm.vue';
import MessageDialog from './component/MessageDialog.vue';

const handleError = (error: any) => {
  errorLog('NuxtErrorBoundary', error);
};

</script>