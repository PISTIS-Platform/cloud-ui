export default defineNuxtRouteMiddleware(async (to) => {
    const { data: session, signOut, status } = useAuth();

    if (to.path !== '/' && (!session.value || status.value !== 'authenticated')) {
        signOut({ callbackUrl: '/' });
    }
});
