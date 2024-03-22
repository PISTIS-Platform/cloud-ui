<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    used: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    measurement: {
        type: String,
        required: false,
    },
});

const percentage = computed(() => props.used / props.total);

const percentageColorClasses = computed(() => {
    if (percentage.value >= 0 && percentage.value < 0.5) {
        return 'bg-green-100 text-green-500';
    }
    if (percentage.value >= 0.5 && percentage.value < 0.9) {
        return 'bg-yellow-100 text-yellow-500';
    }
    return 'bg-red-100 text-red-500';
});
</script>

<template>
    <div class="p-2">
        <dt class="text-gray-500 text-sm">{{ props.title }}</dt>
        <UProgress :value="percentage * 100" class="mt-2" />
        <dd class="mt-1 flex items-baseline justify-between gap-4">
            <div class="flex items-baseline text-2xl font-semibold text-primary-400">
                {{ $n(props.used) }}
                <span class="ml-2 text-sm font-medium text-gray-500"
                    >{{ $t('dashboard.resources.usageStats.from') }} {{ $n(props.total) }} {{ props.measurement }}</span
                >
            </div>

            <div
                :class="[
                    percentageColorClasses,
                    'inline-flex items-baseline rounded-full px-2 text-xs py-0.5 font-medium',
                ]"
            >
                {{ $n(percentage, 'percent') }}
            </div>
        </dd>
    </div>
</template>
