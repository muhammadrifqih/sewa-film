<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { Users, Film, ShoppingCart, Settings, ShieldCheck, Activity } from 'lucide-vue-next';

defineProps({
    totalUsers: Number,
    totalFilms: Number,
    totalOrders: Number,
});
</script>

<template>
    <Head title="Pusat Kendali Admin" />

    <MainLayout>
        <!-- Hero Section -->
        <div class="bg-surface-container-lowest border-b border-surface-container-high pb-24 pt-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center gap-3 mb-6">
                    <ShieldCheck class="w-8 h-8 text-blue-500" />
                    <h1 class="text-3xl font-bold text-white">Pusat Kendali Admin</h1>
                </div>
                <p class="text-on-surface-variant text-lg max-w-2xl">
                    Pantau kesehatan platform SIEAS TVOD, kelola pengguna, dan awasi seluruh transaksi serta film yang diunggah oleh Sineas.
                </p>
            </div>
        </div>

        <div class="-mt-16 pb-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                
                <!-- Metrics Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <!-- Total Users -->
                    <div class="bg-surface-container rounded-2xl p-6 shadow-xl border border-surface-container-high relative overflow-hidden group hover:-translate-y-1 transition duration-300">
                        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition"></div>
                        <div class="flex items-center relative z-10">
                            <div class="p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg mr-5">
                                <Users class="w-7 h-7" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-on-surface-variant mb-1">Total Pengguna Aktif</p>
                                <p class="text-3xl font-black text-on-surface">{{ totalUsers }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Total Films -->
                    <div class="bg-surface-container rounded-2xl p-6 shadow-xl border border-surface-container-high relative overflow-hidden group hover:-translate-y-1 transition duration-300">
                        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition"></div>
                        <div class="flex items-center relative z-10">
                            <div class="p-4 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg mr-5">
                                <Film class="w-7 h-7" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-on-surface-variant mb-1">Total Film di Katalog</p>
                                <p class="text-3xl font-black text-on-surface">{{ totalFilms }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Total Orders -->
                    <div class="bg-surface-container rounded-2xl p-6 shadow-xl border border-surface-container-high relative overflow-hidden group hover:-translate-y-1 transition duration-300">
                        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition"></div>
                        <div class="flex items-center relative z-10">
                            <div class="p-4 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg mr-5">
                                <ShoppingCart class="w-7 h-7" />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-on-surface-variant mb-1">Total Transaksi (Kotor)</p>
                                <p class="text-3xl font-black text-on-surface">{{ totalOrders }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Admin Action Panels -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <!-- System Status -->
                    <div class="bg-surface-container rounded-2xl shadow-xl border border-surface-container-high p-8">
                        <div class="flex items-center gap-3 mb-6 border-b border-surface-container-high pb-4">
                            <Activity class="w-6 h-6 text-on-surface-variant" />
                            <h3 class="text-xl font-bold text-on-surface">Status Infrastruktur</h3>
                        </div>
                        <ul class="space-y-4">
                            <li class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
                                <span class="font-medium text-on-surface-variant">Database Connection</span>
                                <span class="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">SEHAT</span>
                            </li>
                            <li class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
                                <span class="font-medium text-on-surface-variant">Mux Video API</span>
                                <span class="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">TERKONEKSI</span>
                            </li>
                            <li class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
                                <span class="font-medium text-on-surface-variant">Payment Gateway (QRIS)</span>
                                <span class="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold rounded-full">PLACEHOLDER</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Quick Shortcuts -->
                    <div class="bg-gradient-to-br from-indigo-900 to-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8 text-white">
                        <div class="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
                            <Settings class="w-6 h-6 text-indigo-400" />
                            <h3 class="text-xl font-bold">Pintasan Manajemen</h3>
                        </div>
                        <p class="text-on-surface-variant mb-8">Ini adalah ruang kerja (workspace) Super Admin. Fitur manajemen penuh akan ditambahkan pada fase pengembangan selanjutnya.</p>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <Link :href="route('admin.users')" class="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition cursor-pointer">
                                <Users class="w-8 h-8 mb-3 text-indigo-300" />
                                <span class="font-medium">Kelola User</span>
                            </Link>
                            <Link :href="route('admin.films')" class="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition cursor-pointer">
                                <Film class="w-8 h-8 mb-3 text-pink-300" />
                                <span class="font-medium">Validasi Film</span>
                            </Link>
                            <Link :href="route('admin.transactions')" class="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition cursor-pointer col-span-2">
                                <ShoppingCart class="w-8 h-8 mb-3 text-purple-300" />
                                <span class="font-medium">Data Transaksi</span>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </MainLayout>
</template>

