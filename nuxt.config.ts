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

    // nitro: {
    //     preset: 'node-server',
    //     experimental: {
    //         websocket: true,
    //     },
    // },

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
        public: {
            marketplaceUrl: '',
        },
        authSecret: '',
        keycloak: {
            issuer: '',
            clientId: '',
            clientSecret: '',
        },
        factoryRegistryURL: '',
        intentionAnalyticsServerUrl: '',
        modelsRepositoryUrl: '',
        prometheusUrl: '',
        identityManagementUrl: '',
        adminWalletAlias: '',
    },

    modules: [
        '@pinia/nuxt', //
        '@nuxtjs/i18n',
        '@vueuse/nuxt',
        '@nuxt/ui',
        '@sidebase/nuxt-auth',
        'nuxt-pdfmake',
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
            enableRefreshPeriodically: true,
            enableRefreshOnWindowFocus: true,
        },
        globalAppMiddleware: {
            isEnabled: true,
        },
    },

    compatibilityDate: '2024-09-19',
});
