<template>
  <div class="flex flex-col gap-3">
    <!-- Titel -->
    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">
        Produkttitel
      </label>
      <input
        :value="modelValue.title"
        @input="patch({ title: $event.target.value })"
        class="w-full border rounded px-2 py-1 text-base font-semibold"
      />
    </div>

    <!-- Beschreibung -->
    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">
        Beschreibung
      </label>
      <textarea
        :value="modelValue.description"
        @input="patch({ description: $event.target.value })"
        rows="4"
        class="w-full border rounded px-2 py-1 text-sm"
      />
    </div>

    <!-- Toggle -->
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-medium text-white bg-[#e09a82]"
      @click="open = !open"
    >
      {{ open ? 'Weitere Infos ausblenden' : 'Weitere Infos hinzufügen' }}
    </button>

    <!-- Extra Infos -->
    <div v-if="open" class="border rounded-md p-3 bg-[#fff7f3] border-[#f0c9b8]">
      <p class="text-xs font-semibold text-gray-700 mb-2">
        Weitere Infos
      </p>

      <div class="grid gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Materialhinweise (Infotext 1)
          </label>
          <textarea
            :value="modelValue.infotext1"
            @input="patch({ infotext1: $event.target.value })"
            rows="2"
            class="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Anwendungshinweise (Infotext 2)
          </label>
          <textarea
            :value="modelValue.infotext2"
            @input="patch({ infotext2: $event.target.value })"
            rows="2"
            class="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Pflegehinweise (Infotext 3)
          </label>
          <textarea
            :value="modelValue.infotext3"
            @input="patch({ infotext3: $event.target.value })"
            rows="2"
            class="w-full border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  autoOpenIfHasInfo: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])
const open = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (!props.autoOpenIfHasInfo || open.value) return
    const hasInfo = !!(val?.infotext1 || val?.infotext2 || val?.infotext3)
    if (hasInfo) open.value = true
  },
  { immediate: true, deep: true }
)

function patch(partial) {
  emit('update:modelValue', { ...props.modelValue, ...partial })
}
</script>
