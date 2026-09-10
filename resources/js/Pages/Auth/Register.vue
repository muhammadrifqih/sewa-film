<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Register" />

        <form @submit.prevent="submit">
            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold text-on-surface tracking-tight mb-2">Buat Akun Baru</h1>
                <p class="text-sm text-on-surface-variant">Bergabunglah untuk mulai menyewa film</p>
            </div>

            <div>
                <InputLabel for="name" value="Nama Lengkap" class="text-on-surface-variant font-medium mb-1.5" />

                <TextInput
                    id="name"
                    type="text"
                    class="mt-1 block w-full py-3"
                    v-model="form.name"
                    required
                    autofocus
                    autocomplete="name"
                    placeholder="Nama Anda"
                />

                <InputError class="mt-2" :message="form.errors.name" />
            </div>

            <div class="mt-5">
                <InputLabel for="email" value="Email" class="text-on-surface-variant font-medium mb-1.5" />

                <TextInput
                    id="email"
                    type="email"
                    class="mt-1 block w-full py-3"
                    v-model="form.email"
                    required
                    autocomplete="username"
                    placeholder="nama@email.com"
                />

                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <div class="mt-5">
                <InputLabel for="password" value="Password" class="text-on-surface-variant font-medium mb-1.5" />

                <TextInput
                    id="password"
                    type="password"
                    class="mt-1 block w-full py-3"
                    v-model="form.password"
                    required
                    autocomplete="new-password"
                    placeholder="Minimal 8 karakter"
                />

                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <div class="mt-5">
                <InputLabel
                    for="password_confirmation"
                    value="Konfirmasi Password"
                    class="text-on-surface-variant font-medium mb-1.5"
                />

                <TextInput
                    id="password_confirmation"
                    type="password"
                    class="mt-1 block w-full py-3"
                    v-model="form.password_confirmation"
                    required
                    autocomplete="new-password"
                    placeholder="Ketik ulang password"
                />

                <InputError
                    class="mt-2"
                    :message="form.errors.password_confirmation"
                />
            </div>

            <div class="mt-8 flex flex-col gap-4">
                <PrimaryButton
                    class="w-full justify-center py-3.5 text-base shadow-[0_0_20px_rgba(var(--color-primary),0.2)]"
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                >
                    Daftar Sekarang
                </PrimaryButton>

                <div class="flex items-center justify-center mt-2">
                    <span class="text-sm text-on-surface-variant mr-2">Sudah punya akun?</span>
                    <Link
                        :href="route('login')"
                        class="text-sm text-primary hover:text-primary-fixed-dim font-bold focus:outline-none transition-colors"
                    >
                        Masuk
                    </Link>
                </div>
            </div>
        </form>
    </GuestLayout>
</template>
