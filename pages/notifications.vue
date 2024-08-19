<script setup lang="ts">
//TODO: API call to get notifications here
//TODO: Possibly read information from API call that will happen to get the notifications for the icon

const notifications = ref([
    {
        id: '1',
        userId: '2',
        organizationId: '3',
        message: 'Your notification text goes here.',
        isHidden: false,
        createdAt: new Date(),
        readAt: null,
    },
    {
        id: '2',
        userId: '2',
        organizationId: '3',
        message:
            'Sit ad dolor sint. Qui laboris Lorem elit velit. Incididunt nulla nisi ipsum et aliquip nulla fugiat ullamco. Quis sit elit exercitation mollit elit ut sint. Et id dolore velit cillum. Commodo fugiat proident elit irure exercitation deserunt sint. Nulla velit consectetur sit mollit ex.',
        isHidden: false,
        createdAt: new Date(),
        readAt: null,
    },
    {
        id: '3',
        userId: '2',
        organizationId: '3',
        message: 'Your notification text goes here.',
        isHidden: true,
        createdAt: new Date(),
        readAt: null,
    },
    {
        id: '4',
        userId: '2',
        organizationId: '3',
        message: 'Your notification text goes here.',
        isHidden: false,
        createdAt: new Date(),
        readAt: new Date(),
    },
]);

const markAsRead = (id: string | number) => {
    //TODO: Send API call to mark notification as Read
    //TODO: Refresh list upon doing so
    const foundNotification = notifications.value.find((notification) => notification.id === id);
    if (!foundNotification) return;

    foundNotification.readAt = new Date();
};

const hide = (id: string | number) => {
    //TODO: Send API call to mark notification as hidden
    //TODO: Refresh list upon doing so
    const foundNotification = notifications.value.find((notification) => notification.id === id);
    if (!foundNotification) return;

    foundNotification.isHidden = true;
};

const shownNotifications = computed(() => notifications.value.filter((not) => !not.isHidden));
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <SubHeading :title="$t('notifications.title')" />
            <div class="flex flex-col gap-6 mt-6 w-full">
                <UCard
                    v-for="notification in shownNotifications"
                    :key="notification.id"
                    :class="['w-full relative pb-6', notification.readAt ? 'opacity-60' : '']"
                >
                    {{ notification.message }}
                    <div class="w-full flex justify-end gap-4 absolute bottom-2 right-2">
                        <UButton color="red" variant="soft" @click="hide(notification.id)">{{
                            $t('notifications.hide')
                        }}</UButton>
                        <UButton v-if="!notification.readAt" color="gray" @click="markAsRead(notification.id)">{{
                            $t('notifications.markRead')
                        }}</UButton>
                    </div>
                </UCard>
                <UAlert
                    v-if="!shownNotifications.length"
                    icon="ic:outline-info"
                    color="primary"
                    variant="soft"
                    :description="$t('notifications.noNotifications')"
                />
            </div>
        </PageContainer>
    </div>
</template>
