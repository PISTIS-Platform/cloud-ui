export default defineEventHandler((event) =>
    apeFetch(event, `/ape/users/${getRouterParam(event, 'id')}`),
);
