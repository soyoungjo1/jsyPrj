<template>
    <div class="message_overlay" v-if="rootStore.messageDialogShow">
      <div class="message_box">
        <div class="message_cont_wrap">
            <div class="message_cont">
                <h3 v-if="rootStore.messageDialogTitle">{{ rootStore.messageDialogTitle }}</h3>
                <p v-if="rootStore.messageDialogMessage"> {{ rootStore.messageDialogMessage }}</p>
                <div class="message_btn">
                    <button type="button" class="btn okay" @click="clickButton()">{{ rootStore.messageDialogButtonText }}</button>
                </div>
            </div>
        </div>
      </div> 
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRootStore } from '@/stores/useRootStore';
  const rootStore = useRootStore();
  
  
  const clickButton = () => {
    if (rootStore.messageDialogClickListener) rootStore.messageDialogClickListener();
    rootStore.resetMessageDialog();
  }
  
  </script>
  
  <style lang="scss">
  .message_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);           // 배경 흐림 효과
    -webkit-backdrop-filter: blur(2px);   // Safari 호환성
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 998;
  }
  
  .message_box{
      position: fixed;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
      background:#f9f9f9;
      z-index:999;
      width:80%;
      padding:15px 30px;
      border-radius: 10px;
      box-shadow: 5px 5px 5px rgba(0, 0, 0, .05);
  }
  
  .message_cont{
    text-align: center;
  }
  
  .message_cont h3{
    font-size:25px;
    font-weight: 800;
    padding : 15px 0 0;
  }
  
  .message_cont p{
    padding: 20px 0 30px;
    font-weight: 500;
    font-size:16px;
  }
  
  .message_btn{
    padding:0 0 20px;
  }
  
  .message_btn button{
    background:#000;
    color:#fff;
    border:none;
    width:100%;
    padding:10px 0;
    border-radius: 10px;
  }
  
  
  </style>
  