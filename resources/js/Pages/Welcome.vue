<script setup>
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps({
    canLogin: Boolean,
    canRegister: Boolean,
    films: {
        type: Array,
        default: () => [],
    }
});

const heroFilm = computed(() => {
    if (props.films.length === 0) return null;

    // Temukan film dengan rating tertinggi atau penyewaan terbanyak (paling disukai)
    return [...props.films].sort((a, b) => {
        const scoreA = (a.reviews_avg_rating || 0) + (a.rentals_count || 0);
        const scoreB = (b.reviews_avg_rating || 0) + (b.rentals_count || 0);
        return scoreB - scoreA;
    })[0];
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
};
</script>

<template>
    <Head title="Beranda CineRent" />

        <MainLayout>
            <div class="flex flex-col w-full">
                <!-- Cinematic Hero Billboard -->
                <section v-if="heroFilm" class="relative w-full -mt-20 min-h-[640px] lg:min-h-[820px] flex items-center overflow-hidden pb-16 pt-32 lg:pb-32">
                    <div class="absolute inset-y-0 right-0 z-0  lg:w-1/2">
                        <img v-if="heroFilm.poster_path" :src="'/storage/' + heroFilm.poster_path.replace('/storage/', '')" class="w-full h-full object-cover object-top" />
                        <div v-else class="w-full h-full bg-surface-container-highest"></div>
                        <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 lg:bg-gradient-to-r lg:from-background lg:via-background/30 lg:to-transparent"></div>
                    </div>

                    <div class="relative z-10 w-full px-margin-mobile lg:px-margin-desktop flex flex-col gap-space-md max-w-4xl lg:max-w-3xl">
                        <div class="flex flex-wrap items-center gap-space-xs">
                            <span class="bg-primary-container text-on-primary-container font-label-sm px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                                <span class="material-symbols-outlined text-xs">local_fire_department</span> PILIHAN TERPOPULER
                            </span>
                            <span class="bg-surface-container-high/80 backdrop-blur-md text-secondary font-label-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                                <span class="material-symbols-outlined text-xs text-secondary" style="font-variation-settings: 'FILL' 1;">star</span> Rating {{ heroFilm.reviews_avg_rating ? Number(heroFilm.reviews_avg_rating).toFixed(1) : '-' }}
                            </span>
                        </div>

                        <div class="flex flex-col gap-space-2xs">
                            <p class="text-secondary font-label-lg tracking-widest uppercase text-shadow-sm">{{ heroFilm.filmmaker?.name || 'Sineas Lokal' }}</p>
                            <h1 class="font-display-hero text-display-hero text-on-surface uppercase tracking-tight drop-shadow-2xl">{{ heroFilm.title }}</h1>
                            <p class="font-body-lg text-on-surface-variant max-w-2xl drop-shadow-md">{{ heroFilm.description }}</p>
                        </div>

                        <div class="flex items-center gap-space-xs bg-surface-container-low/90 backdrop-blur-md px-3.5 py-2 rounded-xl max-w-xl shadow-md border border-surface-container-high mt-2">
                            <span class="material-symbols-outlined text-secondary text-base shrink-0">schedule</span>
                            <p class="font-body-sm text-on-surface-variant"><span class="text-on-surface font-medium">Durasi {{ heroFilm.duration_minutes }} Menit:</span> Masa simpan 30 hari; durasi tonton 48 jam tanpa batas sejak dimulai.</p>
                        </div>

                        <div class="flex flex-wrap items-center gap-space-sm pt-space-xs">
                            <Link :href="route('films.show', heroFilm.slug)" class="group flex items-center gap-space-xs bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all duration-200 hover:scale-105">
                                <span class="material-symbols-outlined text-xl transition-transform" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                                <span class="font-label-lg text-on-primary-container">Sewa Sekarang — Rp {{ formatPrice(heroFilm.rental_price) }} / 48 Jam</span>
                            </Link>
                        </div>
                    </div>
                </section>

                <!-- DYNAMIC FILMS FROM DATABASE -->
                <div class="flex flex-col gap-space-3xl px-margin-mobile lg:px-margin-desktop py-space-xl">
                    <section class="flex flex-col gap-space-md">
                        <div class="flex items-end justify-between">
                            <div>
                                <div class="flex items-center gap-space-xs text-primary font-label-sm uppercase tracking-wider">
                                    <span class="material-symbols-outlined text-sm">trending_up</span>
                                    <span>Paling Banyak Diputar</span>
                                </div>
                                <h2 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Katalog Film Lokal Terbaru</h2>
                            </div>
                        </div>

                        <div v-if="films.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-gutter-desktop">
                            <article v-for="(film, index) in films" :key="film.id" class="group relative flex flex-col bg-surface-container rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                <div class="relative w-full aspect-[2/3] overflow-hidden bg-surface-container-lowest">
                                    <img v-if="film.poster_path" :src="'/storage/' + film.poster_path.replace('/storage/', '')" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                        <span class="material-symbols-outlined text-4xl">movie</span>
                                    </div>

                                    <div class="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-black/40"></div>

                                    <div class="absolute top-2 left-2 flex flex-col gap-1 items-start">
                                        <span v-if="index === 0" class="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm px-2 py-0.5 rounded-md font-bold">TOP 1</span>
                                        <!-- <span class="bg-primary-container/95 text-on-primary-container font-label-sm px-2 py-0.5 rounded-md text-[10px]">4K HDR</span> -->
                                    </div>

                                    <div class="absolute top-2 right-2 flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-md px-1.5 py-0.5 rounded-md">
                                        <span class="material-symbols-outlined text-xs text-secondary" style="font-variation-settings: 'FILL' 1;">star</span>
                                        <span class="font-label-sm text-secondary">{{ film.reviews_avg_rating ? Number(film.reviews_avg_rating).toFixed(1) : '-' }}</span>
                                    </div>

                                    <div class="absolute bottom-2 left-2">
                                        <span class="font-label-sm text-on-surface-variant bg-surface-container-lowest/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px]">
                                            {{ film.duration_minutes }} Menit
                                        </span>
                                    </div>
                                </div>

                                <div class="p-space-sm flex flex-col gap-space-2xs flex-1 justify-between bg-surface-container">
                                    <div>
                                        <p class="font-label-sm text-primary uppercase tracking-wider text-[10px]">{{ film.filmmaker?.name || 'Sineas Lokal' }}</p>
                                        <h3 class="font-headline-sm text-headline-sm text-on-surface truncate group-hover:text-primary transition-colors">
                                            <Link :href="route('films.show', film.slug)">{{ film.title }}</Link>
                                        </h3>
                                    </div>
                                    <div class="pt-space-2xs flex flex-col gap-space-2xs">
                                        <div class="flex items-center justify-between">
                                            <div class="flex flex-col gap-1">
                                                <span v-if="film.genre" class="w-fit font-label-sm text-[10px] bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded uppercase tracking-wider">{{ film.genre }}</span>
                                                <span class="font-label-sm text-on-surface-variant text-[11px]">{{ film.rentals_count || 0 }}x disewa</span>
                                            </div>
                                            <span class="font-label-lg text-secondary font-bold text-xs">Rp {{ formatPrice(film.rental_price) }}</span>
                                        </div>
                                        <Link :href="route('films.show', film.slug)" class="w-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-label-sm py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm mt-1">
                                            <span class="material-symbols-outlined text-base">shopping_bag</span>
                                            <span>Sewa</span>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        </div>
                        <div v-else class="text-center py-20 bg-surface-container rounded-xl border border-dashed border-outline-variant">
                            <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">movie_filter</span>
                            <h3 class="mt-2 text-lg font-bold text-on-surface">Belum ada film</h3>
                            <p class="mt-1 text-sm text-on-surface-variant">Saat ini belum ada film yang dipublikasikan oleh sineas.</p>
                        </div>
                    </section>
                </div>

                <!-- SECTION 5 -->
                <div class="px-margin-mobile lg:px-margin-desktop mb-12">
                    <section class="w-full bg-surface-container-low rounded-2xl p-space-xl lg:p-space-2xl shadow-md">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl">
                            <div class="flex flex-col gap-space-xs">
                                <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                                    <span class="material-symbols-outlined text-2xl">no_accounts</span>
                                </div>
                                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Tanpa Biaya Langganan</h3>
                                <p class="font-body-sm text-on-surface-variant">Hanya bayar film yang Anda tonton. Bebas tagihan bulanan.</p>
                            </div>
                            <div class="flex flex-col gap-space-xs">
                                <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary">
                                    <span class="material-symbols-outlined text-2xl">high_quality</span>
                                </div>
                                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Kualitas Visual Maksimal</h3>
                                <p class="font-body-sm text-on-surface-variant">Kualitas visual maksimal. Yang di tonton oleh pengguna.</p>
                            </div>
                            <div class="flex flex-col gap-space-xs">
                                <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary">
                                    <span class="material-symbols-outlined text-2xl">timelapse</span>
                                </div>
                                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">48 Jam Bebas Putar Ulang</h3>
                                <p class="font-body-sm text-on-surface-variant">Setelah pertama kali diputar, tonton ulang sepuasnya selama 48 jam.</p>
                            </div>
                            <div class="flex flex-col gap-space-xs">
                                <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-fixed">
                                    <span class="material-symbols-outlined text-2xl">download_for_offline</span>
                                </div>
                                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Unduh & Nonton Offline <span>(coming soon)</span></h3>
                                <p class="font-body-sm text-on-surface-variant">Simpan film sewaan di perangkat Anda untuk ditonton offline.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
</template>
