import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const id = getRouterParam(event, 'id');

    const response = await $fetch(`${factoryRegistryURL}/factories/services/${id}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
