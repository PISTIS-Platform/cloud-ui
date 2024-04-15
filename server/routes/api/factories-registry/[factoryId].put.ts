import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const factoryId = getRouterParam(event, 'factoryId');
    const body = await readBody(event);

    const response = await $fetch(`${factoryRegistryURL}/factories/${factoryId}`, {
        method: 'PUT',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
