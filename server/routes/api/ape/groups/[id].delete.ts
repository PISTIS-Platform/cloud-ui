export default defineEventHandler((event) =>
    apeFetch(event, `/ape/groups/${getRouterParam(event, 'id')}`, { method: 'DELETE' }),
);
