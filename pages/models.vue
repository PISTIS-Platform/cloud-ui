<script lang="ts" setup>
const routes = ref([
    { name: 'models.overview', to: '/models' },
    { name: 'models.upload', to: '/models/upload' },
]);
</script>

<template>
    <ShellLayout :navigation="routes">
        <NuxtPage />
    </ShellLayout>
</template>
