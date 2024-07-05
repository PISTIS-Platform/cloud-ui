import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    return $fetch(`${factoryRegistryURL}/factories/download-keycloak-clients`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
