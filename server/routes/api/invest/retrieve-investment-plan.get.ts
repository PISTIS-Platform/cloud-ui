import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const query = getQuery(event);

    const response = await $fetch(`${factoryRegistryURL}/srv/investment-planner/retrieve/${query.cloudAssetId}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
