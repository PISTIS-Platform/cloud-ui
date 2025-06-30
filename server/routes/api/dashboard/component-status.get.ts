import * as R from 'ramda';

const config = useRuntimeConfig();

import { getServerSession, getToken } from '#auth';
import ComponentStatusData from '~/interfaces/component-status-data';

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.roles?.includes('PISTIS_ADMIN')) return [];
    const token = await getToken({ event });

    const services = {
        'Data Quality Assessment': '/srv/data-quality-assessment',
        'Distributed Query': '/srv/distributed-query',
        Blockchain: '/srv/payments',
        'Factories Registry': '/srv/factories-registry',
        'Intention Analytics': '/srv/intention-analytics',
        'Lineage Tracker': '/srv/lineage-tracker and /srv/lt-ui',
        'Models Repository': '/srv/models-repository',
        'Smart Contract Execution Engine': '/srv/smart-contract-execution-engine',
    };

    //TODO: See if all elements will have '/api/health' like ours or not

    const componentStatusPromises = Object.keys(services).map(async (key: string) => {
        let active = false;
        const url = `${config.public.marketplaceUrl}${services[key]}/api/health`.replace('//', '/');
        try {
            const result = await $fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token?.access_token}`,
                },
            });

            if (result?.status === 'ok') {
                active = true;
            }
        } catch (error) {
            console.error(`Error fetching health for ${key}:`, error);
        } finally {
            return {
                title: key,
                active,
            };
        }
    });

    const componentStatuses: ComponentStatusData[] = await Promise.all(componentStatusPromises);

    const sortByTitle = R.sortBy(R.compose(R.toLower, R.prop('title')));

    return sortByTitle(componentStatuses);
});
