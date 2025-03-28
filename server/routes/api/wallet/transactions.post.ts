import { getServerSession, getToken } from '#auth';

const {
    public: { marketplaceUrl },
    adminWalletAlias,
} = useRuntimeConfig();

//FIXME: Replace with proper service once it's ready
export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.roles?.includes('PISTIS_ADMIN')) return { incoming: [], outgoing: [] };

    const body = JSON.stringify({ wallet_alias: adminWalletAlias });
    const token = await getToken({ event });

    const transactions = await $fetch<any>(`${marketplaceUrl}/srv/payments/v0/dlt/transactions`, {
        method: 'POST',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return transactions;
});
