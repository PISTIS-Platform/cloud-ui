<script setup lang="ts">
import type { User } from '~/interfaces/ape/user';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const {
    data: usersData,
    pending,
    error,
    refresh,
} = await useLazyFetch<User[]>('/api/ape/users');

const columns = [
    { key: 'name', label: t('ape.users.name'), sortable: true },
    { key: 'email', label: t('ape.users.email'), sortable: true },
    { key: 'groupName', label: t('ape.users.group'), sortable: true },
    { key: 'status', label: t('ape.users.status'), sortable: true },
    { key: 'type', label: t('ape.users.type'), sortable: true },
    { key: 'actions', label: '', sortable: false, class: 'w-16 text-center' },
];

const tableData = computed(() => {
    if (!usersData.value) return [];
    return usersData.value.map((user) => ({
        ...user,
        name: `${user.firstName} ${user.lastName}`,
    }));
});

const { page, filteredRows, paginatedRows, searchString, sortBy, pageCount } = useTable(
    tableData,
    5,
    { column: 'name', direction: 'asc' },
);

const deleteModalOpen = ref(false);
const userToDelete = ref<User | null>(null);

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        active: 'text-green-500',
        inactive: 'text-gray-500',
        pending: 'text-yellow-500',
    };
    return colors[status] || 'text-gray-500';
};

const actions = (row: User) => [
    [
        {
            label: t('edit'),
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => navigateTo(`/ape/users/${row.id}`),
        },
    ],
    [
        {
            label: t('delete'),
            icon: 'i-heroicons-trash-20-solid',
            class: 'text-red-400',
            click: () => {
                userToDelete.value = row;
                deleteModalOpen.value = true;
            },
        },
    ],
];

const deleteUser = async () => {
    if (!userToDelete.value) return;

    deleteModalOpen.value = false;

    try {
        await $fetch(`/api/ape/users/${userToDelete.value.id}`, {
            method: 'DELETE',
        });
        showSuccessMessage(t('ape.users.deleteSuccess'));
        await refresh();
    } catch {
        showErrorMessage(t('ape.users.deleteError'));
    } finally {
        userToDelete.value = null;
    }
};
</script>

<template>
    <div class="w-full h-full text-gray-700">
        <ErrorCard v-if="error" :error-msg="error.data?.message ?? t('ape.users.fetchError')" />
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
                    to="/ape/users/add"
                    :label="t('ape.users.addNew')"
                />
            </div>

            <UTable
                v-model:sort="sortBy"
                :columns="columns"
                :rows="paginatedRows"
                sort-mode="manual"
                :loading="pending"
            >
                <template #status-data="{ row }">
                    <span :class="getStatusColor(row.status)">
                        {{ t(`ape.users.statuses.${row.status}`) }}
                    </span>
                </template>
                <template #type-data="{ row }">
                    {{ t(`ape.users.types.${row.type}`) }}
                </template>
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
                <p class="text-gray-500 mt-2">{{ t('ape.users.deleteConfirmation') }}</p>
                <p v-if="userToDelete" class="mt-2 font-medium">
                    {{ userToDelete.firstName }} {{ userToDelete.lastName }}
                </p>
                <div class="flex gap-4 mt-6">
                    <UButton color="white" @click="deleteModalOpen = false">
                        {{ $t('cancel') }}
                    </UButton>
                    <UButton color="red" @click="deleteUser">
                        {{ $t('delete') }}
                    </UButton>
                </div>
            </UCard>
        </UModal>
    </div>
</template>
