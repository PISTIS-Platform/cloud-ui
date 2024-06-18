<script lang="ts" setup>
const routes = ref([
    { name: 'registry.registry', to: '/factory-registry' },
    { name: 'registry.servicesRegistry.title', to: '/factory-registry/services' },
]);
</script>

<template>
    <ShellLayout :navigation="routes">
        <NuxtPage />
    </ShellLayout>
</template>
