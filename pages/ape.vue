<script lang="ts" setup>
const routes = ref([
    { name: 'ape.page1Name', to: '/ape' },
    { name: 'ape.page2Name', to: '/ape/page2' },
    { name: 'ape.page3Name', to: '/ape/page3' },
]);
</script>

<template>
    <ShellLayout :navigation="routes">
        <NuxtPage />
    </ShellLayout>
</template>
