<template>
  <footer class="bg-[#FFF7F0] w-full">
    <div class="h-[4px] bg-[#e7b2a5]"/>

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

        <div class="grid grid-cols-2 gap-8 md:grid-cols-3 flex-1">
          <div>
            <h4 class="text-base font-semibold tracking-wide mb-2">HILFETHEMEN</h4>
            <ul class="space-y-1 text-sm">
              <li>
                <RouterLink :to="{ name: 'PaymentMethods' }" class="hover:text-rose-500">
                  Bezahlarten
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'ShippingInfo' }" class="hover:text-rose-500">
                  Versandinformationen
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'Returns' }" class="hover:text-rose-500">
                  Bestellung retournieren
                </RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-base font-semibold tracking-wide mb-2">RECHTLICHES</h4>
            <ul class="space-y-1 text-sm">
              <li>
                <RouterLink :to="{ name: 'ImprintPage' }" class="hover:text-rose-500">
                  Impressum
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'TermsAndConditions' }" class="hover:text-rose-500">
                  AGB
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'PrivacyPolicy' }" class="hover:text-rose-500">
                  Datenschutzerklärung
                </RouterLink>
              </li>
            </ul>
            <p class="text-[10px] text-neutral-500 mt-4 leading-tight">
              Hinweis: Diese Website ist ein nicht-kommerzielles Hochschulprojekt.
            </p>
          </div>

          <div>
            <h4 class="text-base font-semibold tracking-wide mb-2">ÜBER UNS</h4>
            <ul class="space-y-1 text-sm">
              <li>
                <RouterLink :to="{ name: 'AboutUs' }" class="hover:text-rose-500">
                  Unsere Geschichte
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'Contact' }" class="hover:text-rose-500">
                  Kontakt
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full h-[4px] bg-[#e7b2a5]"/>

    <div class="max-w-6xl mx-auto px-6">
      <div class="flex flex-col items-center gap-2 text-xs text-neutral-700 mt-4 text-right pb-6">
        <p>© 2025 LetItFlow</p>
        <p>Ehrlich. Alltagstauglich. Einfach gut.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {RouterLink} from "vue-router";
</script>
