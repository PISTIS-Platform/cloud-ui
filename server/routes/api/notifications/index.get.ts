import { getToken } from '#auth';

const {
    public: { marketplaceUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    return $fetch(`${marketplaceUrl}/srv/notifications/api/notifications`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
