import { z } from 'zod';

import { MAX_CHARACTERS_TEXT_LIMIT } from '@/constants/validation';
import { QuestionType } from '~/interfaces/usage-analytics';

export const useQuestionSchema = () => {
    const { t } = useI18n();

    const questionTypes = [QuestionType.TEXT, QuestionType.CHECKBOX, QuestionType.RADIO] as const;
    const questionTypesEnum = z.enum(questionTypes);
    const questionType = ref('');

    const schema = z.object({
        title: z
            .string()
            .trim()
            .min(1, { message: t('required') })
            .max(MAX_CHARACTERS_TEXT_LIMIT, {
                message: t('validation.moreThanNumberChars', { count: MAX_CHARACTERS_TEXT_LIMIT }),
            }),
        type: z.enum(questionTypes, {
            errorMap: () => ({ message: t('validation.validValue', { name: 'question type' }) }),
        }),
        options: z
            .array(
                z.object({
                    text: z
                        .string()
                        .trim()
                        .min(1, { message: t('required') })
                        .max(MAX_CHARACTERS_TEXT_LIMIT, {
                            message: t('validation.moreThanNumberChars', { count: MAX_CHARACTERS_TEXT_LIMIT }),
                        }),
                }),
            )
            .refine(
                (options) => {
                    if (options.length < 2 && questionType.value !== QuestionType.TEXT) {
                        return false;
                    }

                    return true;
                },
                {
                    message: t('usage-analytics.optionsMinLength'),
                },
            ),
    });

    return {
        questionTypesEnum,
        questionType,
        schema,
    };
};
