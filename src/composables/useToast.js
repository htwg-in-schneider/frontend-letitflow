import { ref } from 'vue'

const toastComponent = ref(null)

export function useToast() {
  const show = (message, type = 'info', duration = 3000) => {
    if (!toastComponent.value) {
      console.warn('Toast component not initialized')
      return
    }
    return toastComponent.value.showToast(message, type, duration)
  }

  const success = (message, duration = 3000) => show(message, 'success', duration)
  const error = (message, duration = 3000) => show(message, 'error', duration)
  const warning = (message, duration = 3000) => show(message, 'warning', duration)
  const info = (message, duration = 3000) => show(message, 'info', duration)

  return { show, success, error, warning, info, setComponent: (comp) => (toastComponent.value = comp) }
}
