<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section class="w-full max-w-5xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-10">
      <h1 class="text-2xl font-semibold mb-6">
        {{ categoryTitle }}
      </h1>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProductCard
            v-for="(product, index) in products"
            :key="index"
            :title="product.title"
            :image-src="product.image"
            :price="product.price"
            :colors="product.colors"
            :sizes="product.sizes"
            :availability="product.availability"
            :product-id="product.id"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const id = route.params.id

const categoryMap = {
  'menstruationsscheiben-und-tassen': {
    title: 'Menstruationsscheiben und Tassen',
    products: [
      {
        id: 'luna-queen',
        title: 'Luna Queen',
        image: '/img/menstruationsscheiben_und_tassen.png',
        price: '20,00€',
        colors: 'rot, blau, lila, gelb, grün, orange',
        sizes: 'S, M, L',
        availability: 'verfügbar'
      },
      {
        id: 'moon-tasse',
        title: 'Moon Tasse',
        image: '/img/menstruationsscheiben_und_tassen.png',
        price: '12,00€',
        colors: 'rot, blau, lila, gelb, grün, orange',
        sizes: 'S, M, L',
        availability: 'nicht verfügbar'
      }
    ]
  }
}

const categoryTitle = categoryMap[id]?.title || 'Kategorie'
const products = categoryMap[id]?.products || []
</script>
