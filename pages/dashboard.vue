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
import { z } from 'zod';

import type FactoryModelRepo from '~/interfaces/factories-model';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

const { t } = useI18n();

const { data: session } = useAuth();

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
const { data: componentStatusData, status: componentStatusStatus } = useLazyFetch<ComponentStatusData[]>(
    '/api/dashboard/component-status',
);

//data for usage stats
const {
    execute: executeUsageStats,
    data: usageStatsData,
    status: usageStatsStatus,
    error: usageStatsError,
} = await useLazyFetch<UsageStatsData[]>('/api/dashboard/resource-usage', {
    server: false,
    immediate: false,
    retry: false,
});

if (session.value?.roles?.includes('PISTIS_ADMIN')) {
    executeUsageStats();
}

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
const { data: monitoringCardsData, status: monitoringCardsStatus } = useLazyFetch<MonitoringCardsData[]>(
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

const currentBalance = ref();
const startOfWeek = dayjs().startOf('week');
const endOfWeek = dayjs().endOf('week');

const transformTransactions = (transactions: Record<string, any>[]) => {
    transactions.forEach((transaction: Record<string, any>) => {
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
};

//NOTE: Using 'nested' API calls due to partner's restriction about parallel calls to wallet not being possible
const { status: transactionsStatus } = useLazyFetch(`api/wallet/transactions`, {
    method: 'POST',
    async onResponse({ response }) {
        const transactions: TransactionsType = response._data;
        if (transactions.incoming.length && transactions.outgoing.length) {
            transformTransactions(transactions.incoming);
            transformTransactions(transactions.outgoing);
        }

        if (!session?.value?.roles?.includes('PISTIS_ADMIN')) {
            const data = await $fetch(`api/wallet/balance`, {
                method: 'POST',
            });
            currentBalance.value = data;
        }
    },
});

const weeklyTransactionsData = ref([0, 0, 0, 0, 0, 0, 0]);
const weeklyMoneyData = ref([0, 0, 0, 0, 0, 0, 0]);

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

//Top cards for simple user
const cardInfoData = computed(() => [
    {
        title: t('balance'),
        iconName: 'i-heroicons-currency-dollar-20-solid',
        amount: currentBalance.value?.dlt_amount,
    },
]);

//Factory registration

const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const R = useRamda();

const schemaState = reactive({
    publicIP: '',
});

const schema = z.object({
    publicIP: z
        .string()
        .min(1, t('required'))
        .ip({ version: 'v4', message: t('registry.registration.invalidIP') }),
});

const downloadingInstructions = ref(false);
const downloadingConfigurations = ref(false);
const submittingIP = ref(false);

const {
    execute: executeUserFactory,
    data: userFactory,
    error: userFactoryError,
    status: userFactoryStatus,
} = useLazyFetch<FactoryModelRepo>(`/api/factories-registry/user-factory`, {
    server: false,
    immediate: false,
    retry: false,
    onResponse({ response }) {
        schemaState.publicIP = response._data.ip;
    },
});

if (!session.value?.roles?.includes('PISTIS_ADMIN')) {
    executeUserFactory();
}

const downloadInstructions = async () => {
    downloadingInstructions.value = true;

    try {
        await useDownloadFile(`/api/factories-registry/download-instructions`, 'test.txt');
    } catch (error) {
        showErrorMessage(t('registry.registration.errorInDownloadingInstructions'));
    } finally {
        downloadingInstructions.value = false;
    }
};

const downloadConfigurations = async () => {
    downloadingConfigurations.value = true;

    try {
        await useDownloadFile(`/api/factories-registry/download-keycloak-clients`, 'keycloak-clients.yaml');
    } catch (error) {
        showErrorMessage(t('registry.registration.errorInDownloadingConfigurations'));
    } finally {
        downloadingConfigurations.value = false;
    }
};

const submitIP = async () => {
    if (!schema.safeParse(schemaState).success) {
        return;
    }
    submittingIP.value = true;

    try {
        await $fetch(`api/factories-registry/setip`, {
            method: 'PUT',
            body: { ip: schemaState.publicIP },
        });

        showSuccessMessage(t('registry.IPUpdated'));
    } catch (error) {
        showErrorMessage(t('registry.IPSubmitError'));
    } finally {
        submittingIP.value = false;
    }
};
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <div v-if="session?.roles?.includes('PISTIS_ADMIN')" class="flex flex-col w-full">
                <div class="grid grid-cols-2 gap-4 place-items-stretch">
                    <!-- Components statuses -->
                    <UCard :ui="{ base: 'w-full h-full' }">
                        <template #header>
                            <SubHeading :title="t('dashboard.resources.componentStatus')" />
                        </template>
                        <div
                            v-if="componentStatusStatus !== 'pending'"
                            class="flex w-full flex-col gap-4 overflow-y-scroll"
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
                            v-if="componentStatusStatus === 'pending'"
                            class="flex w-full flex-col gap-4 overflow-y-scroll"
                        >
                            <USkeleton
                                v-for="item in new Array(10)"
                                :key="item"
                                :ui="{ background: 'bg-gray-200' }"
                                class="h-7 w-full"
                            />
                        </div>
                    </UCard>

                    <!-- Resources usage -->
                    <UCard :ui="{ base: 'w-full' }">
                        <template #header>
                            <SubHeading :title="t('dashboard.resources.resourceUsage')" />
                        </template>
                        <div
                            v-if="usageStatsStatus !== 'pending' && !usageStatsError"
                            class="grid grid-cols-2 w-full gap-6 mt-4"
                        >
                            <UsageCard
                                v-for="item in computedResourcesUsageStats"
                                :key="item.title"
                                :title="item.title || ''"
                                :icon="item.icon"
                                :percentage="item.percentage"
                                :tooltip-info="item.tooltipInfo"
                            />
                        </div>
                        <div v-else-if="usageStatsStatus !== 'pending' && usageStatsError">
                            <ErrorCard
                                :error-msg="
                                    usageStatsError?.statusMessage ??
                                    t('dashboard.resources.usageStats.errorInRetrievingCpuAndMemoryStats')
                                "
                            />
                        </div>
                        <div v-else class="grid grid-cols-2 w-full gap-6 mt-4">
                            <USkeleton
                                v-for="item in new Array(6)"
                                :key="item"
                                :ui="{ background: 'bg-gray-200' }"
                                class="h-20"
                            />
                        </div>
                    </UCard>
                </div>

                <UCard class="mt-4">
                    <template #header>
                        <SubHeading :title="t('dashboard.resources.platformActivities')" />
                    </template>
                    <div v-if="monitoringCardsStatus !== 'pending'" class="flex w-full gap-4">
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
                    <div v-if="monitoringCardsStatus === 'pending'" class="flex w-full gap-4">
                        <USkeleton
                            v-for="item in new Array(3)"
                            :key="item"
                            :ui="{ background: 'bg-gray-200' }"
                            class="h-[84px] w-full"
                        />
                    </div>

                    <div class="flex gap-8 mt-4 w-full">
                        <div v-if="transactionsStatus !== 'pending'" class="w-full p-4">
                            <div>
                                <h3>{{ t('dashboard.resources.weeklyTransactions') }}</h3>
                                <Bar
                                    class="w-full h-full"
                                    :data="computedWeeklyTransactionsData"
                                    :options="chartOptions"
                                />
                            </div>
                        </div>
                        <USkeleton
                            v-if="transactionsStatus === 'pending'"
                            :ui="{ background: 'bg-gray-200' }"
                            class="w-full h-96"
                        />
                        <div v-if="transactionsStatus !== 'pending'" class="w-full p-4">
                            <div class="w-full">
                                <h3 class="pl-4">{{ t('dashboard.resources.weeklyMoney') }}</h3>
                                <Bar class="w-full h-full" :data="computedWeeklyMoneyData" :options="chartOptions" />
                            </div>
                        </div>
                        <USkeleton
                            v-if="transactionsStatus === 'pending'"
                            :ui="{ background: 'bg-gray-200' }"
                            class="w-full h-96"
                        />
                    </div>
                </UCard>
            </div>

            <!-- Non-admin starts here-->
            <div v-else class="flex flex-col w-full">
                <div class="w-full flex justify-end mb-6">
                    <WalletCard
                        v-for="card in cardInfoData"
                        :key="card.title"
                        class="w-full md:w-1/3"
                        :title="card.title"
                        :amount="card.amount"
                        :icon-name="card.iconName"
                        :status="transactionsStatus"
                    />
                </div>
                <ErrorCard
                    v-if="userFactoryError && userFactoryStatus !== 'pending'"
                    :error-msg="t('registry.registration.errorWhileRetrievingUserFactory')"
                />
                <USkeleton
                    v-else-if="userFactoryStatus === 'pending'"
                    :ui="{ background: 'bg-gray-200' }"
                    class="w-full h-96"
                />
                <UCard v-else :ui="{ base: 'w-full text-gray-700' }">
                    <template #header>
                        <SubHeading :title="`${t('registry.registration.title')}`" />
                    </template>
                    <div class="w-full flex flex-col gap-4">
                        <p class="text-gray-500">{{ t('registry.registration.welcome') }}</p>
                        <div class="flex w-full justify-between items-center flex-wrap xl:flex-nowrap">
                            <span class="flex gap-4 whitespace-nowrap">
                                <span class="text-lg font-bold">1.</span>
                                <span>{{ t('registry.registration.downloadInstructions') }}</span>
                            </span>
                            <UTooltip
                                :text="t('registry.registration.downloadInstructions')"
                                :ui="{ width: 'max-w-2xl text-center' }"
                            >
                                <UButton
                                    class="w-28 flex justify-center disabled:opacity-40"
                                    size="lg"
                                    :disabled="downloadingInstructions"
                                    @click="downloadInstructions"
                                    >{{ t('download') }}</UButton
                                >
                            </UTooltip>
                        </div>

                        <div class="flex w-full justify-between items-center flex-wrap xl:flex-nowrap">
                            <span class="flex gap-4 whitespace-nowrap">
                                <span class="text-lg font-bold">2.</span>
                                <span>{{ t('registry.registration.downloadConfig') }}</span>
                            </span>
                            <UTooltip
                                :text="t('registry.registration.downloadConfig')"
                                :ui="{ width: 'max-w-2xl text-center' }"
                            >
                                <UButton
                                    class="w-28 flex justify-center disabled:opacity-40"
                                    size="lg"
                                    :disabled="downloadingConfigurations"
                                    @click="downloadConfigurations"
                                    >{{ t('download') }}</UButton
                                >
                            </UTooltip>
                        </div>

                        <div class="flex w-full justify-between items-center gap-4 xl:gap-16 flex-wrap md:flex-nowrap">
                            <span class="flex gap-4 whitespace-nowrap">
                                <span class="text-lg font-bold">3.</span>
                                <span>{{ t('registry.registration.defineIP') }}</span>
                            </span>
                            <UForm
                                :schema="schema"
                                :state="schemaState"
                                class="space-y-5 w-full flex items-end justify-end"
                                @submit="submitIP"
                            >
                                <div class="flex items-start gap-4 w-4/5">
                                    <UFormGroup class="w-full" required name="publicIP">
                                        <UInput
                                            v-model="schemaState.publicIP"
                                            :ui="{ base: 'disabled:bg-gray-100' }"
                                            class="w-full"
                                            size="lg"
                                            :placeholder="t('registry.registration.enterIP')"
                                            :disabled="!R.isNil(userFactory?.ip) && !R.isEmpty(userFactory?.ip)"
                                        />
                                    </UFormGroup>
                                    <UButton
                                        :key="schemaState.publicIP"
                                        class="w-28 flex justify-center"
                                        size="lg"
                                        type="submit"
                                        :disabled="
                                            (!R.isNil(userFactory?.ip) && !R.isEmpty(userFactory?.ip)) || submittingIP
                                        "
                                        @click="submitIP"
                                        >{{ t('submit') }}</UButton
                                    >
                                </div>
                            </UForm>
                        </div>
                    </div>
                </UCard>
            </div>
        </PageContainer>
    </div>
</template>
