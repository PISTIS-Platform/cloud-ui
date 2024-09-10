<script lang="ts" setup>
import type FactoryModelRepo from '~/interfaces/factories-model';

const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const { t } = useI18n();

const { data, pending, error, refresh } = await useFetch(`/api/factories-registry/factories`);
const switchModalOpen = ref<boolean>(false);
const action = ref<string>();
let selectedRow: FactoryModelRepo;

const statuses = computed(() => ({
    pending: t('registry.statuses.pending'),
    online: t('registry.statuses.online'),
    offline: t('registry.statuses.offline'),
    suspended: t('registry.statuses.suspended'),
}));

const activate = async (id: string | number) => {
    switchModalOpen.value = false;
    try {
        await $fetch(`/api/factories-registry/${id}/activate`, {
            method: 'patch',
        });
        showSuccessMessage(t('registry.factoryActivated'));
        refresh();
    } catch {
        showErrorMessage(t('registry.factoryActivationError'));
    }
};

const suspend = async (id: string | number) => {
    switchModalOpen.value = false;
    try {
        await $fetch(`/api/factories-registry/${id}/suspend`, {
            method: 'patch',
        });
        showSuccessMessage(t('registry.factorySuspended'));
        refresh();
    } catch {
        showErrorMessage(t('registry.factoryActivationError'));
    }
};
const recreate = async (id: string | number) => {
    switchModalOpen.value = false;
    try {
        await $fetch(`/api/factories-registry/recreate/${id}`, {
            method: 'put',
        });
        showSuccessMessage(t('registry.factoryRecreateSuccess'));
        refresh();
    } catch {
        showErrorMessage(t('registry.factoryRecreateError'));
    }
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
        key: 'status',
        label: `${t('registry.status')}`,
        class: 'text-center',
    },
    {
        key: 'actions',
        label: `${t('registry.actions')}`,
        class: 'text-center',
    },
];

const { page, filteredRows, paginatedRows, sortBy, pageCount } = useTable<FactoryModelRepo>(data, 5, {
    column: 'organizationName',
    direction: 'asc',
});

const select = (row: any, actionGiven: string) => {
    action.value = actionGiven;
    selectedRow = row;
    return (switchModalOpen.value = true);
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
            >
                <!-- Custom styling for ip data column -->
                <template #ip-data="{ row }">
                    <span v-if="row.ip" class="flex items-center">
                        {{ row.ip }}
                    </span>
                    <span v-else>
                        {{ t('registry.noIp') }}
                    </span>
                </template>
                <template #status-data="{ row }">
                    <div class="flex justify-center items-center">
                        <div class="flex items-center justify-start gap-1 w-52">
                            <UIcon
                                name="i-heroicons-light-bulb-solid"
                                :class="[getStatusColorClass(row.status), 'mr-1 h-5 w-5']"
                            />
                            <span class="w-[90px]">{{ statuses[row.status] }}</span>
                            <UTooltip
                                v-if="(row.status === 'pending' || row.status === 'suspended') && !row.ip"
                                :text="t('registry.noIpProvided')"
                                :ui="{ width: 'max-w-2xl text-center' }"
                            >
                                <UButton
                                    variant="outline"
                                    :disabled="!row.ip"
                                    class="disabled:opacity-40"
                                    @click="select(row, 'activate')"
                                    >{{ t('registry.activate') }}</UButton
                                >
                            </UTooltip>
                            <UButton
                                v-else-if="row.status === 'pending' || row.status === 'suspended'"
                                variant="outline"
                                :disabled="!row.ip"
                                @click="select(row, 'activate')"
                                >{{ t('registry.activate') }}</UButton
                            >
                            <UButton
                                v-else-if="row.status !== 'suspended'"
                                color="red"
                                variant="outline"
                                @click="select(row, 'suspend')"
                                >{{ t('registry.suspend') }}
                            </UButton>
                        </div>
                    </div>
                </template>
                <template #actions-data="{ row }">
                    <div class="flex justify-center items-center">
                        <div class="flex-col justify-end">
                            <UButton variant="outline" @click="select(row, 'recreate')"
                                >{{ t('registry.recreate') }}
                            </UButton>
                        </div>
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
                <p class="font-bold text-xl">{{ $t('areYouSure') }}</p>
                <span>{{
                    action === 'activate'
                        ? t('registry.areYouSureActivate')
                        : action === 'suspend'
                          ? t('registry.areYouSureSuspend')
                          : t('registry.areYouSureRecreate')
                }}</span>
                <br />
                <span>{{ t('registry.organizationName') + ': ' + selectedRow.organizationName }}</span>
                <div class="flex gap-8 w-full justify-center mt-6">
                    <UButton color="white" class="w-20 flex justify-center" @click="switchModalOpen = false">{{
                        $t('no')
                    }}</UButton>
                    <UButton
                        class="w-20 flex justify-center"
                        @click="
                            action === 'activate'
                                ? activate(selectedRow.id)
                                : action === 'suspend'
                                  ? suspend(selectedRow.id)
                                  : recreate(selectedRow.organizationId)
                        "
                        >{{ $t('yes') }}</UButton
                    >
                </div>
            </UCard>
        </UModal>
    </div>
</template>
