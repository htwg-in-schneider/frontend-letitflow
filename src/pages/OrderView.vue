<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <div class="lg:col-span-2 space-y-6">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Bestellübersicht</h1>
        
        <AddressCard title="Lieferadresse" type="SHIPPING" :userId="mockUserId" />
        <AddressCard title="Rechnungsadresse" type="BILLING" :userId="mockUserId" />

        <div class="bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-8">
          <h2 class="text-xl font-semibold mb-6">Überprüfe deine Artikel</h2>
          <div class="space-y-6">
             <CardItem 
                v-for="item in cartItems" 
                :key="item.variantId" 
                :item="item" 
             />
          </div>
        </div>
      </div>

    <aside class="lg:col-span-1">
  <div class="lg:sticky lg:top-10">
    <div class="bg-[#d1d5db] border border-gray-400 p-6 shadow-sm rounded-lg">
      <PriceSummary 
        :subtotal="totalSum" 
        buttonText="Jetzt zahlungspflichtig bestellen"
        @checkout="finishOrder"
      />
    </div>
  </div>
</aside>
        

    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AddressCard from '@/components/AddressCard.vue';
import PriceSummary from '@/components/cardComponents/PriceSummary.vue';
const mockUserId = ref("manual-oauth|user@letitflow.de");
const cartItems = ref([]);

const loadCart = () => {
  const data = localStorage.getItem('cart');
  if (data) cartItems.value = JSON.parse(data);
};

const totalSum = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
});

const finishOrder = () => {
  alert("Bestellung abgeschlossen!");
  localStorage.removeItem('cart');
  window.location.href = "/";
};

onMounted(loadCart);
</script>