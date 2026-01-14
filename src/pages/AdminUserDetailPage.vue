<template>
  <section class="max-w-4xl mx-auto p-4 md:p-6">
    <div class="mb-6">
      <router-link
        to="/admin/users"
        class="inline-flex items-center text-sm text-[#e09a82] hover:text-[#d48366] mb-4"
      >
        ← Zurück zur Übersicht
      </router-link>
      <h1 class="text-3xl font-semibold text-gray-800">Nutzer bearbeiten</h1>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      <div class="animate-pulse">Lade...</div>
    </div>
    <div v-else-if="userError" class="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-6">
      {{ userError }}
    </div>

    <div v-else-if="user" class="space-y-6">
      <!-- 3-Spalten Layout: Grunddaten | Bestellhistorie | Bestelldetails -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- Linke Spalte: Grundinformationen -->
        <div class="bg-white border border-[#f0c9b8] rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4 text-gray-800">Grundinformationen</h2>
          <form @submit.prevent="save">
            <div class="grid gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
                <input
                  v-model="form.firstName"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                />
                <p v-if="errors.firstName" class="text-xs text-red-600 mt-1">{{ errors.firstName }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
                <input
                  v-model="form.lastName"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                />
                <p v-if="errors.lastName" class="text-xs text-red-600 mt-1">{{ errors.lastName }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                <input
                  v-model="form.email"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                />
                <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                <select
                  v-model="form.role"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                >
                  <option value="ROLE_USER">Benutzer</option>
                  <option value="ROLE_ADMIN">Administrator</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Passwort (optional)</label>
                <input
                  type="password"
                  v-model="form.password"
                  placeholder="Leer lassen, wenn unverändert"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                />
                <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
              </div>

              <button
                type="submit"
                class="mt-4 w-full inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white bg-[#e09a82] hover:bg-[#d48366] transition"
              >
                Speichern
              </button>
            </div>
          </form>
        </div>

        <!-- Mittlere Spalte: Bestellhistorie -->
        <div class="bg-white border border-[#f0c9b8] rounded-xl p-5 shadow-sm">
          <h3 class="text-sm font-bold uppercase tracking-wider text-[#e09a82] mb-4">
            Bestellhistorie
          </h3>
          <div v-if="ordersLoading" class="py-10 text-center text-gray-400">Lade...</div>
          <div v-else class="max-h-[500px] overflow-y-auto pr-1">
            <AdminOrderDisplay 
              :orders="orders" 
              :selected-id="selectedOrder ? selectedOrder.id : null" 
              @select="handleSelectOrder" 
            />
          </div>
        </div>

        <!-- Rechte Spalte: Bestelldetails -->
        <div class="space-y-4">
          <!-- Bestell-Info -->
          <div class="bg-white border border-[#f0c9b8] rounded-xl shadow-sm overflow-hidden">
            <div class="bg-[#fff7f3] p-6 border-b border-orange-100">
              <h2 class="text-xl font-bold text-gray-900">Bestellung #{{ selectedOrder?.id }}</h2>
              <p class="text-sm text-gray-500 mt-1">{{ selectedOrder ? formatDateShort(selectedOrder.orderDate || selectedOrder.createdAt) : '-' }}</p>
              <p class="text-2xl font-bold text-[#e09a82] mt-3">{{ selectedOrder ? formatPrice(selectedOrder.totalAmount) : '-' }}</p>
            </div>

            <div v-if="!selectedOrder" class="p-6 flex flex-col items-center justify-center text-gray-400 text-center">
              <div class="text-3xl mb-2 text-gray-200">←</div>
              <p class="text-sm italic">Wähle eine Bestellung</p>
            </div>
          </div>

          <!-- Enthaltene Artikel -->
          <div v-if="selectedOrder" class="bg-white border border-[#f0c9b8] rounded-xl shadow-sm p-6">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Bestellte Artikel</p>

            <div v-if="orderDetailsLoading" class="py-6 text-center">
              <div class="animate-pulse text-gray-400 text-sm">Lade Artikel...</div>
            </div>
            
            <div v-else-if="orderDetails.length > 0" class="space-y-3">
              <CardItem
                v-for="item in orderDetails"
                :key="item.id"
                :item="item"
                :showActions="false"
                :quantityOptionsMax="20"
                :showImage="false"
              />
            </div>

            <div v-else class="text-center py-6 text-gray-400 text-sm">
              Keine Artikel
            </div>
          </div>
        </div>
      </div>

      <!-- Adressen (unter dem 3-spalten Layout) -->
      <div class="mt-10">
        <h2 class="text-lg font-semibold text-gray-800 mb-6">Adressen</h2>
        <div class="grid gap-6 lg:grid-cols-2">
          <AddressCard
            title="Versandadresse"
            :userId="user.id"
            type="SHIPPING"
          />
          <AddressCard
            title="Rechnungsadresse"
            :userId="user.id"
            type="BILLING"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-500">
      Nutzer nicht gefunden.
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import CardItem from '@/components/cardComponents/CardItem.vue'
import { fetchUserById, updateUser, fetchOrdersByUserId, fetchOrderDetailsByOrderId } from '@/services/api'
import AddressCard from '@/components/AddressCard.vue'
import AdminOrderDisplay from '@/components/AdminOrderDisplay.vue'

const route = useRoute()
const id = Number(route.params.id)
const { success, error } = useToast()

const user = ref(null)
const loading = ref(false)
const userError = ref(null)

const orders = ref([])
const ordersLoading = ref(false)
const ordersError = ref(null)
const selectedOrder = ref(null)
const orderDetails = ref([])
const orderDetailsLoading = ref(false)
const orderDetailsError = ref(null)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: 'ROLE_USER',
  password: ''
})

const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

function validate() {
  errors.value = { firstName: '', lastName: '', email: '', password: '' }

  if (!form.value.firstName?.trim()) errors.value.firstName = 'Vorname ist Pflicht.'
  if (!form.value.lastName?.trim()) errors.value.lastName = 'Nachname ist Pflicht.'

  const email = form.value.email?.trim()
  if (!email) errors.value.email = 'E-Mail ist Pflicht.'
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.value.email = 'Bitte gültige E-Mail eingeben.'

  if (form.value.password && form.value.password.length < 4) {
    errors.value.password = 'Passwort muss mind. 4 Zeichen haben.'
  }

  return !Object.values(errors.value).some(Boolean)
}

async function load() {
  loading.value = true
  userError.value = null
  try {
    user.value = await fetchUserById(id)
    form.value = {
      firstName: user.value.firstName ?? '',
      lastName: user.value.lastName ?? '',
      email: user.value.email ?? '',
      role: user.value.role ?? 'ROLE_USER',
      password: ''
    }
  } catch (e) {
    console.error(e)
    userError.value = 'Nutzer konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function loadAddresses() {
  // AddressCard lädt sich selbst
}

async function loadOrders() {
  ordersLoading.value = true
  ordersError.value = null
  try {
    orders.value = await fetchOrdersByUserId(id)
    if (selectedOrder.value) {
      const stillExists = orders.value.find(o => o.id === selectedOrder.value.id)
      if (!stillExists) {
        selectedOrder.value = null
        orderDetails.value = []
      }
    }
  } catch (e) {
    console.error(e)
    orders.value = []
    if (e?.status === 403) {
      ordersError.value = 'Keine Berechtigung, Bestellungen dieses Nutzers abzurufen.'
    } else {
      ordersError.value = 'Bestellungen konnten nicht geladen werden.'
    }
  } finally {
    ordersLoading.value = false
  }
}

async function loadOrderDetails(orderId) {
  orderDetailsLoading.value = true
  orderDetailsError.value = null
  try {
    orderDetails.value = await fetchOrderDetailsByOrderId(orderId)
  } catch (e) {
    console.error(e)
    orderDetails.value = []
    orderDetailsError.value = 'Details konnten nicht geladen werden.'
  } finally {
    orderDetailsLoading.value = false
  }
}

function handleSelectOrder(order) {
  selectedOrder.value = order
  loadOrderDetails(order.id)
}

async function save() {
  if (!validate()) return

  const payload = {
    firstName: form.value.firstName.trim(),
    lastName: form.value.lastName.trim(),
    email: form.value.email.trim(),
    role: form.value.role
  }

  if (form.value.password) payload.password = form.value.password

  try {
    await updateUser(id, payload)
    await load()
  } catch (e) {
    console.error(e)
    error('Fehler beim Speichern (E-Mail evtl. schon vergeben?)')
  }
}

function parseDateValue(value) {
  if (!value) return new Date(0)
  // Wenn es ein Array ist [year, month, day, hour, min, sec, nanos]
  if (Array.isArray(value) && value.length >= 3) {
    return new Date(value[0], value[1] - 1, value[2])
  }
  // Sonst versuch es als String zu parsen
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date(0) : d
}

function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(price ?? 0)
}

function formatDateShort(dateValue) {
  if (!dateValue) return '-'
  const d = parseDateValue(dateValue)
  if (d.getTime() === 0) return '-'
  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  load()
  loadOrders()
})
</script>
