<template>
  <section class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Kategorie bearbeiten (Admin)</h1>

    <div v-if="loading">Lade...</div>

    <div v-else-if="error" class="text-red-600 mb-4">
      {{ error }}
    </div>

    <div v-else-if="category">
      <form @submit.prevent="saveCategory" class="mb-10">
        <AdminFormCard>
          <template #left>
            <ImagePickerCard
              v-model="category.imageUrl"
              :alt="category.name || 'Kategorie Bild'"
            />
          </template>

          <template #fields>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Kategoriename
              </label>
              <input
                v-model="category.name"
                class="w-full border rounded px-2 py-1 text-base font-semibold"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Beschreibung
              </label>
              <textarea
                v-model="category.description"
                rows="3"
                class="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Slug
              </label>
              <input
                v-model="category.slug"
                class="w-full border rounded px-2 py-1 text-sm font-mono"
              />
            </div>

            <p class="text-xs text-gray-500">
              ID: <span class="font-mono">{{ category.id }}</span>
            </p>
          </template>

          <template #leftActions>
            <router-link to="/admin/categories" class="px-4 py-2 border rounded">
              Zurück
            </router-link>
          </template>

          <template #rightActions>
            <button
              type="submit"
              class="rounded-full px-4 py-2 text-xs font-medium text-white bg-[#e09a82]"
            >
              Kategorie speichern
            </button>
          </template>
        </AdminFormCard>
      </form>

      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Produkte</h2>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
        <AdminAddProduct
          v-if="category?.id"
          :categoryId="category.id"
          @created="loadCategoryAndProducts"
        />


        <div
          v-for="p in productsWithInfo"
          :key="p.id"
          class="border border-[#f0c9b8] bg-white rounded-md shadow-sm flex flex-col overflow-hidden self-start"
        >
          <img
            :src="p.imageUrl || 'https://via.placeholder.com/400x300?text=Produkt'"
            :alt="p.title || 'Produkt'"
            class="w-full object-cover aspect-[4/3]"
          />

          <div class="flex-1 flex flex-col justify-between px-4 py-4">
            <div>
              <h3 class="font-semibold text-lg leading-snug mb-1">
                {{ p.title }}
              </h3>

              <p class="text-xs text-gray-500 mb-3">
                ID: <span class="font-mono">{{ p.id }}</span>
              </p>

              <p v-if="p.description" class="text-sm text-gray-600 line-clamp-3 mb-3">
                {{ p.description }}
              </p>

              <div class="text-xs text-gray-700 space-y-1">
                <p><span class="font-semibold">Farben:</span> {{ p.colors || '—' }}</p>
                <p><span class="font-semibold">Größen:</span> {{ p.sizes || '—' }}</p>
                <p><span class="font-semibold">Preis:</span> {{ p.priceLabel }}</p>
                <p><span class="font-semibold">Status:</span> {{ p.availability }}</p>
              </div>
            </div>

            <div class="mt-4 flex justify-between gap-2">
              <router-link
                :to="{ name: 'AdminProductDetail', params: { id: p.id } }"
                class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium text-white bg-[#e09a82]"
              >
                Bearbeiten
              </router-link>

              <button
                class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium text-white bg-red-500"
                @click="deleteProductById(p.id)"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="productsWithInfo.length === 0"
          class="col-span-full text-center text-gray-500 text-sm"
        >
          Noch keine Produkte in dieser Kategorie.
        </div>
      </div>
    </div>

    <div v-else class="text-red-600">Kategorie nicht gefunden</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import AdminFormCard from '@/components/AdminFormCard.vue'
import ImagePickerCard from '@/components/ImagePickerCard.vue'
import AdminAddProduct from '@/components/AdminAddProduct.vue'

import {
  fetchCategoryById,
  updateCategory,
  fetchProducts,
  fetchProductVariants,
  deleteProduct
} from '@/services/api'

const route = useRoute()
const id = Number(route.params.id)

const category = ref(null)
const products = ref([])
const productsWithInfo = ref([])

const loading = ref(false)
const error = ref(null)

async function loadCategoryAndProducts() {
  loading.value = true
  error.value = null

  try {
    category.value = await fetchCategoryById(id)
    products.value = await fetchProducts({ categorySlug: category.value.slug })

    productsWithInfo.value = await Promise.all(
      products.value.map(async (p) => {
        const variants = await fetchProductVariants(p.id)

        const colorSet = new Set()
        const sizeSet = new Set()
        let minPrice = null
        let available = false

        for (const v of variants) {
          if (v.color) colorSet.add(v.color)
          if (v.size) sizeSet.add(v.size)

          if (v.price != null) {
            const priceNum = Number(v.price)
            if (!Number.isNaN(priceNum)) {
              if (minPrice === null || priceNum < minPrice) minPrice = priceNum
            }
          }

          if (Number(v.stock ?? 0) > 0) available = true
        }

        const priceLabel =
          minPrice !== null
            ? minPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
            : '–'

        return {
          ...p,
          colors: Array.from(colorSet).join(', '),
          sizes: Array.from(sizeSet).join(', '),
          priceLabel,
          availability: available ? 'verfügbar' : 'momentan nicht verfügbar'
        }
      })
    )
  } catch (e) {
    console.error(e)
    error.value = 'Kategorie oder Produkte konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function saveCategory() {
  try {
    await updateCategory(id, category.value)
    alert('Kategorie gespeichert')
    await loadCategoryAndProducts()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Speichern der Kategorie')
  }
}

async function deleteProductById(productId) {
  if (!confirm('Produkt wirklich löschen?')) return
  try {
    await deleteProduct(productId)
    await loadCategoryAndProducts()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Löschen des Produkts')
  }
}

onMounted(loadCategoryAndProducts)
</script>
