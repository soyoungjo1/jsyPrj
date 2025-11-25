<template>
    <div class="confirm_overlay" v-if="rootStore.confirm">
      <div class="confirm_box">
        <div class="confirm_cont_wrap">
            <button type="button" v-if="rootStore.confirmIsShowClose" class="close" @click="close()">
                <NuxtImg src="/images/close.png" alt="닫기"/>
            </button>
            <div class="confirm_cont">
                <h3 v-if="rootStore.confirmTitle">{{ rootStore.confirmTitle }}</h3>
                <p v-if="rootStore.confirmMessage"> {{ rootStore.confirmMessage }}</p>
                <div class="confirm_btn">
                  <button type="button" class="btn cancel" @click="cancel()" v-if="rootStore.confirmCancelBtn">{{ rootStore.confirmCancelBtn }}</button>
                  <button type="button" class="btn okay" @click="okay()" v-if="rootStore.confirmOkayBtn">{{ rootStore.confirmOkayBtn }}</button>
                </div>
            </div>
        </div>
      </div> 
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRootStore } from '@/stores/useRootStore';
  const rootStore = useRootStore();
  
  
  /**
   * openConfirm 호출 예시
   */
  /*
  rootStore.openConfirm(
    "test",                             // title
    "testtest",                         // message
    "닫기",                             // cancelBtn (보여지기만 하면 되므로 텍스트만 지정)
    "확인",                             // okayBtn
    null,                              // cancelFunc: null로 설정하면 아무 동작 안함
    () => { navigateTo('/login'); },   // okayFunc: 로그인 페이지 이동
    true                               // isShowClose: X 버튼 표시
  );
  */
  
  const close = () => {
      rootStore.resetConfirm();
  }
  
  const cancel = () => {
    if (rootStore.confirmCancelFunc) rootStore.confirmCancelFunc();
    close();
  }
  
  const okay = () => {
    if (rootStore.confirmOkayFunc) rootStore.confirmOkayFunc();
    close();
  }
  
  </script>
  
  <style lang="scss">
  .confirm_overlay {
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
  
  .confirm_box{
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
  
  .confirm_cont_wrap{
    position:relative;
  }
  
  .confirm_cont_wrap button.close{
    position:absolute;
    top:0;
    right:0;
    border:none;
    background:none;
    img{
      width:25px;
    }
  }
  
  .confirm_cont{
    overflow: hidden;
    padding:15px 0;
  }
  
  .confirm_cont h3{
    font-size:25px;
    font-weight: 800;
    padding : 0;
  }
  
  .confirm_cont p{
    font-size:16px;
    font-weight:500;
    color:#555;
    padding:10px 0 30px;
    word-break: break-word;
  }
  
  .confirm_btn{
    display:flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .confirm_btn button{
    width:100%;
    border:none;
    padding:10px 0;
    border-radius:10px;
  }
  
  .confirm_btn button.okay{
    background:#000;
    color:#fff;
  }
  
  .confirm_btn button.cancel{
    background:#ddd;
    color:#aaa;
    margin-right: 10px;
  }
  
  </style>
  