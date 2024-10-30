import { getToken } from '#auth';

const {
    public: { marketplaceUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = await getToken({ event });

    return $fetch(`${marketplaceUrl}/srv/notifications/api/notifications/${body.notificationId}/read`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
