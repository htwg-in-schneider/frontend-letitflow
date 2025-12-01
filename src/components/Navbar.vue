<template>
  <nav class="w-full bg-white border-b border-orange-200 py-4 px-6 flex items-center justify-between">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <span class="text-[#e86f55] text-2xl font-bold">LetItFlow</span>
    </div>

    <!-- Navigation Links -->
    <div class="flex items-center gap-6 text-sm">
      <router-link
          to="/"
          class="text-gray-700 hover:text-gray-900 transition"
      >
        Startseite
      </router-link>

      <router-link
          to="/products"
          class="text-gray-700 hover:text-gray-900 transition"
      >
        Produkte
      </router-link>

      <router-link
          to="/cart"
          class="text-gray-700 hover:text-gray-900 transition"
      >
        Warenkorb
      </router-link>
    </div>
  </nav>
</template>

<script setup>
</script>
