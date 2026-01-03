<template>
  <main class="min-h-screen bg-[#fff7f3] px-4 py-10">
    <section class="mx-auto w-full max-w-3xl">
      <!-- Card -->
      <div class="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
        <div class="h-[4px] bg-[#e7b2a5]"></div>

        <div class="p-6 md:p-10">
          <p class="text-xs tracking-widest text-neutral-500 uppercase mb-2">Benutzerkonto</p>
          <h1 class="text-3xl md:text-4xl font-semibold text-neutral-900 mb-8">
            Dein Benutzerkonto
          </h1>

          <div class="grid gap-8 md:grid-cols-2">
            <!-- Profil -->
            <div>
              <h2 class="text-lg font-semibold mb-4">Dein Profil</h2>

              <dl class="space-y-3 text-sm">
                <div class="flex gap-2">
                  <dt class="w-28 text-neutral-500">E-Mail:</dt>
                  <dd class="text-neutral-900">{{ user.email }}</dd>
                </div>

                <div class="flex gap-2">
                  <dt class="w-28 text-neutral-500">Nachname:</dt>
                  <dd class="text-neutral-900">{{ user.lastName }}</dd>
                </div>

                <div class="flex gap-2">
                  <dt class="w-28 text-neutral-500">Vorname:</dt>
                  <dd class="text-neutral-900">{{ user.firstName }}</dd>
                </div>

                <div class="flex gap-2">
                  <dt class="w-28 text-neutral-500">Geburtstag:</dt>
                  <dd class="text-neutral-900">{{ user.birthDate }}</dd>
                </div>
              </dl>
            </div>

            <!-- Adresse -->
            <div>
              <h2 class="text-lg font-semibold mb-4">Adresse</h2>

              <div class="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed">
                <p class="text-neutral-900">{{ user.address.street }}</p>
                <p class="text-neutral-900">{{ user.address.zip }} {{ user.address.city }}</p>
                <p class="text-neutral-500 mt-2">{{ user.address.country }}</p>
              </div>
            </div>
          </div>

          <div class="mt-10 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
                type="button"
                class="rounded-full border border-neutral-300 px-5 py-2 text-sm hover:bg-neutral-50 transition"
                @click="logout"
            >
              Abmelden
            </button>

            <router-link
                to="/account/edit"
                class="rounded-full bg-[#e09a82] px-6 py-2 text-center text-sm font-medium text-white hover:bg-[#d48366] transition"
            >
              Dein Profil verwalten
            </router-link>
          </div>
        </div>

        <div class="h-[4px] bg-[#e7b2a5]"></div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive } from 'vue'

// 1) Erstmal Mock-Daten (damit UI steht)
// 2) Später ersetzt du das durch API-Call / Auth-User
const user = reactive({
  email: 'muster@muster.de',
  firstName: 'Laura',
  lastName: 'Muster',
  birthDate: '01.01.2000',
  address: {
    street: 'Musterstraße 2',
    zip: '88888',
    city: 'Musterdorf',
    country: 'Deutschland',
  },
})

const logout = () => {
  // später: Token löschen + redirect
  console.log('logout')
}
</script>
