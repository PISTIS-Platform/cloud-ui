const { factoryRegistryURL } = useRuntimeConfig();
import { getToken } from '#auth';

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const response = await $fetch(`${factoryRegistryURL}/factories`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
