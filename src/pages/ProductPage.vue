<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section
      class="w-full max-w-5xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-8"
    >
      <router-link to="/" class="text-sm text-[#e09a82] hover:underline">
        ← Zurück zur Übersicht
      </router-link>

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
        <div>
          <p class="text-sm text-gray-400 uppercase tracking-wide">
            PRODUKT
          </p>

          <h1 class="mt-2 text-2xl md:text-3xl font-semibold text-gray-900">
            {{ product.title }}
          </h1>
        </div>

        <div
          class="w-full bg-[#fff4ea] border border-orange-100 rounded-3xl px-4 py-6 md:px-6"
        >
          <div class="flex flex-col md:flex-row gap-6 md:gap-8">
            <div class="flex-1 space-y-5">
              <div>
                <p class="text-sm text-gray-600">Preis</p>
                <p class="text-3xl font-semibold text-gray-900">
                  <span v-if="displayPrice !== null">
                    {{ displayPrice.toFixed(2) }} €
                  </span>
                  <span v-else>-</span>
                </p>
              </div>

              <div>
                <label class="font-medium text-gray-800">Farben</label>
                <select
                  v-if="uniqueColors.length"
                  v-model="selectedColor"
                  class="block w-full border border-[#f6b88c] rounded-xl bg-white px-3 py-2 mt-1 text-sm md:text-base"
                >
                  <option
                    v-for="color in uniqueColors"
                    :key="color"
                    :value="color"
                  >
                    {{ color }}
                  </option>
                </select>
                <p v-else class="text-sm text-gray-400 mt-1">
                  Keine Farbvarianten verfügbar
                </p>
              </div>

              <div>
                <label class="font-medium text-gray-800">Größen</label>
                <select
                  v-if="uniqueSizes.length"
                  v-model="selectedSize"
                  class="block w-full border border-[#f6b88c] rounded-xl bg-white px-3 py-2 mt-1 text-sm md:text-base"
                >
                  <option
                    v-for="size in uniqueSizes"
                    :key="size"
                    :value="size"
                  >
                    {{ size }}
                  </option>
                </select>
                <p v-else class="text-sm text-gray-400 mt-1">
                  Keine Größenvarianten verfügbar
                </p>
              </div>

              <div>
                <label class="font-medium text-gray-800">Menge</label>
                <select
                  v-model.number="selectedQuantity"
                  class="block w-full border border-[#f6b88c] rounded-xl bg-white px-3 py-2 mt-1 text-sm md:text-base"
                >
                  <option
                    v-for="n in quantityOptions"
                    :key="n"
                    :value="n"
                  >
                    {{ n }}
                  </option>
                </select>

                <p
                  v-if="selectedVariant && selectedVariant.stock !== undefined"
                  class="text-sm text-gray-500 mt-1"
                >
                  Lagerbestand: {{ selectedVariant.stock }}
                </p>
              </div>

              <button
                @click="handleAddToCart"
                class="w-full py-3 text-sm md:text-base text-white bg-[#e09a82] hover:bg-[#d48366] rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="!selectedVariant"
              >
                In den Warenkorb
              </button>
            </div>

            <div class="flex-1 flex items-center justify-center">
              <div
                class="w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm rounded-3xl overflow-hidden border border-orange-100 bg-[#fff7f3] flex items-center justify-center"
              >
                <img
                  :src="getProductImage(product)"
                  :alt="product.title"
                  class="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Details</h2>
          <ul class="list-disc list-inside space-y-1 text-gray-700">
            <li v-if="product.description">Produktbeschreibung: {{ product.description }}</li>
            <li v-if="product.material">Material: {{ product.material }}</li>
            <li v-if="product.flow">Blutungsstärke: {{ product.flow }}</li>
            <li v-if="product.cycleLength">
              Zykluslänge: {{ product.cycleLength }}
            </li>
          </ul>
        </div>

        <div>
          <div
            class="border border-orange-200 bg-[#fff7f3] rounded-xl px-6 py-5 space-y-3"
          >
            <div>
              <button
                @click="showMaterial = !showMaterial"
                class="flex justify-between w-full font-semibold text-gray-800"
                type="button"
              >
                <span>Materialhinweis</span>
                <span>{{ showMaterial ? "▴" : "▾" }}</span>
              </button>
              <p
                v-if="showMaterial && product.infotext1"
                class="mt-1 whitespace-pre-line text-sm text-gray-700"
              >
                {{ product.infotext1 }}
              </p>
            </div>

            <div>
              <button
                @click="showApplication = !showApplication"
                class="flex justify-between w-full font-semibold text-gray-800"
                type="button"
              >
                <span>Anwendungshinweis</span>
                <span>{{ showApplication ? "▴" : "▾" }}</span>
              </button>
              <p
                v-if="showApplication && product.infotext2"
                class="mt-1 whitespace-pre-line text-sm text-gray-700"
              >
                {{ product.infotext2 }}
              </p>
            </div>

            <div>
              <button
                @click="showCare = !showCare"
                class="flex justify-between w-full font-semibold text-gray-800"
                type="button"
              >
                <span>Pflegehinweis</span>
                <span>{{ showCare ? "▴" : "▾" }}</span>
              </button>
              <p
                v-if="showCare && product.infotext3"
                class="mt-1 whitespace-pre-line text-sm text-gray-700"
              >
                {{ product.infotext3 }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchProductById, fetchProductVariants } from "@/services/api";
import { useCartStore } from "@/stores/cartStores"; // NEU: Import des Pinia Stores
import { getProductImage } from "@/utils/productUtils";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore(); // NEU: Store nutzen

const productId = route.params.id;

const product = ref(null);
const variants = ref([]);
const loading = ref(true);
const error = ref(null);

const selectedColor = ref("");
const selectedSize = ref("");
const selectedQuantity = ref(1);

const showMaterial = ref(false);
const showApplication = ref(false);
const showCare = ref(false);

const uniqueColors = computed(() => {
  const s = new Set();
  variants.value.forEach((v) => v.color && s.add(v.color));
  return Array.from(s);
});

const uniqueSizes = computed(() => {
  const s = new Set();
  variants.value.forEach((v) => v.size && s.add(v.size));
  return Array.from(s);
});

const selectedVariant = computed(() =>
  variants.value.find(
    (v) =>
      (!selectedColor.value || v.color === selectedColor.value) &&
      (!selectedSize.value || v.size === selectedSize.value)
  )
);

const maxQuantity = computed(() => {
  if (selectedVariant.value && typeof selectedVariant.value.stock === "number") {
    return Math.min(selectedVariant.value.stock, 10);
  }
  return 10;
});

const quantityOptions = computed(() =>
  Array.from({ length: maxQuantity.value }, (_, i) => i + 1)
);

const displayPrice = computed(() => {
  if (selectedVariant.value && selectedVariant.value.price != null) {
    return Number(selectedVariant.value.price);
  }
  if (product.value && product.value.price != null) {
    return Number(product.value.price);
  }
  const variantPrices = variants.value
    .map((v) => v.price)
    .filter((p) => p != null)
    .map(Number);
  if (variantPrices.length) {
    return Math.min(...variantPrices);
  }
  return null;
});

// GEÄNDERT: Nutzt jetzt die addItem Action aus dem Pinia Store
const handleAddToCart = async () => {
  if (!selectedVariant.value || !product.value) return;

  const itemToAdd = {
    productId: product.value.id,
    variantId: selectedVariant.value.id,
    title: product.value.title,
    color: selectedColor.value,
    size: selectedSize.value,
    quantity: selectedQuantity.value,
    price: displayPrice.value,
    imageUrl: product.value.imageUrl
  };

  // Die gesamte Logik (API vs LocalStorage) passiert im Store!
  await cartStore.addItem(itemToAdd);
  
  // Navigation zur Warenkorb-Seite
  router.push("/cartView");
};

const loadData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const [p, v] = await Promise.all([
      fetchProductById(productId),
      fetchProductVariants(productId),
    ]);

    product.value = p;
    variants.value = Array.isArray(v) ? v : [];

    if (uniqueColors.value.length) {
      selectedColor.value = uniqueColors.value[0];
    }
    if (uniqueSizes.value.length) {
      selectedSize.value = uniqueSizes.value[0];
    }
  } catch (e) {
    console.error("Fehler beim Laden des Produkts:", e);
    error.value = "Produkt konnte nicht geladen werden.";
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>