<script setup>
import Checkbox from '@/Components/Checkbox.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Log in" />

        <div v-if="status" class="mb-4 text-sm font-medium text-success">
            {{ status }}
        </div>

        <form @submit.prevent="submit">
            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold text-on-surface tracking-tight mb-2">Selamat Datang Kembali</h1>
                <p class="text-sm text-on-surface-variant">Masuk untuk melanjutkan streaming</p>
            </div>

            <div>
                <InputLabel for="email" value="Email" class="text-on-surface-variant font-medium mb-1.5" />

                <TextInput
                    id="email"
                    type="email"
                    class="mt-1 block w-full py-3"
                    v-model="form.email"
                    required
                    autofocus
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
                    autocomplete="current-password"
                    placeholder="••••••••"
                />

                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <div class="mt-5 block">
                <label class="flex items-center">
                    <Checkbox name="remember" v-model:checked="form.remember" />
                    <span class="ms-2 text-sm text-on-surface-variant"
                        >Ingat saya</span
                    >
                </label>
            </div>

            <div class="mt-8 flex flex-col gap-4">
                <PrimaryButton
                    class="w-full justify-center py-3.5 text-base shadow-[0_0_20px_rgba(var(--color-primary),0.2)]"
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                >
                    Log in
                </PrimaryButton>

                <div class="flex items-center justify-between mt-2">
                    <Link
                        v-if="canResetPassword"
                        :href="route('password.request')"
                        class="text-sm text-primary hover:text-primary-fixed-dim font-medium focus:outline-none"
                    >
                        Lupa password?
                    </Link>

                    <Link
                        :href="route('register')"
                        class="text-sm text-on-surface-variant hover:text-on-surface font-medium focus:outline-none"
                    >
                        Belum punya akun? Daftar
                    </Link>
                </div>
            </div>
        </form>
    </GuestLayout>
</template>
