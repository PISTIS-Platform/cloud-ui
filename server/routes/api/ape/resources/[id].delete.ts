export default defineEventHandler((event) =>
    apeFetch(event, `/ape/resources/${getRouterParam(event, 'id')}`, { method: 'DELETE' }),
);
