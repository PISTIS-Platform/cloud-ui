<script setup lang="ts">
const appConfig: any = useAppConfig();

useHead({
    titleTemplate: (title) => `${title ? title + ' • ' : ''}${appConfig.name}`,
    htmlAttrs: { class: 'h-full bg-neutral-50' },
});
</script>

<template>
    <NuxtLoadingIndicator :throttle="100" :height="4" :color="appConfig.theme.loading" />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>

    <UNotifications />
</template>
