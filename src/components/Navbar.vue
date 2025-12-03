<template>
  <header class="w-full bg-[#fff7f3]">
    <div class="h-[4px] bg-[#e7b2a5]"></div>

    <nav class="w-full flex items-center justify-between px-8 py-4 bg-[#fff7f3]">

      <router-link to="/" class="flex items-center gap-3">
        <img src="/img/hauptlogo_Header.png" alt="LetItFlow Logo" class="h-10 w-auto" />
      </router-link>

      <div class="relative flex items-center ml-6">
        <button
            type="button"
            class="flex items-center gap-1 text-xl font-semibold text-black hover:text-[#e09a82] transition"
            @click="toggleCategories"
        >
          Produkte
          <span class="text-sm transition-transform" :class="isCategoriesOpen ? 'rotate-180' : ''">▼</span>
        </button>

        <div
            v-if="isCategoriesOpen"
            class="absolute left-0 top-full mt-2 w-72 bg-white border border-orange-200 shadow-lg rounded-xl py-2 z-50"
        >
          <p class="px-4 pb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            Produktkategorien
          </p>

          <router-link
              v-for="category in categories"
              :key="category.id"
              :to="`/category/${category.id}`"
              class="block px-4 py-2 text-sm text-gray-800 hover:bg-[#fff1eb] hover:text-[#e09a82] transition"
              @click="isCategoriesOpen = false"
          >
            {{ category.name }}
          </router-link>
        </div>
      </div>

      <div class="flex items-center gap-6 text-sm text-black">
        <NavbarSearch />

        <button type="button" class="flex items-center justify-center">
          <img src="/img/benutzerIcon_Desktop.png" alt="Benutzer" class="h-8 w-8" />
        </button>

        <router-link to="/cart" class="flex items-center justify-center">
          <img src="/img/warenkorb_icon.png" alt="Warenkorb" class="h-7 w-7" />
        </router-link>
      </div>
    </nav>

    <div class="h-[4px] bg-[#e7b2a5]"></div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import NavbarSearch from '@/components/NavbarSearch.vue'
import { productCategories } from '@/constants/productCategories.js'

const isCategoriesOpen = ref(false)

const toggleCategories = () => {
  isCategoriesOpen.value = !isCategoriesOpen.value
}

const categories = productCategories
</script>
