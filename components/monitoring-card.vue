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
        <UIcon v-if="props.icon" :name="props.icon" class="h-8 w-8 text-gray-500" aria-hidden="true" />
        <div class="flex flex-col">
            <span class="text-gray-500 text-sm">{{ props.title }}</span>
            <div class="flex gap-4 items-center">
                <UTooltip
                    v-if="props.title === 'Total Assets'"
                    :text="t('dashboard.resources.inMarketplace')"
                    class="cursor-default"
                >
                    <span class="text-primary-800 font-bold text-2xl">{{ $n(props.amount) }}</span>
                </UTooltip>
                <span v-else class="text-primary-800 font-bold text-2xl">{{ $n(props.amount) }}</span>
            </div>
        </div>
    </div>
</template>
