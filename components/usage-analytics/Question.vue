<script setup lang="ts">
import { useQuestionSchema } from '~/composables/usage-analytics/question-schema';
import type { Question, QuestionOption } from '~/interfaces/usage-analytics';
import { QuestionType } from '~/interfaces/usage-analytics';

const { t } = useI18n();

const MAX_OPTIONS_NUMBER = 5;

const props = defineProps({
    question: {
        type: Object as () => Question,
        required: true,
    },
});

const emit = defineEmits(['update:type', 'update:title', 'update:isOptional', 'update:options', 'isValid']);

// Schema for all the inputs
const { questionType, questionTypesEnum, schema } = useQuestionSchema();
questionType.value = props.question.type || '';

const questionForm = ref();

const questionOptions = ref<QuestionOption[]>(props.question?.options || []);
const userRemovedOptions = ref<boolean>(false);

//check if inputs are valid
const isValid = computed(() => {
    return schema.safeParse(props.question).success;
});

watch(isValid, () => {
    emit('isValid', isValid.value);
});

const updateOptionText = (id: string, text: string) => {
    let option = questionOptions.value.find((item: QuestionOption) => item.id === id);

    if (!option) {
        return;
    }

    option.text = text;

    emit('update:options', questionOptions.value);
};

const updateQuestionType = (type: QuestionType) => {
    questionType.value = type;

    if (type === QuestionType.TEXT) {
        questionOptions.value = [];
        emit('update:options', questionOptions.value);
    }

    emit('update:type', type);
};

const addQuestionOption = () => {
    const newOption: QuestionOption = {
        id: String(new Date().getTime()),
        text: undefined,
        description: undefined,
    };

    questionOptions.value.push(newOption);

    emit('update:options', questionOptions.value);
};

const removeQuestionOption = async (id: string) => {
    const indexToRemove = questionOptions.value.findIndex((item: QuestionOption) => item.id === id);

    if (indexToRemove !== -1) {
        //clear remaining error in FormGroup element of removed option
        questionForm.value.clear(`options.${indexToRemove}.text`);

        questionOptions.value.splice(indexToRemove, 1);
        userRemovedOptions.value = true;

        emit('update:options', questionOptions.value);
    }
};

const preparedOptions = [
    [
        {
            label: t('usage-analytics.numberingOptions1to5'),
            options: ['1', '2', '3', '4', '5'],
        },
    ],
    [
        {
            label: t('usage-analytics.scaleTextOptions'),
            options: [
                t('usage-analytics.scaleTextExtremelyPoor'),
                t('usage-analytics.scaleTextPoor'),
                t('usage-analytics.scaleTextNeutral'),
                t('usage-analytics.scaleTextGreat'),
                t('usage-analytics.scaleTextExcellent'),
            ],
        },
    ],
];

const addPreConfiguredOptions = (configuredOptions: string[]) => {
    questionOptions.value = [];

    configuredOptions.forEach((configuredOptionText: string, index: number) => {
        questionOptions.value.push({
            id: String(new Date().getTime()) + index.toString(),
            text: configuredOptionText,
            description: undefined,
        });
    });

    emit('update:options', questionOptions.value);
};
</script>

<template>
    <div class="w-full">
        <UForm ref="questionForm" class="flex flex-col space-y-5 w-full" :state="props.question" :schema="schema">
            <!-- Select Menu -->

            <div class="flex flex-col sm:flex-row justify-start items-start gap-4 sm:gap-8 w-full">
                <!-- Question type -->
                <UFormGroup :label="$t('usage-analytics.selectQuestionType')" required name="type">
                    <USelectMenu
                        :model-value="questionType"
                        :options="questionTypesEnum.options"
                        size="md"
                        class="flex w-64"
                        @update:model-value="(value: QuestionType) => updateQuestionType(value)"
                    />
                </UFormGroup>
                <!-- Question title -->
                <UFormGroup v-if="question.type" :label="$t('title')" required name="title" class="w-full">
                    <UInput
                        :model-value="question.title"
                        :placeholder="$t('usage-analytics.questionTitle')"
                        class="flex-1"
                        size="md"
                        @update:model-value="(value: string) => emit('update:title', value)"
                    />
                </UFormGroup>
            </div>

            <!-- Display Content for Checkboxes and radio buttons -->
            <div v-if="question.type === QuestionType.CHECKBOX || question.type === QuestionType.RADIO" class="mt-3">
                <div class="flex flex-col justify-start items-start">
                    <!-- General form group for options -->
                    <UFormGroup :label="$t('usage-analytics.options')" :error="questionOptions.length < 2" required>
                        <template #error="{ error }">
                            <div
                                :class="[
                                    !error ? 'hidden' : error && userRemovedOptions ? 'text-red-500' : 'text-gray-500',
                                    'mb-2',
                                ]"
                            >
                                {{ $t('usage-analytics.optionsMinLength') }}
                            </div>
                        </template>
                    </UFormGroup>

                    <!-- Looping through added question options -->
                    <div class="flex flex-col items-start justify-start w-full space-y-4">
                        <div
                            v-for="(option, index) in questionOptions"
                            :key="option.id"
                            class="flex gap-2 justify-start items-start"
                        >
                            <!-- Input for option text -->
                            <UFormGroup required :name="`options.${index}.text`">
                                <UInput
                                    :model-value="option.text"
                                    :placeholder="$t('usage-analytics.optionText')"
                                    class="w-64"
                                    @update:model-value="(value: string) => updateOptionText(option.id || '', value)"
                                />
                            </UFormGroup>

                            <!-- Button for removing option -->
                            <UTooltip :text="$t('usage-analytics.removeOption')">
                                <UButton
                                    class="text-gray-500 hover:text-red-500 hover:bg-white"
                                    icon="i-heroicons-trash"
                                    size="sm"
                                    variant="ghost"
                                    @click="removeQuestionOption(option.id || '')"
                                />
                            </UTooltip>
                        </div>

                        <div class="flex gap-4 justify-start items-center">
                            <!-- Button for adding new option -->
                            <UTooltip
                                :text="
                                    questionOptions.length < MAX_OPTIONS_NUMBER
                                        ? $t('usage-analytics.addCustomOption')
                                        : $t('usage-analytics.maxNumberOfOptions', { max: MAX_OPTIONS_NUMBER })
                                "
                            >
                                <UButton
                                    icon="i-heroicons-plus-circle-20-solid"
                                    size="md"
                                    class="text-gray-500"
                                    variant="ghost"
                                    :disabled="questionOptions.length >= MAX_OPTIONS_NUMBER"
                                    @click="addQuestionOption()"
                                />
                            </UTooltip>
                            <UDropdown
                                :items="preparedOptions"
                                mode="hover"
                                :popper="{ placement: 'bottom-start' }"
                                :ui="{
                                    width: 'w-80',
                                    item: {
                                        size: 'text-xs',
                                        base: 'flex justify-start items-start',
                                        padding: 'p-1',
                                    },
                                }"
                            >
                                <UButton
                                    class="text-gray-500"
                                    variant="outline"
                                    icon="i-heroicons-list-bullet-20-solid"
                                    :label="$t('usage-analytics.addPreconfiguredOptions')"
                                />
                                <template #item="{ item }">
                                    <div
                                        class="flex justify-start w-full"
                                        @click="addPreConfiguredOptions(item.options)"
                                    >
                                        {{ item.label }}
                                    </div>
                                </template>
                            </UDropdown>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex mt-8">
                <UFormGroup name="isOptional">
                    <UCheckbox
                        :model-value="question.isOptional"
                        :label="$t('usage-analytics.isOptional')"
                        @update:model-value="(value: boolean) => emit('update:isOptional', value)"
                    />
                </UFormGroup>
            </div>
        </UForm>
    </div>
</template>
