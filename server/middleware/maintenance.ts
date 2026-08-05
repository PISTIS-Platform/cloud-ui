// PISTIS demo infrastructure transition — remove when NUXT_PUBLIC_MAINTENANCE_MODE is retired.
// Blocks the Keycloak sign-in flow at the server level, so pasting the auth URL directly or
// replaying a stale callback cannot mint a session. /_auth/session, /_auth/csrf and /_auth/signout
// must stay open: useAuth() needs them to report status and to sign existing sessions out.
export default defineEventHandler((event) => {
    if (!useRuntimeConfig(event).public.maintenanceMode) return;

    if (event.path.startsWith('/_auth/signin') || event.path.startsWith('/_auth/callback')) {
        return sendRedirect(event, '/', 302);
    }
});
