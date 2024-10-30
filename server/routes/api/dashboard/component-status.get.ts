import * as R from 'ramda';

import { getServerSession } from '#auth';
import ComponentStatusData from '~/interfaces/component-status-data';

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.roles?.includes('PISTIS_ADMIN')) return [];

    const componentStatuses: ComponentStatusData[] = [
        {
            title: 'Data Exchange Governance',
            active: true,
        },
        {
            title: 'Data Explorer',
            active: false,
        },
        {
            title: 'Monetary Transactions Facility',
            active: true,
        },
        {
            title: 'Asset Offering Designer',
            active: true,
        },
        {
            title: 'Monetization XAI Engine',
            active: false,
        },
        {
            title: 'Models Repository',
            active: true,
        },
        {
            title: 'System Services',
            active: false,
        },
        {
            title: 'Identity Manager',
            active: false,
        },
    ];

    const sortByTitle = R.sortBy(R.compose(R.toLower, R.prop('title')));

    return sortByTitle(componentStatuses);
});
