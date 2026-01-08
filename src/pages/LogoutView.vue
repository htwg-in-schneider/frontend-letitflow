<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4 py-12 text-center">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <div class="space-y-4">
        <div class="text-green-500 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900">
          Du bist ausgeloggt
        </h2>
        <p class="text-gray-600">
          Vielen Dank für deinen Besuch! Du wurdest erfolgreich abgemeldet.
        </p>
      </div>
      <div class="pt-6">
        <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Zur Startseite
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// UI only - No logic yet
</script>
