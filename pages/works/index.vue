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

</script>