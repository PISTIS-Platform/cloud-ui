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
    organizationId: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .uuid({ message: t('invalidUUID') }),
    country: z.string({
        required_error: t('required'),
        invalid_type_error: t('string'),
    }),
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
    organizationId: undefined,
    country: undefined,
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
                <div class="flex w-full gap-4 divide-x">
                    <UForm :schema="schema" :state="state" class="space-y-4 w-2/3 flex flex-col" @submit="onSubmit">
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
                            <UFormGroup
                                :label="t('registry.factoryPrefix')"
                                name="factoryPrefix"
                                required
                                class="w-full"
                                :ui="{ error: 'absolute -bottom-6' }"
                            >
                                <div class="w-full flex items-center">
                                    <UButton
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
                                        color="white"
                                        :ui="{ color: { white: { solid: 'hover:bg-gray-100 bg-gray-100' } } }"
                                        class="text-gray-500 cursor-default rounded-l-none rounded-r-md"
                                        >.pistis-project.eu</UButton
                                    >
                                </div>
                            </UFormGroup>
                        </div>
                        <div class="w-full items-center flex gap-4 pb-2">
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

                        <div class="flex gap-2">
                            <UButton color="white" :to="'factory-registry'">{{ t('goBack') }}</UButton>
                            <UButton type="submit" :disabled="!schema.safeParse(state).success" class="w-[120px]">{{
                                t('registry.createFactory')
                            }}</UButton>
                        </div>
                    </UForm>
                    <div class="h-full flex items-center justify-center p-4 w-1/3">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil impedit perferendis aperiam
                            corrupti sit aliquam repellat veritatis enim asperiores accusamus ullam laudantium
                            architecto, nostrum nisi nam a eligendi quisquam officiis. Veritatis, totam itaque placeat
                            eos deleniti voluptatum obcaecati voluptatibus? Delectus temporibus impedit in perferendis
                            magni facere quos, illum ipsam debitis aspernatur facilis sunt accusamus dolores accusantium
                            ipsa optio a soluta.
                        </p>
                    </div>
                </div>
            </UCard>
        </PageContainer>
    </div>
</template>
