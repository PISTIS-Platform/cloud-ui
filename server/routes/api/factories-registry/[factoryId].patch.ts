const { factoryRegistryURL } = useRuntimeConfig();
import { getToken } from '#auth';

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const factoryId = getRouterParam(event, 'factoryId');
    const accept = await readBody(event);

    const response = await $fetch(`${factoryRegistryURL}/factories/${factoryId}/${accept.acceptance}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
