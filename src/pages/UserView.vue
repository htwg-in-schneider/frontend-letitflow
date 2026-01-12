<template>
  <div class="min-h-screen bg-[#fff7f3] pt-12 px-4 pb-20">
    <div class="max-w-md mx-auto">
      <h1 class="text-3xl font-bold text-center mb-12 text-gray-800">
        Dein Benutzerkonto
      </h1>

      <div class="bg-white p-8 rounded-3xl shadow-sm border border-[#e7b2a5]/30 space-y-10">
        <!-- Profil Sektion -->
        <div>
          <h2 class="text-xl font-bold mb-6 text-gray-900 border-b border-[#fff7f3] pb-2">Dein Profil</h2>

          <div class="space-y-4 text-[17px] text-gray-700">
            <div class="flex justify-between items-center border-b border-gray-50 pb-2">
              <span class="font-medium text-gray-500">E-Mail</span>
              <span class="font-semibold text-gray-800">{{ user?.email }}</span>
            </div>
            <div v-if="user?.given_name" class="flex justify-between items-center border-b border-gray-50 pb-2">
              <span class="font-medium text-gray-500">Vorname</span>
              <span class="font-semibold text-gray-800">{{ user.given_name }}</span>
            </div>
            <div v-if="user?.family_name" class="flex justify-between items-center border-b border-gray-50 pb-2">
              <span class="font-medium text-gray-500">Nachname</span>
              <span class="font-semibold text-gray-800">{{ user.family_name }}</span>
            </div>
            <div v-if="user?.nickname" class="flex justify-between items-center border-b border-gray-50 pb-2">
              <span class="font-medium text-gray-500">Nickname</span>
              <span class="font-semibold text-gray-800">{{ user.nickname }}</span>
            </div>
          </div>
        </div>

        <!-- Adresse Sektion -->
        <div>
          <h2 class="text-xl font-bold mb-4 text-gray-900 border-b border-[#fff7f3] pb-2">Adresse</h2>
          <div class="bg-[#fff7f3]/50 p-4 rounded-2xl text-[17px] text-gray-700 leading-relaxed">
            <p class="font-semibold text-gray-800">Musterstraße 2</p>
            <p class="font-semibold text-gray-800">88888 Musterdorf</p>
          </div>
        </div>
      </div>

      <!-- Button -->
      <div class="mt-12 flex justify-center">
        <button class="bg-[#d58d7d] text-white px-12 py-3 rounded-full shadow-md hover:bg-[#c47c6d] transition-all font-semibold text-lg">
          Profil verwalten
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
const { user } = useAuth0()
</script>
