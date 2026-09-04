<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ShoppingCart } from 'lucide-vue-next';

defineProps({
    transactions: Array,
});
</script>

<template>
    <Head title="Data Transaksi" />

    <MainLayout>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <div class="flex items-center gap-3 mb-6 px-4 sm:px-0">
                    <ShoppingCart class="w-8 h-8 text-purple-500" />
                    <h1 class="text-3xl font-bold text-on-surface">Data Transaksi & Pendapatan</h1>
                </div>

                <div class="bg-surface-container rounded-2xl shadow border border-surface-container-high overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-on-surface-variant">
                            <thead class="text-xs text-gray-700 uppercase bg-surface-container-lowest dark:text-on-surface-variant">
                                <tr>
                                    <th scope="col" class="px-6 py-4">Invoice</th>
                                    <th scope="col" class="px-6 py-4">Tanggal</th>
                                    <th scope="col" class="px-6 py-4">Pembeli</th>
                                    <th scope="col" class="px-6 py-4">Film</th>
                                    <th scope="col" class="px-6 py-4">Nominal</th>
                                    <th scope="col" class="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in transactions" :key="order.id" class="bg-surface-container border-b border-surface-container-high hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td class="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                                        {{ order.order_number }}
                                    </td>
                                    <td class="px-6 py-4 text-xs">
                                        {{ new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }) }}
                                    </td>
                                    <td class="px-6 py-4">{{ order.user ? order.user.name : 'Unknown' }}</td>
                                    <td class="px-6 py-4">{{ order.film ? order.film.title : 'Film Dihapus' }}</td>
                                    <td class="px-6 py-4 font-mono text-gray-900 dark:text-gray-200">
                                        Rp {{ new Intl.NumberFormat('id-ID').format(order.total_amount ?? order.amount) }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 rounded-full text-xs font-bold" 
                                            :class="{
                                                'bg-green-100 text-green-700': order.payment_status === 'paid',
                                                'bg-yellow-100 text-yellow-700': order.payment_status === 'pending',
                                                'bg-red-100 text-red-700': order.payment_status === 'failed' || order.payment_status === 'expired'
                                            }">
                                            {{ order.payment_status.toUpperCase() }}
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="transactions.length === 0">
                                    <td colspan="6" class="px-6 py-8 text-center text-on-surface-variant">Belum ada transaksi.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </MainLayout>
</template>

