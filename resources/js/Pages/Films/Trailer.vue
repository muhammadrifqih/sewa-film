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
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20">
                <Link :href="route('home')" class="inline-flex items-center text-sm font-medium text-secondary hover:text-secondary-fixed mb-6 group transition-colors">
                    <ArrowLeft class="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                    Kembali ke Katalog
                </Link>

                <div class="bg-surface-container rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors duration-300 border border-surface-container-high">
                    <!-- Poster side -->
                    <div class="w-full md:w-2/5 aspect-[2/3] bg-surface-container-lowest relative">
                        <img v-if="film.poster_path" :src="'/storage/' + film.poster_path.replace('/storage/', '')" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-on-surface-variant bg-surface-container-high">
                            <span class="material-symbols-outlined text-5xl">movie</span>
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent md:hidden"></div>
                    </div>

                    <!-- Info side -->
                    <div class="w-full md:w-3/5 p-8 lg:p-10 flex flex-col relative">
                        <div class="flex items-center justify-between mb-2">
                            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Film Lokal
                            </span>
                            <div v-if="film.reviews_avg_rating" class="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-lg">
                                <Star class="w-4 h-4 text-secondary fill-secondary" />
                                <span class="font-bold text-secondary">{{ Number(film.reviews_avg_rating).toFixed(1) }}</span>
                                <span class="text-xs text-on-surface-variant">({{ film.reviews?.length || 0 }})</span>
                            </div>
                        </div>

                        <h1 class="text-3xl lg:text-5xl font-display-hero text-on-surface mb-2 tracking-tight">{{ film.title }}</h1>
                        <p class="text-on-surface-variant font-medium mb-6 flex items-center gap-2">
                            Publish: <span class="text-on-surface">{{ film.filmmaker?.name || 'Sineas Lokal' }}</span>
                        </p>

                        <div class="flex items-center space-x-4 mb-8">
                            <span class="inline-flex items-center text-sm text-on-surface bg-surface-container-high border border-outline-variant px-4 py-1.5 rounded-full font-medium">
                                <Clock class="w-4 h-4 mr-2 text-on-surface-variant" />
                                {{ film.duration_minutes }} Menit
                            </span>
                            <span v-if="film.genre" class="inline-flex items-center text-sm text-on-surface bg-surface-container-high border border-outline-variant px-4 py-1.5 rounded-full font-medium">
                                <span class="material-symbols-outlined text-sm mr-2 text-on-surface-variant">movie</span>
                                {{ film.genre }}
                            </span>
                            <span v-if="film.rentals_count" class="inline-flex items-center text-sm text-on-surface bg-surface-container-high border border-outline-variant px-4 py-1.5 rounded-full font-medium">
                                <span class="material-symbols-outlined text-sm mr-2 text-on-surface-variant">visibility</span>
                                {{ film.rentals_count }}x Disewa
                            </span>
                        </div>

                        <div class="prose prose-sm prose-invert text-on-surface-variant mb-10 flex-grow text-base leading-relaxed">
                            <p>{{ film.description || 'Tidak ada deskripsi untuk film ini.' }}</p>
                        </div>

                        <div class="mt-auto bg-surface-container-low border border-surface-container-high p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p class="text-sm text-on-surface-variant mb-1">Harga Sewa (48 Jam)</p>
                                <p class="text-3xl font-bold text-secondary">Rp {{ formatPrice(film.rental_price) }}</p>
                            </div>

                            <button
                                @click="rentFilm"
                                :disabled="isProcessing"
                                class="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl shadow-[0_0_15px_rgba(229,9,20,0.4)] text-on-primary-container bg-primary-container hover:bg-primary-fixed-dim hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all"
                            >
                                <ShoppingCart class="w-5 h-5 mr-2" />
                                {{ isProcessing ? 'Memproses...' : 'Sewa Sekarang' }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Reviews Section -->
                <div class="mt-16 pb-20">
                    <h2 class="text-2xl font-headline-md text-on-surface mb-8 flex items-center gap-2">
                        <MessageSquare class="w-6 h-6 text-primary" />
                        Ulasan Penonton
                    </h2>

                    <div v-if="film.reviews && film.reviews.length > 0" class="grid gap-6">
                        <div v-for="review in film.reviews" :key="review.id" class="bg-surface-container rounded-2xl p-6 border border-surface-container-high">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center text-on-surface font-bold border border-outline-variant">
                                        {{ review.user?.name.charAt(0).toUpperCase() }}
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-on-surface">{{ review.user?.name }}</h4>
                                        <p class="text-xs text-on-surface-variant">{{ formatDate(review.created_at) }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <template v-for="i in 5" :key="i">
                                        <Star
                                            class="w-4 h-4"
                                            :class="i <= review.rating ? 'text-secondary fill-secondary' : 'text-surface-container-highest'"
                                        />
                                    </template>
                                </div>
                            </div>
                            <p class="text-on-surface-variant text-sm">{{ review.comment }}</p>
                        </div>
                    </div>

                    <div v-else class="text-center py-16 bg-surface-container rounded-2xl border border-dashed border-outline-variant">
                        <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-3">reviews</span>
                        <h3 class="text-lg font-bold text-on-surface">Belum ada ulasan</h3>
                        <p class="text-sm text-on-surface-variant">Jadilah yang pertama menyewa dan mengulas film ini!</p>
                    </div>
                </div>
            </div>
        </MainLayout>
</template>
