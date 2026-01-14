<template>
  <section class="max-w-5xl mx-auto p-4 md:p-8">
    <h1 class="text-3xl md:text-4xl font-semibold mb-8">
      {{ categoryTitle }}
    </h1>

    <div v-if="loading" class="text-gray-500">Lade Produkte...</div>
    <p v-else-if="error" class="text-red-500">{{ error }}</p>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { fetchCategories, fetchProducts, fetchProductVariants } from '@/services/api'
import { getProductImage } from '@/utils/productUtils'

const route = useRoute()


const categorySlug = computed(() => route.params.slug)

const categoryTitle = ref('Kategorie')
const products = ref([])
const loading = ref(true)
const error = ref(null)


const loadCategoryPage = async (slug) => {
  try {
    loading.value = true
    error.value = null
    products.value = []

   
    const categories = await fetchCategories()

  
    const cat = categories.find((c) => (c.slug ?? c.id) === slug)
    categoryTitle.value = cat ? cat.name : 'Kategorie'

 
    const backendProducts = await fetchProducts({ categorySlug: slug })

   
    const mappedProducts = await Promise.all(
        backendProducts.map(async (p) => {
          const variants = await fetchProductVariants(p.id)

          const colorSet = new Set()
          const sizeSet = new Set()
          let minPrice = null
          let available = false

          for (const v of variants) {
            if (v.color) colorSet.add(v.color)
            if (v.size) sizeSet.add(v.size)

            if (typeof v.price === 'number') {
              if (minPrice === null || v.price < minPrice) minPrice = v.price
            }

            if (Number(v.stock ?? 0) > 0) available = true
          }

          return {
            id: p.id,
            title: p.title || p.name,
            image: getProductImage(p),
            colors: Array.from(colorSet).join(', '),
            sizes: Array.from(sizeSet).join(', '),
            price:
                minPrice !== null
                    ? minPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                    : '–',
            availability: available ? 'verfügbar' : 'momentan nicht verfügbar',
          }
        })
    )

    products.value = mappedProducts
  } catch (e) {
    console.error(e)
    error.value = 'Produkte konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadCategoryPage(categorySlug.value)
})


watch(categorySlug, (newSlug) => {
  loadCategoryPage(newSlug)
})
</script>
