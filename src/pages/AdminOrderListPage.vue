<template>
  <main class="h-screen bg-[#fff7f3] flex flex-col">
    <header class="bg-white border-b border-orange-100 px-6 py-4 flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">Admin · Überblick</p>
        <h1 class="text-2xl font-bold text-gray-900">Alle Bestellungen</h1>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1 bg-[#fff4ea] text-[#e09a82] px-3 py-1 rounded-full text-sm font-semibold">
          {{ orders.length }}
        </span>
        <button
          @click="loadOrders"
          class="px-4 py-2 rounded-full bg-[#e09a82] text-white font-semibold hover:bg-[#d68570] transition shadow-sm"
        >
          Aktualisieren
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden flex-col md:flex-row">
      <!-- Liste (Links / Vollbild auf Mobile) -->
      <div class="w-full md:w-1/2 lg:w-2/5 border-r border-orange-100 bg-white flex flex-col">
        <div v-if="loading" class="flex-1 flex items-center justify-center text-gray-500">
          Lade Bestellungen...
        </div>
        <div v-else-if="error" class="flex-1 flex items-center justify-center text-red-600 px-6">
          {{ error }}
        </div>
        <div v-else-if="orders.length === 0" class="flex-1 flex items-center justify-center text-gray-500">
          Keine Bestellungen gefunden.
        </div>
        <div v-else class="overflow-y-auto flex-1">
          <div class="divide-y divide-orange-50">
            <div
              v-for="order in sortedOrders"
              :key="order.id"
              @click="selectedOrderId = order.id"
              :class="[
               'p-4 cursor-pointer hover:bg-[#faf7ff] transition border-2 rounded-lg outline-none',
              selectedOrderId === order.id ? 'border-[#e09a82]' : 'border-transparent'
              ]"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-gray-900 text-sm">#{{ order.id }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ formatDate(order.orderDate || order.createdAt) }}</p>
                  <p class="text-xs text-gray-600 mt-1 truncate">{{ getCustomerDisplay(order) }}</p>
                </div>
                <p class="font-bold text-[#e09a82] text-sm whitespace-nowrap">
                  {{ formatPrice(order.totalAmount || order.totalPrice) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Panel (Rechts auf Desktop) -->
      <div class="hidden md:flex md:w-1/2 lg:w-3/5 flex-col bg-[#fff7f3] min-h-0">
        <div v-if="!selectedOrderId" class="flex-1 flex items-center justify-center text-gray-400 px-6">
          <p class="text-center">Wähle eine Bestellung aus, um Details anzuzeigen</p>
        </div>
        <div v-else-if="loadingDetail" class="flex-1 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e09a82]"></div>
        </div>
        <div v-else-if="selectedOrder" class="flex-1 overflow-y-auto p-6">
          <div class="bg-white rounded-xl border border-orange-100 overflow-hidden">
            <!-- Header -->
            <div class="bg-[#fff7f3] p-6 border-b border-orange-100">
              <h2 class="text-xl font-bold text-gray-900">Bestellung #{{ selectedOrder.id }}</h2>
              <p class="text-sm text-gray-500 mt-1">{{ formatDate(selectedOrder.orderDate || selectedOrder.createdAt) }}</p>
              <p class="text-2xl font-bold text-[#e09a82] mt-3">{{ formatPrice(selectedOrder.totalAmount || selectedOrder.totalPrice) }}</p>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Kunde -->
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kunde</p>
                <p class="font-semibold text-gray-900">{{ getCustomerDisplay(selectedOrder) }}</p>
              </div>

              <!-- Artikel -->
              <div v-if="selectedOrderDetails.length > 0">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bestellte Artikel</p>
                <div class="space-y-3">
                  <CardItem
                    v-for="item in selectedOrderDetails"
                    :key="item.id"
                    :item="item"
                    :showActions="false"
                    :quantityOptionsMax="20"
                    :emitItemOnRemove="true"
                    
                  />
                </div>
              </div>

              <!-- Adressen -->
              <div v-if="selectedOrder.shippingName" class="space-y-4 border-t border-orange-100 pt-4">
                <div>
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lieferadresse</p>
                  <p class="text-sm text-gray-700 font-semibold">{{ selectedOrder.shippingName }}</p>
                  <p class="text-sm text-gray-700">{{ selectedOrder.shippingAddress }}</p>
                  <p class="text-sm text-gray-700">{{ selectedOrder.shippingCity }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal für Mobile Detail-View -->
    <div v-if="selectedOrderId && selectedOrder" class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" @click="selectedOrderId = null"></div>
    <div v-if="selectedOrderId && selectedOrder" class="md:hidden fixed inset-0 z-50 flex flex-col">
      <header class="bg-white border-b border-orange-100 px-4 py-3 flex items-center gap-3">
        <button @click="selectedOrderId = null" class="text-2xl text-gray-600 hover:text-gray-900">←</button>
        <h2 class="text-lg font-bold text-gray-900 flex-1">Bestellung #{{ selectedOrder.id }}</h2>
      </header>
      <div v-if="loadingDetail" class="flex-1 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e09a82]"></div>
      </div>
      <div v-else class="flex-1 overflow-y-auto bg-[#fff7f3] p-4">
        <div class="bg-white rounded-xl border border-orange-100 overflow-hidden">
          <!-- Header -->
          <div class="bg-[#fff7f3] p-4 border-b border-orange-100">
            <p class="text-sm text-gray-500">{{ formatDate(selectedOrder.orderDate || selectedOrder.createdAt) }}</p>
            <p class="text-xl font-bold text-[#e09a82] mt-2">{{ formatPrice(selectedOrder.totalAmount || selectedOrder.totalPrice) }}</p>
          </div>

          <!-- Content -->
          <div class="p-4 space-y-4">
            <!-- Kunde -->
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kunde</p>
              <p class="font-semibold text-gray-900">{{ getCustomerDisplay(selectedOrder) }}</p>
            </div>

            <!-- Artikel -->
            <div v-if="selectedOrderDetails.length > 0">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bestellte Artikel</p>
              <div class="space-y-3">
                <CardItem
                  v-for="item in selectedOrderDetails"
                  :key="item.id"
                  :item="item"
                  :showActions="false"
                  :quantityOptionsMax="20"
                  :emitItemOnRemove="true"
                  
                />
              </div>
            </div>

            <!-- Adressen -->
            <div v-if="selectedOrder.shippingName" class="space-y-3 border-t border-orange-100 pt-4">
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lieferadresse</p>
                <p class="text-sm text-gray-700 font-semibold">{{ selectedOrder.shippingName }}</p>
                <p class="text-sm text-gray-700">{{ selectedOrder.shippingAddress }}</p>
                <p class="text-sm text-gray-700">{{ selectedOrder.shippingCity }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { fetchAllOrders, fetchUserById } from '@/services/api'
import CardItem from '@/components/cardComponents/CardItem.vue'

const orders = ref([])
const loading = ref(false)
const error = ref(null)

const selectedOrderId = ref(null)
const selectedOrder = ref(null)
const selectedOrderDetails = ref([])
const loadingDetail = ref(false)

const loadOrders = async () => {
  loading.value = true
  error.value = null
  try {
    orders.value = await fetchAllOrders()
    // Lade Kundendaten für alle Bestellungen in der Liste
    for (const order of orders.value) {
      if (order.userId && !order.customer) {
        try {
          order.customer = await fetchUserById(order.userId)
        } catch (e) {
          console.warn(`Kunde für Order ${order.id} konnte nicht geladen werden:`, e)
        }
      }
    }
  } catch (e) {
    console.error(e)
    error.value = 'Bestellungen konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

const loadOrderDetail = async (orderId) => {
  if (!orderId) {
    selectedOrder.value = null
    selectedOrderDetails.value = []
    return
  }

  loadingDetail.value = true
  try {
    selectedOrder.value = orders.value.find(o => o.id === orderId)
    // Items sind bereits in der Order-Response eingebettet
    selectedOrderDetails.value = selectedOrder.value?.items || []
    
    // Lade Kundeninformationen mit der userId
    if (selectedOrder.value?.userId) {
      try {
        const customerData = await fetchUserById(selectedOrder.value.userId)
        // Merge Kundendetails in die Order
        if (customerData) {
          selectedOrder.value.customer = customerData
        }
      } catch (e) {
        console.warn('Kunde konnte nicht geladen werden:', e)
      }
    }
  } catch (e) {
    console.error(e)
    selectedOrderDetails.value = []
  } finally {
    loadingDetail.value = false
  }
}

const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => {
    const dateA = parseDateValue(a.orderDate || a.createdAt)
    const dateB = parseDateValue(b.orderDate || b.createdAt)
    return dateB - dateA
  })
})

const parseDateValue = (value) => {
  if (!value) return new Date(0)
  // Wenn es ein Array ist [year, month, day, hour, min, sec, nanos]
  if (Array.isArray(value) && value.length >= 3) {
    return new Date(value[0], value[1] - 1, value[2])
  }
  // Sonst versuch es als String zu parsen
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date(0) : d
}

const formatDate = (dateValue) => {
  if (!dateValue) return 'Unbekannt'
  const d = parseDateValue(dateValue)
  if (d.getTime() === 0) return 'Unbekannt'
  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR'
  })
}

const getCustomerDisplay = (order) => {
  if (!order) return 'Unbekannt'
  
  // Versuche zuerst den geladenen Customer zu nutzen
  if (order.customer) {
    const c = order.customer
    const fullName = [c.firstName, c.lastName].filter(Boolean).join(' ').trim()
    if (fullName) return fullName
    if (c.email) return c.email
  }
  
  // Fallback auf user/email/shippingName
  const u = order.user || {}
  const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ').trim()
  if (fullName) return fullName
  if (u.email) return u.email
  if (order.shippingName) return order.shippingName
  if (order.userEmail) return order.userEmail
  return 'Unbekannt'
}

const updateQuantity = async (item, event) => {
  const newQuantity = Number.parseInt(event.target.value)
  try {
    // API-Call: Menge aktualisieren (PUT /api/order-details/{id})
    await fetch(`/api/order-details/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity })
    })
    // Lokal aktualisieren
    item.quantity = newQuantity
  } catch (e) {
    console.error('Fehler beim Update:', e)
    alert('Menge konnte nicht aktualisiert werden')
  }
}

const updateQuantityDirect = async (item, newQuantity) => {
  try {
    await fetch(`/api/order-details/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity })
    })
    item.quantity = newQuantity
  } catch (e) {
    console.error('Fehler beim Update:', e)
    alert('Menge konnte nicht aktualisiert werden')
  }
}

const removeItem = async (item) => {
  if (!confirm(`Artikel "${item.title}" wirklich aus der Bestellung entfernen?`)) return
  try {
    // API-Call: Artikel löschen (DELETE /api/order-details/{id})
    await fetch(`/api/order-details/${item.id}`, { method: 'DELETE' })
    // Aus Liste entfernen
    selectedOrderDetails.value = selectedOrderDetails.value.filter(i => i.id !== item.id)
  } catch (e) {
    console.error('Fehler beim Löschen:', e)
    alert('Artikel konnte nicht entfernt werden')
  }
}

// Watch selectedOrderId und lade Details
const watchSelectedOrder = computed(() => selectedOrderId.value)
watch(watchSelectedOrder, (newId) => {
  loadOrderDetail(newId)
})

const onRemoveFromCardItem = async (payload) => {
  const item = payload?.id ? payload : selectedOrderDetails.value.find(i => i.variantId === payload)
  if (item) {
    await removeItem(item)
  }
}

onMounted(loadOrders)
</script>
<script>
// Hilfsfunktionen außerhalb von <script setup> sind nicht nötig; wir definieren sie im setup.
</script>
