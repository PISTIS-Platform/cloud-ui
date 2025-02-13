<script setup lang="ts">
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const { t } = useI18n();

import { z } from 'zod';

const router = useRouter();

const schema = z.object({
    organizationName: z.string({
        required_error: t('required'),
        invalid_type_error: t('string'),
    }),
    type: z.string({
        required_error: t('required'),
        invalid_type_error: t('string'),
    }),
    domain: z.string({
        required_error: t('required'),
        invalid_type_error: t('string'),
    }),
    country: z.string({
        required_error: t('required'),
        invalid_type_error: t('string'),
    }),
    size: z.string({
        required_error: t('required'),
        invalid_type_error: t('string'),
    }),
    adminFirstName: z.string({
        required_error: t('required'),
        invalid_type_error: t('string'),
    }),
    adminLastName: z.string({
        required_error: t('required'),
        invalid_type_error: t('string'),
    }),
    adminEmail: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .email(),
    factoryPrefix: z.string({
        required_error: t('required'),
        invalid_type_error: t('string'),
    }),
    isAccepted: z.boolean(),
    ip: z
        .string()
        .ip({ version: 'v4', message: t('registry.registration.invalidIP') })
        .optional(),
});

const state = reactive({
    organizationName: undefined,
    type: undefined,
    domain: undefined,
    country: undefined,
    size: undefined,
    adminFirstName: undefined,
    adminLastName: undefined,
    adminEmail: undefined,
    factoryPrefix: undefined,
    isAccepted: false,
    ip: undefined,
});

const onSubmit = async () => {
    try {
        await $fetch(`/api/factories-registry/create-factory`, {
            method: 'post',
            body: { ...state, status: 'pending' },
        });

        showSuccessMessage(t('registry.factoryCreated'));
        router.back();
    } catch {
        showErrorMessage(t('registry.factoryError'));
    }
};
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <UCard :ui="{ base: 'w-full text-gray-700' }">
                <template #header>
                    <SubHeading :title="t('registry.createFactory')" />
                </template>
                <div class="flex w-full gap-4 divide-x h-full">
                    <UForm :schema="schema" :state="state" class="w-full flex gap-12" @submit="onSubmit">
                        <!-- Left side-->
                        <div class="flex flex-col gap-4 w-1/2">
                            <UFormGroup
                                :label="t('registry.organizationName')"
                                name="organizationName"
                                required
                                class="w-full pb-2"
                                :ui="{ error: 'absolute -bottom-6' }"
                            >
                                <UInput
                                    v-model="state.organizationName"
                                    :placeholder="t('registry.organizationNamePlaceholder')"
                                />
                            </UFormGroup>
                            <!--TODO: Will the ID be uuid v4?-->
                            <UFormGroup
                                :label="t('registry.organizationId')"
                                name="organizationId"
                                required
                                class="w-full pb-2"
                                :ui="{ error: 'absolute -bottom-6' }"
                            >
                                <UInput
                                    v-model="state.organizationId"
                                    :placeholder="t('registry.organizationIdPlaceholder')"
                                />
                            </UFormGroup>
                            <div class="flex w-full items-center gap-4 pb-2">
                                <UFormGroup
                                    :label="t('registry.country')"
                                    :ui="{ error: 'absolute -bottom-6' }"
                                    name="country"
                                    required
                                    class="w-full max-w-20"
                                >
                                    <UInput v-model="state.country" :placeholder="t('registry.countryPlaceholder')" />
                                </UFormGroup>
                            </div>

                            <div class="flex gap-2">
                                <UButton color="white" :to="'factory-registry'">{{ t('goBack') }}</UButton>
                                <UButton type="submit" :disabled="!schema.safeParse(state).success" class="w-[120px]">{{
                                    t('registry.createFactory')
                                }}</UButton>
                            </div>
                        </div>

                        <!-- Right side-->
                        <div class="flex flex-col gap-4 w-1/2">
                            <UFormGroup
                                :label="t('registry.factoryPrefix')"
                                name="factoryPrefix"
                                required
                                class="w-full"
                                :ui="{ error: 'absolute -bottom-6' }"
                            >
                                <div class="w-full flex items-center">
                                    <UButton
                                        tabindex="-1"
                                        color="white"
                                        :ui="{ color: { white: { solid: 'hover:bg-gray-100 bg-gray-100' } } }"
                                        class="text-gray-500 cursor-default hover:none rounded-l-md rounded-r-none"
                                        >https://</UButton
                                    >
                                    <UInput
                                        v-model="state.factoryPrefix"
                                        :ui="{ rounded: 'rounded-none' }"
                                        class="w-full"
                                        :placeholder="t('registry.factoryPrefixPlaceholder')"
                                    />
                                    <UButton
                                        tabindex="-1"
                                        color="white"
                                        :ui="{ color: { white: { solid: 'hover:bg-gray-100 bg-gray-100' } } }"
                                        class="text-gray-500 cursor-default rounded-l-none rounded-r-md"
                                        >.pistis-market.eu</UButton
                                    >
                                </div>
                            </UFormGroup>
                            <div class="w-full items-center flex gap-4 mt-2">
                                <UFormGroup
                                    :label="t('registry.ip')"
                                    name="ip"
                                    class="w-full"
                                    :ui="{ error: 'absolute -bottom-6' }"
                                >
                                    <UInput v-model="state.ip" :placeholder="t('registry.ipPlaceholder')" />
                                </UFormGroup>
                                <UFormGroup
                                    :label="t('registry.factoryAccepted')"
                                    name="isAccepted"
                                    class="w-44"
                                    :ui="{ error: 'absolute -bottom-6' }"
                                >
                                    <div class="w-full items-center justify-center flex h-full">
                                        <UToggle v-model="state.isAccepted" class="-ml-3" />
                                    </div>
                                </UFormGroup>
                            </div>
                        </div>
                    </UForm>
                </div>
            </UCard>
        </PageContainer>
    </div>
</template>
