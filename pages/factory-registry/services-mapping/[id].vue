<script lang="ts" setup>
import { useRoute } from 'nuxt/app';

import type { RegisteredService } from '~/interfaces/services-registry';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const route = useRoute();

const {
    data: registeredService,
    pending: pendingFetch,
    error,
} = await useLazyFetch<RegisteredService>(`/api/factories-registry/services-mapping/${route.params.id}`);

const navigateToMainPage = async () => {
    await navigateTo({
        path: '/factory-registry/services-mapping',
    });
};

const pendingEdit = ref(false);

const updateServiceMapping = async (body: RegisteredService) => {
    if (!registeredService.value) return;

    pendingEdit.value = true;

    try {
        await $fetch(`/api/factories-registry/services-mapping/${registeredService.value.id}`, {
            method: 'PATCH',
            body,
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

        <ServiceMappingForm
            v-if="registeredService && !pendingFetch"
            :registered-service="registeredService"
            :should-disable-button="pendingEdit"
            @submit-form="(body: RegisteredService) => updateServiceMapping(body)"
        />
        <ErrorCard
            v-if="error && !pendingFetch"
            :error-msg="error.data?.data?.message ?? $t('registry.servicesRegistry.errorInFindingServiceMapping')"
        >
            <UButton
                size="lg"
                color="gray"
                variant="solid"
                :label="$t('goBack')"
                class="mt-6"
                :trailing="false"
                @click="navigateToMainPage"
            />
        </ErrorCard>
    </div>
</template>
