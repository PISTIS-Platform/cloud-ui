<script lang="ts" setup>
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekday from 'dayjs/plugin/weekday';
import { Bar } from 'vue-chartjs';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

const { t } = useI18n();

import type ComponentStatusData from '~/interfaces/component-status-data';
import type MonitoringCardsData from '~/interfaces/monitoring-cards-data';
import type UsageStatsData from '~/interfaces/usage-stats-data';
import type { TransactionsType } from '~/interfaces/wallet-transactions';

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

//data for component statuses
const { data: componentStatusData, pending: componentStatusLoading } = await useLazyFetch<ComponentStatusData[]>(
    '/api/dashboard/component-status',
);

//data for usage stats
const {
    data: usageStatsData,
    pending: usageStatsLoading,
    error: usageStatsError,
} = await useLazyFetch<UsageStatsData[]>('/api/dashboard/resource-usage');

const computedResourcesUsageStats = computed(() => {
    const iconsMapping: Record<string, string> = {
        cpu: 'ph:cpu',
        memory: 'material-symbols:memory-alt-outline-rounded',
        minio: 'simple-icons:minio',
        mongoDb: 'tabler:brand-mongodb',
        postgres: 'carbon:database-postgresql',
        elasticSearchAvg: 'tabler:brand-elastic',
    };

    return (usageStatsData?.value || []).map((item: UsageStatsData) => ({
        title: t(`dashboard.resources.usageStats.${item.key}`),
        percentage: item.percentage,
        icon: iconsMapping[item.key],
        tooltipInfo: item.extraInfo
            ? item.extraInfo.map((item: { key: string; value: number }) => ({
                  label: t(`dashboard.resources.usageStats.${item.key}`),
                  value: `${item.value} %`,
              }))
            : [],
    }));
});

//data for monitoring cards
const { data: monitoringCardsData, pending: monitoringCardsLoading } = await useLazyFetch<MonitoringCardsData[]>(
    '/api/dashboard/monitoring-cards',
);

const computedMonitoringCards = computed<MonitoringCardsData[]>(() => {
    const factories = monitoringCardsData.value?.find((item: MonitoringCardsData) => item.key === 'factories');
    const users = monitoringCardsData.value?.find((item: MonitoringCardsData) => item.key === 'users');
    const assets = monitoringCardsData.value?.find((item: MonitoringCardsData) => item.key === 'assets');

    return [
        {
            title: t('dashboard.resources.cardsFields.factories'),
            key: 'factories',
            amount: factories?.amount || 0,
            icon: 'material-symbols:factory',
            change: factories?.change || 0,
        },
        {
            title: t('dashboard.resources.cardsFields.users'),
            key: 'users',
            amount: users?.amount || 0,
            icon: 'mdi:user',
            change: users?.change || 0,
        },
        {
            title: t('dashboard.resources.cardsFields.assets'),
            key: 'assets',
            amount: assets?.amount || 0,
            icon: 'bxs:file',
            change: assets?.change || 0,
        },
    ];
});

const transactions: TransactionsType = await $fetch(`/api/wallet/transactions`, {
    method: 'post',
});

const weeklyTransactionsData = ref([0, 0, 0, 0, 0, 0, 0]);
const weeklyMoneyData = ref([0, 0, 0, 0, 0, 0, 0]);

if (transactions) {
    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');

    transactions.incoming.forEach((transaction) => {
        const transactionDate = dayjs(transaction.included_at);
        //Check if incoming transaction date is between the week
        if (transactionDate.isSameOrAfter(startOfWeek) && transactionDate.isSameOrBefore(endOfWeek)) {
            //Take the index of the day in the week
            const dayIndex = transactionDate.weekday();
            //Add transaction if the day is in the week
            weeklyTransactionsData.value[dayIndex] += 1;
            //Add the amount of the transaction if the day is in the week
            weeklyMoneyData.value[dayIndex] += transaction.payload.Basic.amount;
        }
    });

    transactions.outgoing.forEach((transaction) => {
        const transactionDate = dayjs(transaction.included_at);
        //Check if outgoing transaction date is between the week
        if (transactionDate.isSameOrAfter(startOfWeek) && transactionDate.isSameOrBefore(endOfWeek)) {
            //Take the index of the day in the week
            const dayIndex = transactionDate.weekday();
            //Add transaction if the day is in the week
            weeklyTransactionsData.value[dayIndex] += 1;
            //Add the amount of the transaction if the day is in the week
            weeklyMoneyData.value[dayIndex] += transaction.payload.Basic.amount;
        }
    });
}
//Weekly transactions bar chart
const computedWeeklyTransactionsData = computed(() => ({
    //TODO: Get weekdays automatically from i18n somehow
    labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: t('dashboard.resources.transactions'),
            backgroundColor: '#f87979',
            data: weeklyTransactionsData.value || [],
        },
    ],
}));
//Weekly money bar chart
const computedWeeklyMoneyData = computed(() => ({
    //TODO: Get weekdays automatically from i18n somehow
    labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'EUR',
            backgroundColor: '#f87979',
            data: weeklyMoneyData.value || [],
        },
    ],
}));
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <div class="flex flex-col w-full">
                <div class="grid grid-cols-2 gap-4 place-items-stretch">
                    <!-- Components statuses -->
                    <UCard :ui="{ base: 'w-full h-full' }">
                        <template #header>
                            <SubHeading :title="t('dashboard.resources.componentStatus')" />
                        </template>
                        <div v-if="!componentStatusLoading" class="flex w-full flex-col gap-4 overflow-y-scroll">
                            <StatusCard
                                v-for="item in componentStatusData"
                                :key="item.title"
                                :title="item.title"
                                :active="item.active"
                            />
                        </div>
                        <!--TODO: Currently using fixed number of skeleton elements based on number of components-->
                        <div v-if="componentStatusLoading" class="flex w-full flex-col gap-4 overflow-y-scroll">
                            <USkeleton v-for="item in new Array(10)" :key="item" class="h-7 w-full" />
                        </div>
                    </UCard>

                    <!-- Resources usage -->
                    <UCard :ui="{ base: 'w-full' }">
                        <template #header>
                            <SubHeading :title="t('dashboard.resources.resourceUsage')" />
                        </template>
                        <div v-if="!usageStatsLoading && !usageStatsError" class="grid grid-cols-2 w-full gap-6 mt-4">
                            <UsageCard
                                v-for="item in computedResourcesUsageStats"
                                :key="item.title"
                                :title="item.title || ''"
                                :icon="item.icon"
                                :percentage="item.percentage"
                                :tooltip-info="item.tooltipInfo"
                            />
                        </div>
                        <div v-else-if="!usageStatsLoading && usageStatsError">
                            <ErrorCard
                                :error-msg="
                                    usageStatsError?.statusMessage ??
                                    t('dashboard.resources.usageStats.errorInRetrievingCpuAndMemoryStats')
                                "
                            />
                        </div>
                        <div v-else class="grid grid-cols-2 w-full gap-6 mt-4">
                            <USkeleton v-for="item in new Array(6)" :key="item" class="h-20" />
                        </div>
                    </UCard>
                </div>

                <UCard class="mt-4">
                    <template #header>
                        <SubHeading :title="t('dashboard.resources.platformActivities')" />
                    </template>
                    <div v-if="!monitoringCardsLoading" class="flex w-full gap-4">
                        <MonitoringCard
                            v-for="card in computedMonitoringCards"
                            :key="card.title"
                            class="w-full"
                            :title="card.title || ''"
                            :amount="card.amount"
                            :icon="card.icon"
                            :change="card.change"
                        />
                    </div>
                    <div v-if="monitoringCardsLoading" class="flex w-full gap-4">
                        <USkeleton v-for="item in new Array(3)" :key="item" class="h-[84px] w-full" />
                    </div>
                    <div class="flex gap-8 mt-4 w-full">
                        <div v-if="!weeklyTransactionsLoading" class="w-full p-4">
                            <div>
                                <h3>{{ t('dashboard.resources.weeklyTransactions') }}</h3>
                                <Bar
                                    class="w-full h-full"
                                    :data="computedWeeklyTransactionsData"
                                    :options="chartOptions"
                                />
                            </div>
                        </div>
                        <USkeleton v-if="weeklyTransactionsLoading" class="w-full h-96" />
                        <div v-if="!weeklyMoneyLoading" class="w-full p-4">
                            <div class="w-full">
                                <h3 class="pl-4">{{ t('dashboard.resources.weeklyMoney') }}</h3>
                                <Bar class="w-full h-full" :data="computedWeeklyMoneyData" :options="chartOptions" />
                            </div>
                        </div>
                        <USkeleton v-if="weeklyMoneyLoading" class="w-full h-96" />
                    </div>
                </UCard>
            </div>
        </PageContainer>
    </div>
</template>
