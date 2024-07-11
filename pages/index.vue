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
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:arrow-down-on-square-stack',
    },
    {
        title: 'Feature 3',
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:arrow-down-on-square-stack',
    },
    {
        title: 'Feature 4',
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:cloud-arrow-down-20-solid',
    },
    {
        title: 'Feature 5',
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:cloud-arrow-down-20-solid',
    },
    {
        title: 'Feature 6',
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
        icon: 'heroicons:arrow-down-on-square-stack',
    },
    {
        title: 'Feature 7',
        description: 'Lorem ipsum test test Lorem ipsum test Lorem ipsum test test Lorem ipsum test',
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
    <div class="w-full h-full px-36 bg-primary-600">
        <nav aria-label="Global" class="relative flex flex-row sm:items-center justify-between py-6">
            <!-- Left Menu -->
            <div class="flex flex-row space-x-10 items-center">
                <div class="sm:w-full md:w-auto">
                    <NuxtLink :to="'/'" class="flex-shrink-0">
                        <img class="h-16 w-48" src="/img/PISTIS_logo_white.png" alt="PISTIS logo" />
                    </NuxtLink>
                </div>
            </div>

            <!-- Login Button -->
            <div v-if="status !== 'authenticated'" class="flex">
                <button
                    class="inline-flex items-center px-4 py-2 text-base font-medium text-primary-600 bg-white border border-transparent rounded-md hover:text-primary-800 hover:bg-gray-300 cursor-pointer"
                    @click="signIn('keycloak', { callbackUrl })"
                >
                    Sign In
                </button>
            </div>
        </nav>

        <div class="flex items-center justify-between w-full mt-20 px-24">
            <div class="relative flex flex-col items-start justify-center space-y-12">
                <h2 class="text-white font-bold text-4xl xl:text-5xl tracking-wide">
                    Pistis - Your sharing data platform
                </h2>

                <p class="font-normal tracking-wide text-base sm:text-xl max-w-2xl sm:max-w-4xl text-white">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus natus sed iusto consequuntur unde,
                    quidem eos in perspiciatis voluptate quo quos debitis vitae adipisci, aut fugit sit, ullam hic cum!
                </p>
            </div>
            <img class="w-96 h-80 rounded-full" src="/img/data-share.png" alt="PISTIS logo" />
        </div>

        <div class="grid grid-cols-4 gap-12 text-center text-white px-24 pt-10 pb-20">
            <div
                v-for="feature in features"
                :key="feature.title"
                class="flex flex-col justify-center items-center gap-4 rounded-lg py-8"
            >
                <UIcon :name="feature.icon" class="w-16 h-16" />
                <h2 class="font-semibold">{{ feature.title }}</h2>
                <p>{{ feature.description }}</p>
            </div>
        </div>
    </div>
</template>
