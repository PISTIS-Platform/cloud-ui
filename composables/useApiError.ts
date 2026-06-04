/**
 * Extracts a human-readable message from an error thrown by `$fetch`/`useFetch`.
 *
 * Nuxt server routes proxying the APE API rethrow the upstream error via `createError`, so the
 * backend `ErrorResponseDTO` ({ ts, code, message, error }) ends up nested under `error.data.data`.
 * Falls back through the other common shapes, then to the provided default.
 */
export function getApiErrorMessage(error: any, fallback?: string): string | undefined {
    return (
        error?.data?.data?.message ??
        error?.data?.message ??
        error?.statusMessage ??
        error?.message ??
        fallback
    );
}
