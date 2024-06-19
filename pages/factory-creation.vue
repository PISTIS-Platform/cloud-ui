<script setup lang="ts">
const { t } = useI18n();

import { z } from 'zod';

const schema = z.object({
    organizationName: z.string(),
    organizationId: z.string(),
    country: z.string(),
    factoryPrefix: z.string(),
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

const onSubmit = () => {
    console.log('submitted');
};
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <UCard :ui="{ base: 'w-full text-gray-700' }">
                <template #header>
                    <SubHeading :title="t('registry.createFactory')" />
                </template>
                <div class="flex w-full">
                    <UForm :schema="schema" :state="state" class="space-y-4 w-full flex flex-col" @submit="onSubmit">
                        <div class="flex w-full items-center gap-4">
                            <UFormGroup
                                :label="t('registry.organizationName')"
                                name="organizationName"
                                required
                                class="w-full"
                            >
                                <UInput v-model="state.organizationName" />
                            </UFormGroup>
                            <!--TODO: Will the ID be uuid v4?-->
                            <UFormGroup
                                :label="t('registry.organizationId')"
                                name="organizationId"
                                required
                                class="w-full"
                            >
                                <UInput v-model="state.organizationId" />
                            </UFormGroup>
                        </div>
                        <div class="flex w-full items-center gap-4">
                            <UFormGroup :label="t('registry.country')" name="country" required class="w-full">
                                <UInput v-model="state.country" />
                            </UFormGroup>
                            <UFormGroup
                                :label="t('registry.factoryPrefix')"
                                name="factoryPrefix"
                                required
                                class="w-full"
                            >
                                <div class="w-full flex items-center">
                                    <UButton
                                        color="white"
                                        :ui="{ color: { white: { solid: 'hover:bg-white' } } }"
                                        class="text-gray-400 cursor-default hover:none rounded-l-lg rounded-r-none"
                                        >https://</UButton
                                    >
                                    <UInput
                                        v-model="state.factoryPrefix"
                                        :ui="{ rounded: 'rounded-none' }"
                                        class="w-full"
                                    />
                                    <UButton
                                        color="white"
                                        :ui="{ color: { white: { solid: 'hover:bg-white' } } }"
                                        class="text-gray-400 cursor-default rounded-l-none rounded-r-lg"
                                        >.pistis-project.eu</UButton
                                    >
                                </div>
                            </UFormGroup>
                        </div>
                        <div class="w-1/2 items-center flex gap-4">
                            <UFormGroup :label="t('registry.ip')" name="ip" class="w-full">
                                <UInput v-model="state.ip" />
                            </UFormGroup>
                            <UFormGroup :label="t('registry.factoryAccepted')" name="isAccepted" class="w-44">
                                <div class="w-full items-center justify-center flex h-full">
                                    <UToggle v-model="state.isAccepted" class="-ml-3" />
                                </div>
                            </UFormGroup>
                        </div>

                        <UButton type="submit" :disabled="!schema.safeParse(state).success" class="w-[120px]"
                            >Create Factory</UButton
                        >
                    </UForm>
                </div>
            </UCard>
        </PageContainer>
    </div>
</template>
