import { getToken } from '#auth';

const { investmentPlannerUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const body = await readBody(event);
    const query = await getQuery(event);

    console.log(factoryRegistryURL);
    //FIXME: Replace with URL for deployed version

    return $fetch(`${investmentPlannerUrl}/update/${query.investmentId}`, {
        method: 'PUT',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
