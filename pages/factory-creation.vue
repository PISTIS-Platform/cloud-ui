<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <UCard :ui="{ base: 'w-full text-gray-700' }">
                <template #header>
                    <SubHeading :title="t('registry.creation.createFactory')" />
                </template>
            </UCard>
        </PageContainer>
    </div>
</template>
