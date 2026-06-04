export type PolicyType =
    | 'organization'
    | 'organization-attributes'
    | 'organization-user'
    | 'resource-attributes'
    | 'time-based';

export type PolicyScope = 'EDIT' | 'READ' | 'DELETE' | 'TRADE';

export interface BasePolicy {
    id?: string;
    name: string;
    description?: string;
    resourceId: string;
    resourceName?: string;
    scopes: PolicyScope[];
    type: PolicyType;
}

export interface OrganizationPolicy extends BasePolicy {
    type: 'organization';
    groupIds: string[];
}

export interface OrganizationAttributesPolicy extends BasePolicy {
    type: 'organization-attributes';
    attributes: {
        country?: string;
        domain?: string;
        size?: string;
        type?: string;
    };
}

export interface OrganizationUserPolicy extends BasePolicy {
    type: 'organization-user';
    userIds: string[];
    roles?: string[];
}

export interface ResourceAttributesPolicy extends BasePolicy {
    type: 'resource-attributes';
    resourceAttributes: {
        key: string;
        value: string;
    }[];
}

export interface TimeBasedPolicy extends BasePolicy {
    type: 'time-based';
    timeRange: {
        startTime: string;
        endTime: string;
        daysOfWeek: number[];
    };
}

export type Policy =
    | OrganizationPolicy
    | OrganizationAttributesPolicy
    | OrganizationUserPolicy
    | ResourceAttributesPolicy
    | TimeBasedPolicy;
