<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: false,
        default: '',
    },
});
</script>
//TODO: Add slots? Check portals for menu
<template>
    <div class="flex flex-col space-y-1 items-start justify-center">
        <h3 class="text-lg font-semibold text-gray-700">
            {{ title }}
        </h3>
        <h4 v-if="info" class="text-sm text-gray-400">
            {{ info }}
        </h4>
    </div>
</template>
