<template>
  <section class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">
      Kategorie bearbeiten (Admin)
    </h1>

    <!-- Ladezustand -->
    <div v-if="loading">Lade...</div>

    <!-- Fehleranzeige -->
    <div v-else-if="error" class="text-red-600 mb-4">
      {{ error }}
    </div>

    <!-- Inhalt nur anzeigen, wenn Kategorie geladen ist -->
    <div v-else-if="category">
      <!-- Kategorie-Formular -->
      <form
        @submit.prevent="saveCategory"
        class="mb-8 grid gap-4 md:grid-cols-2"
      >
        <div>
          <label class="block text-sm font-medium">Name</label>
          <input
            v-model="category.name"
            class="border rounded px-2 py-1 w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Slug</label>
          <input
            v-model="category.slug"
            class="border rounded px-2 py-1 w-full"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium">Beschreibung</label>
          <textarea
            v-model="category.description"
            class="border rounded px-2 py-1 w-full"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium">Bild-URL</label>
          <input
            v-model="category.imageUrl"
            class="border rounded px-2 py-1 w-full"
          />
        </div>

        <div class="md:col-span-2 flex justify-between gap-2">
          <router-link
            to="/admin/categories"
            class="px-4 py-2 border rounded"
          >
            Zurück zur Übersicht
          </router-link>

          <button type="submit" class="px-4 py-2 border rounded">
            Kategorie speichern
          </button>
        </div>
      </form>

      <!-- Produkte dieser Kategorie -->
      <h2 class="text-xl font-semibold mb-2">Produkte in dieser Kategorie</h2>

      <!-- Neues Produkt -->
      <form
        @submit.prevent="createNewProduct"
        class="mb-4 flex flex-wrap gap-4 items-end"
      >
        <div>
          <label class="block text-sm font-medium">Titel</label>
          <input
            v-model="newProduct.title"
            class="border rounded px-2 py-1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Bild-URL</label>
          <input
            v-model="newProduct.imageUrl"
            class="border rounded px-2 py-1"
          />
        </div>

        <button type="submit" class="px-4 py-2 border rounded">
          Produkt anlegen
        </button>
      </form>

      <!-- Produktliste -->
      <table class="w-full border text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="border px-2 py-1 text-left">ID</th>
            <th class="border px-2 py-1 text-left">Titel</th>
            <th class="border px-2 py-1">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td class="border px-2 py-1">{{ p.id }}</td>
            <td class="border px-2 py-1">
              <router-link
                :to="{ name: 'AdminProductDetail', params: { id: p.id } }"
                class="text-blue-600 underline"
              >
                {{ p.title }}
              </router-link>
            </td>
            <td class="border px-2 py-1 text-center">
              <button
                class="text-red-600 underline"
                @click="deleteProductById(p.id)"
              >
                Löschen
              </button>
            </td>
          </tr>

          <tr v-if="products.length === 0">
            <td
              colspan="3"
              class="border px-2 py-4 text-center text-gray-500"
            >
              Noch keine Produkte in dieser Kategorie.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Falls category aus irgendeinem Grund nicht geladen wurde -->
    <div v-else class="text-red-600">
      Kategorie wurde nicht gefunden.
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  fetchCategoryById,
  updateCategory,
  fetchProducts,
  createProduct,
  deleteProduct
} from '@/services/api'

const route = useRoute()
const id = Number(route.params.id)

const category = ref(null)
const products = ref([])
const loading = ref(false)
const error = ref(null)

const newProduct = ref({
  title: '',
  description: '',
  imageUrl: '',
  infotext1: '',
  infotext2: '',
  infotext3: ''
})

async function loadCategoryAndProducts() {
  loading.value = true
  error.value = null
  try {
    // Kategorie laden
    category.value = await fetchCategoryById(id)

    // Produkte nach categorySlug filtern
    products.value = await fetchProducts({ categorySlug: category.value.slug })
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

    // Falls sich der Slug ändert, Produkte neu laden
    await loadCategoryAndProducts()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Speichern der Kategorie')
  }
}

async function createNewProduct() {
  if (!newProduct.value.title) {
    alert('Titel darf nicht leer sein')
    return
  }

  try {
    await createProduct({
      ...newProduct.value,
      categoryId: category.value.id
    })

    newProduct.value = {
      title: '',
      description: '',
      imageUrl: '',
      infotext1: '',
      infotext2: '',
      infotext3: ''
    }

    await loadCategoryAndProducts()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Anlegen des Produkts')
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
