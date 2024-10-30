import { getToken } from '#auth';

const {
    public: { marketplaceUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const id = getRouterParam(event, 'id');

    const response = await $fetch(`${marketplaceUrl}/srv/repo/datasets/${id}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response['@graph'];
});
