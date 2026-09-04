<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import { ArrowLeft, UploadCloud } from 'lucide-vue-next';

const form = useForm({
    title: '',
    description: '',
    duration_minutes: '',
    rental_price: '',
    poster: null,
    video: null,
});

const posterPreview = ref(null);

const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    form.poster = file;
    posterPreview.value = URL.createObjectURL(file);
};

const handleVideoUpload = (e) => {
    form.video = e.target.files[0];
};

const submit = () => {
    form.post(route('dashboard.films.store'), {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head title="Upload Film" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center gap-4">
                <Link :href="route('dashboard')" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <ArrowLeft class="w-5 h-5" />
                </Link>
                <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Upload Film Baru
                </h2>
            </div>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
                <div class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
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
                                />
                                <InputError class="mt-2" :message="form.errors.title" />
                            </div>

                            <!-- Description -->
                            <div>
                                <InputLabel for="description" value="Sinopsis / Deskripsi Singkat" />
                                <textarea
                                    id="description"
                                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                                    v-model="form.description"
                                    rows="4"
                                    required
                                ></textarea>
                                <InputError class="mt-2" :message="form.errors.description" />
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
                                    />
                                    <InputError class="mt-2" :message="form.errors.rental_price" />
                                </div>
                            </div>

                            <!-- File Uploads -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                
                                <!-- Poster -->
                                <div>
                                    <InputLabel value="Poster Film (Rasio 2:3)" />
                                    <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-white/25 px-6 py-10" :class="{'p-2': posterPreview}">
                                        <div class="text-center" v-if="!posterPreview">
                                            <UploadCloud class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                            <div class="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                                                <label for="poster" class="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500">
                                                    <span>Upload a file</span>
                                                    <input id="poster" name="poster" type="file" class="sr-only" accept="image/*" @change="handlePosterUpload">
                                                </label>
                                            </div>
                                            <p class="text-xs leading-5 text-gray-600 dark:text-gray-400">PNG, JPG up to 2MB</p>
                                        </div>
                                        <div v-else class="relative w-full aspect-[2/3] rounded overflow-hidden">
                                            <img :src="posterPreview" class="object-cover w-full h-full" />
                                            <label for="poster" class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition text-white text-sm font-medium">
                                                Ganti Poster
                                                <input id="poster" name="poster" type="file" class="sr-only" accept="image/*" @change="handlePosterUpload">
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
                                            <div class="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                                                <label for="video" class="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500">
                                                    <span>Pilih Video</span>
                                                    <input id="video" name="video" type="file" class="sr-only" accept="video/mp4,video/mkv,video/avi" @change="handleVideoUpload">
                                                </label>
                                            </div>
                                            <p class="text-xs leading-5 text-gray-600 dark:text-gray-400" v-if="!form.video">MP4, MKV up to 100MB</p>
                                            <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2 truncate max-w-[200px]" v-else>
                                                {{ form.video.name }}
                                            </p>
                                        </div>
                                    </div>
                                    <InputError class="mt-2" :message="form.errors.video" />
                                </div>

                            </div>
                        </div>

                        <div class="mt-8 flex items-center justify-end">
                            <PrimaryButton
                                class="w-full sm:w-auto"
                                :class="{ 'opacity-25': form.processing }"
                                :disabled="form.processing"
                            >
                                {{ form.processing ? 'Mengunggah...' : 'Upload Film' }}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
