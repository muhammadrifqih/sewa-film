<script setup>
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { ArrowLeft, Clock, ShoppingCart, Star, MessageSquare } from 'lucide-vue-next';
import { ref } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps({
    film: { type: Object, required: true }
});

const page = usePage();
const isProcessing = ref(false);

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
};

const rentFilm = () => {
    if (!page.props.auth.user) {
        router.visit(route('login'));
        return;
    }
    isProcessing.value = true;
    router.post(route('orders.store', props.film.slug), {}, {
        onFinish: () => { isProcessing.value = false; }
    });
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};
</script>

<template>
    <Head :title="film.title + ' | CineRent'" />

        <MainLayout>
            <div class="relative w-full min-h-screen">
                <!-- Immersive Hero Backdrop -->
                <div class="absolute top-0 left-0 w-full h-[500px] lg:h-[700px] overflow-hidden z-0">
                    <img v-if="film.poster_path" :src="film.poster_path.startsWith('http') ? film.poster_path : '/storage/' + film.poster_path.replace('/storage/', '')" class="w-full h-full object-cover object-top opacity-30 blur-3xl scale-110" />
                    <div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
                    <div class="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
                </div>

                <div class="relative z-10 w-full px-4 lg:px-12 pt-6 lg:pt-10 pb-20">
                    <Link :href="route('home')" class="inline-flex items-center text-sm font-bold text-on-surface-variant hover:text-on-surface mb-8 group transition-colors bg-surface-container-lowest/50 backdrop-blur-md px-4 py-2 rounded-full border border-surface-container-high w-fit">
                        <ArrowLeft class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Kembali
                    </Link>

                    <div class="flex flex-col md:flex-row gap-8 lg:gap-16">
                        <!-- Poster (Left) -->
                        <div class="w-[200px] sm:w-[260px] lg:w-[320px] shrink-0 mx-auto md:mx-0">
                            <div class="w-full aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-surface-container-highest relative group">
                                <img v-if="film.poster_path" :src="film.poster_path.startsWith('http') ? film.poster_path : '/storage/' + film.poster_path.replace('/storage/', '')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div v-else class="w-full h-full flex items-center justify-center bg-surface-container-high">
                                    <span class="material-symbols-outlined text-5xl text-on-surface-variant">movie</span>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            </div>
                        </div>

                        <!-- Info (Right) -->
                        <div class="flex flex-col flex-1 pt-2 lg:pt-8">
                            <div class="flex flex-wrap items-center gap-3 mb-4">
                                <span v-if="film.genre" class="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                                    {{ film.genre }}
                                </span>
                                <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                                    {{ film.duration_minutes }} Menit
                                </span>
                                <div v-if="film.reviews_avg_rating" class="flex items-center gap-1.5 bg-secondary/10 border border-secondary/20 px-3 py-1.5 rounded-md">
                                    <Star class="w-3.5 h-3.5 text-secondary fill-secondary" />
                                    <span class="font-bold text-secondary text-xs">{{ Number(film.reviews_avg_rating).toFixed(1) }}</span>
                                </div>
                            </div>

                            <h1 class="text-4xl sm:text-5xl lg:text-7xl font-display-hero text-on-surface mb-4 tracking-tight drop-shadow-lg leading-tight">{{ film.title }}</h1>
                            
                            <p class="text-primary font-bold tracking-widest uppercase mb-6 text-sm">
                                STUDIO: <span class="text-on-surface ml-1">{{ film.filmmaker?.name || 'Sineas Lokal' }}</span>
                            </p>

                            <p class="text-on-surface-variant font-body-lg text-lg leading-relaxed max-w-3xl mb-8">
                                {{ film.description || 'Tidak ada deskripsi untuk film ini.' }}
                            </p>

                            <!-- Pricing & Action Container -->
                            <div class="flex flex-col sm:flex-row items-center gap-6 mt-auto max-w-2xl bg-surface-container/40 backdrop-blur-md border border-surface-container-high p-6 rounded-3xl">
                                <div class="flex flex-col w-full sm:w-auto text-center sm:text-left">
                                    <p class="text-sm text-on-surface-variant mb-1 font-medium uppercase tracking-wider">Harga Sewa (48 Jam)</p>
                                    <p class="text-3xl font-display-hero text-on-surface">Rp {{ formatPrice(film.rental_price) }}</p>
                                </div>

                                <div class="w-full sm:w-px h-px sm:h-12 bg-surface-container-high my-2 sm:my-0 mx-2"></div>

                                <div class="flex w-full sm:w-auto flex-1 gap-3">
                                    <button
                                        @click="rentFilm"
                                        :disabled="isProcessing"
                                        class="flex-1 flex items-center justify-center px-4 sm:px-8 py-4 text-sm sm:text-lg font-bold rounded-2xl shadow-[0_0_30px_rgba(var(--color-primary),0.3)] text-on-primary bg-primary hover:bg-primary-fixed-dim hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ShoppingCart class="w-5 h-5 mr-2 sm:mr-3" />
                                        {{ isProcessing ? 'Memproses...' : 'Sewa' }}
                                    </button>
                                    
                                    <Link 
                                        v-if="$page.props.auth.user"
                                        :href="route('films.favorite', film.slug)" 
                                        method="post" 
                                        as="button" 
                                        preserve-scroll
                                        class="w-16 flex-shrink-0 flex items-center justify-center rounded-2xl border transition-all hover:scale-105"
                                        :class="$page.props.auth.favorite_film_ids.includes(film.id) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-surface-container-high'"
                                        title="Favoritkan Film"
                                    >
                                        <span class="material-symbols-outlined text-2xl" :style="[ $page.props.auth.favorite_film_ids.includes(film.id) ? 'font-variation-settings: \'FILL\' 1;' : '' ]">
                                            favorite
                                        </span>
                                    </Link>
                                    <Link 
                                        v-else 
                                        :href="route('login')" 
                                        class="w-16 flex-shrink-0 flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface rounded-2xl border border-surface-container-high transition-all hover:scale-105"
                                        title="Masuk untuk memfavoritkan"
                                    >
                                        <span class="material-symbols-outlined text-2xl">favorite</span>
                                    </Link>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-4 mt-6 text-sm text-on-surface-variant font-medium">
                                <span class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-lg">verified</span> Kualitas HD Resmi
                                </span>
                                <span class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-lg">devices</span> Putar di HP/Tablet/PC
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Reviews Section -->
                    <div class="mt-24 max-w-5xl">
                        <div class="flex items-center justify-between mb-8">
                            <h2 class="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight flex items-center gap-3">
                                <MessageSquare class="w-7 h-7 text-primary" />
                                Ulasan Penonton
                            </h2>
                            <span class="text-on-surface-variant font-medium">{{ film.reviews?.length || 0 }} Ulasan</span>
                        </div>

                        <div v-if="film.reviews && film.reviews.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div v-for="review in film.reviews" :key="review.id" class="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high shadow-lg hover:-translate-y-1 transition-transform">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 bg-gradient-to-br from-surface-container-highest to-surface-container rounded-full flex items-center justify-center text-on-surface font-bold text-lg border border-surface-container-highest shadow-inner">
                                            {{ review.user?.name.charAt(0).toUpperCase() }}
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-on-surface">{{ review.user?.name }}</h4>
                                            <p class="text-xs text-on-surface-variant mt-0.5">{{ formatDate(review.created_at) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-0.5 bg-surface-container px-2 py-1 rounded-lg">
                                        <template v-for="i in 5" :key="i">
                                            <Star
                                                class="w-3.5 h-3.5"
                                                :class="i <= review.rating ? 'text-secondary fill-secondary' : 'text-surface-container-high'"
                                            />
                                        </template>
                                    </div>
                                </div>
                                <p class="text-on-surface-variant text-sm leading-relaxed">{{ review.comment }}</p>
                            </div>
                        </div>

                        <div v-else class="text-center py-20 bg-surface-container-lowest rounded-3xl border border-dashed border-surface-container-highest">
                            <span class="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-4 block">reviews</span>
                            <h3 class="text-xl font-bold text-on-surface">Belum ada ulasan</h3>
                            <p class="text-on-surface-variant mt-2 max-w-sm mx-auto">Jadilah penonton pertama yang menyewa dan meninggalkan ulasan untuk film ini!</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
</template>
