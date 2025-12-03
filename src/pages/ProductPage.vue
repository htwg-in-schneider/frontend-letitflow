<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section
      class="w-full max-w-5xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-8"
    >
      <router-link to="/" class="text-sm text-[#e09a82] hover:underline">
        ← Zurück zur Übersicht
      </router-link>

      <!-- LADESCREEN -->
      <div v-if="loading" class="mt-6 text-gray-500">
        Produkt wird geladen...
      </div>

      <div v-else-if="error" class="mt-6 text-red-500">
        {{ error }}
      </div>

      <div v-else-if="!product" class="mt-6 text-gray-500">
        Produkt nicht gefunden.
      </div>

      <div v-else class="mt-6 space-y-10">

        <!-- PRODUKTÜBERSCHRIFT -->
        <div>
          <p class="text-sm text-gray-400 uppercase tracking-wide">
            PRODUKT
          </p>

          <h1 class="mt-2 text-2xl font-semibold text-gray-900">
            {{ product.name }}
          </h1>
        </div>

        <!-- ⭐⭐⭐ VOLLBREITER BLOCK (Preis / Dropdowns / Bild) ⭐⭐⭐ -->
        <div
          class="w-full bg-[#fff4ea] border border-orange-100 rounded-3xl px-6 py-6"
        >
          <div class="flex flex-col md:flex-row gap-6">

            <!-- LINKER TEIL: PREIS + DROPDOWNS -->
            <div class="flex-1 space-y-5">
              <div>
                <p class="text-sm text-gray-600">Preis</p>
                <p class="text-3xl font-semibold text-gray-900">
                  {{ displayPrice?.toFixed(2) }} €
                </p>
              </div>

              <div>
                <label class="font-medium text-gray-800">Farben</label>
                <select
                  v-model="selectedColor"
                  class="block w-full border border-[#f6b88c] rounded-xl bg-white px-3 py-2 mt-1"
                >
                  <option v-for="c in uniqueColors" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div>
                <label class="font-medium text-gray-800">Größen</label>
                <select
                  v-model="selectedSize"
                  class="block w-full border border-[#f6b88c] rounded-xl bg-white px-3 py-2 mt-1"
                >
                  <option v-for="s in uniqueSizes" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>

              <div>
                <label class="font-medium text-gray-800">Menge</label>
                <select
                  v-model.number="selectedQuantity"
                  class="block w-full border border-[#f6b88c] rounded-xl bg-white px-3 py-2 mt-1"
                >
                  <option
                    v-for="n in quantityOptions"
                    :key="n"
                    :value="n"
                  >{{ n }}</option>
                </select>

                <p v-if="selectedVariant?.stock" class="text-sm text-gray-500 mt-1">
                  Lagerbestand: {{ selectedVariant.stock }}
                </p>
              </div>

              <button
                class="w-full py-3 text-white bg-[#e09a82] hover:bg-[#d48366] rounded-2xl transition disabled:opacity-40"
                :disabled="!selectedVariant"
              >
                In den Warenkorb
              </button>
            </div>

            <!-- RECHTER TEIL: BILD -->
            <div class="flex-1 rounded-3xl overflow-hidden border border-orange-100">
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.name"
                class="w-full h-full object-cover"
              />

              <div
                v-else
                class="w-full h-full min-h-[15rem] bg-[#fff7f3] flex items-center justify-center"
              >
                Kein Bild vorhanden
              </div>
            </div>
          </div>
        </div>

        <!-- BESCHREIBUNG & DETAILS -->
        <div>
          <p
            v-if="product.shortDescription"
            class="text-gray-800"
          >
            {{ product.shortDescription }}
          </p>

          <p
            v-else-if="product.description"
            class="text-gray-800 whitespace-pre-line"
          >
            {{ product.description }}
          </p>

          <div class="mt-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Details</h2>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
              <li v-if="product.size">Größe: {{ product.size }}</li>
              <li v-if="product.color">Farbe: {{ product.color }}</li>
              <li v-if="product.material">Material: {{ product.material }}</li>
              <li v-if="product.flow">Blutungsstärke: {{ product.flow }}</li>
              <li v-if="product.cycleLength">
                Zykluslänge: {{ product.cycleLength }}
              </li>
            </ul>
          </div>
        </div>

        <!-- UNTERER INFOBLOCK (bleibt unverändert) -->
        <div>
          <div
            class="border border-orange-200 bg-[#fff7f3] rounded-xl px-6 py-5 space-y-3"
          >
            <p class="text-sm font-semibold text-gray-800">
              Farben: <span class="font-normal">{{ uniqueColors.join(', ') }}</span>
            </p>

            <p class="text-sm font-semibold text-gray-800">
              Größen: <span class="font-normal">{{ uniqueSizes.join(', ') }}</span>
            </p>

            <p class="text-sm font-semibold text-gray-800">
              Preis:
              <span class="font-normal">
                ab {{ displayPrice?.toFixed(2) }} €
              </span>
            </p>

            <!-- Accordion -->
            <div class="space-y-3 pt-3">
              <div>
                <button
                  @click="showMaterial = !showMaterial"
                  class="flex justify-between w-full font-semibold"
                >
                  <span>Materialhinweis</span>
                  <span>{{ showMaterial ? "▴" : "▾" }}</span>
                </button>
                <p v-if="showMaterial" class="mt-1 whitespace-pre-line">
                  {{ product.text1 }}
                </p>
              </div>

              <div>
                <button
                  @click="showApplication = !showApplication"
                  class="flex justify-between w-full font-semibold"
                >
                  <span>Anwendungshinweis</span>
                  <span>{{ showApplication ? "▴" : "▾" }}</span>
                </button>
                <p v-if="showApplication" class="mt-1 whitespace-pre-line">
                  {{ product.text2 }}
                </p>
              </div>

              <div>
                <button
                  @click="showCare = !showCare"
                  class="flex justify-between w-full font-semibold"
                >
                  <span>Pflegehinweis</span>
                  <span>{{ showCare ? "▴" : "▾" }}</span>
                </button>
                <p v-if="showCare" class="mt-1 whitespace-pre-line">
                  {{ product.text3 }}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchProductById, fetchProductVariants } from "@/services/api";

const route = useRoute();
const productId = route.params.id;

const product = ref(null);
const variants = ref([]);
const loading = ref(true);
const error = ref(null);

// Auswahl
const selectedColor = ref("");
const selectedSize = ref("");
const selectedQuantity = ref(1);

// Accordion
const showMaterial = ref(false);
const showApplication = ref(false);
const showCare = ref(false);

const uniqueColors = computed(() => {
  const s = new Set();
  variants.value.forEach((v) => v.color && s.add(v.color));
  return [...s];
});

const uniqueSizes = computed(() => {
  const s = new Set();
  variants.value.forEach((v) => v.size && s.add(v.size));
  return [...s];
});

const selectedVariant = computed(() =>
  variants.value.find(
    (v) =>
      (!selectedColor.value || v.color === selectedColor.value) &&
      (!selectedSize.value || v.size === selectedSize.value)
  )
);

const maxQuantity = computed(() =>
  selectedVariant.value?.stock
    ? Math.min(selectedVariant.value.stock, 10)
    : 10
);

const quantityOptions = computed(() =>
  Array.from({ length: maxQuantity.value }, (_, i) => i + 1)
);

const displayPrice = computed(() => {
  if (selectedVariant.value?.price != null)
    return Number(selectedVariant.value.price);
  if (product.value?.price != null)
    return Number(product.value.price);

  const prices = variants.value
    .filter((v) => v.price != null)
    .map((v) => Number(v.price));
  if (prices.length) return Math.min(...prices);
  return null;
});

onMounted(async () => {
  try {
    const [p, v] = await Promise.all([
      fetchProductById(productId),
      fetchProductVariants(productId),
    ]);
    product.value = p;
    variants.value = v;

    selectedColor.value = uniqueColors.value[0] || "";
    selectedSize.value = uniqueSizes.value[0] || "";
  } catch (e) {
    error.value = "Fehler beim Laden.";
  } finally {
    loading.value = false;
  }
});
</script>
