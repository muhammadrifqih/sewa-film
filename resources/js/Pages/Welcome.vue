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
            <div class="flex flex-col w-full gap-6 lg:gap-8 pt-2 lg:pt-0">
                
                <!-- Featured Banner -->
                <section v-if="heroFilm" class="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden flex items-end pb-6 px-4 lg:pb-12 lg:px-12 group">
                    <!-- Background Image -->
                    <div class="absolute inset-0 z-0">
                        <img v-if="heroFilm.poster_path" :src="heroFilm.poster_path" class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        <div v-else class="w-full h-full bg-surface-container-highest"></div>
                        <!-- Gradient Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-background via-background/60 lg:via-background/40 to-transparent"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-background/80 lg:from-background via-background/40 lg:via-background/60 to-transparent w-full lg:w-2/3"></div>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 w-full max-w-3xl flex flex-col gap-2 lg:gap-4">
                        <div class="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                            <span class="bg-surface-container-lowest/60 lg:bg-surface-container-lowest/40 backdrop-blur-md border border-surface-container-high text-on-surface font-label-sm lg:font-label-md px-3 py-1 lg:px-4 lg:py-1.5 rounded-full flex items-center gap-1.5 lg:gap-2">
                                <span class="text-error">🔥</span> Now Trending
                            </span>
                        </div>

                        <div class="flex items-center gap-2 text-on-surface-variant font-label-sm lg:text-sm">
                            <span class="bg-surface-container/50 backdrop-blur-md px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[10px] lg:text-xs">{{ heroFilm.genre || 'Action' }}</span>
                            <span class="bg-surface-container/50 backdrop-blur-md px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[10px] lg:text-xs">{{ heroFilm.duration_minutes }} min</span>
                        </div>

                        <h1 class="font-display-hero text-3xl sm:text-5xl lg:text-7xl text-on-surface font-bold tracking-tight drop-shadow-xl leading-tight">{{ heroFilm.title }}</h1>
                        
                        <p class="font-body-sm lg:font-body-lg text-on-surface-variant max-w-2xl drop-shadow-md line-clamp-2 lg:line-clamp-3 lg:mt-2 hidden sm:block">
                            {{ heroFilm.description }}
                        </p>

                        <div class="flex items-center gap-3 lg:gap-4 mt-2 lg:mt-4">
                            <Link :href="route('films.show', heroFilm.slug)" class="flex items-center justify-center lg:justify-start gap-1 lg:gap-2 bg-primary hover:bg-primary-fixed-dim text-on-primary px-4 py-2.5 lg:px-8 lg:py-3.5 rounded-xl lg:rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:scale-105 flex-1 sm:flex-none text-sm lg:text-base">
                                <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                                Watch Now
                            </Link>
                            
                            <!-- Favorite Button -->
                            <Link 
                                v-if="$page.props.auth.user"
                                :href="route('films.favorite', heroFilm.slug)" 
                                method="post" 
                                as="button" 
                                preserve-scroll
                                class="w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center backdrop-blur-md rounded-xl lg:rounded-2xl border transition-colors"
                                :class="$page.props.auth.favorite_film_ids.includes(heroFilm.id) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-surface-container/50 hover:bg-surface-container text-on-surface border-surface-container-high'"
                            >
                                <span class="material-symbols-outlined text-lg lg:text-2xl" :style="[ $page.props.auth.favorite_film_ids.includes(heroFilm.id) ? 'font-variation-settings: \'FILL\' 1;' : '' ]">
                                    favorite
                                </span>
                            </Link>
                            <Link v-else :href="route('login')" class="w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center bg-surface-container/50 hover:bg-surface-container backdrop-blur-md text-on-surface rounded-xl lg:rounded-2xl border border-surface-container-high transition-colors">
                                <span class="material-symbols-outlined text-lg lg:text-2xl">favorite</span>
                            </Link>

                            <button class="w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center bg-surface-container/50 hover:bg-surface-container backdrop-blur-md text-on-surface rounded-xl lg:rounded-2xl border border-surface-container-high transition-colors">
                                <span class="material-symbols-outlined text-lg lg:text-2xl">more_horiz</span>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Genres Filter -->
                <section class="flex items-center gap-2 lg:gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 lg:mx-0 lg:px-0">
                    <button class="snap-start flex-shrink-0 px-4 py-2 lg:px-6 lg:py-2.5 bg-surface text-background font-bold rounded-full transition-colors text-sm lg:text-base">Trending</button>
                    <button class="snap-start flex-shrink-0 px-4 py-2 lg:px-6 lg:py-2.5 bg-surface-container border border-surface-container-high text-on-surface-variant hover:text-on-surface rounded-full transition-colors text-sm lg:text-base">Adventure</button>
                    <button class="snap-start flex-shrink-0 px-4 py-2 lg:px-6 lg:py-2.5 bg-surface-container border border-surface-container-high text-on-surface-variant hover:text-on-surface rounded-full transition-colors text-sm lg:text-base">Action</button>
                    <button class="snap-start flex-shrink-0 px-4 py-2 lg:px-6 lg:py-2.5 bg-surface-container border border-surface-container-high text-on-surface-variant hover:text-on-surface rounded-full transition-colors text-sm lg:text-base">Comedy</button>
                    <button class="snap-start flex-shrink-0 px-4 py-2 lg:px-6 lg:py-2.5 bg-surface-container border border-surface-container-high text-on-surface-variant hover:text-on-surface rounded-full transition-colors text-sm lg:text-base">Crime</button>
                    <button class="snap-start flex-shrink-0 px-4 py-2 lg:px-6 lg:py-2.5 bg-surface-container border border-surface-container-high text-on-surface-variant hover:text-on-surface rounded-full transition-colors text-sm lg:text-base">Drama</button>
                    <button class="snap-start flex-shrink-0 px-4 py-2 lg:px-6 lg:py-2.5 bg-surface-container border border-surface-container-high text-on-surface-variant hover:text-on-surface rounded-full transition-colors text-sm lg:text-base">Fantasy</button>
                    <button class="snap-start flex-shrink-0 px-4 py-2 lg:px-6 lg:py-2.5 bg-surface-container border border-surface-container-high text-on-surface-variant hover:text-on-surface rounded-full transition-colors text-sm lg:text-base">Horror</button>
                    <div class="flex-1 hidden lg:block"></div>
                    <button class="hidden lg:flex w-10 h-10 items-center justify-center bg-surface-container text-on-surface-variant hover:text-on-surface rounded-full flex-shrink-0">
                        <span class="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button class="hidden lg:flex w-10 h-10 items-center justify-center bg-surface-container text-on-surface-variant hover:text-on-surface rounded-full flex-shrink-0">
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </section>

                <!-- You Might Like -->
                <section class="flex flex-col gap-4 lg:gap-6 mt-2 lg:mt-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl lg:text-2xl font-bold text-on-surface tracking-tight">You Might Like</h2>
                        <Link href="#" class="px-4 py-1.5 lg:px-5 lg:py-2 rounded-full bg-surface-container border border-surface-container-high text-on-surface-variant hover:text-on-surface font-medium text-xs lg:text-sm transition-colors">
                            See All
                        </Link>
                    </div>

                    <div v-if="films.length > 0" class="flex lg:grid lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
                        <Link :href="route('films.show', film.slug)" v-for="film in films" :key="film.id" class="group flex flex-col gap-2 lg:gap-3 w-[140px] sm:w-[180px] lg:w-auto flex-shrink-0 snap-start">
                            <div class="w-full aspect-[2/3] rounded-xl lg:rounded-2xl overflow-hidden bg-surface-container-high relative shadow-lg">
                                <img v-if="film.poster_path" :src="film.poster_path.startsWith('http') ? film.poster_path : '/storage/' + film.poster_path.replace('/storage/', '')" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                            </div>
                            
                            <div class="flex flex-col gap-0.5 lg:gap-1 px-1">
                                <h3 class="font-bold text-on-surface text-sm lg:text-base truncate">{{ film.title }}</h3>
                                <div class="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm text-on-surface-variant font-medium">
                                    <span>{{ new Date().getFullYear() }}</span>
                                    <div class="w-1 h-1 rounded-full bg-surface-container-highest"></div>
                                    <span class="flex items-center gap-1 text-secondary">
                                        <span class="material-symbols-outlined text-[12px] lg:text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
                                        {{ film.reviews_avg_rating ? Number(film.reviews_avg_rating).toFixed(1) : (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1) }}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
                
            </div>
        </MainLayout>
</template>
