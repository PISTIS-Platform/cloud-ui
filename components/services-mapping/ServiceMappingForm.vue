<script lang="ts" setup>
import { z } from 'zod';

import type { RegisteredService } from '~/interfaces/services-registry';

const { t } = useI18n();

const props = defineProps({
    registeredService: {
        type: Object as () => RegisteredService,
        required: true,
    },
    shouldDisableButton: {
        type: Boolean,
        required: true,
    },
    shouldDisableName: {
        type: Boolean,
        default: false,
    },
});

const formRef = ref();

const emit = defineEmits(['submitForm']);

const body = reactive<RegisteredService>({
    ...props.registeredService,
    clientAuthentication: props.registeredService.clientAuthentication ?? true,
});

const schema = z.object({
    serviceName: z
        .string()
        .trim()
        .min(1, { message: t('required') }),
    serviceUrl: z
        .string()
        .trim()
        .min(1, { message: t('required') })
        .regex(new RegExp(/^[a-zA-Z0-9-/]+$/), { message: t('registry.servicesRegistry.invalidServiceUrl') }),
    sar: z.boolean().default(false),
    clientAuthentication: z
        .boolean()
        .default(true)
        .superRefine((val, ctx) => {
            if (!val && body.sar) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('registry.servicesRegistry.booleanError'),
                });
            }
        }),
});
const isFormValid = computed(() => {
    return schema.safeParse(body).success;
});

const navigateToMainPage = async () => {
    await navigateTo({
        path: '/factory-registry/services',
    });
};

const submitForm = async () => {
    if (!isFormValid.value) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...bodyInfo } = body;
    emit('submitForm', bodyInfo);
};

watch(
    body,
    () => {
        if (!body.sar && !body.clientAuthentication) {
            formRef.value.clear('clientAuthentication');
        }
    },
    { deep: true },
);
</script>

<template>
    <UCard class="w-full mt-6">
        <div>
            <UForm
                ref="formRef"
                class="flex flex-col justify-start items-start space-y-8 w-full"
                :state="body"
                :schema="schema"
            >
                <div class="flex flex-col justify-start items-start space-y-4 w-full">
                    <UFormGroup
                        :label="$t('registry.servicesRegistry.serviceName')"
                        required
                        name="serviceName"
                        class="w-full"
                    >
                        <UInput
                            v-model="body.serviceName"
                            :disabled="shouldDisableName"
                            :placeholder="$t('registry.servicesRegistry.serviceName')"
                            class="flex-1"
                            size="md"
                        />
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('registry.servicesRegistry.serviceUrl')"
                        required
                        name="serviceUrl"
                        class="w-full"
                    >
                        <UInput
                            v-model="body.serviceUrl"
                            :placeholder="$t('registry.servicesRegistry.serviceUrl')"
                            class="flex-1"
                            size="md"
                        />
                    </UFormGroup>
                    <UFormGroup :label="$t('registry.servicesRegistry.sar')" name="sarCheckbox" class="w-full">
                        <UCheckbox v-model="body.sar" name="sar" />
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('registry.servicesRegistry.clientAuthentication')"
                        name="clientAuthentication"
                        class="w-full"
                    >
                        <UCheckbox v-model="body.clientAuthentication" name="clientAuthentication" />
                    </UFormGroup>
                </div>
                <div class="flex gap-4 justify-between items-center mt-8">
                    <div class="flex gap-4">
                        <UButton
                            size="lg"
                            color="gray"
                            variant="solid"
                            :label="$t('cancel')"
                            :trailing="false"
                            @click="navigateToMainPage"
                        />
                    </div>

                    <UButton
                        size="lg"
                        :label="$t('save')"
                        color="primary"
                        variant="solid"
                        type="submit"
                        :loading="shouldDisableButton"
                        @click="submitForm"
                    />
                </div>
            </UForm>
        </div>
    </UCard>
</template>
