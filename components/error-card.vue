<script setup lang="ts">
defineProps({
    errorMsg: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <UCard class="w-full">
        <div class="flex flex-col gap-8">
            <div class="flex items-center justify-start gap-2">
                <UIcon name="i-heroicons-exclamation-circle" class="text-red-500 size-5"></UIcon>
                <p class="font-medium">{{ errorMsg }}</p>
            </div>
            <slot></slot>
        </div>
    </UCard>
</template>
