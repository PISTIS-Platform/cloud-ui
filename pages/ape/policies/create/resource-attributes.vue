<script setup lang="ts">
import type { Resource } from '~/interfaces/ape/resource';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();
const { resourceAttributesPolicySchema } = usePolicySchema();

const formRef = ref();
const pending = ref(false);
const resourceSearch = ref('');

const state = ref({
    name: '',
    description: '',
    resourceId: '',
    scopes: [] as string[],
    type: 'resource-attributes' as const,
    resourceAttributes: [{ key: '', value: '' }],
});

const { data: resources } = await useLazyFetch<{ data: Resource[] }>('/api/ape/resources', {
    query: { search: resourceSearch, limit: 50 },
});

const resourceOptions = computed(() =>
    (resources.value?.data || []).map((r) => ({ value: r.id, label: r.name })),
);

const SCOPE_ORDER = ['READ', 'EDIT', 'DELETE', 'TRADE'];
const availableScopes = computed(() => {
    const selected = (resources.value?.data || []).find((r) => r.id === state.value.resourceId);
    const scopes = selected?.scopes || [];
    return SCOPE_ORDER.filter((s) => scopes.includes(s));
});

// drop any selected scopes that the newly chosen resource does not support
watch(
    () => state.value.resourceId,
    () => {
        if (!availableScopes.value.length) return;
        state.value.scopes = state.value.scopes.filter((s) => availableScopes.value.includes(s));
    },
);

const { editId } = useApePolicyEdit(state);

const isFormValid = computed(() => resourceAttributesPolicySchema.safeParse(state.value).success);

const toggleScope = (scope: string) => {
    const index = state.value.scopes.indexOf(scope);
    if (index === -1) {
        state.value.scopes.push(scope);
    } else {
        state.value.scopes.splice(index, 1);
    }
};

const addAttribute = () => {
    state.value.resourceAttributes.push({ key: '', value: '' });
};

const removeAttribute = (index: number) => {
    if (state.value.resourceAttributes.length > 1) {
        state.value.resourceAttributes.splice(index, 1);
    }
};

const submit = async () => {
    if (!isFormValid.value) return;

    pending.value = true;

    try {
        if (editId.value) {
            await $fetch(`/api/ape/policies/${editId.value}`, { method: 'DELETE' });
        }
        await $fetch('/api/ape/policies', {
            method: 'POST',
            body: {
                ...state.value,
                resourceAttributes: state.value.resourceAttributes.filter(
                    (attr) => attr.key && attr.value,
                ),
            },
        });

        showSuccessMessage(t('ape.policies.createSuccess'));
        await navigateTo('/ape/policies');
    } catch (error) {
        showErrorMessage(getApiErrorMessage(error, t('ape.policies.createError')));
    } finally {
        pending.value = false;
    }
};
</script>

<template>
    <div class="w-full h-full text-gray-700">
        <UCard>
            <template #header>
                <div class="flex items-center gap-2">
                    <UButton
                        variant="ghost"
                        icon="i-heroicons-arrow-left"
                        to="/ape/policies"
                    />
                    <h2 class="text-lg font-semibold">{{ t('ape.policies.resourceAttributes.title') }}</h2>
                </div>
            </template>

            <UForm ref="formRef" :schema="resourceAttributesPolicySchema" :state="state" class="space-y-6">
                <UAlert
                    icon="i-heroicons-exclamation-triangle"
                    color="amber"
                    variant="soft"
                    :title="t('ape.policies.negativeLogicWarning')"
                />

                <UFormGroup :label="t('ape.policies.policyType')" name="type">
                    <UInput
                        :model-value="t('ape.policies.types.resourceAttributes')"
                        disabled
                    />
                </UFormGroup>

                <UFormGroup :label="t('ape.policies.policyName')" name="name" required>
                    <UInput
                        v-model="state.name"
                        :placeholder="t('ape.policies.policyNamePlaceholder')"
                    />
                </UFormGroup>

                <UFormGroup :label="t('ape.policies.resource')" name="resourceId" required>
                    <USelectMenu
                        v-model="state.resourceId"
                        v-model:query="resourceSearch"
                        :options="resourceOptions"
                        :placeholder="t('ape.policies.selectResource')"
                        :searchable-placeholder="t('ape.policies.searchResource')"
                        value-attribute="value"
                        option-attribute="label"
                        searchable
                    />
                </UFormGroup>

                <UFormGroup :label="t('ape.policies.scopes')" name="scopes" required>
                    <div class="flex flex-wrap gap-3">
                        <UCheckbox
                            v-for="scope in availableScopes"
                            :key="scope"
                            :label="scope"
                            :model-value="state.scopes.includes(scope)"
                            @update:model-value="toggleScope(scope)"
                        />
                    </div>
                    <p v-if="!availableScopes.length" class="text-sm text-gray-400">
                        {{ t('ape.policies.selectResourceFirst') }}
                    </p>
                </UFormGroup>

                <UFormGroup :label="t('ape.policies.description')" name="description">
                    <UTextarea
                        v-model="state.description"
                        :placeholder="t('ape.policies.descriptionPlaceholder')"
                        :rows="3"
                    />
                </UFormGroup>

                <div class="border-t pt-4">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h3 class="text-md font-medium">{{ t('ape.organizations.attributes') }}</h3>
                            <p class="text-sm text-gray-500">{{ t('ape.policies.resourceAttributes.attributesDescription') }}</p>
                        </div>
                        <UButton
                            size="sm"
                            variant="outline"
                            icon="i-heroicons-plus"
                            @click="addAttribute"
                        >
                            {{ t('ape.policies.resourceAttributes.addAttribute') }}
                        </UButton>
                    </div>
                    <div class="space-y-3">
                        <div
                            v-for="(attr, index) in state.resourceAttributes"
                            :key="index"
                            class="flex gap-3 items-start"
                        >
                            <UFormGroup class="flex-1" :label="index === 0 ? t('ape.policies.resourceAttributes.attributeKey') : undefined">
                                <UInput
                                    v-model="attr.key"
                                    :placeholder="t('ape.policies.resourceAttributes.attributeKey')"
                                />
                            </UFormGroup>
                            <UFormGroup class="flex-1" :label="index === 0 ? t('ape.policies.resourceAttributes.attributeValue') : undefined">
                                <UInput
                                    v-model="attr.value"
                                    :placeholder="t('ape.policies.resourceAttributes.attributeValue')"
                                />
                            </UFormGroup>
                            <UButton
                                v-if="state.resourceAttributes.length > 1"
                                :class="index === 0 ? 'mt-6' : ''"
                                color="red"
                                variant="ghost"
                                icon="i-heroicons-trash"
                                @click="removeAttribute(index)"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 pt-4">
                    <UButton color="white" to="/ape/policies">
                        {{ $t('cancel') }}
                    </UButton>
                    <UButton
                        type="submit"
                        :loading="pending"
                        :disabled="!isFormValid"
                        @click="submit"
                    >
                        {{ $t('create') }}
                    </UButton>
                </div>
            </UForm>
        </UCard>
    </div>
</template>
