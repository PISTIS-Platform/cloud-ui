<script setup lang="ts">
import type { Group, GroupTableRow } from '~/interfaces/ape/group';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const {
    data: groupsData,
    pending,
    error,
    refresh,
} = await useLazyFetch<Group[]>('/api/ape/groups');

const tableData = computed<GroupTableRow[]>(() => {
    if (!groupsData.value) return [];
    return groupsData.value.map((group) => ({
        ...group,
        country: group.attributes?.country || '',
        domain: group.attributes?.domain || '',
        size: group.attributes?.size || '',
        type: group.attributes?.type || '',
    }));
});

const columns = [
    { key: 'name', label: t('ape.organizations.name'), sortable: true },
    { key: 'prefix', label: t('ape.organizations.prefix'), sortable: true },
    { key: 'domain', label: t('ape.organizations.domain'), sortable: true },
    { key: 'size', label: t('ape.organizations.size'), sortable: true },
    { key: 'type', label: t('ape.organizations.type'), sortable: true },
    { key: 'country', label: t('ape.organizations.country'), sortable: true },
    { key: 'actions', label: '', sortable: false, class: 'w-16 text-center' },
];

const { page, filteredRows, paginatedRows, searchString, sortBy, pageCount } = useTable<GroupTableRow>(
    tableData,
    5,
    { column: 'name', direction: 'asc' },
);

const deleteModalOpen = ref(false);
const groupToDelete = ref<GroupTableRow | null>(null);

const actions = (row: GroupTableRow) => [
    [
        {
            label: t('edit'),
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => navigateTo(`/ape/organizations/${row.id}`),
        },
    ],
    [
        {
            label: t('delete'),
            icon: 'i-heroicons-trash-20-solid',
            class: 'text-red-400',
            click: () => {
                groupToDelete.value = row;
                deleteModalOpen.value = true;
            },
        },
    ],
];

const deleteGroup = async () => {
    if (!groupToDelete.value) return;

    deleteModalOpen.value = false;

    try {
        await $fetch(`/api/ape/groups/${groupToDelete.value.id}`, {
            method: 'DELETE',
        });
        showSuccessMessage(t('ape.organizations.deleteSuccess'));
        await refresh();
    } catch {
        showErrorMessage(t('ape.organizations.deleteError'));
    } finally {
        groupToDelete.value = null;
    }
};
</script>

<template>
    <div class="w-full h-full text-gray-700">
        <ErrorCard v-if="error" :error-msg="error.data?.message ?? t('ape.organizations.fetchError')" />
        <UCard v-else>
            <div class="flex justify-between items-center mb-4">
                <div class="flex-1 max-w-md">
                    <UInput
                        v-model="searchString"
                        :placeholder="$t('search')"
                        icon="i-heroicons-magnifying-glass"
                    />
                </div>
                <UButton
                    icon="i-heroicons-plus"
                    to="/ape/organizations/add"
                    :label="t('ape.organizations.addNew')"
                />
            </div>

            <UTable
                v-model:sort="sortBy"
                :columns="columns"
                :rows="paginatedRows"
                sort-mode="manual"
                :loading="pending"
            >
                <template #actions-data="{ row }">
                    <UDropdown :items="actions(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
                    </UDropdown>
                </template>
            </UTable>

            <div v-if="filteredRows?.length > pageCount" class="flex justify-end mt-4">
                <UPagination
                    v-model="page"
                    :page-count="pageCount"
                    :total="filteredRows.length"
                />
            </div>
        </UCard>

        <UModal v-model="deleteModalOpen">
            <UCard class="flex flex-col justify-center items-center text-center text-gray-700 p-4">
                <p class="font-bold text-xl">{{ $t('areYouSure') }}</p>
                <p class="text-gray-500 mt-2">{{ t('ape.organizations.deleteConfirmation') }}</p>
                <p v-if="groupToDelete" class="mt-2 font-medium">{{ groupToDelete.name }}</p>
                <div class="flex gap-4 mt-6">
                    <UButton color="white" @click="deleteModalOpen = false">
                        {{ $t('cancel') }}
                    </UButton>
                    <UButton color="red" @click="deleteGroup">
                        {{ $t('delete') }}
                    </UButton>
                </div>
            </UCard>
        </UModal>
    </div>
</template>
