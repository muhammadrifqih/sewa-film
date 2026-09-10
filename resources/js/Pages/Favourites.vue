<script setup>
import { Head, Link } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps({
    films: Object,
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
};
</script>

<template>
    <Head title="Film Favorit - CineRent" />

    <MainLayout>
        <div class="flex flex-col w-full gap-6 lg:gap-8 pt-6 lg:pt-8">
            
            <!-- Header -->
            <section class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 class="text-3xl lg:text-4xl font-bold text-on-surface tracking-tight flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1;">favorite</span>
                        Film Favorit Saya
                    </h1>
                    <p class="text-on-surface-variant mt-1">Daftar film yang Anda simpan untuk ditonton nanti</p>
                </div>
            </section>

            <!-- Grid -->
            <section>
                <div v-if="films.data.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
                    <div v-for="film in films.data" :key="film.id" class="group flex flex-col gap-2 lg:gap-3 w-full relative">
                        <Link :href="route('films.show', film.slug)" class="w-full aspect-[2/3] rounded-xl lg:rounded-2xl overflow-hidden bg-surface-container-high relative shadow-lg block">
                            <img v-if="film.poster_path" :src="film.poster_path.startsWith('http') ? film.poster_path : '/storage/' + film.poster_path.replace('/storage/', '')" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                            <div v-if="film.genre" class="absolute top-2 left-2 bg-surface/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-on-surface border border-surface-container-high pointer-events-none">
                                {{ film.genre }}
                            </div>
                        </Link>
                        
                        <!-- Unfavorite Button Overlay -->
                        <Link 
                            :href="route('films.favorite', film.slug)" 
                            method="post" 
                            as="button" 
                            preserve-scroll
                            class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-surface/80 hover:bg-error backdrop-blur-md text-primary hover:text-on-error rounded-full border border-surface-container-high transition-colors shadow-lg z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Hapus dari Favorit"
                        >
                            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">close</span>
                        </Link>
                        
                        <Link :href="route('films.show', film.slug)" class="flex flex-col gap-0.5 lg:gap-1 px-1">
                            <h3 class="font-bold text-on-surface text-sm lg:text-base truncate group-hover:text-primary transition-colors">{{ film.title }}</h3>
                            <div class="flex items-center gap-2 text-xs lg:text-sm text-on-surface-variant font-medium">
                                <span class="flex items-center gap-1 text-secondary">
                                    <span class="material-symbols-outlined text-[12px] lg:text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
                                    {{ film.reviews_avg_rating ? Number(film.reviews_avg_rating).toFixed(1) : '-' }}
                                </span>
                                <div class="w-1 h-1 rounded-full bg-surface-container-highest"></div>
                                <span class="truncate">{{ formatPrice(film.rental_price) }} IDR</span>
                            </div>
                        </Link>
                    </div>
                </div>
                
                <div v-else class="flex flex-col items-center justify-center py-20 text-center gap-4 bg-surface-container-low rounded-3xl border border-surface-container border-dashed mt-4">
                    <div class="w-20 h-20 bg-surface-container flex items-center justify-center rounded-full mb-2">
                        <span class="material-symbols-outlined text-4xl text-on-surface-variant">heart_broken</span>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-on-surface mb-1">Belum ada film favorit</h3>
                        <p class="text-on-surface-variant text-sm max-w-md mx-auto">Anda belum menambahkan film apapun ke daftar favorit. Mulai jelajahi katalog kami dan simpan film yang ingin Anda tonton nanti.</p>
                    </div>
                    <Link :href="route('explore')" class="mt-4 bg-primary hover:bg-primary-fixed-dim text-on-primary px-8 py-3 rounded-xl transition-colors font-bold shadow-[0_0_20px_rgba(var(--color-primary),0.2)]">
                        Jelajahi Film
                    </Link>
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
