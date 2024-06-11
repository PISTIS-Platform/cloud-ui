<script lang="ts" setup>
import { useRoute } from 'nuxt/app';
// import { z } from 'zod';

// const { t } = useI18n();

const route = useRoute();
</script>

<template>
    <div class="w-full h-full text-gray-700">Edit {{ route.params.id }}</div>
</template>
