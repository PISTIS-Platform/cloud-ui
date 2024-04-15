<script setup lang="ts">
import { z } from 'zod';

import { MAX_CHARACTERS_QUESTIONNAIRE_TITLE_LIMIT, MAX_CHARACTERS_TEXT_LIMIT } from '@/constants/validation';
import type { Question, Questionnaire, QuestionOption } from '@/interfaces/usage-analytics';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const route = useRoute();

const questionnaire = ref<Questionnaire>({
    id: '',
    version: null,
    title: '',
    description: '',
    isActive: false,
    publicationDate: null,
    isForVerifiedBuyers: false,
    questions: [],
});

//this is used to later compare the new questionnaire (and its questions) with the preexisting one
//to check if any changes were made to the new one
const preExistingQuestionnaire = ref<Questionnaire | null>(null);

const questions = ref<Question[]>(questionnaire.value.questions);

const loadingQuestionnaireVersion = ref(false);
const hasErrorInRetrieval = ref(false);

//create new version from scratch
if (!route.query.id && !route.query.version) {
    questionnaire.value.id = route.query.id as string;
}

//create new version from an existing one
//make an api call to fetch the version
if (route.query.id && route.query.version) {
    loadingQuestionnaireVersion.value = true;

    const { data, pending, error } = await useAsyncData<Questionnaire>(
        `fetchQuestionnaire${route.query.id}-${route.query.version}`,
        () => $fetch(`/api/questionnaire/find?id=${route.query.id}&version=${route.query.version}`),
    );

    if (error.value || !data.value) {
        hasErrorInRetrieval.value = true;
        showErrorMessage(t('usage-analytics.errorInFindVersion'));
    } else {
        hasErrorInRetrieval.value = false;
        loadingQuestionnaireVersion.value = pending.value;
        questionnaire.value = data.value;

        //initializing questions for Form
        questions.value = questionnaire.value.questions.map((q: Question) => {
            return {
                ...q,
                isValid: true,
                isOptional: !q.isRequired,
                options:
                    q?.options?.map((option: QuestionOption, index: number) => {
                        return {
                            ...option,
                            id: String(new Date().getTime()) + index.toString(),
                        };
                    }) || [],
            };
        });

        preExistingQuestionnaire.value = structuredClone(toRaw(data.value));
        preExistingQuestionnaire.value.questions = structuredClone(toRaw(questions.value));
    }
}

const schema = z.object({
    title: z
        .string()
        .trim()
        .min(1, { message: t('required') })
        .max(MAX_CHARACTERS_QUESTIONNAIRE_TITLE_LIMIT, {
            message: t('validation.moreThanNumberChars', { count: MAX_CHARACTERS_QUESTIONNAIRE_TITLE_LIMIT }),
        }),
    description: z
        .string()
        .trim()
        .max(MAX_CHARACTERS_TEXT_LIMIT, {
            message: t('validation.moreThanNumberChars', { count: MAX_CHARACTERS_TEXT_LIMIT }),
        }),
    isForVerifiedBuyers: z.boolean(),
});

const addQuestion = () => {
    const newQuestion: Question = {
        id: String(new Date().getTime()),
        type: '',
        title: '',
        options: [],
        description: '',
        isOptional: false,
        isValid: false,
    };

    questions.value.push(newQuestion);
};

const removeQuestion = (id?: string) => {
    if (!id) {
        return;
    }

    const indexToRemove = questions.value.findIndex((item: Question) => item.id === id);

    if (indexToRemove !== -1) {
        questions.value.splice(indexToRemove, 1);
    }
};

//computed property to check if questions were updated - if not, the save button should be disabled
const questionsWereUpdated = computed(() => {
    const existingQuestions = preExistingQuestionnaire.value?.questions || [];
    const newQuestions = questions.value || [];

    //check if more questions were added (or questions were removed)
    if (newQuestions.length !== existingQuestions.length) {
        return true;
    }

    //loop through all the questions objects of the pre existing and new array of questions
    //and check if there are differences
    for (let i = 0; i < newQuestions.length; i++) {
        const questionItem1 = existingQuestions[i];
        const questionItem2 = newQuestions[i];

        if (
            questionItem1.title !== questionItem2.title ||
            questionItem1.type !== questionItem2.type ||
            questionItem1.isOptional !== questionItem2.isOptional
        ) {
            return true;
        }

        if (
            questionItem1.options &&
            questionItem2.options &&
            questionItem1.options?.length !== questionItem2.options?.length
        ) {
            return true;
        }

        if (questionItem1.options && questionItem2.options) {
            for (let i = 0; i < questionItem1.options?.length; i++) {
                const optionItem1: QuestionOption = questionItem1.options[i];
                const optionItem2: QuestionOption = questionItem2.options[i];

                if (optionItem1.text !== optionItem2.text || optionItem1.description !== optionItem2.description) {
                    return true;
                }
            }
        }
    }

    return false;
});

const shouldDisableButton = ref<boolean>(false);

const isSaveDisabled = computed(() => {
    if (shouldDisableButton.value) {
        return true;
    }

    if (!questions.value.length) {
        return true;
    }

    if (questions.value.some((q: Question) => !q.isValid) || !schema.safeParse(questionnaire.value).success) {
        return true;
    }

    if (
        questionsWereUpdated.value ||
        questionnaire.value.title !== preExistingQuestionnaire.value?.title ||
        questionnaire.value.description !== preExistingQuestionnaire.value?.description ||
        questionnaire.value.isActive !== preExistingQuestionnaire.value.isActive
    ) {
        return false;
    }

    return true;
});

const navigateToMainPage = async () => {
    await navigateTo({
        path: '/usage-analytics',
    });
};

const createVersion = async () => {
    const questionsBody = questions.value.map((question: Question) => {
        return {
            title: question.title,
            description: question?.description || '',
            type: question.type,
            isRequired: !question.isOptional,
            options:
                question.options?.map((option: QuestionOption) => {
                    return {
                        text: option.text,
                        description: '',
                    };
                }) || null,
        };
    });

    try {
        await $fetch(`/api/questionnaire`, {
            method: 'post',
            body: {
                title: questionnaire.value.title.trim(),
                description: (questionnaire.value.description || '').trim(),
                isActive: false, //by default set it to false
                isForVerifiedBuyers: questionnaire.value.isForVerifiedBuyers,
                creatorId: '1234', //FIXME:: replace with actual creator id when this information will be available
                questions: questionsBody,
            },
        });

        showSuccessMessage(t('usage-analytics.saved'));

        navigateToMainPage();
    } catch (error: any) {
        showErrorMessage(t('usage-analytics.errorInSave'));
        shouldDisableButton.value = false;
    }
};

const submitForm = async () => {
    if (!questions.value.length) {
        showErrorMessage(t('usage-analytics.noQuestionsAdded'));
        return;
    }

    if (questions.value.every((q: Question) => q.isOptional)) {
        showErrorMessage(t('usage-analytics.atLeastOneQuestionRequired'));
        return;
    }

    //if even at least 1 question has validation errors -> do not proceed
    if (questions.value.some((q: Question) => !q.isValid) || !schema.safeParse(questionnaire.value).success) {
        showErrorMessage(t('usage-analytics.checkInputs'));
        return;
    }

    shouldDisableButton.value = true;

    //create version
    createVersion();
};
const resetQuestionnaire = () => {
    questions.value = [];
};
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <SubHeading :title="$t('usage-analytics.createNew')" />
            <div v-if="loadingQuestionnaireVersion && !hasErrorInRetrieval" class="w-full mt-6">
                //TODO:: perhaps replace Progress Bar with Skeleton if needed
                <UProgress animation="carousel" />
            </div>
            <div v-else-if="loadingQuestionnaireVersion && hasErrorInRetrieval">
                <UButton
                    size="lg"
                    color="gray"
                    variant="solid"
                    :label="$t('goBack')"
                    class="mt-6"
                    :trailing="false"
                    @click="navigateToMainPage"
                />
            </div>
            <UCard v-else class="w-full mt-6">
                <div>
                    <UForm
                        class="flex flex-col justify-start items-start space-y-8 w-full"
                        :state="questionnaire"
                        :schema="schema"
                    >
                        <!-- Questionnaire title and description-->
                        <div class="flex flex-col justify-start items-start space-y-4 w-full">
                            <UFormGroup :label="$t('usage-analytics.title')" required name="title" class="w-full">
                                <UInput v-model="questionnaire.title" :placeholder="$t('usage-analytics.titleInfo')" />
                            </UFormGroup>
                            <UFormGroup :label="$t('usage-analytics.description')" name="description" class="w-full">
                                <UTextarea
                                    v-model="questionnaire.description"
                                    :placeholder="$t('usage-analytics.descriptionInfo')"
                                />
                            </UFormGroup>

                            <div class="flex gap-2 justify-start items-center">
                                <UFormGroup name="isForVerifiedBuyers">
                                    <UCheckbox
                                        v-model="questionnaire.isForVerifiedBuyers"
                                        :label="$t('usage-analytics.forVerifiedBuyers')"
                                    />
                                </UFormGroup>
                            </div>
                        </div>

                        <div class="flex flex-col justify-start items-start space-y-4 w-full">
                            <!-- Questions -->
                            <div v-if="questions.length" class="flex flex-col space-y-8 w-full">
                                <div v-for="question in questions" :key="question.id">
                                    <UCard :ui="{ base: 'overflow-visible' }">
                                        <template #header>
                                            <div class="flex justify-between items-center gap-6">
                                                <h3 class="text-xl font-semibold text-gray-900">
                                                    {{ `Question ${questions.indexOf(question) + 1}` }}
                                                </h3>
                                                <UButton
                                                    icon="i-heroicons-trash"
                                                    size="sm"
                                                    color="red"
                                                    variant="outline"
                                                    :label="t('usage-analytics.removeQuestion')"
                                                    @click="removeQuestion(question.id)"
                                                />
                                            </div>
                                        </template>
                                        <Question
                                            :question="question"
                                            @update:title="(value: string) => (question.title = value)"
                                            @update:type="(value: string) => (question.type = value)"
                                            @update:options="
                                                (options: QuestionOption[]) => (question.options = options)
                                            "
                                            @update:is-optional="(value: boolean) => (question.isOptional = value)"
                                            @is-valid="(isValid: boolean) => (question.isValid = isValid)"
                                        >
                                        </Question>
                                    </UCard>
                                </div>
                            </div>

                            <!-- Button for adding question -->
                            <UTooltip text="Add Question" :popper="{ placement: 'right' }">
                                <UButton
                                    icon="i-heroicons-plus"
                                    size="xs"
                                    color="primary"
                                    variant="solid"
                                    @click="addQuestion()"
                                />
                            </UTooltip>
                        </div>
                    </UForm>
                </div>

                <!-- Submit Buttons -->
                <div class="flex gap-4 justify-between items-center mt-8">
                    <div class="flex gap-4">
                        <UTooltip :text="$t('cancel')">
                            <UButton
                                size="lg"
                                color="gray"
                                variant="solid"
                                :label="$t('cancel')"
                                :trailing="false"
                                @click="navigateToMainPage"
                            />
                        </UTooltip>
                        <UTooltip :text="$t('usage-analytics.reset')">
                            <UButton
                                size="lg"
                                :label="$t('reset')"
                                color="gray"
                                variant="solid"
                                @click="resetQuestionnaire"
                            />
                        </UTooltip>
                    </div>

                    <UTooltip :text="$t('usage-analytics.save')">
                        <UButton
                            size="lg"
                            :label="$t('save')"
                            color="primary"
                            variant="solid"
                            :disabled="isSaveDisabled"
                            @click="submitForm"
                        />
                    </UTooltip>
                </div>
            </UCard>
        </PageContainer>
    </div>
</template>
