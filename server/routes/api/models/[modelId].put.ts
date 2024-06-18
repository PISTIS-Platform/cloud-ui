import { getToken } from '#auth';

const { modelsRepositoryUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const modelId = getRouterParam(event, 'modelId');
    const body = await readBody(event);

    return await $fetch(`${modelsRepositoryUrl}/models/${modelId}`, {
        method: 'PUT',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
