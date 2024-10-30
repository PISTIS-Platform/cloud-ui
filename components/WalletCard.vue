<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    coin: {
        type: String,
        required: false,
        default: 'EUR',
    },
    iconName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: false,
        default: '',
    },
});

const R = useRamda();
</script>

<template>
    <UCard :ui="{ body: { base: '', padding: 'p-4 sm:p-4' } }">
        <div class="relative flex items-center">
            <div class="flex-shrink-0 mr-4">
                <UIcon :name="iconName" class="w-10 h-10 text-secondary-300" />
            </div>
            <div class="min-w-0 flex-1">
                <div class="flex justify-start items-center w-full space-x-2">
                    <h3 class="text-base xl:text-lg font-normal">
                        {{ title }}
                    </h3>
                </div>
                <div :class="['text-lg font-bold', amount > 0 ? 'text-green-800' : 'text-red-800']">
                    <span v-if="status !== 'pending'">{{ amount ?? 'N/A' }} {{ R.isNil(amount) ? '' : coin }}</span>
                    <UIcon v-if="status === 'pending'" name="svg-spinners:3-dots-fade" />
                </div>
            </div>
        </div>
    </UCard>
</template>
