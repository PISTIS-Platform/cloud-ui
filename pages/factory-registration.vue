<script setup lang="ts">
const { t } = useI18n();

const publicIP = ref<string>();
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <UCard :ui="{ base: 'w-full text-gray-700' }">
                <template #header>
                    <SubHeading :title="t('registry.registration.title')" />
                </template>
                <div class="w-full flex flex-col gap-4">
                    <p class="text-gray-500">{{ t('registry.registration.welcome') }}</p>
                    <div class="flex w-full justify-between items-center flex-wrap xl:flex-nowrap">
                        <span class="flex gap-4 whitespace-nowrap">
                            <span class="text-lg font-bold">1.</span>
                            <span>{{ t('registry.registration.downloadScripts') }}</span>
                        </span>
                        <UTooltip :text="t('registry.registration.downloadScripts')">
                            <UButton class="w-28 flex justify-center" size="lg">{{ t('download') }}</UButton>
                        </UTooltip>
                    </div>

                    <div class="flex w-full justify-between items-center flex-wrap xl:flex-nowrap">
                        <span class="flex gap-4 whitespace-nowrap">
                            <span class="text-lg font-bold">2.</span>
                            <span>{{ t('registry.registration.downloadConfig') }}</span>
                        </span>
                        <UTooltip :text="t('registry.registration.downloadConfig')">
                            <UButton class="w-28 flex justify-center" size="lg">{{ t('download') }}</UButton>
                        </UTooltip>
                    </div>

                    <div class="flex w-full justify-between items-center gap-4 xl:gap-16 flex-wrap xl:flex-nowrap">
                        <span class="flex gap-4 whitespace-nowrap">
                            <span class="text-lg font-bold">3.</span>
                            <span>{{ t('registry.registration.defineIP') }}</span>
                        </span>
                        <div class="flex gap-4 w-full">
                            <UInput
                                v-model="publicIP"
                                class="w-full"
                                size="lg"
                                :placeholder="t('registry.registration.enterIP')"
                            />
                            <UButton class="w-28 flex justify-center" size="lg" :disabled="!publicIP">{{
                                t('submit')
                            }}</UButton>
                        </div>
                    </div>
                </div>
            </UCard>
        </PageContainer>
    </div>
</template>
