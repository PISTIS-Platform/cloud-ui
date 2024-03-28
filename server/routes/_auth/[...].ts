import KeycloakProvider from 'next-auth/providers/keycloak';

import { NuxtAuthHandler } from '#auth';

declare module 'next-auth/jwt' {
    interface JWT {
        id_token?: string;
        access_token?: string;
        provider?: string;
    }
}

const { authSecret, keycloak } = useRuntimeConfig();

const validKeycloakRoles = ['admin'];

const getKeycloakRole = (profile: any) => {
    //getting the retrieved user roles
    const keycloakRoles = (profile as any).roles;

    //return keycloak roles based on the available roles
    return keycloakRoles.find((role: string) => validKeycloakRoles.includes(role)) || null;
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
        jwt: async ({ token, account, profile }: any) => {
            if (account) {
                token.id_token = account.id_token;
                token.provider = account.provider;
                token.access_token = account.access_token;
                token.role = getKeycloakRole(profile);
            }

            return Promise.resolve(token);
        },
        session: async ({ session, token }: any) => {
            (session as any).role = token.role;
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
