<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import { ArrowLeft, UploadCloud, Film } from 'lucide-vue-next';

const props = defineProps({
    film: {
        type: Object,
        required: true
    }
});

const form = useForm({
    title: props.film.title,
    description: props.film.description,
    genre: props.film.genre,
    duration_minutes: props.film.duration_minutes,
    rental_price: props.film.rental_price,
    poster: null,
});

const posterPreview = ref(props.film.poster_path);

const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    form.poster = file;
    posterPreview.value = URL.createObjectURL(file);
};

const submit = () => {
    // We use POST instead of PUT/PATCH because of file uploads in FormData
    form.post(route('sineas.films.update', props.film.id), {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head :title="`Edit - ${film.title}`" />

    <MainLayout>
        

        <div class="py-12">
            <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
                <div class="bg-surface-container shadow-sm sm:rounded-2xl border border-surface-container-high overflow-hidden">
                    <form @submit.prevent="submit" class="p-8" enctype="multipart/form-data">
                        
                        <div class="space-y-6">
                            <!-- Title -->
                            <div>
                                <InputLabel for="title" value="Judul Film" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    class="mt-1 block w-full bg-surface-container-lowest border-gray-300 dark:border-gray-700 dark:text-on-surface rounded-lg shadow-sm"
                                    v-model="form.title"
                                    required
                                    :disabled="form.processing"
                                />
                                <InputError class="mt-2" :message="form.errors.title" />
                            </div>

                            <!-- Description -->
                            <div>
                                <InputLabel for="description" value="Sinopsis / Deskripsi Singkat" />
                                <textarea
                                    id="description"
                                    class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-surface-container-lowest dark:text-on-surface shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                                    v-model="form.description"
                                    rows="4"
                                    required
                                    :disabled="form.processing"
                                ></textarea>
                                <InputError class="mt-2" :message="form.errors.description" />
                            </div>

                            <!-- Genre -->
                            <div>
                                <InputLabel for="genre" value="Genre (Kategori Film)" />
                                <select
                                    id="genre"
                                    class="mt-1 block w-full rounded-xl border-surface-container-high bg-surface-container-lowest text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                                    v-model="form.genre"
                                    required
                                    :disabled="form.processing"
                                >
                                    <option value="" disabled selected>Pilih genre...</option>
                                    <option value="Action">Action</option>
                                    <option value="Drama">Drama</option>
                                    <option value="Horror">Horror</option>
                                    <option value="Comedy">Comedy</option>
                                    <option value="Romance">Romance</option>
                                    <option value="Sci-Fi">Sci-Fi</option>
                                    <option value="Thriller">Thriller</option>
                                    <option value="Documentary">Documentary</option>
                                    <option value="Animation">Animation</option>
                                    <option value="Fantasy">Fantasy</option>
                                </select>
                                <InputError class="mt-2" :message="form.errors.genre" />
                            </div>

                            <!-- Duration & Price -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel for="duration_minutes" value="Durasi (Menit)" />
                                    <TextInput
                                        id="duration_minutes"
                                        type="number"
                                        min="1"
                                        class="mt-1 block w-full bg-surface-container-lowest border-gray-300 dark:border-gray-700 dark:text-on-surface rounded-lg shadow-sm"
                                        v-model="form.duration_minutes"
                                        required
                                        :disabled="form.processing"
                                    />
                                    <InputError class="mt-2" :message="form.errors.duration_minutes" />
                                </div>
                                <div>
                                    <InputLabel for="rental_price" value="Harga Sewa 48 Jam (Rp)" />
                                    <TextInput
                                        id="rental_price"
                                        type="number"
                                        min="0"
                                        class="mt-1 block w-full bg-surface-container-lowest border-gray-300 dark:border-gray-700 dark:text-on-surface rounded-lg shadow-sm"
                                        v-model="form.rental_price"
                                        required
                                        :disabled="form.processing"
                                    />
                                    <InputError class="mt-2" :message="form.errors.rental_price" />
                                </div>
                            </div>

                            <!-- File Uploads -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-surface-container-high">
                                
                                <!-- Poster -->
                                <div>
                                    <InputLabel value="Ganti Poster Film (Rasio 2:3)" />
                                    <div class="mt-2 flex justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 transition-colors hover:border-indigo-500" :class="{'p-2': posterPreview}">
                                        <div class="text-center" v-if="!posterPreview">
                                            <UploadCloud class="mx-auto h-12 w-12 text-on-surface-variant dark:text-on-surface-variant" aria-hidden="true" />
                                            <div class="mt-4 flex text-sm leading-6 text-gray-600 dark:text-on-surface-variant justify-center">
                                                <label for="poster" class="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-none hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                    <span>Upload a file</span>
                                                    <input id="poster" name="poster" type="file" class="sr-only" accept="image/*" @change="handlePosterUpload" :disabled="form.processing">
                                                </label>
                                            </div>
                                            <p class="text-xs leading-5 text-on-surface-variant">PNG, JPG up to 2MB</p>
                                        </div>
                                        <div v-else class="relative w-full aspect-[2/3] rounded-lg overflow-hidden group">
                                            <img :src="posterPreview" class="object-cover w-full h-full" />
                                            <label for="poster" class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-on-surface text-sm font-bold">
                                                Ubah Poster
                                                <input id="poster" name="poster" type="file" class="sr-only" accept="image/*" @change="handlePosterUpload" :disabled="form.processing">
                                            </label>
                                        </div>
                                    </div>
                                    <InputError class="mt-2" :message="form.errors.poster" />
                                </div>
                                
                                <!-- Video Info -->
                                <div>
                                    <InputLabel value="File Video Mux" />
                                    <div class="mt-2 flex flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-container-low p-6 h-[calc(100%-2rem)] text-center">
                                        <Film class="w-10 h-10 text-on-surface-variant dark:text-gray-600 mb-3" />
                                        <p class="text-sm font-medium text-on-surface-variant">Video tersimpan di Mux CDN.</p>
                                        <p class="text-xs text-on-surface-variant dark:text-on-surface-variant mt-2">Untuk mengganti video, Anda perlu menghapus film ini dan mengunggah ulang.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="mt-8 flex items-center justify-end gap-3 border-t border-surface-container-high pt-6">
                            <Link :href="route('sineas.dashboard')" class="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-gray-900 dark:hover:text-on-surface transition">
                                Batal
                            </Link>
                            <PrimaryButton
                                class="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                                :class="{ 'opacity-25': form.processing }"
                                :disabled="form.processing"
                            >
                                {{ form.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

