import { getToken } from '#auth';

const { metadataUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const id = getRouterParam(event, 'id');

    const response = await $fetch(`${metadataUrl}${id}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response['@graph'];
});
