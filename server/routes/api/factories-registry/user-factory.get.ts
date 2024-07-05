import { getToken } from '#auth';

const { factoryRegistryURL } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    const dummyResponse = {
        id: '768004e7-33b1-4248-bafe-04688f49f161',
        organizationName: 'TestOrg',
        organizationId: '8aff8e9b-1322-4395-a53e-c445d159eb80',
        factoryPrefix: 'test-prefix',
        ip: '192.168.1.1',
        // ip: null,
        country: 'Greece',
        status: 'live',
        isAccepted: false,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    console.log(token);
    console.log(factoryRegistryURL);

    // const response = await $fetch(`${factoryRegistryURL}/factories/user-factory`, {
    //     headers: {
    //         Authorization: `Bearer ${token?.access_token}`,
    //     },
    // });

    return dummyResponse;
});
