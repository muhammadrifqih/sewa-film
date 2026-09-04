<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import DeleteUserForm from './Partials/DeleteUserForm.vue';
import UpdatePasswordForm from './Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.vue';
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft } from 'lucide-vue-next';

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});
</script>

<template>
    <Head title="Profil Pengguna | CineRent" />

    <MainLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            <div class="mb-8">
                <Link :href="route('dashboard')" class="inline-flex items-center text-sm font-medium text-secondary hover:text-secondary-fixed group transition-colors mb-4">
                    <ArrowLeft class="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                    Kembali ke Dashboard
                </Link>
                <h1 class="text-3xl font-headline-lg text-on-surface">Pengaturan Profil</h1>
                <p class="text-on-surface-variant font-body-md mt-1">Kelola informasi akun, kata sandi, dan keamanan Anda.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Navigation Sidebar for Profile (Optional, just visual) -->
                <div class="lg:col-span-1 hidden lg:block">
                    <div class="bg-surface-container rounded-2xl p-6 border border-surface-container-high sticky top-28">
                        <nav class="flex flex-col gap-2">
                            <a href="#profile-info" class="px-4 py-3 rounded-xl bg-surface-container-high text-primary font-bold flex items-center gap-3">
                                <span class="material-symbols-outlined text-xl">person</span>
                                Informasi Profil
                            </a>
                            <a href="#password" class="px-4 py-3 rounded-xl hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-3">
                                <span class="material-symbols-outlined text-xl">lock</span>
                                Ubah Kata Sandi
                            </a>
                            <a href="#danger" class="px-4 py-3 rounded-xl hover:bg-error-container/20 text-error transition-colors flex items-center gap-3 mt-4 border-t border-surface-container-high">
                                <span class="material-symbols-outlined text-xl">delete</span>
                                Hapus Akun
                            </a>
                        </nav>
                    </div>
                </div>

                <!-- Forms -->
                <div class="lg:col-span-2 space-y-8">
                    <div id="profile-info" class="bg-surface-container rounded-3xl p-6 sm:p-10 border border-surface-container-high shadow-xl relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                        <UpdateProfileInformationForm
                            :must-verify-email="mustVerifyEmail"
                            :status="status"
                            class="max-w-xl"
                        />
                    </div>

                    <div id="password" class="bg-surface-container rounded-3xl p-6 sm:p-10 border border-surface-container-high shadow-xl relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                        <UpdatePasswordForm class="max-w-xl" />
                    </div>

                    <div id="danger" class="bg-surface-container rounded-3xl p-6 sm:p-10 border border-error/20 shadow-xl relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-error/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                        <DeleteUserForm class="max-w-xl" />
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

