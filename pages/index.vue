<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
    auth: false,
    layout: 'home',
});

const callbackUrl = '/dashboard';

const { status, signIn, signOut, data: session } = useAuth();

const navigation: { name: string; to: string; icon?: string; roles: string[] }[] = [
    { name: 'dashboard.dashboard', to: '/dashboard', roles: [] },
    { name: 'registry.registry', to: '/factory-registry', roles: ['PISTIS_ADMIN'] },
    { name: 'usage-analytics.usage-analytics', to: '/usage-analytics', roles: ['PISTIS_ADMIN'] },
    { name: 'models.models', to: '/models', roles: ['PISTIS_ADMIN'] },
    { name: 'auditor.title', to: '/transaction-auditor', roles: ['PISTIS_ADMIN'] },
];

const userNavigation: { name: string; to: string; icon?: string; roles: string[] }[] = [
    { name: 'home', to: 'dashboard', icon: '', roles: [] },
];

const features = [
    {
        title: 'Feature 1',
        description: 'Sell your data assets and retrieve value',
        icon: 'material-symbols:sell-outline',
    },
    {
        title: 'Feature 2',
        description: 'Find data assets to buy',
        icon: 'icon-park-outline:buy',
    },
    {
        title: 'Feature 3',
        description: 'Check and improve the value of your data asset',
        icon: 'carbon:data-quality-definition',
    },
    {
        title: 'Feature 4',
        description: 'Transform data assets into market-ready bundles',
        icon: 'mdi:package-variant-plus',
    },
    {
        title: 'Feature 5',
        description: 'Peer-to-Peer data transfer with no intermediaries',
        icon: 'hugeicons:peer-to-peer-01',
    },
    {
        title: 'Feature 6',
        description: 'Monitor proper data usage based on license agreements',
        icon: 'icon-park-outline:agreement',
    },
    {
        title: 'Feature 7',
        description: 'Track the evolution and lineage of data operations',
        icon: 'carbon:ibm-cloud-pak-manta-automated-data-lineage',
    },
    {
        title: 'Feature 8',
        description: 'Monitor the evolution of the data market',
        icon: 'icon-park-outline:stock-market',
    },
];

const isModalOpen = ref(false);
</script>

<template>
    <div class="w-full h-full bg-cover flipped" style="background-image: url('/img/data-share.png')">
        <div class="bg-primary-950/90 flipped">
            <nav
                aria-label="Global"
                class="relative flex flex-row sm:items-center justify-between px-8 sm:px-8 2xl:px-36 py-6"
            >
                <!-- Left Menu -->
                <div class="flex flex-row space-x-10 items-center gap-2">
                    <div class="sm:w-full md:w-auto">
                        <NuxtLink :to="'/'" class="flex-shrink-0">
                            <img class="h-12 w-36 sm:h-16 sm:w-60" src="/img/PISTIS_logo_white.png" alt="PISTIS logo" />
                        </NuxtLink>
                    </div>
                    <div v-if="status === 'authenticated'">
                        <NuxtLink
                            v-for="page in session?.roles?.includes('PISTIS_ADMIN') ? navigation : userNavigation"
                            :key="page.to"
                            :to="page.to"
                            class="flex-shrink-0 rounded-md text-white text-lg hover:bg-primary-600 py-2 px-4 transition-all"
                            >{{ $t(page.name) }}
                            <UIcon v-if="page.icon" :name="page.icon" class="w-4 h-4 text-white-500" />
                        </NuxtLink>
                    </div>
                </div>
                <!-- Sign In button -->
                <div v-if="status !== 'authenticated'" class="flex gap-4">
                    <button
                        class="items-center px-6 py-2 text-white hover:bg-gray-100 border border-neutral-200 hover:text-primary-900 rounded-md cursor-pointer transition-all"
                        @click="isModalOpen = !isModalOpen"
                    >
                        Register
                    </button>
                    <button
                        class="items-center px-6 py-2 text-primary-950 bg-primary-600 text-white border border-transparent rounded-md hover:text-primary-900 hover:bg-gray-100 cursor-pointer transition-all"
                        @click="signIn('keycloak', { callbackUrl })"
                    >
                        Sign In
                    </button>
                </div>
                <!-- Sign out button-->
                <div v-if="status === 'authenticated'" class="flex">
                    <button
                        class="inline-flex items-center px-6 py-2 text-primary-950 bg-primary-600 text-white border border-transparent rounded-md hover:text-primary-900 hover:bg-gray-100 cursor-pointer transition-all"
                        @click="signOut({ callbackUrl: '/' })"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>
            <div
                class="flex flex-col sm:flex-row items-center justify-center sm:justify-between w-full mt-20 gap-12 sm:gap-12 2xl:gap-0 px-8 sm:px-16 2xl:px-48"
            >
                <div class="relative flex flex-col items-center sm:items-start justify-center space-y-6">
                    <h2 class="text-white text-center sm:text-left tracking-wide font-bold text-4xl xl:text-5xl">
                        PISTIS - Your sharing data platform
                    </h2>
                    <p
                        class="font-normal text-center sm:text-left tracking-wide text-lg lg:text-xl max-w-2xl sm:max-w-4xl text-white"
                    >
                        PISTIS allows member organisations to sell and buy data, opening up new revenue streams through
                        the monetisation of data assets. Using the PISTIS infrastructure, organisations can improve the
                        quality of their in-house data, and place them on the market, though different revenue
                        mechanisms to enjoy monetary benefits via secure and privacy aware data sharing modes.
                    </p>
                    <!-- Pistis website redirect button -->
                    <div class="flex gap-4 text-sm font-normal lg:text-lg lg:font-medium">
                        <NuxtLink target="_blank" :to="'https://www.pistis-project.eu/'" class="flex-shrink-0">
                            <button
                                class="inline-flex items-center px-4 py-2 text-base font-medium text-primary-950 bg-primary-600 text-white border border-transparent rounded-md hover:text-primary-900 hover:bg-gray-100 cursor-pointer transition-all"
                            >
                                Find out more
                            </button></NuxtLink
                        >
                    </div>
                </div>
            </div>
            <div class="bg-white mt-16 sm:mt-20">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 xl:gap-12 text-center px-8 sm:px-16 2xl:px-48 py-20">
                    <div
                        v-for="feature in features"
                        :key="feature.title"
                        class="flex flex-col justify-start items-center gap-4 rounded-lg py-8"
                    >
                        <UIcon :name="feature.icon" class="w-16 h-16 text-primary-950" />
                        <p>{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </div>

        <UModal
            v-model="isModalOpen"
            :ui="{
                overlay: {
                    background: 'bg-gray-600/75',
                },
            }"
        >
            <UCard class="max-w-2xl sm:max-w-4xl" :ui="{ divide: 'divide-transparent', footer: { padding: 'p-0' } }">
                <p class="font-normal text-center sm:text-left text-base lg:text-lg">
                    Registration is closed for the Alpha version of the platform. If you would like to get access to the
                    PISTIS platform at this point, send us an email to the following address:
                    <span class="text-primary-600">register - at - pistis-market.eu</span>
                </p>

                <template #footer>
                    <div class="flex justify-center pb-4">
                        <button
                            class="px-4 py-2 text-white bg-primary-500 border border-transparent rounded-md hover:text-neutral-200 cursor-pointer transition-all"
                            @click="isModalOpen = false"
                        >
                            Close
                        </button>
                    </div>
                </template>
            </UCard>
        </UModal>

        <footer
            class="flex justify-start items-center gap-4 w-full bg-primary-950 px-8 py-4 sm:px-16 2xl:px-48 flipped"
        >
            <img class="w-12 h-8" src="/img/eu_flag.jpeg" alt="PISTIS logo" />
            <p class="text-white text-sm">
                This project has received funding from the European Union under Grant Agreement n° 101093016. Views and
                opinions expressed are however those of the author(s) only and do not necessarily reflect those of the
                European Union or the European Commission. Neither the European Union nor the granting authority can be
                held responsible for them.
            </p>
        </footer>
    </div>
</template>

<style scoped>
.flipped {
    -moz-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: 'FlipH';
}
</style>
