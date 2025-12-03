<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section class="w-full max-w-4xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-8">
      <router-link
        to="/"
        class="text-sm text-[#e09a82] hover:underline"
      >
        ← Zurück zur Übersicht
      </router-link>

      <!-- Ladezustand -->
      <div v-if="loading" class="mt-6 text-gray-500">
        Produkt wird geladen...
      </div>

      <!-- Fehlermeldung -->
      <div v-else-if="error" class="mt-6 text-red-500">
        {{ error }}
      </div>

      <!-- Kein Produkt gefunden -->
      <div v-else-if="!product" class="mt-6 text-gray-500">
        Es konnte kein Produkt gefunden werden.
      </div>

      <!-- Produktinhalt -->
      <div v-else class="mt-6 grid gap-8 md:grid-cols-[2fr,1fr] items-start">
        <!-- Linke Spalte: Infos -->
        <div>
          <p class="text-sm text-gray-400 uppercase tracking-wide">
            Produkt
          </p>

          <h1 class="mt-2 text-2xl font-semibold text-gray-900">
            {{ product.name }}
          </h1>

          <p v-if="product.brand" class="mt-1 text-sm text-gray-500">
            Marke: {{ product.brand }}
          </p>

          <p v-if="product.shortDescription" class="mt-4 text-gray-800">
            {{ product.shortDescription }}
          </p>

          <p v-else-if="product.description" class="mt-4 text-gray-800 whitespace-pre-line">
            {{ product.description }}
          </p>

          <div class="mt-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">
              Details
            </h2>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
              <li v-if="product.size">Größe: {{ product.size }}</li>
              <li v-if="product.color">Farbe: {{ product.color }}</li>
              <li v-if="product.material">Material: {{ product.material }}</li>
              <li v-if="product.flow">Blutungsstärke: {{ product.flow }}</li>
              <li v-if="product.cycleLength">Zykluslänge: {{ product.cycleLength }}</li>
            </ul>
          </div>

          <!-- Varianten -->
          <div class="mt-8" v-if="variants && variants.length">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">
              Varianten
            </h2>
            <ul class="space-y-2">
              <li
                v-for="variant in variants"
                :key="variant.id"
                class="flex items-center justify-between border border-orange-100 rounded-lg px-3 py-2"
              >
                <div>
                  <p class="font-medium text-gray-900">
                    {{ variant.name || 'Variante ' + variant.id }}
                  </p>
                  <p v-if="variant.description" class="text-sm text-gray-600">
                    {{ variant.description }}
                  </p>
                </div>
                <div class="text-right">
                  <p v-if="variant.price" class="font-semibold text-gray-900">
                    {{ variant.price.toFixed ? variant.price.toFixed(2) : variant.price }} €
                  </p>
                  <p v-if="variant.stock !== undefined" class="text-xs text-gray-500">
                    Lager: {{ variant.stock }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Rechte Spalte: Bild & Preis -->
        <aside class="space-y-4">
          <div class="border border-orange-100 rounded-xl overflow-hidden">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-64 object-cover"
            />
            <div
              v-else
              class="w-full h-64 flex items-center justify-center text-gray-400 text-sm bg-[#fff7f3]"
            >
              Kein Bild vorhanden
            </div>
          </div>

          <div class="border border-orange-100 rounded-xl px-4 py-4 space-y-2">
            <p class="text-sm text-gray-500">
              Preis
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              <span v-if="product.price !== undefined">
                {{ product.price.toFixed ? product.price.toFixed(2) : product.price }} €
              </span>
              <span v-else>
                Preis auf Anfrage
              </span>
            </p>
            <button
              type="button"
              class="mt-2 w-full inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white bg-[#e09a82] hover:bg-[#d48366] transition"
            >
              In den Warenkorb
            </button>
          </div>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProductById, fetchProductVariants } from '@/services/api'

const route = useRoute()

// Versuche mehrere mögliche Parameternamen, damit es mit verschiedenen Router-Configs klappt
const productId = route.params.id || route.params.productId

const product = ref(null)
const variants = ref([])
const loading = ref(true)
const error = ref(null)

const loadData = async () => {
  loading.value = true
  error.value = null

  if (!productId) {
    error.value = 'Keine Produkt-ID in der URL gefunden.'
    loading.value = false
    return
  }

  try {
    const [productResult, variantsResult] = await Promise.all([
      fetchProductById(productId),
      fetchProductVariants(productId)
    ])

    product.value = productResult
    variants.value = Array.isArray(variantsResult) ? variantsResult : []
  } catch (err) {
    console.error('Fehler beim Laden des Produkts oder der Varianten:', err)
    error.value = 'Produkt konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
