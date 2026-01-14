<template>
  <div 
      class="relative"
      @mouseenter="isOpen = true"
      @mouseleave="isOpen = false"
  >

    <button
        type="button"
        class="flex items-center justify-center rounded-full p-2 hover:bg-[#f5e0d8] transition"
        @click="toggle"
    >
      <img src="/img/lupe.png" alt="Suche" class="h-5 w-5"/>

    </button>

    <div
        v-if="isOpen"
        class="absolute right-0 mt-0 w-80 bg-white border border-orange-100 shadow-lg rounded-xl p-4 z-50"
    >
      <div class="mb-5">
        <label class="block text-[10px] font-bold text-[#e09a82] uppercase tracking-[0.1em] mb-2 px-1">
          Wonach suchst du?
        </label>
        <div class="relative">
          <input
              v-model="query"
              type="text"
              placeholder="z.B. Bio-Tampons..."
              class="w-full border border-orange-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]/30 bg-[#fffcf9] transition-all"
              @keyup.enter="onSearch"
          />
          <button 
            @click="onSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-[#e09a82] hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2 px-1">
            Kategorie
          </label>
          <div class="relative">
            <select
                v-model="selectedCategory"
                class="w-full border border-orange-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]/30 bg-[#fffcf9] appearance-none cursor-pointer"
            >
              <option value="">Alle Kategorien</option>
              <option
                  v-for="cat in categories"
                  :key="cat.slug"
                  :value="cat.slug"
              >
                {{ cat.name }}
              </option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#e09a82]">
              <span class="text-[10px]">▼</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2 px-1">
              Preis
            </label>
            <div class="relative">
              <select
                  v-model="selectedPriceRange"
                  class="w-full border border-orange-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]/30 bg-[#fffcf9] appearance-none cursor-pointer"
              >
                <option value="">Alle</option>
                <option value="unter-10">bis 10 €</option>
                <option value="10-20">10–20 €</option>
                <option value="20-30">20–30 €</option>
                <option value="ueber-30">ab 30 €</option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#e09a82]">
                <span class="text-[10px]">▼</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2 px-1">
              Farbe
            </label>
            <div class="relative">
              <select
                  v-model="selectedColor"
                  class="w-full border border-orange-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]/30 bg-[#fffcf9] appearance-none cursor-pointer"
              >
                <option value="">Alle</option>
                <option
                    v-for="color in availableColors"
                    :key="color"
                    :value="color"
                >
                  {{ color }}
                </option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#e09a82]">
                <span class="text-[10px]">▼</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2 px-1">
            Größe
          </label>
          <div class="relative">
            <select
                v-model="selectedSize"
                class="w-full border border-orange-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]/30 bg-[#fffcf9] appearance-none cursor-pointer"
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
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#e09a82]">
              <span class="text-[10px]">▼</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex items-center gap-3">
        <button
            type="button"
            class="flex-1 text-sm font-semibold py-3 rounded-full border border-orange-100 text-gray-400 hover:bg-gray-50 transition-colors"
            @click="close"
        >
          Abbrechen
        </button>

        <button
            type="button"
            class="flex-[2] text-sm font-bold py-3 rounded-full bg-[#e09a82] text-white shadow-md shadow-orange-200 hover:bg-[#d48366] hover:shadow-lg transition-all"
            @click="onSearch"
        >
          Ergebnisse zeigen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {fetchCategories, fetchProducts, fetchProductVariants} from '@/services/api'

const router = useRouter()
const route = useRoute()

const isOpen = ref(false)
watch(
  () => route.fullPath,
  () => {
    isOpen.value = false
  }
)

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

  query.value = ''
  selectedCategory.value = ''
  selectedPriceRange.value = ''
  selectedColor.value = ''
  selectedSize.value = ''

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
    const data = await fetchCategories()
    categories.value = (data || [])
        .map((c) => ({
          ...c,
          slug: c.slug ?? c.id,
        }))
        .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'de'))
  } catch (e) {
    console.error('Kategorien konnten nicht geladen werden:', e)
  }

  await loadFilterOptions()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
