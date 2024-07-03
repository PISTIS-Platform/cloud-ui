<script setup lang="ts">
import type Selection from '~/interfaces/selection';

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    tooltipInfo: {
        type: Array as PropType<Selection[]>,
        required: false,
        default: () => [],
    },
});

const percentageColorClasses = computed(() => {
    if (props.percentage >= 0 && props.percentage < 50) {
        return 'text-green-500';
    }
    if (props.percentage >= 50 && props.percentage < 90) {
        return 'text-yellow-500';
    }
    return 'text-red-500';
});
</script>

<template>
    <UTooltip
        :prevent="!props.tooltipInfo.length"
        :class="props.tooltipInfo.length ? 'cursor-pointer' : ''"
        :ui="{ width: 'max-w-2xl', base: 'text-wrap p-2 h-24' }"
    >
        <div class="w-full rounded-lg ring-gray-200 ring-1 bg-white px-4 py-5 shadow-md sm:p-6">
            <dt class="truncate text-sm font-semibold text-gray-500">{{ props.title }}</dt>
            <dd :class="`mt-1 text-2xl font-semibold tracking-tight ${percentageColorClasses}`">{{ percentage }} %</dd>
        </div>
        <template #text>
            <div class="flex flex-col gap-4">
                <p v-for="infoItem in tooltipInfo" :key="infoItem.label">
                    {{ infoItem.label }}: <span class="font-semibold">{{ infoItem.value }}</span>
                </p>
            </div>
        </template>
    </UTooltip>
</template>
