<script setup lang="ts">
const { t } = useI18n();
const { policyTypeOptions } = usePolicySchema();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

interface PolicyRow {
    id: string;
    name: string;
    type?: string;
    description?: string;
    resourceId?: string;
    resourceName?: string;
    urn?: string;
    uri?: string;
    scopes?: string[];
    ape?: boolean;
}

const showSystem = ref(false);

const {
    data: policiesData,
    pending,
    error,
    refresh,
} = await useLazyFetch<{ data: PolicyRow[]; total: number }>('/api/ape/policies', {
    query: computed(() => (showSystem.value ? { includeSystem: 'true' } : {})),
});

const policies = computed(() => policiesData.value?.data || []);

const { data: resourcesData } = await useLazyFetch<{ data: { id: string; name: string }[] }>('/api/ape/resources', {
    query: { limit: 1000 },
});

const selectedResourceId = ref('');

const resourceFilterOptions = computed(() => [
    { value: '', label: t('ape.policies.allResources') },
    ...(resourcesData.value?.data || []).map((resource) => ({ value: resource.id, label: resource.name })),
]);

const policiesFiltered = computed(() =>
    selectedResourceId.value
        ? policies.value.filter((policy) => policy.resourceId === selectedResourceId.value)
        : policies.value,
);

const typeLabel = (type?: string) => policyTypeOptions.find((option) => option.value === type)?.label || type || '';

const columns = [
    { key: 'name', label: t('ape.policies.name'), sortable: true },
    { key: 'type', label: t('ape.policies.type'), sortable: true },
    { key: 'resourceName', label: t('ape.policies.resource'), sortable: true },
    { key: 'scopes', label: t('ape.policies.scopes'), sortable: false },
    { key: 'actions', label: '', sortable: false, class: 'w-16 text-center' },
];

const { page, filteredRows, paginatedRows, searchString, sortBy, pageCount } = useTable(policiesFiltered, 5, {
    column: 'name',
    direction: 'asc',
});

const createPolicyItems = computed(() => [
    policyTypeOptions.map((option) => ({
        label: option.label,
        click: () => navigateTo(option.to),
    })),
]);

const viewModalOpen = ref(false);
const deleteModalOpen = ref(false);
const selectedPolicy = ref<PolicyRow | null>(null);

const editPolicy = (row: PolicyRow) => {
    const target = policyTypeOptions.find((option) => option.value === row.type)?.to;
    if (!target) return;
    setEditingPolicy(row);
    navigateTo(target);
};

const actions = (row: PolicyRow) => {
    const viewGroup = [
        {
            label: t('view'),
            icon: 'i-heroicons-eye-20-solid',
            click: () => {
                selectedPolicy.value = row;
                viewModalOpen.value = true;
            },
        },
    ];

    // editing only applies to APE-created policies (system permissions have no editable form)
    if (row.ape !== false) {
        viewGroup.push({
            label: t('edit'),
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => editPolicy(row),
        });
    }

    return [
        viewGroup,
        [
            {
                label: t('delete'),
                icon: 'i-heroicons-trash-20-solid',
                class: 'text-red-400',
                click: () => {
                    selectedPolicy.value = row;
                    deleteModalOpen.value = true;
                },
            },
        ],
    ];
};

const deletePolicy = async () => {
    if (!selectedPolicy.value) return;

    deleteModalOpen.value = false;

    try {
        await $fetch(`/api/ape/policies/${selectedPolicy.value.id}`, {
            method: 'DELETE',
        });
        showSuccessMessage(t('ape.policies.deleteSuccess'));
        await refresh();
    } catch {
        showErrorMessage(t('ape.policies.deleteError'));
    } finally {
        selectedPolicy.value = null;
    }
};
</script>

<template>
    <div class="w-full h-full text-gray-700">
        <ErrorCard v-if="error" :error-msg="error.data?.message ?? t('ape.policies.fetchError')" />
        <UCard v-else>
            <div class="flex justify-between items-center mb-4 gap-4">
                <div class="w-44">
                    <UInput v-model="searchString" :placeholder="$t('search')" icon="i-heroicons-magnifying-glass" />
                </div>
                <USelectMenu
                    v-model="selectedResourceId"
                    :options="resourceFilterOptions"
                    value-attribute="value"
                    option-attribute="label"
                    :placeholder="t('ape.policies.filterByResource')"
                    class="flex-1 max-w-md"
                    searchable
                />
                <UCheckbox v-model="showSystem" :label="t('ape.policies.showSystem')" />
                <UDropdown :items="createPolicyItems" :popper="{ placement: 'bottom-end' }">
                    <UButton icon="i-heroicons-plus" trailing-icon="i-heroicons-chevron-down">
                        {{ t('ape.policies.createNew') }}
                    </UButton>
                </UDropdown>
            </div>

            <UTable
                v-model:sort="sortBy"
                :columns="columns"
                :rows="paginatedRows"
                sort-mode="manual"
                :loading="pending"
            >
                <template #type-data="{ row }">
                    <UBadge :color="row.ape === false ? 'amber' : 'gray'" variant="subtle">
                        {{ row.ape === false ? `${row.type} (${t('ape.policies.systemLabel')})` : typeLabel(row.type) }}
                    </UBadge>
                </template>
                <template #scopes-data="{ row }">
                    <div class="flex flex-wrap gap-1">
                        <UBadge
                            v-for="scope in row.scopes || []"
                            :key="scope"
                            color="primary"
                            variant="subtle"
                            size="xs"
                        >
                            {{ scope }}
                        </UBadge>
                    </div>
                </template>
                <template #actions-data="{ row }">
                    <UDropdown :items="actions(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
                    </UDropdown>
                </template>
            </UTable>

            <div class="flex justify-end mt-4">
                <UPagination v-model="page" :page-count="pageCount" :total="filteredRows?.length || 0" />
            </div>
        </UCard>

        <UModal v-model="viewModalOpen">
            <UCard class="text-gray-700">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">{{ t('ape.policies.viewDetails') }}</h3>
                        <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-heroicons-x-mark-20-solid"
                            @click="viewModalOpen = false"
                        />
                    </div>
                </template>

                <div v-if="selectedPolicy" class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-gray-500">{{ t('ape.policies.name') }}</label>
                        <p>{{ selectedPolicy.name }}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">{{ t('ape.policies.type') }}</label>
                        <p>{{ typeLabel(selectedPolicy.type) }}</p>
                    </div>
                    <div v-if="selectedPolicy.description">
                        <label class="text-sm font-medium text-gray-500">{{ t('ape.policies.description') }}</label>
                        <p>{{ selectedPolicy.description }}</p>
                    </div>
                    <div v-if="selectedPolicy.resourceName">
                        <label class="text-sm font-medium text-gray-500">{{ t('ape.policies.resource') }}</label>
                        <p>{{ selectedPolicy.resourceName }}</p>
                    </div>
                    <div v-if="selectedPolicy.urn">
                        <label class="text-sm font-medium text-gray-500">{{ t('ape.policies.urn') }}</label>
                        <p class="font-mono text-sm">{{ selectedPolicy.urn }}</p>
                    </div>
                    <div v-if="selectedPolicy.uri">
                        <label class="text-sm font-medium text-gray-500">{{ t('ape.policies.uri') }}</label>
                        <a
                            :href="selectedPolicy.uri"
                            target="_blank"
                            class="font-mono text-sm text-primary-500 hover:text-primary-600 hover:underline block break-all"
                        >
                            {{ selectedPolicy.uri }}
                        </a>
                    </div>
                    <div v-if="selectedPolicy.scopes?.length">
                        <label class="text-sm font-medium text-gray-500">{{ t('ape.policies.scopes') }}</label>
                        <div class="flex flex-wrap gap-1 mt-1">
                            <UBadge
                                v-for="scope in selectedPolicy.scopes"
                                :key="scope"
                                color="primary"
                                variant="subtle"
                            >
                                {{ scope }}
                            </UBadge>
                        </div>
                    </div>
                </div>
            </UCard>
        </UModal>

        <UModal v-model="deleteModalOpen">
            <UCard class="flex flex-col justify-center items-center text-center text-gray-700 p-4">
                <p class="font-bold text-xl">{{ $t('areYouSure') }}</p>
                <p class="text-gray-500 mt-2">{{ t('ape.policies.deleteConfirmation') }}</p>
                <p v-if="selectedPolicy" class="mt-2 font-medium">{{ selectedPolicy.name }}</p>
                <div class="flex gap-4 mt-6">
                    <UButton color="white" @click="deleteModalOpen = false">
                        {{ $t('cancel') }}
                    </UButton>
                    <UButton color="red" @click="deletePolicy">
                        {{ $t('delete') }}
                    </UButton>
                </div>
            </UCard>
        </UModal>
    </div>
</template>
