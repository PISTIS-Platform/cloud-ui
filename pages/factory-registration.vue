<script setup lang="ts">
const { t } = useI18n();
import { z } from 'zod';

const { showErrorMessage } = useAlertMessage();

const schemaState = ref({
    publicIP: '',
});

const schema = z.object({
    publicIP: z
        .string()
        .min(1, t('required'))
        .ip({ version: 'v4', message: t('registry.registration.invalidIP') }),
});

const downloadingScripts = ref(false);
const downloadingConfigurations = ref(false);
const submittingIP = ref(false);

const downloadScripts = async () => {
    downloadingScripts.value = true;

    try {
        await useDownloadFile(`/api/factories-registry/download-scripts`, 'test.txt');
    } catch (error) {
        showErrorMessage(t('registry.registration.errorInDownloadScripts'));
    } finally {
        downloadingScripts.value = false;
    }
};

const downloadConfigurations = async () => {
    downloadingConfigurations.value = true;

    try {
        await useDownloadFile(`/api/factories-registry/download-configurations`, 'keycloak-clients.json');
    } catch (error) {
        showErrorMessage(t('registry.registration.errorInDownloadingConfigurations'));
    } finally {
        downloadingConfigurations.value = false;
    }
};

const submitIP = async () => {
    submittingIP.value = true;

    console.log('submitting state');
    //TODO:: api call to backend
};
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
                            <UButton
                                class="w-28 flex justify-center disabled:opacity-40"
                                size="lg"
                                :disabled="downloadingScripts"
                                @click="downloadScripts"
                                >{{ t('download') }}</UButton
                            >
                        </UTooltip>
                    </div>

                    <div class="flex w-full justify-between items-center flex-wrap xl:flex-nowrap">
                        <span class="flex gap-4 whitespace-nowrap">
                            <span class="text-lg font-bold">2.</span>
                            <span>{{ t('registry.registration.downloadConfig') }}</span>
                        </span>
                        <UTooltip
                            :text="t('registry.registration.downloadConfig')"
                            :ui="{ width: 'max-w-2xl text-center' }"
                        >
                            <UButton
                                class="w-28 flex justify-center disabled:opacity-40"
                                size="lg"
                                :disabled="downloadingConfigurations"
                                @click="downloadConfigurations"
                                >{{ t('download') }}</UButton
                            >
                        </UTooltip>
                    </div>

                    <div class="flex w-full justify-between items-center gap-4 xl:gap-16 flex-wrap md:flex-nowrap">
                        <span class="flex gap-4 whitespace-nowrap">
                            <span class="text-lg font-bold">3.</span>
                            <span>{{ t('registry.registration.defineIP') }}</span>
                        </span>
                        <UForm
                            :schema="schema"
                            :state="schemaState"
                            class="space-y-5 w-full flex items-end justify-end"
                            @submit="submitIP"
                        >
                            <div class="flex items-start gap-4 w-4/5">
                                <UFormGroup class="w-full" required name="publicIP">
                                    <UInput
                                        v-model="schemaState.publicIP"
                                        class="w-full"
                                        size="lg"
                                        :placeholder="t('registry.registration.enterIP')"
                                    />
                                </UFormGroup>
                                <UButton
                                    class="w-28 flex justify-center"
                                    size="lg"
                                    type="submit"
                                    :disabled="!schemaState.publicIP || schemaState.publicIP === ''"
                                    @click="submitIP"
                                    >{{ t('submit') }}</UButton
                                >
                            </div>
                        </UForm>
                    </div>
                </div>
            </UCard>
        </PageContainer>
    </div>
</template>
