<script lang="ts" setup>
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import type TableColumn from '~/interfaces/table-column';
import type { Transaction } from '~/interfaces/wallet-table';

dayjs.extend(isBetween);

const { t } = useI18n();

const currentBalance = await $fetch(`/api/wallet/balance`, {
    method: 'post',
});

const transactions = await $fetch(`/api/wallet/transactions`, {
    method: 'post',
});

const incoming = transactions.incoming.map((item: any) => {
    return {
        transactionDate: item.included_at,
        transactionId: item.transaction_id,
        amount: item.payload.Basic.amount,
        type: 'Incoming',
    };
});

const outgoing = transactions.outgoing.map((item: any) => {
    return {
        transactionDate: item.included_at,
        transactionId: item.transaction_id,
        amount: item.payload.Basic.amount,
        type: 'Outgoing',
    };
});

const data = computed(() => [...incoming, ...outgoing]);

const { page, pageCount, filteredRows, paginatedRows, sortBy } = useTable<Transaction[]>(data, 10, {
    column: 'transactionDate',
    direction: 'desc',
});

//FIXME: Find sum amount when we have actual transactions from BC and display them next to balance
const sumAmount = incoming
    .filter((item: any) => dayjs(item.included_at).isBetween(dayjs().startOf('month'), dayjs(), 'day'))
    .reduce((total: any, item: any) => total + item.amount, 0);

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
    {
        key: 'type',
        label: 'Type',
        sortable: true,
        class: 'text-center w-1/5',
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
                    <div class="text-lg mt-1 font-bold text-green-800">{{ currentBalance.dlt_amount }} {{ 'EUR' }}</div>
                    <div class="mt-1">
                        {{ '(+' }}
                        <span class="text-lg font-bold text-green-800"> {{ sumAmount }} </span>
                        {{ t('wallet.balanceInMonth') + ')' }}
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
                                <span v-if="row.transactionDate" class="item-center">{{
                                    $d(new Date(row.transactionDate), 'short')
                                }}</span>
                                <span v-else>&mdash;</span>
                            </template>
                            <template #type-data="{ row }">
                                <div class="text-center">
                                    <span
                                        :class="[
                                            'rounded-md px-4 py-1 font-medium',
                                            row.type === 'Incoming'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800',
                                        ]"
                                        >{{ row.type }}
                                    </span>
                                </div>
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
