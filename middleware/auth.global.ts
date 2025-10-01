export default defineNuxtRouteMiddleware(async (to) => {
    const { data: session, signOut, status } = useAuth();
    const allowedRoutes = ['/', '/dashboard', '/notifications', '/wallet', '/factory-creation'];

    if (to.path !== '/' && (!session.value || status.value !== 'authenticated')) {
        signOut({ callbackUrl: '/' });
    }

    if (!allowedRoutes.includes(to.path) && !session.value?.roles?.includes('PISTIS_ADMIN')) {
        return navigateTo('/dashboard');
    }
});
