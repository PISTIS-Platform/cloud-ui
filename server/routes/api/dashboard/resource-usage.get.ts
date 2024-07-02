import { PrometheusDriver } from 'prometheus-query';

const { prometheusUrl } = useRuntimeConfig();

import UsageStatsData from '~/interfaces/usage-stats-data';

const getPrometheusResult = async (q: string, percentageMultiplier = 100) => {
    const prom = new PrometheusDriver({
        endpoint: prometheusUrl,
        baseURL: '/api/v1', // default value
    });

    const result: Record<string, any> = await prom.instantQuery(q).then((res) => {
        return res.result;
    });

    return Number((result[0].value.value * percentageMultiplier).toFixed(2));
};

const getDiskUsageByVolume = async (volume: string, percentageMultiplier: number = 100) => {
    const q = `max without(instance,node) (
(
  topk(1, kubelet_volume_stats_capacity_bytes{job="kubelet", metrics_path="/metrics", namespace="default", persistentvolumeclaim="${volume}"})
  -
  topk(1, kubelet_volume_stats_available_bytes{job="kubelet", metrics_path="/metrics", namespace="default", persistentvolumeclaim="${volume}"})
)
/
topk(1, kubelet_volume_stats_capacity_bytes{job="kubelet", metrics_path="/metrics", namespace="default", persistentvolumeclaim="${volume}"})
* 100)`;

    return await getPrometheusResult(q, percentageMultiplier);
};

export default defineEventHandler(async () => {
    //CPU percentage
    const cpuQuery =
        'sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{namespace="default"}) / sum(kube_pod_container_resource_requests{job="kube-state-metrics", namespace="default", resource="cpu"})';

    const cpuPercentage = await getPrometheusResult(cpuQuery);

    //Memory utilisation percentage
    const memoryUtilisationQuery =
        'sum(container_memory_working_set_bytes{job="kubelet", metrics_path="/metrics/cadvisor", namespace="default",container!="", image!=""}) / sum(kube_pod_container_resource_requests{job="kube-state-metrics", namespace="default", resource="memory"})';

    const memoryUtilisationPercentage = await getPrometheusResult(memoryUtilisationQuery);

    const cpuAndMemoryStats: UsageStatsData[] = [
        {
            key: 'cpuUsage',
            used: 4.25,
            total: 8,
            percentage: cpuPercentage,
        },
        {
            key: 'memoryUtilisation',
            used: 15,
            total: 32,
            percentage: memoryUtilisationPercentage,
        },
    ];

    //Disk Usage Stats

    //Minio & Postgres
    const minioUsagePercentage = await getDiskUsageByVolume('minio', 1);
    const mongoDbUsagePercentage = await getDiskUsageByVolume('datadir-mongodb-0', 1);
    const postgresUsagePercentage = await getDiskUsageByVolume('postgresql-1', 1);

    //Elasticsearch Instances
    const esInstance1Percentage = await getDiskUsageByVolume('elasticsearch-data-elasticsearch-es-default-0', 1);
    const esInstance2Percentage = await getDiskUsageByVolume('elasticsearch-data-elasticsearch-es-default-1', 1);
    const esInstance3Percentage = await getDiskUsageByVolume('elasticsearch-data-elasticsearch-es-default-2', 1);

    const elasticSearchInstancesStats: UsageStatsData[] = [
        {
            key: 'esInstance1',
            percentage: esInstance1Percentage,
        },
        {
            key: 'esInstance2',
            percentage: esInstance2Percentage,
        },
        {
            key: 'esInstance3',
            percentage: esInstance3Percentage,
        },
    ];

    //Elasticsearch average percentage
    const elasticSearchAvgPercentage = Number(
        ((esInstance1Percentage + esInstance2Percentage + esInstance3Percentage) / 3).toFixed(2),
    );

    //General disk usage stats
    const diskUsageStats: UsageStatsData[] = [
        {
            key: 'minio',
            percentage: minioUsagePercentage,
        },
        {
            key: 'mongoDb',
            percentage: mongoDbUsagePercentage,
        },
        {
            key: 'postgres',
            percentage: postgresUsagePercentage,
        },
        {
            key: 'elasticSearchAvg',
            percentage: elasticSearchAvgPercentage,
        },
    ];

    return {
        cpuAndMemoryStats,
        diskUsageStats,
        elasticSearchInstancesStats,
    };
});
