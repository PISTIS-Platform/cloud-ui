<script lang="ts" setup>
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import type TableColumn from '~/interfaces/table-column';
import type { Transaction } from '~/interfaces/wallet-table';

dayjs.extend(isBetween);

const { t } = useI18n();

const data = computed(() => [
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
        transactionDate: '2024-08-01T13:09:38.901Z',
        transactionId: '5',
        amount: 100,
    },
    {
        transactionDate: '2024-08-02T13:09:38.901Z',
        transactionId: '6',
        amount: 200,
    },
    {
        transactionDate: '2024-08-02T13:09:38.901Z',
        transactionId: '7',
        amount: 400,
    },
]);

const { page, pageCount, filteredRows, paginatedRows, sortBy } = useTable<Transaction[]>(data, 10, {
    column: 'transactionDate',
    direction: 'desc',
});

const currentBalance = await $fetch(`/api/wallet`, {
    method: 'post',
});

//FIXME: Find sum amount when we have actual transactions from BC and display them next to balance
const _sumAmount = data.value
    .filter((item) => dayjs(item.transactionDate).isBetween(dayjs().startOf('month'), dayjs(), 'day'))
    .reduce((total, item) => total + item.amount, 0);

const columns: TableColumn[] = [
    {
        key: 'transactionDate',
        label: t('wallet.date'),
        sortable: true,
        class: 'text-start w-1/3',
    },
    {
        key: 'transactionId',
        label: t('wallet.transaction'),
        class: 'text-start w-1/3',
    },
    {
        key: 'amount',
        label: t('wallet.amount'),
        class: 'text-start w-1/3',
        sortable: true,
    },
];
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <div class="flex flex-col w-full">
                <div class="relative w-full pb-4 flex items-center justify-end space-x-2">
                    <h3 class="text-base xl:text-lg font-normal mt-1">
                        {{ t('wallet.balance') }}
                    </h3>
                    <div class="text-lg mt-1 font-bold text-green-800">{{ currentBalance.dlt_amount }} {{ 'PST' }}</div>
                    <!-- <div class="mt-1">
                        {{ '(+' }}
                        <span class="text-lg font-bold text-green-800"> {{ sumAmount }} </span>
                        {{ t('wallet.balanceInMonth') + ')' }}
                    </div> -->
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
                                <span v-if="row.transactionDate" class="item-center">{{
                                    $d(new Date(row.transactionDate), 'short')
                                }}</span>
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
