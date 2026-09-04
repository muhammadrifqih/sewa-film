<script setup>
defineProps({
    type: {
        type: String,
        default: 'button',
    },
});
</script>

<template>
    <button
        :type="type"
        class="inline-flex items-center rounded-xl bg-surface-container-high text-on-surface px-4 py-2 font-label-md font-bold uppercase tracking-widest shadow-sm transition duration-150 ease-in-out hover:bg-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
    >
        <slot />
    </button>
</template>
