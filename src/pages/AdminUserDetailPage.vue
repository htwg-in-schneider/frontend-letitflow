<template>
  <section class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Nutzer bearbeiten (Admin)</h1>

    <div v-if="loading" class="text-gray-500">Lade...</div>
    <div v-else-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <div v-else-if="user" class="bg-white border border-[#f0c9b8] rounded-xl p-6 shadow-sm">
      <form @submit.prevent="save">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium">Vorname</label>
            <input v-model="form.firstName" class="border rounded px-3 py-2 w-full" />
            <p v-if="errors.firstName" class="text-xs text-red-600 mt-1">{{ errors.firstName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium">Nachname</label>
            <input v-model="form.lastName" class="border rounded px-3 py-2 w-full" />
            <p v-if="errors.lastName" class="text-xs text-red-600 mt-1">{{ errors.lastName }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium">E-Mail</label>
            <input v-model="form.email" class="border rounded px-3 py-2 w-full" />
            <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium">Rolle</label>
            <select v-model="form.role" class="border rounded px-3 py-2 w-full bg-white">
              <option value="ROLE_USER">User</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>

          <!-- Passwort optional -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium">Passwort (optional ändern)</label>
            <input
              type="password"
              v-model="form.password"
              class="border rounded px-3 py-2 w-full"
              placeholder="Leer lassen, wenn unverändert"
            />
            <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-between gap-2">
          <router-link
            to="/admin/users"
            class="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium border border-[#f0c9b8] text-gray-700"
          >
            Zurück
          </router-link>

          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium text-white bg-[#e09a82]"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>

    <div v-else class="text-gray-500">Nutzer nicht gefunden.</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchUserById, updateUser } from '@/services/api'

const route = useRoute()
const id = Number(route.params.id)

const user = ref(null)
const loading = ref(false)
const error = ref(null)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: 'ROLE_USER',
  password: '' // optional
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

async function save() {
  if (!validate()) return

  const payload = {
    firstName: form.value.firstName.trim(),
    lastName: form.value.lastName.trim(),
    email: form.value.email.trim(),
    role: form.value.role
  }

  // Passwort nur senden, wenn gesetzt
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

onMounted(load)
</script>
