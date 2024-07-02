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
import { Bar } from 'vue-chartjs';

const { t } = useI18n();

import type ComponentStatusData from '~/interfaces/component-status-data';
import type MonitoringCardsData from '~/interfaces/monitoring-cards-data';
import type UsageStatsData from '~/interfaces/usage-stats-data';

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
const { data: usageStatsData, pending: usageStatsLoading } = await useLazyFetch<{
    cpuAndMemoryStats: UsageStatsData[];
    diskUsageStats: UsageStatsData[];
}>('/api/dashboard/resource-usage');

const computedCpuAndMemoryStats = computed(() => {
    const stats = usageStatsData.value?.cpuAndMemoryStats || [];

    return stats.map((item: UsageStatsData) => ({
        title: t(`dashboard.resources.usageStats.${item.key}`),
        percentage: item.percentage,
    }));
});

const computedDiskUsageStats = computed(() => {
    const stats = usageStatsData.value?.diskUsageStats || [];

    return stats.map((item: UsageStatsData) => ({
        title: t(`dashboard.resources.usageStats.${item.key}`),
        percentage: item.percentage,
    }));
});

// const computedUsageStats = computed(() => {
//     const cpuUsage = usageStatsData.value?.find((item: UsageStatsData) => item.key === 'cpuUsage');
//     const diskUtilisation = usageStatsData.value?.find((item: UsageStatsData) => item.key === 'diskUtilisation');
//     const memoryUtilisation = usageStatsData.value?.find((item: UsageStatsData) => item.key === 'memoryUtilisation');

//     return [
//         {
//             title: t('dashboard.resources.usageStats.cpuUsage'),
//             key: 'cpuUsage',
//             used: cpuUsage?.used || 0,
//             total: cpuUsage?.total || 0,
//             measurement: t('dashboard.resources.usageStats.cores'),
//         },
//         {
//             title: t('dashboard.resources.usageStats.diskUtilisation'),
//             key: 'diskUtilisation',
//             used: diskUtilisation?.used || 0,
//             total: diskUtilisation?.total || 0,
//             measurement: 'GB',
//         },
//         {
//             title: t('dashboard.resources.usageStats.memoryUtilisation'),
//             key: 'memoryUtilisation',
//             used: memoryUtilisation?.used || 0,
//             total: memoryUtilisation?.total || 0,
//             measurement: 'GB',
//         },
//     ];
// });

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

//data for weekly transactions bar chart
const { data: weeklyTransactionsData, pending: weeklyTransactionsLoading } = await useLazyFetch(
    '/api/dashboard/weekly-transactions',
);

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

//data for weekly money bar chart
const { data: weeklyMoneyData, pending: weeklyMoneyLoading } = await useLazyFetch('/api/dashboard/weekly-money');

const computedWeeklyMoneyData = computed(() => ({
    //TODO: Get weekdays automatically from i18n somehow
    labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'STC',
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
                    <UCard :ui="{ base: 'w-full' }">
                        <template #header>
                            <SubHeading :title="t('dashboard.resources.componentStatus')" />
                        </template>
                        <div
                            v-if="!componentStatusLoading"
                            class="flex w-full flex-col h-[510px] gap-10 overflow-y-scroll"
                        >
                            <StatusCard
                                v-for="item in componentStatusData"
                                :key="item.title"
                                :title="item.title"
                                :active="item.active"
                            />
                        </div>
                        <!--TODO: Currently using fixed number of skeleton elements based on number of components-->
                        <div
                            v-if="componentStatusLoading"
                            class="flex w-full flex-col h-[510px] gap-10 overflow-y-scroll"
                        >
                            <USkeleton
                                v-for="item in new Array(componentStatusData?.length)"
                                :key="item"
                                class="h-7 w-full"
                            />
                        </div>
                    </UCard>
                    <div class="flex flex-col gap-6 h-full">
                        <!-- CPU and Memory usage -->
                        <UCard
                            :ui="{
                                strategy: 'override',
                                base: 'flex flex-col',
                                body: { base: 'flex flex-col flex-1' },
                            }"
                        >
                            <template #header>
                                <SubHeading :title="t('dashboard.resources.usageStats.cpuAndMemory')" />
                            </template>
                            <div v-if="!usageStatsLoading" class="flex flex-col flex-1 justify-between">
                                <UsageCard
                                    v-for="item in computedCpuAndMemoryStats"
                                    :key="item.title"
                                    :title="item.title || ''"
                                    :percentage="item.percentage"
                                />
                            </div>
                            <div v-if="usageStatsLoading" class="flex flex-col flex-1 justify-between">
                                <USkeleton
                                    v-for="item in new Array(computedCpuAndMemoryStats.length)"
                                    :key="item"
                                    class="h-16 w-full"
                                />
                            </div>
                        </UCard>

                        <!-- Disk Usage -->
                        <UCard
                            :ui="{
                                strategy: 'override',
                                base: 'flex flex-col',
                                body: { base: 'flex flex-col flex-1' },
                            }"
                        >
                            <template #header>
                                <SubHeading :title="t('dashboard.resources.usageStats.disk')" />
                            </template>
                            <div v-if="!usageStatsLoading" class="flex flex-col flex-1 justify-between">
                                <UsageCard
                                    v-for="item in computedDiskUsageStats"
                                    :key="item.title"
                                    :title="item.title || ''"
                                    :percentage="item.percentage"
                                />
                            </div>
                            <div v-if="usageStatsLoading" class="flex flex-col flex-1 justify-between">
                                <USkeleton
                                    v-for="item in new Array(computedDiskUsageStats.length)"
                                    :key="item"
                                    class="h-16 w-full"
                                />
                            </div>
                        </UCard>
                    </div>
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
