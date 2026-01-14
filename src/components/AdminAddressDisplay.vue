<template>
  <div class="space-y-3">
    <div
      v-for="addr in addresses"
      :key="addr.id"
      class="border border-orange-100 bg-white rounded-lg p-4 hover:shadow-md transition"
    >
      <div class="flex items-start justify-between mb-3">
        <p class="text-xs font-bold text-[#e09a82] uppercase tracking-wider">
          {{ addr.type === 'SHIPPING' ? 'Versandadresse' : 'Rechnungsadresse' }}
        </p>
      </div>
      <p class="font-semibold text-gray-800">{{ addr.firstName }} {{ addr.lastName }}</p>
      <p class="text-sm text-gray-600">{{ addr.street }} {{ addr.houseNumber }}</p>
      <p class="text-sm text-gray-600">{{ addr.zipCode }} {{ addr.city }}</p>
      <p class="text-sm text-gray-600">{{ addr.country }}</p>
      <p v-if="addr.phone" class="text-sm text-gray-600 mt-2">Tel: {{ addr.phone }}</p>
    </div>
    
    <div v-if="addresses.length === 0" class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
      Keine Adressen vorhanden.
    </div>
  </div>
</template>

<script setup>
defineProps({
  addresses: {
    type: Array,
    required: true
  }
})
</script>
