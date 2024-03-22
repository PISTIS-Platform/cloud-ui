<script setup lang="ts">
import { useRoute } from 'nuxt/app';
import { ref } from 'vue';
import { z } from 'zod';

const { t } = useI18n();

import { ModelType } from '~/interfaces/model-type.enum';
import type ModelsTableRow from '~/interfaces/models-table-row';

const route = useRoute();

async function submit(/*event: FormSubmitEvent<any>*/) {
    // Do something with data
    console.log(dataModelState);
}

const modelTypes = [
    {
        value: ModelType.DATAMODEL,
        name: t('models.dmRepository.modelTypes.dataModel'),
    },
    {
        value: ModelType.METADATAMODEL,
        name: t('models.dmRepository.modelTypes.metadataModel'),
    },
    {
        value: ModelType.MONETISATIONMODEL,
        name: t('models.dmRepository.modelTypes.monetisationModel'),
    },
    {
        value: ModelType.PRETRAINEDAIMODEL,
        name: t('models.dmRepository.modelTypes.pretrainedAIModel'),
    },
];

const dataModelSchema = z.object({
    title: z.string().min(10, 'Must be at least 10 characters'),
    version: z.string(),
    description: z.string().min(20, 'Must be at least 10 characters'),
    type: z.enum(['Pre-trained AI model', 'Data Model', 'Monetisation Model', 'Metadata model']),
});

//Example of z schema
type DataModel = z.output<typeof dataModelSchema>;

const dataModelState = ref<DataModel>({
    title: '',
    version: '',
    description: '',
    type: 'Data Model',
});

//TODO: Replace with call for retrieving individual model with specific ID when we have real data
await useLazyFetch<{
    rows: ModelsTableRow[];
}>('/api/models/models-table', {
    onResponse(response) {
        const foundModel = response.response._data.find((item: ModelsTableRow) => String(item.id) === route.params.id);

        if (foundModel) {
            dataModelState.value.title = foundModel.title;
            dataModelState.value.version = foundModel.version;
            dataModelState.value.description = foundModel.description || '';
            dataModelState.value.type = modelTypes.find((modelType) => modelType.value === foundModel.type)
                ?.value as ModelType;
        }
    },
});
</script>

<template>
    <div class="w-full h-full space-y-6">
        <SubHeading :title="`${t('models.dmRepository.editModelWithID')} ${route.params.id}`" />
        <UCard class="flex flex-col">
            <div class="w-full">
                <UForm :schema="dataModelSchema" :state="dataModelState" class="space-y-5" @submit="submit">
                    <div class="flex flex-1">
                        <UFormGroup class="w-2/4" :label="$t('models.dmRepository.formTitle')" required name="title">
                            <UInput v-model="dataModelState.title" />
                        </UFormGroup>
                        <UFormGroup
                            class="ml-2 w-1/4"
                            :label="$t('models.dmRepository.modelType')"
                            required
                            name="model_type"
                        >
                            <USelect
                                v-model="dataModelState.type"
                                :options="modelTypes"
                                option-attribute="name"
                                required
                            />
                        </UFormGroup>
                        <UFormGroup
                            class="ml-2 w-1/4"
                            :label="$t('models.dmRepository.formVersion')"
                            required
                            name="version"
                        >
                            <UInput v-model.number="dataModelState.version" type="numeric" />
                        </UFormGroup>
                    </div>
                    <UFormGroup :label="$t('models.dmRepository.formDescription')" required name="description">
                        <UTextarea v-model="dataModelState.description" :rows="4" />
                    </UFormGroup>
                    <div class="flex justify-end flex-1">
                        <UButton
                            size="md"
                            color="primary"
                            variant="solid"
                            :label="$t('models.dmRepository.save')"
                            type="submit"
                        />
                    </div>
                </UForm>
            </div>
        </UCard>
    </div>
</template>
