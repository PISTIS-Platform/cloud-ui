const { intentionAnalyticsServerUrl } = useRuntimeConfig();
import { getToken } from '#auth';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const token = await getToken({ event });

    return await $fetch(`${intentionAnalyticsServerUrl}/questionnaire/${query.id}/${query.version}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
