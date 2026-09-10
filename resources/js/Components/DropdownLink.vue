<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    href: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <Link
        :href="href"
        class="block w-full px-4 py-2 text-start font-label-md text-on-surface-variant transition duration-150 ease-in-out hover:bg-surface-container-highest hover:text-on-surface focus:bg-surface-container-highest focus:outline-none"
    >
        <slot />
    </Link>
</template>
