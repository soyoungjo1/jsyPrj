<template>
    <div class="container">
      <div v-if="error.statusCode === 404" class="notice-wrap">
        <div class="notice">
          <h2 class="header">페이지를 찾을 수 없습니다.</h2>
          <p>
            존재하지 않는 주소를 입력하셨거나<br>
            요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
          </p>
        </div>
      </div>
      <div v-else>
        <h1>알 수 없는 오류가 발생했습니다.</h1>
        <p>{{ error.message }}</p>
      </div>
      <NuxtLink to="/">Home page</NuxtLink>
    </div>
  </template>
  
  <script setup>
  const { error } = defineProps(['error']);
  
  console.log('error', error.statusCode);
  console.log('Message:', error.message);
  console.log('Stack:', error.stack);
  
  
  </script>
  
  <style scoped>
  .notice-wrap {
    height: 100vh;
    display: flex;
    justify-content: center;
  }
  .notice {
    margin: auto 0;
    padding: 50px;
    width: 720px;
    font-size: 22px;
    font-weight: normal;
    text-align: center;
  }
  .header {
    font-size: 46px;
    margin-bottom: 10px;
  }
  </style>
  