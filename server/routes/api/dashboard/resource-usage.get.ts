import UsageStatsData from '~/interfaces/usage-stats-data';

export default defineEventHandler(async () => {
    const cpuAndMemoryStats: UsageStatsData[] = [
        {
            key: 'cpuUsage',
            used: 4.25,
            total: 8,
            percentage: 56.6,
        },
        {
            key: 'memoryUtilisation',
            used: 15,
            total: 32,
            percentage: 14.9,
        },
    ];

    const diskUsageStats: UsageStatsData[] = [
        {
            key: 'mongoDb',
            percentage: 95.6,
        },
        {
            key: 'elasticSearch',
            percentage: 13.9,
        },
        {
            key: 'postgres',
            percentage: 29.5,
        },
    ];

    return {
        cpuAndMemoryStats,
        diskUsageStats,
    };
});
