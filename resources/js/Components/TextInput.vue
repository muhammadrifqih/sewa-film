<script setup>
import { onMounted, ref } from 'vue';

const model = defineModel({
    type: String,
    required: true,
});

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <input
        class="rounded-xl border-surface-container-high bg-surface-container-lowest text-on-surface shadow-sm focus:border-primary focus:ring-primary placeholder-on-surface-variant transition-colors"
        v-model="model"
        ref="input"
    />
</template>
