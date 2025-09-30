import { getServerSession } from '#auth';
import { getToken } from '#auth';
import MonitoringCardsData from '~/interfaces/monitoring-cards-data';

const {
    public: { cloudUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.roles?.includes('PISTIS_ADMIN')) return [];

    const token = await getToken({ event });

    const users = await $fetch<Record<string, any>>(
        `${cloudUrl}/srv/identity-access-management/api/v1/info/users/count`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token?.access_token}`,
            },
        },
    );

    const monitoringCards: MonitoringCardsData[] = [
        {
            key: 'factories',
            amount: Object.keys(users.factories).length,
            change: 0,
        },
        {
            key: 'users',
            amount: users.total,
            change: 0,
        },
        {
            key: 'assets',
            amount: 3124,
            change: 278,
        },
    ];

    return monitoringCards;
});
