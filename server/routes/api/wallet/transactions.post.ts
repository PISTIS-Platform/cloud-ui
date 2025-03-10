import { getServerSession, getToken } from '#auth';
import { walletAliasObject } from '~/constants/walletAliases';

const {
    public: { marketplaceUrl },
} = useRuntimeConfig();

//FIXME: Replace with proper service once it's ready
export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session?.roles?.includes('PISTIS_ADMIN')) return { incoming: [], outgoing: [] };
    const walletKey = 'pistis-admin';
    const body = JSON.stringify({ wallet_alias: walletAliasObject[walletKey].alias });
    const token = await getToken({ event });

    return $fetch<any>(`${marketplaceUrl}/srv/payments/v0/dlt/transactions`, {
        method: 'POST',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
