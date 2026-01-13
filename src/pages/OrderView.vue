<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
      
      <div class="lg:col-span-2 space-y-6">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Bestellübersicht</h1>
        
        <div class="bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-8">
          <h2 class="text-xl font-semibold mb-6">Überprüfe deine Artikel</h2>
          <div v-if="cartStore.items.length > 0" class="space-y-6">
             <CardItem 
                v-for="item in cartStore.items" 
                :key="item.variantId" 
                :item="item" 
                @remove="(variantId) => removeItem(variantId)"
                @update="handleUpdateQuantity"
             />
          </div>
          <div v-else class="text-gray-500 text-center py-4">
            Dein Warenkorb ist leer.
          </div>
        </div>

        <div class="space-y-6">
          <AddressCard v-if="cartStore.currentUserId" title="Lieferadresse" type="SHIPPING" :userId="cartStore.currentUserId" @loaded="handleAddressLoaded" />
          <AddressCard v-if="cartStore.currentUserId" title="Rechnungsadresse" type="BILLING" :userId="cartStore.currentUserId" @loaded="handleAddressLoaded" />
        </div>

        <div class="bg-white border border-orange-100 rounded-xl p-6 flex justify-between items-center shadow-sm">
          <span class="text-lg font-medium text-gray-700">Gesamtsumme:</span>
          <span class="text-2xl font-bold text-gray-900">{{ cartStore.totalSum.toFixed(2) }} €</span>
        </div>
      </div>

      <aside class="lg:col-span-1 relative">
        <div class="sticky top-10 self-start">
          <div class="bg-white border border-orange-200 p-6 shadow-md rounded-xl">
            <h2 class="text-lg font-semibold mb-4 text-gray-900 text-center">Zusammenfassung</h2>
            
            <PriceSummary 
              :subtotal="cartStore.totalSum" 
              buttonText="Jetzt zahlungspflichtig bestellen"
              @checkout="finishOrder"
            />
            
            <p class="mt-4 text-xs text-gray-500 text-center">
              Durch den Abschluss der Bestellung akzeptierst du unsere AGB.
            </p>
          </div>
        </div>
      </aside>

    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import { useCartStore } from '@/stores/cartStores';
import * as api from '@/services/api';

import AddressCard from '@/components/AddressCard.vue';
import CardItem from '@/components/cardComponents/CardItem.vue';
import PriceSummary from '@/components/cardComponents/PriceSummary.vue';

const cartStore = useCartStore();
const { user, isAuthenticated } = useAuth0();
const router = useRouter();
const shippingAddressId = ref(null);
const billingAddressId = ref(null);

const handleAddressLoaded = ({ type, addressId }) => {
  console.log(`Address loaded: ${type} = ${addressId}`);
  if (type === 'SHIPPING') {
    shippingAddressId.value = addressId;
  } else if (type === 'BILLING') {
    billingAddressId.value = addressId;
  }
};

onMounted(async () => {
  // WICHTIG: UserId ZUERST setzen, dann Warenkorb laden!
  if (isAuthenticated.value && user.value) {
    cartStore.setUserId(user.value.sub);
  }
  // Erst NACH dem Setzen der UserId den Warenkorb laden
  await cartStore.loadCart();
});

// NEU: Die Funktion zum Entfernen der Artikel über den Store
const removeItem = async (variantId) => {
  await cartStore.removeItem(variantId);
};

// Funktion zum Aktualisieren der Menge
const handleUpdateQuantity = async ({ variantId, quantity }) => {
  if (!variantId || quantity === undefined) return;
  await cartStore.updateQuantity(variantId, quantity);
};

const finishOrder = async () => {
  console.group('Checkout flow');
  console.log('Auth state', { isAuthenticated: isAuthenticated.value, user: user.value });
  console.log('Current userId in cartStore', cartStore.currentUserId);
  console.log('Cart items', cartStore.items);
  console.log('Total sum', cartStore.totalSum);

  if (!cartStore.items.length) {
    alert('Dein Warenkorb ist leer.');
    console.groupEnd();
    return;
  }

  if (!shippingAddressId.value || !billingAddressId.value) {
    alert('Liefer- und Rechnungsadresse nicht gefunden. Bitte lege diese unter Adressen an.');
    console.warn('Missing addresses', { shippingAddressId: shippingAddressId.value, billingAddressId: billingAddressId.value });
    console.groupEnd();
    return;
  }

  const itemsPayload = cartStore.items.map((item) => {
    const unitPrice = Number(item.price ?? item.pricePerUnit ?? 0);
    const qty = Number(item.quantity ?? 0);
    return {
      productId: item.productId ?? item.id ?? null,
      variantId: item.variantId ?? null,
      quantity: qty,
      pricePerUnit: unitPrice,
      totalPrice: unitPrice * qty,
    };
  });

  const orderPayload = {
    userId: cartStore.currentUserId,  // oauthId direkt verwenden
    billingAdressId: billingAddressId.value,
    shippingAdressId: shippingAddressId.value,
    totalAmount: cartStore.totalSum,
    items: itemsPayload,
  };

  console.log('Sending order payload', orderPayload);

  try {
    const response = await api.createOrder(orderPayload);
    console.log('Order response', response);
    alert('Bestellung abgeschlossen!');

    if (!cartStore.currentUserId) {
      console.log('No userId found, clearing local cart');
      localStorage.removeItem('cart');
    }

    await cartStore.loadCart();
    console.log('Cart reloaded, redirecting to home');
    router.push('/');
  } catch (err) {
    console.error('Checkout error', err);
    alert('Beim Abschluss der Bestellung ist ein Fehler aufgetreten.');
  } finally {
    console.groupEnd();
  }
};
</script>

<style scoped>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 2rem;
  z-index: 10;
}
</style>