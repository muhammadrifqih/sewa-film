<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { Users, UserCog } from 'lucide-vue-next';

defineProps({
    users: Array,
});

const updateRole = (user, newRole) => {
    if (confirm(`Ubah peran ${user.name} menjadi ${newRole}?`)) {
        router.post(route('admin.users.role', user.id), {
            role: newRole
        }, {
            preserveScroll: true
        });
    }
};
</script>

<template>
    <Head title="Manajemen Pengguna" />

    <MainLayout>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <div class="flex items-center gap-3 mb-6 px-4 sm:px-0">
                    <Users class="w-8 h-8 text-blue-500" />
                    <h1 class="text-3xl font-bold text-on-surface">Manajemen Pengguna</h1>
                </div>

                <div class="bg-surface-container rounded-2xl shadow border border-surface-container-high overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-on-surface-variant">
                            <thead class="text-xs text-gray-700 uppercase bg-surface-container-lowest dark:text-on-surface-variant">
                                <tr>
                                    <th scope="col" class="px-6 py-4">ID</th>
                                    <th scope="col" class="px-6 py-4">Nama Lengkap</th>
                                    <th scope="col" class="px-6 py-4">Email</th>
                                    <th scope="col" class="px-6 py-4">Peran Saat Ini</th>
                                    <th scope="col" class="px-6 py-4 text-right">Aksi (Ubah Peran)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id" class="bg-surface-container border-b border-surface-container-high hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td class="px-6 py-4 font-medium text-on-surface">{{ user.id }}</td>
                                    <td class="px-6 py-4">{{ user.name }}</td>
                                    <td class="px-6 py-4">{{ user.email }}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 rounded-full text-xs font-bold" 
                                            :class="{
                                                'bg-blue-100 text-blue-700': user.role === 'user',
                                                'bg-green-100 text-green-700': user.role === 'sineas',
                                                'bg-purple-100 text-purple-700': user.role === 'admin'
                                            }">
                                            {{ user.role.toUpperCase() }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 flex gap-2 justify-end">
                                        <button v-if="user.role !== 'user'" @click="updateRole(user, 'user')" class="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200">
                                            Jadikan User
                                        </button>
                                        <button v-if="user.role !== 'sineas'" @click="updateRole(user, 'sineas')" class="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-lg hover:bg-green-200">
                                            Jadikan Sineas
                                        </button>
                                        <button v-if="user.role !== 'admin'" @click="updateRole(user, 'admin')" class="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200">
                                            Jadikan Admin
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </MainLayout>
</template>

