<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import { CreditCard, Clock, QrCode, ArrowLeft } from 'lucide-vue-next';
import MainLayout from '@/Layouts/MainLayout.vue';
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
    order: {
        type: Object,
        required: true,
    }
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
};

let pollingInterval = null;

onMounted(() => {
    // Poll the server every 5 seconds to check if payment_status changed to 'paid'
    pollingInterval = setInterval(() => {
        if (props.order.payment_status === 'pending') {
            router.reload({ only: ['order'], preserveScroll: true });
        } else {
            clearInterval(pollingInterval);
        }
    }, 5000);
});

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<template>
    <Head title="Pembayaran" />

    <MainLayout>
        <div class="py-12 md:py-24 flex items-center justify-center px-4">
            <div class="max-w-xl w-full bg-surface-container-lowest rounded-3xl shadow-2xl p-8 border border-surface-container-high">
                
                <div class="flex items-center gap-4 mb-8 pb-6 border-b border-surface-container-high">
                    <div class="p-4 bg-primary-container text-on-primary-container rounded-2xl">
                        <CreditCard class="w-8 h-8" />
                    </div>
                    <div>
                        <h2 class="text-2xl font-display-hero font-bold text-on-surface">Detail Pembayaran</h2>
                        <p class="text-on-surface-variant text-sm font-mono mt-1 tracking-wider">Invoice: {{ order.order_number }}</p>
                    </div>
                </div>
                
                <!-- Order Summary -->
                <div class="mb-8 bg-surface-container rounded-2xl p-6 border border-surface-container-highest shadow-inner">
                    <h3 class="font-headline-sm text-on-surface mb-5">Ringkasan Pesanan</h3>
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-on-surface-variant font-label-md">Item</span>
                        <span class="font-bold text-on-surface">{{ order.film.title }}</span>
                    </div>
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-on-surface-variant font-label-md">Harga Sewa (48 Jam)</span>
                        <span class="font-bold text-on-surface">Rp {{ formatPrice(order.amount) }}</span>
                    </div>
                    
                    <hr class="my-5 border-surface-container-highest">
                    
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-on-surface text-lg">Total Tagihan</span>
                        <span class="font-display-hero text-primary text-3xl">Rp {{ formatPrice(order.total_amount) }}</span>
                    </div>
                </div>

                <div v-if="order.payment_status === 'pending'" class="space-y-6 flex flex-col items-center">
                    
                    <div class="text-center px-4">
                        <p class="text-on-surface-variant font-body-lg mb-2">Scan QR Code di bawah ini menggunakan aplikasi M-Banking atau E-Wallet Anda (Dana, OVO, GoPay, dll).</p>
                    </div>

                    <!-- Direct QR Code display -->
                    <div class="bg-surface p-5 rounded-2xl border-4 border-primary shadow-[0_0_30px_rgba(var(--color-primary),0.3)]">
                        <img 
                            v-if="order.payment_reference" 
                            :src="order.payment_reference" 
                            alt="QRIS Code" 
                            class="w-64 h-64 object-contain"
                        />
                        <div v-else class="w-64 h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-xl">
                            <QrCode class="w-16 h-16 mb-2 opacity-50" />
                            <span class="text-sm font-bold">QR Code tidak tersedia</span>
                        </div>
                    </div>
                    
                    <div class="bg-surface-container-low border border-surface-container-highest rounded-xl p-4 text-center mx-4 w-full">
                        <p class="text-sm text-on-surface-variant">
                            Mohon transfer sesuai dengan nominal <strong class="text-on-surface text-lg block mt-1">Rp {{ formatPrice(order.total_amount) }}</strong> agar sistem dapat memverifikasi secara otomatis.
                        </p>
                    </div>

                    <Link :href="route('dashboard')" class="w-full inline-flex justify-center items-center px-4 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high rounded-xl transition">
                        Selesaikan Nanti
                    </Link>
                </div>

                <div v-else-if="order.payment_status === 'paid'" class="text-center py-10">
                    <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500/20 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <svg class="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="text-3xl font-display-hero text-on-surface mb-3">Pembayaran Berhasil!</h3>
                    <p class="text-on-surface-variant text-lg mb-10">Terima kasih, pembayaran Anda telah diverifikasi.</p>
                    
                    <Link :href="route('watch.show', order.film.slug)" class="w-full flex items-center justify-center px-6 py-5 bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold rounded-2xl shadow-[0_4px_20px_rgba(var(--color-primary),0.4)] transition-all hover:-translate-y-1 text-lg">
                        <Clock class="w-6 h-6 mr-3" />
                        Mulai Menonton Sekarang
                    </Link>
                </div>
                
            </div>
        </div>
    </MainLayout>
</template>
