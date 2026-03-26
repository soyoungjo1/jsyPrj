<template>
  <div>
    <Header/>
    <div class="layout-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '~/component/Header.vue';
</script>

<style>
.layout-content {
  padding-top: 57px; /* 헤더 고정 높이 보정 */
}
</style>

