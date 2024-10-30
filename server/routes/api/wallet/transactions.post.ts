import { getServerSession, getToken } from '#auth';

const {
    public: { marketplaceUrl },
    walletAlias,
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.roles?.includes('PISTIS_ADMIN')) return { incoming: [], outgoing: [] };
    const token = await getToken({ event });
    const body = JSON.stringify({ wallet_alias: walletAlias });

    return $fetch<any>(`${marketplaceUrl}/srv/payments/v0/dlt/transactions`, {
        method: 'POST',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
