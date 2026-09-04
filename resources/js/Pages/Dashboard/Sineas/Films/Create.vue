<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import { ArrowLeft, UploadCloud } from 'lucide-vue-next';
import * as UpChunk from '@mux/upchunk';
import axios from 'axios';

const form = useForm({
    title: '',
    description: '',
    genre: '',
    duration_minutes: '',
    rental_price: '',
    poster: null,
    mux_upload_id: '',
});

const videoFile = ref(null);
const posterPreview = ref(null);
const uploadProgress = ref(0);
const isUploading = ref(false);
const uploadError = ref('');

const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    form.poster = file;
    posterPreview.value = URL.createObjectURL(file);
};

const handleVideoUpload = (e) => {
    videoFile.value = e.target.files[0];
};

const submit = async () => {
    if (!videoFile.value) {
        uploadError.value = "Pilih file video terlebih dahulu.";
        return;
    }
    
    isUploading.value = true;
    uploadError.value = '';

    try {
        // 1. Get Direct Upload URL from Laravel
        const response = await axios.post(route('sineas.films.mux-upload'));
        const uploadUrl = response.data.url;
        const uploadId = response.data.id;

        // 2. Upload directly to Mux using UpChunk
        const upload = UpChunk.createUpload({
            endpoint: uploadUrl,
            file: videoFile.value,
            chunkSize: 5120, // 5MB chunks
        });

        upload.on('progress', progress => {
            uploadProgress.value = Math.round(progress.detail);
        });

        upload.on('success', () => {
            // 3. Submit data to Laravel
            form.mux_upload_id = uploadId;
            form.post(route('sineas.films.store'), {
                preserveScroll: true,
                onFinish: () => { isUploading.value = false; }
            });
        });

        upload.on('error', err => {
            uploadError.value = "Gagal mengunggah video ke Mux: " + err.detail;
            isUploading.value = false;
        });

    } catch (error) {
        uploadError.value = "Gagal menghubungi server untuk Mux Upload URL.";
        isUploading.value = false;
    }
};
</script>

<template>
    <Head title="Upload Film" />

    <MainLayout>
        

        <div class="py-12">
            <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
                <div class="bg-surface-container shadow-sm sm:rounded-lg border border-surface-container-high overflow-hidden">
                    <form @submit.prevent="submit" class="p-8" enctype="multipart/form-data">
                        
                        <div class="space-y-6">
                            <!-- Title -->
                            <div>
                                <InputLabel for="title" value="Judul Film" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    class="mt-1 block w-full"
                                    v-model="form.title"
                                    required
                                    placeholder="Contoh: Sang Pemimpi dari Timur"
                                    :disabled="isUploading"
                                />
                                <InputError class="mt-2" :message="form.errors.title" />
                            </div>

                            <!-- Description -->
                            <div>
                                <InputLabel for="description" value="Sinopsis / Deskripsi Singkat" />
                                <textarea
                                    id="description"
                                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-surface-container-lowest dark:text-gray-300 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                                    v-model="form.description"
                                    rows="4"
                                    required
                                    :disabled="isUploading"
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
                                    :disabled="isUploading"
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
                                        class="mt-1 block w-full"
                                        v-model="form.duration_minutes"
                                        required
                                        :disabled="isUploading"
                                    />
                                    <InputError class="mt-2" :message="form.errors.duration_minutes" />
                                </div>
                                <div>
                                    <InputLabel for="rental_price" value="Harga Sewa 48 Jam (Rp)" />
                                    <TextInput
                                        id="rental_price"
                                        type="number"
                                        min="0"
                                        class="mt-1 block w-full"
                                        v-model="form.rental_price"
                                        required
                                        placeholder="Misal: 15000"
                                        :disabled="isUploading"
                                    />
                                    <InputError class="mt-2" :message="form.errors.rental_price" />
                                </div>
                            </div>

                            <!-- File Uploads -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-surface-container-high">
                                
                                <!-- Poster -->
                                <div>
                                    <InputLabel value="Poster Film (Rasio 2:3)" />
                                    <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-white/25 px-6 py-10" :class="{'p-2': posterPreview}">
                                        <div class="text-center" v-if="!posterPreview">
                                            <UploadCloud class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                            <div class="mt-4 flex text-sm leading-6 text-gray-600 dark:text-on-surface-variant justify-center">
                                                <label for="poster" class="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500">
                                                    <span>Upload a file</span>
                                                    <input id="poster" name="poster" type="file" class="sr-only" accept="image/*" @change="handlePosterUpload" :disabled="isUploading">
                                                </label>
                                            </div>
                                            <p class="text-xs leading-5 text-gray-600 dark:text-on-surface-variant">PNG, JPG up to 2MB</p>
                                        </div>
                                        <div v-else class="relative w-full aspect-[2/3] rounded overflow-hidden">
                                            <img :src="posterPreview" class="object-cover w-full h-full" />
                                            <label for="poster" class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition text-white text-sm font-medium">
                                                Ganti Poster
                                                <input id="poster" name="poster" type="file" class="sr-only" accept="image/*" @change="handlePosterUpload" :disabled="isUploading">
                                            </label>
                                        </div>
                                    </div>
                                    <InputError class="mt-2" :message="form.errors.poster" />
                                </div>

                                <!-- Video -->
                                <div>
                                    <InputLabel value="File Video Film" />
                                    <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-white/25 px-6 py-10">
                                        <div class="text-center">
                                            <UploadCloud class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                            <div class="mt-4 flex text-sm leading-6 text-gray-600 dark:text-on-surface-variant justify-center">
                                                <label for="video" class="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500">
                                                    <span>Pilih Video</span>
                                                    <input id="video" name="video" type="file" class="sr-only" accept="video/mp4,video/mkv,video/avi,video/quicktime" @change="handleVideoUpload" :disabled="isUploading">
                                                </label>
                                            </div>
                                            <p class="text-xs leading-5 text-gray-600 dark:text-on-surface-variant" v-if="!videoFile">Pilih file video apapun</p>
                                            <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2 truncate max-w-[200px]" v-else>
                                                {{ videoFile.name }}
                                            </p>
                                        </div>
                                    </div>
                                    <div v-if="uploadError" class="text-red-500 text-sm mt-2 font-medium">{{ uploadError }}</div>
                                </div>

                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div v-if="isUploading" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                            <div class="flex justify-between text-sm text-gray-600 dark:text-on-surface-variant mb-2 font-medium">
                                <span>{{ uploadProgress < 100 ? 'Mengunggah ke Jaringan Mux CDN...' : 'Menyimpan data film...' }}</span>
                                <span>{{ uploadProgress }}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
                                <div class="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out" :style="{ width: uploadProgress + '%' }"></div>
                            </div>
                        </div>

                        <div class="mt-8 flex items-center justify-end">
                            <PrimaryButton
                                class="w-full sm:w-auto"
                                :class="{ 'opacity-25': isUploading || form.processing }"
                                :disabled="isUploading || form.processing"
                            >
                                {{ isUploading ? 'Memproses...' : 'Upload Film' }}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

