<template>
    <div class="min-h-screen bg-background font-body-md text-on-surface flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
        <!-- Header -->
        <header class="h-20 flex items-center justify-between px-margin-mobile lg:px-margin-desktop bg-surface/85 backdrop-blur-xl border-b border-surface-container shadow-md z-30">
            <div class="flex items-center gap-space-md">
                <Link :href="route('films.show', film.slug)" class="text-on-surface-variant hover:text-on-surface transition flex items-center gap-2 group">
                    <ArrowLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span class="font-label-md hidden sm:inline">Kembali</span>
                </Link>
                <div class="h-6 w-px bg-surface-container-high mx-2"></div>
                <h1 class="text-lg font-headline-sm tracking-tight text-on-surface line-clamp-1">{{ film.title }}</h1>
                <span v-if="role === 'admin' || role === 'sineas'" class="px-2 py-0.5 bg-secondary-container/20 text-secondary border border-secondary/30 text-[10px] font-bold rounded-sm tracking-wider uppercase ml-2">
                    Pratinjau
                </span>
            </div>
            <div v-if="expiresAt" class="text-sm text-on-surface-variant flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-surface-container-high">
                <Clock class="w-4 h-4 text-primary" />
                <span class="font-label-sm">Sisa Akses: <span class="text-on-surface">{{ timeRemaining }}</span></span>
            </div>
            <div v-else class="text-sm text-secondary flex items-center gap-2 font-label-sm bg-secondary-container/10 px-3 py-1.5 rounded-lg border border-secondary/20">
                <span>Akses Tanpa Batas</span>
            </div>
        </header>

        <!-- Player Area -->
        <main class="flex-grow flex flex-col items-center justify-center relative bg-surface-container-lowest py-8">
            <!-- Player Wrapper -->
            <div 
                id="player-wrapper" 
                ref="playerWrapper"
                class="relative w-full max-w-6xl aspect-video bg-black overflow-hidden shadow-2xl rounded-xl border border-surface-container" 
                @contextmenu.prevent
            >
                <mux-player
                    v-if="film.mux_playback_id"
                    class="w-full h-full"
                    :playback-id="film.mux_playback_id"
                    stream-type="on-demand"
                    primary-color="#e50914"
                    :title="film.title"
                ></mux-player>

                <video 
                    v-else
                    ref="videoPlayer"
                    class="w-full h-full object-contain"
                    controls
                    controlsList="nodownload"
                    disablePictureInPicture
                    :src="streamUrl"
                >
                    Browser Anda tidak mendukung HTML5 video.
                </video>

                <!-- Watermark Overlay (Anti-piracy / Logo) -->
                <div 
                    class="pointer-events-none absolute top-6 right-8 opacity-40 z-50 flex items-center select-none"
                    aria-hidden="true"
                >
                    <span class="text-2xl font-display-hero tracking-widest text-on-surface drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        CineRent
                    </span>
                    <div class="ml-2 px-1.5 py-0.5 bg-primary-container rounded text-[10px] font-bold text-on-primary-container tracking-widest uppercase shadow-lg border border-primary-fixed-dim/30">
                        TVOD
                    </div>
                </div>
            </div>
        </main>

        <!-- Info & Review -->
        <section class="p-6 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8 mt-4">
            <div class="flex-grow">
                <h2 class="text-3xl font-headline-lg text-on-surface mb-3">{{ film.title }}</h2>
                <p class="text-on-surface-variant leading-relaxed text-base mb-6 prose prose-invert">{{ film.description }}</p>
            </div>

            <!-- Review Section -->
            <div v-if="expiresAt" class="w-full md:w-1/3 bg-surface-container p-6 rounded-2xl border border-surface-container-high shadow-lg">
                <h3 class="text-xl font-headline-md text-on-surface mb-5 flex items-center gap-2">
                    <Star class="w-5 h-5 text-secondary fill-secondary" />
                    Beri Ulasan
                </h3>
                
                <div v-if="$page.props.flash?.success" class="mb-5 p-3 bg-secondary-container/20 text-secondary text-sm rounded-lg border border-secondary/30 font-medium">
                    {{ $page.props.flash.success }}
                </div>

                <form @submit.prevent="submitReview" class="flex flex-col gap-5">
                    <div>
                        <label class="block font-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Rating Bintang</label>
                        <div class="flex gap-2">
                            <button 
                                v-for="star in 5" 
                                :key="star" 
                                type="button"
                                @click="form.rating = star"
                                class="p-1 transition-all hover:scale-110"
                                :class="form.rating >= star ? 'text-secondary' : 'text-surface-container-highest hover:text-secondary/50'"
                            >
                                <Star class="w-8 h-8" :class="{'fill-current': form.rating >= star}" />
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block font-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">Komentar Singkat</label>
                        <textarea 
                            v-model="form.comment" 
                            rows="3" 
                            class="w-full bg-surface-container-low border border-surface-container-high rounded-xl text-on-surface p-4 focus:ring-1 focus:ring-primary-container focus:border-primary-container transition-all font-body-sm resize-none placeholder-outline"
                            placeholder="Bagaimana pendapat Anda tentang film ini?"
                        ></textarea>
                    </div>
                    
                    <button 
                        type="submit" 
                        :disabled="form.processing || !form.rating"
                        class="w-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-label-md py-3.5 rounded-xl shadow-[0_0_15px_rgba(229,9,20,0.2)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed mt-2"
                    >
                        {{ userReview ? 'Perbarui Ulasan' : 'Kirim Ulasan' }}
                    </button>
                </form>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowLeft, Clock, Star } from 'lucide-vue-next';
import { useForm, Link } from '@inertiajs/vue3';
import '@mux/mux-player'; // Import web component globally

const props = defineProps({
  film: { type: Object, required: true },
  streamUrl: { type: String, required: true },
  expiresAt: { type: String, required: false },
  role: { type: String, required: true },
  userWatermark: { type: Object, required: true },
  userReview: { type: Object, required: false }
});

const form = useForm({
    rating: props.userReview ? props.userReview.rating : 0,
    comment: props.userReview ? props.userReview.comment : ''
});

const submitReview = () => {
    form.post(route('reviews.store', props.film.slug), {
        preserveScroll: true
    });
};

const videoPlayer = ref(null);
const playerWrapper = ref(null);
const timeRemaining = ref('');
let timer = null;

const calculateTime = () => {
  if (!props.expiresAt) return;
  
  const end = new Date(props.expiresAt).getTime();
  const now = new Date().getTime();
  const distance = end - now;

  if (distance < 0) {
    timeRemaining.value = 'Waktu Habis';
    if (videoPlayer.value) videoPlayer.value.pause();
    return;
  }

  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  timeRemaining.value = `${hours}j ${minutes}m`;
};

onMounted(() => {
  if (props.expiresAt) {
    calculateTime();
    timer = setInterval(calculateTime, 60000);
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
