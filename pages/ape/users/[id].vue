<script setup lang="ts">
import type { User, UserStatus, UserType } from '~/interfaces/ape/user';
import type { Group } from '~/interfaces/ape/group';

const { t } = useI18n();
const route = useRoute();
const { showSuccessMessage, showErrorMessage } = useAlertMessage();
const { userSchema, statusOptions, typeOptions } = useUserSchema();

const userId = route.params.id as string;

const formRef = ref();
const pending = ref(false);

const { data: user, error: fetchError } = await useFetch<User>(`/api/ape/users/${userId}`);

const state = ref({
    firstName: '',
    lastName: '',
    email: '',
    groupId: '',
    status: 'pending' as UserStatus,
    type: 'member' as UserType,
});

watch(
    user,
    (newUser) => {
        if (newUser) {
            state.value = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                groupId: newUser.groupId,
                status: newUser.status,
                type: newUser.type,
            };
        }
    },
    { immediate: true },
);

const { data: groups } = await useLazyFetch<Group[]>('/api/ape/groups');

const groupOptions = computed(() =>
    (groups.value || []).map((g) => ({ value: g.id, label: g.name })),
);

const isFormValid = computed(() => userSchema.safeParse(state.value).success);

const submit = async () => {
    if (!isFormValid.value) return;

    pending.value = true;

    try {
        await $fetch(`/api/ape/users/${userId}`, {
            method: 'PUT',
            body: state.value,
        });

        showSuccessMessage(t('ape.users.updateSuccess'));
        await navigateTo('/ape/users');
    } catch {
        showErrorMessage(t('ape.users.updateError'));
    } finally {
        pending.value = false;
    }
};
</script>

<template>
    <div class="w-full h-full text-gray-700">
        <ErrorCard v-if="fetchError" :error-msg="fetchError.data?.message ?? t('ape.users.fetchError')" />
        <UCard v-else>
            <template #header>
                <div class="flex items-center gap-2">
                    <UButton
                        variant="ghost"
                        icon="i-heroicons-arrow-left"
                        to="/ape/users"
                    />
                    <h2 class="text-lg font-semibold">{{ t('ape.users.editTitle') }}</h2>
                </div>
            </template>

            <UForm ref="formRef" :schema="userSchema" :state="state" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UFormGroup :label="t('ape.users.firstName')" name="firstName" required>
                        <UInput v-model="state.firstName" />
                    </UFormGroup>

                    <UFormGroup :label="t('ape.users.lastName')" name="lastName" required>
                        <UInput v-model="state.lastName" />
                    </UFormGroup>
                </div>

                <UFormGroup :label="t('ape.users.email')" name="email" required>
                    <UInput v-model="state.email" type="email" />
                </UFormGroup>

                <UFormGroup :label="t('ape.users.group')" name="groupId" required>
                    <USelectMenu
                        v-model="state.groupId"
                        :options="groupOptions"
                        :placeholder="t('ape.users.selectGroup')"
                        value-attribute="value"
                        option-attribute="label"
                        searchable
                    />
                </UFormGroup>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UFormGroup :label="t('ape.users.status')" name="status" required>
                        <USelectMenu
                            v-model="state.status"
                            :options="statusOptions"
                            value-attribute="value"
                            option-attribute="label"
                        />
                    </UFormGroup>

                    <UFormGroup :label="t('ape.users.type')" name="type" required>
                        <USelectMenu
                            v-model="state.type"
                            :options="typeOptions"
                            value-attribute="value"
                            option-attribute="label"
                        />
                    </UFormGroup>
                </div>

                <div class="flex justify-end gap-2 pt-4">
                    <UButton color="white" to="/ape/users">
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
