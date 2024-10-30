<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';

const { t } = useI18n();

import type { QuestionAnswer, SelectedOption } from '~/interfaces/usage-analytics';
import { MAX_CHARACTERS_TEXT_LIMIT, QuestionType } from '~/interfaces/usage-analytics';

const props = defineProps({
    answer: {
        type: Object as () => QuestionAnswer,
        required: true,
    },
});

const emit = defineEmits(['update:text', 'update:selectedOptions', 'isValid']);

// Schema for all the inputs
const schema = computed(() => {
    if (props.answer.questionType === QuestionType.TEXT) {
        return z.object({
            text: z
                .string()
                .trim()
                .max(MAX_CHARACTERS_TEXT_LIMIT, {
                    message: t('validation.moreThanNumberChars', { count: MAX_CHARACTERS_TEXT_LIMIT }),
                })
                .refine(
                    (value) => {
                        if (props.answer.question?.isRequired && !value.length) {
                            return false;
                        }

                        return true;
                    },
                    {
                        message: t('validation.required'),
                    },
                ),
        });
    }

    return z.object({
        selectedOptions: z.array(z.string()).refine(
            (options) => {
                if (props.answer.question?.isRequired && !options.length) {
                    return false;
                }

                return true;
            },
            {
                message: t('usage-analytics.selectedOptionsMinLength'),
            },
        ),
    });
});

//check if inputs are valid
const isValid = computed(() => {
    return schema.value.safeParse(props.answer).success;
});

watch(isValid, () => {
    emit('isValid', isValid.value);
});

const availableOptions = ref<SelectedOption[]>(props.answer?.availableOptions || []);
const selectedOptions = ref<string[]>([]);

const selectedRadioOption = ref<string>('');

const updateCheckboxSelectedOptions = (id: string | number, isSelected: boolean) => {
    const optionObject = availableOptions.value.find((o: SelectedOption) => o.id === id);

    if (!optionObject) {
        return;
    }

    optionObject.isSelected = isSelected;

    selectedOptions.value = availableOptions.value
        .filter((o: SelectedOption) => o.isSelected)
        .map((o: SelectedOption) => o.value);

    // emit only options who are selected
    emit('update:selectedOptions', selectedOptions.value);
};
</script>

<template>
    <div class="w-full">
        <UForm :state="props.answer" :schema="schema">
            <!-- Display Content based on question type -->

            <!-- Text based Question -->
            <div v-if="props.answer.questionType === QuestionType.TEXT">
                <UFormGroup name="text">
                    <UTextarea
                        :model-value="answer.text"
                        :placeholder="$t('usage-analytics.answerTextInfo')"
                        class="w-full flex-1"
                        @update:model-value="(value: string) => emit('update:text', value)"
                    />
                </UFormGroup>
            </div>

            <div v-else-if="props.answer.questionType === QuestionType.CHECKBOX">
                <UFormGroup name="selectedOptions">
                    <div class="flex gap-6">
                        <div v-for="option in answer?.availableOptions" :key="option.id">
                            <UCheckbox
                                :model-value="option.isSelected"
                                :label="option.value"
                                @update:model-value="
                                    (value: boolean) => updateCheckboxSelectedOptions(option.id, value)
                                "
                            />
                        </div>
                    </div>
                </UFormGroup>
            </div>

            <div v-else>
                <UFormGroup name="selectedOptions">
                    <div class="flex gap-6">
                        <URadio
                            v-for="option of answer?.availableOptions"
                            :key="option.id"
                            :model-value="selectedRadioOption"
                            v-bind="option"
                            :label="option.value"
                            @update:model-value="(value: string) => emit('update:selectedOptions', [value])"
                        />
                    </div>
                </UFormGroup>
            </div>
        </UForm>
    </div>
</template>
