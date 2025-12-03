<template>
  <main class="max-w-5xl mx-auto p-4 md:p-8">
    <h1 class="text-3xl md:text-4xl font-semibold mb-4">
      Suchergebnisse
    </h1>

    <p class="text-sm text-gray-600 mb-6">
      Ergebnisse für
      <span v-if="query">„{{ query }}“</span>
      <span v-else>alle Produkte</span>
    </p>

    <div v-if="loading" class="text-gray-500">
      Suche läuft...
    </div>

    <p v-else-if="error" class="text-red-500">
      {{ error }}
    </p>

    <p v-else-if="products.length === 0" class="text-gray-500">
      Keine Produkte gefunden. Bitte passe deine Filter an.
    </p>

    <div
      v-else
      class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :id="product.id"
        :title="product.title"
        :image-src="product.image"
        :colors="product.colors"
        :sizes="product.sizes"
        :price="product.price"
        :availability="product.availability"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { fetchProducts, fetchProductVariants } from '@/services/api'

const route = useRoute()

const query = ref('')
const products = ref([])
const loading = ref(true)
const error = ref(null)

const loadResults = async () => {
  loading.value = true
  error.value = null
  products.value = []

  try {
    const q = route.query.q || ''
    const categorySlug = route.query.categorySlug || ''
    const colorFilter = route.query.color || ''
    const sizeFilter = route.query.size || ''
    const minPrice = route.query.minPrice
        ? Number(route.query.minPrice)
        : null
    const maxPrice = route.query.maxPrice
        ? Number(route.query.maxPrice)
        : null

    query.value = q

    const filters = {}

    if (q) filters.searchTerm = q
    if (categorySlug) filters.categorySlug = categorySlug

    if (colorFilter) filters.color = colorFilter

    const backendProducts = await fetchProducts(filters)

    let mapped = await Promise.all(
        backendProducts.map(async (p) => {
          const variants = await fetchProductVariants(p.id)

          const colorSet = new Set()
          const sizeSet = new Set()
          let minVarPrice = null
          let available = false

          for (const v of variants) {
            if (v.color) colorSet.add(v.color)
            if (v.size) sizeSet.add(v.size)
            if (typeof v.price === 'number') {
              if (minVarPrice === null || v.price < minVarPrice) {
                minVarPrice = v.price
              }
            }
            if (v.available) available = true
          }

          const colorArray = Array.from(colorSet)
          const sizeArray = Array.from(sizeSet)

          const numericPrice =
              minVarPrice !== null
                  ? minVarPrice
                  : typeof p.price === 'number'
                      ? p.price
                      : null

          const displayPrice =
              numericPrice !== null
                  ? numericPrice.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                  })
                  : '–'

          return {
            id: p.id,
            title: p.title || p.name,
            description: p.description || '',          // optional für Suche
            image: p.imageUrl || '/img/placeholder.png',
            colors: colorArray.join(', '),
            sizes: sizeArray.join(', '),
            price: displayPrice,
            availability: available ? 'verfügbar' : 'momentan nicht verfügbar',
            // interne Felder für Filterlogik:
            _colorsArray: colorArray,
            _sizesArray: sizeArray,
            _numericPrice: numericPrice
          }
        })
    )

    const term = String(q).trim().toLowerCase()
    if (term) {
      mapped = mapped.filter((p) => {
        const haystack = (
            (p.title || '') +
            ' ' +
            (p.description || '') +
            ' ' +
            (p.colors || '') +
            ' ' +
            (p.sizes || '')
        ).toLowerCase()

        return haystack.includes(term)
      })
    }

    if (colorFilter) {
      const colorLower = String(colorFilter).toLowerCase()
      mapped = mapped.filter((p) =>
          p._colorsArray.some(
              (c) => String(c).toLowerCase() === colorLower
          )
      )
    }

    if (sizeFilter) {
      mapped = mapped.filter((p) =>
          p._sizesArray.includes(sizeFilter)
      )
    }

    if (minPrice !== null) {
      mapped = mapped.filter((p) =>
          p._numericPrice === null ? false : p._numericPrice >= minPrice
      )
    }
    if (maxPrice !== null) {
      mapped = mapped.filter((p) =>
          p._numericPrice === null ? false : p._numericPrice <= maxPrice
      )
    }

    products.value = mapped
  } catch (e) {
    console.error('Fehler beim Laden der Suchergebnisse:', e)
    error.value = 'Suchergebnisse konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

</script>
