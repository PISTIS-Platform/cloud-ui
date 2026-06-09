import { getToken } from '#auth';

const {
    public: { cloudUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    return $fetch(`${cloudUrl}/srv/notifications/api/notifications/user/read-all`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
