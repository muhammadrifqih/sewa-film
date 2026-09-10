<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { Film, Plus, Play, Eye, EyeOff, ExternalLink, TrendingUp, Wallet, Star, Edit2, Users, Trash2 } from 'lucide-vue-next';

const props = defineProps({
    films: {
        type: Array,
        required: true,
    },
    filmmaker: {
        type: Object,
        required: true,
    },
    totalTickets: {
        type: Number,
        default: 0,
    },
    grossRevenue: {
        type: Number,
        default: 0,
    },
    netRevenue: {
        type: Number,
        default: 0,
    }
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
};

const togglePublish = (filmId) => {
    router.patch(route('sineas.films.toggle-publish', filmId), {}, {
        preserveScroll: true,
    });
};

const deleteFilm = (film) => {
    if (confirm(`Apakah Anda yakin ingin menghapus film "${film.title}" secara permanen? Data dan video Mux juga akan dihapus.`)) {
        router.delete(route('sineas.films.destroy', film.id), {
            preserveScroll: true,
        });
    }
};
</script>

<template>
    <Head title="Studio Sineas" />

    <MainLayout>
        
        <!-- Hero Section -->
        <div class="bg-surface-container-lowest border-b border-surface-container-high pb-24 pt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row items-center justify-between">
                    <div class="flex items-center gap-6">
                        <!-- Avatar Placeholder -->
                        <div class="h-20 w-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-on-surface text-3xl font-bold shadow-lg border-4 border-gray-800">
                            {{ filmmaker.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h1 class="text-3xl font-bold text-on-surface">{{ filmmaker.name }}</h1>
                                <Star class="w-5 h-5 text-yellow-400 fill-current" />
                            </div>
                            <p class="text-on-surface-variant text-sm">Dashboard Kreator • Bergabung {{ new Date(filmmaker.created_at).getFullYear() }}</p>
                        </div>
                    </div>
                    
                    <div class="mt-8 md:mt-0">
                        <Link
                            :href="route('sineas.films.create')"
                            class="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-xl font-bold text-sm text-on-surface hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition shadow-lg shadow-blue-900/50"
                        >
                            <Plus class="w-5 h-5 mr-2" />
                            Rilis Film Baru
                        </Link>
                    </div>
                </div>

                <!-- Stats Widgets -->
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
                    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex items-center group hover:-translate-y-1 transition duration-300">
                        <div class="bg-blue-900/50 text-blue-400 p-4 rounded-xl mr-5 group-hover:bg-blue-500 group-hover:text-white transition">
                            <Film class="w-6 h-6" />
                        </div>
                        <div>
                            <p class="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Karya Rilis</p>
                            <h3 class="text-2xl font-bold text-on-surface">{{ films.length }}</h3>
                        </div>
                    </div>
                    
                    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex items-center group hover:-translate-y-1 transition duration-300">
                        <div class="bg-green-900/50 text-green-400 p-4 rounded-xl mr-5 group-hover:bg-green-500 group-hover:text-white transition">
                            <TrendingUp class="w-6 h-6" />
                        </div>
                        <div>
                            <p class="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Tiket Terjual</p>
                            <h3 class="text-2xl font-bold text-on-surface">{{ totalTickets }}</h3>
                        </div>
                    </div>

                    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex items-center group hover:-translate-y-1 transition duration-300">
                        <div class="bg-purple-900/50 text-purple-400 p-4 rounded-xl mr-5 group-hover:bg-purple-500 group-hover:text-white transition">
                            <span class="material-symbols-outlined text-2xl">payments</span>
                        </div>
                        <div>
                            <p class="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Pendapatan Kotor</p>
                            <h3 class="text-xl font-bold text-on-surface">Rp {{ formatPrice(grossRevenue) }}</h3>
                        </div>
                    </div>

                    <!-- Net Revenue (Sineas 50%) -->
                    <div class="bg-gray-800/50 backdrop-blur-sm border border-primary/30 rounded-2xl p-6 flex items-center group hover:-translate-y-1 transition duration-300 ring-1 ring-primary/20">
                        <div class="bg-primary/20 text-primary p-4 rounded-xl mr-5 group-hover:bg-primary group-hover:text-on-primary transition">
                            <span class="material-symbols-outlined text-2xl">account_balance_wallet</span>
                        </div>
                        <div>
                            <p class="text-primary text-xs font-bold uppercase tracking-wider mb-1">Laba Bersih (50%)</p>
                            <h3 class="text-xl font-black text-primary">Rp {{ formatPrice(netRevenue) }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="-mt-10 pb-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                
                <div v-if="$page.props.flash?.success" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/30 rounded-xl flex items-center">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    {{ $page.props.flash.success }}
                </div>

                <div class="overflow-hidden bg-surface-container shadow-xl sm:rounded-2xl border border-surface-container-high">
                    <div class="p-8">
                        <h3 class="text-lg font-bold text-on-surface mb-6 flex items-center">
                            Manajemen Katalog
                        </h3>

                        <div v-if="films.length === 0" class="text-center py-16 bg-surface-container-low rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                            <Film class="mx-auto h-12 w-12 text-on-surface-variant mb-4" />
                            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Studio Anda Masih Kosong</h3>
                            <p class="mt-2 text-sm text-on-surface-variant max-w-md mx-auto">Upload film pertama Anda sekarang. Sistem akan secara otomatis mengolah video Anda dan melindunginya dengan teknologi anti-bajak.</p>
                        </div>

                        <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-surface-container-lowest/80">
                                    <tr>
                                        <th class="py-4 px-6 font-semibold text-sm text-gray-600 dark:text-on-surface-variant uppercase tracking-wider">Judul & Poster</th>
                                        <th class="py-4 px-6 font-semibold text-sm text-gray-600 dark:text-on-surface-variant uppercase tracking-wider">Harga (48 Jam)</th>
                                        <th class="py-4 px-6 font-semibold text-sm text-gray-600 dark:text-on-surface-variant uppercase tracking-wider">Mux Status</th>
                                        <th class="py-4 px-6 font-semibold text-sm text-gray-600 dark:text-on-surface-variant uppercase tracking-wider">Status Approval</th>
                                        <th class="py-4 px-6 font-semibold text-sm text-gray-600 dark:text-on-surface-variant uppercase tracking-wider">Visibilitas</th>
                                        <th class="py-4 px-6 font-semibold text-sm text-gray-600 dark:text-on-surface-variant uppercase tracking-wider text-right">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
                                    <tr v-for="film in films" :key="film.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/10 transition">
                                        <td class="py-4 px-6 flex items-center gap-4">
                                            <div class="h-16 w-12 bg-gray-200 dark:bg-gray-700 rounded shadow-sm overflow-hidden flex-shrink-0">
                                                <img v-if="film.poster_path" :src="film.poster_path" class="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <div class="font-bold text-gray-900 dark:text-gray-100">{{ film.title }}</div>
                                                <div class="text-xs text-on-surface-variant font-mono mt-1 mb-1">{{ film.duration_minutes }} menit</div>
                                                <div class="flex items-center gap-2 text-xs text-on-surface-variant">
                                                    <span class="flex items-center gap-1"><Star class="w-3 h-3 text-yellow-400 fill-current" /> {{ film.reviews_avg_rating ? Number(film.reviews_avg_rating).toFixed(1) : '-' }}</span>
                                                    <span>•</span>
                                                    <span class="flex items-center gap-1"><Users class="w-3 h-3" /> {{ film.rentals_count }}x disewa</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-4 px-6 font-bold text-blue-600 dark:text-blue-400">
                                            Rp {{ formatPrice(film.rental_price) }}
                                        </td>
                                        <td class="py-4 px-6">
                                            <span v-if="film.mux_playback_id" class="inline-flex items-center text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-md border border-green-200 dark:border-green-800">
                                                <div class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div> Ready
                                            </span>
                                            <span v-else-if="film.mux_upload_id" class="inline-flex items-center text-xs font-semibold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded-md border border-yellow-200 dark:border-yellow-800">
                                                <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 animate-pulse"></div> Processing
                                            </span>
                                            <span v-else class="text-xs text-on-surface-variant">Local</span>
                                        </td>
                                        <td class="py-4 px-6">
                                            <span v-if="film.approval_status === 'approved'" class="inline-flex items-center text-xs font-bold text-green-600">
                                                Disetujui Admin
                                            </span>
                                            <span v-else-if="film.approval_status === 'rejected'" class="inline-flex items-center text-xs font-bold text-error">
                                                Ditolak Admin
                                            </span>
                                            <span v-else class="inline-flex items-center text-xs font-bold text-yellow-600">
                                                Menunggu Review
                                            </span>
                                        </td>
                                        <td class="py-4 px-6">
                                            <button 
                                                @click="togglePublish(film.id)"
                                                class="px-3 py-1 text-xs font-bold rounded-full transition-colors"
                                                :class="film.is_published ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50' : 'bg-surface-container-low text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'"
                                                title="Klik untuk mengubah"
                                            >
                                                {{ film.is_published ? 'Di Etalase' : 'Disembunyikan' }}
                                            </button>
                                        </td>
                                        <td class="py-4 px-6 text-right">
                                            <div class="flex items-center justify-end gap-2">
                                                <Link 
                                                    :href="route('sineas.films.edit', film.id)" 
                                                    class="p-2 text-on-surface-variant hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
                                                    title="Edit Detail Film"
                                                >
                                                    <Edit2 class="w-5 h-5" />
                                                </Link>

                                                <Link 
                                                    :href="route('films.show', film.slug)" 
                                                    class="p-2 text-on-surface-variant hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                                    title="Lihat Halaman Publik"
                                                >
                                                    <ExternalLink class="w-5 h-5" />
                                                </Link>
    
                                                <Link 
                                                    :href="route('watch.show', film.slug)" 
                                                    class="p-2 text-on-surface-variant hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                                                    title="Pratinjau Pemutaran Mux"
                                                >
                                                    <Play class="w-5 h-5" />
                                                </Link>

                                                <button
                                                    @click="deleteFilm(film)"
                                                    class="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition"
                                                    title="Hapus Film Permanen"
                                                >
                                                    <Trash2 class="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

