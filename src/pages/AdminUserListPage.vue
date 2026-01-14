<template>
  <section class="max-w-6xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Nutzerverwaltung (Admin)</h1>
      <span class="text-sm text-gray-500">{{ users.length }} Benutzer gefunden</span>
    </div>

    <div class="bg-white border border-[#f0c9b8] rounded-xl p-5 mb-8 shadow-sm">
      <div class="grid gap-4 md:grid-cols-4">
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Vorname</label>
          <input
            v-model="filters.firstName"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e09a82] outline-none transition-all"
            placeholder="Suchen..."
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Nachname</label>
          <input
            v-model="filters.lastName"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e09a82] outline-none transition-all"
            placeholder="Suchen..."
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">E-Mail</label>
          <input
            v-model="filters.email"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e09a82] outline-none transition-all"
            placeholder="Suchen..." 
          />
        </div>  

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Rolle</label>
          <select
            v-model="filters.role"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#e09a82] outline-none"
          >
            <option value="">Alle Rollen</option>
            <option value="ROLE_USER">User</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div class="mt-4 flex gap-3">
        <button
          class="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white bg-[#e09a82] hover:bg-[#d08a72] transition-colors shadow-sm"
          @click="loadUsers"
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

    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-pulse text-gray-400">Lade Benutzerdaten...</div>
    </div>
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
      {{ error }}
    </div>

    <div v-else class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
      <div class="col-span-1">ID</div>
      <div class="col-span-3">Name</div>
      <div class="col-span-4">E-Mail Adresse</div>
      <div class="col-span-2">Status / Rolle</div>
      <div class="col-span-2 text-right">Aktionen</div>
    </div>

    <div v-if="!loading" class="flex flex-col gap-2 mt-2">
      <div
        v-for="u in users"
        :key="u.id"
        class="group bg-white border border-gray-100 md:border-transparent md:hover:border-[#f0c9b8] rounded-xl md:rounded-none p-4 md:px-6 md:py-4 flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center transition-all hover:shadow-md md:hover:shadow-none md:border-b md:border-gray-50"
      >
        <div class="col-span-1 text-xs font-mono text-gray-400 mb-2 md:mb-0">
          #{{ u.id }}
        </div>
        
        <div class="col-span-3 font-semibold text-gray-800">
          {{ u.firstName }} {{ u.lastName }}
        </div>
        
        <div class="col-span-4 text-sm text-gray-600 truncate mb-3 md:mb-0">
          {{ u.email }}
        </div>

        <div class="col-span-2 mb-4 md:mb-0">
          <span 
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            :class="u.role === 'ROLE_ADMIN' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'"
          >
            {{ u.role === 'ROLE_ADMIN' ? 'Administrator' : 'Benutzer' }}
          </span>
        </div>

        <div class="col-span-2 flex justify-end gap-2">
          <router-link
            :to="{ name: 'AdminUserDetail', params: { id: u.id } }"
            class="p-2 rounded-lg text-gray-400 hover:text-[#e09a82] hover:bg-[#fff5f2] transition-all"
            title="Bearbeiten"
          >
            <span class="text-xs font-bold uppercase">Bearbeiten</span>
          </router-link>

          <button
            class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Löschen"
            @click="handleDelete(u.id)"
          >
            <span class="text-xs font-bold uppercase">Löschen</span>
          </button>
        </div>
      </div>

      <div v-if="users.length === 0" class="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mt-4">
        <p class="text-gray-400 text-sm italic">Keine Benutzer mit diesen Filtern gefunden.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchUsers, deleteUser } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const users = ref([])
const loading = ref(false)
const error = ref(null)

const filters = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: ''
})

function resetFilters() {
  filters.value = { firstName: '', lastName: '', email: '', role: '' }
  loadUsers()
}

async function loadUsers() {
  loading.value = true
  error.value = null
  try {
    users.value = await fetchUsers(filters.value)
  } catch (e) {
    console.error(e)
    error.value = 'Die Benutzerliste konnte nicht geladen werden. Bitte Backend prüfen.'
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('Möchten Sie diesen Benutzer wirklich dauerhaft löschen?')) return
  try {
    await deleteUser(id)
    await loadUsers()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Löschen des Benutzers.')
  }
}

// Warte auf isAdmin, dann lade Benutzer
watch(() => authStore.isAdmin, (isAdmin) => {
  console.log('isAdmin changed:', isAdmin)
  if (isAdmin && !authStore.loading) {
    loadUsers()
  }
}, { immediate: true })
</script>

<style scoped>
/* Optional: Verhindert, dass Text in der Tabelle umbricht */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>