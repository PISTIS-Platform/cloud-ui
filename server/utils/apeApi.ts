import { getToken } from '#auth';
import type { H3Event } from 'h3';

interface ApeFetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    query?: Record<string, unknown>;
}

/**
 * Thin proxy to the PISTIS Identity Management (APE) API. Forwards the caller's bearer token and
 * surfaces upstream errors as-is — there is intentionally no mock fallback, so misconfiguration,
 * auth failures and backend errors are visible instead of being silently masked.
 */
export async function apeFetch<T = unknown>(
    event: H3Event,
    path: string,
    options: ApeFetchOptions = {},
): Promise<T> {
    const { identityManagementUrl } = useRuntimeConfig();

    if (!identityManagementUrl) {
        throw createError({
            statusCode: 500,
            statusMessage: 'identityManagementUrl is not configured (set NUXT_IDENTITY_MANAGEMENT_URL)',
        });
    }

    const token = await getToken({ event });
    if (!token?.access_token) {
        throw createError({ statusCode: 401, statusMessage: 'Not authenticated' });
    }

    try {
        return await $fetch<T>(`${identityManagementUrl}${path}`, {
            method: options.method,
            body: options.body,
            query: options.query,
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
        });
    } catch (err: any) {
        throw createError({
            statusCode: err?.statusCode ?? err?.response?.status ?? 502,
            statusMessage: err?.statusMessage ?? err?.response?.statusText ?? 'APE API request failed',
            data: err?.data ?? err?.response?._data,
        });
    }
}
