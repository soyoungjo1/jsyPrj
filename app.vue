<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast /> 
  <Confirm />
  <MessageDialog/>
</template>


<script setup lang="ts">
import Toast from '@/component/Toast.vue'
import Confirm from './component/Confirm.vue';
import MessageDialog from './component/MessageDialog.vue';

</script>