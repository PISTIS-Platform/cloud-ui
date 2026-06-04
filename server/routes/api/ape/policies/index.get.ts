export default defineEventHandler((event) => apeFetch(event, '/ape/policies', { query: getQuery(event) }));
