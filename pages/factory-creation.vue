<script setup lang="ts">
const { showSuccessMessage, showErrorMessage } = useAlertMessage();

const { t } = useI18n();

import { z } from 'zod';

const router = useRouter();

const schema = z.object({
    organizationName: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .min(1, { message: t('required') }),
    type: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .min(1, { message: t('required') }),
    domain: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .min(1, { message: t('required') }),
    country: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .min(1, { message: t('required') }),
    size: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .min(1, { message: t('required') }),
    adminFirstName: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .min(1, { message: t('required') }),
    adminLastName: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .min(1, { message: t('required') }),
    adminEmail: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .email(),
    factoryPrefix: z
        .string({
            required_error: t('required'),
            invalid_type_error: t('string'),
        })
        .min(1, { message: t('required') }),
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

const typeOptions = ref();

const domainOptions = ref();

// const countryOptions = Object.keys(countriesInEnglish).map((countryCode: string) => ({
//     label: t('registry.countries.' + countryCode),
//     value: countryCode,
// }));

const countryOptions = ref([]);

const sizeOptions = ref();

useLazyFetch(`/api/factories-registry/get-lists`, {
    onResponse({ response }) {
        typeOptions.value = response._data.types;
        domainOptions.value = response._data.domains;
        sizeOptions.value = response._data.sizes;
        countryOptions.value = response._data.countries;
    },
});

const isValid = computed(() => schema.safeParse(state).success);

const onSubmit = async () => {
    if (!isValid.value) {
        showErrorMessage(t('registry.pleaseCheckForm'));
        return;
    }
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
                    <UForm :schema="schema" :state="state" class="w-full flex flex-col gap-4" @submit="onSubmit">
                        <div class="w-full flex gap-12 flex-wrap lg:flex-nowrap">
                            <!-- Left side-->
                            <div class="flex flex-col gap-4 w-full lg:w-1/2">
                                <span class="font-semibold text-gray-600">{{
                                    $t('registry.organizationDetails')
                                }}</span>
                                <span class="text-xs text-gray-400 -mt-3 mb-2">{{
                                    $t('registry.organizationDetailsDescription')
                                }}</span>
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
                                <div class="flex items-start gap-4 w-full">
                                    <UFormGroup
                                        :label="$t('registry.type')"
                                        required
                                        name="type"
                                        class="w-full"
                                        :ui="{ error: 'absolute -bottom-6' }"
                                    >
                                        <USelectMenu
                                            v-model="state.type"
                                            :options="typeOptions"
                                            :placeholder="t('registry.select') + ' ' + t('registry.type')"
                                            value-attribute="code"
                                            option-attribute="title"
                                        />
                                    </UFormGroup>
                                    <UFormGroup
                                        :label="$t('registry.domain')"
                                        required
                                        name="domain"
                                        class="w-full"
                                        :ui="{ error: 'absolute -bottom-6' }"
                                    >
                                        <USelectMenu
                                            v-model="state.domain"
                                            :options="domainOptions"
                                            :placeholder="t('registry.select') + ' ' + t('registry.domain')"
                                            value-attribute="code"
                                            option-attribute="title"
                                        />
                                    </UFormGroup>
                                </div>
                                <div class="flex items-start gap-4 w-full mt-2">
                                    <UFormGroup
                                        :label="$t('registry.country')"
                                        required
                                        name="country"
                                        class="w-full"
                                        :ui="{ error: 'absolute -bottom-6' }"
                                    >
                                        <USelectMenu
                                            v-model="state.country"
                                            searchable
                                            :searchable-placeholder="$t('registry.searchForACountry')"
                                            :options="countryOptions"
                                            :placeholder="t('registry.select') + ' ' + t('registry.country')"
                                            value-attribute="code"
                                            option-attribute="title"
                                        />
                                    </UFormGroup>
                                    <UFormGroup
                                        :label="$t('registry.size')"
                                        required
                                        name="size"
                                        class="w-full"
                                        :ui="{ error: 'absolute -bottom-6' }"
                                    >
                                        <USelectMenu
                                            v-model="state.size"
                                            :options="sizeOptions"
                                            :placeholder="t('registry.select') + ' ' + t('registry.size')"
                                            value-attribute="code"
                                            option-attribute="title"
                                        />
                                    </UFormGroup>
                                </div>
                                <div class="flex flex-col gap-4 mt-8">
                                    <span class="font-semibold text-gray-600">{{
                                        $t('registry.organizationAdmin')
                                    }}</span>
                                    <span class="text-xs text-gray-400 -mt-3 mb-2">{{
                                        $t('registry.organizationAdminDescription')
                                    }}</span>
                                    <div class="flex items-start gap-4">
                                        <UFormGroup
                                            :label="t('registry.firstName')"
                                            name="adminFirstName"
                                            required
                                            class="w-full pb-2"
                                            :ui="{ error: 'absolute -bottom-6' }"
                                        >
                                            <UInput
                                                v-model="state.adminFirstName"
                                                class="w-full"
                                                :placeholder="t('firstName')"
                                            />
                                        </UFormGroup>
                                        <UFormGroup
                                            :label="t('registry.lastName')"
                                            name="adminLastName"
                                            required
                                            class="w-full pb-2"
                                            :ui="{ error: 'absolute -bottom-6' }"
                                        >
                                            <UInput
                                                v-model="state.adminLastName"
                                                class="w-full"
                                                :placeholder="t('lastName')"
                                            />
                                        </UFormGroup>
                                    </div>
                                    <UFormGroup
                                        :label="t('email')"
                                        name="adminEmail"
                                        required
                                        class="w-full pb-2"
                                        :ui="{ error: 'absolute -bottom-6' }"
                                    >
                                        <UInput
                                            v-model="state.adminEmail"
                                            class="w-full"
                                            :placeholder="t('emailOfAdmin')"
                                        />
                                    </UFormGroup>
                                </div>
                            </div>
                            <!-- Right side-->
                            <div class="flex flex-col gap-4 w-full lg:w-1/2">
                                <span class="font-semibold text-gray-600">{{ $t('registry.factoryDetails') }}</span>
                                <span class="text-xs text-gray-400 -mt-3 mb-2">{{
                                    $t('registry.factoryDetailsDescription')
                                }}</span>
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
                                        :ui="{ error: 'absolute -bottom-6' }"
                                    >
                                        <div class="w-full items-center justify-center flex h-full">
                                            <UToggle v-model="state.isAccepted" />
                                        </div>
                                    </UFormGroup>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2 w-full justify-end mt-6">
                            <UButton color="white" :to="'factory-registry'">{{ t('goBack') }}</UButton>
                            <UButton type="submit" :disabled="!schema.safeParse(state).success" class="w-[120px]">{{
                                t('registry.createFactory')
                            }}</UButton>
                        </div>
                    </UForm>
                </div>
            </UCard>
        </PageContainer>
    </div>
</template>
