<template>
  <main class="min-h-screen bg-[#fff7f3] px-4 py-12 flex justify-center">
    <section class="w-full max-w-5xl bg-white rounded-3xl border border-orange-100 shadow-sm p-8 md:p-12">
      
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-[#e09a82] tracking-tight mb-4">
          Meine Bestellungen
        </h1>
        <div class="h-1.5 w-24 bg-[#e7b2a5] mx-auto rounded-full"></div>
      </header>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e09a82]"></div>
        <p class="text-gray-500 italic">Lade deine Bestellungen...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center">
        <p class="font-semibold">{{ error }}</p>
        <button @click="loadOrders" class="mt-4 text-sm underline hover:text-red-800 transition">
          Erneut versuchen
        </button>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20 bg-[#fffcf9] rounded-3xl border border-dashed border-orange-200">
        <img src="/img/warenkorb_icon.png" alt="Leer" class="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p class="text-gray-500 text-lg">Du hast bisher noch keine Bestellungen getätigt.</p>
        <router-link to="/" class="mt-6 inline-block bg-[#e09a82] text-white px-8 py-3 rounded-full hover:bg-[#d48366] transition font-semibold shadow-md">
          Jetzt shoppen
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div 
          v-for="order in sortedOrders" 
          :key="order.id"
          class="group bg-white border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer"
          @click="$router.push(`/orders/${order.id}`)"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-[#e09a82] uppercase tracking-wider">Bestellung #{{ order.id }}</span>
              </div>
              <h3 class="text-lg font-bold text-gray-900">
                Bestellt am {{ formatDate(order.orderDate || order.createdAt) }}
              </h3>
            </div>

            <div class="flex items-center justify-between md:justify-end gap-6">
              <div class="text-right">
                <p class="text-xs text-gray-400 uppercase font-bold tracking-widest">Gesamtbetrag</p>
                <p class="text-xl font-black text-[#e09a82]">
                  {{ formatPrice(order.totalAmount || order.totalPrice) }}
                </p>
              </div>
              <div class="bg-[#fff7f3] p-3 rounded-full text-[#e09a82] group-hover:bg-[#e09a82] group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { fetchOrdersByUserId } from '@/services/api';
import { authFetch } from '@/api/authFetch.js';

import { formatDate, parseRobustDate } from '@/utils/dateUtils';

const { user } = useAuth0();
const orders = ref([]);
const loading = ref(true);
const error = ref(null);

const loadOrders = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const profile = await authFetch('/api/users/me');
    const dbUserId = profile.id;

    if (!dbUserId) {
      throw new Error('Konnte deine Benutzer-ID im System nicht finden.');
    }
    
    orders.value = await fetchOrdersByUserId(dbUserId);
  } catch (e) {
    console.error('Fehler beim Laden der Bestellungen:', e);
    error.value = 'Deine Bestellungen konnten momentan nicht geladen werden. Prüfe, ob du im Backend als Nutzer mit Bestellungen angelegt bist.';
  } finally {
    loading.value = false;
  }
};

const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => {
    const dateA = parseRobustDate(a.orderDate || a.createdAt) || new Date(0);
    const dateB = parseRobustDate(b.orderDate || b.createdAt) || new Date(0);
    return dateB - dateA;
  });
});

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR'
  });
};

onMounted(loadOrders);
</script>
