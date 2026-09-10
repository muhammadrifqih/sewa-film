<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { Film, CheckCircle, XCircle, Trash2 } from 'lucide-vue-next';

defineProps({
    films: Array,
});

const toggleFilm = (film) => {
    router.post(route('admin.films.toggle', film.id), {}, { preserveScroll: true });
};

const deleteFilm = (film) => {
    if (confirm(`Apakah Anda yakin ingin menghapus film "${film.title}"? Aksi ini tidak dapat dibatalkan!`)) {
        router.delete(route('admin.films.destroy', film.id), { preserveScroll: true });
    }
};
</script>

<template>
    <Head title="Validasi Film" />

    <MainLayout>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

                <div class="flex items-center gap-3 mb-6 px-4 sm:px-0">
                    <Film class="w-8 h-8 text-pink-500" />
                    <h1 class="text-3xl font-bold text-on-surface">Validasi & Katalog Film</h1>
                </div>

                <div class="bg-surface-container rounded-2xl shadow border border-surface-container-high overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-on-surface-variant">
                            <thead class="text-xs text-gray-700 uppercase bg-surface-container-lowest dark:text-on-surface-variant">
                                <tr>
                                    <th scope="col" class="px-6 py-4">Poster</th>
                                    <th scope="col" class="px-6 py-4">Judul Film</th>
                                    <th scope="col" class="px-6 py-4">Sineas</th>
                                    <th scope="col" class="px-6 py-4">Harga Sewa</th>
                                    <th scope="col" class="px-6 py-4">Status Publish</th>
                                    <th scope="col" class="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="film in films" :key="film.id" class="bg-surface-container border-b border-surface-container-high hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td class="px-6 py-4">
                                        <img v-if="film.poster_path" :src="'/storage/' + film.poster_path" class="w-16 h-24 object-cover rounded shadow" />
                                        <div v-else class="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">N/A</div>
                                    </td>
                                    <td class="px-6 py-4 font-bold text-on-surface">{{ film.title }}</td>
                                    <td class="px-6 py-4">{{ film.filmmaker ? film.filmmaker.name : 'Unknown' }}</td>
                                    <td class="px-6 py-4 font-mono">Rp {{ new Intl.NumberFormat('id-ID').format(film.rental_price) }}</td>
                                    <td class="px-6 py-4">
                                        <span v-if="film.is_published" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            <CheckCircle class="w-3 h-3" /> Dipublikasikan
                                        </span>
                                        <span v-else class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                            <XCircle class="w-3 h-3" /> Disembunyikan
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 flex flex-col gap-2 justify-end items-end h-full">
                                        <button @click="toggleFilm(film)" class="px-4 py-2 text-xs font-bold text-on-surface rounded-lg transition"
                                            :class="film.is_published ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'">
                                            {{ film.is_published ? 'Sembunyikan' : 'Publish/Setujui' }}
                                        </button>
                                        <button @click="deleteFilm(film)" class="px-4 py-2 text-xs font-bold text-on-surface bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-1">
                                            <Trash2 class="w-3 h-3" /> Hapus
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="films.length === 0">
                                    <td colspan="6" class="px-6 py-8 text-center text-on-surface-variant">Belum ada film di database.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </MainLayout>
</template>

