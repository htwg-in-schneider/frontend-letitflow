<template>
  <section class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Produkte (Admin)</h1>

    <div v-if="loading">Lade Produkte...</div>
    <div v-else-if="error" class="text-red-600 mb-4">
      {{ error }}
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
      <!-- Neues Produkt erstellen -->
      <AdminAddProduct
        v-if="selectedCategoryForAdd"
        :categoryId="selectedCategoryForAdd"
        @created="loadData"
      />

      <!-- Vorhandene Produkte -->
      <div
        v-for="product in products"
        :key="product.id"
        class="border border-[#f0c9b8] bg-white flex flex-col rounded-md overflow-hidden shadow-sm"
      >
        <img
          :src="product.imageUrl || 'https://via.placeholder.com/400x300?text=Produkt'"
          :alt="product.title || product.name"
          class="w-full object-cover aspect-[4/3]"
        />

        <div class="flex-1 flex flex-col justify-between px-4 py-4">
          <div>
            <h3 class="font-semibold text-lg leading-snug mb-1">
              {{ product.title || product.name }}
            </h3>
            <p class="text-xs text-gray-500 mb-3">
              Kategorie: <span class="font-mono">{{ getCategoryName(product.categoryId) || 'Keine' }}</span>
            </p>
          </div>

          <div class="mt-4 flex justify-between gap-2">
            <router-link
              :to="{ name: 'AdminProductDetail', params: { id: product.id } }"
              class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium text-white bg-[#e09a82]"
            >
              Bearbeiten
            </router-link>

            <button
              class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium text-white bg-red-500"
              @click="handleDeleteProduct(product.id)"
            >
              Löschen
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="products.length === 0"
        class="col-span-full text-center text-gray-500 text-sm"
      >
        Noch keine Produkte vorhanden.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminAddProduct from '@/components/AdminAddProduct.vue'
import {
  fetchProducts,
  fetchCategories,
  deleteProduct
} from '@/services/api'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref(null)
const selectedCategoryForAdd = ref(null)

function getCategoryName(categoryId) {
  const cat = categories.value.find(c => c.id === categoryId)
  return cat ? cat.name : null
}

async function loadData() {
  loading.value = true
  error.value = null
  try {
    products.value = await fetchProducts()
    categories.value = await fetchCategories()
    
    if (categories.value.length > 0 && !selectedCategoryForAdd.value) {
      selectedCategoryForAdd.value = categories.value[0].id
    }
  } catch (e) {
    error.value = 'Daten konnten nicht geladen werden.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function handleDeleteProduct(id) {
  if (!confirm('Produkt wirklich löschen?')) return
  try {
    await deleteProduct(id)
    await loadData()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Löschen des Produkts')
  }
}

onMounted(loadData)
</script>
