export default defineNuxtRouteMiddleware(async (to) => {
    const { data: session } = useAuth();

    if (['factory-registration'].includes(to.name as string)) {
        return; // here this middleware will not execute anything with specific routes in the array.
    }

    if (session.value && !session.value.roles?.includes('PISTIS_ADMIN')) {
        return navigateTo('/factory-registration');
    }
});
