<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section class="w-full max-w-4xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-8">
      <h1 class="text-2xl font-semibold mb-8">Dein Warenkorb</h1>

      <div v-if="cartStore.items.length === 0" class="text-center py-16">
        <p>Dein Warenkorb ist noch leer.</p>
        <button @click="$router.push('/')" class="mt-4 text-[#e09a82] underline">Produkte entdecken</button>
      </div>

      <div v-else class="space-y-6">
        <CardItem
            v-for="item in cartStore.items"
            :key="item.variantId"
            :item="item"
            @remove="(variantId) => handleRemove(variantId)"
            @update="handleUpdateQuantity"
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
import {onMounted} from 'vue';
import {useAuth0} from '@auth0/auth0-vue';
import {useRouter} from 'vue-router';
import {useCartStore} from '@/stores/cartStores';
import CardItem from '@/components/cardComponents/CardItem.vue';
import PriceSummary from '@/components/cardComponents/PriceSummary.vue';

const cartStore = useCartStore();
const {isAuthenticated, loginWithRedirect, user} = useAuth0();
const router = useRouter();

onMounted(async () => {
  if (isAuthenticated.value && user.value) {
    cartStore.setUserId(user.value.sub);
  }
  await cartStore.loadCart();
});

const handleUpdateQuantity = async ({variantId, quantity}) => {
  if (!variantId || quantity === undefined) return;
  await cartStore.updateQuantity(variantId, quantity);
};

const handleRemove = async (variantId) => {
  await cartStore.removeItem(variantId);
};

const handleCheckout = async () => {
  if (isAuthenticated.value) {
    router.push('/orderView');
  } else {
    await loginWithRedirect({appState: {target: '/orderView'}});
  }
};
</script>