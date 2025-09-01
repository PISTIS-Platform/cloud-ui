import { getToken } from '#auth';

const { transactionAuditorUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    return $fetch(`${transactionAuditorUrl}/api/transactions-auditor`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
