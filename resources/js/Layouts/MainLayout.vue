<script setup>
import { Link, usePage } from '@inertiajs/vue3';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';

const page = usePage();
</script>

<template>
    <div class="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
        <!-- Header -->
        <header class="fixed top-0 left-0 right-0 z-50 w-full">
            <div class="h-20 w-full bg-surface/85 backdrop-blur-xl px-margin-mobile lg:px-margin-desktop flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-b border-surface-container">
                <div class="flex items-center gap-space-xl">
                    <Link :href="route('home')" class="flex items-center gap-space-sm">
                        <img alt="CineRent Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1VxJXDT9FIDUI2KbDtHRkabKZ5QM4IXNJcgFg8JlDiOqBQ7WZJMygMijuQtWLV_Bs6K8x1jJXkn9ORcTECBvR4uK2eiWA2WBtsh6wtFmvJTqfeApfOA1eDIkaeve5XMt-Hd_lFOgmq1lcLYVD9nv9OF4RR1xE60f8yzQ1g5CHVgPBiiz4quLxoNWgNq9HJf9fAmXSGmcz_4N76T4ohVD95KB5HZCZMy3BE3voPW-6xQUfZ4PNy6kyio_G12"/>
                        <!-- <span class="font-headline-sm text-primary-container font-extrabold tracking-tight uppercase hidden sm:block">CineRent</span> -->
                    </Link>
                    <nav class="hidden xl:flex items-center gap-space-md">
                        <Link :href="route('home')" class="font-label-md transition-colors px-3 py-1.5" :class="{'text-on-surface bg-surface-container-high font-semibold rounded-xl': route().current('home'), 'text-on-surface-variant hover:text-on-surface': !route().current('home')}">Beranda</Link>
                        <!-- <a class="font-label-md text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5" href="#">Sewa Populer</a> -->
                        <a class="font-label-md text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5" href="#">Genre</a>
                        <Link v-if="page.props.auth.user" :href="route('dashboard')" class="font-label-md transition-colors px-3 py-1.5" :class="{'text-on-surface bg-surface-container-high font-semibold rounded-xl': route().current('user.dashboard'), 'text-on-surface-variant hover:text-on-surface': !route().current('user.dashboard')}">Sewa Saya</Link>
                    </nav>
                </div>

                <div class="flex items-center gap-space-md">
                    <div class="relative hidden sm:flex items-center">
                        <span class="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg pointer-events-none">search</span>
                        <input class="w-60 lg:w-72 bg-surface-container-low border border-surface-container text-on-surface placeholder-outline font-body-sm pl-9 pr-10 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-container transition-all" placeholder="Cari judul film..." type="search"/>
                        <span class="absolute right-3 font-label-sm text-outline bg-surface-container px-1.5 py-0.5 rounded border border-surface-container-high">⌘K</span>
                    </div>

                    <div class="flex items-center gap-4 pl-space-xs">
                        <template v-if="page.props.auth.user">
                            <div class="flex items-center gap-4">
                                <Dropdown align="right" width="48">
                                    <template #trigger>
                                        <button type="button" class="flex items-center gap-2 font-label-md text-on-surface-variant hover:text-white transition-colors focus:outline-none bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-xl border border-surface-container-high">
                                            <span class="material-symbols-outlined text-xl">person</span>
                                            <span class="hidden sm:block font-bold">{{ page.props.auth.user.name.split(' ')[0] }}</span>
                                            <span class="material-symbols-outlined text-sm">expand_more</span>
                                        </button>
                                    </template>
                                    <template #content>
                                        <DropdownLink v-if="page.props.auth.user.role !== 'user'" :href="route('dashboard')" class="font-label-md text-on-surface-variant hover:text-white transition-colors flex items-center gap-2 mr-2">
                                            Dashboard
                                        </DropdownLink>
                                        <DropdownLink :href="route('profile.edit')">
                                            Pengaturan Profil
                                        </DropdownLink>
                                        <DropdownLink :href="route('logout')" method="post" as="button" class="text-error hover:text-error hover:bg-error/10 border-t border-surface-container-highest">
                                            Keluar
                                        </DropdownLink>
                                    </template>
                                </Dropdown>
                            </div>
                        </template>
                        <template v-else>
                            <Link :href="route('login')" class="font-label-md text-on-surface-variant hover:text-white transition-colors">Masuk</Link>
                            <Link :href="route('register')" class="bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container px-4 py-2 rounded-xl font-label-md shadow transition">Daftar</Link>
                        </template>
                    </div>
                </div>
            </div>
        </header>

        <!-- Flash Messages -->
        <div v-if="page.props.flash?.success" class="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
            <div class="bg-secondary-container/90 backdrop-blur-md border border-secondary/30 text-secondary px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
                <span class="material-symbols-outlined">check_circle</span>
                <span class="font-label-md">{{ page.props.flash.success }}</span>
            </div>
        </div>
        <div v-if="page.props.flash?.error" class="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
            <div class="bg-error-container/90 backdrop-blur-md border border-error/30 text-error px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
                <span class="material-symbols-outlined">error</span>
                <span class="font-label-md">{{ page.props.flash.error }}</span>
            </div>
        </div>

        <!-- Page Content -->
        <main class="flex-grow w-full pt-20">
            <slot />
        </main>

        <!-- Footer -->
        <footer class="w-full bg-surface-container-lowest text-on-surface-variant border-t border-surface-container pt-space-3xl pb-space-2xl mt-auto">
            <div class="w-full px-margin-mobile lg:px-margin-desktop">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-2xl">
                    <div class="lg:col-span-2 flex flex-col gap-space-md">
                        <div class="flex items-center gap-space-sm">
                            <span class="font-headline-sm text-primary-container font-extrabold tracking-tight uppercase">CineRent</span>
                        </div>
                        <p class="font-body-md text-on-surface-variant max-w-md">Layanan sewa dan streaming film digital Karya sineas lokal resmi dengan kualitas Terbaik.</p>
                    </div>
                </div>
                <div class="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md border-t border-surface-container-high">
                    <p class="font-body-sm text-on-surface-variant">© 2026 CineRent Indonesia. Seluruh film berlisensi resmi studio.</p>
                </div>
            </div>
        </footer>
    </div>
</template>
