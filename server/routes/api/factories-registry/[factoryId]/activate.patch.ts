import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const factoryId = getRouterParam(event, 'factoryId');

    return $fetch(`${factoryRegistryURL}/factories/${factoryId}/activate`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
