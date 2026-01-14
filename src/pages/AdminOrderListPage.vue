<template>
  <main class="h-screen bg-[#fff7f3] flex flex-col">
    <header class="bg-white border-b border-orange-100 px-6 py-4">
      <div class="flex items-center justify-between mb-4">
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
      </div>

      <div class="bg-[#fff7f3] border border-orange-100 rounded-xl p-4">
        <div class="grid gap-3 md:grid-cols-7">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Kundenname</label>
            <input
              v-model="filters.customerName"
              type="text"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e09a82] outline-none transition-all"
              placeholder="Suchen..."
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">User ID</label>
            <input
              v-model="filters.userId"
              type="number"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e09a82] outline-none transition-all"
              placeholder="z.B. 2"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Status</label>
            <select
              v-model="filters.status"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#e09a82] outline-none"
            >
              <option value="">Alle</option>
              <option value="PENDING">Pending</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Von Datum</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e09a82] outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Bis Datum</label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e09a82] outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Min Betrag</label>
            <input
              v-model="filters.minAmount"
              type="number"
              step="0.01"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e09a82] outline-none transition-all"
              placeholder="0.00"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Max Betrag</label>
            <input
              v-model="filters.maxAmount"
              type="number"
              step="0.01"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e09a82] outline-none transition-all"
              placeholder="1000.00"
            />
          </div>
        </div>

        <div class="mt-3 flex gap-3">
          <button
            class="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white bg-[#e09a82] hover:bg-[#d08a72] transition-colors shadow-sm"
            @click="applyFilters"
          >
            Filtern anwenden
          </button>
          <button
            class="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            @click="resetFilters"
          >
            Leeren
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden flex-col md:flex-row">
      <div class="w-full md:w-1/2 lg:w-2/5 border-r border-orange-100 bg-white flex flex-col">
        <div v-if="loading" class="flex-1 flex items-center justify-center text-gray-500">
          Lade Bestellungen...
        </div>
        <div v-else-if="orderError" class="flex-1 flex items-center justify-center text-red-600 px-6">
          {{ orderError }}
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

      <div class="hidden md:flex md:w-1/2 lg:w-3/5 flex-col bg-[#fff7f3] min-h-0">
        <div v-if="!selectedOrderId" class="flex-1 flex items-center justify-center text-gray-400 px-6">
          <p class="text-center">Wähle eine Bestellung aus, um Details anzuzeigen</p>
        </div>
        <div v-else-if="loadingDetail" class="flex-1 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e09a82]"></div>
        </div>
        <div v-else-if="selectedOrder" class="flex-1 overflow-y-auto p-6">
          <div class="bg-white rounded-xl border border-orange-100 overflow-hidden">
            <div class="bg-[#fff7f3] p-6 border-b border-orange-100">
              <h2 class="text-xl font-bold text-gray-900">Bestellung #{{ selectedOrder.id }}</h2>
              <p class="text-sm text-gray-500 mt-1">{{ formatDate(selectedOrder.orderDate || selectedOrder.createdAt) }}</p>
              <p class="text-2xl font-bold text-[#e09a82] mt-3">{{ formatPrice(selectedOrder.totalAmount || selectedOrder.totalPrice) }}</p>
            </div>
            <div class="p-6 space-y-6">
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kunde</p>
                <p class="font-semibold text-gray-900">{{ getCustomerDisplay(selectedOrder) }}</p>
              </div>
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

          <div class="p-4 space-y-4">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kunde</p>
              <p class="font-semibold text-gray-900">{{ getCustomerDisplay(selectedOrder) }}</p>
            </div>
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
import { useToast } from '@/composables/useToast'
import { fetchAllOrders, fetchUserById, searchOrders } from '@/services/api'
import CardItem from '@/components/cardComponents/CardItem.vue'

const { error } = useToast()

const orders = ref([])
const allOrders = ref([])
const loading = ref(false)
const orderError = ref(null)

const filters = ref({
  customerName: '',
  userId: '',
  status: '',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: ''
})

const selectedOrderId = ref(null)
const selectedOrder = ref(null)
const selectedOrderDetails = ref([])
const loadingDetail = ref(false)

const loadOrders = async () => {
  loading.value = true
  orderError.value = null
  try {
    const data = await fetchAllOrders()
    allOrders.value = data
    orders.value = data
  } catch (e) {
    console.error(e)
    orderError.value = 'Bestellungen konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  loading.value = true
  orderError.value = null
  
  try {
    let filtered = [...allOrders.value]
    if (filters.value.customerName) {
      const search = filters.value.customerName.toLowerCase()
      filtered = filtered.filter(order => 
        order.customerName?.toLowerCase().includes(search)
      )
    }
    
    // Filter nach User ID
    if (filters.value.userId) {
      filtered = filtered.filter(order => 
        order.userId === Number(filters.value.userId)
      )
    }
    
    // Filter nach Status
    if (filters.value.status) {
      filtered = filtered.filter(order => 
        order.status === filters.value.status
      )
    }
    
    // Filter nach Startdatum
    if (filters.value.startDate) {
      const startDate = new Date(`${filters.value.startDate}T00:00:00`)
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate || order.createdAt)
        return orderDate >= startDate
      })
    }
    
    // Filter nach Enddatum
    if (filters.value.endDate) {
      const endDate = new Date(`${filters.value.endDate}T23:59:59`)
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate || order.createdAt)
        return orderDate <= endDate
      })
    }
    
    // Filter nach Mindestbetrag
    if (filters.value.minAmount) {
      const minAmount = Number(filters.value.minAmount)
      filtered = filtered.filter(order => 
        (order.totalAmount || order.totalPrice || 0) >= minAmount
      )
    }
    
    // Filter nach Maximalbetrag
    if (filters.value.maxAmount) {
      const maxAmount = Number(filters.value.maxAmount)
      filtered = filtered.filter(order => 
        (order.totalAmount || order.totalPrice || 0) <= maxAmount
      )
    }
    
    orders.value = filtered
  } catch (e) {
    console.error(e)
    orderError.value = 'Filter konnte nicht angewendet werden.'
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    customerName: '',
    userId: '',
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  }
  orders.value = allOrders.value
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
    selectedOrderDetails.value = selectedOrder.value?.items || []
    if (selectedOrder.value?.userId) {
      try {
        const customerData = await fetchUserById(selectedOrder.value.userId)
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
  if (Array.isArray(value) && value.length >= 3) {
    return new Date(value[0], value[1] - 1, value[2])
  }
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
  if (order.customerName) return order.customerName
  if (order.shippingAddressName) return order.shippingAddressName
  
  return 'Unbekannt'
}

const updateQuantity = async (item, event) => {
  const newQuantity = Number.parseInt(event.target.value)
  try {
    await fetch(`/api/order-details/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity })
    })
    item.quantity = newQuantity
  } catch (e) {
    console.error('Fehler beim Update:', e)
    error('Menge konnte nicht aktualisiert werden')
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
    error('Menge konnte nicht aktualisiert werden')
  }
}

const removeItem = async (item) => {
  if (!confirm(`Artikel "${item.title}" wirklich aus der Bestellung entfernen?`)) return
  try {
    await fetch(`/api/order-details/${item.id}`, { method: 'DELETE' })
    selectedOrderDetails.value = selectedOrderDetails.value.filter(i => i.id !== item.id)
  } catch (e) {
    console.error('Fehler beim Löschen:', e)
    error('Artikel konnte nicht entfernt werden')
  }
}
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

</script>
