<script setup lang="ts">
import type DataModelRepo from '~/interfaces/data-model-repo';
import type ModelsTableRow from '~/interfaces/models-table-row';
import type TableColumn from '~/interfaces/table-column';

const R = useRamda();

const { t } = useI18n();

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
const { data: modelsData, pending: modelsLoading } = await useLazyFetch<ModelsTableRow[]>('/api/models/models-table');

const tableSort = ref<{ column: string; direction: 'asc' | 'desc' }>({
    column: 'date',
    direction: 'desc',
});

//sort assets first before filtering and paginating
const computedSorted = computed(() => {
    if (!modelsData.value) return [];
    if (tableSort.value.direction === 'asc') {
        return R.sort(R.ascend(R.prop(tableSort.value.column)), modelsData.value);
    }

    return R.sort(R.descend(R.prop(tableSort.value.column)), modelsData.value);
});

//ref for query in table search
const q = ref('');

//table pagination and filtering
const page = ref(1);
const pageCount: number = 5;

const filteredRows = computed(() => {
    if (!q.value) {
        return computedSorted.value;
    }
    return computedSorted.value.filter((asset) => {
        return Object.values(asset).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase());
        });
    });
});

const paginatedRows = computed(() => {
    return filteredRows.value.slice((page.value - 1) * pageCount, page.value * pageCount);
});

const actions = (row: DataModelRepo[]) => [
    [
        {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => editRepo(row),
        },
        {
            label: 'Download',
            icon: 'i-heroicons-arrow-down-tray-20-solid',
            click: () => downloadRepo(),
        },
    ],
    [
        {
            label: 'Delete',
            color: 'text-red-400',
            icon: 'i-heroicons-trash-20-solid',
            class: 'text-red-400',
            click: () => deleteRepo(),
        },
    ],
];

const selected = ref<DataModelRepo[]>([]);

//table functions

async function editRepo(row: DataModelRepo[]) {
    console.log(row);
    await navigateTo({
        path: `/models/${row.id}`,
    });
}

function viewRepo(row: DataModelRepo[]) {
    selected.value = row;
    console.log(selected.value);
}

function downloadRepo() {
    console.log(selected.value);
}

function deleteRepo() {
    console.log(selected.value);
}
</script>

<template>
    <div class="w-full h-full text-gray-700">
        <UCard>
            <div class="flex justify-between flex-1">
                <div class="flex flex-1">
                    <UInput v-model="q" size="md" :placeholder="$t('models.dmRepository.search')" class="w-full" />
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
                v-model:sort="tableSort"
                class="mt-8"
                :columns="columns"
                :rows="paginatedRows"
                :loading="modelsLoading"
                @select="viewRepo"
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
                    {{ $d(new Date(row.date), 'short') }}
                </template>
            </UTable>
            <div v-if="modelsData && modelsData.length > pageCount" class="flex justify-end mt-2">
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
    </div>
</template>
