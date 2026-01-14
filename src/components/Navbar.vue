<template>
  <header class="w-full bg-[#fff7f3]">
    <div class="h-[4px] bg-[#e7b2a5]"></div>

    <nav class="w-full flex items-center justify-between px-8 py-4 bg-[#fff7f3]">
      <!-- LINKS: Logo + Produkte -->
      <div class="flex items-center gap-6">
        <router-link to="/" class="flex items-center gap-3">
          <img
              src="/img/hauptlogo_Header.png"
              alt="LetItFlow Logo"
              class="h-10 w-auto"
          />
        </router-link>

        <div
            class="relative flex items-center ml-14"
            @mouseenter="isCategoriesOpen = true"
            @mouseleave="isCategoriesOpen = false"
        >
          <button
              type="button"
              class="flex items-center gap-1 text-xl font-semibold text-black hover:text-[#e09a82] transition"
              @click="toggleCategories"
          >
            Produkte
            <span
                class="text-sm transition-transform"
                :class="isCategoriesOpen ? 'rotate-180' : ''"
            >
              ▼
            </span>
          </button>

          <div
              v-if="isCategoriesOpen"
              class="absolute left-0 top-full mt-0 w-72 bg-white border border-orange-100 shadow-xl rounded-2xl py-3 z-50 overflow-hidden"
          >
            <p class="px-5 pb-2 text-[10px] font-bold text-[#e09a82] uppercase tracking-[0.1em]">
              Entdecke unsere Welt
            </p>

            <!-- Loading -->
            <div v-if="categoriesLoading" class="px-5 py-3 text-sm text-gray-400 italic">
              Lade Kategorien...
            </div>

            <!-- Error -->
            <div v-else-if="categoriesError" class="px-5 py-3 text-sm text-red-400">
              {{ categoriesError }}
            </div>

            <!-- Categories -->
            <div v-else class="flex flex-col">
              <router-link
                  v-for="category in categories"
                  :key="category.slug"
                  :to="`/category/${category.slug}`"
                  class="group flex items-center justify-between px-5 py-2.5 text-sm text-gray-700 hover:bg-[#fff7f3] hover:text-[#e09a82] transition-all"
                  @click="isCategoriesOpen = false"
              >
                <span class="font-medium">{{ category.name }}</span>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity text-[#e09a82]">→</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- RECHTS: Search + Icons -->
      <div class="flex items-center gap-6 text-sm text-black">
        <NavbarSearch />

        <!-- Admin Dropdown (nur für Admins) -->
        <div
            v-if="isAdmin"
            class="relative flex items-center"
            @mouseenter="isAdminMenuOpen = true"
            @mouseleave="isAdminMenuOpen = false"
        >
          <div class="cursor-pointer py-1 flex items-center justify-center">
            <svg class="h-8 w-8 text-[#e09a82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <!-- Admin Popup Menu -->
          <div
              v-if="isAdminMenuOpen"
              class="absolute right-0 top-full mt-0 w-48 bg-white border border-orange-200 shadow-lg rounded-xl py-2 z-50"
          >
            <div class="px-4 py-1.5 text-xs font-bold text-[#e09a82] uppercase tracking-wider">
              Admin-Panel
            </div>
            <router-link
                to="/admin/categories"
                class="block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition font-semibold"
                @click="isAdminMenuOpen = false"
            >
              Kategorien
            </router-link>
            <router-link
                to="/admin/products"
                class="block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition font-semibold"
                @click="isAdminMenuOpen = false"
            >
              Produkte
            </router-link>
            <router-link
                to="/admin/products"
                class="block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition font-semibold"
                @click="isAdminMenuOpen = false"
            >
              Varianten
            </router-link>
            <router-link
                to="/admin/orders"
                class="block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition font-semibold"
                @click="isAdminMenuOpen = false"
            >
              Bestellungen
            </router-link>
            <hr class="my-1 border-orange-100" />
            <router-link
                to="/admin/users"
                class="block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition font-semibold"
                @click="isAdminMenuOpen = false"
            >
              Benutzer
            </router-link>
          </div>
        </div>

        <!-- User Dropdown (Hover) -->
        <div
            class="relative flex items-center"
            @mouseenter="isUserMenuOpen = true"
            @mouseleave="isUserMenuOpen = false"
        >
          <div class="cursor-pointer py-1">
            <img src="/img/benutzerIcon_Desktop.png" alt="Benutzer" class="h-8 w-8" />
          </div>

          <!-- Popup Menu -->
          <div
              v-if="isUserMenuOpen"
              class="absolute right-0 top-full mt-0 w-48 bg-white border border-orange-200 shadow-lg rounded-xl py-2 z-50"
          >
            <template v-if="!isAuthenticated">
              <router-link
                  to="/login"
                  class="block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition font-semibold"
                  @click="isUserMenuOpen = false"
              >
                Login
              </router-link>
            </template>
            <template v-else>
              <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition font-semibold"
                  @click="isUserMenuOpen = false"
              >
                Mein Profil
              </router-link>
              <router-link
                  v-if="!isAdmin"
                  to="/orders"
                  class="block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition font-semibold"
                  @click="isUserMenuOpen = false"
              >
                Meine Bestellungen
              </router-link>

              <hr class="my-1 border-orange-100" />
              <button
                  @click="handleLogout"
                  class="w-full text-left block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition font-semibold"
              >
                Ausloggen
              </button>
            </template>
          </div>
        </div>

        <router-link to="/cartView" class="flex items-center justify-center">
          <img src="/img/warenkorb_icon.png" alt="Warenkorb" class="h-7 w-7" />
        </router-link>
      </div>
    </nav>

    <div class="h-[4px] bg-[#e7b2a5]"></div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavbarSearch from '@/components/NavbarSearch.vue'
import { fetchCategories } from '@/services/api'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from '@/stores/auth'

const { user, isAuthenticated, logout } = useAuth0()
const authStore = useAuthStore()
const route = useRoute()

const isAdmin = computed(() => {
  const val = authStore.isAdmin
  console.debug('Navbar admin state', { roles: authStore.roles, isAdmin: val, profile: authStore.profile })
  return val
})

const isUserMenuOpen = ref(false)
const isAdminMenuOpen = ref(false)

const handleLogout = () => {
  logout({ logoutParams: { returnTo: window.location.origin } })
  authStore.logoutCleanup()
}

const isCategoriesOpen = ref(false)

// Schließe das Menü, wenn sich die Route ändert
watch(
  () => route.fullPath,
  () => {
    isCategoriesOpen.value = false
  }
)

const toggleCategories = () => {
  isCategoriesOpen.value = !isCategoriesOpen.value
}

const categories = ref([])
const categoriesLoading = ref(false)
const categoriesError = ref(null)

const loadCategories = async () => {
  try {
    categoriesLoading.value = true
    categoriesError.value = null

    const data = await fetchCategories()

    // Backend kann "slug" oder "id" liefern -> wir normalisieren auf "slug"
    categories.value = (data || [])
        .map((c) => ({
          ...c,
          slug: c.slug ?? c.id,
        }))
        // optional: alphabetisch sortieren
        .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'de'))
  } catch (e) {
    console.error(e)
    categoriesError.value = 'Kategorien konnten nicht geladen werden.'
    categories.value = []
  } finally {
    categoriesLoading.value = false
  }
}

onMounted(async () => {
  loadCategories()
  // Sync Auth0 user into store and load roles/profile
  authStore.setAuth0User(user.value)
  if (isAuthenticated.value) {
    await authStore.loadProfile()
  }
})

watch(isAuthenticated, async (val) => {
  authStore.setAuth0User(user.value)
  if (val) {
    await authStore.loadProfile()
  } else {
    authStore.logoutCleanup()
  }
})
</script>
