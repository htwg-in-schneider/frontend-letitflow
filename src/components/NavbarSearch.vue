<template>
  <div class="relative">
    <!-- Lupe-Button -->
    <button
        type="button"
        class="flex items-center justify-center rounded-full p-2 hover:bg-[#f5e0d8] transition"
        @click="toggle"
    >
      <img :src="lupeIcon" alt="Suche" class="h-5 w-5" />
    </button>

    <!-- Such-Overlay -->
    <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 bg-white border border-orange-100 shadow-lg rounded-xl p-4 z-50"
    >
      <!-- Suchfeld -->
      <div class="mb-3">
        <label class="block text-xs font-medium text-gray-700 mb-1">
          Suchbegriff
        </label>
        <input
            v-model="query"
            type="text"
            placeholder="z.B. Luna, Tampons..."
            class="w-full border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]"
        />
      </div>

      <!-- Kategorie -->
      <div class="mb-3">
        <label class="block text-xs font-medium text-gray-700 mb-1">
          Kategorie
        </label>
        <select
            v-model="selectedCategory"
            class="w-full border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]"
        >
          <option value="">Alle Kategorien</option>
          <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Preis -->
      <div class="mb-3">
        <label class="block text-xs font-medium text-gray-700 mb-1">
          Preis
        </label>
        <select
            v-model="selectedPriceRange"
            class="w-full border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]"
        >
          <option value="">Alle Preise</option>
          <option value="unter-10">unter 10 €</option>
          <option value="10-20">10–20 €</option>
          <option value="20-30">20–30 €</option>
          <option value="ueber-30">über 30 €</option>
        </select>
      </div>

      <!-- Farbe -->
      <div class="mb-3">
        <label class="block text-xs font-medium text-gray-700 mb-1">
          Farbe
        </label>
        <select
            v-model="selectedColor"
            class="w-full border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]"
        >
          <option value="">Alle Farben</option>
          <option value="rot">rot</option>
          <option value="blau">blau</option>
          <option value="lila">lila</option>
          <option value="gelb">gelb</option>
          <option value="gruen">grün</option>
          <option value="orange">orange</option>
        </select>
      </div>

      <!-- Buttons -->
      <div class="mt-3 flex justify-end gap-2">
        <button
            type="button"
            class="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
            @click="close"
        >
          Schließen
        </button>

        <button
            type="button"
            class="text-xs px-3 py-1 rounded-full bg-[#e09a82] text-white font-medium hover:bg-[#d48366] transition"
            @click="onSearch"
        >
          Suchen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lupeIcon from '@/assets/icons/lupe.png'
import { productCategories } from '@/constants/productCategories.js'

const isOpen = ref(false)
const query = ref('')
const selectedCategory = ref('')
const selectedPriceRange = ref('')
const selectedColor = ref('')

const categories = productCategories

const toggle = () => {
  isOpen.value = !isOpen.value
}

const resetFilters = () => {
  query.value = ''
  selectedCategory.value = ''
  selectedPriceRange.value = ''
  selectedColor.value = ''
}

const close = () => {
  isOpen.value = false
  resetFilters()
}

const onSearch = () => {
  console.log('Suche ausführen mit:', {
    query: query.value,
    category: selectedCategory.value,
    priceRange: selectedPriceRange.value,
    color: selectedColor.value
  })
  close()
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
