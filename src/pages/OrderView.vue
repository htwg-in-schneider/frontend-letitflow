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
          <AddressCard title="Lieferadresse" type="SHIPPING" :userId="cartStore.currentUserId" />
          <AddressCard title="Rechnungsadresse" type="BILLING" :userId="cartStore.currentUserId" />
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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import { useCartStore } from '@/stores/cartStores';

import AddressCard from '@/components/AddressCard.vue';
import CardItem from '@/components/cardComponents/CardItem.vue';
import PriceSummary from '@/components/cardComponents/PriceSummary.vue';

const cartStore = useCartStore();
const { user, isAuthenticated } = useAuth0();
const router = useRouter();

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
  alert("Bestellung abgeschlossen!");
  if (!cartStore.currentUserId) localStorage.removeItem('cart');
  await cartStore.loadCart();
  router.push("/");
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