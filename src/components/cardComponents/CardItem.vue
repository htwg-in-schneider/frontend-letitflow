<template>
  <div class="flex flex-col md:flex-row gap-6 p-4 rounded-3xl bg-[#fff4ea] border border-orange-100 items-center">
    <div class="w-28 h-28 bg-[#fff7f3] rounded-2xl border border-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
      <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-contain p-2" />
    </div>

    <div class="flex-1 text-center md:text-left">
      <h3 class="text-lg font-semibold text-gray-900">{{ item.title }}</h3>
      <p class="text-sm text-gray-500">{{ item.color }} | {{ item.size }}</p>
      
      <div class="mt-2 flex items-center justify-center md:justify-start gap-3">
        <label class="text-xs font-medium text-gray-600 uppercase">Menge</label>
        <select 
          v-model.number="item.quantity" 
          @change="$emit('update')"
          class="bg-white border border-[#f6b88c] rounded-xl px-3 py-1 text-sm outline-none"
        >
          <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col items-end gap-2">
      <p class="text-xl font-bold text-gray-900">
        {{ (item.price * item.quantity).toFixed(2) }} €
      </p>
      <button @click="$emit('remove', item.variantId)" class="text-xs text-red-400">
        ✕ Entfernen
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['item']);
defineEmits(['update', 'remove']);
</script>