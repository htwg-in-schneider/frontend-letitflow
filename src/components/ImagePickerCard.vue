<template>
  <div class="w-full md:w-[320px]">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileSelected"
    />

    <div
      class="w-full aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-md overflow-hidden border border-[#f0c9b8]"
    >
      <img
        v-if="modelValue"
        :src="modelValue"
        :alt="alt || 'Bild'"
        class="w-full h-full object-cover"
      />
      <div v-else class="text-xs text-gray-500 text-center px-4">
        Kein Bild vorhanden
      </div>
    </div>

    <div class="mt-3 flex gap-2">
      <button
        type="button"
        class="flex-1 rounded-full px-3 py-2 text-xs font-medium text-white bg-[#e09a82]"
        @click="triggerPicker"
      >
        Bild ändern
      </button>

      <button
        type="button"
        class="flex-1 rounded-full px-3 py-2 text-xs font-medium text-white bg-red-500 disabled:opacity-60"
        :disabled="!modelValue"
        @click="removeImage"
      >
        Bild löschen
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }, // v-model
  alt: { type: String, default: '' },
  confirmRemove: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)

function triggerPicker() {
  fileInput.value?.click()
}

function removeImage() {
  if (props.confirmRemove && !confirm('Bild wirklich löschen?')) return
  if (fileInput.value) fileInput.value.value = ''
  emit('update:modelValue', '')
}

function onFileSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => emit('update:modelValue', reader.result)
  reader.readAsDataURL(file)
}
</script>
