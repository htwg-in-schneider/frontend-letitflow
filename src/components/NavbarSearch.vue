<template>
  <div class="relative">

    <button
        type="button"
        class="flex items-center justify-center rounded-full p-2 hover:bg-[#f5e0d8] transition"
        @click="toggle"
    >
      <img src="/img/lupe.png" alt="Suche" class="h-5 w-5"/>

    </button>

    <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 bg-white border border-orange-100 shadow-lg rounded-xl p-4 z-50"
    >

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
              :value="cat.slug"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

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

      <div class="mb-3">
        <label class="block text-xs font-medium text-gray-700 mb-1">
          Farbe
        </label>
        <select
            v-model="selectedColor"
            class="w-full border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]"
        >
          <option value="">Alle Farben</option>
          <option
              v-for="color in availableColors"
              :key="color"
              :value="color"
          >
            {{ color }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="block text-xs font-medium text-gray-700 mb-1">
          Größe
        </label>
        <select
            v-model="selectedSize"
            class="w-full border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]"
        >
          <option value="">Alle Größen</option>
          <option
              v-for="size in availableSizes"
              :key="size"
              :value="size"
          >
            {{ size }}
          </option>
        </select>
      </div>

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
import {ref, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'
import {fetchCategories, fetchProducts, fetchProductVariants} from '@/services/api'

const router = useRouter()

const isOpen = ref(false)
const query = ref('')
const selectedCategory = ref('')
const selectedPriceRange = ref('')
const selectedColor = ref('')
const selectedSize = ref('')

const categories = ref([])
const availableColors = ref([])
const availableSizes = ref([])

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') close()
}

const mapPriceRangeToQuery = (range) => {
  switch (range) {
    case 'unter-10':
      return {maxPrice: 10}
    case '10-20':
      return {minPrice: 10, maxPrice: 20}
    case '20-30':
      return {minPrice: 20, maxPrice: 30}
    case 'ueber-30':
      return {minPrice: 30}
    default:
      return {}
  }
}

const onSearch = () => {
  const queryParams = {}

  if (query.value.trim()) {
    queryParams.q = query.value.trim()
  }
  if (selectedCategory.value) {
    queryParams.categorySlug = selectedCategory.value
  }
  if (selectedColor.value) {
    queryParams.color = selectedColor.value
  }
  if (selectedSize.value) {
    queryParams.size = selectedSize.value
  }

  Object.assign(queryParams, mapPriceRangeToQuery(selectedPriceRange.value))

  router.push({
    name: 'SearchResults',
    query: queryParams
  })

  close()
}

const loadFilterOptions = async () => {
  try {
    const allProducts = await fetchProducts({})
    const colorSet = new Set()
    const sizeSet = new Set()

    for (const p of allProducts) {
      const variants = await fetchProductVariants(p.id)
      for (const v of variants) {
        if (v.color) {
          colorSet.add(v.color)
        }
        if (v.size) {
          sizeSet.add(v.size)
        }
      }
    }

    availableColors.value = Array.from(colorSet).sort((a, b) =>
        a.localeCompare(b, 'de')
    )
    availableSizes.value = Array.from(sizeSet).sort((a, b) =>
        a.localeCompare(b, 'de')
    )
  } catch (e) {
    console.error('Filteroptionen (Farben/Größen) konnten nicht geladen werden:', e)
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)

  try {
    categories.value = await fetchCategories()
  } catch (e) {
    console.error('Kategorien konnten nicht geladen werden:', e)
  }

  await loadFilterOptions()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
