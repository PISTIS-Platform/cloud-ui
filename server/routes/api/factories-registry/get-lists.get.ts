import { getToken } from '#auth';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const countries = await $fetch(
        `${config.public.marketplaceUrl}/srv/identity-access-management/api/v1/ape/attributes/countries`,
        {
            headers: {
                Authorization: `Bearer ${token?.access_token}`,
            },
        },
    );

    const domains = await $fetch(
        `${config.public.marketplaceUrl}/srv/identity-access-management/api/v1/ape/attributes/domains`,
        {
            headers: {
                Authorization: `Bearer ${token?.access_token}`,
            },
        },
    );

    const sizes = await $fetch(
        `${config.public.marketplaceUrl}/srv/identity-access-management/api/v1/ape/attributes/sizes`,
        {
            headers: {
                Authorization: `Bearer ${token?.access_token}`,
            },
        },
    );

    const types = await $fetch(
        `${config.public.marketplaceUrl}/srv/identity-access-management/api/v1/ape/attributes/types`,
        {
            headers: {
                Authorization: `Bearer ${token?.access_token}`,
            },
        },
    );

    return {
        countries,
        domains,
        sizes,
        types,
    };
});
