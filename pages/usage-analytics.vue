<script lang="ts" setup>
const routes = ref([
    { name: 'usage-analytics.overview', to: '/usage-analytics' },
    { name: 'usage-analytics.questionnaires', to: '/usage-analytics/questionnaires' },
]);
</script>

<template>
    <ShellLayout :navigation="routes">
        <NuxtPage />
    </ShellLayout>
</template>
