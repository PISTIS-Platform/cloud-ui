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
                <div class="flex flex-col gap-4">
                    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                        <UFormGroup :label="t('registry.organizationName')" name="organizationName" required>
                            <UInput v-model="state.organizationName" />
                        </UFormGroup>
                        <!--TODO: Will the ID be uuid v4?-->
                        <UFormGroup :label="t('registry.organizationId')" name="organizationId" required>
                            <UInput v-model="state.organizationId" />
                        </UFormGroup>
                        <UFormGroup :label="t('registry.country')" name="country" required>
                            <UInput v-model="state.country" />
                        </UFormGroup>
                        <UFormGroup :label="t('registry.factoryPrefix')" name="factoryPrefix" required>
                            <UInput v-model="state.factoryPrefix" />
                        </UFormGroup>
                        <UFormGroup :label="t('registry.factoryAccepted')" name="isAccepted">
                            <UToggle v-model="state.isAccepted" />
                        </UFormGroup>
                        <UFormGroup :label="t('registry.ip')" name="ip">
                            <UInput v-model="state.ip" />
                        </UFormGroup>

                        <UButton type="submit" :disabled="!schema.safeParse(state).success">Create Factory</UButton>
                    </UForm>
                </div>
            </UCard>
        </PageContainer>
    </div>
</template>
