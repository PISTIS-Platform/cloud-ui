<script setup lang="ts">
import type { Group } from '~/interfaces/ape/group';
import type { AttributeOption } from '~/interfaces/ape/attribute';

const { t } = useI18n();
const route = useRoute();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();
const { groupSchema } = useGroupSchema();

const groupId = route.params.id as string;

const formRef = ref();
const pending = ref(false);

const { data: group, error: fetchError } = await useFetch<Group>(`/api/ape/groups/${groupId}`);

const state = ref({
    name: '',
    prefix: '',
    country: '',
    domain: '',
    size: '',
    type: '',
});

watch(
    group,
    (newGroup) => {
        if (newGroup) {
            state.value = {
                name: newGroup.name,
                prefix: newGroup.prefix,
                country: newGroup.attributes?.country || '',
                domain: newGroup.attributes?.domain || '',
                size: newGroup.attributes?.size || '',
                type: newGroup.attributes?.type || '',
            };
        }
    },
    { immediate: true },
);

const { data: countries } = await useLazyFetch<AttributeOption[]>('/api/ape/attributes/countries');
const { data: domains } = await useLazyFetch<AttributeOption[]>('/api/ape/attributes/domains');
const { data: sizes } = await useLazyFetch<AttributeOption[]>('/api/ape/attributes/sizes');
const { data: types } = await useLazyFetch<AttributeOption[]>('/api/ape/attributes/types');

const countryOptions = computed(() =>
    (countries.value || []).map((c) => ({ value: c.code, label: c.title })),
);
const domainOptions = computed(() =>
    (domains.value || []).map((d) => ({ value: d.code, label: d.title })),
);
const sizeOptions = computed(() =>
    (sizes.value || []).map((s) => ({ value: s.code, label: s.title })),
);
const typeOptions = computed(() =>
    (types.value || []).map((t) => ({ value: t.code, label: t.title })),
);

const isFormValid = computed(() => groupSchema.safeParse(state.value).success);

const submit = async () => {
    if (!isFormValid.value) return;

    pending.value = true;

    try {
        await $fetch(`/api/ape/groups/${groupId}`, {
            method: 'PUT',
            body: {
                name: state.value.name,
                prefix: state.value.prefix,
                attributes: {
                    country: state.value.country || undefined,
                    domain: state.value.domain || undefined,
                    size: state.value.size || undefined,
                    type: state.value.type || undefined,
                },
            },
        });

        showSuccessMessage(t('ape.organizations.updateSuccess'));
        await navigateTo('/ape');
    } catch {
        showErrorMessage(t('ape.organizations.updateError'));
    } finally {
        pending.value = false;
    }
};
</script>

<template>
    <div class="w-full h-full text-gray-700">
        <ErrorCard v-if="fetchError" :error-msg="fetchError.data?.message ?? t('ape.organizations.fetchError')" />
        <UCard v-else>
            <template #header>
                <div class="flex items-center gap-2">
                    <UButton
                        variant="ghost"
                        icon="i-heroicons-arrow-left"
                        to="/ape"
                    />
                    <h2 class="text-lg font-semibold">{{ t('ape.organizations.editTitle') }}</h2>
                </div>
            </template>

            <UForm ref="formRef" :schema="groupSchema" :state="state" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UFormGroup :label="t('ape.organizations.name')" name="name" required>
                        <UInput
                            v-model="state.name"
                            :placeholder="t('ape.organizations.namePlaceholder')"
                        />
                    </UFormGroup>

                    <UFormGroup :label="t('ape.organizations.prefix')" name="prefix" required>
                        <UInput
                            v-model="state.prefix"
                            :placeholder="t('ape.organizations.prefixPlaceholder')"
                        />
                    </UFormGroup>
                </div>

                <div class="border-t pt-4">
                    <h3 class="text-md font-medium mb-4">{{ t('ape.organizations.attributes') }}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UFormGroup :label="t('ape.organizations.country')" name="country">
                            <USelectMenu
                                v-model="state.country"
                                :options="countryOptions"
                                :placeholder="t('ape.organizations.selectCountry')"
                                value-attribute="value"
                                option-attribute="label"
                                searchable
                            />
                        </UFormGroup>

                        <UFormGroup :label="t('ape.organizations.domain')" name="domain">
                            <USelectMenu
                                v-model="state.domain"
                                :options="domainOptions"
                                :placeholder="t('ape.organizations.selectDomain')"
                                value-attribute="value"
                                option-attribute="label"
                            />
                        </UFormGroup>

                        <UFormGroup :label="t('ape.organizations.size')" name="size">
                            <USelectMenu
                                v-model="state.size"
                                :options="sizeOptions"
                                :placeholder="t('ape.organizations.selectSize')"
                                value-attribute="value"
                                option-attribute="label"
                            />
                        </UFormGroup>

                        <UFormGroup :label="t('ape.organizations.type')" name="type">
                            <USelectMenu
                                v-model="state.type"
                                :options="typeOptions"
                                :placeholder="t('ape.organizations.selectType')"
                                value-attribute="value"
                                option-attribute="label"
                            />
                        </UFormGroup>
                    </div>
                </div>

                <div class="flex justify-end gap-2 pt-4">
                    <UButton color="white" to="/ape">
                        {{ $t('cancel') }}
                    </UButton>
                    <UButton
                        type="submit"
                        :loading="pending"
                        :disabled="!isFormValid"
                        @click="submit"
                    >
                        {{ $t('save') }}
                    </UButton>
                </div>
            </UForm>
        </UCard>
    </div>
</template>
