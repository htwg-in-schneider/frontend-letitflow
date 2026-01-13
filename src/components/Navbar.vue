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

        <router-link to="/cart" class="flex items-center justify-center">
          <img src="/img/warenkorb_icon.png" alt="Warenkorb" class="h-7 w-7" />
        </router-link>
      </div>
    </nav>

    <div class="h-[4px] bg-[#e7b2a5]"></div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavbarSearch from '@/components/NavbarSearch.vue'
import { fetchCategories } from '@/services/api'
import { useAuth0 } from '@auth0/auth0-vue'

const { user, isAuthenticated, logout } = useAuth0()
const route = useRoute()

const isUserMenuOpen = ref(false)

const handleLogout = () => {
  logout({ logoutParams: { returnTo: window.location.origin } })
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

onMounted(() => {
  loadCategories()
})
</script>
