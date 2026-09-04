<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

const passwordInput = ref(null);
const currentPasswordInput = ref(null);

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const updatePassword = () => {
    form.put(route('password.update'), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => {
            if (form.errors.password) {
                form.reset('password', 'password_confirmation');
                passwordInput.value.focus();
            }
            if (form.errors.current_password) {
                form.reset('current_password');
                currentPasswordInput.value.focus();
            }
        },
    });
};
</script>

<template>
    <section>
        <header>
            <h2 class="text-xl font-headline-sm text-on-surface">
                Ubah Kata Sandi
            </h2>

            <p class="mt-1 text-sm font-body-sm text-on-surface-variant">
                Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
            </p>
        </header>

        <form @submit.prevent="updatePassword" class="mt-6 space-y-6">
            <div>
                <InputLabel for="current_password" value="Kata Sandi Saat Ini" class="text-on-surface" />

                <TextInput
                    id="current_password"
                    ref="currentPasswordInput"
                    v-model="form.current_password"
                    type="password"
                    class="mt-1 block w-full bg-surface-container-lowest border-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    autocomplete="current-password"
                />

                <InputError
                    :message="form.errors.current_password"
                    class="mt-2 text-error"
                />
            </div>

            <div>
                <InputLabel for="password" value="Kata Sandi Baru" class="text-on-surface" />

                <TextInput
                    id="password"
                    ref="passwordInput"
                    v-model="form.password"
                    type="password"
                    class="mt-1 block w-full bg-surface-container-lowest border-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    autocomplete="new-password"
                />

                <InputError :message="form.errors.password" class="mt-2 text-error" />
            </div>

            <div>
                <InputLabel
                    for="password_confirmation"
                    value="Konfirmasi Kata Sandi"
                    class="text-on-surface"
                />

                <TextInput
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    class="mt-1 block w-full bg-surface-container-lowest border-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    autocomplete="new-password"
                />

                <InputError
                    :message="form.errors.password_confirmation"
                    class="mt-2 text-error"
                />
            </div>

            <div class="flex items-center gap-4">
                <button type="submit" :disabled="form.processing" class="bg-primary-container text-on-primary-container px-6 py-2 rounded-xl font-bold hover:bg-primary-fixed-dim transition-colors disabled:opacity-50">
                    Simpan Sandi Baru
                </button>

                <Transition
                    enter-active-class="transition ease-in-out duration-300"
                    enter-from-class="opacity-0"
                    leave-active-class="transition ease-in-out duration-300"
                    leave-to-class="opacity-0"
                >
                    <p
                        v-if="form.recentlySuccessful"
                        class="text-sm font-bold text-secondary flex items-center gap-1"
                    >
                        <span class="material-symbols-outlined text-sm">check_circle</span>
                        Tersimpan.
                    </p>
                </Transition>
            </div>
        </form>
    </section>
</template>

