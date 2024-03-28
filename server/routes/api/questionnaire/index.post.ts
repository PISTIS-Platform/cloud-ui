const { intentionAnalyticsServerUrl } = useRuntimeConfig();
import { getToken } from '#auth';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = await getToken({ event });

    return await $fetch(`${intentionAnalyticsServerUrl}/questionnaire`, {
        method: 'POST',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
