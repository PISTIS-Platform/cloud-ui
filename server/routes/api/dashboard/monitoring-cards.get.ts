import MonitoringCardsData from '~/interfaces/monitoring-cards-data';

export default defineEventHandler(async () => {
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
