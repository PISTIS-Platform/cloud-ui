export default defineNuxtRouteMiddleware(async (to) => {
    const { data } = useAuth();

    if (['factory-registration'].includes(to.name as string)) {
        return; // here this middleware will not execute anything with specific routes in the array.
    }

    if (data.value && data.value.role !== 'admin') {
        return navigateTo('/factory-registration');
    }
});
