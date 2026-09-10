<script setup>
import { ref, onMounted } from 'vue';
import { Link, usePage, router } from '@inertiajs/vue3';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';

const page = usePage();
const mobileMenuOpen = ref(false);
const isDark = ref(true);
const searchQuery = ref(page.props.filters?.search || '');

const handleSearch = () => {
    if (searchQuery.value) {
        router.get(route('explore'), { search: searchQuery.value });
    } else {
        router.get(route('explore'));
    }
};

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    }
};

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark') || localStorage.theme === 'dark';
});
</script>

<template>
    <div class="flex h-screen bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container overflow-hidden relative transition-colors duration-300">
        
        <!-- Mobile Sidebar Overlay -->
        <div v-if="mobileMenuOpen" @click="toggleMobileMenu" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"></div>

        <!-- Sidebar -->
        <aside :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'" class="fixed lg:static inset-y-0 left-0 z-50 w-[280px] flex-shrink-0 bg-surface-container-lowest border-r border-surface-container flex flex-col overflow-y-auto transition-transform duration-300 lg:translate-x-0">
            <!-- Logo -->
            <div class="h-20 lg:h-24 flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
                <Link :href="route('home')" class="flex items-center gap-3">
                    <img alt="CineRent Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1VxJXDT9FIDUI2KbDtHRkabKZ5QM4IXNJcgFg8JlDiOqBQ7WZJMygMijuQtWLV_Bs6K8x1jJXkn9ORcTECBvR4uK2eiWA2WBtsh6wtFmvJTqfeApfOA1eDIkaeve5XMt-Hd_lFOgmq1lcLYVD9nv9OF4RR1xE60f8yzQ1g5CHVgPBiiz4quLxoNWgNq9HJf9fAmXSGmcz_4N76T4ohVD95KB5HZCZMy3BE3voPW-6xQUfZ4PNy6kyio_G12"/>
                    <span class="font-headline-sm text-primary font-bold tracking-tight">Streamix</span>
                </Link>
                <button @click="toggleMobileMenu" class="lg:hidden text-on-surface-variant hover:text-on-surface">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 px-4 pb-8 space-y-8 mt-2">
                
                <!-- Menu Group 1 -->
                <div class="space-y-1">
                    <Link :href="route('home')" class="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium" :class="route().current('home') ? 'bg-surface-container-high text-on-surface font-bold border-l-4 border-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'">
                        <span class="material-symbols-outlined text-xl">home</span> Home
                    </Link>
                    <Link :href="route('explore')" class="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium" :class="route().current('explore') ? 'bg-surface-container-high text-on-surface font-bold border-l-4 border-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface border-l-4 border-transparent'">
                        <span class="material-symbols-outlined text-xl">explore</span> Explore
                    </Link>
                    <Link :href="route('explore')" class="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-medium border-l-4 border-transparent">
                        <span class="material-symbols-outlined text-xl">category</span> Genres
                    </Link>
                    <Link :href="route('favourites')" v-if="page.props.auth.user" class="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-medium border-l-4" :class="route().current('favourites') ? 'bg-surface-container-high text-on-surface font-bold border-primary' : 'border-transparent'">
                        <span class="material-symbols-outlined text-xl">favorite</span> Favourites
                    </Link>
                </div>

                <hr class="border-surface-container-high mx-4">

                <!-- Menu Group 2 -->
                <div class="space-y-1">
                    <Link :href="route('dashboard')" v-if="page.props.auth.user" class="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-medium border-l-4 border-transparent">
                        <span class="material-symbols-outlined text-xl">play_circle</span> Continue Watching
                    </Link>
                    <Link :href="route('explore', {sort: 'latest'})" class="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-medium border-l-4 border-transparent">
                        <span class="material-symbols-outlined text-xl">schedule</span> Recently Added
                    </Link>
                    <Link v-if="page.props.auth.user" :href="route('dashboard')" class="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium border-l-4" :class="route().current('user.dashboard') || route().current('dashboard') || route().current('admin.dashboard') || route().current('sineas.dashboard') ? 'bg-surface-container-high text-on-surface font-bold border-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface border-transparent'">
                        <span class="material-symbols-outlined text-xl">video_library</span> My Collections
                    </Link>
                    <!-- <Link :href="route('dashboard')" v-if="page.props.auth.user" class="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-medium border-l-4 border-transparent">
                        <span class="material-symbols-outlined text-xl">download</span> Downloads
                    </Link> -->
                </div>

                <hr class="border-surface-container-high mx-4">

                <!-- Menu Group 3 -->
                <div class="space-y-1">
                    <a href="mailto:support@streamix.com" class="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-medium border-l-4 border-transparent">
                        <span class="material-symbols-outlined text-xl">headset_mic</span> Support
                    </a>
                    <Link :href="page.props.auth.user ? route('profile.edit') : route('login')" class="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-medium border-l-4" :class="route().current('profile.edit') ? 'bg-surface-container-high text-on-surface font-bold border-primary' : 'border-transparent'">
                        <span class="material-symbols-outlined text-xl">settings</span> Settings
                    </Link>
                </div>
            </nav>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative w-full">
            
            <!-- Topbar -->
            <header class="h-20 lg:h-24 flex-shrink-0 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 bg-background/90 backdrop-blur-xl transition-colors duration-300">
                <!-- Search Bar -->
                <div class="flex-1 max-w-2xl flex items-center gap-2 lg:gap-4">
                    <button @click="toggleMobileMenu" class="lg:hidden text-on-surface-variant hover:text-on-surface p-2 focus:outline-none">
                        <span class="material-symbols-outlined text-3xl">menu</span>
                    </button>
                    
                    <div class="hidden md:flex relative w-full items-center">
                        <span class="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">search</span>
                        <input 
                            v-model="searchQuery" 
                            @keyup.enter="handleSearch" 
                            class="w-full bg-surface-container-low border border-surface-container text-on-surface placeholder-on-surface-variant font-body-md pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary-container focus:bg-surface-container transition-all" 
                            placeholder="Movies, series, shows..." 
                            type="search"
                        />
                    </div>
                </div>

                <!-- Right Actions -->
                <div class="flex items-center gap-3 lg:gap-6 pl-2 lg:pl-4">
                    <button @click="toggleTheme" class="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition relative">
                        <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
                    </button>
                    <button class="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition relative">
                        <span class="material-symbols-outlined">notifications</span>
                        <span class="absolute top-3 right-3 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container"></span>
                    </button>

                    <template v-if="page.props.auth.user">
                        <Dropdown align="right" width="48">
                            <template #trigger>
                                <button type="button" class="w-12 h-12 rounded-xl border-2 border-surface-container-high overflow-hidden focus:outline-none focus:border-primary transition">
                                    <img :src="`https://ui-avatars.com/api/?name=${page.props.auth.user.name}&background=random`" alt="Profile" class="w-full h-full object-cover" />
                                </button>
                            </template>
                            <template #content>
                                <DropdownLink v-if="page.props.auth.user.role !== 'user'" :href="route('dashboard')" class="font-label-md text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 mr-2">
                                    Dashboard Admin
                                </DropdownLink>
                                <DropdownLink :href="route('profile.edit')">
                                    Pengaturan Profil
                                </DropdownLink>
                                <DropdownLink :href="route('logout')" method="post" as="button" class="text-error hover:text-error hover:bg-error/10 border-t border-surface-container-highest">
                                    Keluar
                                </DropdownLink>
                            </template>
                        </Dropdown>
                    </template>
                    <template v-else>
                        <Link :href="route('login')" class="font-bold text-on-surface-variant hover:text-on-surface transition-colors">Masuk</Link>
                        <Link :href="route('register')" class="bg-primary hover:bg-primary-fixed-dim text-on-primary px-6 py-3 rounded-xl font-bold shadow transition">Daftar</Link>
                    </template>
                </div>
            </header>

            <!-- Flash Messages -->
            <div v-if="page.props.flash?.success" class="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
                <div class="bg-secondary-container/90 backdrop-blur-md border border-secondary/30 text-secondary px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
                    <span class="material-symbols-outlined">check_circle</span>
                    <span class="font-label-md">{{ page.props.flash.success }}</span>
                </div>
            </div>
            <div v-if="page.props.flash?.error" class="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
                <div class="bg-error-container/90 backdrop-blur-md border border-error/30 text-error px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
                    <span class="material-symbols-outlined">error</span>
                    <span class="font-label-md">{{ page.props.flash.error }}</span>
                </div>
            </div>

            <!-- Page Content Scrollable -->
            <main class="flex-1 overflow-y-auto px-4 lg:px-8 pb-12 w-full">
                <slot />
            </main>
        </div>
    </div>
</template>
