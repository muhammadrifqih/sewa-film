<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
    <!-- Poster -->
    <div class="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <img 
        v-if="film.poster_path" 
        :src="film.poster_path" 
        :alt="film.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
        <FilmIcon class="w-12 h-12 opacity-50" />
      </div>
      
      <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
        <Clock class="w-3 h-3" />
        {{ film.duration_minutes }} mnt
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-grow">
      <div class="flex-grow">
        <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">
          <!-- Using standard a tag for example, normally <Link> from Inertia -->
          <a :href="route('films.show', film.slug)" class="hover:text-blue-600 dark:hover:text-blue-400">
            {{ film.title }}
          </a>
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ film.filmmaker?.name || 'Sineas Lokal' }}</p>

        <!-- Stats: Rating & Rent Count -->
        <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <div class="flex items-center gap-1" title="Rating">
                <Star class="w-3.5 h-3.5" :class="film.reviews_avg_rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'" />
                <span class="font-medium text-gray-700 dark:text-gray-300">{{ film.reviews_avg_rating ? Number(film.reviews_avg_rating).toFixed(1) : 'Baru' }}</span>
                <span v-if="film.reviews_avg_rating" class="text-gray-400">/ 5</span>
            </div>
            <div class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div class="flex items-center gap-1" title="Disewa">
                <Users class="w-3.5 h-3.5" />
                <span class="font-medium">{{ film.rentals_count || 0 }}x</span> disewa
            </div>
        </div>
      </div>

      <!-- Footer & Action -->
      <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="text-blue-600 dark:text-blue-400 font-bold">
          Rp {{ formatPrice(film.rental_price) }}
        </div>
        
        <button 
          @click="rentFilm"
          :disabled="isProcessing"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <ShoppingCart class="w-4 h-4" />
          {{ isProcessing ? 'Memproses...' : 'Sewa (48j)' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Clock, Film as FilmIcon, ShoppingCart, Star, Users } from 'lucide-vue-next';
import { router } from '@inertiajs/vue3';

const props = defineProps({
  film: { type: Object, required: true }
});

const isProcessing = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

const rentFilm = () => {
  isProcessing.value = true;
  router.post(route('orders.store', props.film.slug), {}, {
    onFinish: () => {
      isProcessing.value = false;
    }
  });
};
</script>
