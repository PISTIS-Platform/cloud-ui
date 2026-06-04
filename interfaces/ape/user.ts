export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    groupId: string;
    groupName?: string;
    status: UserStatus;
    type: UserType;
}

export type UserStatus = 'active' | 'inactive' | 'pending';

export type UserType = 'PISTIS_ADMIN' | 'PISTIS_ORG_ADMIN' | 'PISTIS_USER' | 'APE_ADMIN';
