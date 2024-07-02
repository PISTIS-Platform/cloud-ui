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
        required: true,
        default: () => [],
    },
});

const percentageColorClasses = computed(() => {
    if (props.percentage >= 0 && props.percentage < 50) {
        return 'bg-green-100 text-green-500';
    }
    if (props.percentage >= 50 && props.percentage < 90) {
        return 'bg-yellow-100 text-yellow-500';
    }
    return 'bg-red-100 text-red-500';
});
</script>

<template>
    <div class="p-2">
        <div class="flex items-center gap-2">
            <dt class="text-gray-500 text-sm">{{ props.title }}</dt>
            <dd class="mt-1 flex items-baseline justify-between gap-4">
                <div
                    :class="[
                        percentageColorClasses,
                        'inline-flex items-baseline rounded-full px-2 text-sm py-0.5 font-medium',
                    ]"
                >
                    {{ props.percentage }} %
                </div>
            </dd>
        </div>
        <div class="flex flex-col gap-1 mt-2">
            <UTooltip
                :prevent="!props.tooltipInfo.length"
                :class="props.tooltipInfo.length ? 'cursor-pointer' : ''"
                :ui="{ width: 'max-w-2xl', base: 'text-wrap p-2 h-24' }"
            >
                <UProgress :value="props.percentage" />
                <template #text>
                    <div class="flex flex-col gap-4">
                        <p v-for="infoItem in tooltipInfo" :key="infoItem.label">
                            {{ infoItem.label }}: <span class="font-semibold">{{ infoItem.value }}</span>
                        </p>
                    </div>
                </template>
            </UTooltip>
        </div>
    </div>
</template>
