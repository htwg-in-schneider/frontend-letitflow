<template>
  <main class="min-h-screen bg-[#fff7f3] flex justify-center px-4 py-10">
    <section class="w-full max-w-4xl bg-white border border-orange-100 shadow-sm rounded-xl px-6 py-10">
      <p class="text-sm text-gray-500 uppercase tracking-wide">
        Produkte
      </p>
      <h1 class="mt-2 text-3xl font-semibold text-gray-900">
        LetItFlow
      </h1>

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

      <!-- Button, verlinkt zur About-Page -->
      <div class="mt-8">
        <router-link
            to="/about"
            class="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white bg-[#e09a82] hover:bg-[#d48366] transition"
        >
          Erfahre mehr über uns hier
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
</script>
