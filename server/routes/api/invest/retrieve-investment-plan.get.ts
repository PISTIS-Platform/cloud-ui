import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const query = getQuery(event);
    console.log(factoryRegistryURL);

    //FIXME: Replace with deployed version
    const response = await $fetch(`http://localhost:3030/api/investment-planner/retrieve/${query.cloudAssetId}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
