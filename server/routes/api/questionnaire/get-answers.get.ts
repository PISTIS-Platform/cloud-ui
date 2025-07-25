import { getToken } from '#auth';

const { intentionAnalyticsServerUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const token = await getToken({ event });

    return $fetch(`${intentionAnalyticsServerUrl}/questionnaire/${query.assetId}/answers`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
