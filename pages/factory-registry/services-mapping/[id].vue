<script lang="ts" setup>
import { useRoute } from 'nuxt/app';
import { z } from 'zod';

import type { RegisteredService } from '~/interfaces/services-registry';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const route = useRoute();

const {
    data: registeredService,
    pending: pendingFetch,
    error,
} = await useLazyFetch<RegisteredService>(`/api/factories-registry/services-mapping/${route.params.id}`);

watch(error, () => {
    if (error.value) {
        showErrorMessage(t('registry.servicesRegistry.errorInFindingServiceMapping'));
    }
});

const schema = z.object({
    component: z
        .string()
        .trim()
        .min(1, { message: t('required') }),
    serviceName: z
        .string()
        .trim()
        .min(1, { message: t('required') }),
});

const navigateToMainPage = async () => {
    await navigateTo({
        path: '/factory-registry/services-mapping',
    });
};

const pendingEdit = ref(false);
const isFormValid = computed(() => {
    return schema.safeParse(registeredService.value).success;
});

const submitForm = async () => {
    if (!isFormValid.value || !registeredService.value) return;

    pendingEdit.value = true;

    try {
        await $fetch(`/api/factories-registry/services-mapping/${registeredService.value.id}`, {
            method: 'PATCH',
            body: {
                component: registeredService.value.component,
                serviceName: registeredService.value.serviceName,
                isOn: registeredService.value.isOn,
            },
        });

        showSuccessMessage(t('registry.servicesRegistry.updated'));

        await navigateTo({
            path: '/factory-registry/services-mapping/',
        });
    } catch (error) {
        showErrorMessage(t('registry.servicesRegistry.errorInUpdate'));
    } finally {
        pendingEdit.value = false;
    }
};
</script>

<template>
    <div class="w-full h-full space-y-6">
        <SubHeading :title="$t('registry.servicesRegistry.updateService')" />

        <div v-if="pendingFetch && !error" class="w-full mt-6">
            <UProgress animation="carousel" />
        </div>
        <div v-else-if="!pendingFetch && error">
            <UButton
                size="lg"
                color="gray"
                variant="solid"
                :label="$t('goBack')"
                class="mt-6"
                :trailing="false"
                @click="navigateToMainPage"
            />
        </div>
        <UCard v-if="registeredService && !pendingFetch" class="w-full mt-6">
            <div>
                <UForm
                    class="flex flex-col justify-start items-start space-y-8 w-full"
                    :state="registeredService"
                    :schema="schema"
                >
                    <div class="flex flex-col justify-start items-start space-y-4 w-full">
                        <UFormGroup
                            :label="$t('registry.servicesRegistry.component')"
                            required
                            name="component"
                            class="w-full"
                        >
                            <UInput
                                v-model="registeredService.component"
                                :placeholder="$t('registry.servicesRegistry.component')"
                            />
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('registry.servicesRegistry.serviceName')"
                            required
                            name="serviceName"
                            class="w-full"
                        >
                            <UInput
                                v-model="registeredService.serviceName"
                                :placeholder="$t('registry.servicesRegistry.serviceName')"
                            />
                        </UFormGroup>
                    </div>
                    <div class="flex gap-4 justify-between items-center mt-8">
                        <div class="flex gap-4">
                            <UTooltip :text="$t('cancel')">
                                <UButton
                                    size="lg"
                                    color="gray"
                                    variant="solid"
                                    :label="$t('cancel')"
                                    :trailing="false"
                                    @click="navigateToMainPage"
                                />
                            </UTooltip>
                        </div>

                        <UTooltip :text="$t('save')">
                            <UButton
                                size="lg"
                                :label="$t('save')"
                                color="primary"
                                variant="solid"
                                type="submit"
                                :disabled="pendingEdit"
                                @click="submitForm"
                            />
                        </UTooltip>
                    </div>
                </UForm>
            </div>
        </UCard>
    </div>
</template>
