import { z } from 'zod';

export const usePolicySchema = () => {
    const { t } = useI18n();

    const scopeValues = ['EDIT', 'READ', 'DELETE', 'TRADE'] as const;
    const policyTypeValues = [
        'organization',
        'organization-attributes',
        'organization-user',
        'resource-attributes',
        'time-based',
    ] as const;

    const basePolicySchema = z.object({
        name: z.string().min(3, t('validation.atLeastNumberChars', { count: 3 })),
        description: z.string().optional(),
        resourceId: z.string().min(1, t('validation.required')),
        scopes: z.array(z.enum(scopeValues)).min(1, t('ape.policies.atLeastOneScope')),
        type: z.enum(policyTypeValues),
    });

    const organizationPolicySchema = basePolicySchema.extend({
        type: z.literal('organization'),
        groupIds: z.array(z.string()).min(1, t('ape.policies.atLeastOneGroup')),
    });

    const organizationAttributesPolicySchema = basePolicySchema.extend({
        type: z.literal('organization-attributes'),
        attributes: z.object({
            country: z.string().optional(),
            domain: z.string().optional(),
            size: z.string().optional(),
            type: z.string().optional(),
        }),
    });

    const organizationUserPolicySchema = basePolicySchema.extend({
        type: z.literal('organization-user'),
        userIds: z.array(z.string()).min(1, t('ape.policies.atLeastOneUser')),
        roles: z.array(z.string()).optional(),
    });

    const resourceAttributesPolicySchema = basePolicySchema.extend({
        type: z.literal('resource-attributes'),
        resourceAttributes: z
            .array(
                z.object({
                    key: z.string().min(1, t('validation.required')),
                    value: z.string().min(1, t('validation.required')),
                }),
            )
            .min(1, t('ape.policies.atLeastOneAttribute')),
    });

    const timeBasedPolicySchema = basePolicySchema.extend({
        type: z.literal('time-based'),
        timeRange: z.object({
            startTime: z.string().min(1, t('validation.required')),
            endTime: z.string().min(1, t('validation.required')),
            daysOfWeek: z.array(z.number().min(0).max(6)).min(1, t('ape.policies.atLeastOneDay')),
        }),
    });

    const policyTypeOptions = [
        {
            value: 'organization',
            label: t('ape.policies.types.organization'),
            to: '/ape/policies/create/organization',
        },
        {
            value: 'organization-attributes',
            label: t('ape.policies.types.organizationAttributes'),
            to: '/ape/policies/create/organization-attributes',
        },
        {
            value: 'organization-user',
            label: t('ape.policies.types.organizationUser'),
            to: '/ape/policies/create/organization-user',
        },
        {
            value: 'resource-attributes',
            label: t('ape.policies.types.resourceAttributes'),
            to: '/ape/policies/create/resource-attributes',
        },
        {
            value: 'time-based',
            label: t('ape.policies.types.timeBased'),
            to: '/ape/policies/create/time-based',
        },
    ];

    const scopeOptions = [
        { value: 'EDIT', label: 'EDIT' },
        { value: 'READ', label: 'READ' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'TRADE', label: 'TRADE' },
    ];

    const daysOfWeekOptions = [
        { value: 0, label: t('ape.policies.days.sunday') },
        { value: 1, label: t('ape.policies.days.monday') },
        { value: 2, label: t('ape.policies.days.tuesday') },
        { value: 3, label: t('ape.policies.days.wednesday') },
        { value: 4, label: t('ape.policies.days.thursday') },
        { value: 5, label: t('ape.policies.days.friday') },
        { value: 6, label: t('ape.policies.days.saturday') },
    ];

    return {
        basePolicySchema,
        organizationPolicySchema,
        organizationAttributesPolicySchema,
        organizationUserPolicySchema,
        resourceAttributesPolicySchema,
        timeBasedPolicySchema,
        policyTypeOptions,
        scopeOptions,
        daysOfWeekOptions,
    };
};
