import { getToken } from '#auth';

const { transactionAuditorUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });
    const query = getQuery(event);

    const filter = query.searchString ? `&filter[assetName]=$ilike:${query.searchString}` : '';

    return $fetch(
        `${transactionAuditorUrl}/transactions-auditor?page=${query.page}&sortBy=property[${query.sortByColumn}];direction[${query.sortByDirection}]` +
            filter,
        {
            headers: {
                Authorization: `Bearer ${token?.access_token}`,
            },
        },
    );
});
