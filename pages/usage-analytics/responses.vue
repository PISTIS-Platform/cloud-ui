<script setup lang="ts">
const route = useRoute();

const assetId = computed(() => route.query.assetId);

const { data } = useFetch(`/api/questionnaire/get-answers`, {
    query: {
        assetId: assetId.value,
    },
});
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <div>ID: {{ assetId }}</div>
            <pre>{{ data }}</pre>
        </PageContainer>
    </div>
</template>
