import { getToken } from '#auth';

const { modelsRepositoryUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const body = await readFormData(event);
    const token = await getToken({ event });

    return $fetch(`${modelsRepositoryUrl}/models`, {
        method: 'POST',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
