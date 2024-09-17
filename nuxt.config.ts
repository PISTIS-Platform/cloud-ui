// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    telemetry: false,
    devtools: { enabled: true },
    alias: {
        cookie: 'cookie',
    },
    typescript: {
        strict: true,
        typeCheck: false, // Enabling this makes development slower, but performs proper type checking
    },
    nitro: {
        preset: 'node-server',
    },
    app: {
        head: {
            link: [{ rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }],
        },
    },
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],
    imports: {
        dirs: ['composables/**'],
    },
    runtimeConfig: {
        factoryRegistryURL: process.env.NUXT_FACTORY_REGISTRY_URL,
        authSecret: process.env.NUXT_NEXTAUTH_SECRET,
        intentionAnalyticsServerUrl: process.env.NUXT_INTENTION_ANALYTICS_SERVER_URL,
        modelsRepositoryUrl: process.env.NUXT_MODELS_REPOSITORY_URL,
        prometheusUrl: process.env.NUXT_PROMETHEUS_URL,
        walletUrl: process.env.NUXT_WALLET_URL,
        keycloak: {
            issuer: process.env.NUXT_KEYCLOAK_ISSUER,
            clientId: process.env.NUXT_KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.NUXT_KEYCLOAK_CLIENT_SECRET,
        },
    },
    modules: [
        '@pinia/nuxt', //
        '@nuxtjs/i18n',
        '@vueuse/nuxt',
        '@nuxt/ui',
        '@sidebase/nuxt-auth',
    ],

    // Modules Configuration
    i18n: {
        strategy: 'no_prefix',
        defaultLocale: 'en',
    },
    colorMode: {
        preference: 'light',
    },
    auth: {
        baseURL: '/_auth',
        provider: {
            type: 'authjs',
            defaultProvider: 'keycloak',
        },
        session: {
            enableRefreshPeriodically: false,
            enableRefreshOnWindowFocus: true,
        },
        globalAppMiddleware: {
            isEnabled: true,
        },
    },
});
