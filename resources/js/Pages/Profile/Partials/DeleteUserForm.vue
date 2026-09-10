<script setup>
import DangerButton from '@/Components/DangerButton.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import Modal from '@/Components/Modal.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { nextTick, ref } from 'vue';

const confirmingUserDeletion = ref(false);
const passwordInput = ref(null);

const form = useForm({
    password: '',
});

const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;

    nextTick(() => passwordInput.value.focus());
};

const deleteUser = () => {
    form.delete(route('profile.destroy'), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    confirmingUserDeletion.value = false;

    form.clearErrors();
    form.reset();
};
</script>

<template>
    <section class="space-y-6">
        <header>
            <h2 class="text-xl font-headline-sm text-error">
                Hapus Akun
            </h2>

            <p class="mt-1 text-sm font-body-sm text-on-surface-variant">
                Setelah akun Anda dihapus, semua sumber daya dan data di dalamnya akan dihapus secara permanen. Sebelum menghapus akun Anda, harap unduh data atau informasi apa pun yang ingin Anda pertahankan.
            </p>
        </header>

        <button @click="confirmUserDeletion" class="bg-error/20 text-error border border-error px-6 py-2 rounded-xl font-bold hover:bg-error hover:text-on-surface transition-colors">
            Hapus Akun Permanen
        </button>

        <Modal :show="confirmingUserDeletion" @close="closeModal">
            <div class="p-6 bg-surface-container rounded-lg border border-surface-container-high">
                <h2
                    class="text-lg font-headline-sm text-on-surface"
                >
                    Apakah Anda yakin ingin menghapus akun ini?
                </h2>

                <p class="mt-1 text-sm font-body-sm text-on-surface-variant">
                    Setelah dihapus, seluruh data tidak dapat dikembalikan. Silakan masukkan kata sandi Anda untuk mengonfirmasi penghapusan permanen.
                </p>

                <div class="mt-6">
                    <InputLabel
                        for="password"
                        value="Kata Sandi"
                        class="sr-only"
                    />

                    <TextInput
                        id="password"
                        ref="passwordInput"
                        v-model="form.password"
                        type="password"
                        class="mt-1 block w-full bg-surface-container-lowest border-surface-container-high text-on-surface focus:ring-error focus:border-error"
                        placeholder="Kata Sandi"
                        @keyup.enter="deleteUser"
                    />

                    <InputError :message="form.errors.password" class="mt-2 text-error" />
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <button @click="closeModal" class="px-6 py-2 rounded-xl font-bold bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors">
                        Batal
                    </button>

                    <button
                        class="px-6 py-2 rounded-xl font-bold bg-error text-on-surface hover:bg-red-700 transition-colors"
                        :class="{ 'opacity-50 cursor-not-allowed': form.processing }"
                        :disabled="form.processing"
                        @click="deleteUser"
                    >
                        Hapus Sekarang
                    </button>
                </div>
            </div>
        </Modal>
    </section>
</template>

