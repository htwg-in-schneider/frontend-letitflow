<template>
  <section class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Produkt bearbeiten (Admin)</h1>

    <div v-if="loading">Lade...</div>

    <div v-else-if="product">
      <form @submit.prevent="saveProduct" class="mb-10">
        <AdminFormCard>
          <template #left>
            <ImagePickerCard
              v-model="product.imageUrl"
              :alt="product.title || 'Produkt Bild'"
            />
          </template>

          <template #fields>
            <AdminProductFields v-model="product" />

            <p class="text-xs text-gray-500">
              ID: <span class="font-mono">{{ product.id }}</span>
            </p>
          </template>

          <template #leftActions>
            <router-link to="/admin/categories" class="px-4 py-2 border rounded">
              Zurück zu Kategorien
            </router-link>
          </template>

          <template #rightActions>
            <button
              type="submit"
              class="rounded-full px-4 py-2 text-xs font-medium text-white bg-[#e09a82]"
            >
              Produkt speichern
            </button>
          </template>
        </AdminFormCard>
      </form>

      <AdminVariantCard
        :variants="variants"
        :busy="variantBusy"
        @save="saveVariant"
        @delete="deleteVariantById"
      />
    </div>

    <div v-else class="text-red-600">Produkt nicht gefunden</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import AdminFormCard from '@/components/AdminFormCard.vue'
import ImagePickerCard from '@/components/ImagePickerCard.vue'
import AdminVariantCard from '@/components/AdminVariantCard.vue'
import AdminProductFields from '@/components/AdminProductFields.vue'

import {
  fetchProductById,
  fetchProductVariants,
  updateProduct,
  updateVariant,
  deleteVariant
} from '@/services/api'

const route = useRoute()
const id = Number(route.params.id)

const product = ref(null)
const variants = ref([])
const loading = ref(false)
const variantBusy = ref(false)

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

async function saveVariant(v) {
  variantBusy.value = true
  try {
    await updateVariant(v.id, {
      size: v.size,
      color: v.color,
      stock: v.stock,
      available: Number(v.stock) > 0,
      price: v.price
    })
    alert('Variante gespeichert')
    await loadProductAndVariants()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Speichern der Variante')
  } finally {
    variantBusy.value = false
  }
}

async function deleteVariantById(variantId) {
  variantBusy.value = true
  try {
    await deleteVariant(variantId)
    await loadProductAndVariants()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Löschen der Variante')
  } finally {
    variantBusy.value = false
  }
}

onMounted(loadProductAndVariants)
</script>
