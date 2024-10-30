<script lang="ts" setup>
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import type TableColumn from '~/interfaces/table-column';
import type { Transaction } from '~/interfaces/wallet-table';
import type { TransactionsType } from '~/interfaces/wallet-transactions.js';

dayjs.extend(isBetween);

const { t } = useI18n();
const isHovered = ref(null);
const currentBalance = ref(null);
const transactions = ref<TransactionsType>({
    incoming: [],
    outgoing: [],
});
const incoming = ref([
    {
        transactionDate: '',
        transactionId: '',
        amount: '',
        type: 'Incoming',
    },
]);
const outgoing = ref([
    {
        transactionDate: '',
        transactionId: '',
        amount: '',
        type: 'Outgoing',
    },
]);
const loading = ref(true);
onMounted(async () => {
    try {
        currentBalance.value = await $fetch(`/api/wallet/balance`, {
            method: 'post',
        });

        transactions.value = await $fetch(`/api/wallet/transactions`, {
            method: 'post',
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false;
    }

    incoming.value = transactions.value.incoming.map((item: any) => {
        return {
            transactionDate: item.included_at,
            transactionId: item.transaction_id,
            amount: item.payload.Basic.amount,
            type: 'Incoming',
        };
    });

    outgoing.value = transactions.value.outgoing.map((item: any) => {
        return {
            transactionDate: item.included_at,
            transactionId: item.transaction_id,
            amount: item.payload.Basic.amount,
            type: 'Outgoing',
        };
    });
});

const data = computed(() => [...incoming.value, ...outgoing.value]);

const { page, pageCount, filteredRows, paginatedRows, sortBy } = useTable<Transaction[]>(data, 10, {
    column: 'transactionDate',
    direction: 'desc',
});

//FIXME: Find sum amount when we have actual transactions from BC and display them next to balance
const sumAmount = computed(() =>
    incoming.value
        .filter((item: any) => dayjs(item.transactionDate).isBetween(dayjs().startOf('month'), dayjs(), 'day'))
        .reduce((total: any, item: any) => total + item.amount, 0),
);

console.log({ sumAmount });

const columns: TableColumn[] = [
    {
        key: 'transactionDate',
        label: t('wallet.date'),
        sortable: true,
        class: 'text-start w-1/3',
    },
    {
        key: 'type',
        label: 'Type',
        sortable: true,
        class: 'text-center w-1/5',
    },
    {
        key: 'amount',
        label: t('wallet.amount') + ` (EUR)`,
        class: 'w-1/5 flex justify-center',
        sortable: true,
    },
    {
        key: 'transactionId',
        label: t('wallet.transaction'),
        class: 'text-start w-1/3',
    },
];

//TODO: Uncomment if more space is needed in table
// const truncateId = (item: string, length: number) => {
//     return item.length > length ? item.slice(0, length) + '...' : item;
// };
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <div v-if="loading" class="flex flex-col w-full text-lg mt-1">
                <UProgress animation="carousel" color="primary" />
            </div>
            <div v-else class="flex flex-col w-full">
                <div class="relative w-full pb-4 flex items-center justify-end space-x-2">
                    <h3 class="text-base xl:text-lg font-normal mt-1">
                        {{ t('wallet.balance') }}
                    </h3>
                    <div class="text-lg mt-1 font-bold text-green-800">
                        {{ currentBalance?.dlt_amount?.toFixed(2) }} {{ 'EUR' }}
                    </div>
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
                            <template #transactionId-data="{ row }">
                                <div @mouseover="isHovered = row.transactionId" @mouseleave="isHovered = null">
                                    <span>
                                        {{ row.transactionId }}
                                    </span>
                                </div>
                            </template>
                            <template #amount-data="{ row }">
                                <span class="font-bold text-center w-1/5 flex justify-center">
                                    {{ row.amount.toFixed(2) }}
                                </span>
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
