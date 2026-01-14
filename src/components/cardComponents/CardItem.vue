<template>
  <div
      class="flex flex-col md:flex-row gap-6 p-4 rounded-3xl bg-[#fff4ea] border border-orange-100 items-start md:items-center md:justify-between">
    <div class="flex gap-6 items-start md:items-center flex-1">
      <div v-if="showImage"
           class="w-28 h-28 bg-[#fff7f3] rounded-2xl border border-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img :src="displayItem.imageUrl" :alt="displayItem.title" class="w-full h-full object-contain p-2"/>
      </div>

      <div class="flex-1 text-center md:text-left">
        <h3 class="text-lg font-semibold text-gray-900">{{ displayItem.title }}</h3>
        <p class="text-sm text-gray-500">{{ displayItem.color }}<span
            v-if="displayItem.color && displayItem.size"> | </span>{{ displayItem.size }}</p>

        <div v-if="showActions" class="mt-2 flex items-center justify-center md:justify-start gap-3">
          <label class="text-xs font-medium text-gray-600 uppercase">Menge</label>
          <select
              :value="displayItem.quantity"
              @change="onQuantityChange($event)"
              class="bg-white border border-[#f6b88c] rounded-xl px-3 py-1 text-sm outline-none cursor-pointer hover:border-orange-400 transition-colors"
          >
            <option v-for="n in maxQuantity" :key="n" :value="n">{{ n }}</option>
          </select>
          <span v-if="availableStock !== null && availableStock <= 5" class="text-xs text-orange-600 font-medium">
            Nur noch {{ availableStock }} verfügbar
          </span>
        </div>
        <p v-else class="mt-2 text-sm text-gray-600">Menge: <span class="font-semibold">{{
            displayItem.quantity
          }}</span></p>
      </div>
    </div>

    <div class="flex flex-col items-center md:items-end gap-2 flex-shrink-0">
      <p class="text-xl font-bold text-gray-900">
        {{
          formatPrice(displayItem.totalPrice ?? (safeNumber(displayItem.price ?? displayItem.pricePerUnit) * (displayItem.quantity || 1)))
        }}
      </p>
      <button
          v-if="showActions"
          @click="onRemove()"
          class="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
      >
        <span>✕</span> Entfernen
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, onMounted, computed} from 'vue'
import {fetchProductById, fetchVariantById} from '@/services/api'

const props = defineProps({
  item: {type: Object, required: true},
  showActions: {type: Boolean, default: true},
  quantityOptionsMax: {type: Number, default: 10},
  emitItemOnRemove: {type: Boolean, default: false},
  showImage: {type: Boolean, default: true}
});

const emit = defineEmits(['update', 'remove']);

const displayItem = ref({...props.item})
const availableStock = ref(null)

const maxQuantity = computed(() => {
  if (availableStock.value !== null && availableStock.value >= 0) {
    return Math.min(availableStock.value, props.quantityOptionsMax)
  }
  return props.quantityOptionsMax
})


const safeNumber = (val) => {
  const n = Number(val)
  return Number.isFinite(n) ? n : 0
}

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})
}

const enrich = async () => {
  const item = displayItem.value
  try {
    if ((!item.title || item.title === 'Produkt') && item.productId) {
      const product = await fetchProductById(item.productId)
      item.title = product?.title || product?.name || item.title || 'Produkt'
    }
  } catch (e) {
    console.warn('Produkt konnte nicht geladen werden:', e)
  }

  try {
    if ((!
        item.color || !item.size || !item.imageUrl || item.pricePerUnit == null) && item.variantId) {
      const variant = await fetchVariantById(item.variantId)
      item.color = variant?.color ?? item.color
      item.size = variant?.size ?? item.size
      item.imageUrl = variant?.imageUrl ?? item.imageUrl
      if (item.pricePerUnit == null && variant?.price != null) item.pricePerUnit = variant.price

      if (variant?.stock != null) {
        availableStock.value = variant.stock
      }
    }
  } catch (e) {
    console.warn('Variante konnte nicht geladen werden:', e)
  }
}

watch(() => props.item, (val) => {
  displayItem.value = {...val}
  enrich()
}, {deep: true})

onMounted(enrich)

const onQuantityChange = (event) => {
  const newQuantity = Number.parseInt(event.target.value)
  emit('update', {variantId: displayItem.value.variantId, quantity: newQuantity})
}

const onRemove = () => {
  if (props.emitItemOnRemove) {
    emit('remove', displayItem.value)
  } else {
    emit('remove', displayItem.value.variantId)
  }
}
</script>