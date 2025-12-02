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
        <button
            type="button"
            class="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white bg-[#e09a82] hover:bg-[#d48366] transition"
        >
          Erfahre mehr über uns hier
        </button>
      </div>

      <section class="mt-12">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          Welche Produkte kennst du bereits?
        </h2>

        <div class="grid gap-6 md:grid-cols-3">
          <CategoryCard
              title="Menstruationsscheiben und Tassen"
              image-src="/img/menstruationsscheiben_und_tassen.png"
              link="menstruationsscheiben-und-tassen"
          />

          <CategoryCard
              title="Menstruationsschwämme und Soft-Tampons"
              image-src="/img/menstruationsschwaemme_und_SoftTampons.png"
              link="menstruationsschwaemme-und-softtampons"
          />

          <CategoryCard
              title="Periodenunterwäsche"
              image-src="/img/periodenunterwaesche.png"
              link="periodenunterwaesche"
          />

          <CategoryCard
              title="Bio-Tampons"
              image-src="/img/tampon.png"
              link="bio-tampons"
          />

          <CategoryCard
              title="Bio-Binden"
              image-src="/img/binde.png"
              link="bio-binden"
          />

          <CategoryCard
              title="Wärmehelfer"
              image-src="/img/waermehelfer.png"
              link="waermehelfer"
          />

        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import CategoryCard from '@/components/CategoryCard.vue'
</script>
