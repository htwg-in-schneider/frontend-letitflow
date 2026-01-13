<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section class="w-full max-w-4xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-8">
      <h1 class="text-2xl font-semibold mb-8">Dein Warenkorb</h1>

      <div v-if="cartStore.items.length === 0" class="text-center py-16">
        <p>Dein Warenkorb ist noch leer.</p>
        <button @click="$router.push('/')" class="mt-4 text-[#e09a82]">Produkte entdecken</button>
      </div>

      <div v-else class="space-y-6">
        <CardItem 
          v-for="item in cartStore.items" 
          :key="item.variantId" 
          :item="item" 
          @remove="removeItem"
        />
        <PriceSummary 
          :subtotal="cartStore.totalSum" 
          @checkout="handleCheckout"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStores';
import CardItem from '@/components/cardComponents/CardItem.vue';
import PriceSummary from '@/components/cardComponents/PriceSummary.vue';

const cartStore = useCartStore();
const { isAuthenticated, loginWithRedirect } = useAuth0();
const router = useRouter();

const removeItem = async (variantId) => {
  // Für Gast:
  if (!isAuthenticated.value) {
    const data = JSON.parse(localStorage.getItem('cart') || '[]');
    const filtered = data.filter(i => i.variantId !== variantId);
    localStorage.setItem('cart', JSON.stringify(filtered));
  }
  // Danach Store neu laden (egal ob Gast oder API)
  await cartStore.loadCart();
};

const handleCheckout = async () => {
  if (isAuthenticated.value) {
    router.push('/orderView');
  } else {
    await loginWithRedirect({ appState: { target: '/orderView' } });
  }
};
</script>