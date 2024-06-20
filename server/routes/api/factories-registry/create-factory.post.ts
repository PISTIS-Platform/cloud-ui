import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const body = await readBody(event);
    let responseToSend;

    await $fetch(`${factoryRegistryURL}/factories`, {
        async onResponse({ response }) {
            responseToSend = response;
        },
        method: 'POST',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return responseToSend;
});
