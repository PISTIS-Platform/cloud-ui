import { z } from 'zod';

import { ModelType } from '~/interfaces/model-type.enum';
import type Selection from '~/interfaces/selection';

export const useModelSchema = (withFile = false) => {
    const { t } = useI18n();

    const modelTypes: Selection[] = [
        {
            value: ModelType.DATAMODEL,
            label: t('models.dmRepository.modelTypes.dataModel'),
        },
        {
            value: ModelType.METADATAMODEL,
            label: t('models.dmRepository.modelTypes.metadataModel'),
        },
        {
            value: ModelType.MONETISATIONMODEL,
            label: t('models.dmRepository.modelTypes.monetisationModel'),
        },
        {
            value: ModelType.PRETRAINEDAIMODEL,
            label: t('models.dmRepository.modelTypes.pretrainedAIModel'),
        },
    ];

    const modelValues = modelTypes.map((item: Selection) => item.value) as [string, ...string[]];

    const dataModelSchema = z.object({
        title: z.string().min(10, t('models.errors.atLeast10')),
        version: z.string().min(1, t('models.errors.version')),
        description: z.string().min(10, t('models.errors.atLeast10')),
        type: z.enum(modelValues, {
            errorMap: () => ({ message: t('models.errors.validModelType') }),
        }),
        data: withFile ? z.instanceof(File, { message: t('models.errors.validFile') }) : z.optional(z.instanceof(File)),
    });

    return {
        dataModelSchema,
        modelTypes,
    };
};
