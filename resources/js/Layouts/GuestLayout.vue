<script setup>
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-background text-on-surface font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container relative py-12 px-4 sm:px-6 lg:px-8">
        
        <!-- Background Decor -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
            <div class="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-secondary/10 blur-[120px]"></div>
        </div>

        <div class="relative z-10 w-full max-w-md flex flex-col items-center">
            <Link href="/" class="flex items-center gap-3 mb-8 group">
                <img alt="Streamix Logo" class="h-12 w-auto object-contain transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida/AEtjO1VxJXDT9FIDUI2KbDtHRkabKZ5QM4IXNJcgFg8JlDiOqBQ7WZJMygMijuQtWLV_Bs6K8x1jJXkn9ORcTECBvR4uK2eiWA2WBtsh6wtFmvJTqfeApfOA1eDIkaeve5XMt-Hd_lFOgmq1lcLYVD9nv9OF4RR1xE60f8yzQ1g5CHVgPBiiz4quLxoNWgNq9HJf9fAmXSGmcz_4N76T4ohVD95KB5HZCZMy3BE3voPW-6xQUfZ4PNy6kyio_G12"/>
                <span class="font-headline-md text-primary font-bold tracking-tight text-3xl">Streamix</span>
            </Link>

            <div class="w-full bg-surface-container-low/80 backdrop-blur-xl px-8 py-10 shadow-2xl rounded-3xl border border-surface-container-high relative overflow-hidden">
                <!-- Subtle top glow -->
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                
                <slot />
            </div>
        </div>
    </div>
</template>
