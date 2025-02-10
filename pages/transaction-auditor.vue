<script setup lang="ts">
const { t } = useI18n();
import { v4 as uuid } from 'uuid';

import type TableColumn from '~/interfaces/table-column';
import type { Transaction } from '~/interfaces/wallet-table';
import type { TransactionsType, WalletTransaction } from '~/interfaces/wallet-transactions.js';

const columns: TableColumn[] = [
    {
        key: 'transactionDate',
        label: t('auditor.date'),
        sortable: true,
        class: 'text-center',
    },
    {
        key: 'type',
        label: t('auditor.type'),
        sortable: true,
        class: 'text-center',
    },
    {
        key: 'amount',
        label: t('auditor.amount'),
        sortable: true,
        class: 'text-center',
    },
    {
        key: 'assetId',
        label: t('auditor.assetId'),
        sortable: false,
        class: 'text-center',
    },
    {
        key: 'seller',
        label: t('auditor.seller'),
        sortable: true,
        class: 'text-center',
    },
    {
        key: 'buyer',
        label: t('auditor.buyer'),
        sortable: true,
        class: 'text-center',
    },
];

const { data: transactionsData, status: transactionsStatus } = useFetch<TransactionsType>(`/api/wallet/transactions`, {
    method: 'POST',
});

const incomingTransactions = computed(() => {
    if (!transactionsData.value) return [];
    return transactionsData.value?.incoming.map((item: WalletTransaction) => ({
        //Actual data from transaction
        transactionDate: item.included_at,
        transactionId: item.transaction_id,
        amount: item.payload.Basic.amount,
        seller: item.payload.Basic.recipient_address,
        buyer: item.payload.Basic.sender_address,
        type: 'Incoming',
        //FIXME: Dummy data until available
        assetId: uuid(),
        assetTitle: 'Asset Title',
        assetLink: 'http://google.com',
        terms: 'Ullamco enim Lorem in fugiat labore non fugiat magna nostrud duis aliqua in sit. Aliqua do eiusmod et excepteur laboris magna incididunt. Adipisicing eu nulla aute irure. Nostrud non consequat pariatur aliquip dolor quis eu tempor anim esse aute est elit. Et ut eiusmod exercitation do esse et. Lorem ipsum esse esse est officia nulla sint consectetur. Sunt qui ea commodo esse ipsum laboris et cillum nostrud excepteur tempor elit.',
    }));
});

const outgoingTransactions = computed(() => {
    if (!transactionsData.value) return [];
    return transactionsData.value?.outgoing.map((item: WalletTransaction) => ({
        //Actual data from transaction
        transactionDate: item.included_at,
        transactionId: item.transaction_id,
        amount: item.payload.Basic.amount,
        seller: item.payload.Basic.recipient_address,
        buyer: item.payload.Basic.sender_address,
        type: 'Outgoing',
        //FIXME: Dummy data until available
        assetId: uuid(),
        assetTitle: 'Asset Title',
        assetLink: 'http://google.com',
        terms: 'Ullamco enim Lorem in fugiat labore non fugiat magna nostrud duis aliqua in sit. Aliqua do eiusmod et excepteur laboris magna incididunt. Adipisicing eu nulla aute irure. Nostrud non consequat pariatur aliquip dolor quis eu tempor anim esse aute est elit. Et ut eiusmod exercitation do esse et. Lorem ipsum esse esse est officia nulla sint consectetur. Sunt qui ea commodo esse ipsum laboris et cillum nostrud excepteur tempor elit.',
    }));
});

const data = computed(() => [...incomingTransactions.value, ...outgoingTransactions.value]);

const { page, pageCount, filteredRows, paginatedRows, sortBy, searchString } = useTable<Transaction[]>(data, 15, {
    column: 'transactionDate',
    direction: 'desc',
});

const truncateId = (item: string, length: number) => {
    return item.length > length ? item.slice(0, length) + '...' : item;
};
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <span class="font-bold text-lg">{{ $t('auditor.title') }}</span>
            <div v-if="transactionsStatus === 'pending'" class="flex flex-col w-full text-lg mt-4">
                <UProgress animation="carousel" color="primary" />
            </div>
            <div v-else class="w-full mt-4">
                <UCard>
                    <div class="w-ful flex items-center justify-end">
                        <UInput
                            v-model="searchString"
                            icon="i-heroicons-magnifying-glass-20-solid"
                            size="sm"
                            color="white"
                            :trailing="false"
                            placeholder="Search..."
                        />
                    </div>

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
                            <span v-if="row.transactionDate" class="flex items-center justify-center">{{
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

                        <template #amount-data="{ row }">
                            <span class="flex items-center justify-center font-bold">
                                {{ row.amount.toFixed(2) }} EUR
                            </span>
                        </template>

                        <template #assetId-data="{ row }">
                            <UTooltip
                                :text="row.assetTitle"
                                :ui="{ width: 'max-w-lg' }"
                                :popper="{ placement: 'top' }"
                                class="flex items-center justify-center"
                            >
                                <span class="flex items-center justify-center">
                                    <a
                                        :href="row.assetLink"
                                        target="_blank"
                                        class="text-primary visited:text-primary-800"
                                    >
                                        {{ row.assetId }}
                                    </a>
                                </span>
                            </UTooltip>
                        </template>

                        <template #seller-data="{ row }">
                            <UTooltip
                                :text="row.seller"
                                :ui="{ width: 'max-w-lg' }"
                                :popper="{ placement: 'top' }"
                                class="flex items-center justify-center"
                            >
                                <span class="flex items-center justify-center">
                                    {{ truncateId(row.seller, 10) }}
                                </span>
                            </UTooltip>
                        </template>

                        <template #buyer-data="{ row }">
                            <UTooltip
                                :text="row.buyer"
                                :ui="{ width: 'max-w-lg' }"
                                :popper="{ placement: 'top' }"
                                class="flex items-center justify-center"
                            >
                                <span class="flex items-center justify-center">
                                    {{ truncateId(row.buyer, 10) }}
                                </span>
                            </UTooltip>
                        </template>
                    </UTable>
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
        </PageContainer>
    </div>
</template>
