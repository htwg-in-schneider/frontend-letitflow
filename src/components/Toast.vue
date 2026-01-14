<template>
  <div class="fixed top-6 right-6 z-50 space-y-2 pointer-events-none">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto"
      >
        <div
          class="rounded-lg shadow-lg px-6 py-4 flex items-center gap-3 min-w-80 max-w-md animate-in fade-in slide-in-from-right-4"
          :class="toastClasses(toast.type)"
        >
          <div class="text-xl" :class="toastIcon(toast.type)">
            {{ toastEmoji(toast.type) }}
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="text-xs opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

const toastClasses = (type) => {
  const baseClasses = 'text-sm font-medium'
  const typeClasses = {
    success: 'bg-green-50 text-green-900 border border-green-200',
    error: 'bg-red-50 text-red-900 border border-red-200',
    warning: 'bg-orange-50 text-orange-900 border border-orange-200',
    info: 'bg-blue-50 text-blue-900 border border-blue-200'
  }
  return `${baseClasses} ${typeClasses[type] || typeClasses.info}`
}

const toastEmoji = (type) => {
  const emojis = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return emojis[type] || emojis.info
}

const toastIcon = (type) => {
  const icons = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-orange-600',
    info: 'text-blue-600'
  }
  return icons[type] || icons.info
}

const showToast = (message, type = 'info', duration = 3000) => {
  const id = nextId++
  const toast = { id, message, type }
  toasts.value.push(toast)

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }

  return id
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Expose functions für globale Verwendung
defineExpose({
  showToast,
  removeToast
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
