export default defineEventHandler((event) =>
    apeFetch(event, `/ape/policies/${getRouterParam(event, 'id')}`, { method: 'DELETE' }),
);
