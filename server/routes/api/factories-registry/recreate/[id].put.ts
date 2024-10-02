import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const organizationId = getRouterParam(event, 'id');

    return $fetch(`${factoryRegistryURL}/factories/recreate/${organizationId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
