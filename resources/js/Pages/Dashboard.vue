<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { Film, Plus, Play, Eye, EyeOff } from 'lucide-vue-next';

defineProps({
    films: {
        type: Array,
        required: true,
    }
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
};

const togglePublish = (filmId) => {
    router.patch(route('dashboard.films.toggle-publish', filmId), {}, {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head title="Dashboard Sineas" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Karya Saya
                </h2>
                <Link
                    :href="route('dashboard.films.create')"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-on-surface uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                >
                    <Plus class="w-4 h-4 mr-1" />
                    Upload Film Baru
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                
                <div v-if="$page.props.flash?.success" class="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                    {{ $page.props.flash.success }}
                </div>

                <div class="overflow-hidden bg-surface dark:bg-gray-800 shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700">
                    <div class="p-6 text-gray-900 dark:text-gray-100">
                        <div v-if="films.length === 0" class="text-center py-12">
                            <Film class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Belum ada karya</h3>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Mulai unggah film perdana Anda dan jangkau penonton yang lebih luas.</p>
                        </div>

                        <div v-else class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-gray-200 dark:border-gray-700">
                                        <th class="py-4 font-medium text-gray-500 dark:text-gray-400">Info Film</th>
                                        <th class="py-4 font-medium text-gray-500 dark:text-gray-400">Harga Sewa</th>
                                        <th class="py-4 font-medium text-gray-500 dark:text-gray-400">Durasi</th>
                                        <th class="py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                                        <th class="py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="film in films" :key="film.id" class="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20">
                                        <td class="py-4 flex items-center gap-4">
                                            <div class="h-16 w-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                                                <img v-if="film.poster_path" :src="film.poster_path" class="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <div class="font-semibold text-gray-900 dark:text-gray-100">{{ film.title }}</div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ film.slug }}</div>
                                            </div>
                                        </td>
                                        <td class="py-4 font-medium text-blue-600 dark:text-blue-400">
                                            Rp {{ formatPrice(film.rental_price) }}
                                        </td>
                                        <td class="py-4 text-gray-600 dark:text-gray-300">
                                            {{ film.duration_minutes }} mnt
                                        </td>
                                        <td class="py-4">
                                            <span 
                                                class="px-2 py-1 text-xs font-semibold rounded-full"
                                                :class="film.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'"
                                            >
                                                {{ film.is_published ? 'Publik' : 'Draft' }}
                                            </span>
                                        </td>
                                        <td class="py-4 text-right space-x-2">
                                            <button 
                                                @click="togglePublish(film.id)"
                                                class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                                :title="film.is_published ? 'Jadikan Draft' : 'Publikasikan'"
                                            >
                                                <EyeOff v-if="film.is_published" class="w-5 h-5" />
                                                <Eye v-else class="w-5 h-5" />
                                            </button>
                                            
                                            <Link 
                                                :href="route('films.show', film.slug)" 
                                                class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                                title="Lihat Halaman"
                                            >
                                                <Play class="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
