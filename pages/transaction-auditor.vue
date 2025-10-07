<script setup lang="ts">
const { t } = useI18n();
import { useClipboard } from '@vueuse/core';
import dayjs from 'dayjs';
import * as R from 'ramda';

import type TableColumn from '~/interfaces/table-column';
import type { Transaction } from '~/interfaces/wallet-table';

const { copy: copyAsset, copied: copiedAsset } = useClipboard({});
const { copy: copyTransaction, copied: copiedTransaction } = useClipboard({});
const { copy: copyProvider, copied: copiedProvider } = useClipboard({});
const { copy: copyConsumer, copied: copiedConsumer } = useClipboard({});
const { copy: copyProviderId, copied: copiedProviderId } = useClipboard({});
const { copy: copyConsumerId, copied: copiedConsumerId } = useClipboard({});

const { $pdfMake } = useNuxtApp();

const columns: TableColumn[] = [
    {
        key: 'createdAt',
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
        key: 'assetName',
        label: t('auditor.assetName'),
        sortable: false,
        class: 'text-left',
    },
    {
        key: 'factorySellerName',
        label: t('auditor.provider'),
        sortable: true,
        class: 'text-left w-12',
    },
    {
        key: 'factoryBuyerName',
        label: t('auditor.consumer'),
        sortable: true,
        class: 'text-left w-12',
    },
];

const page = ref(1);

const data = computed(() => transactionsData.value.data);

const { rows, sortBy, searchString } = useTable<Transaction[]>(data, 15, {
    column: 'createdAt',
    direction: 'desc',
});

const rawInput = ref('');
let timeout = null;

//debounce the search bar
watch(rawInput, (newVal) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        searchString.value = newVal;
    }, 500);
});

const sortByColumn = computed(() => sortBy.value.column);
const sortByDirection = computed(() => sortBy.value.direction);

const totalCount = computed(() => transactionsData.value.meta.totalItems);

const {
    data: transactionsData,
    status: transactionsStatus,
    error,
} = useFetch<any>(`/api/transaction-auditor/transactions`, {
    method: 'GET',
    query: {
        page,
        sortByColumn,
        sortByDirection,
        searchString,
    },
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

const decodedTerms = computed(() => decodeURIComponent(atob(selected.value.terms || '')));

const generatePDF = () => {
    if (!selected.value) return;

    const docDefinition = {
        content: [
            { text: 'PISTIS - ' + t('auditor.transactionDetails'), style: 'heading' },
            { text: t('auditor.date'), style: 'subheading' },
            { text: dayjs(selected.value.createdAt).format('YYYY-MM-DD HH:mm:ss') },
            { text: t('auditor.transactionId'), style: 'subheading' },
            { text: selected.value.transactionId },
            { text: t('auditor.assetId'), style: 'subheading' },
            { text: selected.value.assetId },
            { text: t('auditor.assetName'), style: 'subheading' },
            {
                text: selected.value.assetName,
                link: `https://pistis-market.eu/srv/catalog/datasets/${selected.value.assetId}`,
                style: 'link',
            },
            { text: t('auditor.amount'), style: 'subheading' },
            { text: selected.value.amount.toFixed(2) + ' EUR' },
            { text: t('auditor.amountToProvider'), style: 'subheading' },
            {
                text: R.isNil(selected.value.transactionFee)
                    ? `${selected.value.amount.toFixed(2)} EUR`
                    : `${(selected.value.amount - selected.value.transactionFee).toFixed(2)} EUR`,
            },
            { text: t('auditor.transactionFee'), style: 'subheading' },
            {
                text: R.isNil(selected.value.transactionFee)
                    ? 'None'
                    : `${selected.value.transactionFee.toFixed(2)} EUR`,
            },
            { text: t('auditor.provider'), style: 'subheading' },
            { text: selected.value.factorySellerName },
            { text: t('auditor.provider') + ' ID', style: 'subheading' },
            { text: selected.value.factorySellerId },
            { text: t('auditor.consumer'), style: 'subheading' },
            { text: selected.value.factoryBuyerName },
            { text: t('auditor.consumer') + ' ID', style: 'subheading' },
            { text: selected.value.factoryBuyerId },
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
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full pt-6">
        <ErrorCard v-if="error" :error-msg="error.data?.data?.message" class="mt-6" />
        <PageContainer v-else>
            <span class="font-bold text-lg">{{ $t('auditor.title') }}</span>
            <div v-if="transactionsStatus === 'pending'" class="flex flex-col w-full text-lg mt-4">
                <UProgress animation="carousel" color="primary" />
            </div>
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
                                <span>{{ dayjs(selected.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
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
                                    :href="`https://pistis-market.eu/srv/catalog/datasets/${selected.assetId}`"
                                    target="_blank"
                                    class="text-primary visited:text-primary-800 focus:outline-none"
                                    >{{ selected.assetName }}</a
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
                                <span>
                                    {{
                                        R.isNil(selected.transactionFee)
                                            ? `${selected.amount.toFixed(2)}`
                                            : `${(selected.amount - selected.transactionFee).toFixed(2)}`
                                    }}
                                    EUR / {{ selected.transactionFee ? selected.transactionFee.toFixed(2) : 0 }} EUR
                                </span>
                            </div>
                        </div>
                        <div class="w-full flex justify-between flex-wrap">
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2">
                                <span class="text-gray-400">{{ $t('auditor.provider') }}</span>
                                <span
                                    >{{ truncateId(selected.factorySellerName, 20) }}
                                    <UIcon
                                        name="mingcute:copy-line"
                                        class="w-4 h-4 cursor-pointer"
                                        @click="copyProvider(selected.factorySellerName)" />
                                    <UIcon
                                        v-show="copiedProvider"
                                        name="ic:baseline-check"
                                        class="w-4 h-4 text-green-500 transition-all duration-100"
                                /></span>
                            </div>
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2 sm:mt-4 lg:mt-0">
                                <span class="text-gray-400">{{ $t('auditor.provider') + ' ID' }}</span>
                                <span
                                    >{{ truncateId(selected.factorySellerId, 20) }}
                                    <UIcon
                                        name="mingcute:copy-line"
                                        class="w-4 h-4 cursor-pointer"
                                        @click="copyProviderId(selected.factorySellerId)" />
                                    <UIcon
                                        v-show="copiedProviderId"
                                        name="ic:baseline-check"
                                        class="w-4 h-4 text-green-500 transition-all duration-100"
                                /></span>
                            </div>
                        </div>
                        <div class="w-full flex justify-between flex-wrap">
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2">
                                <span class="text-gray-400">{{ $t('auditor.consumer') }}</span>
                                <span
                                    >{{ truncateId(selected.factoryBuyerName, 20) }}
                                    <UIcon
                                        name="mingcute:copy-line"
                                        class="w-4 h-4 cursor-pointer"
                                        @click="copyConsumer(selected.factoryBuyerName)" />
                                    <UIcon
                                        v-show="copiedConsumer"
                                        name="ic:baseline-check"
                                        class="w-4 h-4 text-green-500 transition-all duration-100"
                                /></span>
                            </div>
                            <div class="flex flex-col items-start gap-1 w-full lg:w-1/2 sm:mt-4 lg:mt-0">
                                <span class="text-gray-400">{{ $t('auditor.consumer') + ' ID' }}</span>
                                <span
                                    >{{ truncateId(selected.factoryBuyerId, 20) }}
                                    <UIcon
                                        name="mingcute:copy-line"
                                        class="w-4 h-4 cursor-pointer"
                                        @click="copyConsumerId(selected.factoryBuyerId)" />
                                    <UIcon
                                        v-show="copiedConsumerId"
                                        name="ic:baseline-check"
                                        class="w-4 h-4 text-green-500 transition-all duration-100"
                                /></span>
                            </div>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-400">{{ $t('auditor.terms') }}</span>
                            <div class="max-h-96 flex flex-col gap-2 overflow-y-scroll scrollbar pr-6">
                                <div
                                    class="prose lg:prose-sm prose-h2:text-center max-w-full"
                                    v-html="decodedTerms"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="w-full flex items-center justify-center text-gray-500">
                        {{ $t('auditor.noTransactionSelected') }}
                    </div>
                </UModal>
                <UCard>
                    <div class="w-full flex items-center justify-end">
                        <UInput
                            v-model="rawInput"
                            icon="i-heroicons-magnifying-glass-20-solid"
                            size="md"
                            color="white"
                            :trailing="false"
                            :placeholder="$t('auditor.inputMessage')"
                            class="w-64"
                        />
                    </div>

                    <UTable
                        v-model:sort="sortBy"
                        v-model:expand="expand"
                        :columns="columns"
                        :rows="rows"
                        :empty-state="{
                            icon: 'i-heroicons-circle-stack-20-solid',
                            label: $t('wallet.noTransactions'),
                        }"
                        :single-select="true"
                        :multiple-expand="true"
                        @select="select"
                    >
                        <template #expand="{ row }">
                            <div class="w-full p-4 flex flex-col text-sm text-gray-500 gap-2 justify-center ml-[200px]">
                                <span class="flex items-center gap-4 justify-between w-64">
                                    <span class="font-bold">{{
                                        R.isNil(row.transactionFee)
                                            ? `${row.amount.toFixed(2)} EUR`
                                            : `${(row.amount - row.transactionFee).toFixed(2)} EUR`
                                    }}</span>
                                    <span>{{ $t('auditor.amountToProvider') }}</span>
                                </span>
                                <span class="flex items-center gap-4 justify-between w-64">
                                    <span class="font-bold">{{
                                        R.isNil(row.transactionFee)
                                            ? `${0} EUR`
                                            : `${row.transactionFee?.toFixed(2)} EUR`
                                    }}</span>
                                    <span>{{ $t('auditor.transactionFee') }}</span>
                                </span>
                            </div>
                        </template>
                        <template #createdAt-data="{ row }">
                            <span v-if="row.createdAt" class="flex items-center justify-center">{{
                                $d(new Date(row.createdAt), 'short')
                            }}</span>
                            <span v-else>&mdash;</span>
                        </template>

                        <template #amount-data="{ row }">
                            <span class="flex items-center justify-center font-bold">
                                {{ row.amount.toFixed(2) }} EUR
                            </span>
                        </template>

                        <template #assetName-data="{ row }">
                            <span class="flex items-center justify-start">
                                <a
                                    :href="`https://pistis-market.eu/srv/catalog/datasets/${row.assetId}`"
                                    target="_blank"
                                    class="text-primary visited:text-primary-800"
                                >
                                    {{ row.assetName }}
                                </a>
                            </span>
                        </template>

                        <template #factorySellerName-data="{ row }">
                            <UTooltip
                                :text="row.factorySellerName"
                                :ui="{ width: 'max-w-lg' }"
                                :popper="{ placement: 'top' }"
                                class="flex items-center justify-center"
                            >
                                <span class="flex items-center justify-start">
                                    {{ truncateId(row.factorySellerName, 10) }}
                                </span>
                            </UTooltip>
                        </template>

                        <template #factoryBuyerName-data="{ row }">
                            <UTooltip
                                :text="row.factoryBuyerName"
                                :ui="{ width: 'max-w-lg' }"
                                :popper="{ placement: 'top' }"
                                class="flex items-center justify-center"
                            >
                                <span class="flex items-center justify-start">
                                    {{ truncateId(row.factoryBuyerName, 10) }}
                                </span>
                            </UTooltip>
                        </template>
                    </UTable>
                    <div class="flex justify-end mt-2">
                        <UPagination
                            v-model="page"
                            :page-count="10"
                            :total="totalCount"
                            :active-button="{ variant: 'outline' }"
                        />
                    </div>
                </UCard>
            </div>
        </PageContainer>
    </div>
</template>

<style scoped>
::v-deep tr td:first-child {
    width: 50px !important;
}
</style>
