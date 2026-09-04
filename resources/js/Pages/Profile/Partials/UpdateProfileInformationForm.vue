<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const user = usePage().props.auth.user;

const form = useForm({
    name: user.name,
    email: user.email,
});
</script>

<template>
    <section>
        <header>
            <h2 class="text-xl font-headline-sm text-on-surface">
                Informasi Profil
            </h2>

            <p class="mt-1 text-sm font-body-sm text-on-surface-variant">
                Perbarui informasi profil akun dan alamat email Anda.
            </p>
        </header>

        <form
            @submit.prevent="form.patch(route('profile.update'))"
            class="mt-6 space-y-6"
        >
            <div>
                <InputLabel for="name" value="Nama" class="text-on-surface" />

                <TextInput
                    id="name"
                    type="text"
                    class="mt-1 block w-full bg-surface-container-lowest border-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    v-model="form.name"
                    required
                    autofocus
                    autocomplete="name"
                />

                <InputError class="mt-2 text-error" :message="form.errors.name" />
            </div>

            <div>
                <InputLabel for="email" value="Email" class="text-on-surface" />

                <TextInput
                    id="email"
                    type="email"
                    class="mt-1 block w-full bg-surface-container-lowest border-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                    v-model="form.email"
                    required
                    autocomplete="username"
                />

                <InputError class="mt-2 text-error" :message="form.errors.email" />
            </div>

            <div v-if="mustVerifyEmail && user.email_verified_at === null">
                <p class="mt-2 text-sm text-on-surface-variant">
                    Alamat email Anda belum terverifikasi.
                    <Link
                        :href="route('verification.send')"
                        method="post"
                        as="button"
                        class="rounded-md text-sm text-primary underline hover:text-primary-fixed-dim focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Klik di sini untuk mengirim ulang email verifikasi.
                    </Link>
                </p>

                <div
                    v-show="status === 'verification-link-sent'"
                    class="mt-2 text-sm font-medium text-secondary"
                >
                    Tautan verifikasi baru telah dikirim ke alamat email Anda.
                </div>
            </div>

            <div class="flex items-center gap-4">
                <button type="submit" :disabled="form.processing" class="bg-primary-container text-on-primary-container px-6 py-2 rounded-xl font-bold hover:bg-primary-fixed-dim transition-colors disabled:opacity-50">
                    Simpan Perubahan
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

