// FIXME: When we have actual data for transactions we can fix this request
const { _walletUrl, _walletAlias } = useRuntimeConfig();

export default defineEventHandler(async (_event) => {
    // const token = await getToken({ event });
    // const body = JSON.stringify({ wallet_alias: walletAlias });
    // return $fetch<any>(`${walletUrl}/transactions`, {
    //     method: 'GET',
    //     body,
    //     headers: {
    //         Authorization: `Bearer ${token?.access_token}`,
    //     },
    // });
});
