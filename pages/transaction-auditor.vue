<script setup lang="ts">
const { t } = useI18n();
import { useClipboard } from '@vueuse/core';
import { v4 as uuid } from 'uuid';

import type TableColumn from '~/interfaces/table-column';
import type { Transaction } from '~/interfaces/wallet-table';
import type { WalletTransaction } from '~/interfaces/wallet-transactions.js';

const { copy: copyAsset, copied: copiedAsset } = useClipboard({});
const { copy: copyTransaction, copied: copiedTransaction } = useClipboard({});
const { copy: copyProvider, copied: copiedProvider } = useClipboard({});
const { copy: copyConsumer, copied: copiedConsumer } = useClipboard({});

const { $pdfMake } = useNuxtApp();

const columns: TableColumn[] = [
    {
        key: 'transactionDate',
        label: t('auditor.date'),
        sortable: true,
        class: 'text-center w-12',
    },
    {
        key: 'amount',
        label: t('auditor.amount'),
        sortable: true,
        class: 'text-center w-12 text-nowrap',
    },
    {
        key: 'assetTitle',
        label: t('auditor.assetTitle'),
        sortable: false,
        class: 'text-left',
    },
    {
        key: 'provider',
        label: t('auditor.provider'),
        sortable: true,
        class: 'text-left w-12',
    },
    {
        key: 'consumer',
        label: t('auditor.consumer'),
        sortable: true,
        class: 'text-left w-12',
    },
];

//FIXME: Re-enable API call when real data exists for details
// const { data: transactionsData, status: transactionsStatus } = useFetch<TransactionsType>(`/api/wallet/transactions`, {
//     method: 'POST',
// });

//FIXME: Remove dummy data
const transactionsData = ref({
    outgoing: [
        {
            included_at: '2024-06-25T10:00:00Z',
            transaction_id: 'tx_out_001_abc',
            payload: {
                Basic: {
                    amount: 1000,
                    recipient_address: 'provider_address_123',
                    sender_address: 'consumer_address_456',
                },
            },
        },
        {
            included_at: '2024-06-24T14:30:00Z',
            transaction_id: 'tx_out_002_def',
            payload: {
                Basic: {
                    amount: 250,
                    recipient_address: 'provider_address_789',
                    sender_address: 'consumer_address_012',
                },
            },
        },
        {
            included_at: '2024-06-23T09:15:00Z',
            transaction_id: 'tx_out_003_ghi',
            payload: {
                Basic: {
                    amount: 75.5,
                    recipient_address: 'provider_address_321',
                    sender_address: 'consumer_address_654',
                },
            },
        },
    ],
    incoming: [
        {
            included_at: '2024-06-25T11:30:00Z',
            transaction_id: 'tx_in_001_jkl',
            payload: {
                Basic: {
                    amount: 500,
                    recipient_address: 'consumer_address_456', // Your address as recipient
                    sender_address: 'source_address_abc', // Sender of incoming transaction
                },
            },
        },
        {
            included_at: '2024-06-24T16:00:00Z',
            transaction_id: 'tx_in_002_mno',
            payload: {
                Basic: {
                    amount: 150.25,
                    recipient_address: 'consumer_address_012',
                    sender_address: 'source_address_def',
                },
            },
        },
        {
            included_at: '2024-06-23T10:45:00Z',
            transaction_id: 'tx_in_003_pqr',
            payload: {
                Basic: {
                    amount: 2000,
                    recipient_address: 'consumer_address_654',
                    sender_address: 'source_address_ghi',
                },
            },
        },
    ],
});

const incomingTransactions = computed(() => {
    if (!transactionsData.value) return [];
    return transactionsData.value?.incoming.map((item: WalletTransaction) => {
        //FIXME: Dummy data code for different recipients
        const totalAmount = item.payload.Basic.amount;
        const numRecipients = Math.floor(Math.random() * 3) + 2;
        const percentages = [];
        let remaining = 100;
        for (let i = 0; i < numRecipients - 1; i++) {
            const maxAlloc = remaining - (numRecipients - i - 1); // ensure at least 1% left for others
            const pct = Math.floor(Math.random() * (maxAlloc - 1)) + 1;
            percentages.push(pct);
            remaining -= pct;
        }
        percentages.push(remaining);
        const recipients = percentages.map((percentage, index) => ({
            recipient: `Recipient ${index + 1}`,
            amount: parseFloat(((totalAmount * percentage) / 100).toFixed(2)),
            percentage,
        }));
        return {
            //Actual data from transaction
            transactionDate: item.included_at,
            transactionId: item.transaction_id,
            amount: item.payload.Basic.amount,
            // amountToProvider: (item.payload.Basic.amount * 80) / 100,
            // transactionFee: (item.payload.Basic.amount * 20) / 100,
            recipients,
            provider: item.payload.Basic.recipient_address,
            consumer: item.payload.Basic.sender_address,
            //FIXME: Dummy data until available
            assetId: uuid(),
            assetTitle: 'Sample Asset Title',
            assetLink: 'http://google.com',
            terms: `Enim nisi exercitation nisi ad incididunt. Eiusmod culpa ea minim aute aute aliquip culpa nisi ad ea commodo. Anim labore culpa consequat. Cillum aute culpa ad ex. Elit consectetur et id in velit. Ullamco est in excepteur labore proident adipisicing minim sint id. Ullamco ea reprehenderit irure aliqua deserunt eiusmod tempor labore velit minim excepteur aliquip. Amet aute est in exercitation dolore aliqua nulla eiusmod.

Proident dolor sit adipisicing. Ullamco culpa consequat quis. Velit cupidatat anim veniam amet. Commodo consectetur aute elit. Commodo cupidatat id deserunt magna velit est ex aliqua eu ad aute exercitation ea sit.

Esse duis enim cillum ipsum qui magna sit adipisicing occaecat excepteur aliqua officia. Deserunt aliquip nulla irure est occaecat. Ipsum dolor culpa minim nulla in aliqua labore. Excepteur ea in dolor et minim laborum esse tempor dolor amet incididunt ea in minim nulla. Enim esse officia aliquip voluptate magna dolor consectetur. Fugiat incididunt aliquip fugiat velit qui officia excepteur do qui sunt ipsum cupidatat mollit do aliqua. Cillum cillum qui id voluptate sint dolore. Laborum non nostrud eu esse qui nisi aliquip.`,
        };
    });
});

const outgoingTransactions = computed(() => {
    if (!transactionsData.value) return [];
    return transactionsData.value?.outgoing.map((item: WalletTransaction) => {
        //FIXME: Dummy data code for different recipients
        const totalAmount = item.payload.Basic.amount;
        const numRecipients = Math.floor(Math.random() * 3) + 2;
        const percentages = [];
        let remaining = 100;
        for (let i = 0; i < numRecipients - 1; i++) {
            const maxAlloc = remaining - (numRecipients - i - 1); // ensure at least 1% left for others
            const pct = Math.floor(Math.random() * (maxAlloc - 1)) + 1;
            percentages.push(pct);
            remaining -= pct;
        }
        percentages.push(remaining);
        const recipients = percentages.map((percentage, index) => ({
            recipient: `Recipient ${index + 1}`,
            amount: parseFloat(((totalAmount * percentage) / 100).toFixed(2)),
            percentage,
        }));
        return {
            //Actual data from transaction
            transactionDate: item.included_at,
            transactionId: item.transaction_id,
            amount: item.payload.Basic.amount,
            // amountToProvider: (item.payload.Basic.amount * 80) / 100,
            // transactionFee: (item.payload.Basic.amount * 20) / 100,
            recipients,
            provider: item.payload.Basic.recipient_address,
            consumer: item.payload.Basic.sender_address,
            type: 'Outgoing',
            //FIXME: Dummy data until available
            assetId: uuid(),
            assetTitle: 'Sample Asset Title',
            assetLink: 'http://google.com',
            terms: 'Ullamco enim Lorem in fugiat labore non fugiat magna nostrud duis aliqua in sit. Aliqua do eiusmod et excepteur laboris magna incididunt. Adipisicing eu nulla aute irure. Nostrud non consequat pariatur aliquip dolor quis eu tempor anim esse aute est elit. Et ut eiusmod exercitation do esse et. Lorem ipsum esse esse est officia nulla sint consectetur. Sunt qui ea commodo esse ipsum laboris et cillum nostrud excepteur tempor elit.',
        };
    });
});

const data = computed(() => [...incomingTransactions.value, ...outgoingTransactions.value]);

const { page, pageCount, filteredRows, paginatedRows, sortBy, searchString } = useTable<Transaction[]>(data, 15, {
    column: 'transactionDate',
    direction: 'desc',
});

const truncateId = (item: string, length: number) => {
    return item.length > length ? item.slice(0, length) + '...' : item;
};

const selected = ref();

const select = (item: any) => {
    selected.value = item;
    modalOpen.value = true;
};

const modalOpen = ref(false);

const expand = ref({
    openedRows: [],
    row: null,
});

const generatePDF = () => {
    if (!selected.value) return;

    const docDefinition = {
        content: [
            { text: 'PISTIS - ' + t('auditor.transactionDetails'), style: 'heading' },
            { text: t('auditor.date'), style: 'subheading' },
            { text: selected.value.transactionDate },
            { text: t('auditor.transactionId'), style: 'subheading' },
            { text: selected.value.transactionId },
            { text: t('auditor.assetId'), style: 'subheading' },
            { text: selected.value.assetId },
            { text: t('auditor.assetTitle'), style: 'subheading' },
            { text: selected.value.assetTitle, link: selected.value.assetLink, style: 'link' },
            { text: t('auditor.amount'), style: 'subheading' },
            { text: selected.value.amount + ' EUR' },
            // { text: t('auditor.amountToProvider'), style: 'subheading' },
            // { text: selected.value.amountToProvider + ' EUR' },
            // { text: t('auditor.transactionFee'), style: 'subheading' },
            // { text: selected.value.transactionFee + ' EUR' },
            { text: t('auditor.provider'), style: 'subheading' },
            { text: selected.value.provider },
            { text: t('auditor.consumer'), style: 'subheading' },
            { text: selected.value.consumer },
            { text: t('auditor.terms'), style: 'subheading' },
            {
                text: selected.value.terms,
                style: 'body',
            },
        ],
        styles: {
            heading: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
                color: '#705df7',
            },
            subheading: {
                fontSize: 13,
                bold: true,
                margin: [0, 15, 0, 5],
            },
            body: {
                fontSize: 12,
                lineHeight: 1.2,
            },
            link: {
                color: '#705df7',
            },
        },
        // Optional: Adjust page margins, orientation, etc.
        pageMargins: [40, 60, 40, 60],
    };

    // Create and download the PDF
    $pdfMake.createPdf(docDefinition).download(`transaction_details_${selected.value.transactionId}.pdf`);
};
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <span class="font-bold text-lg">{{ $t('auditor.title') }}</span>
            <!-- FIXME: Reenable when loading actual data -->
            <!-- <div v-if="transactionsStatus === 'pending'" class="flex flex-col w-full text-lg mt-4">
                <UProgress animation="carousel" color="primary" />
            </div> -->
            <div v-if="false"></div>
            <div v-else class="w-full mt-4">
                <UModal v-model="modalOpen" :ui="{ width: 'w-full sm:max-w-[1000px]' }" class="text-gray-600 relative">
                    <UIcon
                        name="material-symbols-light:close"
                        class="w-6 h-6 absolute right-2 top-2 cursor-pointer"
                        @click="modalOpen = false"
                    />
                    <div v-if="selected" ref="pdfContent" class="w-full p-6 flex flex-col gap-4 text-sm">
                        <div class="w-full flex items-center gap-4 font-semibold">
                            <span class="text-primary-500 text-lg">{{ $t('auditor.transactionDetails') }}</span>
                            <UButton
                                size="xs"
                                icon="fa6-solid:file-pdf"
                                class="focus:outline-none"
                                @click="generatePDF"
                                >{{ $t('auditor.downloadPDF') }}</UButton
                            >
                        </div>
                        <div class="flex justify-between flex-wrap w-full">
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2">
                                <span class="text-gray-400">{{ $t('auditor.date') }}</span>
                                <span>{{ selected.transactionDate }}</span>
                            </div>
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2 mt-4 lg:mt-0">
                                <span class="text-gray-400">{{ $t('auditor.transactionId') }}</span>
                                <span
                                    >{{ truncateId(selected.transactionId, 20) }}
                                    <UIcon
                                        name="mingcute:copy-line"
                                        class="w-4 h-4 cursor-pointer"
                                        @click="copyTransaction(selected.transactionId)"
                                    />
                                    <UIcon
                                        v-show="copiedTransaction"
                                        name="ic:baseline-check"
                                        class="w-4 h-4 text-green-500 transition-all duration-100"
                                    />
                                </span>
                            </div>
                        </div>
                        <div class="flex justify-between flex-wrap w-full">
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2">
                                <span class="text-gray-400">{{ $t('auditor.assetId') }}</span>
                                <span
                                    >{{ truncateId(selected.assetId, 20) }}
                                    <UIcon
                                        name="mingcute:copy-line"
                                        class="w-4 h-4 cursor-pointer"
                                        @click="copyAsset(selected.assetId)" />
                                    <UIcon
                                        v-show="copiedAsset"
                                        name="ic:baseline-check"
                                        class="w-4 h-4 text-green-500 transition-all duration-100"
                                /></span>
                            </div>
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2 mt-4 lg:mt-0">
                                <span class="text-gray-400">{{ $t('auditor.assetTitle') }}</span>
                                <a
                                    :href="selected.assetLink"
                                    class="text-primary visited:text-primary-800 focus:outline-none"
                                    >{{ selected.assetTitle }}</a
                                >
                            </div>
                        </div>
                        <div class="flex justify-between w-full flex-wrap">
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2">
                                <span class="text-gray-400">{{ $t('auditor.amount') }}</span>
                                <span>{{ selected.amount.toFixed(2) }} EUR </span>
                            </div>
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2 mt-4 lg:mt-0">
                                <span class="text-gray-400"
                                    >{{ $t('auditor.amountToProvider') }} / {{ $t('auditor.transactionFee') }}</span
                                >
                                //FIXME: Put fields for recipients here
                                <!-- <span
                                    >{{ selected.amountToProvider.toFixed(2) }} EUR /
                                    {{ selected.transactionFee.toFixed(2) }} EUR</span
                                > -->
                            </div>
                        </div>
                        <div class="w-full flex justify-between flex-wrap">
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2">
                                <span class="text-gray-400">{{ $t('auditor.provider') }}</span>
                                <span
                                    >{{ truncateId(selected.provider, 20) }}
                                    <UIcon
                                        name="mingcute:copy-line"
                                        class="w-4 h-4 cursor-pointer"
                                        @click="copyProvider(selected.provider)" />
                                    <UIcon
                                        v-show="copiedProvider"
                                        name="ic:baseline-check"
                                        class="w-4 h-4 text-green-500 transition-all duration-100"
                                /></span>
                            </div>
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2 mt-4 lg:mt-0">
                                <span class="text-gray-400">{{ $t('auditor.consumer') }}</span>
                                <span
                                    >{{ truncateId(selected.consumer, 20) }}
                                    <UIcon
                                        name="mingcute:copy-line"
                                        class="w-4 h-4 cursor-pointer"
                                        @click="copyConsumer(selected.consumer)" />
                                    <UIcon
                                        v-show="copiedConsumer"
                                        name="ic:baseline-check"
                                        class="w-4 h-4 text-green-500 transition-all duration-100"
                                /></span>
                            </div>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.terms') }}</span>
                            <div class="max-h-96 flex flex-col gap-2 overflow-y-scroll scrollbar pr-6">
                                <p v-for="paragraph in selected.terms.split('\n')" :key="paragraph">
                                    {{ paragraph }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="w-full flex items-center justify-center text-gray-500">
                        {{ $t('auditor.noTransactionSelected') }}
                    </div>
                </UModal>
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
                        v-model:expand="expand"
                        :columns="columns"
                        :rows="paginatedRows"
                        sort-mode="manual"
                        :empty-state="{
                            icon: 'i-heroicons-circle-stack-20-solid',
                            label: $t('wallet.noTransactions'),
                        }"
                        :single-select="true"
                        :multiple-expand="true"
                        :ui="{ tbody: 'divide-none', tr: { base: 'border-t' } }"
                        @select="select"
                    >
                        <template #expand="{ row }">
                            <div class="w-full p-4 flex flex-col text-sm text-gray-500 gap-2 justify-center bg-gray-50">
                                <!-- <span class="flex items-center gap-4">
                                    <span class="font-bold">{{ row.amountToProvider.toFixed(2) }} EUR</span>
                                    <span>{{ $t('auditor.amountToProvider') }}</span>
                                </span>
                                <span class="flex items-center gap-4">
                                    <span class="font-bold">{{ row.transactionFee.toFixed(2) }} EUR</span>
                                    <span>{{ $t('auditor.transactionFee') }}</span>
                                </span> -->
                                <div>{{ row }}</div>
                            </div>
                        </template>
                        <template #transactionDate-data="{ row }">
                            <span v-if="row.transactionDate" class="flex items-center justify-center">{{
                                $d(new Date(row.transactionDate), 'short')
                            }}</span>
                            <span v-else>&mdash;</span>
                        </template>

                        <template #amount-data="{ row }">
                            <span class="flex items-center justify-center font-bold">
                                {{ row.amount.toFixed(2) }} EUR
                            </span>
                        </template>

                        <template #assetTitle-data="{ row }">
                            <span class="flex items-center justify-start">
                                <a :href="row.assetLink" target="_blank" class="text-primary visited:text-primary-800">
                                    {{ row.assetTitle }}
                                </a>
                            </span>
                        </template>

                        <template #provider-data="{ row }">
                            <UTooltip
                                :text="row.provider"
                                :ui="{ width: 'max-w-lg' }"
                                :popper="{ placement: 'top' }"
                                class="flex items-center justify-center"
                            >
                                <span class="flex items-center justify-start">
                                    {{ truncateId(row.provider, 10) }}
                                </span>
                            </UTooltip>
                        </template>

                        <template #consumer-data="{ row }">
                            <UTooltip
                                :text="row.consumer"
                                :ui="{ width: 'max-w-lg' }"
                                :popper="{ placement: 'top' }"
                                class="flex items-center justify-center"
                            >
                                <span class="flex items-center justify-start">
                                    {{ truncateId(row.consumer, 10) }}
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

<style scoped>
:deep(tr > td:first-child) {
    width: 50px !important;
}

/* :deep(tr:first-child) {
  border: none !important;
} */

:deep(tr) {
    border-top: 1px solid #e4e4e7 !important;
}

:deep(tr:has(td[colspan='100%'])) {
    /* background-color: red !important; */
    border: none !important;
}

:deep(td[colspan='100%']) {
    border: none !important;
    margin-top: -2px !important;
}
</style>
