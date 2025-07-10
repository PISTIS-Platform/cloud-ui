import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const body = await readBody(event);
    const query = await getQuery(event);

    console.log(factoryRegistryURL);
    //FIXME: Replace with URL for deployed version

    return $fetch(`http://localhost:3030/api/investment-planner/update/${query.investmentId}`, {
        method: 'PUT',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
