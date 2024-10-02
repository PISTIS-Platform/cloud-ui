import { getToken } from '#auth';

const { notificationsUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = await getToken({ event });

    return await $fetch(`${notificationsUrl}/${body.notificationId}/hide`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
