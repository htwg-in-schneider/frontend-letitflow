<template>
  <main class="min-h-screen bg-[#fff7f3] px-4 py-12 flex justify-center">
    <section class="w-full max-w-5xl bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">

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

        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span
                class="w-8 h-8 bg-[#fff7f3] rounded-full flex items-center justify-center text-[#e09a82] text-sm">1</span>
            Bestellte Artikel
          </h2>
          <div class="border border-orange-100 rounded-2xl overflow-hidden divide-y divide-orange-50">
            <CardItem
                v-for="item in orderDetails"
                :key="item.id"
                :item="item"
                :showActions="false"
                :quantityOptionsMax="20"
            />
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <AddressCard v-if="order?.userId" title="Lieferadresse" :userId="order.userId" type="SHIPPING"
                       :readonly="true"/>
          <AddressCard v-if="order?.userId" title="Rechnungsadresse" :userId="order.userId" type="BILLING"
                       :readonly="true"/>
        </div>

        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span
                class="w-8 h-8 bg-[#fff7f3] rounded-full flex items-center justify-center text-[#e09a82] text-sm">4</span>
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
            <hr class="border-orange-100"/>
            <div class="flex justify-between text-lg">
              <span class="font-bold">Summe:</span>
              <span class="font-black text-[#e09a82]">{{ formatPrice(order?.totalAmount || order?.totalPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="pt-10 border-t border-orange-100 text-center">
          <p class="text-sm text-gray-400 italic">
            Vielen Dank für dein Vertrauen in LetItFlow. <br/>
            Bei Fragen wende dich gerne an unseren
            <router-link to="/contact" class="text-[#e09a82] underline">Support</router-link>
            .
          </p>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {fetchOrderById, fetchOrderDetailsByOrderId, fetchOrdersByUserId} from '@/services/api';
import {formatDate} from '@/utils/dateUtils';
import {getProductImage} from '@/utils/productUtils';
import AddressCard from '@/components/AddressCard.vue';
import {useAuth0} from '@auth0/auth0-vue';
import CardItem from '@/components/cardComponents/CardItem.vue';

const route = useRoute();
const id = route.params.id;
const {user, isAuthenticated} = useAuth0();

const order = ref(null);
const orderDetails = ref([]);
const loading = ref(true);
const error = ref(null);

const loadOrder = async () => {
  loading.value = true;
  error.value = null;
  try {
    order.value = await fetchOrderById(id);

    const nestedItems = order.value.items || order.value.orderDetails || order.value.orderItems || order.value.order_items;
    if (nestedItems && Array.isArray(nestedItems) && nestedItems.length > 0) {
      orderDetails.value = normalizeItems(nestedItems);
    } else {
      try {
        orderDetails.value = normalizeItems(await fetchOrderDetailsByOrderId(id));
        console.log('Bestelldetails erfolgreich geladen:', orderDetails.value);
      } catch (detErr) {
        console.warn('Bestelldetails konnten nicht separat geladen werden:', detErr);
      }
    }
  } catch (e) {
    if ((e.status === 405 || e.status === 403) && isAuthenticated.value && user.value?.sub) {
      try {
        const list = await fetchOrdersByUserId(user.value.sub);
        const found = Array.isArray(list) ? list.find(o => String(o.id) === String(id)) : null;
        if (found) {
          order.value = found;
          const nestedItems = order.value.items || order.value.orderDetails || order.value.orderItems || order.value.order_items;
          if (nestedItems && Array.isArray(nestedItems) && nestedItems.length > 0) {
            orderDetails.value = normalizeItems(nestedItems);
          } else {
            try {
              orderDetails.value = normalizeItems(await fetchOrderDetailsByOrderId(id));
            } catch (detErr) {
              console.warn('Bestelldetails konnten nicht separat geladen werden (Fallback):', detErr);
            }
          }
        } else {
          error.value = 'Bestellung wurde nicht gefunden.';
        }
      } catch (fallbackErr) {
        console.error('Fallback (Orders by user) fehlgeschlagen:', fallbackErr);
        error.value = 'Die Details dieser Bestellung konnten nicht geladen werden.';
      }
    } else {
      console.error('Fehler beim Laden der Bestellung:', e);
      error.value = 'Die Details dieser Bestellung konnten nicht geladen werden.';
    }
  } finally {
    loading.value = false;
  }
};

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR'
  });
};

const normalizeItems = (items = []) => {
  return items.map((item) => {
    const quantity = item.quantity ?? item.amount ?? item.count ?? 0;
    const pricePerUnit = item.pricePerUnit ?? item.unitPrice ?? item.price ?? 0;
    const totalPrice = item.totalPrice ?? (Number(pricePerUnit) * Number(quantity));
    const color = item.color ?? item.variantColor ?? item.variant?.color ?? item.variante?.color;
    const size = item.size ?? item.variantSize ?? item.variant?.size ?? item.variante?.size;
    const imageUrl = item.imageUrl ?? item.image_url ?? getProductImage(item);
    return {
      ...item,
      quantity,
      pricePerUnit,
      totalPrice,
      title: item.title ?? item.productTitle ?? item.productName ?? 'Produkt',
      imageUrl,
      color,
      size,
    };
  });
};

onMounted(loadOrder);
</script>
