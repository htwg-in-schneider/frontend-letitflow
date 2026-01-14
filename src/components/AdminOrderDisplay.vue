<template>
  <div class="space-y-3">
    <div
      v-for="order in orders"
      :key="order.id"
      class="border border-orange-100 bg-white rounded-lg p-4 hover:shadow-md transition"
    >
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div class="flex-1">
          <p class="font-semibold text-gray-800">
            Bestellung <span class="font-mono text-gray-500">#{{ order.id }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatDate(order.createdAt) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-600">
            <span class="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
              {{ order.items?.length || 0 }} Artikel
            </span>
          </p>
          <p class="font-semibold text-lg text-gray-800 mt-1">
            {{ formatPrice(order.totalAmount) }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="orders.length === 0" class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
      Keine Bestellungen vorhanden.
    </div>
  </div>
</template>

<script setup>
defineProps({
  orders: {
    type: Array,
    required: true
  }
})

function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}
</script>
