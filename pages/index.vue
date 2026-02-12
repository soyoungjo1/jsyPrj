<template>
  <!--메인-->
  <div class="main_wrap">
    <AsciiArt />
    
    <Cont/>
  </div>
</template>

<script setup lang="ts">
import AsciiArt from '~/views/main/asciiArt.vue'
import Cont from '~/views/main/cont.vue'
</script>


<style scoped>
 .main_wrap{
  height:100vh;
 }
</style>