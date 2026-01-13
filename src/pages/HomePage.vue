<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section class="w-full max-w-5xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-10">
      <p class="text-sm text-gray-500 uppercase tracking-wide">
        Produkte
      </p>

      <h1 class="mt-2 text-3xl font-semibold text-gray-900">
        LetItFlow
      </h1>

      <div class="mt-8">
        <img
            src="/img/produktuebersicht.png"
            alt="Produktübersicht"
            class="w-full object-cover"
        />
      </div>

      <div class="space-y-4 mt-6">
        <p class="text-lg text-gray-800">
          Produkte, die wirklich zu Dir passen –
          <span class="font-semibold">ehrlich</span>,
          <span class="font-semibold">alltagstauglich</span> und
          <span class="font-semibold">einfach gut</span>.
        </p>

        <p class="text-lg text-gray-800">
          Ohne Schnickschnack, dafür mit ganz viel
          <span class="font-semibold">Sinn für Dich</span>.
        </p>
      </div>

      <div class="mt-8">
        <RouterLink
            :to="{ name: 'AboutUs' }"
            class="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white bg-[#e09a82] hover:bg-[#d48366] transition"
        >
          Erfahre mehr über uns hier
        </RouterLink>
      </div>

      <section class="mt-12">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          Welche Produkte kennst du bereits?
        </h2>

        <div v-if="loading" class="mt-4 text-gray-500">
          Kategorien werden geladen...
        </div>

        <p v-else-if="error" class="mt-4 text-red-500">
          {{ error }}
        </p>

        <div v-else class="grid gap-6 md:grid-cols-3">
          <CategoryCard
              v-for="category in categories"
              :key="category.id"
              :title="category.name"
              :image-src="category.imageUrl"
              :link="category.slug"
          />
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import CategoryCard from '@/components/CategoryCard.vue'
import { fetchCategories } from '@/services/api'

const categories = ref([])
const loading = ref(true)
const error = ref(null)

// Kategorien aus dem Backend laden
onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const backendCategories = await fetchCategories()
    categories.value = (backendCategories || [])
        .map((c) => ({
          ...c,
          slug: c.slug ?? c.id,
        }))
        .sort((a, b) =>
            (a.name || '').localeCompare(b.name || '', 'de')
        )
  } catch (e) {
    console.error('Fehler beim Laden der Kategorien:', e)
    error.value = 'Kategorien konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
})
</script>
