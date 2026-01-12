<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div class="md:col-span-2 space-y-8">
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Bestellübersicht</h1>
        
       

        <div class="bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-8">
          <h2 class="text-xl font-semibold mb-6 text-gray-800">Überprüfe deine Artikel</h2>
          <div class="space-y-6">
            <CardItem 
              v-for="item in cartItems" 
              :key="item.variantId" 
              :item="item" 
              :readonly="true" 
            />
          </div>
        </div>
      </div>

      <aside>
        <div class="sticky top-10">
          <PriceSummary 
            :subtotal="totalSum" 
            buttonText="Jetzt zahlungspflichtig bestellen"
            @checkout="finishOrder"
          />
        </div>
      </aside> 

      <div class="space-y-6 md:col-span-2">
          <AddressCard title="Lieferadresse" type="SHIPPING" :userId="mockUserId" />
          <AddressCard title="Rechnungsadresse" type="BILLING" :userId="mockUserId" />
        </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AddressCard from '@/components/AddressCard.vue';
import CardItem from '@/components/cardComponents/CardItem.vue';
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