<script setup lang="ts">
const { t } = useI18n();
import type { Questionnaire } from '@/interfaces/usage-analytics';
import { QuestionType } from '@/interfaces/usage-analytics';

const route = useRoute();
const errorInRetrieval = ref('');

const freeText = ref(t('usage-analytics.text'));

const { data, status, error } = await useAsyncData<Questionnaire>(
    `fetchQuestionnaire${route.query.id}-${route.query.version}`,
    () => $fetch(`/api/questionnaire/find?id=${route.query.id}&version=${route.query.version}`),
);

if (error.value || !data.value) {
    errorInRetrieval.value =
        (error.value as Record<string, any>)?.data?.data?.message ?? t('usage-analytics.errorInFindVersion');
}
const navigateToMainPage = async () => {
    await navigateTo({
        path: '/usage-analytics',
    });
};
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <div class="flex items-center justify-between w-full">
                <SubHeading
                    :title="$t('usage-analytics.viewQuestionnaire')"
                    :info="$t('usage-analytics.viewQuestionnaireDescription')"
                />
                <UButton
                    size="lg"
                    color="gray"
                    variant="solid"
                    :label="$t('back')"
                    :icon="'mdi:arrow-left'"
                    :trailing="false"
                    class="mt-4"
                    @click="navigateToMainPage"
                />
            </div>
            <div class="w-full mt-8">
                <div v-if="status === 'pending' && !errorInRetrieval">
                    <UProgress animation="carousel" />
                </div>
                <ErrorCard v-else-if="status !== 'pending' && errorInRetrieval" :error-msg="errorInRetrieval">
                    <UButton
                        size="lg"
                        color="gray"
                        variant="solid"
                        :label="$t('goBack')"
                        class="mt-6"
                        :trailing="false"
                        @click="navigateToMainPage"
                    />
                </ErrorCard>
                <UCard v-else-if="data" class="w-full">
                    <SubHeading :title="data.title" :info="data.description" />
                    <div class="flex flex-col gap-6 mt-6">
                        <UCard v-for="(question, index) in data.questions" :key="question.title">
                            <template #header>
                                <span class="font-semibold">{{ $t('usage-analytics.question') }} {{ index + 1 }}</span>
                            </template>
                            <span>
                                <span class="flex items-start gap-2"
                                    >{{ question.title }}
                                    <UTooltip v-if="question.isRequired" :text="$t('required')" class="cursor-default"
                                        ><span class="text-red-400 text-lg">*</span></UTooltip
                                    ></span
                                >
                            </span>
                            <div v-if="question.type === QuestionType.TEXT" class="mt-2">
                                <UInput v-model="freeText" disabled></UInput>
                            </div>
                            <div v-else-if="question.type === QuestionType.CHECKBOX" class="mt-2">
                                <div class="flex flex-col gap-2">
                                    <UCheckbox
                                        v-for="option in question.options"
                                        :key="option.text"
                                        disabled
                                        :label="option.text"
                                    >
                                    </UCheckbox>
                                </div>
                            </div>
                            <div v-else class="mt-2">
                                <div class="flex flex-col gap-2">
                                    <URadio
                                        v-for="option in question.options"
                                        :key="option.text"
                                        disabled
                                        :label="option.text"
                                        :model-value="false"
                                    ></URadio>
                                </div>
                            </div>
                        </UCard>
                    </div>
                </UCard>
                <UButton
                    size="lg"
                    color="gray"
                    variant="solid"
                    :label="$t('back')"
                    :icon="'mdi:arrow-left'"
                    :trailing="false"
                    class="mt-4"
                    @click="navigateToMainPage"
                />
            </div>
        </PageContainer>
    </div>
</template>
