import { getToken } from '#auth';

const {
    public: { marketplaceUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    return $fetch(`${marketplaceUrl}/srv/notifications/api/notifications/count`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
