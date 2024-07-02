<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
});

console.log('props.percentage');
console.log(props.percentage);

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
        <dt class="text-gray-500 text-sm">{{ props.title }}</dt>
        <UProgress :value="percentage" class="mt-2" />
        <dd class="mt-1 flex items-baseline justify-between gap-4">
            <div
                :class="[
                    percentageColorClasses,
                    'inline-flex items-baseline rounded-full px-2 text-xs py-0.5 font-medium',
                ]"
            >
                {{ props.percentage }} %
            </div>
        </dd>
    </div>
</template>
