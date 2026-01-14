<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Varianten</h2>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        class="border border-dashed border-[#f0c9b8] bg-white rounded-md shadow-sm flex flex-col overflow-hidden"
      >
        <div class="p-4 flex flex-col gap-3">
          <p class="text-sm font-semibold text-gray-800">Neue Variante</p>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-gray-600 mb-1">Größe</label>
              <input
                v-model="draft.size"
                class="border rounded px-2 py-1 text-sm w-full"
              />
            </div>

            <div>
              <label class="block text-xs text-gray-600 mb-1">Farbe</label>
              <input
                v-model="draft.color"
                class="border rounded px-2 py-1 text-sm w-full"
              />
            </div>

            <div>
              <label class="block text-xs text-gray-600 mb-1">Bestand</label>
              <input
                type="number"
                min="0"
                v-model.number="draft.stock"
                class="border rounded px-2 py-1 text-sm w-full"
              />
            </div>

            <div>
              <label class="block text-xs text-gray-600 mb-1">Preis (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                v-model.number="draft.price"
                class="border rounded px-2 py-1 text-sm w-full"
              />
            </div>
          </div>

          <p v-if="localError" class="text-xs text-red-600">
            {{ localError }}
          </p>

          <button
            type="button"
            class="rounded-full px-4 py-2 text-xs font-medium text-white bg-[#e09a82]"
            @click="handleCreate"
          >
            Variante anlegen
          </button>
        </div>
      </div>

      <div
        v-for="v in variants"
        :key="v.id"
        class="border border-[#f0c9b8] bg-white rounded-md shadow-sm flex flex-col overflow-hidden"
      >

        <div class="p-4 border-b border-[#f0c9b8] bg-[#fff7f3] flex justify-between items-start">
          <div>
            <p class="text-xs text-gray-500">
              Varianten-ID: <span class="font-mono">{{ v.id }}</span>
            </p>
            <p class="text-sm font-semibold text-gray-800 mt-1">
              {{ v.size || '—' }} / {{ v.color || '—' }}
            </p>
          </div>

          <span
            class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="badgeClass(v)"
          >
            {{ badgeLabel(v) }}
          </span>
        </div>

        <div class="p-4 flex flex-col gap-3">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-gray-600 mb-1">Größe</label>
              <input v-model="v.size" class="border rounded px-2 py-1 text-sm w-full" />
            </div>

            <div>
              <label class="block text-xs text-gray-600 mb-1">Farbe</label>
              <input v-model="v.color" class="border rounded px-2 py-1 text-sm w-full" />
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

          <div class="mt-2 flex justify-between gap-2">
            <button
              class="rounded-full px-3 py-1 text-xs font-medium text-white bg-[#e09a82] disabled:opacity-60"
              :disabled="busy"
              @click="$emit('save', normalizeVariant(v))"
            >
              {{ busy ? 'Speichere...' : 'Speichern' }}
            </button>

            <button
              class="rounded-full px-3 py-1 text-xs font-medium text-white bg-red-500 disabled:opacity-60"
              :disabled="busy"
              @click="handleDelete(v.id)"
            >
              Löschen
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="variants.length === 0"
        class="col-span-full text-center text-gray-500 text-sm"
      >
        Noch keine Varianten vorhanden.
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

defineProps({
  variants: { type: Array, default: () => [] },
  busy: { type: Boolean, default: false }
})

const emit = defineEmits(['create', 'save', 'delete'])

const localError = ref(null)

const draft = reactive({
  size: '',
  color: '',
  stock: 0,
  price: 0
})

function validate() {
  if (draft.stock < 0) return 'Bestand darf nicht negativ sein.'
  if (draft.price < 0) return 'Preis darf nicht negativ sein.'
  return null
}

function handleCreate() {
  localError.value = validate()
  if (localError.value) return

  emit('create', {
    size: draft.size,
    color: draft.color,
    stock: Number(draft.stock),
    price: Number(draft.price),
    available: draft.stock > 0
  })

  draft.size = ''
  draft.color = ''
  draft.stock = 0
  draft.price = 0
}

function normalizeVariant(v) {
  return {
    ...v,
    available: v.stock > 0
  }
}

function handleDelete(id) {
  if (!confirm('Variante wirklich löschen?')) return
  emit('delete', id)
}

function badgeLabel(v) {
  if (v.stock === 0) return 'Ausverkauft'
  return 'Live'
}

function badgeClass(v) {
  if (v.stock === 0) {
    return 'bg-red-100 text-red-700 border border-red-300'
  }
  return 'bg-green-100 text-green-700 border border-green-300'
}
</script>
