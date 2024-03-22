<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    change: {
        type: Number,
        required: false,
    },
    icon: {
        type: String,
        required: false,
    },
});

const { t } = useI18n();
</script>

<template>
    <div class="flex gap-4 items-center p-4 justify-center">
        <UIcon v-if="props.icon" :name="props.icon" class="h-8 w-8 text-primary-400" aria-hidden="true" />
        <div class="flex flex-col">
            <span class="text-gray-500 text-sm">{{ props.title }}</span>
            <div class="flex gap-4 items-center">
                <span class="text-gray-600 font-bold text-2xl">{{ $n(props.amount) }}</span>
                <UTooltip :text="t('dashboard.resources.sinceLastMonth')" class="cursor-default">
                    <span
                        v-if="props.change"
                        class="flex items-center rounded-full px-2 h-5"
                        :class="props.change > 0 ? 'text-green-500' : 'text-red-500'"
                    >
                        <UIcon
                            v-if="props.change > 0"
                            name="ic:baseline-plus"
                            class="h-4 w-4 -ml-1"
                            aria-hidden="true"
                        />
                        <UIcon
                            v-if="props.change < 0"
                            name="ic:baseline-minus"
                            class="h-4 w-4 -ml-1"
                            aria-hidden="true"
                        />
                        <span class="text-xs font-medium">{{ $n(Math.abs(props.change)) }}</span>
                    </span>
                </UTooltip>
            </div>
        </div>
    </div>
</template>
