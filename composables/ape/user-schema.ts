import { z } from 'zod';

export const useUserSchema = () => {
    const { t } = useI18n();

    const userStatusValues = ['active', 'inactive', 'pending'] as const;
    const userTypeValues = ['PISTIS_ADMIN', 'PISTIS_ORG_ADMIN', 'PISTIS_USER', 'APE_ADMIN'] as const;

    const userSchema = z.object({
        firstName: z.string().min(2, t('validation.atLeastNumberChars', { count: 2 })),
        lastName: z.string().min(2, t('validation.atLeastNumberChars', { count: 2 })),
        email: z.string().email(t('validation.validValue', { name: 'email' })),
        groupId: z.string().min(1, t('validation.required')),
        status: z.enum(userStatusValues, {
            errorMap: () => ({ message: t('validation.validValue', { name: 'status' }) }),
        }),
        type: z.enum(userTypeValues, {
            errorMap: () => ({ message: t('validation.validValue', { name: 'type' }) }),
        }),
    });

    const statusOptions = [
        { value: 'active', label: t('ape.users.statuses.active') },
        { value: 'inactive', label: t('ape.users.statuses.inactive') },
        { value: 'pending', label: t('ape.users.statuses.pending') },
    ];

    const typeOptions = [
        { value: 'PISTIS_ADMIN', label: t('ape.users.types.PISTIS_ADMIN') },
        { value: 'PISTIS_ORG_ADMIN', label: t('ape.users.types.PISTIS_ORG_ADMIN') },
        { value: 'PISTIS_USER', label: t('ape.users.types.PISTIS_USER') },
        { value: 'APE_ADMIN', label: t('ape.users.types.APE_ADMIN') },
    ];

    return {
        userSchema,
        statusOptions,
        typeOptions,
    };
};
