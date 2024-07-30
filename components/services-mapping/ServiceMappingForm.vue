<script lang="ts" setup>
import { z } from 'zod';

import type { RegisteredService } from '~/interfaces/services-registry';

const { t } = useI18n();

const sarCheckbox = ref(false);

const props = defineProps({
    registeredService: {
        type: Object as () => RegisteredService,
        required: true,
    },
    shouldDisableButton: {
        type: Boolean,
        required: true,
    },
});
const emit = defineEmits(['submitForm']);

const body = ref<RegisteredService>({
    ...props.registeredService,
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
    sarCheckbox: z.boolean().optional(),
});

const isFormValid = computed(() => {
    return schema.safeParse(body.value).success;
});

const navigateToMainPage = async () => {
    await navigateTo({
        path: '/factory-registry/services',
    });
};

const submitForm = async () => {
    if (!isFormValid.value) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...bodyInfo } = body.value;

    emit('submitForm', bodyInfo);
};
</script>

<template>
    <UCard class="w-full mt-6">
        <div>
            <UForm class="flex flex-col justify-start items-start space-y-8 w-full" :state="body" :schema="schema">
                <div class="flex flex-col justify-start items-start space-y-4 w-full">
                    <UFormGroup
                        :label="$t('registry.servicesRegistry.serviceName')"
                        required
                        name="serviceName"
                        class="w-full"
                    >
                        <UInput
                            v-model="body.serviceName"
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
                        <UCheckbox v-model="sarCheckbox" name="sar" />
                    </UFormGroup>
                </div>
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
                    </div>

                    <UTooltip :text="$t('save')">
                        <UButton
                            size="lg"
                            :label="$t('save')"
                            color="primary"
                            variant="solid"
                            type="submit"
                            :loading="shouldDisableButton"
                            @click="submitForm"
                        />
                    </UTooltip>
                </div>
            </UForm>
        </div>
    </UCard>
</template>
