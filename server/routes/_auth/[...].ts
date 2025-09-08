import { jwtDecode } from 'jwt-decode';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { NuxtAuthHandler } from '#auth';

declare module 'next-auth/jwt' {
    interface JWT {
        id_token?: string;
        provider?: string;
        refresh_token?: string;
        access_token?: string;
        expires_at?: number;
    }
}

declare module 'next-auth' {
    interface Session {
        roles?: string[];
    }
}

const { authSecret, keycloak } = useRuntimeConfig();

const PistisRoles = ['PISTIS_ADMIN'];

const getPistisRoles = (profile: any) => {
    return profile.realm_access.roles.filter((role: string) => PistisRoles.includes(role)) || [];
};

const getUserOrgId = (profile: any) => {
    return profile.pistis?.group?.id || '';
};

const getUserSub = (profile: any) => {
    return profile.sub || '';
};

const getUserPrefix = (profile: any) => {
    if (profile.pistis.user.role?.includes('PISTIS_ADMIN')) {
        return '';
    }
    return profile.pistis.group.prefix;
};

export const authOptions = {
    secret: authSecret,
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some poin
        KeycloakProvider.default({
            issuer: keycloak.issuer,
            clientId: keycloak.clientId,
            clientSecret: keycloak.clientSecret,
        }),
    ],
    callbacks: {
        jwt: async ({ token, account, user }: any) => {
            if (account && user) {
                token.access_token = account.access_token;
                token.roles = getPistisRoles(jwtDecode(account.access_token));
                token.orgId = getUserOrgId(jwtDecode(account.access_token));
                token.sub = getUserSub(jwtDecode(account.access_token));
                token.prefix = getUserPrefix(jwtDecode(account.access_token));
            }

            return Promise.resolve(token);
        },
        session: async ({ session, token }: any) => {
            // If token contains error, return clear session to force the browser to go through the authentication process again
            if (token?.error === 'RefreshAccessTokenError') return Promise.resolve(null);

            session.roles = token.roles;
            session.orgId = token.orgId;
            session.user = {
                sub: token.sub,
                prefix: token.prefix,
            };

            return Promise.resolve(session);
        },
    },
    events: {
        async signOut({ token }: any) {
            if (token.provider === 'keycloak') {
                const logOutUrl = new URL(`${keycloak.issuer}/protocol/openid-connect/logout`);
                logOutUrl.searchParams.append('id_token_hint', token.id_token!);
                await fetch(logOutUrl);
            }
        },
    },
};

export default NuxtAuthHandler(authOptions);
