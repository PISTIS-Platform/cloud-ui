<script setup lang="ts">
import { ref } from 'vue';

import { ModelType } from '~/interfaces/model-type.enum';
import type ModelsTableRow from '~/interfaces/models-table-row';

const isDragging = ref<boolean>(false);
const file = ref();
const uploaded = ref();
const isValidFile = ref<boolean>(false);

const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const { t } = useI18n();

const { dataModelSchema, modelTypes } = useModelSchema(true);

const dataModelState = ref<ModelsTableRow>({
    title: '',
    version: '',
    description: '',
    data: null,
    type: '' as ModelType,
});

function onChange() {
    uploaded.value = file.value.files[0];

    if (uploaded.value?.name.length) {
        isValidFile.value = true;
        dataModelState.value.data = uploaded.value;
        uploadForm.value.clear('data');
    } else {
        isValidFile.value = false;
        uploaded.value = null;
        file.value = null;
        dataModelState.value.data = null;
        uploadForm.value.setErrors([{ message: t('models.errors.validFile'), path: 'data' }]);
    }
}

function dragover(e: Event) {
    e.preventDefault();
    isDragging.value = true;
}

function dragleave() {
    isDragging.value = false;
}

function drop(e: any) {
    e.preventDefault();
    file.value = e.dataTransfer;
    onChange();
    isDragging.value = false;
}

const pendingUpload = ref(false);

const body = computed(() => {
    if (!uploaded.value) return null;
    const formData = new FormData();
    formData.append('data', uploaded.value);
    formData.append('title', dataModelState.value.title.toString());
    formData.append('description', dataModelState.value.description);
    formData.append('type', dataModelState.value.type.toString());
    formData.append('version', dataModelState.value.version.toString());
    return formData;
});

const uploadForm = ref();

const isFormValid = computed(() => {
    return dataModelSchema.safeParse(dataModelState.value).success;
});

const uploadFile = async () => {
    if (!isFormValid.value) return;

    pendingUpload.value = true;

    try {
        await $fetch('/api/models/upload', {
            method: 'POST',
            body: body.value,
        });

        showSuccessMessage(t('models.successUpload'));

        await navigateTo({
            path: '/models/',
        });
    } catch (error) {
        showErrorMessage(t('models.errors.upload'));
    } finally {
        pendingUpload.value = false;
    }
};
</script>

<template>
    <div class="w-full h-full space-y-6">
        <UCard class="flex flex-col">
            <div class="w-full">
                <UForm ref="uploadForm" :schema="dataModelSchema" :state="dataModelState" class="space-y-5">
                    <UFormGroup :label="$t('models.dmRepository.select') + ':'" name="data" required>
                        <div class="">
                            <div
                                class="flex justify-center rounded-md border-2 border-dashed border-gray-300 py-5"
                                @dragover="dragover"
                                @dragleave="dragleave"
                                @drop="drop"
                            >
                                <div class="text-center flex flex-col items-center space-y-2">
                                    <label
                                        for="data"
                                        class="relative cursor-pointer rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <UIcon class="box-content h-8 w-8" name="i-heroicons-arrow-up-circle-solid" />
                                    </label>
                                    <div class="flex text-sm text-gray-600 space-x-1">
                                        <label
                                            for="data"
                                            class="relative cursor-pointer rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span v-if="!isDragging">{{ $t('models.dmRepository.select') }}</span>
                                            <input
                                                id="data"
                                                ref="file"
                                                name="data"
                                                type="file"
                                                class="sr-only"
                                                @change="onChange"
                                            />
                                        </label>
                                        <p v-if="!isDragging" class="">{{ $t('models.dmRepository.drag') }}</p>
                                    </div>
                                    <p v-if="!uploaded" class="text-xs text-gray-500">
                                        {{ $t('models.dmRepository.noFile') }}
                                    </p>
                                    <p v-if="uploaded && isValidFile" class="text-xs text-gray-900">
                                        {{ $t('models.dmRepository.fileName') }} {{ uploaded.name }}
                                    </p>
                                    <p v-if="uploaded && !isValidFile" class="text-xs text-red-500">
                                        {{ $t('models.dmRepository.invalid') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </UFormGroup>
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
                            name="type"
                            eager-validation
                        >
                            <USelectMenu
                                v-model="dataModelState.type"
                                :options="modelTypes"
                                option-attribute="label"
                                value-attribute="value"
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
                            type="submit"
                            :label="$t('models.dmRepository.uploadButton')"
                            :disabled="pendingUpload"
                            @click="uploadFile"
                        />
                    </div>
                </UForm>
            </div>
        </UCard>
    </div>
</template>
