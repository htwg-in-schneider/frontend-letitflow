<template>
  <div class="border rounded-md p-3 bg-[#fff7f3] border-[#f0c9b8]">
    <div class="flex items-center justify-between mb-2">
      <p class="text-xs font-semibold text-gray-700">
        Varianten
      </p>

      <button
        type="button"
        class="rounded-full px-3 py-1 text-xs font-medium text-white bg-[#e09a82]"
        @click="addVariant"
      >
        + Variante hinzufügen
      </button>
    </div>

    <p class="text-xs text-gray-600 mb-3">
      Mindestens eine Variante ist erforderlich.
    </p>

    <div class="flex flex-col gap-3">
      <div
        v-for="(v, idx) in modelValue"
        :key="idx"
        class="border border-[#f0c9b8] rounded-md bg-white p-3"
      >
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-700">
            Variante {{ idx + 1 }}
            <span v-if="idx === 0" class="text-gray-500 font-normal">(Pflicht)</span>
          </p>

          <button
            v-if="modelValue.length > 1 && idx !== 0"
            type="button"
            class="text-xs font-medium text-red-600 underline"
            @click="removeVariant(idx)"
          >
            Entfernen
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Größe</label>
            <input
              v-model="v.size"
              placeholder="z. B. S"
              class="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div>
            <label class="block text-xs text-gray-600 mb-1">Farbe</label>
            <input
              v-model="v.color"
              placeholder="z. B. Blau"
              class="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div>
            <label class="block text-xs text-gray-600 mb-1">Bestand</label>
            <input
              type="number"
              min="0"
              v-model.number="v.stock"
              class="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <div>
            <label class="block text-xs text-gray-600 mb-1">Preis (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              v-model.number="v.price"
              class="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" class="mt-2 text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, required: true },
  error: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue'])

function emptyVariant() {
  return { size: '', color: '', stock: 0, available: true, price: 0 }
}

function addVariant() {
  emit('update:modelValue', [...props.modelValue, emptyVariant()])
}

function removeVariant(index) {
  const next = props.modelValue.slice()
  next.splice(index, 1)
  emit('update:modelValue', next)
}
</script>
