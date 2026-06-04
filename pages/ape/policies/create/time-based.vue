<script setup lang="ts">
import type { Resource } from '~/interfaces/ape/resource';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();
const { timeBasedPolicySchema, daysOfWeekOptions } = usePolicySchema();

const formRef = ref();
const pending = ref(false);
const resourceSearch = ref('');

const state = ref({
    name: '',
    description: '',
    resourceId: '',
    scopes: [] as string[],
    type: 'time-based' as const,
    timeRange: {
        startTime: '',
        endTime: '',
        daysOfWeek: [] as number[],
    },
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

const isFormValid = computed(() => timeBasedPolicySchema.safeParse(state.value).success);

const toggleScope = (scope: string) => {
    const index = state.value.scopes.indexOf(scope);
    if (index === -1) {
        state.value.scopes.push(scope);
    } else {
        state.value.scopes.splice(index, 1);
    }
};

const toggleDay = (day: number) => {
    const index = state.value.timeRange.daysOfWeek.indexOf(day);
    if (index === -1) {
        state.value.timeRange.daysOfWeek.push(day);
    } else {
        state.value.timeRange.daysOfWeek.splice(index, 1);
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
            body: state.value,
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
                    <h2 class="text-lg font-semibold">{{ t('ape.policies.timeBased.title') }}</h2>
                </div>
            </template>

            <UForm ref="formRef" :schema="timeBasedPolicySchema" :state="state" class="space-y-6">
                <UAlert
                    icon="i-heroicons-exclamation-triangle"
                    color="amber"
                    variant="soft"
                    :title="t('ape.policies.negativeLogicWarning')"
                />

                <UFormGroup :label="t('ape.policies.policyType')" name="type">
                    <UInput
                        :model-value="t('ape.policies.types.timeBased')"
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
                    <h3 class="text-md font-medium mb-4">{{ t('ape.policies.timeBased.timeRange') }}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <UFormGroup :label="t('ape.policies.timeBased.startTime')" name="timeRange.startTime" required>
                            <UInput
                                v-model="state.timeRange.startTime"
                                type="time"
                            />
                        </UFormGroup>

                        <UFormGroup :label="t('ape.policies.timeBased.endTime')" name="timeRange.endTime" required>
                            <UInput
                                v-model="state.timeRange.endTime"
                                type="time"
                            />
                        </UFormGroup>
                    </div>

                    <UFormGroup :label="t('ape.policies.timeBased.daysOfWeek')" name="timeRange.daysOfWeek" required>
                        <div class="flex flex-wrap gap-3">
                            <UCheckbox
                                v-for="day in daysOfWeekOptions"
                                :key="day.value"
                                :label="day.label"
                                :model-value="state.timeRange.daysOfWeek.includes(day.value)"
                                @update:model-value="toggleDay(day.value)"
                            />
                        </div>
                    </UFormGroup>
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
