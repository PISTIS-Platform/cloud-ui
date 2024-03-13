<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
    auth: false,
});

const { status } = useAuth();
</script>

<template>
    <div class="flex flex-col flex-1 max-w-7xl mx-auto w-full">
        <div v-if="status === 'authenticated'" class="py-6 items-center px-8 divide-y space-y-4">
            <SubHeading title="[PH] Register Factory" info="Section to help the user register his factory" />
        </div>
    </div>
</template>
