export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    return apeFetch(event, `/ape/groups/${id}`, { method: 'PUT', body });
});
