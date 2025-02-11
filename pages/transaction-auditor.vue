<script setup lang="ts">
const { t } = useI18n();
import { useClipboard } from '@vueuse/core';
import { v4 as uuid } from 'uuid';

import type TableColumn from '~/interfaces/table-column';
import type { Transaction } from '~/interfaces/wallet-table';
import type { TransactionsType, WalletTransaction } from '~/interfaces/wallet-transactions.js';

const { copy: copyAsset, copied: copiedAsset } = useClipboard({});
const { copy: copyTransaction, copied: copiedTransaction } = useClipboard({});
import jsPDF from 'jspdf';

const columns: TableColumn[] = [
    {
        key: 'transactionDate',
        label: t('auditor.date'),
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
        key: 'assetTitle',
        label: t('auditor.assetTitle'),
        sortable: false,
        class: 'text-center',
    },
    {
        key: 'provider',
        label: t('auditor.provider'),
        sortable: true,
        class: 'text-center',
    },
    {
        key: 'consumer',
        label: t('auditor.consumer'),
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
        amountToProvider: (item.payload.Basic.amount * 80) / 100,
        transactionFee: (item.payload.Basic.amount * 20) / 100,
        provider: item.payload.Basic.recipient_address,
        consumer: item.payload.Basic.sender_address,
        //FIXME: Dummy data until available
        assetId: uuid(),
        assetTitle: 'Sample Asset Title',
        assetLink: 'http://google.com',
        terms: `Enim nisi exercitation nisi ad incididunt. Eiusmod culpa ea minim aute aute aliquip culpa nisi ad ea commodo. Anim labore culpa consequat. Cillum aute culpa ad ex. Elit consectetur et id in velit. Ullamco est in excepteur labore proident adipisicing minim sint id. Ullamco ea reprehenderit irure aliqua deserunt eiusmod tempor labore velit minim excepteur aliquip. Amet aute est in exercitation dolore aliqua nulla eiusmod.

Proident dolor sit adipisicing. Ullamco culpa consequat quis. Velit cupidatat anim veniam amet. Commodo consectetur aute elit. Commodo cupidatat id deserunt magna velit est ex aliqua eu ad aute exercitation ea sit.

Esse duis enim cillum ipsum qui magna sit adipisicing occaecat excepteur aliqua officia. Deserunt aliquip nulla irure est occaecat. Ipsum dolor culpa minim nulla in aliqua labore. Excepteur ea in dolor et minim laborum esse tempor dolor amet incididunt ea in minim nulla. Enim esse officia aliquip voluptate magna dolor consectetur. Fugiat incididunt aliquip fugiat velit qui officia excepteur do qui sunt ipsum cupidatat mollit do aliqua. Cillum cillum qui id voluptate sint dolore. Laborum non nostrud eu esse qui nisi aliquip.`,
    }));
});

const outgoingTransactions = computed(() => {
    if (!transactionsData.value) return [];
    return transactionsData.value?.outgoing.map((item: WalletTransaction) => ({
        //Actual data from transaction
        transactionDate: item.included_at,
        transactionId: item.transaction_id,
        amount: item.payload.Basic.amount,
        amountToProvider: (item.payload.Basic.amount * 80) / 100,
        transactionFee: (item.payload.Basic.amount * 20) / 100,
        provider: item.payload.Basic.recipient_address,
        consumer: item.payload.Basic.sender_address,
        type: 'Outgoing',
        //FIXME: Dummy data until available
        assetId: uuid(),
        assetTitle: 'Sample Asset Title',
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

const pdfContent = ref<HTMLDivElement | null>(null);

const generatePDF = () => {
    if (!pdfContent.value) return;

    pdfContent.value.classList.add('pdf-mode');

    const doc = new jsPDF('p', 'pt', 'a4');

    doc.html(pdfContent.value, {
        callback: (doc: jsPDF) => {
            doc.save('transaction_details.pdf');
            // Remove the PDF-specific class after PDF generation.
            pdfContent.value?.classList.remove('pdf-mode');
        },
        x: 10,
        y: 10,
        width: 500,
        windowWidth: pdfContent.value.scrollWidth,
    });
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
                <UModal v-model="modalOpen" :ui="{ width: 'w-full sm:max-w-xl' }" class="text-gray-600 relative">
                    <UIcon
                        name="material-symbols-light:close"
                        class="w-6 h-6 absolute right-2 top-2 cursor-pointer"
                        @click="modalOpen = false"
                    />
                    <div v-if="selected" ref="pdfContent" class="w-full p-6 flex flex-col gap-4 text-sm">
                        <div class="w-full flex items-center gap-4 font-semibold">
                            <span class="text-gray-500 text-lg">{{ $t('auditor.transactionDetails') }}</span>
                            <UIcon
                                name="fa6-solid:file-pdf"
                                class="w-6 h-6 text-gray-500 cursor-pointer no-print"
                                @click="generatePDF"
                            />
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.date') }}</span>
                            <span>{{ selected.transactionDate }}</span>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.transactionId') }}</span>
                            <span
                                >{{ truncateId(selected.transactionId, 10) }}
                                <UIcon
                                    name="mingcute:copy-line"
                                    class="w-4 h-4 cursor-pointer no-print"
                                    @click="copyTransaction(selected.transactionId)"
                                />
                                <UIcon
                                    v-show="copiedTransaction"
                                    name="ic:baseline-check"
                                    class="w-4 h-4 text-green-500 transition-all duration-100 no-print"
                                />
                            </span>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.assetId') }}</span>
                            <span
                                >{{ truncateId(selected.assetId, 10) }}
                                <UIcon
                                    name="mingcute:copy-line"
                                    class="w-4 h-4 cursor-pointer no-print"
                                    @click="copyAsset(selected.assetId)" />
                                <UIcon
                                    v-show="copiedAsset"
                                    name="ic:baseline-check"
                                    class="w-4 h-4 text-green-500 transition-all duration-100 no-print"
                            /></span>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.assetTitle') }}</span>
                            <a
                                :href="selected.assetLink"
                                class="text-primary visited:text-primary-800 focus:outline-none"
                                >{{ selected.assetTitle }}</a
                            >
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.amount') }}</span>
                            <span>{{ selected.amount.toFixed(2) }} EUR </span>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.amountToProvider') }}</span>
                            <span>{{ selected.amountToProvider.toFixed(2) }} EUR </span>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.transactionFee') }}</span>
                            <span>{{ selected.transactionFee.toFixed(2) }} EUR </span>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.provider') }}</span>
                            <span>{{ selected.provider }}</span>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.consumer') }}</span>
                            <span>{{ selected.consumer }}</span>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.terms') }}</span>
                            <div class="max-h-44 flex flex-col gap-2 overflow-y-scroll scrollbar pr-6 scrollable">
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
                        @select="select"
                    >
                        <template #expand="{ row }">
                            <div class="w-full p-4 flex flex-col text-sm text-gray-500 gap-2 justify-center">
                                <span>
                                    <span>{{ $t('auditor.amountToProvider') }}: </span>
                                    <span class="font-bold">{{ row.amountToProvider.toFixed(2) }} EUR</span>
                                </span>
                                <hr />
                                <span>
                                    <span class="mt-2">{{ $t('auditor.transactionFee') }}: </span>
                                    <span class="font-bold">{{ row.transactionFee.toFixed(2) }} EUR</span>
                                </span>
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
                            <span class="flex items-center justify-center">
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
                                <span class="flex items-center justify-center">
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
                                <span class="flex items-center justify-center">
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
/* styles that only get activated during pdf generation with the .pdf-mode class */
.pdf-mode .no-print {
    display: none !important;
}

.pdf-mode .scrollable {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
}

.pdf-mode .scrollable p {
    page-break-inside: avoid;
    break-inside: avoid;
}
</style>
