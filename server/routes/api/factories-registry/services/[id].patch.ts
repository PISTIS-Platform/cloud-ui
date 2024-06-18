import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    const response = await $fetch(`${factoryRegistryURL}/factories/${id}/services`, {
        method: 'PATCH',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
