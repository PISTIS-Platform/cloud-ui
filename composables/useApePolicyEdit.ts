import type { Ref } from 'vue';

interface EditablePolicy {
    id: string;
    name?: string;
    type?: string;
    description?: string;
    resourceId?: string;
    scopes?: string[];
}

// Module-level singleton: the policy a user chose to edit, handed from the list page to the
// matching create page. Editing is implemented as delete-then-recreate, so the create flow is reused.
const editingPolicy = ref<EditablePolicy | null>(null);

export function setEditingPolicy(policy: EditablePolicy) {
    editingPolicy.value = policy;
}

/**
 * Pre-fills the create form when arriving in "edit" mode and exposes the id of the policy to replace.
 * Only the fields stored in policy metadata are restored (name/description/resource/scopes); the
 * type-specific selections (groups/users/attributes/time) must be re-entered.
 */
export function useApePolicyEdit(state: Ref<any>) {
    const editId = ref<string | null>(null);

    onMounted(() => {
        const editing = editingPolicy.value;
        if (editing && editing.type === state.value.type) {
            editId.value = editing.id;
            state.value.name = editing.name ?? '';
            state.value.description = editing.description ?? '';
            state.value.resourceId = editing.resourceId ?? '';
            state.value.scopes = [...(editing.scopes ?? [])];
        }
        // consume it so a later plain "Create" doesn't accidentally inherit edit mode
        editingPolicy.value = null;
    });

    return { editId };
}
