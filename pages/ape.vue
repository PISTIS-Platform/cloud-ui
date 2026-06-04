<script lang="ts" setup>
const routes = ref([
    { name: 'ape.organizationsTab', to: '/ape' },
    { name: 'ape.usersTab', to: '/ape/users' },
    { name: 'ape.policiesTab', to: '/ape/policies' },
]);
</script>

<template>
    <ShellLayout :navigation="routes">
        <NuxtPage />
    </ShellLayout>
</template>
