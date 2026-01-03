<template>
  <section class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Kategorie bearbeiten (Admin)</h1>

    <div v-if="loading">Lade...</div>

    <div v-else-if="error" class="text-red-600 mb-4">
      {{ error }}
    </div>

    <div v-else-if="category">
     
      <form @submit.prevent="saveCategory" class="mb-10">
        <div class="border border-[#f0c9b8] bg-white rounded-md shadow-sm">
          <div class="flex flex-col md:flex-row gap-4 p-4">
           
            <div class="w-full md:w-[320px]">
              <input
                ref="categoryImageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onCategoryImageSelected"
              />

              <div
                class="w-full aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-md overflow-hidden border border-[#f0c9b8]"
              >
                <img
                  v-if="categoryPreviewImage"
                  :src="categoryPreviewImage"
                  :alt="category.name || 'Kategorie Bild'"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-xs text-gray-500 text-center px-4">
                  Kein Bild vorhanden
                </div>
              </div>

              <div class="mt-3 flex gap-2">
                <button
                  type="button"
                  class="flex-1 rounded-full px-3 py-2 text-xs font-medium text-white bg-[#e09a82]"
                  @click="triggerCategoryImagePicker"
                >
                  Bild ändern
                </button>

                <button
                  type="button"
                  class="flex-1 rounded-full px-3 py-2 text-xs font-medium text-white bg-red-500 disabled:opacity-60"
                  :disabled="!categoryPreviewImage"
                  @click="removeCategoryImage"
                >
                  Bild löschen
                </button>
              </div>
            </div>

            
            <div class="flex-1 flex flex-col gap-3">
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

              <div class="mt-2 flex justify-between gap-2">
                <router-link
                  to="/admin/categories"
                  class="px-4 py-2 border rounded"
                >
                  Zurück
                </router-link>

                <button
                  type="submit"
                  class="rounded-full px-4 py-2 text-xs font-medium text-white bg-[#e09a82]"
                >
                  Kategorie speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

   
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Produkte</h2>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      
        <div
          class="border border-dashed border-[#f0c9b8] bg-white rounded-md shadow-sm flex flex-col overflow-hidden"
        >
          <label class="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="onNewProductImageSelected"
            />
            <div class="aspect-[4/3] bg-gray-50 flex items-center justify-center">
              <img
                v-if="newProduct.imageUrl"
                :src="newProduct.imageUrl"
                class="w-full h-full object-cover"
                alt="Neues Produkt Bild"
              />
              <div v-else class="text-xs text-gray-500 text-center px-4">
                Produktbild auswählen
              </div>
            </div>
          </label>

          <div class="p-4 flex flex-col gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Produkttitel
              </label>
              <input
                v-model="newProduct.title"
                placeholder="Produkttitel"
                class="border rounded px-2 py-1 font-semibold w-full"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Beschreibung
              </label>
              <textarea
                v-model="newProduct.description"
                rows="2"
                placeholder="Beschreibung"
                class="border rounded px-2 py-1 text-sm w-full"
              />
            </div>

           
            <div class="border rounded-md p-3 bg-[#fff7f3] border-[#f0c9b8]">
              <p class="text-xs font-semibold mb-2 text-gray-700">
                Erste Variante (Pflicht)
              </p>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Größe</label>
                  <input
                    v-model="newVariant.size"
                    placeholder="z. B. S"
                    class="border rounded px-2 py-1 text-sm w-full"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Farbe</label>
                  <input
                    v-model="newVariant.color"
                    placeholder="z. B. Blau"
                    class="border rounded px-2 py-1 text-sm w-full"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Bestand</label>
                  <input
                    type="number"
                    v-model.number="newVariant.stock"
                    min="0"
                    class="border rounded px-2 py-1 text-sm w-full"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Preis (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    v-model.number="newVariant.price"
                    min="0"
                    class="border rounded px-2 py-1 text-sm w-full"
                  />
                </div>
              </div>

              <label class="mt-2 flex items-center gap-2 text-xs text-gray-700">
                <input type="checkbox" v-model="newVariant.available" />
                Verfügbar
              </label>

              <p v-if="createError" class="mt-2 text-xs text-red-600">
                {{ createError }}
              </p>
            </div>

            <button
              type="button"
              class="rounded-full px-4 py-2 text-xs font-medium text-white bg-[#e09a82] disabled:opacity-60"
              :disabled="creating || !newProduct.title"
              @click="handleCreateProduct"
            >
              {{ creating ? 'Speichere…' : 'Produkt + Variante speichern' }}
            </button>
          </div>
        </div>

      
        <div
          v-for="p in productsWithInfo"
          :key="p.id"
          class="border border-[#f0c9b8] bg-white rounded-md shadow-sm flex flex-col overflow-hidden"
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
                <p>
                  <span class="font-semibold">Farben:</span>
                  <span class="font-normal">{{ p.colors || '—' }}</span>
                </p>
                <p>
                  <span class="font-semibold">Größen:</span>
                  <span class="font-normal">{{ p.sizes || '—' }}</span>
                </p>
                <p>
                  <span class="font-semibold">Preis:</span>
                  <span class="font-normal">{{ p.priceLabel }}</span>
                </p>
                <p>
                  <span class="font-semibold">Status:</span>
                  <span class="font-normal">{{ p.availability }}</span>
                </p>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  fetchCategoryById,
  updateCategory,
  fetchProducts,
  fetchProductVariants,
  createProduct,
  createVariant,
  deleteProduct
} from '@/services/api'

const route = useRoute()
const id = Number(route.params.id)

const category = ref(null)
const products = ref([])
const productsWithInfo = ref([])

const loading = ref(false)
const error = ref(null)

const categoryImageInput = ref(null)

const creating = ref(false)
const createError = ref(null)

const newProduct = ref({
  title: '',
  description: '',
  imageUrl: '',
  infotext1: '',
  infotext2: '',
  infotext3: ''
})

const newVariant = ref({
  size: '',
  color: '',
  stock: 0,
  available: true,
  price: 0
})

const categoryPreviewImage = computed(() => category.value?.imageUrl || '')

function triggerCategoryImagePicker() {
  categoryImageInput.value?.click()
}

function removeCategoryImage() {
  if (!confirm('Bild wirklich löschen?')) return
  category.value.imageUrl = ''
  if (categoryImageInput.value) categoryImageInput.value.value = ''
}

function onCategoryImageSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => (category.value.imageUrl = reader.result)
  reader.readAsDataURL(file)
}

function onNewProductImageSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => (newProduct.value.imageUrl = reader.result)
  reader.readAsDataURL(file)
}

function validateCreate() {
  if (!newProduct.value.title) return 'Titel darf nicht leer sein.'

  const stockOk = typeof newVariant.value.stock === 'number' && newVariant.value.stock >= 0
  const priceOk = typeof newVariant.value.price === 'number' && newVariant.value.price >= 0

  if (!stockOk) return 'Bitte einen gültigen Bestand (>= 0) angeben.'
  if (!priceOk) return 'Bitte einen gültigen Preis (>= 0) angeben.'
  return null
}

function resetCreateForm() {
  newProduct.value = {
    title: '',
    description: '',
    imageUrl: '',
    infotext1: '',
    infotext2: '',
    infotext3: ''
  }
  newVariant.value = {
    size: '',
    color: '',
    stock: 0,
    available: true,
    price: 0
  }
  createError.value = null
}

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

async function handleCreateProduct() {
  createError.value = validateCreate()
  if (createError.value) return

  creating.value = true
  try {
    const created = await createProduct({
      ...newProduct.value,
      categoryId: category.value.id
    })

    const productId = created?.id ?? created
    await createVariant(productId, { ...newVariant.value })

    resetCreateForm()
    await loadCategoryAndProducts()
    alert('Produkt und Variante wurden erstellt.')
  } catch (e) {
    console.error(e)
    createError.value = 'Fehler beim Erstellen des Produkts oder der Variante.'
  } finally {
    creating.value = false
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
