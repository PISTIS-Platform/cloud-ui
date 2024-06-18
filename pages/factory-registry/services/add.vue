<script lang="ts" setup>
import type { RegisteredService } from '~/interfaces/services-registry';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const registeredService = ref<RegisteredService>({
    id: '',
    serviceName: '',
    serviceUrl: '',
});

const pendingCreate = ref(false);

const createServiceMapping = async (body: RegisteredService) => {
    pendingCreate.value = true;

    try {
        await $fetch('/api/factories-registry/services', {
            method: 'POST',
            body,
        });

        showSuccessMessage(t('registry.servicesRegistry.saved'));

        await navigateTo({
            path: '/factory-registry/services',
        });
    } catch (error) {
        showErrorMessage(t('registry.servicesRegistry.errorInSave'));
    } finally {
        pendingCreate.value = false;
    }
};
</script>

<template>
    <div class="w-full h-full space-y-6">
        <SubHeading :title="$t('registry.servicesRegistry.createNew')" />

        <ServiceMappingForm
            :registered-service="registeredService"
            :should-disable-button="pendingCreate"
            @submit-form="(body: RegisteredService) => createServiceMapping(body)"
        />
    </div>
</template>
