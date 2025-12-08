<template>
    <div>
        <button @click="goLinkWeb()">test1</button>
        <button @click="goLinkVisual()">test2</button>
    </div>
</template>

<script setup lang="ts">

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

</script>

