import { getToken } from '#auth';

const { dataInvestmentPlannerUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const query = getQuery(event);

    const response = await $fetch(`${dataInvestmentPlannerUrl}/retrieve/${query.cloudAssetId}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
