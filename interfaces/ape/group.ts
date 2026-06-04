export interface GroupAttributes {
    country?: string;
    domain?: string;
    size?: string;
    type?: string;
}

export interface Group {
    id: string;
    name: string;
    prefix: string;
    attributes?: GroupAttributes;
}

export interface GroupTableRow extends Group {
    country?: string;
    domain?: string;
    size?: string;
    type?: string;
}
