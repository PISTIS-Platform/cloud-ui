<script lang="ts" setup>
import type TableColumn from '~/interfaces/table-column';
import type { Questionnaire } from '~/interfaces/usage-analytics';

const { t } = useI18n();

const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const {
    data,
    pending: loadingQuestionnaireVersions,
    error,
    refresh,
} = await useLazyFetch<Questionnaire[]>('/api/questionnaire');

// import info from table composable
const { page, pageCount, filteredRows, paginatedRows, searchString, sortBy } = useTable<Questionnaire>(data, 10, {
    column: 'isForVerifiedBuyers',
    direction: 'desc',
});

const columns: TableColumn[] = [
    {
        key: 'title',
        label: t('usage-analytics.title'),
        sortable: true,
    },
    {
        key: 'version',
        label: t('usage-analytics.version'),
        sortable: true,
        class: 'text-center w-3/5',
    },
    {
        key: 'publicationDate',
        label: t('usage-analytics.publicationDate'),
        class: 'w-4/5',
    },
    { key: 'actions', label: '', sortable: false, class: 'w-1/12 text-center' },
];

const toggleIsActive = async (questionnaire: Questionnaire, value: boolean) => {
    const subUrl = value ? 'activate-version' : 'deactivate-version';

    loadingQuestionnaireVersions.value = true;
    data.value = null;

    try {
        await $fetch(`/api/questionnaire/${subUrl}`, {
            body: {
                id: questionnaire.id,
                version: questionnaire.version,
            },
            method: 'patch',
        });

        showSuccessMessage(value ? t('usage-analytics.activated') : t('usage-analytics.deactivated'));
    } catch {
        showErrorMessage(value ? t('usage-analytics.errorInActivation') : t('usage-analytics.errorInDeactivation'));
    } finally {
        await refresh();
    }
};

const navigateToCreateEdit = async (row?: Questionnaire) => {
    await navigateTo({
        path: '/usage-analytics/add-version',
        query: {
            version: row?.version || null,
            id: row?.id || null,
        },
    });
};

const deleteVersion = async () => {
    if (!versionForDeletion.value) {
        return;
    }

    loadingQuestionnaireVersions.value = true;
    data.value = null;
    deleteConfirmationOpen.value = false;

    try {
        await $fetch(`/api/questionnaire`, {
            method: 'delete',
            body: {
                id: versionForDeletion.value.id,
                version: versionForDeletion.value.version,
            },
        });

        showSuccessMessage(t('usage-analytics.deleted'));
    } catch (error: any) {
        if (error?.status === 400) {
            showErrorMessage(error?.data?.data?.message || t('usage-analytics.cannotDelete'));
            return;
        }
        showErrorMessage(t('usage-analytics.errorInDeletion'));
    } finally {
        versionForDeletion.value = null;
        await refresh();
    }
};

const deleteConfirmationOpen = ref<boolean>(false);
const versionForDeletion = ref<Questionnaire | null>(null);

const actions = (row: Questionnaire) => [
    [
        {
            label: t('usage-analytics.createNewVersionFromExisting'),
            icon: 'i-heroicons-document-duplicate',
            click: () => navigateToCreateEdit(row),
        },
        {
            label: !row.isActive ? t('usage-analytics.activate') : t('usage-analytics.deactivate'),
            icon: !row.isActive ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle',
            click: () => toggleIsActive(row, !row.isActive),
        },
        {
            label: t('delete'),
            color: 'text-red-400',
            icon: 'i-heroicons-trash-20-solid',
            class: 'text-red-400',
            click: () => {
                deleteConfirmationOpen.value = true;
                versionForDeletion.value = row;
            },
        },
    ],
];
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <SubHeading :title="$t('usage-analytics.questionnaires')" />

            <div class="w-full mt-8">
                <UCard v-if="!error">
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
                                    @click="navigateToCreateEdit()"
                                />
                            </div>
                        </div>
                    </template>

                    <UTable
                        v-model:sort="sortBy"
                        :columns="columns"
                        :rows="paginatedRows"
                        sort-mode="manual"
                        :loading="loadingQuestionnaireVersions"
                        :empty-state="{
                            icon: 'i-heroicons-circle-stack-20-solid',
                            label: $t('usage-analytics.noVersionsExist'),
                        }"
                    >
                        <template #title-data="{ row }">
                            <div class="flex flex-col space-y-2">
                                <span class="text-gray-500">{{ row.title }}</span>
                                <div
                                    v-if="row.isForVerifiedBuyers || row.isActive"
                                    class="flex flex-row justify-start gap-4"
                                >
                                    <UBadge v-if="row.isForVerifiedBuyers" color="primary" variant="subtle">{{
                                        $t('usage-analytics.forVerifiedBuyers')
                                    }}</UBadge>
                                    <UBadge v-if="row.isActive" color="green" variant="subtle">{{
                                        $t('usage-analytics.isActive')
                                    }}</UBadge>
                                </div>
                            </div>
                        </template>

                        <template #actions-data="{ row }">
                            <UDropdown :items="actions(row)" :ui="{ width: 'w-72' }">
                                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
                            </UDropdown>
                        </template>

                        <template #version-data="{ row }">
                            <div class="flex justify-center text-center">
                                {{ row.version }}
                            </div>
                        </template>

                        <template #publicationDate-data="{ row }">
                            <span v-if="row.publicationDate">{{ $d(new Date(row.publicationDate), 'short') }}</span>
                            <span v-else>&mdash;</span>
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
                <UModal v-model="deleteConfirmationOpen">
                    <UCard class="flex flex-col justify-center items-center text-center text-gray-700 h-40">
                        <p class="font-bold text-xl">{{ $t('areYouSure') }}</p>
                        <p class="text-gray-400 mt-6">{{ $t('usage-analytics.deleteVersionInfo') }}</p>
                        <div class="flex gap-8 w-full justify-center mt-6">
                            <UButton
                                color="white"
                                class="w-20 flex justify-center"
                                @click="(deleteConfirmationOpen = false), (versionForDeletion = null)"
                                >{{ $t('cancel') }}</UButton
                            >
                            <UButton class="w-20 flex justify-center" @click="deleteVersion()">{{ $t('yes') }}</UButton>
                        </div>
                    </UCard>
                </UModal>

                <ErrorCard
                    v-if="error && !loadingQuestionnaireVersions"
                    :error-msg="error.data?.data?.message ?? $t('usage-analytics.errorWhileRetrieving')"
                />
            </div>
        </PageContainer>
    </div>
</template>
