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
      <div class="mt-8">
        <button
          @click="loginWithRedirect()"
          class="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-full text-white bg-[#d58d7d] hover:bg-[#c47c6d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d58d7d] transition-all shadow-md"
        >
          Jetzt Einloggen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect } = useAuth0()
</script>
