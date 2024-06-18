import { getToken } from '#auth';

const { modelsRepositoryUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const query = getQuery(event);

    const response = await $fetch(`${modelsRepositoryUrl}/models/${query.id}/download`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
