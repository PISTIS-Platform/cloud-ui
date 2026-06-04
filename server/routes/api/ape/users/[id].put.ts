export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    return apeFetch(event, `/ape/users/${id}`, { method: 'PUT', body });
});
