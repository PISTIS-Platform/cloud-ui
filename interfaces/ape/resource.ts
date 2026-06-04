export interface Resource {
    id: string;
    name: string;
    lifecycle?: string;
    type?: string;
    urn?: string;
    uri?: string;
    scopes?: string[];
}
