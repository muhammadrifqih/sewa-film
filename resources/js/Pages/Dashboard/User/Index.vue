<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { Film, PlayCircle, Clock, Search, History } from 'lucide-vue-next';
import dayjs from 'dayjs';
import MainLayout from '@/Layouts/MainLayout.vue';

defineProps({
    rentals: Array
});

const formatDate = (date) => {
    return dayjs(date).format('DD MMM YYYY, HH:mm');
};
</script>

<template>
    <Head title="Sewa Saya | CineRent" />

        <MainLayout>
            <!-- Hero Section -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-20">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-container rounded-3xl p-8 lg:p-12 border border-surface-container-high shadow-2xl relative overflow-hidden">
                    <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div class="text-on-surface relative z-10">
                        <h1 class="text-3xl lg:text-4xl font-headline-lg mb-3">Halo, <span class="text-primary">{{ $page.props.auth.user.name }}</span>! 👋</h1>
                        <p class="text-on-surface-variant font-body-lg max-w-xl">
                            Selamat datang di ruang menonton Anda. Lanjutkan menonton film yang sedang Anda sewa sebelum batas waktunya habis.
                        </p>
                    </div>
                    <div class="relative z-10 w-full md:w-auto">
                        <Link :href="route('home')" class="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-primary-container text-on-primary-container font-label-lg rounded-xl shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:bg-primary-fixed-dim transition-all hover:scale-105">
                            <Search class="w-5 h-5 mr-2" />
                            Jelajahi Katalog Baru
                        </Link>
                    </div>
                </div>
            </div>

            <!-- Active Rentals -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div class="flex items-center gap-3 mb-8 border-b border-surface-container-high pb-4">
                    <div class="p-2 bg-secondary-container/20 text-secondary rounded-lg border border-secondary/30">
                        <History class="w-6 h-6" />
                    </div>
                    <h3 class="text-2xl font-headline-md text-on-surface">Film Sedang Disewa</h3>
                </div>

                <!-- Empty State -->
                <div v-if="rentals.length === 0" class="text-center py-20 px-4 bg-surface-container rounded-3xl border border-dashed border-outline-variant">
                    <div class="bg-surface-container-lowest w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-surface-container-high shadow-inner">
                        <Film class="h-10 w-10 text-on-surface-variant" />
                    </div>
                    <h3 class="text-xl font-headline-sm text-on-surface mb-3">Belum Ada Film Aktif</h3>
                    <p class="text-on-surface-variant font-body-md mb-8 max-w-md mx-auto">
                        Anda belum menyewa film apapun, atau masa sewa film Anda sebelumnya telah habis (melewati 48 jam).
                    </p>
                    <Link :href="route('home')" class="inline-flex items-center px-6 py-3 bg-surface-container-high text-on-surface border border-outline-variant font-label-md rounded-xl hover:text-on-surface hover:border-white transition-colors">
                        Cari Film Menarik Sekarang
                    </Link>
                </div>

                <!-- Grid Data -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
                    <div v-for="rental in rentals" :key="rental.id" class="group flex flex-col bg-surface-container border border-surface-container-high rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                        <!-- Thumbnail -->
                        <div class="relative aspect-[2/3] bg-surface-container-lowest overflow-hidden">
                            <img v-if="rental.film.poster_path" :src="'/storage/' + rental.film.poster_path.replace('/storage/', '')" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>

                            <!-- Hover Overlay -->
                            <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                <Link :href="route('watch.show', rental.film.slug)" class="flex flex-col items-center text-on-surface scale-90 group-hover:scale-100 transition-transform">
                                    <PlayCircle class="w-16 h-16 mb-2 text-primary drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]" />
                                    <span class="font-label-sm tracking-widest uppercase drop-shadow">Tonton Sekarang</span>
                                </Link>
                            </div>

                            <!-- Film Length Badge -->
                            <div class="absolute top-3 left-3 bg-primary-container/90 text-on-primary-container text-[10px] font-bold px-2.5 py-1 rounded shadow-md border border-primary-fixed-dim/30">
                                FILM lokal
                            </div>
                            <div class="absolute top-3 right-3 bg-surface-container-lowest/80 backdrop-blur-md text-on-surface text-[10px] font-bold px-2 py-1 rounded border border-surface-container-high">
                                {{ rental.film.duration_minutes }} mnt
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-5 flex-grow flex flex-col justify-between">
                            <div>
                                <p class="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Masa Aktif 48 Jam</p>
                                <h4 class="font-headline-sm text-on-surface mb-4 line-clamp-1 group-hover:text-primary transition-colors">{{ rental.film.title }}</h4>
                            </div>

                            <div class="bg-surface-container-lowest border border-surface-container-high rounded-xl p-3 flex items-center justify-between">
                                <div class="flex items-center text-secondary">
                                    <Clock class="w-5 h-5 mr-3" />
                                    <div>
                                        <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Akses Berakhir</div>
                                        <div class="text-xs font-semibold mt-0.5 text-on-surface">{{ formatDate(rental.access_expires_at) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
</template>
