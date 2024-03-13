<script lang="ts" setup>
const routes = ref([
    { name: 'usage-analytics.overview', to: '/usage-analytics' },
    { name: 'usage-analytics.questionaries', to: '/usage-analytics/questionaries' },
]);
</script>

<template>
    <ShellLayout :navigation="routes">
        <NuxtPage />
    </ShellLayout>
</template>
