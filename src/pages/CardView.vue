<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section class="w-full max-w-4xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-8">
      
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Dein Warenkorb</h1>
        <button 
          @click="$router.push('/')" 
          class="px-4 py-2 bg-white border border-[#e09a82] text-[#e09a82] text-sm font-medium rounded-xl hover:bg-[#fff7f3] transition shadow-sm"
        >
          ← Weiter einkaufen
        </button>
      </div>

      <div v-if="!cartItems || cartItems.length === 0" class="text-center py-16 bg-[#fffcf9] rounded-2xl border border-dashed border-orange-200">
        <p class="text-gray-500 text-lg">Dein Warenkorb ist noch leer.</p>
        <button @click="$router.push('/')" class="mt-4 px-6 py-2 bg-[#e09a82] text-white rounded-xl hover:bg-[#d48366] transition">
          Jetzt Produkte entdecken
        </button>
      </div>

     <div v-else class="space-y-6">
  <CardItem 
    v-for="item in cartItems" 
    :key="item.variantId" 
    :item="item" 
    @update="updateQuantity"
    @remove="removeItem"
  />
     </div>

  <div class="mt-6 ml-auto"> 
    <PriceSummary 
      :subtotal="totalSum" 
      @checkout="handleCheckout"
    />
  </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CardItem from '@/components/cardComponents/CardItem.vue';
import PriceSummary from '@/components/cardComponents/PriceSummary.vue';


const cartItems = ref([]);

const loadCart = () => {
  const data = localStorage.getItem('cart');
  if (data) {
    try {
      cartItems.value = JSON.parse(data);
    } catch (e) {
      cartItems.value = [];
    }
  }
};

const updateQuantity = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

const removeItem = (variantId) => {
  cartItems.value = cartItems.value.filter(item => item.variantId !== variantId);
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

const totalSum = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
});

onMounted(loadCart);
</script>