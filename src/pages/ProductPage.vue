<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section class="w-full max-w-4xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-10 space-y-8">
      <div>
        <p class="text-sm text-gray-700">{{ product.type }}</p>
        <h1 class="text-2xl font-semibold text-gray-900 mt-1">
          {{ product.name }}
        </h1>
      </div>

      <div class="grid gap-6 md:grid-cols-[1.5fr_1fr] items-start">
        <div>
          <img
              :src="product.image"
              :alt="product.name"
              class="w-full object-cover"
          />
        </div>

        <div class="space-y-4">
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between gap-4">
              <span class="font-medium">Farben:</span>
              <select class="border border-gray-300 px-2 py-1 text-sm">
                <option v-for="color in product.colorOptions" :key="color">
                  {{ color }}
                </option>
              </select>
            </div>

            <div class="flex items-center justify-between gap-4">
              <span class="font-medium">Größen:</span>
              <select class="border border-gray-300 px-2 py-1 text-sm">
                <option v-for="size in product.sizeOptions" :key="size">
                  {{ size }}
                </option>
              </select>
            </div>

            <div class="flex items-center justify-between gap-4">
              <span class="font-medium">Menge:</span>
              <select class="border border-gray-300 px-2 py-1 text-sm">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
          </div>

          <button
              type="button"
              class="w-full md:w-auto mt-2 inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white bg-[#e09a82] hover:bg-[#d48366] transition"
          >
            in den Warenkorb
          </button>
        </div>
      </div>

      <div class="border border-[#f0c9b8] px-4 py-4 text-sm space-y-2">
        <p>Farben: {{ product.colors }}</p>
        <p>Größen: {{ product.sizes }}</p>
        <p>Preis: {{ product.price }}</p>

        <div class="mt-4 space-y-2">
          <p class="font-medium">Material:</p>
          <p>{{ product.material }}</p>

          <p class="font-medium mt-3">Pflegehinweis:</p>
          <p>{{ product.careHint }}</p>

          <p class="font-medium mt-3">Anwendungshinweis:</p>
          <p>{{ product.usageHint }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = route.params.id

const products = {
  'luna-queen': {
    name: 'Luna Queen',
    type: 'Menstruationsscheibe',
    image: '/img/menstruationsscheiben_und_tassen.png',
    price: '20,00€',
    colors: 'rot, blau, lila, gelb, grün, orange',
    sizes: 'S, M, L',
    colorOptions: ['rot', 'blau', 'lila', 'gelb', 'grün', 'orange'],
    sizeOptions: ['S', 'M', 'L'],
    material: 'Hier steht später der Material-Text.',
    careHint: 'Hier steht später der Pflegehinweis.',
    usageHint: 'Hier steht später der Anwendungshinweis.'
  },


  'moon-tasse': {
    name: 'Moon Tasse',
    type: 'Menstruationstasse',
    image: '/img/menstruationsscheiben_und_tassen.png',
    price: '12,00€',
    colors: 'rot, blau, lila, gelb, grün, orange',
    sizes: 'S, M, L',
    colorOptions: ['rot', 'blau', 'lila', 'gelb', 'grün', 'orange'],
    sizeOptions: ['S', 'M', 'L'],
    material: 'Material-Info für Moon Tasse.',
    careHint: 'Pflegehinweis für Moon Tasse.',
    usageHint: 'Anwendungshinweis für Moon Tasse.'
  }
}

const product = products[productId] ?? {
  name: 'Unbekanntes Produkt',
  type: '',
  image: '/img/menstruationsscheiben_und_tassen.png',
  price: '-',
  colors: '',
  sizes: '',
  colorOptions: [],
  sizeOptions: [],
  material: '',
  careHint: '',
  usageHint: ''
}
</script>
