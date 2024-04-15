import { getToken } from '#auth';

const { intentionAnalyticsServerUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = await getToken({ event });

    return await $fetch(`${intentionAnalyticsServerUrl}/questionnaire/${body.id}/${body.version}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
