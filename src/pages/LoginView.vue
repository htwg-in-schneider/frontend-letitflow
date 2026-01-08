<template>
  <div class="min-h-screen bg-[#fff7f3] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-[#e7b2a5]/30">
      <div>
        <h2 class="text-center text-3xl font-bold text-gray-800">
          Einloggen
        </h2>
        <p class="mt-2 text-center text-sm text-gray-500">
          Schön, dass du wieder da bist!
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1 ml-1">E-Mail</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              class="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e7b2a5] focus:border-transparent transition-all sm:text-sm"
              placeholder="deine@email.de"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1 ml-1">Passwort</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e7b2a5] focus:border-transparent transition-all sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-full text-white bg-[#d58d7d] hover:bg-[#c47c6d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d58d7d] transition-all shadow-md"
          >
            Einloggen
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogin = () => {
  // Simulierter Login: Einfach zur Benutzerseite weiterleiten
  router.push('/user')
}
</script>
