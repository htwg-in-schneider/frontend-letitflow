<template>
  <div class="space-y-6">
    <div class="bg-[#dcdcdc] border border-gray-500 p-5 rounded-sm shadow-sm">
      <div class="space-y-3">
        <div class="flex justify-between items-center text-gray-900 font-bold">
          <span>Zwischensumme</span>
          <span>{{ subtotal.toFixed(2) }} €</span>
        </div>
        <div class="flex justify-between items-center text-gray-900 font-bold">
          <span>Versandkosten</span>
          <span>{{ shipping.toFixed(2) }} €</span>
        </div>
        <div class="flex justify-between items-center text-gray-900 font-bold border-t border-gray-400 pt-3">
          <span>Gesamtsumme</span>
          <span>{{ (subtotal + shipping).toFixed(2) }} €</span>
        </div>
      </div>
    </div>
  </div>

   <div class="flex justify-center items-center mt-6 py-4">
  <button 
    @click="$emit('checkout')"
    class="w-full max-w-xs py-4 bg-[#e09a82] hover:bg-[#d48366] text-white font-semibold rounded-full transition shadow-md text-center"
  >
    {{ buttonText }}
  </button>
</div>
</template>

<script setup>
defineProps({
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    default: 6.00
  },
  buttonText: {
    type: String,
    default: 'Jetzt bestellen'
  }
});

defineEmits(['checkout']);
</script>