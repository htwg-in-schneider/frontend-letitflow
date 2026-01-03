<template>
  <section class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Produkt bearbeiten (Admin)</h1>

    <div v-if="loading">Lade...</div>
    <div v-else-if="product">
      <!-- Produkt-Form -->
      <form @submit.prevent="saveProduct" class="mb-8 grid gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium">Titel</label>
          <input v-model="product.title" class="border rounded px-2 py-1 w-full" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium">Beschreibung</label>
          <textarea v-model="product.description" class="border rounded px-2 py-1 w-full" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium">Bild-URL</label>
          <input v-model="product.imageUrl" class="border rounded px-2 py-1 w-full" />
        </div>
        <div class="md:col-span-2 flex justify-end">
          <button type="submit" class="px-4 py-2 border rounded">
            Produkt speichern
          </button>
        </div>
      </form>

      <!-- Varianten -->
      <h2 class="text-xl font-semibold mb-2">Varianten</h2>

      <!-- Neue Variante -->
      <form @submit.prevent="createNewVariant" class="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-sm font-medium">Größe</label>
          <input v-model="newVariant.size" class="border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Farbe</label>
          <input v-model="newVariant.color" class="border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Bestand</label>
          <input type="number" v-model.number="newVariant.stock" class="border rounded px-2 py-1 w-24" />
        </div>
        <div>
          <label class="block text-sm font-medium">Preis</label>
          <input type="number" step="0.01" v-model.number="newVariant.price" class="border rounded px-2 py-1 w-24" />
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="newVariant.available" />
          <span class="text-sm">Verfügbar</span>
        </div>
        <button type="submit" class="px-4 py-2 border rounded">
          Variante anlegen
        </button>
      </form>

      <table class="w-full border text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="border px-2 py-1">ID</th>
            <th class="border px-2 py-1">Größe</th>
            <th class="border px-2 py-1">Farbe</th>
            <th class="border px-2 py-1">Bestand</th>
            <th class="border px-2 py-1">Preis</th>
            <th class="border px-2 py-1">Verfügbar</th>
            <th class="border px-2 py-1">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in variants" :key="v.id">
            <td class="border px-2 py-1">{{ v.id }}</td>
            <td class="border px-2 py-1">
              <input v-model="v.size" class="w-full border rounded px-1 py-0.5" />
            </td>
            <td class="border px-2 py-1">
              <input v-model="v.color" class="w-full border rounded px-1 py-0.5" />
            </td>
            <td class="border px-2 py-1">
              <input type="number" v-model.number="v.stock"
                     class="w-20 border rounded px-1 py-0.5" />
            </td>
            <td class="border px-2 py-1">
              <input type="number" step="0.01" v-model.number="v.price"
                     class="w-20 border rounded px-1 py-0.5" />
            </td>
            <td class="border px-2 py-1 text-center">
              <input type="checkbox" v-model="v.available" />
            </td>
            <td class="border px-2 py-1 text-center flex gap-2 justify-center">
              <button class="underline" @click="saveVariant(v)">Speichern</button>
              <button class="text-red-600 underline" @click="deleteVariantById(v.id)">Löschen</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  fetchProductById,
  fetchProductVariants,
  updateProduct,
  createVariant,
  updateVariant,
  deleteVariant
} from '@/services/api'

const route = useRoute()
const id = Number(route.params.id)

const product = ref(null)
const variants = ref([])
const loading = ref(false)

const newVariant = ref({
  size: '',
  color: '',
  stock: 0,
  available: true,
  price: 0
})

async function loadProductAndVariants() {
  loading.value = true
  try {
    product.value = await fetchProductById(id)
    variants.value = await fetchProductVariants(id)
  } catch (e) {
    console.error(e)
    alert('Fehler beim Laden von Produkt oder Varianten')
  } finally {
    loading.value = false
  }
}

async function saveProduct() {
  try {
    await updateProduct(id, {
      title: product.value.title,
      description: product.value.description,
      imageUrl: product.value.imageUrl,
      categoryId: product.value.category?.id ?? null,
      infotext1: product.value.infotext1,
      infotext2: product.value.infotext2,
      infotext3: product.value.infotext3
    })
    alert('Produkt gespeichert')
  } catch (e) {
    console.error(e)
    alert('Fehler beim Speichern des Produkts')
  }
}

async function createNewVariant() {
  try {
    await createVariant(id, newVariant.value)
    newVariant.value = { size: '', color: '', stock: 0, available: true, price: 0 }
    await loadProductAndVariants()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Erstellen der Variante')
  }
}

async function saveVariant(v) {
  try {
    await updateVariant(v.id, {
      size: v.size,
      color: v.color,
      stock: v.stock,
      available: v.available,
      price: v.price
    })
    alert('Variante gespeichert')
  } catch (e) {
    console.error(e)
    alert('Fehler beim Speichern der Variante')
  }
}

async function deleteVariantById(variantId) {
  if (!confirm('Variante wirklich löschen?')) return
  try {
    await deleteVariant(variantId)
    await loadProductAndVariants()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Löschen der Variante')
  }
}

onMounted(loadProductAndVariants)
</script>
