<script lang="ts" setup>
import { useAlertMessage } from '~/composables/alert';
import { useHttpHelper } from '~/composables/httpHelper';
import type FactoryModelRepo from '~/interfaces/factories-model';

const { isSuccessResponse } = useHttpHelper();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const { t } = useI18n();

const { data, pending, error } = await useFetch(`/api/factories-registry/factories`);
const switchModalOpen = ref<boolean>(false);
let selectedRow: FactoryModelRepo;

const statuses = computed(() => ({
    pending: t('registry.statuses.pending'),
    online: t('registry.statuses.online'),
    offline: t('registry.statuses.offline'),
    suspended: t('registry.statuses.suspended'),
}));

const statusesForDropdown = computed(() =>
    Object.keys(statuses.value).map((key: string) => ({
        label: statuses.value[key as keyof typeof statuses.value],
        value: key,
    })),
);

const updateStatus = (value: { id: string; status: string }) => {
    const foundObj = rows.value.find((item: any) => item.id === value.id);
    //TODO: Check if this can be done and if it is successful via API, if not show toast and don't change the status
    if (foundObj) foundObj.status = value.status;
};

const getStatusColorClass = (status: string) => {
    return {
        'text-green-500': status === 'online',
        'text-gray-500': status === 'offline',
        'text-yellow-500': status === 'pending',
        'text-red-500': status === 'suspended',
    };
};

const columns = [
    {
        key: 'organizationName',
        label: t('registry.name'),
        sortable: true,
    },
    {
        key: 'ip',
        label: t('registry.ip'),
        sortable: true,
    },
    {
        key: 'country',
        label: t('registry.country'),
        sortable: true,
    },
    {
        key: 'actions',
        label: `${t('registry.status')}`,
        class: 'text-center',
    },
];

const { page, filteredRows, paginatedRows, sortBy, pageCount, rows } = useTable<FactoryModelRepo>(data, 5, {
    column: 'organizationName',
    direction: 'asc',
});

const select = (row: any) => {
    if (row.status !== 'pending') {
        return;
    } else {
        selectedRow = row;
        return (switchModalOpen.value = true);
    }
};

const acceptFactory = async (data: string) => {
    const body = { acceptance: data };

    try {
        const response = await $fetch(`/api/factories-registry/${selectedRow.id}`, {
            method: 'patch',
            body,
        });

        if (isSuccessResponse(response.status)) {
            if (data === 'accept') {
                showSuccessMessage(t('registry.factoryAccepted'));
            } else {
                showSuccessMessage(t('registry.factoryDenied'));
            }
        } else {
            showErrorMessage(t('registry.factoryError'));
        }
        switchModalOpen.value = !switchModalOpen;
    } catch (err) {
        switchModalOpen.value = !switchModalOpen;
        showErrorMessage(t('registry.factoryError'));
    }
};

const _toggleActive = async (row: any) => {
    if (row.isActive === true) {
        row.status = 'deactivated';
        row.isActive = false;
    } else {
        row.isActive = true;
        row.status = 'live';
    }

    try {
        const response = await $fetch(`/api/factories-registry/${row.id}/`, {
            method: 'put',
            body: row,
        });

        if (isSuccessResponse(response.status)) {
            if ((row.status = 'live')) {
                showSuccessMessage(t('registry.activate'));
            } else {
                showSuccessMessage(t('registry.Deactivate'));
            }
        } else {
            showErrorMessage(t('registry.factoryActivationError'));
        }
    } catch (err) {
        showErrorMessage(t('registry.factoryActivationError'));
    }

    return row;
};
</script>

<template>
    <div class="w-full h-full text-gray-700">
        <ErrorCard v-if="error" :error-msg="error.data?.data?.message ?? t('registry.errorInRetrievingFactories')" />
        <UCard v-else class="w-full">
            <template #header>
                <div class="flex items-center justify-between w-full">
                    <SubHeading :title="$t('registry.title')" />
                    <UButton to="factory-creation">{{ t('registry.createFactory') }}</UButton>
                </div>
            </template>

            <UTable
                v-model:sort="sortBy"
                :columns="columns"
                :rows="paginatedRows"
                sort-mode="manual"
                :loading="pending"
                class="overflow-visible"
                @select="select"
            >
                <!-- Custom styling for ip data column -->
                <template #ip-data="{ row }">
                    <span class="flex items-center">
                        <UIcon name="i-heroicons-light-bulb-solid" :class="[getStatusColorClass(row.status), 'mr-2']" />
                        {{ row.ip }}
                    </span>
                </template>
                <template #actions-data="{ row }">
                    <div class="justify-center flex">
                        <USelectMenu
                            :model-value="row.status"
                            :placeholder="t('registry.status')"
                            :options="statusesForDropdown"
                            value-attribute="value"
                            option-attribute="label"
                            class="w-28"
                            @update:model-value="(value: string) => updateStatus({ id: row.id, status: value })"
                        />
                    </div>
                </template>
            </UTable>

            <!-- Display the pagination only if the total number of transactions is larger than the page count -->
            <div v-if="filteredRows?.length > pageCount" class="flex justify-end mt-2">
                <UPagination v-model="page" :page-count="pageCount" :total="filteredRows.length" />
            </div>
        </UCard>
        <UModal v-model="switchModalOpen">
            <UCard class="flex flex-col justify-center items-center text-center text-gray-700 h-40">
                <p class="font-bold text-xl">{{ $t('registry.factoryModal') }}</p>
                {{ selectedRow.ip }} - {{ selectedRow.organizationName }}
                <div class="flex gap-8 w-full justify-center mt-6">
                    <UButton color="white" class="w-20 flex justify-center" @click="acceptFactory('accept')">{{
                        $t('registry.accept')
                    }}</UButton>
                    <UButton class="w-20 flex justify-center" @click="acceptFactory('deny')">{{
                        $t('registry.deny')
                    }}</UButton>
                </div>
            </UCard>
        </UModal>
    </div>
</template>
