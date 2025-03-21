<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

import type {
    Question,
    QuestionAnswer,
    Questionnaire,
    QuestionOption,
    SelectedOption,
} from '~/interfaces/usage-analytics';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();
const route = useRoute();

const answers = ref<QuestionAnswer[]>([]);
const errorMsg = ref('');
const submitPending = ref<boolean>(false);

const {
    data: questionnaire,
    pending: loadingQuestionnaire,
    error,
} = await useAsyncData<Questionnaire>(`fetchQuestionnaire-asset-${route.params.assetId}`, () =>
    $fetch(`/api/questionnaire/${route.params.assetId}`),
);

if (error.value || !questionnaire.value) {
    const serverError = error.value as Record<string, any>;

    errorMsg.value = serverError?.data?.data?.message || t('usage-analytics.errorWhileRetrievingActiveVersion');
} else {
    answers.value =
        questionnaire.value?.questions?.map((question: Question) => {
            let availableOptions: SelectedOption[] = [];

            if (question?.options) {
                availableOptions = question?.options.map((option: QuestionOption) => {
                    return {
                        id: uuidv4(),
                        value: option?.text || '',
                        isSelected: false,
                    };
                });
            }

            return {
                id: uuidv4(),
                text: '',
                questionType: question.type,
                availableOptions,
                selectedOptions: [],
                question,
                isValid: question.isRequired ? false : true,
            };
        }) || [];
}

const isSubmitDisabled = computed(() => {
    if (answers.value.some((a: QuestionAnswer) => !a.isValid) || submitPending.value) {
        return true;
    }

    return false;
});

const saveAnswers = async () => {
    if (!questionnaire.value) {
        return;
    }

    // if even at least 1 answer has validation errors -> do not proceed
    if (answers.value.some((a: QuestionAnswer) => !a.isValid)) {
        showErrorMessage(t('usage-analytics.checkAnswers'));
        return;
    }

    submitPending.value = true;

    let body: {
        assetId: string;
        responses: {
            questionId: string;
            questionTitle: string;
            text?: string;
            options?: string[];
        }[];
    } = {
        assetId: route.params.assetId as string,
        responses: answers.value.map((answer) => ({
            questionId: answer.question?.id ?? '',
            questionTitle: answer.question?.title ?? '',
            text: answer?.text,
            options: answer?.selectedOptions,
        })),
    };

    try {
        await $fetch(`/api/questionnaire/submit-answers`, {
            query: {
                id: questionnaire.value?.id,
                version: questionnaire.value?.version,
            },
            method: 'post',
            body,
        });

        showSuccessMessage(t('usage-analytics.answersSubmitted'));
        setTimeout(async () => {
            await navigateTo(`https://pistis-market.eu/srv/catalog/datasets/${route.params.assetId}`, {
                external: true,
            });
        }, 3000);
    } catch (error) {
        showErrorMessage(t('usage-analytics.errorInSubmitAnswers'));

        submitPending.value = false;
    }
};
</script>

<template>
    <div class="mx-auto px-8 max-w-7xl w-full mt-4">
        <div v-if="loadingQuestionnaire">
            <UProgress animation="carousel" />
        </div>
        <div v-else-if="!loadingQuestionnaire && error && !questionnaire">
            <ErrorCard :error-msg="errorMsg" />
        </div>
        <UCard v-else class="w-full">
            <template #header>
                <SubHeading :title="questionnaire?.title || ''" :info="questionnaire?.description || ''" />
            </template>

            <!-- Questionnaire Answers -->
            <div class="flex flex-col space-y-8">
                <div v-if="!questionnaire?.questions?.length" class="text-sm text-gray-500">
                    {{ $t('usage-analytics.noQuestionsWereFound') }}
                </div>
                <div v-for="answer in answers" v-else :key="answer.id">
                    <UCard :ui="{ base: 'overflow-visible' }">
                        <template #header>
                            <div class="flex justify-start items-center gap-1">
                                <SubHeading
                                    :title="answer.question?.title || ''"
                                    :info="answer.question?.description || ''"
                                />
                                <div v-if="answer.question?.isRequired" class="text-red-500 text-sm">*</div>
                            </div>
                        </template>
                        <Answer
                            :answer="answer"
                            @update:text="(value: string) => (answer.text = value)"
                            @update:selected-options="(value: string[]) => (answer.selectedOptions = value)"
                            @is-valid="(isValid: boolean) => (answer.isValid = isValid)"
                        />
                    </UCard>
                </div>
            </div>

            <!-- Submit Buttons -->
            <div v-if="questionnaire?.questions?.length" class="flex gap-4 justify-between items-center mt-8">
                <UTooltip :text="$t('usage-analytics.submitAnswers')">
                    <UButton
                        size="lg"
                        :label="$t('submit')"
                        color="primary"
                        variant="solid"
                        :disabled="isSubmitDisabled"
                        :loading="submitPending"
                        @click="saveAnswers"
                    />
                </UTooltip>
            </div>
        </UCard>
    </div>
</template>
