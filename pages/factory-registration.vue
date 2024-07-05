<script setup lang="ts">
const { t } = useI18n();
import { z } from 'zod';

const { showSuccessMessage, showErrorMessage } = useAlertMessage();
import type FactoryModelRepo from '~/interfaces/factories-model';

const R = useRamda();

const schemaState = reactive({
    publicIP: '',
});

const schema = z.object({
    publicIP: z
        .string()
        .min(1, t('required'))
        .ip({ version: 'v4', message: t('registry.registration.invalidIP') }),
});

const downloadingInstructions = ref(false);
const downloadingConfigurations = ref(false);
const submittingIP = ref(false);

const { data: userFactory, error: userFactoryError } = await useFetch<FactoryModelRepo>(
    `/api/factories-registry/user-factory`,
);

if (userFactory.value) {
    schemaState.publicIP = userFactory.value.ip ?? '';
}

const downloadInstructions = async () => {
    downloadingInstructions.value = true;

    try {
        await useDownloadFile(`/api/factories-registry/download-instructions`, 'test.txt');
    } catch (error) {
        showErrorMessage(t('registry.registration.errorInDownloadingInstructions'));
    } finally {
        downloadingInstructions.value = false;
    }
};

const downloadConfigurations = async () => {
    downloadingConfigurations.value = true;

    try {
        await useDownloadFile(`/api/factories-registry/download-keycloak-clients`, 'keycloak-clients.json');
    } catch (error) {
        showErrorMessage(t('registry.registration.errorInDownloadingConfigurations'));
    } finally {
        downloadingConfigurations.value = false;
    }
};

const submitIP = async () => {
    if (!schema.safeParse(schemaState).success) {
        return;
    }
    submittingIP.value = true;

    try {
        await $fetch(`api/factories-registry/setip`, {
            method: 'PUT',
            body: { ip: schemaState.publicIP },
        });

        showSuccessMessage(t('registry.IPUpdated'));
    } catch (error) {
        showErrorMessage(t('registry.IPSubmitError'));
    } finally {
        submittingIP.value = false;
    }
};
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <ErrorCard v-if="userFactoryError" :error-msg="t('registry.registration.noFactoryFound')" />
            <UCard v-else :ui="{ base: 'w-full text-gray-700' }">
                <template #header>
                    <SubHeading
                        :title="`${t('registry.registration.title')} ${userFactory?.organizationName ? ' - ' : ''} ${userFactory?.organizationName ?? ''}`"
                    />
                </template>
                <div class="w-full flex flex-col gap-4">
                    <p class="text-gray-500">{{ t('registry.registration.welcome') }}</p>
                    <div class="flex w-full justify-between items-center flex-wrap xl:flex-nowrap">
                        <span class="flex gap-4 whitespace-nowrap">
                            <span class="text-lg font-bold">1.</span>
                            <span>{{ t('registry.registration.downloadInstructions') }}</span>
                        </span>
                        <UTooltip
                            :text="t('registry.registration.downloadInstructions')"
                            :ui="{ width: 'max-w-2xl text-center' }"
                        >
                            <UButton
                                class="w-28 flex justify-center disabled:opacity-40"
                                size="lg"
                                :disabled="downloadingInstructions"
                                @click="downloadInstructions"
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
                                        :ui="{ base: 'disabled:bg-gray-100' }"
                                        class="w-full"
                                        size="lg"
                                        :placeholder="t('registry.registration.enterIP')"
                                        :disabled="!R.isNil(userFactory?.ip) && !R.isEmpty(userFactory?.ip)"
                                    />
                                </UFormGroup>
                                <UButton
                                    :key="schemaState.publicIP"
                                    class="w-28 flex justify-center"
                                    size="lg"
                                    type="submit"
                                    :disabled="
                                        (!R.isNil(userFactory?.ip) && !R.isEmpty(userFactory?.ip)) || submittingIP
                                    "
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
