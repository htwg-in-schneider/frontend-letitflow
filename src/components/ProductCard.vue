<template>
  <div class="border border-[#f0c9b8] p-4 bg-white">
    <img :src="imageSrc" :alt="title" class="w-full object-cover mb-4" />

    <h3 class="font-semibold">{{ title }}</h3>

    <p class="mt-2 text-sm">
      Farben: {{ colors }}
    </p>

    <p class="text-sm">
      Größen: {{ sizes }}
    </p>

    <p class="text-sm font-semibold">
      Preis: {{ price }}
    </p>

    <p
        v-if="availability"
        :class="availability === 'nicht verfügbar' ? 'text-red-600' : 'text-green-600'"
        class="mt-1 text-sm"
    >
      {{ availability }}
    </p>

    <button
        type="button"
        class="mt-4 inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium text-white bg-[#e09a82]"
    >
      jetzt entdecken
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  imageSrc: String,
  price: String,
  colors: String,
  sizes: String,
  availability: String
})
</script>
