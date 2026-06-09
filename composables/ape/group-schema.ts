import { z } from 'zod';

export const useGroupSchema = () => {
    const { t } = useI18n();

    const groupSchema = z.object({
        name: z.string().min(3, t('validation.atLeastNumberChars', { count: 3 })),
        prefix: z
            .string()
            .min(2, t('validation.atLeastNumberChars', { count: 2 }))
            .max(20, t('validation.moreThanNumberChars', { count: 20 }))
            .regex(/^[a-z0-9-]+$/, t('ape.organizations.prefixFormat')),
        country: z.string().optional(),
        domain: z.string().optional(),
        size: z.string().optional(),
        type: z.string().optional(),
    });

    return {
        groupSchema,
    };
};
