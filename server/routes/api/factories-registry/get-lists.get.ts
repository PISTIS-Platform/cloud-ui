import { getToken } from '#auth';

const { identityManagementUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const countries = await $fetch(`${identityManagementUrl}/ape/attributes/countries`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    const domains = await $fetch(`${identityManagementUrl}/ape/attributes/domains`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    const sizes = await $fetch(`${identityManagementUrl}/ape/attributes/sizes`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    const types = await $fetch(`${identityManagementUrl}/ape/attributes/types`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return {
        countries,
        domains,
        sizes,
        types,
    };
});
