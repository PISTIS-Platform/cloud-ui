<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
    auth: false,
    layout: 'home',
});

const { status, signIn } = useAuth();

const callbackUrl = '/dashboard';

const features = [
    {
        title: 'Feature 1',
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:cpu-chip',
    },
    {
        title: 'Feature 2',
        description:
            'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test rem ipsum test test Lorem',
        icon: 'heroicons:arrow-down-on-square-stack',
    },
    {
        title: 'Feature 3',
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:arrow-down-on-square-stack',
    },
    {
        title: 'Feature 4',
        description:
            'Lorem ipsum test test Lorem ipsum testrem ipsum test test Lorem ipsum test  Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:cloud-arrow-down-20-solid',
    },
    {
        title: 'Feature 5',
        description:
            'Lorem ipsum test test Lorem ipsum test rem ipsum test test Lorem ipsum testrem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:cloud-arrow-down-20-solid',
    },
    {
        title: 'Feature 6',
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:arrow-down-on-square-stack',
    },
    {
        title: 'Feature 7',
        description:
            'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test rem ipsum test test Lorem ipsum test',
        icon: 'heroicons:arrow-down-on-square-stack',
    },
    {
        title: 'Feature 8',
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:arrow-down-on-square-stack',
    },
];
</script>

<template>
    <div class="w-full h-full bg-primary-600">
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
                <NuxtLink
                    v-if="status === 'authenticated'"
                    :to="'/dashboard'"
                    class="flex-shrink-0 rounded-md border border-primary-600 text-white text-lg hover:border hover:border-white py-2 px-4 transition-all"
                    >Dashboard</NuxtLink
                >
            </div>

            <!-- Pistis website Button -->
            <div class="flex">
                <NuxtLink target="_blank" :to="'https://www.pistis-project.eu/'" class="flex-shrink-0">
                    <button
                        class="inline-flex items-center px-4 py-2 text-base font-medium text-primary-600 bg-white border border-transparent rounded-md hover:text-primary-900 hover:bg-gray-100 cursor-pointer transition-all"
                    >
                        Find out more
                    </button></NuxtLink
                >
            </div>
        </nav>

        <div
            class="flex flex-col sm:flex-row items-center justify-center sm:justify-between w-full mt-20 px-8 gap-24 sm:gap-12 2xl:gap-0 sm:px-16 2xl:px-48"
        >
            <div class="relative flex flex-col items-center sm:items-start justify-center space-y-6">
                <h2 class="text-white text-center sm:text-left tracking-wide font-bold text-4xl xl:text-5xl">
                    PISTIS - Your sharing data platform
                </h2>

                <p
                    class="font-normal text-center sm:text-left tracking-wide text-lg lg:text-xl max-w-2xl sm:max-w-4xl text-white"
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus natus sed iusto consequuntur unde,
                    quidem eos in perspiciatis voluptate quo quos debitis vitae adipisci, aut fugit sit, ullam hic cum!
                </p>

                <div class="flex gap-4 text-sm font-normal lg:text-lg lg:font-medium">
                    <button
                        v-if="status !== 'authenticated'"
                        class="inline-flex items-center px-6 py-2 text-primary-600 bg-white border border-transparent rounded-md hover:text-primary-900 hover:bg-gray-100 cursor-pointer transition-all"
                        @click="signIn('keycloak', { callbackUrl })"
                    >
                        Sign In
                    </button>
                    <button
                        class="inline-flex items-center px-6 py-2 text-white bg-primary-600 border border-white rounded-md hover:text-primary-800 hover:bg-white cursor-pointer transition-all"
                    >
                        Register Now
                    </button>
                </div>
            </div>
            <img
                class="w-96 h-80 sm:w-56 sm:h-60 2xl:w-96 2xl:h-80 rounded-full"
                src="/img/data-share.png"
                alt="PISTIS logo"
            />
        </div>

        <div class="bg-white mt-20">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 xl:gap-12 text-center px-8 sm:px-16 2xl:px-48 py-8">
                <div
                    v-for="feature in features"
                    :key="feature.title"
                    class="flex flex-col justify-start items-center gap-4 rounded-lg py-8"
                >
                    <UIcon :name="feature.icon" class="w-16 h-16 text-primary-600" />
                    <h2 class="font-semibold text-2xl text-black">{{ feature.title }}</h2>
                    <p>{{ feature.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
