import * as R from 'ramda';

const config = useRuntimeConfig();

import { getServerSession, getToken } from '#auth';
import ComponentStatusData from '~/interfaces/component-status-data';

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.roles?.includes('PISTIS_ADMIN')) return [];
    const token = await getToken({ event });

    const services = {
        'Distributed Query': [],
        Blockchain: [],
        'Factories Registry': ['/srv/factories-registry/api/health'],
        'Intention Analytics': ['/srv/intention-analytics/api/health'],
        'Lineage Tracker': [],
        'Models Repository': ['/srv/models-repository/api/health'],
        'Smart Contract Execution Engine': ['/srv/smart-contract-execution-engine/ready'],
        'DLT FIAT Wallet': [],
        'Identity Access Management': [],
        Notifications: ['/srv/notifications/api/health'],
        'Factory Data Catalog': ['/srv/catalog'],
    };

    //TODO: See if all elements will have '/api/health' like ours or not

    const componentStatusPromises = Object.entries(services).map(async ([key, value]: [string, string[]]) => {
        let active = 'false';
        const url = `${config.public.marketplaceUrl}${value}`;
        if (value.length === 0) {
            return {
                title: key,
                active: 'N/A',
            };
        }

        if (key === 'Factory Data Catalog') {
            const repo = await $fetch(`${config.public.marketplaceUrl}/srv/repo/health`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token?.access_token}`,
                },
                timeout: 5000,
            });
            const search = await $fetch(`${config.public.marketplaceUrl}/srv/search/health`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token?.access_token}`,
                },
                timeout: 5000,
            });

            if (repo?.status === 'UP' && search?.status === 'UP') {
                active = 'true';
            }
            return {
                title: key,
                active,
            };
        } else {
            try {
                const result = await $fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token?.access_token}`,
                    },
                    timeout: 5000,
                });
                if (result?.success) {
                    active = 'true';
                } else if (result?.status.toLowerCase() === 'ok') {
                    active = 'true';
                }
            } catch (error) {
                console.error(`Error fetching health for ${key}:`, error);
            } finally {
                return {
                    title: key,
                    active,
                };
            }
        }
    });

    const componentStatuses: ComponentStatusData[] = await Promise.all(componentStatusPromises);

    const sortByTitle = R.sortBy(R.compose(R.toLower, R.prop('title')));

    return sortByTitle(componentStatuses);
});
