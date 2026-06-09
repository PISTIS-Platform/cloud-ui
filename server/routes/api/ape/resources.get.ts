import type { Resource } from '~/interfaces/ape/resource';

interface KeycloakResource {
    _id?: string;
    id?: string;
    name: string;
    uris?: string[];
    attributes?: Record<string, string[] | string>;
    scopes?: { id?: string; name: string }[];
}

function firstValue(value?: string[] | string): string | undefined {
    if (Array.isArray(value)) return value[0];
    return value ?? undefined;
}

function mapResource(resource: KeycloakResource): Resource {
    const attributes = resource.attributes || {};
    return {
        id: resource._id ?? resource.id ?? '',
        name: resource.name,
        // real PISTIS resources only carry these attributes: userId, userName, description, lifeCycle.
        // uri/type/urn are not stored on the Keycloak resource, so they remain undefined.
        uri: Array.isArray(resource.uris) ? resource.uris[0] : undefined,
        lifecycle: firstValue(attributes.lifeCycle ?? attributes.lifecycle),
        type: firstValue(attributes.type),
        urn: firstValue(attributes.urn),
        scopes: (resource.scopes || []).map((scope) => scope.name),
    };
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = ((query.search as string) || '').toLowerCase();

    const resources = await apeFetch<KeycloakResource[]>(event, '/ape/resources');

    let mapped = (resources || []).map(mapResource);

    if (search) {
        mapped = mapped.filter(
            (resource) =>
                resource.name?.toLowerCase().includes(search) ||
                resource.urn?.toLowerCase().includes(search),
        );
    }

    const start = (page - 1) * limit;
    return {
        data: mapped.slice(start, start + limit),
        total: mapped.length,
    };
});
