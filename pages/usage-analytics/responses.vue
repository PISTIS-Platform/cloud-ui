<script setup lang="ts">
import type { QuestionResponse } from '~/interfaces/usage-analytics';

const route = useRoute();
const assetId = computed(() => route.query.assetId);

const { data } = useFetch<QuestionResponse[]>(`/api/questionnaire/get-answers`, {
    query: {
        assetId: assetId.value,
    },
});

const filteredData = computed(() =>
    data.value ? data.value?.filter((response: QuestionResponse) => response.questionType !== 'Text') : [],
);
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <div>ID: {{ assetId }}</div>
            <pre>{{ filteredData }}</pre>
        </PageContainer>
    </div>
</template>
