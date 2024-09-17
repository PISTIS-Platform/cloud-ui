<script lang="ts" setup>
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import type TableColumn from '~/interfaces/table-column';
import type { Transaction } from '~/interfaces/wallet-table';

dayjs.extend(isSameOrBefore);

const { t } = useI18n();

//TODO: Change the operation below when we have answer from ICCS/UBI
/*const { data, error, refresh } = await useLazyFetch<Transaction[]>('/api/wallet');*/
const data = [
    {
        transactionDate: '2024-09-17T13:09:38.901Z',
        transactionId: '1',
        amount: 400,
    },
    {
        transactionDate: '2024-09-17T13:09:38.901Z',
        transactionId: '2',
        amount: 500,
    },
    {
        transactionDate: '2024-09-16T13:09:38.901Z',
        transactionId: '3',
        amount: 50,
    },
    {
        transactionDate: '2024-09-15T13:09:38.901Z',
        transactionId: '4',
        amount: 30,
    },
    {
        transactionDate: '2024-09-01T13:09:38.901Z',
        transactionId: '5',
        amount: 100,
    },
    {
        transactionDate: '2024-09-02T13:09:38.901Z',
        transactionId: '6',
        amount: 200,
    },
    {
        transactionDate: '2024-09-02T13:09:38.901Z',
        transactionId: '7',
        amount: 400,
    },
];
const currentDate = new Date();
const { page, pageCount, filteredRows, paginatedRows, sortBy } = useTable<Transaction[]>(data, 10, {
    column: 'transactionDate',
    direction: 'desc',
});

//TODO: Change the operation below when we have answer from ICCS/UBI
const currentBalance = /*await useLazyFetch<Balance>('/api/wallet/balance');*/ 3500;

const previousWeekTransactions = data.filter((item) =>
    dayjs(item.transactionDate).isSameOrBefore(dayjs(currentDate).subtract(1, 'week')),
);

let pervBalance = 0;
previousWeekTransactions.forEach((value) => {
    pervBalance = pervBalance + value.amount;
});

const columns: TableColumn[] = [
    {
        key: 'transactionDate',
        label: t('wallet.date'),
        sortable: true,
        class: 'text-center w-1/3',
    },
    {
        key: 'transactionId',
        label: t('wallet.transaction'),
        class: 'text-center w-1/3',
    },
    {
        key: 'amount',
        label: t('wallet.amount'),
        class: 'text-center w-1/3',
        sortable: true,
    },
];
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <div class="flex flex-col w-full">
                <div class="w-full place-items-stretch pb-4">
                    <div class="relative flex items-center">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center w-full space-x-2">
                                <div class="flex-shrink-0">
                                    <UIcon
                                        name="i-heroicons-currency-dollar-20-solid"
                                        class="w-8 h-8 text-secondary-300"
                                    />
                                </div>
                                <h3 class="text-base xl:text-lg font-normal">
                                    {{ t('wallet.balance') }}
                                </h3>
                                <!-- TODO: need to change the values below when we have the endpoints from wallet -->
                                <div :class="['text-lg font-bold text-green-800']">
                                    {{ currentBalance }} {{ 'STC' }}
                                </div>
                            </div>
                            <div class="flex items-center w-full space-x-2">
                                <div class="flex-shrink-0">
                                    <UIcon
                                        :name="pervBalance > 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-minus'"
                                        class="w-8 h-8 text-secondary-300"
                                    />
                                </div>
                                <!-- TODO: need to change the values below when we have the endpoints from wallet -->
                                <div
                                    :class="['text-lg font-bold', pervBalance > 0 ? 'text-green-800' : 'text-gray-800']"
                                >
                                    {{ pervBalance }} {{ 'STC' }}
                                </div>
                                <h3 class="text-base xl:text-lg font-normal">
                                    {{ t('wallet.lastWeek') }}
                                </h3>
                            </div>
                        </div>
                    </div>
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
