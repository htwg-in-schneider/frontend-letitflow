<template>
  <div class="min-h-screen bg-[#fff7f3] flex items-center justify-center px-4 py-12 text-center">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-[#e7b2a5]/30">
      <div class="space-y-6">
        <div class="text-[#d58d7d] flex justify-center">
          <div class="bg-[#fff7f3] p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <div class="space-y-2">
          <h2 class="text-3xl font-bold text-gray-800">
            Du bist ausgeloggt
          </h2>
          <p class="text-gray-500">
            Vielen Dank für deinen Besuch! Du wurdest erfolgreich abgemeldet.
          </p>
        </div>
      </div>
      <div class="pt-6">
        <router-link
            to="/"
            class="inline-flex items-center px-10 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-[#d58d7d] hover:bg-[#c47c6d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d58d7d] transition-all shadow-md"
        >
          Zur Startseite
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>
