export const routeRoles: Record<string, string[]> = {
    '/': [],
    '/dashboard': [],
    '/notifications': [],
    '/wallet': [],
    '/factory-creation': [],
    '/factory-registry': ['PISTIS_ADMIN'],
    '/models': ['PISTIS_ADMIN'],
    '/usage-analytics': ['PISTIS_ADMIN'],
    '/transaction-auditor': ['PISTIS_ADMIN'],
    '/ape': ['PISTIS_ADMIN'],
};

export function getRolesForPath(path: string): string[] | null {
    // exact match
    if (path in routeRoles) {
        return routeRoles[path];
    }

    // check parent paths (for nested routes that are not explicitly included)
    // remove empty/falsy strings
    const segments = path.split('/').filter(Boolean);

    // check backwards from more specific to more generic parent
    for (let i = segments.length; i > 0; i--) {
        const parentPath = '/' + segments.slice(0, i).join('/');
        if (parentPath in routeRoles) {
            return routeRoles[parentPath];
        }
    }

    return null;
}

export default defineNuxtRouteMiddleware(async (to) => {
    const { data: session, signOut, status } = useAuth();
    const requiredRoles = getRolesForPath(to.path);

    if (to.path !== '/' && (!session.value || status.value !== 'authenticated')) {
        signOut({ callbackUrl: '/' });
    }

    if (requiredRoles === null) return;

    if (requiredRoles.length > 0) {
        const userRoles = session.value?.roles || [];
        const hasRequiredRoles = requiredRoles.some((role) => userRoles.includes(role));

        if (!hasRequiredRoles) {
            return navigateTo('/dashboard');
        }
    }
});
