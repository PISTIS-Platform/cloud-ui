<script lang="ts" setup>
import type TableColumn from '~/interfaces/table-column';
import type { Transaction } from '~/interfaces/wallet-table';

const { t } = useI18n();

const { data /*error, refresh*/ } = await useLazyFetch<Transaction[]>('/api/wallet');

const { page, pageCount, filteredRows, paginatedRows, sortBy } = useTable<Transaction>(data, 10, {
    column: 'transactionDate',
    direction: 'desc',
});

const columns: TableColumn[] = [
    {
        key: 'amount',
        label: t('wallet.amount'),
        sortable: true,
    },
    {
        key: 'transactionDate',
        label: t('wallet.date'),
        sortable: true,
        class: 'text-center w-3/5',
    },
    {
        key: 'transactionId',
        label: t('wallet.transaction'),
        class: 'w-4/5',
    },
    { key: 'actions', label: '', sortable: false, class: 'w-1/12 text-center' },
];
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <div class="flex flex-col w-full">
                <div class="w-full place-items-stretch pb-4">
                    <UCard :ui="{ body: { base: '', padding: 'p-4 sm:p-4' } }">
                        <div class="relative flex items-center">
                            <div class="flex-shrink-0 mr-4">
                                <UIcon
                                    name="i-heroicons-currency-dollar-20-solid"
                                    class="w-10 h-10 text-secondary-300"
                                />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex justify-start items-center w-full space-x-2">
                                    <h3 class="text-base xl:text-lg font-normal">
                                        {{ t('wallet.balance') }}
                                    </h3>
                                </div>
                                <!-- TODO: need to change the values below when we have the endpoints from wallet -->
                                <div :class="['text-lg font-bold', 1 > 0 ? 'text-green-800' : 'text-red-800']">
                                    {{ '3500' }} {{ 'STC' }}
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>
                <div class="w-full place-items-stretch">
                    <UCard>
                        <UTable
                            v-model:sort="sortBy"
                            :columns="columns"
                            :rows="paginatedRows"
                            sort-mode="manual"
                            :empty-state="{
                                icon: 'i-heroicons-circle-stack-20-solid',
                                label: $t('wallet.noTransactions'),
                            }"
                        >
                            <template #transactionDate-data="{ row }">
                                <span v-if="row.transactionDate">{{ $d(new Date(row.transactionDate), 'short') }}</span>
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
                </div>
            </div>
        </PageContainer>
    </div>
</template>
