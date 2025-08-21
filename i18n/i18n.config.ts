import en from './locales/en';

export default defineI18nConfig(() => {
    return {
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
        datetimeFormats: {
            en: {
                short: {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                },
            },
        },
        messages: {
            en,
        },
    };
});
