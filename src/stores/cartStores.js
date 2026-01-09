import { defineStore } from 'pinia'    // Falls du die API aufgeteilt hast

export const useCartStore = defineStore('cart', {
  state() {
    return {
      items: [],
      totalSum: 0,
      currentUserId: null // Hier speichern wir die ID dynamisch
    }
  },
  actions: {
    // Setzt den User (wird z.B. beim Login aufgerufen)
    setUserId(id) {
      this.currentUserId = id
    },

    async loadCart() {
      if (!this.currentUserId) return;
      try {
        const data = await cartApi.fetchByUserId(this.currentUserId)
        this.items = data.items
        this.totalSum = data.totalSum
      } catch (error) {
        console.error("Fehler beim Laden:", error)
      }
    },

    async addItemToCart(productId, variantId, quantity) {
      if (!this.currentUserId) {
        alert("Bitte logge dich zuerst ein!");
        return;
      }
      try {
        await cartApi.add(this.currentUserId, productId, variantId, quantity)
        await this.loadCart() 
      } catch (error) {
        console.error("Fehler beim Hinzufügen:", error)
      }
    }
  }
})