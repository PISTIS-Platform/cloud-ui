<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';

useHead({
    htmlAttrs: { class: 'min-h-full bg-gray-100' },
    bodyAttrs: { class: 'h-full' },
});

const { showInfoMessage } = useAlertMessage();

import { useMessagesStore } from '~/store/messages';

const messagesStore = useMessagesStore();

const { status, signIn, signOut, data: session } = useAuth();

const navigation: { name: string; to: string; roles: string[] }[] = [
    { name: 'dashboard.dashboard', to: '/dashboard', roles: [] },
    { name: 'registry.registry', to: '/factory-registry', roles: ['PISTIS_ADMIN'] },
    { name: 'usage-analytics.usage-analytics', to: '/usage-analytics', roles: ['PISTIS_ADMIN'] },
    { name: 'models.models', to: '/models', roles: ['PISTIS_ADMIN'] },
];

const userNavigation: { name: string; to: string; icon?: string }[] = [];

const { host, protocol } = location;
const { data: wsData } = useWebSocket(`${protocol.replace('http', 'ws')}//${host}/api/messages`);

//watching the data value where new messages come
watch(wsData, (newValue) => {
    if (!newValue) return;
    const message = JSON.parse(newValue);
    if (Array.isArray(message)) {
        messagesStore.setMessages(message);
        return;
    }
    showInfoMessage(message.message);
    messagesStore.addMessage(message);
});

const notifications = computed(() => messagesStore.getMessages);

const unreadNotifications = computed(() =>
    notifications.value.filter((notification) => !notification.readAt && !notification.isHidden),
);

const notificationsNumberText = computed(() =>
    unreadNotifications.value.length > 9 ? '9+' : unreadNotifications.value.length,
);
</script>

<template>
    <div class="h-full flex flex-col">
        <Disclosure v-slot="{ open }" as="nav" class="bg-primary-700 sticky top-0 z-20">
            <div class="mx-auto px-8 max-w-7xl">
                <div class="flex h-16 items-center justify-between">
                    <div class="flex items-center">
                        <NuxtLink :to="'/'" class="flex-shrink-0">
                            <img class="h-8 w-28" src="/img/PISTIS_logo_white.png" alt="PISTIS logo" />
                        </NuxtLink>
                        <div class="hidden md:block">
                            <div
                                v-if="status === 'authenticated' && session?.roles?.includes('PISTIS_ADMIN')"
                                class="ml-10 flex items-baseline space-x-4"
                            >
                                <NuxtLink
                                    v-for="item in navigation"
                                    :key="item.name"
                                    :to="item.to"
                                    class="text-white hover:bg-primary-600 hover:bg-opacity-75 rounded-md px-3 py-2 text-sm font-medium"
                                    active-class="bg-primary-800"
                                    >{{ $t(item.name) }}</NuxtLink
                                >
                            </div>
                        </div>
                    </div>
                    <template v-if="status === 'authenticated'">
                        <div class="hidden md:block">
                            <div class="ml-4 flex items-center space-x-2 md:ml-6">
                                <UButton
                                    type="button"
                                    class="flex gap-1 items-center relative rounded-full bg-primary-70 h-10 p-1.5 text-primary-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 mr-1"
                                    to="/notifications"
                                >
                                    <span class="absolute -inset-1.5" />
                                    <span class="sr-only">View notifications</span>
                                    <div
                                        v-if="unreadNotifications.length"
                                        class="bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center absolute top-0 z-20 -right-0.5"
                                    >
                                        {{ notificationsNumberText }}
                                    </div>
                                    <UIcon name="i-heroicons-bell" class="h-7 w-7" aria-hidden="true" />
                                </UButton>

                                <!-- Profile dropdown -->
                                <Menu as="div" class="relative">
                                    <div>
                                        <MenuButton
                                            class="relative flex space-x-2 text-primary-200 max-w-xs items-center rounded-full bg-primary-700 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                                        >
                                            <UAvatar :src="session?.user?.image" class="bg-primary-200" size="md" />
                                            <div class="text-primary-100">
                                                {{ session?.user?.name }}
                                            </div>
                                            <UIcon
                                                name="i-heroicons-chevron-down"
                                                class="w-4 h-4 mr-0.5 text-primary-300"
                                            />
                                        </MenuButton>
                                    </div>
                                    <transition
                                        enter-active-class="transition ease-out duration-100"
                                        enter-from-class="transform opacity-0 scale-95"
                                        enter-to-class="transform opacity-100 scale-100"
                                        leave-active-class="transition ease-in duration-75"
                                        leave-from-class="transform opacity-100 scale-100"
                                        leave-to-class="transform opacity-0 scale-95"
                                    >
                                        <MenuItems
                                            class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        >
                                            <MenuItem
                                                v-for="item in userNavigation"
                                                :key="item.name"
                                                v-slot="{ active }"
                                            >
                                                <NuxtLink
                                                    :to="item.to"
                                                    :class="[
                                                        active ? 'bg-primary-100' : undefined,
                                                        'block px-4 py-2 text-sm text-gray-700',
                                                    ]"
                                                    >{{ $t(item.name) }}</NuxtLink
                                                >
                                            </MenuItem>
                                            <MenuItem v-slot="{ active }">
                                                <a
                                                    href="javascript:void(0)"
                                                    :class="[
                                                        'block px-4 py-2 text-sm text-gray-700',
                                                        active ? 'bg-primary-100 ' : undefined,
                                                    ]"
                                                    @click="signOut({ callbackUrl: '/' })"
                                                >
                                                    {{ $t('signOut') }}
                                                </a>
                                            </MenuItem>
                                        </MenuItems>
                                    </transition>
                                </Menu>
                            </div>
                        </div>
                        <div class="-mr-2 flex md:hidden">
                            <!-- Mobile menu button -->
                            <DisclosureButton
                                class="relative inline-flex items-center justify-center rounded-md bg-primary-700 p-2 text-primary-200 hover:bg-primary-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                            >
                                <span class="absolute -inset-0.5" />
                                <span class="sr-only">Open main menu</span>
                                <UIcon
                                    v-if="!open"
                                    name="i-heroicons-bars-3"
                                    class="block h-6 w-6"
                                    aria-hidden="true"
                                />
                                <UIcon v-else name="i-heroicons-x-mark" class="block h-6 w-6" aria-hidden="true" />
                            </DisclosureButton>
                        </div>
                    </template>
                    <template v-else>
                        <button
                            type="button"
                            class="flex items-center relative px-4 py-1.5 font-medium rounded-lg bg-primary-900 hover:bg-primary-950 text-primary-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800"
                            @click="signIn('keycloak')"
                        >
                            <UIcon name="i-heroicons-arrow-right-end-on-rectangle" class="-ml-0.5" />
                            <span class="ml-2">{{ $t('signIn') }}</span>
                        </button>
                    </template>
                </div>
            </div>

            <DisclosurePanel v-if="status === 'authenticated'" class="md:hidden">
                <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3 flex flex-col">
                    <NuxtLink
                        v-for="item in navigation"
                        :key="item.name"
                        :to="item.to"
                        class="text-white hover:bg-primary-600 hover:bg-opacity-75 rounded-md px-3 py-2 text-sm font-medium"
                        active-class="bg-primary-800"
                        >{{ $t(item.name) }}</NuxtLink
                    >
                </div>
                <div class="border-t border-primary-700 pb-3 pt-4">
                    <div class="flex items-center px-5">
                        <div class="flex-shrink-0 mt-1">
                            <UIcon name="i-heroicons-user-circle" class="text-primary-200 w-8 h-8" />
                        </div>
                        <div class="ml-3">
                            <div class="text-base font-medium text-white">{{ session?.user?.name }}</div>
                            <div class="text-sm -mt-0.5 text-primary-300">{{ session?.user?.email }}</div>
                        </div>
                        <UButton
                            type="button"
                            class="relative flex gap-1 items-center relative rounded-full bg-primary-70 h-10 p-1.5 text-primary-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                            to="/notifications"
                        >
                            <span class="absolute -inset-1.5" />
                            <span class="sr-only">View notifications</span>
                            <div
                                v-if="unreadNotifications.length"
                                class="bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center absolute top-0 z-20 -right-0.5"
                            >
                                {{ notificationsNumberText }}
                            </div>
                            <UIcon name="i-heroicons-bell" class="h-7 w-7" aria-hidden="true" />
                        </UButton>
                    </div>
                    <div class="mt-3 space-y-1 px-5">
                        <DisclosureButton
                            v-for="item in userNavigation"
                            :key="item.name"
                            as="NuxtLink"
                            :to="item.to"
                            class="flex space-x-2 items-center rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500 hover:bg-opacity-75 cursor-pointer"
                        >
                            <UIcon v-if="item.icon" :name="item.icon" class="-ml-0.5" />
                            <div>{{ $t(item.name) }}</div>
                        </DisclosureButton>
                        <DisclosureButton
                            as="NuxtLink"
                            class="flex flex-1 space-x-2 items-center rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500 hover:bg-opacity-75 cursor-pointer"
                            @click="signOut({ callbackUrl: '/' })"
                        >
                            <UIcon name="i-heroicons-arrow-left-start-on-rectangle" class="-ml-0.5" />
                            <div class="ml-2">{{ $t('signOut') }}</div>
                        </DisclosureButton>
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>
        <main class="flex flex-col flex-1 overflow-y-auto text-gray-700">
            <slot />
        </main>
        <footer class="bg-primary-900 h-12"></footer>
    </div>
</template>

<style>
#__nuxt {
    height: 100%;
}
</style>
