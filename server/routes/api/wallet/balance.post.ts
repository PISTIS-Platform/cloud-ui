import { getServerSession, getToken } from '#auth';

const { adminWalletAlias } = useRuntimeConfig();
//FIXME: Replace with proper service once it's ready

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    const walletAlias = session?.roles?.includes('PISTIS_ADMIN') ? adminWalletAlias : session?.user?.prefix;
    if (!walletAlias) return 0;
    const body = JSON.stringify({ wallet_alias: walletAlias });
    const token = await getToken({ event });
    const url =
        walletAlias === adminWalletAlias ? 'https://pistis-market.eu' : `https://${walletAlias}.pistis-market.eu`;

    return $fetch<any>(`${url}/srv/payments/v0/dlt/wallets/balance`, {
        method: 'POST',
        body,
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
