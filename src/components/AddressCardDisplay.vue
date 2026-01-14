<template>
  <div>
    <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <span class="w-8 h-8 bg-[#fff7f3] rounded-full flex items-center justify-center text-[#e09a82] text-sm">
        {{ title === 'Lieferadresse' ? '2' : '3' }}
      </span>
      {{ title }}
    </h2>
    <div class="bg-[#fff7f3]/30 border border-orange-100 p-6 rounded-2xl text-gray-700 leading-relaxed space-y-2">
      <p v-if="address" class="font-bold text-gray-900">
        {{ address.firstName }} {{ address.lastName }}
      </p>
      <p v-if="address">
        {{ address.street }} {{ address.housenumber }}
      </p>
      <p v-if="address">
        {{ address.postalCode }} {{ address.city }}
      </p>
      <p v-if="address">{{ address.country }}</p>
      <p v-if="!address" class="text-gray-500 italic">Keine {{ title.toLowerCase() }} verfügbar</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  address: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: 'Adresse'
  }
})
</script>
