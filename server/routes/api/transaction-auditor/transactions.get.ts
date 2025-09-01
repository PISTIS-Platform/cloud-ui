import { getToken } from '#auth';

const { transactionAuditorUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const query = getQuery(event);

    return $fetch(`${transactionAuditorUrl}/api/transactions-auditor?page=${query.page}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
