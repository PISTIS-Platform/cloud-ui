<script setup lang="ts">
import type { Resource } from '~/interfaces/ape/resource';
import type { User } from '~/interfaces/ape/user';

const { t } = useI18n();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();
const { organizationUserPolicySchema } = usePolicySchema();

const formRef = ref();
const pending = ref(false);
const resourceSearch = ref('');

const state = ref({
    name: '',
    description: '',
    resourceId: '',
    scopes: [] as string[],
    type: 'organization-user' as const,
    userIds: [] as string[],
    roles: [] as string[],
});

const { data: resources } = await useLazyFetch<{ data: Resource[] }>('/api/ape/resources', {
    query: { search: resourceSearch, limit: 50 },
});
const { data: users, pending: usersPending } = await useLazyFetch<User[]>('/api/ape/users');

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

const isFormValid = computed(() => organizationUserPolicySchema.safeParse(state.value).success);

const toggleScope = (scope: string) => {
    const index = state.value.scopes.indexOf(scope);
    if (index === -1) {
        state.value.scopes.push(scope);
    } else {
        state.value.scopes.splice(index, 1);
    }
};

const toggleUser = (userId: string) => {
    const index = state.value.userIds.indexOf(userId);
    if (index === -1) {
        state.value.userIds.push(userId);
    } else {
        state.value.userIds.splice(index, 1);
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
                    <h2 class="text-lg font-semibold">{{ t('ape.policies.organizationUser.title') }}</h2>
                </div>
            </template>

            <UForm ref="formRef" :schema="organizationUserPolicySchema" :state="state" class="space-y-6">
                <UAlert
                    icon="i-heroicons-exclamation-triangle"
                    color="amber"
                    variant="soft"
                    :title="t('ape.policies.negativeLogicWarning')"
                />

                <UFormGroup :label="t('ape.policies.policyType')" name="type">
                    <UInput
                        :model-value="t('ape.policies.types.organizationUser')"
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
                    <h3 class="text-md font-medium mb-2">{{ t('ape.policies.organizationUser.selectUsers') }}</h3>
                    <p class="text-sm text-gray-500 mb-4">{{ t('ape.policies.organizationUser.usersDescription') }}</p>
                    <div v-if="usersPending" class="flex items-center justify-center gap-2 py-8 text-gray-500">
                        <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
                        <span class="text-sm">{{ $t('loading') }}</span>
                    </div>
                    <div v-else-if="!users?.length" class="py-8 text-center text-sm text-gray-500">
                        {{ t('ape.users.noUsers') }}
                    </div>
                    <div v-else class="space-y-2 max-h-64 overflow-y-auto">
                        <UCheckbox
                            v-for="user in users"
                            :key="user.id"
                            :label="`${user.firstName} ${user.lastName} (${user.email})`"
                            :model-value="state.userIds.includes(user.id)"
                            @update:model-value="toggleUser(user.id)"
                        />
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
