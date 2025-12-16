<template>
    <div>
        <button @click="goLinkWeb()">test1</button>
        <button @click="goLinkVisual()">test2</button>
        <div class="ascii-wrap scroll">
          <div ref="asciiWrapper1">
            <pre id="pre1"></pre>
            <!-- Insert the image want to convert -->
            <img id="img1" src="/assets/images/TESTTEST.png" crossorigin="anonymous" />
          </div>
        </div>
        <div class="ascii-wrap scroll">
          <div ref="asciiWrapper2">
            <pre id="pre2"></pre>
            <!-- Insert the second image want to convert -->
            <img id="img2" src="/assets/images/TESTTESTTEST.png" crossorigin="anonymous" />
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
const { convertImageToAscii } = useAsciiArt();
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const asciiWrapper1 = ref(null)
const asciiWrapper2 = ref(null)

onMounted(() => {
  if (import.meta.client) {
    // 첫 번째 이미지
    const img1 = document.getElementById('img1') as HTMLImageElement;
    if (img1) {
      const convertImage1 = () => {
        convertImageToAscii('img1', 'pre1', undefined, undefined, 150, 150);
        // 아스키 변환 후 스크롤 애니메이션 초기화
        nextTick(() => {
          asciiScrollImg(asciiWrapper1.value, 'pre1', 'img1');
        });
      };
      
      img1.onload = convertImage1;
      if (img1.complete) {
        convertImage1();
      }
    }
    
    // 두 번째 이미지
    const img2 = document.getElementById('img2') as HTMLImageElement;
    if (img2) {
      const convertImage2 = () => {
        convertImageToAscii('img2', 'pre2', undefined, undefined, 150, 150);
        // 아스키 변환 후 스크롤 애니메이션 초기화
        nextTick(() => {
          asciiScrollImg(asciiWrapper2.value, 'pre2', 'img2');
        });
      };
      
      img2.onload = convertImage2;
      if (img2.complete) {
        convertImage2();
      }
    }
  }
});

const goLinkWeb = () => {
    navigateTo('/web/123')
}

const goLinkVisual = () => {
    navigateTo('/visual/123')
}

/**
 * 
 works 의 메인에서는
 web / visual 선택하게 
 - web 선택 index
 1. 다녔던 회사 리스트 
 - 헥토헬스케어 (vue.js / nuxt.js) 기반 기술 이력
 - 아이스크림미디어 (몰 운영 / 어드민 프론트 작업)
 - 올하우(주) (에이전시 / 작업했던 사이트 리스트 및 클릭하면 팝업 노출)

- visual 선택 index
1. uiux디자인
2. 상세 및 기획전 디자인
- 그래픽은 어떻게 보여줄지 생각해봐야함
 */ 


 /**
  * web 
  * 헬스케어 > hecto.json[커머스 운영]
  * 아이스크림 > iscream.json [커머스 운영]
  * 올하우 > allhow.json [에이전시]
  */

</script>

<style scope>
.ascii-wrap.scroll{
  padding:2000px 0;
}

</style>

