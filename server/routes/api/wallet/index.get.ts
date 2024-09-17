import { getToken } from '#auth';
import { Transaction } from '~/interfaces/wallet-table';

const { walletUrl } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    return await $fetch<Transaction[]>(`${walletUrl}`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });
});
