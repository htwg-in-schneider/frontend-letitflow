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
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-6">
      {{ error }}
    </div>

    <div v-else-if="user" class="grid gap-6 lg:grid-cols-3">
      <!-- Nutzerformular (Linke Spalte) -->
      <div class="lg:col-span-2">
        <div class="bg-white border border-[#f0c9b8] rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4 text-gray-800">Grundinformationen</h2>
          <form @submit.prevent="save">
            <div class="grid gap-4 md:grid-cols-2">
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

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                <input
                  v-model="form.email"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                />
                <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                <select
                  v-model="form.role"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                >
                  <option value="ROLE_USER">👤 Benutzer</option>
                  <option value="ROLE_ADMIN">⚙️ Administrator</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Passwort (optional)</label>
                <input
                  type="password"
                  v-model="form.password"
                  placeholder="Leer lassen, wenn unverändert"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                />
                <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
              </div>
            </div>

            <div class="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="submit"
                class="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white bg-[#e09a82] hover:bg-[#d48366] transition"
              >
                ✓ Speichern
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bestellungen (Rechte Spalte) -->
      <div class="lg:col-span-1">
        <div class="bg-white border border-[#f0c9b8] rounded-xl p-6 shadow-sm h-full">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800">📋 Bestellungen</h2>
            <span class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
              {{ orders.length }}
            </span>
          </div>
          <div v-if="ordersLoading" class="text-gray-500 text-sm text-center py-6">
            Lade Bestellungen...
          </div>
          <AdminOrderDisplay v-else :orders="orders" />
        </div>
      </div>
    </div>

    <!-- Section Wrapper für Adressen (unter dem oberen Layout) -->
    <template v-if="user">
      <div class="mt-6"></div>

      <!-- Adressen -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold text-gray-800">Adressen</h2>
        <div class="grid gap-6 lg:grid-cols-2">
          <AddressCard
            title="📦 Versandadresse"
            :userId="user.id"
            type="SHIPPING"
          />
          <AddressCard
            title="💳 Rechnungsadresse"
            :userId="user.id"
            type="BILLING"
          />
        </div>
      </div>
    </template>

    <div v-else class="text-center py-12 text-gray-500">
      Nutzer nicht gefunden.
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchUserById, updateUser, fetchOrdersByUserId } from '@/services/api'
import AddressCard from '@/components/AddressCard.vue'
import AdminOrderDisplay from '@/components/AdminOrderDisplay.vue'

const route = useRoute()
const id = Number(route.params.id)

const user = ref(null)
const loading = ref(false)
const error = ref(null)

const orders = ref([])
const ordersLoading = ref(false)

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
  error.value = null
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
    error.value = 'Nutzer konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function loadAddresses() {
  // AddressCard lädt sich selbst
}

async function loadOrders() {
  ordersLoading.value = true
  try {
    orders.value = await fetchOrdersByUserId(id)
  } catch (e) {
    console.error(e)
    orders.value = []
  } finally {
    ordersLoading.value = false
  }
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
    alert('Nutzer gespeichert')
    await load()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Speichern (E-Mail evtl. schon vergeben?)')
  }
}

onMounted(() => {
  load()
  loadOrders()
})
</script>
