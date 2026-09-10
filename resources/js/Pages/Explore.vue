<script setup>
import { ref, watch } from 'vue';
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps({
    films: Object,
    genres: Array,
    filters: Object,
});

const form = ref({
    search: props.filters.search || '',
    genre: props.filters.genre || '',
    sort: props.filters.sort || 'latest',
});

const applyFilters = () => {
    let query = {};
    if (form.value.search) query.search = form.value.search;
    if (form.value.genre) query.genre = form.value.genre;
    if (form.value.sort !== 'latest') query.sort = form.value.sort;

    router.get(route('explore'), query, { preserveState: true, preserveScroll: true });
};

watch(form, () => {
    applyFilters();
}, { deep: true });

</script>

<template>
    <Head title="Explore Films - CineRent" />

    <MainLayout>
        <div class="flex flex-col w-full gap-6 lg:gap-8 pt-6 lg:pt-8">
            
            <!-- Header & Filters -->
            <section class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 class="text-3xl lg:text-4xl font-bold text-on-surface tracking-tight">Katalog Lengkap</h1>
                    <p class="text-on-surface-variant mt-1">Jelajahi seluruh koleksi film kami</p>
                </div>

                <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <!-- Genre Filter -->
                    <select v-model="form.genre" class="bg-surface-container border-none text-on-surface text-sm rounded-xl focus:ring-1 focus:ring-primary py-2.5 pl-4 pr-10 cursor-pointer">
                        <option value="">Semua Genre</option>
                        <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
                    </select>

                    <!-- Sort Options -->
                    <select v-model="form.sort" class="bg-surface-container border-none text-on-surface text-sm rounded-xl focus:ring-1 focus:ring-primary py-2.5 pl-4 pr-10 cursor-pointer">
                        <option value="latest">Terbaru</option>
                        <option value="popular">Paling Populer</option>
                        <option value="top_rated">Rating Tertinggi</option>
                    </select>
                </div>
            </section>

            <!-- Search Results Info -->
            <div v-if="filters.search" class="flex items-center gap-2 text-on-surface-variant bg-surface-container-low px-4 py-3 rounded-xl border border-surface-container">
                <span class="material-symbols-outlined">search</span>
                <span>Menampilkan hasil pencarian untuk: <strong class="text-on-surface">"{{ filters.search }}"</strong></span>
                <button @click="form.search = ''" class="ml-auto text-error hover:text-error-container text-sm font-bold">Hapus Pencarian</button>
            </div>

            <!-- Grid -->
            <section>
                <div v-if="films.data.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
                    <Link :href="route('films.show', film.slug)" v-for="film in films.data" :key="film.id" class="group flex flex-col gap-2 lg:gap-3 w-full">
                        <div class="w-full aspect-[2/3] rounded-xl lg:rounded-2xl overflow-hidden bg-surface-container-high relative shadow-lg">
                            <img v-if="film.poster_path" :src="film.poster_path.startsWith('http') ? film.poster_path : '/storage/' + film.poster_path.replace('/storage/', '')" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                            <div v-if="film.genre" class="absolute top-2 left-2 bg-surface/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-on-surface border border-surface-container-high">
                                {{ film.genre }}
                            </div>
                        </div>
                        
                        <div class="flex flex-col gap-0.5 lg:gap-1 px-1">
                            <h3 class="font-bold text-on-surface text-sm lg:text-base truncate">{{ film.title }}</h3>
                            <div class="flex items-center gap-2 text-xs lg:text-sm text-on-surface-variant font-medium">
                                <span class="flex items-center gap-1 text-secondary">
                                    <span class="material-symbols-outlined text-[12px] lg:text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
                                    {{ film.reviews_avg_rating ? Number(film.reviews_avg_rating).toFixed(1) : '-' }}
                                </span>
                                <div class="w-1 h-1 rounded-full bg-surface-container-highest"></div>
                                <span class="truncate">{{ formatPrice(film.rental_price) }} IDR</span>
                            </div>
                        </div>
                    </Link>
                </div>
                
                <div v-else class="flex flex-col items-center justify-center py-20 text-center gap-4 bg-surface-container-low rounded-3xl border border-surface-container border-dashed">
                    <span class="material-symbols-outlined text-6xl text-surface-container-highest">sentiment_dissatisfied</span>
                    <div>
                        <h3 class="text-xl font-bold text-on-surface mb-1">Film tidak ditemukan</h3>
                        <p class="text-on-surface-variant text-sm">Coba ubah kata kunci pencarian atau filter genre Anda.</p>
                    </div>
                    <button @click="form.search = ''; form.genre = ''" class="mt-2 bg-surface-container hover:bg-surface-container-high text-on-surface px-6 py-2 rounded-xl transition-colors font-medium">Reset Pencarian</button>
                </div>

                <!-- Pagination -->
                <div v-if="films.links && films.data.length > 0" class="flex justify-center mt-12 gap-2 flex-wrap">
                    <template v-for="(link, key) in films.links" :key="key">
                        <div v-if="link.url === null" class="px-4 py-2 text-sm text-on-surface-variant bg-surface-container-low border border-surface-container rounded-lg cursor-not-allowed" v-html="link.label"></div>
                        <Link v-else :href="link.url" class="px-4 py-2 text-sm rounded-lg transition-colors border border-surface-container" :class="link.active ? 'bg-primary text-on-primary font-bold border-primary' : 'text-on-surface bg-surface-container-lowest hover:bg-surface-container'" v-html="link.label"></Link>
                    </template>
                </div>
            </section>
            
        </div>
    </MainLayout>
</template>

<script>
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
};
</script>
