<template>
  <main class="min-h-screen bg-[#fff7f3] px-4 py-12 flex justify-center">
    <section class="w-full max-w-5xl bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
      
      <!-- Header Area -->
      <div class="bg-[#fff7f3] p-8 md:p-12 border-b border-orange-100">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <router-link to="/orders" class="text-sm font-bold text-[#e09a82] hover:underline mb-4 inline-block">
              ← Zurück zur Übersicht
            </router-link>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
              Bestellung #{{ order?.id || id }}
            </h1>
            <p class="text-gray-500 mt-2">
              Bestellt am {{ formatDate(order?.orderDate || order?.createdAt) }}
            </p>
          </div>
          <div class="text-left md:text-right">
            <p class="text-xs text-gray-400 uppercase font-bold tracking-widest">Gesamtbetrag</p>
            <p class="text-3xl font-black text-[#e09a82]">
              {{ formatPrice(order?.totalAmount || order?.totalPrice) }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="p-20 flex flex-col items-center justify-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e09a82]"></div>
        <p class="text-gray-500 italic">Lade Bestelldetails...</p>
      </div>

      <div v-else-if="error" class="p-12 text-center text-red-600 bg-red-50">
        {{ error }}
      </div>

      <div v-else class="p-8 md:p-12 space-y-12">
        
        <!-- Artikel Liste -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span class="w-8 h-8 bg-[#fff7f3] rounded-full flex items-center justify-center text-[#e09a82] text-sm">1</span>
            Bestellte Artikel
          </h2>
          <div class="border border-orange-100 rounded-2xl overflow-hidden divide-y divide-orange-50">
            <div 
              v-for="item in orderDetails" 
              :key="item.id"
              class="p-6 flex flex-col sm:flex-row items-center gap-6 bg-white hover:bg-[#fffcf9] transition-colors"
            >
              <img 
                :src="item.imageUrl || '/img/placeholder.png'" 
                :alt="item.productName"
                class="w-24 h-24 object-cover rounded-xl border border-orange-50 shadow-sm"
              />
              <div class="flex-1 text-center sm:text-left">
                <h3 class="font-bold text-gray-900 text-lg">{{ item.productName }}</h3>
                <p class="text-sm text-gray-500">
                  <span v-if="item.variantName || item.variantTitle">{{ item.variantName || item.variantTitle }}</span>
                  <span v-else-if="item.color || item.size">Variante:</span>
                  <span v-else>Standard</span>
                  <span v-if="item.color" class="mx-1">•</span> {{ item.color }}
                  <span v-if="item.size" class="mx-1">•</span> {{ item.size }}
                </p>
                <p class="text-[#e09a82] font-semibold mt-1">
                  {{ item.quantity }}x {{ formatPrice(item.price) }}
                </p>
              </div>
              <div class="text-right font-bold text-gray-900">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Adressen & Zahlung -->
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span class="w-8 h-8 bg-[#fff7f3] rounded-full flex items-center justify-center text-[#e09a82] text-sm">2</span>
              Lieferadresse
            </h2>
            <div class="bg-[#fff7f3]/30 border border-orange-100 p-6 rounded-2xl text-gray-700 leading-relaxed">
              <p class="font-bold text-gray-900">{{ order?.shippingName || 'Max Mustermann' }}</p>
              <p>{{ order?.shippingAddress || 'Musterstraße 123' }}</p>
              <p>{{ order?.shippingCity || '12345 Musterstadt' }}</p>
              <p>{{ order?.shippingCountry || 'Deutschland' }}</p>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span class="w-8 h-8 bg-[#fff7f3] rounded-full flex items-center justify-center text-[#e09a82] text-sm">3</span>
              Zahlungsinformationen
            </h2>
            <div class="bg-[#fff7f3]/30 border border-orange-100 p-6 rounded-2xl text-gray-700 space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500">Zahlungsart:</span>
                <span class="font-semibold">{{ order?.paymentMethod || 'Rechnung' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Zahlungsstatus:</span>
                <span class="font-semibold" :class="order?.paid ? 'text-green-600' : 'text-orange-500'">
                  {{ order?.paid ? 'Bezahlt' : 'Offen' }}
                </span>
              </div>
              <hr class="border-orange-100" />
              <div class="flex justify-between text-lg">
                <span class="font-bold">Summe:</span>
                <span class="font-black text-[#e09a82]">{{ formatPrice(order?.totalAmount || order?.totalPrice) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Fußzeile -->
        <div class="pt-10 border-t border-orange-100 text-center">
          <p class="text-sm text-gray-400 italic">
            Vielen Dank für dein Vertrauen in LetItFlow. <br />
            Bei Fragen wende dich gerne an unseren <router-link to="/contact" class="text-[#e09a82] underline">Support</router-link>.
          </p>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchOrderById, fetchOrderDetailsByOrderId } from '@/services/api';

const route = useRoute();
const id = route.params.id;

const order = ref(null);
const orderDetails = ref([]); // NEU: Für die Artikel-Liste
const loading = ref(true);
const error = ref(null);

const loadOrder = async () => {
  loading.value = true;
  error.value = null;
  try {
    // 1. Grunddaten der Bestellung laden
    order.value = await fetchOrderById(id);
    
    // 2. Bestelldetails (Artikel) separat laden, da diese im OrderDTO oft nicht enthalten sind
    try {
      orderDetails.value = await fetchOrderDetailsByOrderId(id);
    } catch (detErr) {
      console.warn('Bestelldetails konnten nicht geladen werden:', detErr);
      // Nicht kritisch, wenn die Grunddaten da sind, zeigen wir zumindest den Header an
    }
  } catch (e) {
    console.error('Fehler beim Laden der Bestellung:', e);
    error.value = 'Die Details dieser Bestellung konnten nicht geladen werden.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unbekannt';
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR'
  });
};

onMounted(loadOrder);
</script>
