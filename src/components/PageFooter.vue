<template>
  <footer class="bg-[#FFF7F0] w-full">

    <!-- obere dicke Linie -->
    <div class="h-[4px] bg-[#e7b2a5]"></div>

    <div class="max-w-6xl mx-auto px-6 py-10 text-neutral-900">

      <div class="flex flex-col gap-10 md:flex-row md:justify-between">
        
        <!-- Logo -->
        <div class="flex flex-col gap-3 md:w-1/3">
          <img
            src="/img/hauptlogo_Footer.png"
            alt="LetItFlow Logo"
            class="h-40 w-50 object-contain"
          />
        </div>

        <!-- Spalten -->
        <div class="grid grid-cols-2 gap-8 md:grid-cols-3 flex-1">

          <!-- HILFETHEMEN -->
          <div>
            <h4 class="text-base font-semibold tracking-wide mb-2">HILFETHEMEN</h4>
            <ul class="space-y-1 text-sm">
              <li><a href="#" class="hover:text-rose-500">Alle Hilfethemen</a></li>
              <li><a href="#" class="hover:text-rose-500">Bezahlarten</a></li>
              <li><a href="#" class="hover:text-rose-500">Versandinformationen</a></li>
              <li><a href="#" class="hover:text-rose-500">Bestellung retournieren</a></li>
            </ul>
          </div>

          <!-- RECHTLICHES -->
          <div>
            <h4 class="text-base font-semibold tracking-wide mb-2">RECHTLICHES</h4>
            <ul class="space-y-1 text-sm">
              <li><a href="#" class="hover:text-rose-500">Datenschutz</a></li>
              <li><a href="#" class="hover:text-rose-500">Cookie-Richtlinie</a></li>
              <li><a href="#" class="hover:text-rose-500">Widerrufsrecht</a></li>
            </ul>
          </div>

          <!-- ÜBER UNS -->
          <div>
            <h4 class="text-base font-semibold tracking-wide mb-2">ÜBER UNS</h4>
            <ul class="space-y-1 text-sm">
              <li><a href="#" class="hover:text-rose-500">Unsere Geschichte</a></li>
              <li><a href="#" class="hover:text-rose-500">Kontakt</a></li>
              <li><a href="#" class="hover:text-rose-500">Impressum</a></li>
              <li><a href="#" class="hover:text-rose-500">AGB</a></li>
            </ul>
          </div>

        </div>
      </div>

    </div>

    <!-- mittlere dicke Linie -->
    <div class="w-full h-[4px] bg-[#e7b2a5]"></div>

    <div class="max-w-6xl mx-auto px-6">

      <!-- untere Textzeile (auch größer) -->
    <div class="flex flex-col items-center gap-2 text-xs text-neutral-700 mt-4 text-right">
        <p>© 2025 LetItFlow</p>
        <p>Ehrlich. Alltagstauglich. Einfach gut.</p>
      </div>

    </div>

  </footer>
</template>

<script setup>
</script>
