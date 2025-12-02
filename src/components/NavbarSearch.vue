<template>
  <div class="relative">
    <button
        type="button"
        class="flex items-center justify-center rounded-full p-2 hover:bg-[#f5e0d8] transition"
        @click="toggle"
    >
      <img :src="lupeIcon" alt="Suche" class="h-5 w-5" />
    </button>

    <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-72 bg-white border border-orange-100 shadow-lg rounded-xl p-4 z-50"
    >


      <input
          v-model="query"
          type="text"
          placeholder="Suche..."
          class="w-full border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e09a82]"
      />

      <div class="mt-3 flex justify-end gap-2">
        <button
            type="button"
            class="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
            @click="close"
        >
          Schließen
        </button>

        <button
            type="button"
            class="text-xs px-3 py-1 rounded-full bg-[#e09a82] text-white font-medium hover:bg-[#d48366] transition"
        >
          Suchen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import lupeIcon from '@/assets/icons/lupe.png'

const isOpen = ref(false)
const query = ref('')

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
