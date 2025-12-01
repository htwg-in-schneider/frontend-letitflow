<template>
  <header class="w-full bg-[#fff7f3]">
    <div class="h-[4px] bg-[#e7b2a5]"></div>

    <nav class="w-full flex items-center justify-between px-8 py-4 bg-[#fff7f3]">
      <router-link to="/" class="flex items-center gap-3">
        <img src="/img/hauptlogo_Header.png" alt="LetItFlow Logo" class="h-10 w-auto"/>
      </router-link>

      <div class="flex-1 flex justify-center">
        <span class="text-2xl font-semibold text-black">Produkte</span>
      </div>

      <div class="flex items-center gap-6 text-sm text-black">

        <button type="button" class="flex items-center justify-center">
          <img src="/img/benutzerIcon_Desktop.png" alt="Benutzer" class="h-8 w-8"/>
        </button>

        <router-link to="/cart" class="flex items-center justify-center">
          <img src="/img/warenkorb_icon.png" alt="Warenkorb" class="h-7 w-7"/>
        </router-link>
      </div>
    </nav>

    <div class="h-[4px] bg-[#e7b2a5]"></div>
  </header>
</template>

<script setup>
</script>
