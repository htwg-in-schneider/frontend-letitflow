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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import {
  fetchCategories,
  fetchProducts,
  fetchProductVariants,
} from '@/services/api';

const route = useRoute();
const categorySlug = route.params.slug;

const categoryTitle = ref('Kategorie');
const products = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    loading.value = true;

    // 1. Kategorien laden → passenden Namen für Überschrift finden
    const categories = await fetchCategories();
    const cat = categories.find((c) => c.slug === categorySlug);
    if (cat) {
      categoryTitle.value = cat.name;
    } else {
      categoryTitle.value = 'Kategorie';
    }

    // 2. Produkte der Kategorie laden
    const backendProducts = await fetchProducts({ categorySlug });

    // 3. Für jedes Produkt Varianten holen und aggregieren
    const mappedProducts = await Promise.all(
      backendProducts.map(async (p) => {
        const variants = await fetchProductVariants(p.id);

        const colorSet = new Set();
        const sizeSet = new Set();
        let minPrice = null;
        let available = false;

        for (const v of variants) {
          if (v.color) {
            colorSet.add(v.color);
          }
          if (v.size) {
            sizeSet.add(v.size);
          }
          if (typeof v.price === 'number') {
            if (minPrice === null || v.price < minPrice) {
              minPrice = v.price;
            }
          }
          if (v.available) {
            available = true;
          }
        }

        return {
          id: p.id,
          title: p.title,
          image: p.imageUrl || '/img/placeholder.png',
          colors: Array.from(colorSet).join(', '),
          sizes: Array.from(sizeSet).join(', '),
          price:
            minPrice !== null
              ? minPrice.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                })
              : '–',
          availability: available ? 'verfügbar' : 'momentan nicht verfügbar',
        };
      })
    );

    products.value = mappedProducts;
  } catch (e) {
    console.error(e);
    error.value = 'Produkte konnten nicht geladen werden.';
  } finally {
    loading.value = false;
  }
});
</script>
