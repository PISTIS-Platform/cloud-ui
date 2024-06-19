<script lang="ts" setup>
const { t } = useI18n();

import type { RegisteredService } from '~/interfaces/services-registry';
import type TableColumn from '~/interfaces/table-column';

const {
    data,
    pending: loadingRegisteredServices,
    error,
} = await useLazyFetch<RegisteredService[]>('/api/factories-registry/services');

const { page, pageCount, filteredRows, paginatedRows, searchString, sortBy } = useTable<RegisteredService>(data, 10, {
    column: 'component',
    direction: 'desc',
});

const columns: TableColumn[] = [
    {
        key: 'serviceName',
        label: t('registry.servicesRegistry.serviceName'),
        sortable: true,
    },
    {
        key: 'serviceUrl',
        label: t('registry.servicesRegistry.serviceUrl'),
        sortable: true,
    },
    { key: 'actions', label: '', sortable: false, class: 'w-1/12 text-center' },
];

const navigateToCreate = async () => {
    await navigateTo({
        path: '/factory-registry/services/add',
    });
};

const navigateToEdit = async (id: string) => {
    await navigateTo({
        path: `/factory-registry/services/${id}`,
    });
};
</script>

<template>
    <div class="w-full h-full">
        <ErrorCard
            v-if="!loadingRegisteredServices && error"
            :error-msg="error.data?.data?.message ?? t('registry.servicesRegistry.errorInRetrieval')"
        />
        <UCard v-else class="w-full">
            <template #header>
                <div class="flex justify-between flex-1">
                    <div class="flex flex-1">
                        <UInput v-model="searchString" size="md" :placeholder="$t('search')" class="w-full" />
                    </div>
                    <div class="ml-2 flex">
                        <UButton
                            icon="i-heroicons-plus-circle-20-solid"
                            size="md"
                            color="primary"
                            variant="solid"
                            :label="$t('create')"
                            @click="navigateToCreate()"
                        />
                    </div>
                </div>
            </template>

            <UTable
                v-model:sort="sortBy"
                :columns="columns"
                :rows="paginatedRows"
                sort-mode="manual"
                :loading="loadingRegisteredServices"
                :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: $t('registry.servicesRegistry.noServicesExist'),
                }"
            >
                <template #actions-data="{ row }">
                    <UTooltip :text="$t('edit')">
                        <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-heroicons-pencil-square-20-solid"
                            @click="navigateToEdit(row.id)"
                        />
                    </UTooltip>
                </template>
            </UTable>

            <!-- Display the pagination only if the total number filtered rows is larger than the page count -->
            <div v-if="filteredRows.length > pageCount" class="flex justify-end mt-2">
                <UPagination
                    v-model="page"
                    :page-count="pageCount"
                    :total="filteredRows.length"
                    :active-button="{ variant: 'outline' }"
                />
            </div>
        </UCard>
    </div>
</template>
