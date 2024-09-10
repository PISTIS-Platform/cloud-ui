import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const organizationId = getRouterParam(event, 'id');

    const response = await $fetch(`${factoryRegistryURL}/factories/recreate/${organizationId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
