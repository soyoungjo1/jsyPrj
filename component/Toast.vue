<template>
    <div class="toast_box" v-if="rootStore.toastShow">
      <div class="toast_cont">{{ rootStore.toastText }}</div>
    </div> 
  </template>
  
  <script setup lang="ts">
  import { useRootStore } from '@/stores/useRootStore';
  const rootStore = useRootStore();
  </script>
  
  <style lang="scss">
  .toast_box {
    position: fixed;
    width:80%;
    bottom: 20px;
    left: 50%;
    border-radius:100px;
    transform: translateX(-50%);
    background: #333;
    z-index: 9999;
    font-size: 16px;
    .toast_cont{
      padding: 8px 20px;
      font-size: 13px;
      color: #fff;
    }
  }
  </style>
  