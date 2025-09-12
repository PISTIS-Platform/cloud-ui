import { getToken } from '#auth';

const {
    public: { cloudUrl },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const query = await getQuery(event);

    //FIXME: Replace with actual marketplace link
    const response = await $fetch(`${cloudUrl}/srv/search/datasets/${query.id}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return response;
});
