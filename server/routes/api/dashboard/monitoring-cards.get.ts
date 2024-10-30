import { getServerSession } from '#auth';
import MonitoringCardsData from '~/interfaces/monitoring-cards-data';

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.roles?.includes('PISTIS_ADMIN')) return [];
    const monitoringCards: MonitoringCardsData[] = [
        {
            key: 'factories',
            amount: 30,
            change: 2,
        },
        {
            key: 'users',
            amount: 123,
            change: 11,
        },
        {
            key: 'assets',
            amount: 3124,
            change: 278,
        },
    ];

    return monitoringCards;
});
