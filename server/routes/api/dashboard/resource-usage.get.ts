import UsageStatsData from '~/interfaces/usage-stats-data';

export default defineEventHandler(async () => {
    const usageStats: UsageStatsData[] = [
        {
            key: 'cpuUsage',
            used: 4.25,
            total: 8,
        },
        {
            key: 'diskUtilisation',
            used: 109,
            total: 127,
        },
        {
            key: 'memoryUtilisation',
            used: 15,
            total: 32,
        },
    ];

    return usageStats;
});
