export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    return apeFetch(event, '/ape/groups', { method: 'POST', body });
});
