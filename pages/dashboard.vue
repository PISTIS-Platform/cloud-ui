<script lang="ts" setup>
const routes = ref([
    { name: 'dashboard.status', to: '/dashboard' },
    { name: 'dashboard.resources', to: '/dashboard/resources' },
]);
</script>

<template>
    <ShellLayout :navigation="routes">
        <NuxtPage />
    </ShellLayout>
</template>
