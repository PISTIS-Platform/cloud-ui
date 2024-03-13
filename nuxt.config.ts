// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    telemetry: false,
    devtools: { enabled: true },
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
    modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@vueuse/nuxt', '@nuxt/ui'],

    // Modules Configuration
    i18n: {
        strategy: 'no_prefix',
        defaultLocale: 'en',
    },
    colorMode: {
        preference: 'light',
    },
});
