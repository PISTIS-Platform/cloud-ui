<script setup lang="ts">
import type ModelsTableRow from '~/interfaces/models-table-row';
import type TableColumn from '~/interfaces/table-column';

const { t } = useI18n();

const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const columns: TableColumn[] = [
    {
        key: 'id',
        label: t('models.dmRepository.tableFields.id'),
        sortable: true,
        direction: 'asc',
        class: 'w-1/12',
    },
    {
        key: 'title',
        label: t('models.dmRepository.tableFields.title'),
        sortable: true,
        direction: 'asc',
        class: 'w-1/3',
    },
    {
        key: 'type',
        sortable: true,
        label: t('models.dmRepository.tableFields.type'),
        class: 'w-1/6 text-slate-600 text-center',
    },
    {
        key: 'version',
        sortable: false,
        label: t('models.dmRepository.tableFields.version'),
        class: 'w-1/6 text-slate-600 text-center',
    },
    {
        key: 'size',
        sortable: false,
        label: t('models.dmRepository.tableFields.size'),
        class: 'w-1/6 text-slate-600 text-right',
    },
    {
        key: 'date',
        label: t('models.dmRepository.tableFields.date'),
        sortable: true,
        direction: 'asc',
        class: 'w-1/6',
    },
    { key: 'actions', label: '', sortable: false, class: 'w-1/12 text-center' },
];

//data for models table
const {
    data: modelsData,
    pending: modelsLoading,
    error: modelsFetchError,
    refresh,
} = await useLazyFetch<ModelsTableRow[]>('/api/models/table');

const { page, filteredRows, paginatedRows, searchString, sortBy, pageCount } = useTable<ModelsTableRow>(modelsData, 5, {
    column: 'date',
    direction: 'desc',
});

const actions = (row: ModelsTableRow) => [
    [
        {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => editRepo(row),
        },
        {
            label: 'Download',
            icon: 'i-heroicons-arrow-down-tray-20-solid',
            click: () => downloadRepo(row),
        },
    ],
    [
        {
            label: 'Delete',
            color: 'text-red-400',
            icon: 'i-heroicons-trash-20-solid',
            class: 'text-red-400',
            click: () => {
                modelForDeletion.value = row;
                deleteConfirmationOpen.value = true;
            },
        },
    ],
];

//table functions

async function editRepo(row: ModelsTableRow) {
    await navigateTo({
        path: `/models/${row.id}`,
    });
}

async function downloadRepo(row: ModelsTableRow) {
    try {
        const response = await $fetch<Blob>(`/api/models/download`, {
            query: { id: row.id },
        });

        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');

        link.href = url;

        //if filepath is not set the browser will automatically set a name for the file
        if (row.filepath) {
            link.setAttribute('download', row.filepath);
        }
        document.body.appendChild(link);

        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        showErrorMessage(t('models.errors.download'));
    }
}

const deleteConfirmationOpen = ref(false);
const modelForDeletion = ref<ModelsTableRow | null>(null);

async function deleteRepo() {
    if (!modelForDeletion.value) return;

    deleteConfirmationOpen.value = false;
    modelsLoading.value = true;
    modelsData.value = null;

    try {
        await $fetch(`/api/models/${modelForDeletion.value.id}`, {
            method: 'DELETE',
        });
        showSuccessMessage(t('models.successDelete'));
        await refresh();
    } catch (error) {
        showErrorMessage(t('models.errors.delete'));
    } finally {
        modelForDeletion.value = null;
    }
}
</script>

<template>
    <div class="w-full h-full text-gray-700">
        <UCard v-if="!modelsFetchError">
            <div class="flex justify-between flex-1">
                <div class="flex flex-1">
                    <UInput
                        v-model="searchString"
                        size="md"
                        :placeholder="$t('models.dmRepository.search')"
                        class="w-full"
                    />
                </div>
                <div class="ml-2 flex">
                    <UButton
                        icon="i-heroicons-document-plus"
                        size="md"
                        color="primary"
                        variant="solid"
                        to="/models/upload"
                        target="_self"
                        :label="$t('addNew')"
                        :trailing="false"
                    />
                </div>
            </div>
            <UTable
                v-model:sort="sortBy"
                sort-mode="manual"
                class="mt-8"
                :columns="columns"
                :rows="paginatedRows"
                :loading="modelsLoading"
            >
                <template #version-data="{ row }">
                    <div class="text-center">
                        <span>{{ row.version }}</span>
                    </div>
                </template>
                <template #size-data="{ row }">
                    <div class="text-right">
                        <span class="font-semibold">{{ row.size }}</span>
                    </div>
                </template>
                <template #actions-data="{ row }">
                    <UDropdown :items="actions(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
                    </UDropdown>
                </template>
                <template #date-data="{ row }">
                    {{ $d(new Date(row.updatedAt), 'short') }}
                </template>
            </UTable>
            <div v-if="filteredRows?.length > pageCount" class="flex justify-end mt-2">
                <div class="mt-2">
                    <UPagination
                        v-model="page"
                        :page-count="pageCount"
                        :total="filteredRows.length"
                        :active-button="{ variant: 'outline' }"
                    />
                </div>
            </div>
        </UCard>
        <UModal v-model="deleteConfirmationOpen">
            <UCard class="flex flex-col justify-center items-center text-center text-gray-700 h-40">
                <p class="font-bold text-xl">{{ $t('areYouSure') }}</p>
                <p class="text-gray-400 mt-6">{{ $t('models.deleteModelDescription') }}</p>
                <div class="flex gap-8 w-full justify-center mt-6">
                    <UButton
                        color="white"
                        class="w-20 flex justify-center"
                        @click="(deleteConfirmationOpen = false), (modelForDeletion = null)"
                        >{{ $t('cancel') }}</UButton
                    >
                    <UButton class="w-20 flex justify-center" @click="deleteRepo()">{{ $t('yes') }}</UButton>
                </div>
            </UCard>
        </UModal>
        <ErrorCard
            v-if="modelsFetchError && !modelsLoading"
            :error-msg="modelsFetchError.data?.data?.message ?? $t('models.errors.retrieveList')"
        />
    </div>
</template>
