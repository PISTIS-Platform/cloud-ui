import { getToken } from '#auth';

const { modelsRepositoryUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const modelId = getRouterParam(event, 'modelId');

    return $fetch(`${modelsRepositoryUrl}/models/${modelId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
