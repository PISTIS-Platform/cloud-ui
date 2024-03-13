export default defineI18nConfig(() => ({
    legacy: false,
    numberFormats: {
        en: {
            decimal: {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
            percent: {
                maximumFractionDigits: 2,
                maximumSignificantDigits: 3,
                style: 'percent',
                useGrouping: false,
            },
        },
    },
    messages: {
        en: {
            signIn: 'Sign In',
            signOut: 'Sign Out',
            dashboard: {
                dashboard: 'Dashboard',
                status: 'Status',
                resources: 'Resources',
            },
            registry: {
                registry: 'Factory Registry',
                info: '',
            },
            'usage-analytics': {
                'usage-analytics': 'Usage Analytics',
                overview: 'Overview',
                questionaries: 'Questionaries',
            },
            models: {
                models: 'Models Repository',
                overview: 'Contents',
                upload: 'Upload',
            },
        },
    },
}));
