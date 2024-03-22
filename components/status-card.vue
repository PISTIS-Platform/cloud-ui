<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
});
</script>

<template>
    <div class="p-1">
        <div class="w-full flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ props.title }}</span>
            <div
                :class="[
                    props.active ? 'bg-green-300 border-green-500' : 'bg-red-300 border-red-500',
                    'border w-4 h-4 rounded-full',
                ]"
            ></div>
        </div>
    </div>
</template>
