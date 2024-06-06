<script setup lang="ts">
import { useRoute } from 'nuxt/app';

const { t } = useI18n();

import type ModelsTableRow from '~/interfaces/models-table-row';

const route = useRoute();

const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const pendingEdit = ref(false);

async function submit() {
    if (!isFormValid.value) return;

    pendingEdit.value = true;

    try {
        await $fetch(`/api/models/${route.params.id}`, {
            method: 'PUT',
            body: dataModelState.value,
        });

        showSuccessMessage(t('models.successEdit'));

        await navigateTo({
            path: '/models/',
        });
    } catch (error) {
        showErrorMessage(t('models.errors.edit'));
    } finally {
        pendingEdit.value = false;
    }
}

const isFormValid = computed(() => {
    return dataModelSchema.safeParse(dataModelState.value).success;
});

const { dataModelSchema, modelTypes } = useModelSchema();

const { data: dataModelState, pending } = await useLazyFetch<ModelsTableRow>(`/api/models/${route.params.id}`);
</script>

<template>
    <div class="w-full h-full space-y-6">
        <SubHeading :title="`${t('models.dmRepository.editModelWithID')} ${route.params.id}`" />
        <UCard v-if="!pending && dataModelState" class="flex flex-col">
            <div class="w-full">
                <UForm :schema="dataModelSchema" :state="dataModelState" class="space-y-5" @submit="submit">
                    <div class="flex flex-1">
                        <UFormGroup
                            class="w-2/4"
                            :label="$t('models.dmRepository.formTitle')"
                            required
                            name="title"
                            eager-validation
                        >
                            <UInput v-model="dataModelState.title" />
                        </UFormGroup>
                        <UFormGroup
                            class="ml-2 w-1/4"
                            :label="$t('models.dmRepository.modelType')"
                            required
                            name="model_type"
                            eager-validation
                        >
                            <USelectMenu
                                v-model="dataModelState.type"
                                :options="modelTypes"
                                option-attribute="label"
                                required
                            />
                        </UFormGroup>
                        <UFormGroup
                            class="ml-2 w-1/4"
                            :label="$t('models.dmRepository.formVersion')"
                            required
                            name="version"
                            eager-validation
                        >
                            <UInput v-model="dataModelState.version" />
                        </UFormGroup>
                    </div>
                    <UFormGroup
                        :label="$t('models.dmRepository.formDescription')"
                        required
                        name="description"
                        eager-validation
                    >
                        <UTextarea v-model="dataModelState.description" :rows="4" />
                    </UFormGroup>
                    <div class="flex justify-end flex-1">
                        <UButton
                            size="md"
                            color="primary"
                            variant="solid"
                            :label="$t('models.dmRepository.save')"
                            :disabled="pendingEdit"
                            type="submit"
                        />
                    </div>
                </UForm>
            </div>
        </UCard>
    </div>
</template>
