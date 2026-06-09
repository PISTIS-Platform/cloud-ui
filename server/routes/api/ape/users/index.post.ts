export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    return apeFetch(event, '/ape/users', { method: 'POST', body });
});
